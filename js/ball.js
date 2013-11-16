var ballSize = 32;

function Ball() {
  //this.phys =
  this.x = 0;
  this.y = 0;

  var fixture = new b2FixtureDef;
  fixture.density = 1.0;
  fixture.friction = 0.01;
  fixture.restitution = 0.8;

  this.box = new b2BodyDef();

  fixture.shape = new b2CircleShape;
  fixture.shape.m_radius = ballSize / 2 * pf;
  // fixture.shape = new b2PolygonShape;
  // fixture.shape.SetAsBox(ballSize / 2 * pf, ballSize / 2 * pf);
  this.box.position.x = this.x * pf;
  this.box.position.y = this.y * pf;
  this.box.type = b2Body.b2_dynamicBody;

  this.phys = world.phys.CreateBody(this.box);
  this.phys.CreateFixture(fixture);
}

Ball.prototype.update = function() {

}

Ball.prototype.render = function() {
  ctx.save();

  var pos = this.phys.GetPosition();
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

var ball = new Ball();