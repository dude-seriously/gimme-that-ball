var playerIDs = 0;
var moveSpeed = 2;
var jumpFactor = 7;
var dashFactor = 5;
var cantGrabThrowDelay = 500;
var cantGrabKickDelay = 1000;
var randomSpeechDelay = 500;
var controllerFlip = 1;

var playerImage = new Image();
var playerImageJump = new Image();
playerImage.src = "./img/player.png";
playerImageJump.src = "./img/player_jump.png";
var playerBImage = new Image();
var playerBImageJump = new Image();
playerBImage.src = "./img/playerb.png";
playerBImageJump.src = "./img/playerb_jump.png";

var hats = [];

for (var i = 0; i < 6; i++) {
  hats[i] = new Image(0);
  hats[i].src = "./img/hat" + (i+1) + ".png";
}

function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

hats = shuffle(hats);


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

  this.cantGrabLast = 0;
  this.cantGrab = false;

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

  this.speeched = false;
  this.nextSpeech = 0;
  this.lastRandomSpeech = 0;
  // console.log(this.phys.setContactListener)
}

Player.prototype.collide = function(contact) {
  var body = contact.m_fixtureB.m_body;
  var link = body.link;

  if (link) {
    if (link.type == 'ball' && ! this.cantGrab) {
      link.grab(this);
    } else if (link.type == 'player') {
      if (link.team !== this.team && (ball.player == link || ball.player == this)) {
        var damager = ball.player == this ? link : this;

        if (damager.phys.GetLinearVelocity().Length() > ball.player.phys.GetLinearVelocity().Length()) {
          var hit = this.phys.GetLinearVelocity().Copy();
          hit.Subtract(link.phys.GetLinearVelocity());
          hit = hit.Length();

          if (hit > 4) {
            var vel = damager.phys.GetLinearVelocity().Copy();
            ball.player.makeASpeech('hit');
            ball.drop(vel);

            camera.shaking = Math.floor(Math.random() * 10 + 5);
          }
        }
      }
    }
  }
}

Player.prototype.update = function() {
  if (this.energy < maxEnergy) {
    this.energy++;
  }

  if (this.cantGrab && this.cantGrabLast < now) {
    this.cantGrab = false;
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
        if (! this.ready && (this.gamePad.start || this.gamePad.faceButtom0) && this.team) {
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

          if ( (this.gamePad.leftStickX*controllerFlip < 0 && vel.x > -currMaxSpeed) || (this.gamePad.leftStickX*controllerFlip > 0 && vel.x < currMaxSpeed) ) {
            this.phys.ApplyForce(new b2Vec2(this.gamePad.leftStickX*controllerFlip * moveSpeed * 10,0),this.phys.GetWorldCenter())
          }

        }

        // JUMP

        if (this.gamePad.faceButton0 > 0 && this.energy >= 50 && ((new Date()).valueOf() - this.last_jump > 300)) {

          if (this.jumping == false) {
            this.last_jump = (new Date()).valueOf();
            this.jumping = true;
            this.energy -= 50;
            var vel = this.phys.GetLinearVelocity();

            var impulse = this.phys.GetMass() * jumpFactor;
            this.phys.ApplyImpulse(new b2Vec2(0,-impulse * world.gravity_shift), this.phys.GetWorldCenter());
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

        // SPEECH BUBBLE
        if (this.gamePad.faceButton3) {
          this.makeASpeech('random');
        } else {
          this.speeched = false;
        }

        if (this.nextRandomSpeech < now) {
          this.makeASpeech();
        }

      break;
    }
  }

  ! this.gamePad.faceButton1 && this.phys.SetAngle(world.angle);
}

Player.prototype.makeASpeech = function(type, force) {
  if (((! this.speeched && this.nextSpeech < now) || force) &&  (Math.floor(Math.random() * 3) % 3 == 1)) {
    this.nextRandomSpeech = Math.floor(now + 5000 + Math.random() * 5000);
    this.nextSpeech = now + Math.floor(Math.random() * randomSpeechDelay + randomSpeechDelay * .5);
    this.speeched = true;

    if (! type) {
      type = ((this.team == teams.a() && this.team.score > teams.b().score) || (this.team == teams.b() && this.team.score > teams.b().score)) ? 'random happy' : 'random sad';
    }
    var ind = Math.floor(Math.random() * SpeechBubbleQuotes[type].length);

    var self = this;
    bubbles.forEach(function(bubble) {
      if (bubble.player == self) {
        bubble.expire = 0;
      }
    });

    new Bubble(this, SpeechBubbleQuotes[type][ind]);
  }
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

    var energyLeft = this.energy / maxEnergy * playerWidth;
    ctx.beginPath();
    ctx.rect(-energyLeft * .5, - playerHeight / 2 - 12, energyLeft, 4);
    ctx.globalAlpha = .5;
    ctx.fillStyle = this.team.id == 0 ? '#f60' : '#06f';
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.rotate(rot);

    if (this.team.id == 0) {
      var img = (this.jumping) ? playerImageJump : playerImage;
    } else {
      var img = (this.jumping) ? playerBImageJump : playerBImage;
    }


    if (this.cantGrab && now % 200 > 100) {
      ctx.globalAlpha = .1;
    }

    ctx.scale(this.moveLeft ? -1 : 1, 1);
    ctx.drawImage(img, -(playerWidth/2), -(playerHeight/2));
    ctx.drawImage(hats[this.id-1], -(playerWidth/2), -playerHeight*1.5);

    ctx.restore();
  }
}

Player.prototype.tpl = function() {
  this.div = jQuery('<div class="player"><span class="number">' + (this.ind + 1) + '</span></div>');
  this.div.appendTo(lobbyPlayers);
}