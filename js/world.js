var pf = .01;

function World() {
  this.border = 32;
  this.left = -1500;
  this.right = 1500;
  this.top = -400;
  this.bottom = 400;
  this.gravityStr = 15;

  this.width = this.right - this.left;
  this.height = this.bottom - this.top;

  this.props = new Collection();

  var pointStep = 128;
  var total = Math.floor(this.width / pointStep);

  this.points = [ ];
  for(var i = 0; i < total; i++) {
    var x = (this.left + pointStep * i + (i !== 0 ? Math.random() * 64 - 32 : 0)) * pf;
    var y = (this.bottom - Math.random() * 100 - (i == 0 ? 100 : 0)) * pf;
    this.points.push(new b2Vec2(x, y));
  }
  this.points.push(new b2Vec2(this.right * pf, (this.bottom - Math.random() * 100 - 100) * pf));

  // box2d
  this.gravity = new b2Vec2(0, 15);
  this.gravityR = this.gravity.Copy();
  this.phys = new b2World(this.gravity, false);

  this.angle = Math.atan2(this.gravity.y, this.gravity.x) - Math.PI / 2
  this.gravity_shift = 1;


  // bottom
  // var fixDef = new b2FixtureDef;
  // fixDef.density = 1.0;
  // fixDef.friction = 0.5;
  // fixDef.restitution = 0.2;
  // var bodyDef = new b2BodyDef;
  // bodyDef.type = b2Body.b2_staticBody;
  // bodyDef.position.Set((this.right + this.left) / 2, (this.bottom + this.border / 2) * pf);
  // fixDef.shape = new b2PolygonShape;
  // fixDef.shape.SetAsBox((this.right - this.left + this.border / 2) * pf, this.border / 2 * pf);
  // this.phys.CreateBody(bodyDef).CreateFixture(fixDef);

  for(var i = 0; i < this.points.length - 1; i++) {
    var fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.Set(0, 0);
    fixDef.shape = new b2PolygonShape;
    var vectors = [
      new b2Vec2(this.points[i].x, this.points[i].y),
      new b2Vec2(this.points[i + 1].x, this.points[i + 1].y),
      new b2Vec2(this.points[i + 1].x, this.bottom * pf),
      new b2Vec2(this.points[i].x, this.bottom * pf)
    ];
    fixDef.shape.SetAsArray(vectors, vectors.length);
    this.phys.CreateBody(bodyDef).CreateFixture(fixDef);
  }

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
    var a = contact.m_fixtureA.m_body.link;
    var b = contact.m_fixtureB.m_body.link;

    if ((a && a.disabled) || (b && b.disabled)) {
      contact.SetEnabled(false);
    } else if (a && a.type == 'ball' && b && b.type == 'player' && b.cantGrab) {
      contact.SetEnabled(false);
    } else if (a && a.type == 'player' && a.cantGrab && b && b.type == 'ball') {
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
  // this.gravityR.x = 0;
  // this.gravityR.y = 15;

  this.gravityR.x += this.gravity.x * .1;
  this.gravityR.y += this.gravity.y * .1;
  this.gravityR.Normalize();
  this.gravityR.Multiply(this.gravityStr);

  if (step % 5 == 1) {
    this.phys.SetGravity(this.gravityR);
  }
  this.angle = Math.atan2(this.gravityR.y, this.gravityR.x) - Math.PI / 2;

  this.props.forEach(function(prop) {
    prop.update();
  });
}

World.prototype.render = function() {
  ctx.save();

  ctx.beginPath();
  ctx.moveTo(this.left, this.top);
  // ctx.lineTo(this.left, this.bottom);

  for(var i = 0; i < this.points.length; i++) {
    ctx.lineTo(this.points[i].x / pf, this.points[i].y / pf);
  }

  // ctx.lineTo(this.right, this.bottom);
  ctx.lineTo(this.right, this.top);
  ctx.lineTo(this.left, this.top);

  ctx.lineWidth = 2;

  ctx.strokeStyle = '#000';
  ctx.stroke();

  ctx.restore();

  this.props.forEach(function(prop) {
    prop.render();
  });
}

var world = new World();