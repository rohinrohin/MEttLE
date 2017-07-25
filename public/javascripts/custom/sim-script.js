/*!
 * Simulator Script
 * Originally written by Rohin Gopalakrishnan (rohinrohin@gmail.com)
 *
 * This js file handles the following elements of the simulation page.
 *  - 1. Simulation related event (GSAP, Toggles, Sliders)
 *  - 2. Graph client only
 *
 * for graph api check scatterjs file
 *
 * Licensed as per Mettle Guidelines
 */

/*! ***********************
 *  1. SIMULATION
 *   - GSAP, Toggle, Helpers
 * *************************/

// ****** GLOBALS *********

var motionPath = [{ 'x': 43.878274690429684, 'y': -126.15480948964844 },
{ 'x': 74.60100102376302, 'y': -126.15480948964844 },
{ 'x': 105.32372735709635, 'y': -126.15480948964844 },
{ 'x': 136.04645369042967, 'y': -126.15480948964844 },
{ 'x': 153.13699469042967, 'y': -126.15480948964844 },
{ 'x': 166.89580569042968, 'y': -112.39599838964844 },
{ 'x': 166.89580569042968, 'y': -95.30545738964844 },
{ 'x': 166.89580569042968, 'y': -13.966063056315093 },
{ 'x': 166.89580569042968, 'y': 67.37333127701825 },
{ 'x': 166.89580569042968, 'y': 148.71272561035158 },
{ 'x': 166.89580569042968, 'y': 165.80326561035156 },
{ 'x': 153.13699469042967, 'y': 179.5620756103516 },
{ 'x': 136.0464536904297, 'y': 179.5620756103516 },
{ 'x': 105.32372735709636, 'y': 179.5620756103516 },
{ 'x': 74.60100102376302, 'y': 179.5620756103516 },
{ 'x': 43.87827469042969, 'y': 179.5620756103516 },
{ 'x': 26.78773369042969, 'y': 179.5620756103516 },
{ 'x': 13.028922690429695, 'y': 165.80326561035162 },
{ 'x': 13.028922690429695, 'y': 148.71272561035158 },
{ 'x': 13.028922690429695, 'y': 74.64619761035158 },
{ 'x': 13.028922690429695, 'y': 0.5796696103515728 },
{ 'x': 13.028922690429695, 'y': -73.48685838964843 },
{ 'x': 13.028922690429695, 'y': -80.75972472298177 },
{ 'x': 13.028922690429695, 'y': -88.03259105631511 },
{ 'x': 13.028922690429695, 'y': -95.30545738964844 },
{ 'x': 13.028922690429695, 'y': -112.39599838964844 },
{ 'x': 26.787733690429697, 'y': -126.15480948964844 },
{ 'x': 43.87827469042969, 'y': -126.15480948964844 }
];
console.log(motionPath);

// Get this from - http://codepen.io/rohinrohin/pen/JNegKL?editors=1111 for a new path

var car = document.getElementById('car');
var motor = document.getElementById('motor');
var rotater = document.getElementById('rotater');
var rotaterShaft = document.getElementById('rotator-shaft');
var carTrackPath = document.getElementById('car-track-path');

var timeline = false;
var microViewEnabled = false;
var graphViewEnabled = false;
var microGraphViewEnabled = false;

var pathTime = null;
var repeat = false;
var isTimelinePlaying = false;
var isHideCarChecked = false;

var currCarState = { speed: 0, distance: 0 };

// Ranges
var maxVoltage = 40;
var maxCurrent = 45;
var minVoltage = 12;
var minCurrent = 25;

// ****** Stage Switching Logic

let motorGroup = document.querySelector(".motor-group");
let varyCurrent = document.getElementById("vary-current");
let varyCurrentVoltage = document.getElementById("vary-current-voltage");
let varyCurrentVoltageMotor = document.getElementById("vary-current-voltage-motor");


// Stage switching functionality handling
// - Stage 1: current
// - Stage 2: voltage
// - Stage 3: both
function stageHandler(stage, state) {
  switch (stage) {
    case 2:
      if (state === 'on') {
        document.querySelector("#speed-slider2.noUi-target").classList.add("quick-flash");
        document.getElementById("speed-slider-inner2").style.opacity = "1";

      } else {
        document.querySelector("#speed-slider2.noUi-target").classList.remove("quick-flash");
        document.getElementById("speed-slider-inner2").style.opacity = "0.3";
      }
      break;

    case 3:
      if (state === 'on') {
        motorGroup.classList.add("quick-flash");
        motorGroup.style.pointerEvents = "all";
      } else {
        motorGroup.classList.remove("quick-flash");
        motorGroup.style.pointerEvents = "none";
        motorGroup.style.opacity = "0.3";
      }
      break;

    default:
      console.log("not found. ");
  }
}

// Event listeners for stage switching
document.getElementById("vary-current").addEventListener('click', (event) => {
  $clog({ id: "vary-current btn" });

  varyCurrent.setAttribute('disabled', true);
  varyCurrentVoltage.removeAttribute('disabled');
  varyCurrentVoltageMotor.removeAttribute('disabled');
  voltageSlider.setAttribute('disabled', true);

  stageHandler(2, 'off');
  stageHandler(3, 'off');
});

document.getElementById("vary-current-voltage").addEventListener('click', (event) => {
  $clog({ id: "vary-current-voltage btn" });

  varyCurrent.removeAttribute('disabled');
  varyCurrentVoltage.setAttribute('disabled', true);
  varyCurrentVoltageMotor.removeAttribute('disabled');
  voltageSlider.removeAttribute('disabled');

  stageHandler(3, 'off');
  stageHandler(2, 'on');
});

document.getElementById("vary-current-voltage-motor").addEventListener('click', (event) => {
  $clog({ id: "vary-current-voltage-motor btn" });
  varyCurrent.removeAttribute('disabled');
  varyCurrentVoltage.removeAttribute('disabled');
  varyCurrentVoltageMotor.setAttribute('disabled', true);
  voltageSlider.removeAttribute('disabled');

  stageHandler(2, 'on');
  stageHandler(3, 'on');
});


// ****** General Event Handlers
document.getElementsByClassName("motor-group")[0].addEventListener('click', handleMotorClick);

// ****** Bootstrap toggle event handlers

$('#animation-toggle').change(function () {
  var toggleState = $(this).prop('checked') ? 'stopped': 'playing';
  $clog({ id: "play btn " + toggleState });
  startAnimation();
});

$('#repeat-toggle').change(function () {
  repeat = $(this).prop('checked');
  $clog({ id: 'repeat btn ' + repeat });
});

$('#microview-toggle').change(function () {
  var toggleState = $(this).prop('checked');
  $clog({ id: "microview btn " + toggleState });

  $('#hidecar-toggle').bootstrapToggle(toggleState ? 'enable' : 'disable');
  microViewEnabled = toggleState;
  toggleMicroView();
});

$('#hidecar-toggle').change(function () {
  isHideCarChecked = $(this).prop('checked');
  $clog({ id: "hidecar btn " + isHideCarChecked });

  hideCarHandler();
});

$('#graph-toggle').change(function () {
  var toggleState = $(this).prop('checked');
  $clog({ id: "graph btn " + toggleState });

  $('#graph-microview-toggle').bootstrapToggle(toggleState ? 'enable' : 'disable');
  toggleGraphView();
});

$('#graph-microview-toggle').change(function () {
  var toggleState = $(this).prop('checked');
  $clog({ id: "micrograph btn " + toggleState });

  toggleMicroGraphView();
});


// ***** Start States

TweenLite.set(car, {
  xPercent: -50,
  yPercent: -50,
  x: motionPath[0].x,
  y: motionPath[0].y,
  rotation: 90,
  transformOrigin: "50% 50%"
});
TweenLite.set(motor, { opacity: 0 });


// ***** Helper Functions

// handles motor selection
function handleMotorClick(e) {
  if (e.target !== e.currentTarget && e.target.id[0] == 'm') {
    e.target.classList.add("motor-selected");
    for (i = 0; i < 4; i++) {
      if (i != e.target.id[1]) {
        document.getElementById("m" + i).classList.remove("motor-selected");
      }
    }
    $clog({ id: "motorset btn " + (parseInt(e.target.id[1]) + 1) });
    setMotor(parseInt(e.target.id[1]));
    calculateAndPlotGraphs();
  }
  e.stopPropagation();
}

// helper function to handle hidecar event
function hideCarHandler() {
  if (isHideCarChecked && microViewEnabled) {
    console.log("scaling up. ");
    TweenMax.to(motor, 0.8, { scale: 2.5, transformOrigin: "50% 50%" });
    TweenMax.to(carTrackPath, 0.4, { opacity: 0.0001, scale: 2, transformOrigin: "50% 50%" });
  } else {
    console.log("scaling down. ");
    TweenMax.to(carTrackPath, 0.4, { opacity: 1, scale: 1, transformOrigin: "50% 50%" });
    TweenMax.to(motor, 0.5, { scale: 1.7, transformOrigin: "50% 50%" });
  }
}

// start animation helper for event handling of toggle
function startAnimation(e) {
  if (!isTimelinePlaying) {
    isTimelinePlaying = true;
    // e.target.value = "Stop Animation";
    timeline = startTimeline();
  } else {
    isTimelinePlaying = false;
    timeline.stop();
    timeline.progress(0);
    // e.target.value = "Start Animation";
  }
}

let elapsedPercentage = null;
let currSpeed = null;
// generate timeline for startAnimation()
function startTimeline() {
  console.log("TimeLine Started - Path time: " + pathTime);
  var t1 = new TimelineLite({ onComplete: timelineLooper }); // note timelinelooper call
  t1.insert(TweenMax.to(car, pathTime, {
    bezier: { values: motionPath, type: "cubic", autoRotate: 90 },
    repeat: 0,
    transformOrigin: "50% 50%",
    ease: Power1.easeIn
  }));
  t1.insert(TweenMax.to(rotater, pathTime, { rotation: "+=720", transformOrigin: "50% 50%", ease: Power1.easeIn }));
  t1.insert(TweenMax.to(rotaterShaft, pathTime, { rotation: "+=720", transformOrigin: "center", ease: Power1.easeIn }));
  t1.insert(TweenMax.to(currCarState, pathTime, {
    distance: 100,
    onUpdateParams: ["{self}"],
    onCompleteParams: ["{self}"],
    onUpdate: function (tl) {
      elapsedPercentage = tl.progress();
      currSpeed = actualTime * elapsedPercentage * acceleration;
      $('#speed-text').first().html("Speed: " + currSpeed.toFixed(2) + " m/s");
      $('#distance-text').first().html("Distance: " + currCarState.distance.toFixed(2) + " m");
    },
    onComplete: function (tl) {
      setTimeout(function () {
        currSpeed = actualTime * acceleration;
        $('#speed-text').first().html("Speed: " + currSpeed.toFixed(2) + " m/s");
        $('#distance-text').first().html("Distance: 100 m");
      }, 10);
    },
    ease: Power1.easeIn
  }));
  return t1;
}

// looper helper called at the end of timeline
function timelineLooper() {
  timeline.stop(); // stop
  if (repeat) {
    // console.log("repeat started. ");
    timeline = startTimeline();
  } else {
    $('#animation-toggle').bootstrapToggle('on');
    isTimelinePlaying = false;
    timeline.remove();
    timeline.invalidate();
  }
  return;
}

// helper function to toggle internal view
function toggleMicroView() {
  if (!microViewEnabled) {
    TweenMax.to(motor, 0.5, { opacity: 0.0001 });
  } else {
    TweenMax.to(motor, 0.5, { opacity: 1 });
  }
  hideCarHandler();
}

// helper functin to toggle side graph view
function toggleGraphView() {
  graphViewContent = document.getElementsByClassName("graph-content")[0];
  if (graphViewEnabled) {
    TweenMax.to(graphViewContent, 0.38, { opacity: 0 });
    setTimeout(function () {
      graphViewContent.style.width = 0;
    }, 430);
    graphViewContent.style.flexGrow = 0.000001;
    graphViewEnabled = false;
  } else {
    graphViewContent.style.width = "auto";
    TweenMax.to(graphViewContent, 0.38, { opacity: 1 });
    graphViewContent.style.flexGrow = 1.5;
    // TweenMax.to(graphViewContent, 1, { flex: "1" });
    graphViewEnabled = true;
  }
}

// helper function to show internal graph view
function toggleMicroGraphView() {
  microGraphViewContent = document.getElementsByClassName("graph-micro")[0];
  if (microGraphViewEnabled) {
    TweenMax.to(microGraphViewContent, 0.15, { opacity: 0 });
    setTimeout(function () {
      microGraphViewContent.style.height = 0;
    }, 200);
    microGraphViewContent.style.flexGrow = 0.000001;
    microGraphViewEnabled = false;
  } else {
    microGraphViewContent.style.height = "auto";
    TweenMax.to(microGraphViewContent, 0.15, { opacity: 1 });
    microGraphViewContent.style.flexGrow = 1;
    // TweenMax.to(graphViewContent, 1, { flex: "1" });
    microGraphViewEnabled = true;
  }
}

var currentSlider = document.getElementById('speed-slider');
currentSlider.style.height = '200px';
// range.style.margin = '20px auto 30px';
noUiSlider.create(currentSlider, {
  start: [25], // 4 handles, starting at...
  connect: [true, false], // Display a colored bar between the handles
  direction: 'rtl', // Put '0' at the bottom of the slider
  orientation: 'vertical', // Orient the slider vertically
  behaviour: 'tap-drag', // Move handle on tap, bar is draggable
  step: 1,
  tooltips: true,
  format: {
    from: Number,
    to: function (value) {
      return (value + " A");
    }
  },
  range: {
    'min': 25,
    'max': 45
  },
  pips: { // Show a scale with the slider
    mode: 'count',
    values: 5,
    density: 5
  }
});

currentSlider.noUiSlider.on('set', function (values, handle) {
  // pathTime = 6 / 100 * (100 - parseInt(values[0]));
  tempCurr = parseInt(values[0]);
  $log('slider', 'set', {
    id: 'current ' + tempCurr,
    slider: 'current',
    value: tempCurr
  });
  setCurrent(tempCurr);
  console.log("current set: " + tempCurr);
  calculateAndPlotGraphs();
});


var voltageSlider = document.getElementById('speed-slider2');
voltageSlider.style.height = '200px';
// range.style.margin = '20px auto 30px';
noUiSlider.create(voltageSlider, {
  start: [12], // 4 handles, starting at...
  connect: [true, false], // Display a colored bar between the handles
  direction: 'rtl', // Put '0' at the bottom of the slider
  orientation: 'vertical', // Orient the slider vertically
  behaviour: 'tap-drag', // Move handle on tap, bar is draggable
  step: 1,
  tooltips: true,
  format: {
    from: Number,
    to: function (value) {
      return (parseInt(value) + " V");
    }
  },
  range: {
    'min': 12,
    'max': 40
  },
  pips: { // Show a scale with the slider
    mode: 'count',
    values: 5,
    density: 5
  }
});

voltageSlider.noUiSlider.on('set', function (values, handle) {
  // pathTime = 6 / 100 * (100 - parseInt(values[0]));
  tempVoltage = parseInt(values[0]);
    $log('slider', 'set', {
    id: 'voltage ' + tempVoltage,
    slider: 'voltage',
    value: tempVoltage
  });
  setVoltage(tempVoltage);
  console.log("voltage set: " + tempVoltage);
  calculateAndPlotGraphs();
});


// ****** SIMULATION END *************


/*! *********************************
 *  2. GRAPH RELATED
 *   - Graph logic and client.
 * **********************************/

// **** GLOBALS *****

// Graph Arrays
var currentArr = [];
var voltageArr = [];
var torqueArr = [];
var accelerationArr = [];
var maxAngularVelocityArr = [];
var maxLinearVelocityArr = [];
var motorIDArr = [];

// Motor/Car Constants
var mass = 7; //Kg -> car.
var radius = 0.05; //Metre -> wheel.
var Kv = 0.012;
var Rm = 0.022;
var I0 = 1.91;

var motorID = null;
var motorSpecs = [
  [0.038, 0.038, 1.48, 467, '#607D8B'],
  [0.023, 0.043, 1.81, 435, '#2196F3'],
  [0.016, 0.030, 1.71, 336, '#9C27B0'],
  [0.012, 0.022, 1.91, 205, '#FF5722'],
  [0.006, 0.0135, 3.26, 236, '#4CAF50']
];

// Working Variables
var current = 0;
var voltage = 0;
var torque = 0;
var acceleration = 0;
var maxAngularVelocity = 0;
var maxLinearVelocity = 0;

// ***** Helper Functions

// calculates working variables based on current state
function calculateVariables() {
  torque = Kv * (current - I0);
  acceleration = torque / (mass * radius);
  maxAngularVelocity = (voltage - (current * Rm)) / Kv;
  maxLinearVelocity = maxAngularVelocity * radius;

  current = parseFloat(current).toFixed(2);
  voltage = parseFloat(voltage).toFixed(2);
  torque = parseFloat(torque).toFixed(2);
  acceleration = parseFloat(acceleration).toFixed(2);
  maxAngularVelocity = parseFloat(maxAngularVelocity).toFixed(2);
  maxLinearVelocity = parseFloat(maxLinearVelocity).toFixed(2);
  console.log("MAX LINEAR VELOCITY: " + maxLinearVelocity);
  // maxLinearVelocity ranges from 14 -> 165, hence
  actualTime = Math.sqrt(100 * 2 / acceleration);
  pathTime = 8 - (6 * (acceleration - 1.48) / 3.27);
}

// pushes working variables to working variable array for plotting.
function pushVariablesToArr() {
  currentArr.push(current);
  voltageArr.push(voltage);
  torqueArr.push(torque);
  accelerationArr.push(acceleration);
  maxAngularVelocityArr.push(maxAngularVelocity);
  maxLinearVelocityArr.push(maxLinearVelocity);
  motorIDArr.push(motorID);
  logVariables(true);
}

// sets the motorID
function setMotor(mID) {
  motorID = mID;
  console.log("motor set: " + (motorID + 1));
  Kv = motorSpecs[motorID][0];
  Rm = motorSpecs[motorID][1];
  I0 = motorSpecs[motorID][2];
}

// sets current
function setCurrent(curr) {
  current = curr;
}

// sets the voltage
function setVoltage(volt) {
  voltage = volt;
}

// helper function to log current working variables and array.
function logVariables(clear) {
  if (clear) {
    console.clear();
  }
  console.log(Kv);
  console.log(Rm);
  console.log(I0);

  console.log("motor id:" + motorIDArr);
  console.log("current:" + currentArr);
  console.log("voltage:" + voltageArr);
  console.log("torque:" + torqueArr);
  console.log("acceleration:" + accelerationArr);
  console.log("angular velocity:" + maxAngularVelocityArr);
  console.log("linear velocity:" + maxLinearVelocityArr);
}

// helper function to calculate and plot
function calculateAndPlotGraphs() {
  calculateVariables();
  pushVariablesToArr();
  replotGraphs();
}

// replot to replot all graphs with current array.
function replotGraphs() {
  console.log("REPLOTTING GRAPHS. ");
  plotAll();
}

// init functions
setCurrent(25);
setVoltage(12);
calculateVariables();
setMotor(0);
replotGraphs();


