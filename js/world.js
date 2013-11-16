function World() {
  this.border = 32;
  this.left = -1024;
  this.right = 1024;
  this.top = -512;
  this.bottom = 256;

  this.props = new Collection();

  // box2d

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