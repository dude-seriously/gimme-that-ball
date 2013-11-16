var pf = .01;

function World() {
  this.border = 32;
  this.left = -1024;
  this.right = 1024;
  this.top = -512;
  this.bottom = 256;

  this.props = new Collection();

  // box2d
  var gravity = new b2Vec2(0, 10);
  this.phys = new b2World(gravity, true);

  var fixDef = new b2FixtureDef;
  fixDef.density = 1.0;
  fixDef.friction = 0.5;
  fixDef.restitution = 0.2;

  var bodyDef = new b2BodyDef;

  //create ground
  bodyDef.type = b2Body.b2_staticBody;
  bodyDef.position.Set(0, (this.bottom + 32) * pf);
  fixDef.shape = new b2PolygonShape;
  fixDef.shape.SetAsBox((this.right - this.left) * pf, 32 * pf);
  this.phys.CreateBody(bodyDef).CreateFixture(fixDef);
}

World.prototype.addProp = function(opt) {
  this.props.push(new Prop(opt));
}

World.prototype.updatePhys = function() {
  this.phys.Step(1/60, 10, 10);
  this.phys.ClearForces();
}

World.prototype.update = function() {
  this.props.forEach(function(prop) {
    prop.update();
  });
}

World.prototype.render = function() {
  ctx.beginPath();
  ctx.moveTo(this.left, this.top);
  ctx.lineTo(this.right, this.top);
  ctx.lineTo(this.right, this.bottom);
  ctx.lineTo(this.left, this.bottom);
  ctx.lineTo(this.left, this.top);

  ctx.strokeStyle = '#000';
  ctx.stroke();

  this.props.forEach(function(prop) {
    prop.render();
  });
}


var world = new World();