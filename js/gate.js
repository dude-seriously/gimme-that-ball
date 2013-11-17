var gateWidth = 64;
var gateHeight = 256;

var gateFromBottom = 256;

function Gate(team) {
  this.team = team;
  this.x = this.team.id == 0 ? world.left : world.right - gateWidth;
  this.y = world.bottom - gateHeight - gateFromBottom;
}

Gate.prototype.update = function() {
  if (ball.x > this.x && ball.x < this.x + gateWidth && ball.y > this.y && ball.y < this.y + gateHeight) {

    this.team.score += (ball.player && ball.player.team == this.team) ? 3 : 1;

    ball.phys.SetPosition(new b2Vec2(0, 0));
    ball.phys.SetLinearVelocity(new b2Vec2(0, -10));
    ball.player = null;
    ball.disabled = false;
    this.team.tpl();

    var loosers = this.team == teams.a() ? teams.b() : teams.a();
    players.forEach(function(player) {
      player.makeASpeech(player.team == loosers ? 'random sad' : 'random happy', true);
    });
  }
}

Gate.prototype.render = function() {
  ctx.save();

  ctx.globalAlpha = .3;
  ctx.beginPath();
  ctx.rect(this.x, this.y, gateWidth, gateHeight);
  ctx.fillStyle = this.team.id == 0 ? '#f60' : '#06f';
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = ctx.fillStyle;
  ctx.stroke();

  ctx.restore();

}