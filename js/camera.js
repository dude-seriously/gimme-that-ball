var camera = new Camera();
var cameraEasingF = .15;

var cameraZoomSpeed = .05;
var cameraMoveSpeed = 15;

var cameraZoomMin = .3;
var cameraZoomMax = 2;
var shakeStr = 150;

function Camera() {
  this.target = Vec2.new(0, 0);
  this.pos = Vec2.new(0, 0);
  this.zoom = 1;
  this.angle = 0;
  this.targetZoom = 1;
  this.shaking = 0;
}

Camera.prototype.update = function() {
  this.target[0] = 0;
  this.target[1] = 0;
  cameraPlayers = 0;

  var xMin =  Infinity;
  var xMax = -Infinity;
  var yMin =  Infinity;
  var yMax = -Infinity;

  var addPos = function(phys) {
    cameraPlayers++;
    var pos = phys.GetPosition();
    camera.target[0] += pos.x / pf;
    camera.target[1] += pos.y / pf;

    if (pos.x / pf > xMax) xMax = pos.x / pf;
    if (pos.x / pf < xMin) xMin = pos.x / pf;
    if (pos.y / pf > yMax) yMax = pos.y / pf;
    if (pos.y / pf < yMin) yMin = pos.y / pf;
  }

  players.forEach(function(player) {
    addPos(player.phys);
  });

  addPos(ball.phys);
  addPos(ball.phys);

  if (ball.player) {
    addPos(ball.player.phys);
  }

  this.target[0] /= cameraPlayers;
  this.target[1] /= cameraPlayers;

  this.target[1] -= 64;

  if (this.shaking > 0) {
    console.log(this.shaking);
    this.target[0] += (Math.min(10, this.shaking) / 10) * (Math.random() * shakeStr * 2 - shakeStr);
    this.target[1] += (Math.min(10, this.shaking) / 10) * (Math.random() * shakeStr * 2 - shakeStr);
    --this.shaking;
  }

  var xDist = (xMax - xMin);
  var yDist = (yMax - yMin);

  var dist = Math.sqrt(xDist * xDist, yDist * yDist);

  dist = Math.max(100, Math.min(1000, dist));
  this.targetZoom = Math.max(cameraZoomMin, Math.min(cameraZoomMax, 1.1 - (dist / 1000 - .5)));

  this.angle = -world.angle + (world.gravityR.y < 0 ? Math.PI : 0);
}

Camera.prototype.render = function() {
  this.pos[0] += (this.target[0] - this.pos[0]) * cameraEasingF;
  this.pos[1] += (this.target[1] - this.pos[1]) * cameraEasingF;
  this.zoom   += (this.targetZoom - this.zoom)  * cameraEasingF;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(this.zoom, this.zoom);
  ctx.rotate(this.angle);
  ctx.translate(-this.pos[0], -this.pos[1] / 2);
}