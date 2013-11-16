var now = Date.now();
var step = 0;

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

  var i = 20;
  while(i--) {
    if (i == 17) {
      world.addProp(propTypes['big seesaw']);
    } else {
      var size = Math.random() * 50 + 50
      world.addProp({
        width: size,
        height: size,
        x: Math.random() * world.width + world.left,
        y: Math.random() * world.height + world.top
      });
    }
  }
}

Game.prototype.loop = function() {
  requestAnimFrame(this.loop.bind(this));
  now = Date.now();
  step++;

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

        player.gamePad.leftStickX = (i % 2) * 2 - 1;
        player.gamePad.start = true;
      }
    }
  }

  world.update();
  ball.update();
  players.update();
  teams.update();

  world.updatePhys();

  camera.update();

  camera.render();

  world.render();
  players.render();
  ball.render();
  teams.render();
}

var game = new Game();
game.init();