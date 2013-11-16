function Players() {
  Collection.call(this, 'id');
}
Players.prototype = Object.create(Collection.prototype);

Players.prototype.update = function() {
  this.forEach(function(player) {
    player.update();
  });
}

Players.prototype.render = function() {
  this.forEach(function(player) {
    player.render();
  });
}

var players = new Players();