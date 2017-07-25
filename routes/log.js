var express = require('express');
var router = express.Router();
var url = require('url');

// logger route
router.use(function (req, res, next) {
  // console.log(req.method + ": " + JSON.stringify(req.body));

  let enableCors = true;
  if (enableCors) {
    if (req.get('origin')) {
      var parsedUrl = url.parse(req.get('origin')) || {};
      res.header('Access-Control-Allow-Origin', parsedUrl.protocol + '//' + parsedUrl.host);
    } else {
      res.header('Access-Control-Allow-Origin', '*');
    }

    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  }

  if (req.method.toLowerCase === 'options') {
    return res.status(200).send();
  }

  try {
    handleRequest(req, defaultLogger);
    res.status(200).send();
  } catch (err) {
    console.error(err.stack || err.toString());
    res.status(500).send();
  }
});

function extend(dest, src, over) {

  if (over === undefined) {
    over = true;
  }

  dest = dest || {};
  src = src || {};

  for (var key in src) {
    if (src.hasOwnProperty(key)) {
      if (over || !dest.hasOwnProperty(key)) {
        dest[key] = src[key];
      }
    }
  }

  return dest;
}

var defaultLogger = {
  log: function (req, level, name, payload) {
    var date = payload.timestamp ? new Date(payload.timestamp).toString() : new Date().toString();
    if (name === 'heartbeat') {
      console.log("[heartbeat]");
    } else {
      var str = [
        name, '\t[ ', date, ' ]\n',
        Object.keys(payload).map(function (key) {
          return '\t' + key + ': ' + payload[key];
        }).join('\n'), '\n'
      ].join('');

      console[level].call(console, str);
    }
  },

  track: function (req, tracking) {
    return;
    console.log('[track]\n', Object.keys(tracking).map(function (key) {
      return '\t' + key + ': ' + tracking[key];
    }).join('\n'), '\n')
  },

  meta: function (req, meta) {
    return;
    console.log('[meta]\n', Object.keys(meta).map(function (key) {
      return '\t' + key + ': ' + meta[key];
    }).join('\n'), '\n')
  }
}



function log(req, logger, logs) {

  var events = logs.events || [];
  var meta = logs.meta || {};
  var tracking = logs.tracking || {};

  if (Array.isArray(events)) {
    events.forEach(function (event) {

      if (!event.event) {
        return;
      }

      event.level = event.level || 'info';
      event.payload = event.payload || {};

      var _log = logger instanceof Function ? logger : logger.log;

      if (_log instanceof Function) {
        return _log(req, event.level, event.event, event.payload);
      }

      var _logLevel = logger[event.level];

      if (_logLevel instanceof Function) {
        return _logLevel(req, event.event, event.payload);
      }

      defaultLogger.log(req, event.level, event.event, event.payload);
    });
  }

  if (logger.meta) {
    logger.meta(req, meta);
  }

  if (logger.track) {
    logger.track(req, tracking);
  }
};

function handleRequest(req, logger) {

  var method = req.method || 'get';
  var query = req.body || {};
  var body = req.body || {};

  if (method.toLowerCase() === 'post') {
    return log(req, logger, body);
  } else {

    var event = query.event;
    var level = query.level || 'info';
    var state = query.state;

    var payload = extend({}, query);

    delete payload.event;
    delete payload.level;
    delete payload.state;

    return log(req, logger, {
      events: [{
        level: level,
        event: event,
        payload: payload
      }],
      meta: {
        state: state
      }
    });
  }
}

module.exports = router;
