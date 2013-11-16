function World() {
  this.left = -1024;
  this.right = 1024;
  this.top = -512;
  this.bottom = 256;

  this.props = new Collection();

  // box2d

  // var b2d = new b2AABB();
  // b2d.minVertex.Set(this.left, this.top);
  // b2d.maxVertex.Set(this.right, this.bottom + 32);

  var gravity = new b2Vec2(0, 10);
  this.phys = new b2World(gravity, true);

 /* var groundSd = new b2FixtureDef();
  groundSd.extents.Set(this.right - this.left, 32); // Size of ground
  groundSd.restitution = 0.2;

  var groundBd = new b2BodyDef();
  groundBd.AddShape(groundSd);
  groundBd.position.Set(0, this.bottom + 32); // Position
  this.ground = this.phys.CreateBody(groundBd);*/

  var fixDef = new b2FixtureDef;
  fixDef.density = 1.0;
  fixDef.friction = 0.5;
  fixDef.restitution = 0.2;

  var bodyDef = new b2BodyDef;

  //create ground
  bodyDef.type = b2Body.b2_staticBody;
  bodyDef.position.x = 0;
  bodyDef.position.y = this.bottom + 32;
  fixDef.shape = new b2PolygonShape;
  fixDef.shape.SetAsBox(this.right - this.left, 32);
  this.phys.CreateBody(bodyDef).CreateFixture(fixDef);
}

World.prototype.addProp = function(opt) {
  this.props.push(new Prop(opt));
}

World.prototype.updatePhys = function() {
  var stepping = false;
  var timeStep = 1.0/60;
  var iteration = 1;
  this.phys.Step(1/60, 10, 10);
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