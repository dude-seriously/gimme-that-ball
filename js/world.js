var pf = .01;

function World() {
  this.border = 32;
  this.left = -2048;
  this.right = 2048;
  this.top = -512;
  this.bottom = 256;

  this.width = this.right - this.left;
  this.height = this.bottom - this.top;

  this.props = new Collection();

  // box2d
  var gravity = new b2Vec2(0, 15);
  this.phys = new b2World(gravity, true);


  // bottom
  var fixDef = new b2FixtureDef;
  fixDef.density = 1.0;
  fixDef.friction = 0.5;
  fixDef.restitution = 0.2;
  var bodyDef = new b2BodyDef;
  bodyDef.type = b2Body.b2_staticBody;
  bodyDef.position.Set((this.right + this.left) / 2, (this.bottom + this.border / 2) * pf);
  fixDef.shape = new b2PolygonShape;
  fixDef.shape.SetAsBox((this.right - this.left + this.border / 2) * pf, this.border / 2 * pf);
  this.phys.CreateBody(bodyDef).CreateFixture(fixDef);

  // bottom
  var fixDef = new b2FixtureDef;
  fixDef.density = 1.0;
  fixDef.friction = 0.5;
  fixDef.restitution = 0.2;
  var bodyDef = new b2BodyDef;
  bodyDef.type = b2Body.b2_staticBody;
  bodyDef.position.Set((this.right + this.left) / 2, (this.top - this.border / 2) * pf);
  fixDef.shape = new b2PolygonShape;
  fixDef.shape.SetAsBox((this.right - this.left + this.border / 2) * pf, this.border / 2 * pf);
  this.phys.CreateBody(bodyDef).CreateFixture(fixDef);

  // right
  var fixDef = new b2FixtureDef;
  fixDef.density = 1.0;
  fixDef.friction = 0.5;
  fixDef.restitution = 0.2;
  var bodyDef = new b2BodyDef;
  bodyDef.type = b2Body.b2_staticBody;
  bodyDef.position.Set((this.right + this.border / 2) * pf, (this.top - this.border / 2) * pf);
  fixDef.shape = new b2PolygonShape;
  fixDef.shape.SetAsBox(this.border / 2 * pf, (this.bottom - this.top) * pf);
  this.phys.CreateBody(bodyDef).CreateFixture(fixDef);

  // left
  var fixDef = new b2FixtureDef;
  fixDef.density = 1.0;
  fixDef.friction = 0.5;
  fixDef.restitution = 0.2;
  var bodyDef = new b2BodyDef;
  bodyDef.type = b2Body.b2_staticBody;
  bodyDef.position.Set((this.left - this.border / 2) * pf, (this.top - this.border / 2) * pf);
  fixDef.shape = new b2PolygonShape;
  fixDef.shape.SetAsBox(this.border / 2 * pf, (this.bottom - this.top) * pf);
  this.phys.CreateBody(bodyDef).CreateFixture(fixDef);


  this.contactListener = new Box2D.Dynamics.b2ContactListener;
  this.contactListener.BeginContact = function(contact, manifold) {
     if (contact.m_fixtureA.m_body.link && contact.m_fixtureA.m_body.link.collide) {
        contact.m_fixtureA.m_body.link.collide(contact);
     }
  };
  this.contactListener.PreSolve = function(contact, oldManifold) {
    if ((contact.m_fixtureA.m_body.link && contact.m_fixtureA.m_body.link.disabled) ||
        (contact.m_fixtureB.m_body.link && contact.m_fixtureB.m_body.link.disabled)) {
      contact.SetEnabled(false);
    }
  }
  this.phys.SetContactListener(this.contactListener);
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