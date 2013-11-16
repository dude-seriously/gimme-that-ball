var propIDs = 0;

function Prop(opt) {
  this.id = ++propIDs;

  this.width = opt.width;
  this.height = opt.height;

  this.box = new b2BoxDef();
  if (! opt.fixed) this.box.density = 1.0;
  this.box.extents.Set(opt.width / 2, opt.height / 2);

  this.body = new b2BodyDef();
  this.body.AddShape(this.box);
  this.body.position.Set(opt.x, opt.y);

  this.phys = world.phys.CreateBody(this.body);
}

Prop.prototype.update = function() {

}

Prop.prototype.render = function() {
  ctx.save();

  var pos = this.phys.GetOriginPosition();
  var rot = this.phys.GetRotation();

  ctx.translate(pos.x, pos.y);
  ctx.rotate(rot);

  ctx.beginPath();
  ctx.fillStyle = '#06f';
  ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
  ctx.fill();

  ctx.restore();
}