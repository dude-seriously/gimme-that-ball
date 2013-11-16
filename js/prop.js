var propTypes = {
  'door': {
    width: 100,
    height: 200,
    image: '',
    upd: function() {

    }
  }
};


var propIDs = 0;

function Prop(opt) {
  this.id = ++propIDs;

  this.width = opt.width;
  this.height = opt.height;

  if (opt.upd) {
    this.upd = opt.upd;
  }

  // this.box = new b2BoxDef();
  // if (! opt.fixed) this.box.density = 1.0;
  // this.box.extents.Set(opt.width / 2, opt.height / 2);

  // this.body = new b2BodyDef();
  // this.body.AddShape(this.box);
  // this.body.position.Set(opt.x, opt.y);

  // this.phys = world.phys.CreateBody(this.body);


  var fixDef = new b2FixtureDef;
  fixDef.density = 1.0;
  fixDef.friction = 0.5;
  fixDef.restitution = 0.2;

  this.box = new b2BodyDef();

  if (! opt.fixed) this.box.type = b2Body.b2_dynamicBody;

  fixDef.shape = new b2PolygonShape;
  fixDef.shape.SetAsBox(opt.width / 2 * pf, opt.height / 2 * pf);
  this.box.position.x = opt.x * pf;
  this.box.position.y = opt.y * pf;

  this.phys = world.phys.CreateBody(this.box);
  this.phys.CreateFixture(fixDef);
}

Prop.prototype.update = function() {
  if (this.upd) this.upd.call(this);
}

Prop.prototype.render = function() {
  ctx.save();

  var pos = this.phys.GetPosition();
  var rot = this.phys.GetAngle();

  ctx.translate(pos.x / pf, pos.y / pf);
  ctx.rotate(rot);

  ctx.beginPath();
  ctx.fillStyle = '#06f';
  ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
  ctx.fill();

  ctx.restore();
}