var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    timestamp: {type: Schema.Types.Date, required: true},
    level: {type: String, required: true},
    message: {type: String, required: true},
    meta: {type: Schema.Types.Mixed, required: true},
});

module.exports = mongoose.model('Log', schema);
