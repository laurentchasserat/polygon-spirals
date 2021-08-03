// Init variables
var square = [{x: 20.0, y: 20.0}, {x: 20.0, y: 400.0},
              {x: 400.0, y: 400.0}, {x: 400.0, y: 20.0}];
var poly1 = [{x: 20.0, y: 400.0}, {x: 400.0, y: 400.0},
             {x: 550.0, y: 500.0}, {x: 100.0, y: 580.0}];
var poly2 = [{x: 400.0, y: 20.0}, {x: 400.0, y: 400.0},
             {x: 550.0, y: 500.0}, {x: 750.0, y: 30.0}];
var fullsizepoly = [{x: 0.0, y: 0.0}, {x: 0.0, y: 600.0},
                    {x: 800.0, y: 600.0}, {x: 800.0, y: 20.0}];
var crossedPolygon = [{x: 400.0, y: 20.0}, {x: 550.0, y: 500.0},
                      {x: 50.0, y: 550.0}, {x: 750.0, y: 30.0}];
var crossedPolygon2 = [{x: 10.0, y: 30.0}, {x: 150.0, y: 15.0},
                      {x: 300.0, y: 150.0}, {x: 20.0, y: 250.0},
                      {x: 200.0, y: 300.0}];
var triangleuh = [{x: 600.0, y: 200.0}, {x: 750.0, y: 500.0},
                  {x: 550.0, y: 350.0}];

var preset1 = [poly1, poly2, square];
var preset2 = [poly1];
var preset3 = [crossedPolygon, crossedPolygon2, triangleuh];

var r = 0.15;
var depth = 500;
var polygons = preset1;

// Retrieve canvas
var canvas = document.getElementById("the-canvas");
// var canvasSVGContext = new CanvasSVG.Deferred();
// canvasSVGContext.wrapCanvas(canvas);
var ctx = canvas.getContext('2d');

// Checkboxes
var alternateColorsCheckbox = document.getElementById("alternate-colors");
var autoMoveCheckbox = document.getElementById("auto-move");

function drawPolygon(coordinates, fillcolor="None") {

  // Set linestyle
  ctx.strokeStyle = "black";
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

function drawPolygonSpiralAltFill(ratio, depth, polygonCoordinates, fill="#000") {
  if (depth > 0) {
    drawPolygon(polygonCoordinates, fillcolor=fill);
    drawPolygonSpiralAltFill(ratio, depth - 1,
                             computeInnerPolygon(ratio, polygonCoordinates),
                             (fill == "#000" ? "#fff" : "#000"));
  }
}

function drawEverything() {
  for (var i = 0; i < polygons.length; i++) {
    if (alternateColorsCheckbox.checked) {
      drawPolygonSpiralAltFill(ratio=r, depth=depth,
                               polygonCoordinates=polygons[i], fill="#000");
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

function clearCanvas() {
  drawPolygon([{x: 0.0, y: 0.0}, {x: 0.0, y: 600.0},
               {x: 800.0, y: 600.0}, {x: 800.0, y: 0.0}], fillcolor="#fff")
}

function applyPreset(preset) {
  clearCanvas();
  polygons = preset;
  drawEverything();
}

function onRUpdate() {
  clearCanvas();
  r = slider.value;
  drawEverything();
}

var autoMovingUp = true;
function autoMove() {
  if (autoMoveCheckbox.checked) {
    var currentR = parseFloat(slider.value);
    if (autoMovingUp) {
      var new_value = currentR + 0.01;
      slider.value = new_value;
      if (new_value == 0.99) {
        autoMovingUp = false;
      }
    } else {
      var new_value = currentR - 0.01;
      slider.value = new_value;
      if (new_value == 0.01) {
        autoMovingUp = true;
      }
    }
    onRUpdate();
    setTimeout(function() { autoMove(); }, 25);
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

drawEverything()
