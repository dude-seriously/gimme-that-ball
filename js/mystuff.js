var initId = 0;
var world = createWorld();
var ctx;
var canvasWidth;
var canvasHeight;
var canvasTop;
var canvasLeft;
var mainBox;
var fixedBox;

function createGround(world) {
	var groundSd = new b2BoxDef();
	groundSd.extents.Set(canvasWidth, 12); // Size of ground
	groundSd.restitution = 0.2;
	var groundBd = new b2BodyDef();
	groundBd.AddShape(groundSd);
	groundBd.position.Set(0, canvasHeight); // Position
	return world.CreateBody(groundBd)
}

function createWorld() {
	var worldAABB = new b2AABB();
	worldAABB.minVertex.Set(-1000, -1000);
	worldAABB.maxVertex.Set(1000, 1000);
	var gravity = new b2Vec2(0, 300);
	var doSleep = true;
	var world = new b2World(worldAABB, gravity, doSleep);
	createGround(world);
	// createBox(world, 0, 125, 10, 250);
	// createBox(world, 500, 125, 10, 250);
	return world;
}

function createBall(world, x, y) {
	var ballSd = new b2CircleDef();
	ballSd.density = 1.0;
	ballSd.radius = 20;
	ballSd.restitution = 1.0;
	ballSd.friction = 0;
	var ballBd = new b2BodyDef();
	ballBd.AddShape(ballSd);
	ballBd.position.Set(x,y);
	return world.CreateBody(ballBd);
}

function createBox(world, x, y, width, height, fixed) {
	if (typeof(fixed) == 'undefined') fixed = true;
	var boxSd = new b2BoxDef();
	if (!fixed) boxSd.density = 1.0;
	boxSd.extents.Set(width, height);
	var boxBd = new b2BodyDef();
	boxBd.AddShape(boxSd);
	boxBd.position.Set(x,y);
	return world.CreateBody(boxBd)
}

function shiftGravity() {
	var gravity = new b2Vec2(100, -300);
	world.SetGravity(gravity);
}


function setupWorld() {
	world = createWorld();
}

function step(cnt) {
	var stepping = false;
	var timeStep = 1.0/60;
	var iteration = 1;
	world.Step(timeStep, iteration);
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	drawWorld(world, ctx);

	var delta = Math.sin(cnt/10 || 1) * 20;
	cnt++;

	fixedBox.SetOriginPosition(new b2Vec2(200, 400 + delta), cnt/200 || 1);
	setTimeout('step(' + (cnt || 0) + ')', 10);
}

Event.observe(window, 'load', function() {

	var canvasElm = document.getElementById("mycanvas");

	ctx = canvasElm.getContext('2d');
	
	canvasWidth = parseInt(canvasElm.width);
	canvasHeight = parseInt(canvasElm.height);
	canvasTop = parseInt(canvasElm.style.top);
	canvasLeft = parseInt(canvasElm.style.left);

	world = createWorld();

	mainBox = createBox(world, 100, 100, 20, 20, false)

	createBox(world, 200, 200, 29, 20, false)

	fixedBox = createBox(world, 200, 400, 29, 90, true)

	// var sd = new b2BoxDef();
	// var bd = new b2BodyDef();
	// bd.AddShape(sd);
	// sd.density = 1.0;
	// sd.friction = 0.5;
	// sd.extents.Set(10, 10);

	// var i;
	// for (i = 0; i < 8; i++) {
	// 	bd.position.Set(500/2-Math.random()*2-1, (250-5-i*22));
	// 	world.CreateBody(bd);
	// }
	// for (i = 0; i < 8; i++) {
	// 	bd.position.Set(500/2-100-Math.random()*5+i, (250-5-i*22));
	// 	world.CreateBody(bd);
	// }
	// for (i = 0; i < 8; i++) {
	// 	bd.position.Set(500/2+100+Math.random()*5-i, (250-5-i*22));
	// 	world.CreateBody(bd);
	// }
	
	step();
});