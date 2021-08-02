function drawPolygon(coordinates, fillcolor = "None") {
  // Retrieve canvas
  var canvas = document.getElementById("the-canvas");
  var ctx = canvas.getContext('2d');

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

  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;

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
    console.log(x1, y1, x2, y2);
    result.push({x: (x1 + (ratio * (x2-x1))), y: (y1 + (ratio * (y2-y1)))});
  }
  return result;
}

var square = [{x: 20.0, y: 20.0}, {x: 20.0, y: 400.0},
              {x: 400.0, y: 400.0}, {x: 400.0, y: 20.0}]
drawPolygon(coordinates=square);
console.log(square)
console.log(computeInnerPolygon(0.2, square))
