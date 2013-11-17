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

  var i = 30;
  while(i--) {
    if (i == 19) {
      var type = propTypes['boomerang'];
      type.x =  Math.random() * (world.width - 400) + world.left + 200;
      type.y = Math.random() * (world.height-200) + world.top + 100;
      world.addProp(type);
    }else if (i == 18) {
      var type = propTypes['spinner'];
      type.x =  Math.random() * (world.width - 400) + world.left + 200;
      type.y = Math.random() * (world.height-200) + world.top + 100;
      world.addProp(type);
    } else if (i == 17) {
      world.addProp(propTypes['big seesaw']);
    } else if (i%4 == 0) {
      var type = propTypes['hovering platform'];
      type.x =  Math.random() * (world.width - 400) + world.left + 200;
      type.y = Math.random() * (world.height-300) + world.top + 100;
      type.width = Math.floor(Math.random() * 200 + 100);
      world.addProp(type);
    } else if (i%6 == 0) {
      var type = propTypes['vertical platform'];
      type.x =  Math.random() * (world.width - 200) + world.left + 100;
      type.y = -100 + Math.random() * (world.height-500) + world.top + 300;
      type.height = Math.floor(Math.random() * 200 + 50);
    //   world.addProp(type);
    // } else if (i%11 == 0) {
    //   // huge box
    //   var size = Math.random() * 140 + 80
    //   world.addProp({
    //     width: size,
    //     height: size,
    //     fixed: true,
    //     color: "#111111",
    //     x: Math.random() * (world.width - 800) + (world.left + 400),
    //     y: world.height + world.top - size/2
    //   });
    } else {
      var size = Math.random() * 40 + 20
      world.addProp({
        width: size,
        height: size,
        x: Math.random() * (world.width * .5) + (world.left + world.width * .25),
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

        // player.gamePad.leftStickX = (i % 2) * 2 - 1;
        // player.gamePad.start = true;
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
  switch (Math.ceil(Math.random()*9)) {
    case 1:
      world.gravity_shift = -1;
      SetGravity(15, Math.random() * 2 - 1, -15);
      msg = "Gravity flip!"
    break;
    case 2:
      world.gravity_shift = 1;
      SetGravity(5, 0, 15);
      msg = "Moon gravity";
      var target_color = "#111111";
    break;
    case 3:
    case 4:
    case 5:
    case 9:
      world.gravity_shift = 1;
      SetGravity(15, Math.random() * 8 - 4, 15);
      msg = "Let's make it less fair..."
      var target_color = "#503838";

    break;
    case 6:
      world.gravity_shift = 1;
      SetGravity(50, 0, 50);
      msg = "Super magnet"
      var target_color = "#503838";
    break;
    case 7:
      controllerFlip = -1;
      msg = "Reversed controller!"
      var target_color = "#5c4c65";
    break;
    case 8:
      pointFlip = -1;
      msg = "NEGATIVE POINTS!";
      var target_color = "#526251";
    break;
  }
  $("#message").text(msg).fadeIn(1000).fadeOut(2000);
  if (typeof target_color != "undefined") {
    $("body").animate({backgroundColor: target_color})
  }
  setTimeout(normalGravity, 10000 + Math.floor(Math.random() * 10000));
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
  setTimeout(changeGravity, 10000 + Math.floor(Math.random() * 10000));
  controllerFlip = 1;
  pointFlip = 1;
  $("body").animate({backgroundColor: '#323232'})
}

setTimeout(changeGravity, 10000 + Math.floor(Math.random() * 10000));
