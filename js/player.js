var playerIDs = 0;

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
    this.x += this.gamePad.leftStickX;
    this.y += this.gamePad.leftStickY;
  }
}

Player.prototype.render = function() {
  ctx.beginPath();
  ctx.rect(this.x, this.y, 32, 32);
  ctx.fillStyle = '#f00';
  ctx.fill();
}