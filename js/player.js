var playerIDs = 0;
var moveSpeed = 5;

var playerImage = new Image();
var playerImageJump = new Image();
playerImage.src = "./img/player.png";
playerImageJump.src = "./img/player_jump.png";

var playerHeight = 60;
var playerWidth = 36;

var lobbyPlayers = jQuery('#lobby-players');

function Player(ind) {
  this.id = ++playerIDs;
  this.type = 'player';
  this.ind = ind;
  this.team = null;
  this.gamePad = null;
  this.ready = false;

  this.x = 0;
  this.y = 0;

  var fixDef = new b2FixtureDef;
  fixDef.density = 1.0;
  fixDef.friction = 0.5;
  fixDef.restitution = 0.2;

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
        if (gamePadMaster == this.gamePad && gamePadMaster.leftShoulder0) return;

        if (Math.abs(this.gamePad.leftStickX) > .2) {

          // this.phys.WakeUp();

          var vel = this.phys.GetLinearVelocity();

          vel.x = this.gamePad.leftStickX * moveSpeed;

          this.phys.SetLinearVelocity(vel);
          // pos.x += this.gamePad.leftStickX * moveSpeed;

          // this.phys.SetOriginPosition(pos, 0);
          this.x += this.gamePad.leftStickX * moveSpeed;
        }
        if (Math.abs(this.gamePad.leftStickY) > .2) {
          // this.phys.WakeUp();
          // var vel = this.phys.GetLinearVelocity();

          // vel.y = this.gamePad.leftStickY * moveSpeed;

          // this.phys.SetLinearVelocity(vel);
          // this.y += this.gamePad.leftStickY * moveSpeed;
        }

        if (this.gamePad.faceButton0 > 0 && this.jumping == false) {
          this.jumping = true;

          // this.phys.WakeUp();
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

    var pos = this.phys.GetPosition();
    var rot = this.phys.GetAngle();

    this.x = pos.x / pf;
    this.y = pos.y / pf;

    ctx.translate(pos.x / pf, pos.y / pf);
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