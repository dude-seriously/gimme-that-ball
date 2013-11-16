var playerIDs = 0;
var moveSpeed = 10;

var lobbyPlayers = jQuery('#lobby-players');

function Player(ind) {
  this.id = ++playerIDs;
  this.ind = ind;
  this.team = null;
  this.gamePad = null;
  this.ready = false;

  this.x = 0;
  this.y = 0;

  //this.phys =

  this.tpl();
}

Player.prototype.update = function() {
  if (this.gamePad) {
    switch(game.state) {
      case 'lobby':
        if (Math.abs(this.gamePad.leftStickX) > .3) {
          if (this.gamePad.leftStickX < 0) {
            if (! this.team) {
              teams.a().join(this);
              this.ready = false;
              this.div.removeClass('ready');
              this.div.detach().appendTo(jQuery('#lobby-team-a'));
            } else if(this.team.id == 1) {
              this.team.leave(this);
            }
          } else {
            if (! this.team) {
              teams.b().join(this);
              this.ready = false;
              this.div.removeClass('ready');
              this.div.detach().appendTo(jQuery('#lobby-team-b'));
            } else if (this.team.id == 0) {
              this.team.leave(this);
            }
          }
        }
        if (! this.ready && this.gamePad.start && this.team) {
          this.ready = true;
          this.div.addClass('ready');
          players.checkReady();
        }
        break;
      case 'game':
        if (gamePadMaster == this.gamePad && gamePadMaster.leftShoulder0) return;

        if (Math.abs(this.gamePad.leftStickX) > .2) {
          this.x += this.gamePad.leftStickX * moveSpeed;
        }
        if (Math.abs(this.gamePad.leftStickY) > .2) {
          this.y += this.gamePad.leftStickY * moveSpeed;
        }
        break;
    }
  }
}

Player.prototype.jump = function() {

}

Player.prototype.render = function() {
  if (this.team) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, 32, 32);
    if (this.team.id == 1) {
      ctx.fillStyle = '#06f';
    } else {
      ctx.fillStyle = '#f60';
    }
    ctx.fill();
  }
}


Player.prototype.tpl = function() {
  this.div = jQuery('<div class="player"><span class="number">' + (this.ind + 1) + '</span></div>');
  this.div.appendTo(lobbyPlayers);
}