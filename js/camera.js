var camera = new Camera();
var cameraEasingF = .1;

function Camera() {
  this.target = Vec2.new(0, 0);
  this.pos = Vec2.new(0, 0);
  this.zoom = 1;
}

Camera.prototype.render = function() {
  this.pos[0] += (this.target[0] - this.pos[0]) * cameraEasingF;
  this.pos[1] += (this.target[1] - this.pos[1]) * cameraEasingF;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(-this.pos[0] + canvas.width / 2, -this.pos[1] / 2 + canvas.height / 2);
  ctx.scale(this.zoom, this.zoom);
}