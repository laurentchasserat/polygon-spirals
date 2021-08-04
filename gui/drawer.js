/* Init variables */

// Retrieve canvas
var canvas = document.getElementById("the-canvas");
// var canvasSVGContext = new CanvasSVG.Deferred();
// canvasSVGContext.wrapCanvas(canvas);
var ctx = canvas.getContext('2d');

var width = canvas.width;
var height = canvas.height;

var theColor = "#ddd"

// Normalized polygon definitions

var smallSquare = normalizedToRealPolygon(
  [{x: 0.0001, y: 0.001}, {x: 0.0001, y: 0.666},
   {x: 0.5, y: 0.666}, {x: 0.5, y: 0.001}]);
var poly1 = normalizedToRealPolygon(
  [{x: 0.0001, y: 0.666}, {x: 0.5, y: 0.666},
   {x: 0.6875, y: 0.833}, {x: 0.125, y: 0.966}]);
var poly2 = normalizedToRealPolygon(
  [{x: 0.5, y: 0.001}, {x: 0.5, y: 0.666},
   {x: 0.6875, y: 0.833}, {x: 0.9375, y: 0.05}]);
var deltaplaneuh = normalizedToRealPolygon(
  [{x: 0.125, y: 0.966}, {x: 0.6875, y: 0.833},
   {x: 0.9375, y: 0.05}, {x: 0.999, y: 0.999}]);

var crossedPolygon = normalizedToRealPolygon(
  [{x: 0.5, y: 0.033}, {x: 0.6875, y: 0.833},
   {x: 0.0625, y: 0.916}, {x: 0.9375, y: 0.05}]);
var crossedPolygon2 = normalizedToRealPolygon(
  [{x: 0.0125, y: 0.05}, {x: 0.1875, y: 0.025},
   {x: 0.375, y: 0.25}, {x: 0.025, y: 0.416}, {x: 0.25, y: 0.5}]);
var triangleuh = normalizedToRealPolygon(
  [{x: 0.75, y: 0.333}, {x: 0.9375, y: 0.833}, {x: 0.6875, y: 0.583}]);

var fullSizePoly = normalizedToRealPolygon(
  [{x: 0.001, y: 0.001}, {x: 0.999, y: 0.001},
   {x: 0.999, y: 0.999}, {x: 0.001, y: 0.999}]);
// var losangeuh = normalizedToRealPolygon(
//   [{x: 0.5, y: 0.001}, {x: 0.999, y: 0.5},
//    {x: 0.5, y: 0.999}, {x: 0.001, y: 0.5}]);
var losangeuh = normalizedToRealPolygon(
  [{x: 0.5, y: 0.001}, {x: 0.001, y: 0.5},
   {x: 0.5, y: 0.999}, {x: 0.999, y: 0.5}]);

var preset1 = [deltaplaneuh, poly1, poly2, smallSquare];
var preset2 = [fullSizePoly, losangeuh];
var preset3 = [crossedPolygon, crossedPolygon2, triangleuh];

var r = 0.15;
var depth = 500;
var polygons = preset1;

// Checkboxes
var alternateColorsCheckbox = document.getElementById("alternate-colors");
var autoMoveCheckbox = document.getElementById("auto-move");

function normalizedToRealPolygon (normalizedPoly) {
  result = [];
  for (var i = 0; i < normalizedPoly.length; i++) {
    result.push({x: normalizedPoly[i].x * width, y: normalizedPoly[i].y * height});
  }
  return result;
}

function drawPolygon(coordinates, fillcolor="None", noStroke=false) {

  // Set linestyle
  if (noStroke) {
    ctx.strokeStyle = "#fff";
  } else {
    ctx.strokeStyle = "#333";
  }

  ctx.lineWidth = 2;

  // Path init
  ctx.beginPath();
  ctx.moveTo(coordinates[0].x, coordinates[0].y);

  // Redefine path with polygon coordinates
  var first = coordinates.shift();
  coordinates.push(first);

  // Trace path
  for (var i = 0; i < coordinates.length; i++) {
    ctx.lineTo(coordinates[i].x, coordinates[i].y);
  }

  // Finish path
  ctx.closePath();

  if (fillcolor != "None") {
    ctx.fillStyle = fillcolor;
    ctx.fill();
  }

  ctx.stroke();
}

function computeInnerPolygon(ratio, polygonCoordinates) {
  result = []
  var x1;
  var y1;
  var x2;
  var y2;
  for (var i = 0; i < polygonCoordinates.length; i++) {
    x1 = polygonCoordinates[i].x;
    y1 = polygonCoordinates[i].y;
    if (i < polygonCoordinates.length - 1) {
      x2 = polygonCoordinates[i+1].x;
      y2 = polygonCoordinates[i+1].y;
    } else {
      x2 = polygonCoordinates[0].x;
      y2 = polygonCoordinates[0].y;
    }
    result.push({x: (x1 + (ratio * (x2-x1))), y: (y1 + (ratio * (y2-y1)))});
  }
  return result;
}

function drawPolygonSpiral(ratio, depth, polygonCoordinates) {
  if (depth > 0) {
    drawPolygon(polygonCoordinates);
    drawPolygonSpiral(ratio, depth - 1,
                      computeInnerPolygon(ratio, polygonCoordinates));
  }
}

function drawPolygonSpiralAltFill(ratio, depth, polygonCoordinates, fill="#fff") {
  if (depth > 0) {
    drawPolygon(polygonCoordinates, fillcolor=fill);
    drawPolygonSpiralAltFill(ratio, depth - 1,
                             computeInnerPolygon(ratio, polygonCoordinates),
                             (fill == theColor ? "#fff" : theColor));
  }
}

function drawEverything() {
  for (var i = 0; i < polygons.length; i++) {
    if (alternateColorsCheckbox.checked) {
      drawPolygonSpiralAltFill(ratio=r, depth=depth,
                               polygonCoordinates=polygons[i], fill=theColor);
    } else {
      drawPolygonSpiral(ratio=r, depth=depth, polygonCoordinates=polygons[i]);
    }
  }
}

function downloadCanvasAsPng() {
  var dataURL = canvas.toDataURL("image/png");
  var newTab = window.open('about:blank','image from canvas');
  newTab.document.write("<img src='" + dataURL + "' alt='from canvas'/>");
}

function downloadInformation() {
  info = {
    r: r,
    depth: depth,
    polygons: polygons,
    alternateColors: alternateColorsCheckbox.checked
  };
  console.log("Image information : " + JSON.stringify(info));
  var newTab = window.open('about:blank','image info');
  newTab.document.write(JSON.stringify(info));
}

function clearCanvas() {
  drawPolygon(fullSizePoly, fillcolor="#fff", noStroke=true)
}

function applyPreset(preset) {
  clearCanvas();
  polygons = preset;
  drawEverything();
}

function onRUpdate() {
  clearCanvas();
  r = slider.value;
  document.getElementById('ratio-value').innerHTML = slider.value;
  drawEverything();
}

var autoMovingUp = true;
function autoMove() {
  if (autoMoveCheckbox.checked) {
    var currentR = Math.round(parseFloat(slider.value) * 1000);
    if (autoMovingUp) {
      var new_value = currentR + 5;
      slider.value = new_value / 1000.0;
      if (new_value >= 990) {
        autoMovingUp = false;
      }
    } else {
      var new_value = currentR - 5;
      slider.value = new_value / 1000.0;
      if (new_value <= 10) {
        autoMovingUp = true;
      }
    }
    onRUpdate();
    setTimeout(function() { autoMove(); }, 2);
  }
}

var slider = document.getElementById("ratio");

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  onRUpdate();
}

alternateColorsCheckbox.oninput = function() {
  clearCanvas();
  drawEverything();
}

autoMoveCheckbox.oninput = function() {
  autoMove();
}

onRUpdate()
