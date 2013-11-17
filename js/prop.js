var propTypes = {
  'seesaw': {
  	x: 150,
  	y: 150,
    width: 200,
    height: 20,
    fixed: true,
    image: '',
    color: "#880015",
    upd: function() {

    	this.phys.SetAngle(Math.sin(this.step/20));
    }
  },
  'big seesaw': {
  	x: 150,
  	y: 50,
    width: 450,
    height: 40,
    fixed: true,
    image: '',
    color: "#69002b",
    upd: function() {

    	this.phys.SetAngle(Math.sin(this.step/30));
    }
  },
  'spinner': {
  	x: 150,
  	y: 50,
    width: 200,
    height: 20,
    fixed: true,
    image: '',
    color: "#ddd",
    upd: function() {
    	this.phys.SetAngle(Math.cos(this.step/100)*7);
    }
  },
  'boomerang': {
  	x: 150,
  	y: 50,
    width: 200,
    height: 20,
    fixed: true,
    image: '',
    color: "#b97a57",
    upd: function() {

    	this.phys.SetAngle(Math.cos(this.step/100)*7);
    	this.phys.SetPosition(new b2Vec2(this.original_x + Math.cos(this.step/100) * 2, this.original_y));
    }
  },
  'platform': {
  	x: 200,
  	y: 80,
    width: 200,
    height: 20,
    fixed: true,
    image: '',
    color: "#b97a57"
  },
  'vertical platform': {
  	x: 80,
  	y: 250,
    width: 20,
    height: 300,
    fixed: true,
    image: '',
    color: "#b97a57"
  },
  'hovering platform': {
  	x: 150,
  	y: 50,
    width: 200,
    height: 20,
    fixed: true,
    image: '',
    color: "#b97a57",
    upd: function() {
    	this.phys.SetPosition(new b2Vec2(this.original_x, this.original_y + Math.cos(this.step/20) * 0.2));
    }
  }
};


var propIDs = 0;

function Prop(opt) {
  this.id = ++propIDs;

  this.width = opt.width;
  this.height = opt.height;

  this.color = opt.color;

  this.step = 0;

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
  fixDef.friction = opt.friction || 0.5;
  fixDef.restitution = opt.restitution || 0.2;

  this.box = new b2BodyDef();

  if (! opt.fixed) this.box.type = b2Body.b2_dynamicBody;

  fixDef.shape = new b2PolygonShape;
  fixDef.shape.SetAsBox(opt.width / 2 * pf, opt.height / 2 * pf);
  this.box.position.x = this.original_x = opt.x * pf;
  this.box.position.y = this.original_y = opt.y * pf;

  this.phys = world.phys.CreateBody(this.box);
  this.phys.CreateFixture(fixDef);
}

Prop.prototype.update = function() {
  this.step++;
  if (this.upd) this.upd.call(this);
}

Prop.prototype.render = function() {
  ctx.save();

  var pos = this.phys.GetPosition();
  var rot = this.phys.GetAngle();

  ctx.translate(pos.x / pf, pos.y / pf);
  ctx.rotate(rot);

  ctx.beginPath();
  ctx.fillStyle = this.color || '#06f';
  ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
  ctx.fill();

  ctx.restore();
}