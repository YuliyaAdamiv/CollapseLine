var canvasWidth = 1000;
var canvasHeight = 700;
var canvas = null;
var bounds = null;
var ctx = null;
var hasLoaded = false;

var startX = 0;
var startY = 0;
var mouseX = 0;
var mouseY = 0;
var isDrawing = false;
var existingLines = [];

function draw() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.beginPath();

  for (var i = 0; i < existingLines.length; ++i) {
    var line = existingLines[i];
    ctx.moveTo(line.startX, line.startY);
    ctx.lineTo(line.endX, line.endY);
    console.log(
      existingLines[0],
      existingLines[1],
      existingLines[2],
      existingLines[3]
    );
  }

  ctx.stroke();

  if (isDrawing) {
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();
  }
  calculateIntersection(startX, startY, mouseX, mouseY);
  console.log(calculateIntersection(startX, startY, mouseX, mouseY));
  drawPoint(ctx, 'P', 'red', 5);
}

function onmousedown(e) {
  if (hasLoaded && e.button === 0) {
    if (!isDrawing) {
      startX = e.clientX - bounds.left;
      startY = e.clientY - bounds.top;

      isDrawing = true;
    }
    draw();
  }
}

function onmouseup(e) {
  if (hasLoaded && e.button === 0) {
    if (isDrawing) {
      existingLines.push({
        startX: startX,
        startY: startY,
        endX: mouseX,
        endY: mouseY,
      });

      isDrawing = false;
    }

    draw();
  }
}

function onmousemove(e) {
  if (hasLoaded) {
    mouseX = e.clientX - bounds.left;
    mouseY = e.clientY - bounds.top;

    if (isDrawing) {
      draw();
    }
  }
}

window.onload = function () {
  canvas = document.getElementById('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  canvas.onmousedown = onmousedown;
  canvas.onmouseup = onmouseup;
  canvas.onmousemove = onmousemove;

  bounds = canvas.getBoundingClientRect();
  ctx = canvas.getContext('2d');
  hasLoaded = true;

  draw();
};

function calculateIntersection(startX, startY, mouseX, mouseY) {
  console.log(startX, startY, mouseX, mouseY);
  console.log(
    existingLines[0].startX,
    existingLines[0].startY,
    existingLines[0].endX,
    existingLines[0].endY,
    existingLines[1].startX,
    existingLines[1].startY,
    existingLines[1].endX,
    existingLines[1].endY
  );
  var c2x = existingLines[1].startX - existingLines[1].endX; // (x3 - x4)
  var c3x = existingLines[0].startX - existingLines[0].endX; // (x1 - x2)
  var c2y = existingLines[1].startY - existingLines[1].endY; // (y3 - y4)
  var c3y = existingLines[0].startY - existingLines[0].endY; // (y1 - y2)
  console.log(c2x, c2y, c3x, c3y);
  // down part of intersection point formula
  var d = Math.abs(c3x * c2y - c3y * c2x);

  if (d == 0) {
    throw new Error('Number of intersection points is zero or infinity.');
  }

  // upper part of intersection point formula
  var u1 = Math.abs(
    existingLines[0].startX * existingLines[0].endY -
      existingLines[0].startY * existingLines[0].endX
  ); // (x1 * y2 - y1 * x2)
  var u4 = Math.abs(
    existingLines[1].startX * existingLines[1].endY -
      existingLines[1].startY * existingLines[1].endX
  ); // (x3 * y4 - y3 * x4)
  console.log(u1, u4);

  console.log(d);

  var px = Number(Math.abs((u1 * c2x - c3x * u4) / d).toFixed(1));
  var py = Number(Math.abs((u1 * c2y - c3y * u4) / d).toFixed(1));

  var p = {x: px, y: py};

  return p;
}

function drawPoint(ctx, label, color, size) {
  var p = calculateIntersection(startX, startY, mouseX, mouseY);
  console.log(p.x, p.y);
  if (color == null) {
    color = '#000';
  }

  if (size == null) {
    size = 5;
  }

  var pointX = Math.round(p.x);
  var pointY = Math.round(p.y);

  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(pointX, pointY, size, 0 * Math.PI, 2 * Math.PI);
  ctx.fill();
}

const clearCanvas = () => {
  ctx.clearRect(0, 0, ctx.canvasWidth, ctx.canvasHeight);
};
