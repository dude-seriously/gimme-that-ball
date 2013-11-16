var camera = new Camera();
var cameraEasingF = .1;

var cameraZoomSpeed = .05;
var cameraMoveSpeed = 15;

var cameraZoomMin = .5;
var cameraZoomMax = 2;

function Camera() {
  this.target = Vec2.new(0, 0);
  this.pos = Vec2.new(0, 0);
  this.zoom = 1;
  this.targetZoom = 1;
}

Camera.prototype.update = function() {
  // this.target[0] = 0;
  // this.target[1] = 0;
  // cameraPlayers = 0;

  // var xMin =  Infinity;
  // var xMax = -Infinity;
  // var yMin =  Infinity;
  // var yMax = -Infinity;

  // players.forEach(function(player) {
  //   cameraPlayers++;
  //   var pos = player.phys.GetOriginPosition();
  //   camera.target[0] += pos.x;
  //   camera.target[1] += pos.y;

  //   if (pos.x > xMax) xMax = pos.x;
  //   if (pos.x < xMin) xMin = pos.x;
  //   if (pos.y > yMax) yMax = pos.y;
  //   if (pos.y < yMin) yMin = pos.y;
  // });

  // this.target[0] /= cameraPlayers;
  // this.target[1] /= cameraPlayers;

  // var xDist = xMax - xMin;
  // var yDist = yMax - yMin;

  // var dist = Math.max(100, Math.min(1000, xDist > yDist ? xDist : yDist));
  // this.targetZoom = 1.0 - (dist / 1000 - .5);
}

Camera.prototype.render = function() {

  if (game.state == 'game' && gamePadMaster && gamePadMaster.leftShoulder0) {
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