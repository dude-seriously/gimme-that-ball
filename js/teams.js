function Teams() {
  Collection.call(this, 'id');
}
Teams.prototype = Object.create(Collection.prototype);

Teams.prototype.init = function() {
  this.push(new Team(0, 'left'));
  this.push(new Team(1, 'right'));
}

Teams.prototype.a = function() {
  return this.get(0);
};
Teams.prototype.b = function() {
  return this.get(1);
}

Teams.prototype.update = function() {
  this.forEach(function(team) {
    team.update();
  });
}

Teams.prototype.render = function() {
  this.forEach(function(team) {
    team.render();
  });
}

var teams = new Teams();