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
    if (i == 19) {
      var type = propTypes['boomerang'];
      type.x =  Math.random() * world.width + world.left;
      type.y = Math.random() * (world.height-100) + world.top;
      world.addProp(type);
    }else if (i == 18) {
      var type = propTypes['spinner'];
      type.x =  Math.random() * world.width + world.left;
      type.y = Math.random() * (world.height-100) + world.top;
      world.addProp(type);
    } else if (i == 17) {
      world.addProp(propTypes['big seesaw']);
    } else if (i%3 == 0) {
      var type = propTypes['platform'];
      type.x =  Math.random() * world.width + world.left;
      type.y = Math.random() * (world.height-100) + world.top;
      world.addProp(type);
    } else if (i%5 == 0) {
      var type = propTypes['vertical platform'];
      type.x =  Math.random() * world.width + world.left;
      type.y = -100 + Math.random() * (world.height-100) + world.top;
      world.addProp(type);
    } else if (i%11 == 0) {
      var size = Math.random() * 200 + 200
      world.addProp({
        width: size,
        height: size,
        fixed: true,
        color: "#111111",
        x: Math.random() * world.width + world.left,
        y: world.height + world.top - size/2
      });
    } else {

      var size = Math.random() * 50 + 80
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
  bubbles.update();
  teams.update();

  world.updatePhys();

  camera.update();

  camera.render();

  world.render();
  players.render();
  ball.render();
  bubbles.render();
  teams.render();
}

var game = new Game();
game.init();

function changeGravity() {
  var msg;
  switch (Math.ceil(Math.random()*3)) {
    case 1:
      world.gravity_shift = -1;
      SetGravity(15, Math.random() * 2 - 1, -15);
      msg = "Gravity flip!"
    break;
    case 2:
      world.gravity_shift = 1;
      SetGravity(5, 0, 15);
      msg = "Moon gravity"
    break;
    case 3:
      world.gravity_shift = 1;
      SetGravity(15, Math.random() * 15 - 7, 15);
      msg = "Getting windy..."
    break;
  }
  $("#message").text(msg).fadeIn(1000).fadeOut(2000);
  setTimeout(normalGravity, 2000);
}

function SetGravity(str, x, y) {
  world.gravityStr = str;
  world.gravity.x = x;
  world.gravity.y = y;
}

function normalGravity() {
  $("#message").text("Back to normal!").fadeIn(1000).fadeOut(2000);
  world.gravity_shift = 1;
  SetGravity(15, 0, 15);
  setTimeout(changeGravity, 2000);
}

setTimeout(changeGravity, 2000);