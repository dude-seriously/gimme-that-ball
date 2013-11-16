function Game() {
  this.pads = { };
  this.state = 'lobby';
}

var gamePadMaster = null;

Game.prototype.init = function() {
  teams.init();
  this.loop();

  // var i = 10;
  // while(i--) {
  //   var player = new Player();
  //   player.x = Math.random() * 500 - 250;
  //   player.y = Math.random() * 500 - 250;
  //   players.push(player);
  // }

  var i = 10;
  while(i--) {
    world.addProp({
      width: 50,
      height: 50,
      x: Math.random() * 400 - 200,
      y: Math.random() * 400 - 200
    });
  }
}

Game.prototype.loop = function() {
  requestAnimFrame(this.loop.bind(this));

  var pads = Gamepad.getStates();
  var i = pads.length;
  while(i--) {
    if (pads[i]) {
      if (! this.pads[pads[i].name]) {
        var player = new Player(i);
        player.gamePad = pads[i];
        players.push(player);

        this.pads[pads[i].name] = player;
        console.log('new player');

        if (! gamePadMaster && i == 0) {
          gamePadMaster = pads[i];
        }
      }
    }
  }

  world.update();
  ball.update();
  players.update();
  teams.update();

  world.updatePhys();

  camera.render();

  world.render();
  players.render();
  ball.render();
  teams.render();
}

var game = new Game();
game.init();