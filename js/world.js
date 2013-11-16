var world = new World();

function World() {
  this.left = -2048;
  this.right = 2048;
  this.top = -512;
  this.bottom = 512;

  this.props = new Collection();
}

World.prototype.addProp = function(opt) {
  this.props.push(new Prop(opt));
}

World.prototype.phys = function() {

}

World.prototype.update = function() {
  this.props.forEach(function(prop) {
    prop.update();
  });
}

World.prototype.render = function() {
  this.props.forEach(function(prop) {
    prop.render();
  });
}