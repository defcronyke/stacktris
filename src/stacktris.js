window.onload = function() {
	(new Stacktris()).start();
};

function Stacktris() {
	Math.fmod = function (a,b) { return Number((a - (Math.floor(a / b) * b)).toPrecision(8)); };
}

Stacktris.prototype.start = function() {
	console.log('hello');
	
	this.renderer = new PIXI.WebGLRenderer(400, 600);
	document.body.appendChild(this.renderer.view);
	
	this.stage = new PIXI.Container();
	this.angles = [
//       0.0, 
//       90.0, 
//       180.0, 
       270.0
    ];
	this.shuffle(this.angles);

	var a = this.angles[Math.floor(Math.random()) % this.angles.length];
	
	this.possibleObjects = [
//        new Asdf(100, 100, a),
//        new Easd(100, 100, a),
//        new Qasd(100, 100, a),
//        new Qwas(100, 100, a),
        new Wasd(100, 500, a)
    ];
	
	this.shuffle(this.possibleObjects);
	
	var obj = this.possibleObjects[Math.floor(Math.random()) % this.possibleObjects.length]; 
	console.log(obj);
	
	var g = new PIXI.Graphics();
	g.beginFill(obj.colour);
	g.lineStyle(0, 0xFF0000);
	g.position.x = obj.x;
	g.position.y = obj.y;
	g.drawPolygon(obj.vertices);
	this.stage.addChild(g);
	obj.g = g;
	
	this.objects = [
        obj
    ];
	
	this.initPhysics(this.objects);
		
	this.animate();
};

Stacktris.prototype.animate = function() {
	
	//this.updatePhysics(this.objects);
	this.stepPhysics(this.objects);
	
    // start the timer for the next animation loop
    requestAnimationFrame(this.animate.bind(this));

    // this is the main render call that makes pixi draw your container and its children.
    this.renderer.render(this.stage);
};

Stacktris.prototype.initPhysics = function(objs) {
	
	this.dynamicBodies = [];
	
	var groundBodyDef = new Box2D.Dynamics.b2BodyDef();
	console.log(groundBodyDef);
	groundBodyDef.position.Set(0.0, 600.0);
	var gravity = new Box2D.Common.Math.b2Vec2(0.0, 100.0);
	this.world = new Box2D.Dynamics.b2World(gravity);
	var groundBody = this.world.CreateBody(groundBodyDef);
	var groundBodyShape = new Box2D.Collision.Shapes.b2PolygonShape();
	groundBodyShape.SetAsBox(500.0, 0.0);
	var groundBodyFixtureDef = new Box2D.Dynamics.b2FixtureDef();
	groundBodyFixtureDef.shape = groundBodyShape;
	groundBodyFixtureDef.density = 1.0;
	groundBodyFixtureDef.friction = 1.0;
	
	groundBody.CreateFixture(groundBodyFixtureDef);

	for (var i = 0; i < objs.length; i++) {
		var obj = objs[i];
		var dynamicBodyDef = new Box2D.Dynamics.b2BodyDef();
		dynamicBodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
		dynamicBodyDef.position = new Box2D.Common.Math.b2Vec2(obj.x, obj.y);
		dynamicBodyDef.angle = obj.rot * Math.PI / 180.0;
//		dynamicBodyDef.set_bullet(true);
		var dynamicBody = this.world.CreateBody(dynamicBodyDef);
		
		if (obj.shapes && obj.shapes.length == 1) {	// If object is convex.
			
			console.log('convex');
			
			var dynamicBodyShape = new Box2D.Collision.Shapes.b2PolygonShape();
			
			var vertices = [];
			
			for (var j = 0; j < obj.shapes[0].length; j++) {
				
				var shape = obj.shapes[0][j];
				
//				console.log('! shape !');
//				console.log(shape);
				
				vertices.push(
					new Box2D.Common.Math.b2Vec2(
						shape[0],
						shape[1]
					)
				);
			}
			
			dynamicBodyShape.SetAsArray(vertices, vertices.length);
			
			
			var dynamicBodyFixtureDef = new Box2D.Dynamics.b2FixtureDef();
			dynamicBodyFixtureDef.shape = dynamicBodyShape;

			dynamicBodyFixtureDef.density = obj.density;
			dynamicBodyFixtureDef.friction = obj.friction;
			dynamicBodyFixtureDef.restitution = obj.restitution;
			dynamicBodyFixtureDef.userData = 1;	
			dynamicBody.CreateFixture(dynamicBodyFixtureDef);
			this.dynamicBodies.push(dynamicBody);
			
		} else if (obj.shapes && obj.shapes.length > 1) {	// If object is concave.
			
			console.log('concave');
			
			for (var j = 0; j < obj.shapes.length; j++) {
			
				var shape = obj.shapes[j];
				var dynamicBodyShape = new Box2D.Collision.Shapes.b2PolygonShape();
				
				var vertices = [];
				
				for (var k = 0; k < obj.shapes[j].length; k++) {
					
					console.log('k ' + k);
					
					var shape = obj.shapes[j][k];
					
					console.log('! shape !');
					console.log(shape);
					
					vertices.push(
						new Box2D.Common.Math.b2Vec2(
							shape[0],
							shape[1]
						)
					);
				}
				
				dynamicBodyShape.SetAsArray(vertices, vertices.length);
				
//				dynamicBodyShape.Set(shape[0], shape.length);
				var dynamicBodyFixtureDef = new Box2D.Dynamics.b2FixtureDef();
				dynamicBodyFixtureDef.shape = dynamicBodyShape;
				dynamicBodyFixtureDef.density = obj.density;
				dynamicBodyFixtureDef.friction = obj.friction;
				dynamicBodyFixtureDef.restitution = obj.restitution;
				dynamicBodyFixtureDef.userData = 1;
				
				dynamicBody.CreateFixture(dynamicBodyFixtureDef);
				this.dynamicBodies.push(dynamicBody);
			}
		} else if (!obj.shapes || (obj.shapes && obj.shapes.length < 1)) {	// If object has no shapes it must be a triangle.
			
			console.log('triangle');
			
			var dynamicBodyShape = new Box2D.Collision.Shapes.b2PolygonShape();
			dynamicBodyShape.SetAsBox(10.0, 10.0);

			var vertices = [];
			console.log(obj.vertices);
			for (var j = 0; j < obj.vertices.length; j++)
			{
				vertices.push({
					x: obj.vertices[j].x,
					y: obj.vertices[j].y
				});
			}

			dynamicBodyShape.Set(vertices, obj.vertices.length);

			var dynamicBodyFixtureDef = new Box2D.Dynamics.b2FixtureDef();
			dynamicBodyFixtureDef.shape = dynamicBodyShape;
			dynamicBodyFixtureDef.density = obj.density;
			dynamicBodyFixtureDef.friction = obj.friction;
			dynamicBodyFixtureDef.restitution = obj.restitution;
			dynamicBodyFixtureDef.userData = 1;

			dynamicBody.CreateFixture(dynamicBodyFixtureDef);
			
			this.dynamicBodies.push(dynamicBody);
		}
		
		
		
		obj.visible = true;
	}
	
	this.world.SetContactListener(new MyContactListener());
};

Stacktris.prototype.stepPhysics = function(objs) {
	
	var timeStep = 1.0 / 60.0;
	var velocityIterations = 6;
	var positionIterations = 2;
	
	this.world.Step(timeStep, velocityIterations, positionIterations);
	this.world.ClearForces();
	
	for (var i = 0; i < objs.length; i++) {
		var obj = objs[i];
		
		var dynamicBodyPosition = this.dynamicBodies[i].GetPosition();
//		console.log(dynamicBodyPosition);
		var dynamicBodyAngle = this.dynamicBodies[i].GetAngle() * 180.0 / Math.PI;
		obj.x = dynamicBodyPosition.x;
		obj.y = dynamicBodyPosition.y;
		obj.rot = Math.fmod(dynamicBodyAngle, 360.0);
		obj.g.position.x = obj.x;
		obj.g.position.y = obj.y;
		obj.g.rotation = obj.rot * Math.PI / 180.0;
	}
};

Stacktris.prototype.shuffle = function(a) {
	var j, x, i;
	for (i = a.length; i; i--) {
		j = Math.floor(Math.random() * i);
		x = a[i - 1];
		a[i - 1] = a[j];
		a[j] = x;
	}
};

function MyContactListener() {

	this.level_completed = false;
};
MyContactListener.prototype = new Box2D.Dynamics.b2ContactListener();
MyContactListener.prototype.constructor = MyContactListener;
