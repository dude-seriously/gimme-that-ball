var playerIDs = 0;
var moveSpeed = 2;
var jumpFactor = 6;
var dashFactor = 4;

var playerImage = new Image();
var playerImageJump = new Image();
playerImage.src = "./img/player.png";
playerImageJump.src = "./img/player_jump.png";
var playerBImage = new Image();
var playerBImageJump = new Image();
playerBImage.src = "./img/playerb.png";
playerBImageJump.src = "./img/playerb_jump.png";

var playerHeight = 60;
var playerWidth = 36;

var lobbyPlayers = jQuery('#lobby-players');

var maxSpeed = 3;
var maxEnergy = 100;

function Player(ind) {
  this.id = ++playerIDs;
  this.type = 'player';
  this.ind = ind;
  this.team = null;
  this.gamePad = null;
  this.ready = false;
  this.jumping = false;
  this.dashing = false;

  this.last_dash = 0;
  this.last_jump = 0;

  this.energy = maxEnergy;

  this.x = 0;
  this.y = 0;

  this.moveLeft = true;

  var fixDef = new b2FixtureDef;
  fixDef.density = 1.0;
  fixDef.friction = .8;
  fixDef.restitution = .1;

  this.box = new b2BodyDef();

  fixDef.shape = new b2PolygonShape;
  fixDef.shape.SetAsBox((playerWidth / 2) * pf, (playerHeight / 2) * pf);
  this.box.position.x = this.x * pf;
  this.box.position.y = this.y * pf;
  this.box.type = b2Body.b2_dynamicBody;

  this.tpl();
  this.phys = world.phys.CreateBody(this.box);
  this.phys.CreateFixture(fixDef);

  this.phys.link = this;
  // console.log(this.phys.setContactListener)
}

Player.prototype.collide = function(contact) {
  var body = contact.m_fixtureB.m_body;
  var link = body.link;

  if (link) {
    if (link.type == 'ball') {
      link.grab(this);
    }
  }
}

Player.prototype.update = function() {
  if (this.energy < maxEnergy) {
    this.energy++;
  }

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
        // if (gamePadMaster == this.gamePad && gamePadMaster.leftShoulder1) return;

        if (Math.abs(this.gamePad.leftStickX) > .2) {

          var vel = this.phys.GetLinearVelocity();

          var currMaxSpeed = (ball.player == this) ? maxSpeed * 0.8 : maxSpeed;

          if ( (this.gamePad.leftStickX < 0 && vel.x > -currMaxSpeed) || (this.gamePad.leftStickX > 0 && vel.x < currMaxSpeed) ) {
            this.phys.ApplyForce(new b2Vec2(this.gamePad.leftStickX * moveSpeed * 10,0),this.phys.GetWorldCenter())
          }

        }

        // JUMP

        if (this.gamePad.faceButton0 > 0 && this.energy >= 50) {

          if (this.jumping == false) {
            this.jumping = true;
            this.energy -= 50;
            var vel = this.phys.GetLinearVelocity();

            var impulse = this.phys.GetMass() * jumpFactor;
            this.phys.ApplyImpulse(new b2Vec2(0,-impulse), this.phys.GetWorldCenter());
          }

        } else {
          this.jumping = false;
        }

        // DASH

        if (ball.player != this && ((new Date()).valueOf() - this.last_dash > 1000)) {

          if (this.gamePad.leftShoulder0) {
            if (this.dashing == false) {
              this.last_dash = (new Date()).valueOf();
              this.dashing = true;
              // var vel = this.phys.GetLinearVelocity();
              // vel.x = -5;
              var impulse = this.phys.GetMass() * dashFactor;
              this.phys.ApplyImpulse(new b2Vec2(-impulse,0), this.phys.GetWorldCenter());
            }
          } else if (this.gamePad.rightShoulder0) {
            if (this.dashing == false) {
              this.last_dash = (new Date()).valueOf();
              this.dashing = true;
              // var vel = this.phys.GetLinearVelocity();
              // vel.x = 5;
              var impulse = this.phys.GetMass() * dashFactor;
              this.phys.ApplyImpulse(new b2Vec2(impulse,0), this.phys.GetWorldCenter());
            }
          } else {
            this.dashing = false;
          }
        }



      break;
    }
  }

  !this.gamePad.faceButton1 && this.phys.SetAngle(0);
}

Player.prototype.jump = function() {

}

Player.prototype.render = function() {
  if (this.team) {
    ctx.save();

    var pos = this.phys.GetPosition();
    var rot = this.phys.GetAngle();

    if (Math.abs(this.phys.GetLinearVelocity().x) > .1) {
      this.moveLeft = this.phys.GetLinearVelocity().x < 0;
    }

    this.x = pos.x / pf;
    this.y = pos.y / pf;

    ctx.translate(pos.x / pf, pos.y / pf);
    ctx.rotate(rot);

    if (this.team.id == 0) {
      var img = (this.jumping) ? playerImageJump : playerImage;
    } else {
      var img = (this.jumping) ? playerBImageJump : playerBImage;
    }

    ctx.scale(this.moveLeft ? -1 : 1, 1);
    ctx.drawImage(img, -(playerWidth/2), -(playerHeight/2));

    ctx.restore();
  }
}

Player.prototype.tpl = function() {
  this.div = jQuery('<div class="player"><span class="number">' + (this.ind + 1) + '</span></div>');
  this.div.appendTo(lobbyPlayers);
}