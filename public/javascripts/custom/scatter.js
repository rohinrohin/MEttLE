/*!
 * Scatter Plot API Scripts
 * Originally written by Rohin Gopalakrishnan (rohinrohin@gmail.com)
 *
 * This file contains graph api's and some helpers written to work
 * with scriptjs.
 * See scriptjs for array calculation logic. This is only an API.
 *
 * Licensed as per Mettle Guidelines
 */


// helper function to get page width
function getWidth() {
  if (self.innerWidth) {
    return self.innerWidth;
  }

  if (document.documentElement && document.documentElement.clientWidth) {
    return document.documentElement.clientWidth;
  }

  if (document.body) {
    return document.body.clientWidth;
  }
}

// helper function to get page height
function getHeight() {
  if (self.innerHeight) {
    return self.innerHeight;
  }

  if (document.documentElement && document.documentElement.clientHeight) {
    return document.documentElement.clientHeight;
  }

  if (document.body) {
    return document.body.clientHeight;
  }
}

// resize event listener on graph to redraw
window.addEventListener('resize', plotAll, true);

// plots all the graph based on the current array values in scriptjs
function plotAll() {
  d3.select("#scatter-macro-1 svg").remove()
  d3.select("#scatter-macro-2 svg").remove()
  d3.select("#scatter-micro-1 svg").remove()
  d3.select("#scatter-micro-2 svg").remove()
  doPlot("scatter-macro-1", voltageArr, "Voltage", maxLinearVelocityArr, "Max. Linear Velocity");
  doPlot("scatter-macro-2", currentArr, "Current", accelerationArr, "Acceleration");
  doPlot("scatter-micro-1", voltageArr, "Voltage", maxAngularVelocityArr, "Max. Angular Velocity");
  doPlot("scatter-micro-2", currentArr, "Current", torqueArr, "Torque");
}

// plot single graph based on parameters passed
function doPlot(id, xArr, xLabel, yArr, yLabel) {

  var margin = { top: 10, right: 10, bottom: 50, left: 50 },
    // outerWidth = 350,
    // outerHeight = 300,
    outerWidth = getWidth() / 5,
    outerHeight = getHeight() / 3,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom;

  var x = d3.scale.linear()
    .range([0, width]).nice();

  var y = d3.scale.linear()
    .range([height, 0]).nice();

  // var xLabel = "Voltage",
  //   yLabel = "Current",
  //   colorCat = "Manufacturer";

  // d3.csv("http://rohin.me/dev/mettletest/cerial.csv", function(data) {
  // data.forEach(function(d) {
  //   d.Voltage = +d.Voltage;
  //   d.Current = +d.Current;
  // });

  data = [];

  if (xArr.length == 0 || yArr.length == 0) {
    data.push([0, 0]);
  } else {
    data = xArr.map(function (_, i) {
      return [xArr[i], yArr[i], i];
    });
  }

  dataLength = data.length
  // data = [];
  // data.push([1, 1]);
  // data.push([2, 2]);
  // data.push([3, 3]);
  // data.push([4, 4]);
  // data.push([5, 5]);
  // console.log(data);

  let xMax = d3.max(data, function (d) { return d[0]; }) * 1.05;
  let xMin = d3.min(data, function (d) { return d[0]; });

  let yMax = d3.max(data, function (d) { return d[1]; }) * 1.05;
  let yMin = d3.min(data, function (d) { return d[1]; });

  yMin = yMin > 0 ? 0 : yMin;
  xMin = xMin > 0 ? 0 : xMin,

  x.domain([xMin, xMax]);
  y.domain([yMin, yMax]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(-height);

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickSize(-width);

  var color = d3.scale.category10();

  var tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html(function (d) {
      $log('graph', 'hover', {
        id: xLabel +" vs " + yLabel,
        values: "(" + d[0] + "," + d[0] + ")"
      })
      return xLabel + ": " + d[0] + "<br>" + yLabel + ": " + d[1];
    });

  var zoomBeh = d3.behavior.zoom()
    .x(x)
    .y(y)
    .scaleExtent([0, 500])
    .on("zoom", zoom);

  var svg = d3.select("#" + id)
    .append("svg")
    .attr("width", outerWidth)
    .attr("height", outerHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoomBeh);

  svg.call(tip);

  svg.append("rect")
    .attr("width", width)
    .attr("height", height);

  svg.append("g")
    .classed("x axis", true)
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .classed("label", true)
    .attr("x", width)
    .attr("y", margin.bottom - 10)
    .style("text-anchor", "end")
    .text(xLabel).style("font-size", 20).style("font-weight", "600");

  svg.append("g")
    .classed("y axis", true)
    .call(yAxis)
    .append("text")
    .classed("label", true)
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text(yLabel).style("font-size", 20).style("font-weight", "600");;

  var objects = svg.append("svg")
    .classed("objects", true)
    .attr("width", width)
    .attr("height", height);

  objects.append("svg:line")
    .classed("axisLine hAxisLine", true)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", width)
    .attr("y2", 0)
    .attr("transform", "translate(0," + height + ")");

  objects.append("svg:line")
    .classed("axisLine vAxisLine", true)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", height);

  objects.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .classed("dot", true)
    .attr("r", function (d) { /*console.log(d);*/ return 4; /*Math.sqrt(d[rCat] / Math.PI);*/ })
    .attr("transform", transform)
    .style("fill",
    function (d) {
      if (d[2] == dataLength - 1) {
        return "#FFC107"
      } else {
        // console.log("MotorID" + motorIDArr[d[2]]);
        var motorID = motorIDArr[d[2]];
        return motorSpecs[motorID ? motorID : 0][4];
        // TODO:very hacky
      }
    })
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide);

  var legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter().append("g")
    .classed("legend", true)
    .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("circle")
    .attr("r", 3.5)
    .attr("cx", width + 20)
    .attr("fill", color);

  legend.append("text")
    .attr("x", width + 26)
    .attr("dy", ".35em")
    .text(function (d) { return d; });

  // d3.select("input").on("click", change);

  // function change() {
  //   // xLabel = "Carbs";
  //   xMax = d3.max(data, function(d) { return d[xLabel]; });
  //   xMin = d3.min(data, function(d) { return d[xLabel]; });
  //   yMax = d3.max(data, function(d) { return d[yLabel]; });
  //   yMin = d3.min(data, function(d) { return d[yLabel]; });

  //   zoomBeh.x(x.domain([xMin, xMax])).y(y.domain([yMin, yMax]));

  //   var svg = d3.select("#scatter").transition();

  //   svg.select(".x.axis").duration(750).call(xAxis).select(".label").text(xLabel);

  //   objects.selectAll(".dot").transition().duration(1000).attr("transform", transform);
  // }

  // hanldes zoom event on graph
  function zoom() {
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);

    svg.selectAll(".dot")
      .attr("transform", transform);
  }

  function transform(d) {
    return "translate(" + x(d[0]) + "," + y(d[1]) + ")";
  }
  // });
}
