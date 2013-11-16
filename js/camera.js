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