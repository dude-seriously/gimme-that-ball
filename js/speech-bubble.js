SpeechBubbleQuotes = {
  "hit": [
    "You son of a brick!",
    "Ouch!",
    "Eek!",
    "OMG",
    "Why you...",
    "Pfffff",
    ">_<",
    "Argh, get him!"
  ],

  "got ball": [
    "Trolololo",
    "Catch me if you can",
    "thx",
    "lol noob",
    "Go go go go",
    "OM NOM NOM NOM",
    "I'll take this",
    "Kiss my pixel",
    "CAN I HAZ BALL KTHX"
  ],

  "random happy": [
    "Guess who's going to win soon",
    "Noobs",
    "Noooooooobs",
    "Hehe, so easy",
    "This is what WINNING looks like",
    "U MAD BRO?"
  ],

  "random sad": [
    "Come on let's get them!",
    "We can't lose!",
    "Argh come on..",
    "Dude, focus",
    "I'm tired...",
    "I want to go home..."
  ],

  "random": [
    "Where's the ball?",
    "What are we fighting for anyway?",
    "Why is the ball so pixelated?",
    "I say, what a pleasent weather",
    "Are we there yet?"
  ]
}

function Bubbles() {
  Collection.call(this, 'id');
}
Bubbles.prototype = Object.create(Collection.prototype);

Bubbles.prototype.update = function() {
  this.forEach(function(bubble) {
    if (bubble) bubble.update();
  });
}

Bubbles.prototype.render = function() {
  this.forEach(function(bubble) {
    bubble.render();
  });
}

var bubbles = new Bubbles();


var bubbleStays = 3000;
var bubbleIDs = 0;

function Bubble(player, text) {
  this.id = ++bubbleIDs;
  this.player = player;
  this.text = text;
  this.created = now;
  this.expire = now + bubbleStays;

  bubbles.push(this);
}

Bubble.prototype.update = function() {
  if (this.expire < now) {
    bubbles.remove(this);
  }
};

Bubble.prototype.render = function() {
  ctx.save();

  ctx.beginPath();

  ctx.font = 'bold 24px Arial';
  var width = ctx.measureText(this.text).width;
  var height = 32;

  var x = this.player.x - playerWidth / 2;
  var y = this.player.y - playerHeight / 2 - height - 32;

  ctx.lineWidth = 2;

  ctx.moveTo(x, y);
  ctx.lineTo(x + width + 16, y);
  ctx.lineTo(x + width + 16, y + height);
  ctx.lineTo(x + 32, y + height);
  ctx.lineTo(x + 16, y + height + 16);
  ctx.lineTo(x + 16, y + height);
  ctx.lineTo(x, y + height);
  ctx.lineTo(x, y);

  ctx.fillStyle = '#fff';
  ctx.fill();

  ctx.strokeStyle = '#000';
  ctx.stroke();

  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#000';
  ctx.fillText(this.text, x + 8, y + height / 2);
  // ctx.rect(x, y, 50, bubbleHeight);
  // ctx.fillStyle = '#f00';
  // ctx.fill();

  ctx.restore();
};