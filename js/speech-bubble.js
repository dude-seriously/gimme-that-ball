SpeechBubbleQuotes = {
  "hit": [
    "You son of a brick!",
    "Ouch!",
    "Eek!",
    "OMG",
    "Why you...",
    "Pfffff",
    ">_<",
    "Argh, get him!",
    "ಠ_ಠ",
    "So close...",
    "Give me that back!",
    "Hey!",
    "I don't need it anyway..."
  ],

  "got ball": [
    "Trolololo",
    "Catch me if you can",
    "thx",
    "lol noob",
    "Go go go go",
    "OM NOM NOM NOM",
    "I'll take that",
    "Kiss my pixel",
    "CAN I HAZ BALL KTHX",
    "noob",
    "Got it",
    "^_^",
    "Yes yes yes",
    "Oh what's this thing?",
    "What do we have here?",
    "I'll borrow this",
    "Hello ball, I've missed you",
    "Get in!",
    "Woohoo!",
    "Oh yeah!",
    "That's what I'm talking about",
    "Boom, got it",
    "It's mine! My precious!",
    "Ooh, shiny!",
    "Mmmmm, so round",
    "Fus-ro-dah!",
    "See ya!",
    "Hurr hurr hurr",
    "Give that to me",
    "Ball. Mine."
  ],

  "random happy": [
    "Guess who's going to win soon",
    "Noobs",
    "Noooooooobs",
    "Hehe, so easy",
    "This is what WINNING looks like",
    "U MAD BRO?",
    "Can't touch this",
    ":)",
    "We're unstoppable",
    "Just give up already",
    "Resistance is futile",
    "Come on losers!"
  ],

  "random sad": [
    "Come on let's get them!",
    "We can't lose!",
    "Argh come on..",
    "Dude, focus",
    "I'm tired...",
    "I want to go home...",
    "We need to try harder",
    "Put more effort into it!",
    ":(",
    "Dude, srsly...",
    "Just.. get the ball",
    "Blah blah blah",
    "Do it! Do it!",
    "Pass it to me!",
    "Stupid ball... Stupid game..",
    "You shall not pass!",
    "Make your mom proud"
  ],

  "random": [
    "Where's the ball?",
    "What are we fighting for anyway?",
    "Why is the ball so pixelated?",
    "I say, what a pleasent weather",
    "Are we there yet?",
    "What's the time?"
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

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(camera.zoom, camera.zoom);
  ctx.translate(-camera.pos[0], -camera.pos[1] / 2);

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

  ctx.restore();
};
