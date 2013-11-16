var playerIDs = 0;
var moveSpeed = 10;

function Player(team) {
  this.id = ++playerIDs;
  this.team = team;
  this.gamePad = null;

  this.x = 0;
  this.y = 0;

  //this.phys =
}

Player.prototype.update = function() {
  if (this.gamePad) {
    if (gamePadMaster == this.gamePad && gamePadMaster.leftShoulder0) return;

    if (Math.abs(this.gamePad.leftStickX) > .2) {
      this.x += this.gamePad.leftStickX * moveSpeed;
    }
    if (Math.abs(this.gamePad.leftStickY) > .2) {
      this.y += this.gamePad.leftStickY * moveSpeed;
    }
  }
}

Player.prototype.jump = function() {

}

Player.prototype.render = function() {
  ctx.beginPath();
  ctx.rect(this.x, this.y, 32, 32);
  ctx.fillStyle = '#f00';
  ctx.fill();
}