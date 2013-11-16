var playerIDs = 0;
var moveSpeed = 2;

var playerImage = new Image();
var playerImageJump = new Image();
playerImage.src = "./img/player.png";
playerImageJump.src = "./img/player_jump.png";

var playerHeight = 60;
var playerWidth = 36;

var lobbyPlayers = jQuery('#lobby-players');

var maxSpeed = 3;

function Player(ind) {
  this.id = ++playerIDs;
  this.type = 'player';
  this.ind = ind;
  this.team = null;
  this.gamePad = null;
  this.ready = false;
  this.jumping = false;
  this.dashing = false;

  this.x = 0;
  this.y = 0;

  var fixDef = new b2FixtureDef;
  fixDef.density = 1.0;
  fixDef.friction = 1;
  fixDef.restitution = 0;

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
        if (gamePadMaster == this.gamePad && gamePadMaster.leftShoulder1) return;

        if (Math.abs(this.gamePad.leftStickX) > .2) {

          var vel = this.phys.GetLinearVelocity();

          var currMaxSpeed = (ball.player == this) ? maxSpeed * 0.8 : maxSpeed;

          if ( (this.gamePad.leftStickX < 0 && vel.x > -currMaxSpeed) || (this.gamePad.leftStickX > 0 && vel.x < currMaxSpeed) ) {
            this.phys.ApplyForce(new b2Vec2(this.gamePad.leftStickX * moveSpeed * 10,0),this.phys.GetWorldCenter())
          }

        }

        // JUMP

        if (this.gamePad.faceButton0 > 0) {

          if (this.jumping == false) {
            this.jumping = true;

            var vel = this.phys.GetLinearVelocity();

            var impulse = this.phys.GetMass() * 4;
            this.phys.ApplyImpulse(new b2Vec2(0,-impulse), this.phys.GetWorldCenter());
          }

        } else {
          this.jumping = false;
        }

        // DASH

        if (ball.player != this) {

          if (gamePadMaster.leftShoulder0) {
            if (this.dashing == false) {
              this.dashing = true;
              // var vel = this.phys.GetLinearVelocity();
              // vel.x = -5;
              var impulse = this.phys.GetMass() * 10;
              this.phys.ApplyImpulse(new b2Vec2(-impulse,0), this.phys.GetWorldCenter());
            }
          } else if (gamePadMaster.rightShoulder0) {
            if (this.dashing == false) {
              this.dashing = true;
              // var vel = this.phys.GetLinearVelocity();
              // vel.x = 5;
              var impulse = this.phys.GetMass() * 10;
              this.phys.ApplyImpulse(new b2Vec2(impulse,0), this.phys.GetWorldCenter());
            }
          } else {
            this.dashing = false;
          }
        }



      break;
    }
  }

  this.phys.SetAngle(0);
}

Player.prototype.jump = function() {

}

Player.prototype.render = function() {
  if (this.team) {
    ctx.save();

    var pos = this.phys.GetPosition();
    var rot = this.phys.GetAngle();

    this.x = pos.x / pf;
    this.y = pos.y / pf;

    ctx.translate(pos.x / pf, pos.y / pf);
    ctx.rotate(rot);
    var img = (this.jumping) ? playerImageJump : playerImage;
    ctx.drawImage(img, -(playerWidth/2), -(playerHeight/2));

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