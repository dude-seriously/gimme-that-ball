function Team(id, name) {
  this.id = id;
  this.name = name;
  this.gate = new Gate(this);
  this.players = new Players();
};

Team.prototype.join = function(player) {
  this.players.push(player);
}

Team.prototype.leave = function(player) {
  this.players.pull(player);
}

Team.prototype.update = function() {
  this.gate.update();
}

Team.prototype.render = function() {
  this.gate.render();
}