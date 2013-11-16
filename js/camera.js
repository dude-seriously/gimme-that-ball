var camera = new Camera();
var cameraEasingF = .1;

var cameraZoomSpeed = .05;
var cameraMoveSpeed = 15;

var cameraZoomMin = .3;
var cameraZoomMax = 2;

function Camera() {
  this.target = Vec2.new(0, 0);
  this.pos = Vec2.new(0, 0);
  this.zoom = 1;
  this.targetZoom = 1;
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

  this.target[1] -= 128;

  var xDist = xMax - xMin;
  var yDist = yMax - yMin;

  var dist = Math.max(100, Math.min(1000, xDist > yDist ? xDist : yDist));
  this.targetZoom = Math.max(cameraZoomMin, Math.min(cameraZoomMax, 1.1 - (dist / 1000 - .5)));
}

Camera.prototype.render = function() {

  if (game.state == 'game' && gamePadMaster && gamePadMaster.leftShoulder1) {
    if (Math.abs(gamePadMaster.leftStickX) > .2) {
      this.target[0] += gamePadMaster.leftStickX * cameraMoveSpeed;
    }
    if (Math.abs(gamePadMaster.leftStickY) > .2) {
      this.target[1] += gamePadMaster.leftStickY * cameraMoveSpeed;
    }

    if (Math.abs(gamePadMaster.rightStickY) > .2) {
      this.targetZoom = Math.max(cameraZoomMin, Math.min(cameraZoomMax, this.targetZoom - gamePadMaster.rightStickY * cameraZoomSpeed));
    }
  }

  this.pos[0] += (this.target[0] - this.pos[0]) * cameraEasingF;
  this.pos[1] += (this.target[1] - this.pos[1]) * cameraEasingF;
  this.zoom   += (this.targetZoom - this.zoom)  * cameraEasingF;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(this.zoom, this.zoom);
  ctx.translate(-this.pos[0], -this.pos[1] / 2);
}