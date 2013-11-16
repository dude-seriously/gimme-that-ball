var ballSize = 32;
var ballThrowPower = 2;

function Ball() {
  //this.phys =
  this.x = 50;
  this.y = 0;
  this.type = 'ball';

  this.fixture = new b2FixtureDef;
  this.fixture.density = 1.0;
  this.fixture.friction = 0.01;
  this.fixture.restitution = 0.8;

  this.box = new b2BodyDef();

  this.fixture.shape = new b2CircleShape;
  this.fixture.shape.m_radius = ballSize / 2 * pf;
  // fixture.shape = new b2PolygonShape;
  // fixture.shape.SetAsBox(ballSize / 2 * pf, ballSize / 2 * pf);
  this.box.position.x = this.x * pf;
  this.box.position.y = this.y * pf;
  this.box.type = b2Body.b2_dynamicBody;

  this.phys = world.phys.CreateBody(this.box);
  this.phys.CreateFixture(this.fixture);

  this.phys.link = this;

  this.player;
}

Ball.prototype.update = function() {
  if (this.player) {
    if (this.player.gamePad && this.player.gamePad.rightShoulder1 > 0.1) {
      var vel = this.player.phys.GetLinearVelocity().Copy();
      vel.Multiply(ballThrowPower);

      var posOff = vel.Copy();
      posOff.Normalize();
      posOff.Multiply(32);

      this.phys.SetPosition(new b2Vec2((this.player.x + posOff.x * .6) * pf, ((this.player.y + posOff.y) * pf)));
      this.phys.SetLinearVelocity(vel);
      // this.phys.SetLinearVelocity(new b2Vec2((Math.random() * 2 - 1.0) * ballThrowPower, (Math.random() * 2 - 1.0) * ballThrowPower));

      this.disabled = false;
      this.player = null;
    } else {
      this.phys.SetPosition(new b2Vec2(this.player.x * pf, this.player.y * pf));
      this.phys.SetLinearVelocity(new b2Vec2(0, 0));
    }
  }
}

Ball.prototype.render = function() {
  ctx.save();

  var pos = this.phys.GetPosition();
  if (this.player) {
    pos = this.player.phys.GetPosition();
  }
  var rot = this.phys.GetAngle();

  this.x = pos.x / pf;
  this.y = pos.y / pf;

  ctx.beginPath();
  ctx.translate(pos.x / pf, pos.y / pf);
  ctx.rotate(rot);
  ctx.arc(0, 0, ballSize / 2, 0, 2 * Math.PI, false);
  ctx.fillStyle = '#fff';
  ctx.fill();
  // ctx.drawImage(playerImage, -(playerWidth/2), -(playerHeight/2));

  // if (this.team.id == 1) {
  //   ctx.fillStyle = '#06f';
  // } else {
  //   ctx.fillStyle = '#f60';
  // }

  ctx.restore();
}

Ball.prototype.grab = function(player) {
  if (this.player) return;

  this.player = player;
  this.disabled = true;
}

var ball = new Ball();