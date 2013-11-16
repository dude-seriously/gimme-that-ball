function Game() {
  this.pads = { };
}

Game.prototype.init = function() {
  teams.init();
  this.loop();
}

Game.prototype.loop = function() {
  requestAnimFrame(this.loop.bind(this));

  var pads = Gamepad.getStates();
  var i = pads.length;
  while(i--) {
    if (pads[i]) {
      if (! this.pads[pads[i].name]) {
        var player = new Player();
        player.gamePad = pads[i];
        players.push(player);

        this.pads[pads[i].name] = player;
        console.log('new player');
      }
    }
  }

  world.update();
  ball.update();
  players.update();
  teams.update();

  world.phys();

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  world.render();
  players.render();
  ball.render();
  teams.render();
}

var game = new Game();
game.init();