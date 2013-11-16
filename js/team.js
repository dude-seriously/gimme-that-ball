function Team(id, name) {
  this.id = id;
  this.name = name;
  this.gate = new Gate(this);
  this.players = new Players();
  this.count = 0;
};

Team.prototype.join = function(player) {
  if (this.count < 2) {
    this.players.push(player);
    player.team = this;
    ++this.count;
  }
}

Team.prototype.leave = function(player) {
  if (player.team) {
    --this.count;
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