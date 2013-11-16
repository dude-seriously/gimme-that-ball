var playerIDs = 0;
var moveSpeed = 500;

var playerImage = new Image();
var playerImageJump = new Image();
playerImage.src = "./img/player.png";
playerImageJump.src = "./img/player_jump.png";

var playerHeight = 60;
var playerWidth = 36;

var lobbyPlayers = jQuery('#lobby-players');

function Player(ind) {
  this.id = ++playerIDs;
  this.ind = ind;
  this.team = null;
  this.gamePad = null;
  this.ready = false;

  this.x = 0;
  this.y = 0;

  this.box = new b2BoxDef();
  this.box.density = 1.0;
  this.box.friction = 5;
  this.box.extents.Set(playerWidth / 2, playerHeight / 2);

  this.body = new b2BodyDef();
  this.body.AddShape(this.box);
  this.body.position.Set(this.x, this.y);

  this.phys = world.phys.CreateBody(this.body);

  this.jumping = false;

  this.tpl();
}

Player.prototype.update = function() {
  if (this.gamePad) {
    switch(game.state) {
      case 'lobby':
        if (Math.abs(this.gamePad.leftStickX) > .3) {
          if (this.gamePad.leftStickX < 0) {
            if (! this.team) {
              teams.a().join(this);
              this.ready = false;
              this.div.removeClass('ready');
              this.div.detach().appendTo(jQuery('#lobby-team-a'));
            } else if(this.team.id == 1) {
              this.team.leave(this);
            }
          } else {
            if (! this.team) {
              teams.b().join(this);
              this.ready = false;
              this.div.removeClass('ready');
              this.div.detach().appendTo(jQuery('#lobby-team-b'));
            } else if (this.team.id == 0) {
              this.team.leave(this);
            }
          }
        }
        if (! this.ready && this.gamePad.start && this.team) {
          this.ready = true;
          this.div.addClass('ready');
          players.checkReady();
        }
        break;
      case 'game':
        if (gamePadMaster == this.gamePad && gamePadMaster.leftShoulder0) return;

        if (Math.abs(this.gamePad.leftStickX) > .2) {

          this.phys.WakeUp();

          var vel = this.phys.GetLinearVelocity();

          vel.x = this.gamePad.leftStickX * moveSpeed;

          this.phys.SetLinearVelocity(vel);
          // pos.x += this.gamePad.leftStickX * moveSpeed;

          // this.phys.SetOriginPosition(pos, 0);
          this.x += this.gamePad.leftStickX * moveSpeed;
        }
        if (Math.abs(this.gamePad.leftStickY) > .2) {
          this.phys.WakeUp();
          // var vel = this.phys.GetLinearVelocity();

          // vel.y = this.gamePad.leftStickY * moveSpeed;

          // this.phys.SetLinearVelocity(vel);
          // this.y += this.gamePad.leftStickY * moveSpeed;
        }

        if (this.gamePad.faceButton0 > 0 && this.jumping == false) {
          this.jumping = true;

          this.phys.WakeUp();
          var vel = this.phys.GetLinearVelocity();

          vel.y = -moveSpeed/2;

          this.phys.SetLinearVelocity(vel);

          // var impulse = this.phys.GetMass() * 10;

          // this.phys.ApplyImpulse( new b2Vec2(100,-500), this.phys.GetCenterPosition() );

        } else {
          this.jumping = false;
        }
        break;
    }
  }
}

Player.prototype.jump = function() {

}

Player.prototype.render = function() {
  if (this.team) {
    ctx.save();

    var pos = this.phys.GetOriginPosition();
    var rot = this.phys.GetRotation();

    ctx.translate(pos.x, pos.y);
    ctx.rotate(rot);
    ctx.drawImage(playerImage, -(playerWidth/2), -(playerHeight/2));

    // if (this.team.id == 1) {
    //   ctx.fillStyle = '#06f';
    // } else {
    //   ctx.fillStyle = '#f60';
    // }

    ctx.restore();
  }
}


Player.prototype.tpl = function() {
  this.div = jQuery('<div class="player"><span class="number">' + (this.ind + 1) + '</span></div>');
  this.div.appendTo(lobbyPlayers);
}