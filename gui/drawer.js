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
var tri1 = normalizedToRealPolygon(
  [{x: 0.6875, y: 0.833}, {x: 0.125, y: 0.966}, {x: 0.999, y: 0.999}]);
var tri2 = normalizedToRealPolygon(
  [{x: 0.6875, y: 0.833}, {x: 0.9375, y: 0.05}, {x: 0.999, y: 0.999}]);

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

var hexagon = normalizedToRealPolygon(
 [{x: 0.25, y: 0.001}, {x: 0.75, y: 0.001},
  {x: 0.999, y: 0.5}, {x: 0.75, y: 0.999},
  {x: 0.25, y: 0.999}, {x: 0.001, y: 0.5}]);
var tria1 = normalizedToRealPolygon(
 [{x: 0.001, y: 0.001}, {x: 0.001, y: 0.5}, {x: 0.25, y: 0.001}]);
var tria2 = normalizedToRealPolygon(
 [{x: 0.75, y: 0.001}, {x: 0.999, y: 0.5}, {x: 0.999, y: 0.001}]);
var tria3 = normalizedToRealPolygon(
 [{x: 0.999, y: 0.5}, {x: 0.75, y: 0.999}, {x: 0.999, y: 0.999}]);
var tria4 = normalizedToRealPolygon(
 [{x: 0.25, y: 0.999}, {x: 0.001, y: 0.5}, {x: 0.001, y: 0.999}]);

var preset1 = [tri1, tri2, poly1, poly2, smallSquare];
var preset2 = [fullSizePoly, losangeuh];
var preset3 = [crossedPolygon, crossedPolygon2, triangleuh];
var preset4 = [hexagon, tria1, tria2, tria3, tria4];

var r = 0.15;
var depth = 500;
var polygons = preset1;

// Checkboxes
var alternateColorsCheckbox = document.getElementById("alternate-colors");
var autoMoveCheckbox = document.getElementById("auto-move");
var editionCheckbox = document.getElementById("edition");

var slider = document.getElementById("ratio");
var sliderTriangles = document.getElementById("triangles-length-range");
var sliderSquares = document.getElementById("squares-length-range");
var sliderDiamonds = document.getElementById("diamonds-length-range");
var sliderHoneycomb = document.getElementById("honeycomb-length-range");

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
  editionCheckbox.checked = false;
  for (var i = 0; i < polygons.length; i++) {
    if (alternateColorsCheckbox.checked) {
      drawPolygonSpiralAltFill(ratio=r, depth=depth,
                               polygonCoordinates=polygons[i], fill=theColor);
    } else {
      drawPolygonSpiral(ratio=r, depth=depth, polygonCoordinates=polygons[i]);
    }
  }
}

// To process click events
var editionPointNumber = 0;
var customPoints = [];
var customArcs = [];
var pointWidth = 12;
var pointHeight = 12;

var xMouseDown = 0;
var yMouseDown = 0;
canvas.addEventListener('mousedown', function(event) {
  if (editionCheckbox.checked) {
    xMouseDown = event.x - (canvas.offsetLeft + canvas.clientLeft);
    // Substract the distance scrolled down !
    yMouseDown = event.y - (canvas.offsetTop + canvas.clientTop - window.scrollY);
  }
});

canvas.addEventListener('mouseup', function(event) {
  if (editionCheckbox.checked) {
    var x = event.x - (canvas.offsetLeft + canvas.clientLeft);
    // Substract the distance scrolled down !
    var y = event.y - (canvas.offsetTop + canvas.clientTop - window.scrollY);

    if (x == xMouseDown && y == yMouseDown) {
      // Click detected
      // console.log("Click detected at (" + x + ", " + y + ")!");

      // If clicked point is already in list, remove it
      var removed = false;
      var removedId = -1;
      var newPoints = []
      for (var ptIndex = 0; ptIndex < customPoints.length; ptIndex++) {
        if (x >= customPoints[ptIndex].x - (pointWidth / 2) && x <= customPoints[ptIndex].x + (pointWidth / 2) && y >= customPoints[ptIndex].y - (pointHeight / 2) && y <= customPoints[ptIndex].y + (pointHeight / 2)) {
          removed = true;
          removedId = customPoints[ptIndex].id;
        } else {
          newPoints.push(customPoints[ptIndex]);
        }
      }
      customPoints = newPoints;

      if (!removed) {
        // Add point to list if the click wasn't a removal
        customPoints.push({id: editionPointNumber, x: x, y: y});
        editionPointNumber++;
      } else {
        // Else delete related arcs
        newArcs = []
        for (var arcIndex = 0; arcIndex < customArcs.length; arcIndex++) {
          if (customArcs[arcIndex][0] != removedId && customArcs[arcIndex][1] != removedId) {
            newArcs.push(customArcs[arcIndex]);
          }
        }
        customArcs = newArcs;
      }
    } else {
      // Drag and drop detected
      // console.log("DnD detected at (" + x + ", " + y + ")!");

      // See if DnD defines an arc
      var startId = null;
      var stopId = null;
      for (var ptIndex = 0; ptIndex < customPoints.length; ptIndex++) {
        if (xMouseDown >= customPoints[ptIndex].x - (pointWidth / 2) && xMouseDown <= customPoints[ptIndex].x + (pointWidth / 2) && yMouseDown >= customPoints[ptIndex].y - (pointHeight / 2) && yMouseDown <= customPoints[ptIndex].y + (pointHeight / 2)) {
          startId = customPoints[ptIndex].id;
        }
      }
      for (var ptIndex = 0; ptIndex < customPoints.length; ptIndex++) {
        if (x >= customPoints[ptIndex].x - (pointWidth / 2) && x <= customPoints[ptIndex].x + (pointWidth / 2) && y >= customPoints[ptIndex].y - (pointHeight / 2) && y <= customPoints[ptIndex].y + (pointHeight / 2)) {
          stopId = customPoints[ptIndex].id;
        }
      }

      // Add arc to list
      if (startId != null && stopId != null && startId != stopId) {
        console.log('Arc detected from point ' + startId + ' to ' + stopId);
        customArcs.push([startId, stopId]);
      }
    }

    clearCanvas();
    drawEditionElements();
  }
});

function clearEdition() {
  customPoints = [];
  customArcs = [];
  clearCanvas();
}

function findPointForId(id) {
  point = null;
  for (var ptIndex = 0; ptIndex < customPoints.length; ptIndex++) {
    if (id == customPoints[ptIndex].id) {
      point = customPoints[ptIndex]
    }
  }
  return point;
}


// This method is in charge of drawing the elements related to the custom layout edition mode
function drawEditionElements() {
  if (editionCheckbox.checked) {
    // Draw points
    for (var ptIndex = 0; ptIndex < customPoints.length; ptIndex++) {
      ctx.fillStyle = "#f00";
      ctx.fillRect(customPoints[ptIndex].x - (pointWidth / 2), customPoints[ptIndex].y - (pointHeight / 2), pointWidth, pointHeight);
    }
    // Draw arcs
    for (var arcIndex = 0; arcIndex < customArcs.length; arcIndex++) {
      point1 = findPointForId(customArcs[arcIndex][0]);
      point2 = findPointForId(customArcs[arcIndex][1]);
      ctx.strokeStyle = "#0f0";
      ctx.beginPath();
      ctx.moveTo(point1.x,point1.y);
      ctx.lineTo(point2.x, point2.y);
      ctx.stroke();
    }
  }
}

// This method is in charge of extracting polygons from the custom layout edition mode, apply them and trigger the drawing with drawEverything().
function drawCustomLayout() {
  editionCheckbox.checked = false;

  clearCanvas();
  polygons = [];
  drawEverything();
}

function downloadCanvasAsPng() {
  var dataURL = canvas.toDataURL("image/png");
  var newTab = window.open('about:blank','image from canvas');
  newTab.document.write("<img src='" + dataURL + "' alt='from canvas'/>");
}

function downloadInformation() {
  normalized_polygons = []
  for (var i = 0; i < polygons.length; i++) {
    normalized_polygon = []
    for (var j = 0; j < polygons[i].length; j++) {
      normalized_polygon.push({x: polygons[i][j].x / width,
                               y: polygons[i][j].y / height})
    }
    normalized_polygons.push(normalized_polygon)
  }
  info = {
    width: width,
    height: height,
    r: r,
    depth: depth,
    polygons: normalized_polygons,
    alternateColors: alternateColorsCheckbox.checked
  };
  console.log("Image information : " + JSON.stringify(info));
  var newTab = window.open('about:blank','image info');
  newTab.document.write(JSON.stringify(info));
}

function clearCanvas() {
  drawPolygon(fullSizePoly, fillcolor="#fff", noStroke=true);
}

function applyPreset(preset) {
  clearCanvas();
  polygons = preset;
  drawEverything();
}

function drawTrianglesPaving() {
  sideLength = sliderTriangles.value;
  triangles = [];
  // Loop through twice the height of a triangle
  for (var y = 0; y < height; y += Math.sqrt(3) * sideLength * height) {
    // Once the side
    for (var x = 0; x < width + (sideLength * width); x += sideLength * width) {
      // Draw upwards triangle with top at (x, y)
      triangles.push([{x: x, y: y},
        {x: x + ((sideLength * width) / 2), y: y + ((Math.sqrt(3) / 2) * (sideLength * height))},
        {x: x - ((sideLength * width) / 2), y: y + ((Math.sqrt(3) / 2) * (sideLength * height))}]);
      // Downwards triangle with bottom at (x; y+2h)
      triangles.push([{x: x, y: y + (Math.sqrt(3) * (sideLength * height))},
        {x: x + ((sideLength * width) / 2), y: y + ((Math.sqrt(3) / 2) * (sideLength * height))},
        {x: x - ((sideLength * width) / 2), y: y + ((Math.sqrt(3) / 2) * (sideLength * height))}]);
      // Downwards triangle right of first one
      triangles.push([{x: x, y: y},
        {x: x + ((sideLength * width) / 2), y: y + ((Math.sqrt(3) / 2) * (sideLength * height))},
        {x: x + (sideLength * height), y: y}]);
      // Upwards triangles right of second one
      triangles.push([{x: x, y: y + (Math.sqrt(3) * (sideLength * height))},
        {x: x + ((sideLength * width) / 2), y: y + ((Math.sqrt(3) / 2) * (sideLength * height))},
        {x: x + (sideLength * height), y: y + (Math.sqrt(3) * (sideLength * height))}]);
    }
  }
  clearCanvas();
  polygons = triangles;
  drawEverything();
}

function drawSquaresPaving() {
  sideLength = sliderSquares.value;
  squares = [];
  // Loop through twice the height of a triangle
  for (var y = 0; y < height; y += 2 * sideLength * height) {
    // Once the side
    for (var x = 0; x < width + (sideLength * width); x += 2 * sideLength * height) {
      squares.push([{x: x, y: y},
        {x: x + (sideLength * width), y: y},
        {x: x + (sideLength * width), y: y + (sideLength * height)},
        {x: x, y: y + (sideLength * height)}]);

      // squares.push([{x: x + (sideLength * width), y: y},
      //   {x: x + (sideLength * width), y: y + (sideLength * height)},
      //   {x: x + 2 * (sideLength * width), y: y + (sideLength * height)},
      //   {x: x + 2 * (sideLength * width), y: y}]);
      squares.push([{x: x + (sideLength * width), y: y},
        {x: x + 2 * (sideLength * width), y: y},
        {x: x + 2 * (sideLength * width), y: y + (sideLength * height)},
        {x: x + (sideLength * width), y: y + (sideLength * height)}]);

      // squares.push([{x: x + (sideLength * width), y: y + (sideLength * height)},
      //   {x: x, y: y + (sideLength * height)},
      //   {x: x, y: y + 2 * (sideLength * height)},
      //   {x: x + (sideLength * width), y: y + 2 * (sideLength * height)}]);
      squares.push([{x: x + (sideLength * width), y: y + (sideLength * height)},
        {x: x + (sideLength * width), y: y + 2 * (sideLength * height)},
        {x: x, y: y + 2 * (sideLength * height)},
        {x: x, y: y + (sideLength * height)}]);

      // squares.push([{x: x + (sideLength * width), y: y + (sideLength * height)},
      //   {x: x + (sideLength * width), y: y + 2 * (sideLength * height)},
      //   {x: x + 2 * (sideLength * width), y: y + 2 * (sideLength * height)},
      //   {x: x + 2 * (sideLength * width), y: y + (sideLength * height)}]);
      squares.push([{x: x + (sideLength * width), y: y + (sideLength * height)},
        {x: x + 2 * (sideLength * width), y: y + (sideLength * height)},
        {x: x + 2 * (sideLength * width), y: y + 2 * (sideLength * height)},
        {x: x + (sideLength * width), y: y + 2 * (sideLength * height)}]);
    }
  }
  clearCanvas();
  polygons = squares;
  drawEverything();
}

function drawDiamondsPaving() {
  sideLength = sliderDiamonds.value;
  diamonds = [];
  // Loop through twice the height of a triangle
  for (var y = 0; y < 2 * height; y += Math.sqrt(3) * sideLength * height) {
    // Once the side
    for (var x = 0; x < width + (sideLength * width); x += 3 * sideLength * width) {

      diamonds.push([{x: x, y: y},
        {x: x + (sideLength * width), y: y},
        {x: x + ((1/2) * sideLength * width), y: y + ((Math.sqrt(3) / 2) * (sideLength * height))},
        {x: x - ((1/2) * sideLength * width), y: y + ((Math.sqrt(3) / 2) * (sideLength * height))}]);

      diamonds.push([{x: x - ((1/2) * sideLength * width), y: y + ((Math.sqrt(3) / 2) * (sideLength * height))},
        {x: x + ((1/2) * sideLength * width), y: y + ((Math.sqrt(3) / 2) * (sideLength * height))},
        {x: x + (sideLength * width), y: y + (Math.sqrt(3) * sideLength * height)},
        {x: x, y: y + (Math.sqrt(3) * sideLength * height)}]);

      diamonds.push([{x: x + (sideLength * width), y: y},
        {x: x + ((1/2) * sideLength * width), y: y + ((Math.sqrt(3) / 2) * (sideLength * height))},
        {x: x + (sideLength * width), y: y + (Math.sqrt(3) * sideLength * height)},
        {x: x + ((3/2) * sideLength * width), y: y + ((Math.sqrt(3) / 2) * (sideLength * height))}]);

      diamonds.push([{x: x + (sideLength * width), y: y},
        {x: x + ((3/2) * sideLength * width), y: y + ((Math.sqrt(3) / 2) * (sideLength * height))},
        {x: x + (2 * sideLength * width), y: y},
        {x: x + ((3/2) * sideLength * width), y: y - ((Math.sqrt(3) / 2) * (sideLength * height))}]);

      diamonds.push([{x: x + ((3/2) * sideLength * width), y: y - ((Math.sqrt(3) / 2) * (sideLength * height))},
        {x: x + ((5/2) * sideLength * width), y: y - ((Math.sqrt(3) / 2) * (sideLength * height))},
        {x: x + (3 * sideLength * width), y: y},
        {x: x + (2 * sideLength * width), y: y}]);

      diamonds.push([{x: x + (2 * sideLength * width), y: y},
        {x: x + (3 * sideLength * width), y: y},
        {x: x + ((5/2) * sideLength * width), y: y + ((Math.sqrt(3) / 2) * (sideLength * height))},
        {x: x + ((3/2) * sideLength * width), y: y + ((Math.sqrt(3) / 2) * (sideLength * height))}]);
    }
  }
  clearCanvas();
  polygons = diamonds;
  drawEverything();
}

function drawHoneycombPaving() {
  sideLength = sliderHoneycomb.value;
  hexagons = [];
  // Loop through twice the height of a triangle
  for (var y = 0; y < (3/2) * height; y += Math.sqrt(3) * sideLength * height) {
    // Once the side
    for (var x = 0; x < width + (sideLength * width); x += 3 * sideLength * width) {
      hexagons.push([{x: x, y: y},
        {x: x + (sideLength * width), y: y},
        {x: x + ((3/2) * sideLength * width), y: y + ((Math.sqrt(3) / 2) * (sideLength * height))},
        {x: x + (sideLength * width), y: y + (Math.sqrt(3) * sideLength * height)},
        {x: x, y: y + (Math.sqrt(3) * sideLength * height)},
        {x: x - ((1/2) * sideLength * width), y: y + ((Math.sqrt(3) / 2) * (sideLength * height))}]);

      hexagons.push([{x: x + (sideLength * width), y: y},
        {x: x + ((3/2) * sideLength * width), y: y + ((Math.sqrt(3) / 2) * (sideLength * height))},
        {x: x + ((5/2) * sideLength * width), y: y + ((Math.sqrt(3) / 2) * (sideLength * height))},
        {x: x + (3 * sideLength * width), y: y},
        {x: x + ((5/2) * sideLength * width), y: y - ((Math.sqrt(3) / 2) * (sideLength * height))},
        {x: x + ((3/2) * sideLength * width), y: y - ((Math.sqrt(3) / 2) * (sideLength * height))}]);
    }
  }
  clearCanvas();
  polygons = hexagons;
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

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  onRUpdate();
}

sliderTriangles.oninput = function() {
  drawTrianglesPaving();
}

sliderSquares.oninput = function() {
  drawSquaresPaving();
}

sliderDiamonds.oninput = function() {
  drawDiamondsPaving();
}

sliderHoneycomb.oninput = function() {
  drawHoneycombPaving();
}

alternateColorsCheckbox.oninput = function() {
  clearCanvas();
  drawEverything();
}

autoMoveCheckbox.oninput = function() {
  autoMove();
}

editionCheckbox.oninput = function() {
  clearCanvas();
  drawEditionElements();
}

onRUpdate()
