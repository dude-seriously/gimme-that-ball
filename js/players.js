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

Players.prototype.checkReady = function() {
  if (game.state == 'lobby') {
    var ready = true;
    this.forEach(function(player) {
      if (player.ready) return;
      ready = false;
    });

    if (! ready) return;

    game.state = 'game';
    jQuery('#lobby').removeClass('active');
    jQuery('#overlay').removeClass('active');
  }
}

var players = new Players();