function Team(id, name) {
  this.id = id;
  this.name = name;
  this.score = 0;
  this.gate = new Gate(this);
  this.players = new Players();
};

Team.prototype.join = function(player) {
  this.players.push(player);
  player.team = this;

  var pos = player.phys.GetPosition();
  pos.x = this.id == 0 ? (world.left + 128) * pf : (world.right - 128) * pf;
  pos.y = (world.bottom - 256) * pf;
  player.phys.SetPosition(pos);
}

Team.prototype.leave = function(player) {
  if (player.team) {
    player.team = null;
    this.players.pull(player);
  }
}

Team.prototype.update = function() {
  this.gate.update();
}

Team.prototype.render = function() {
  this.gate.render();
}

Team.prototype.tpl = function() {
  jQuery('#score-' + (this.id == 0 ? 'a' : 'b')).text(this.score);
}