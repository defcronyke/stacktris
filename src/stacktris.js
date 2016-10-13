window.onload = function() {
	(new Stacktris()).start();
};

function Stacktris() {
	Math.fmod = function (a,b) { return Number((a - (Math.floor(a / b) * b)).toPrecision(8)); };
}

Stacktris.prototype.start = function() {
	
	this.renderer = new PIXI.WebGLRenderer(400, 600);
	document.body.appendChild(this.renderer.view);
	this.w = 400.0;
	
	this.stage = new PIXI.Container();
	this.angles = [
       0.0, 
       90.0, 
       180.0, 
       270.0
    ];
	this.shuffle(this.angles);

	var a = this.angles[Math.floor(Math.random()) % this.angles.length];
	
	this.possibleObjects = [
        Asdf,
        Qwas,
//        Easd,
//        Qasd,
//        Wasd
    ];
	
	this.shuffle(this.possibleObjects);
	
	
	var obj = new (this.possibleObjects[Math.floor(Math.random()) % this.possibleObjects.length])(this.w/2 - 25, 0.0, a);
	
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
	
	this.initPhysics();
		
	this.animate();
};

Stacktris.prototype.animate = function() {
	
	this.stepPhysics();
	
    // start the timer for the next animation loop
    requestAnimationFrame(this.animate.bind(this));

    // this is the main render call that makes pixi draw your container and its children.
    this.renderer.render(this.stage);
};

Stacktris.prototype.initPhysics = function() {
	
	var restitution = 0.3;
	
	this.dynamicBodies = [];

	var groundBodyDef = new Box2D.Dynamics.b2BodyDef();
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

	for (var i = 0; i < this.objects.length; i++) {
		var obj = this.objects[i];
		
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

			dynamicBodyFixtureDef.density = 1.0;
			dynamicBodyFixtureDef.friction = 1.0;
			dynamicBodyFixtureDef.restitution = restitution;
			dynamicBodyFixtureDef.userData = 1;	
			dynamicBody.CreateFixture(dynamicBodyFixtureDef);
			this.dynamicBodies.push(dynamicBody);
			
		} else if (obj.shapes && obj.shapes.length > 1) {	// If object is concave.
			
			console.log('concave');
			
			for (var j = 0; j < obj.shapes.length; j++) {
			
				var shapes = obj.shapes[j];
				var dynamicBodyShape = new Box2D.Collision.Shapes.b2PolygonShape();
				
				var vertices = [];
				
				for (var k = 0; k < shapes.length; k++) {
					
					var shape = shapes[k];
					
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
				dynamicBodyFixtureDef.density = 1.0;
				dynamicBodyFixtureDef.friction = 1.0;
				dynamicBodyFixtureDef.restitution = restitution;
				dynamicBodyFixtureDef.userData = 1;
				
				dynamicBody.CreateFixture(dynamicBodyFixtureDef);
				this.dynamicBodies.push(dynamicBody);
			}
		} else if (!obj.shapes || (obj.shapes && obj.shapes.length < 1)) {	// If object has no shapes it must be a triangle.
			
			console.log('triangle');
			
			var dynamicBodyShape = new Box2D.Collision.Shapes.b2PolygonShape();
			dynamicBodyShape.SetAsBox(10.0, 10.0);

			var vertices = [];
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
			dynamicBodyFixtureDef.density = 1.0;
			dynamicBodyFixtureDef.friction = 1.0;
			dynamicBodyFixtureDef.restitution = restitution;
			dynamicBodyFixtureDef.userData = 1;

			dynamicBody.CreateFixture(dynamicBodyFixtureDef);
			
			this.dynamicBodies.push(dynamicBody);
		}
		
		
		
		obj.visible = true;
	}
	
	this.world.SetContactListener(new MyContactListener());
};

Stacktris.prototype.updatePhysics = function() {
	
	var restitution = 0.3;
	
	var obj = this.objects[this.objects.length-1];
	
	obj.x = this.w/2 - 25;
	obj.y = 0.0;
	
//		console.log(obj);
		
//		var g = new PIXI.Graphics();
//		g.beginFill(obj.colour);
//		g.lineStyle(0, 0xFF0000);
	obj.g.position.x = this.w/2 - 25;
	obj.g.position.y = 0.0;
//		obj.g.drawPolygon(obj.vertices);
//		this.stage.addChild(g);
//		obj.g = g;
	
	var dynamicBodyDef = new Box2D.Dynamics.b2BodyDef();
	dynamicBodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
	dynamicBodyDef.position = new Box2D.Common.Math.b2Vec2(this.w/2 - 25, 0.0);
	dynamicBodyDef.angle = obj.rot * Math.PI / 180.0;
//		dynamicBodyDef.set_bullet(true);
	var dynamicBody = this.world.CreateBody(dynamicBodyDef);
	
	console.log(dynamicBodyDef.position);
	
	if (obj.shapes && obj.shapes.length == 1) {	// If object is convex.
		
		console.log('convex');
		
		var dynamicBodyShape = new Box2D.Collision.Shapes.b2PolygonShape();
		
		var vertices = [];
		
		for (var j = 0; j < obj.shapes[0].length; j++) {
			
			var shape = obj.shapes[0][j];
			
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

		dynamicBodyFixtureDef.density = 1.0;
		dynamicBodyFixtureDef.friction = 1.0;
		dynamicBodyFixtureDef.restitution = restitution;
		dynamicBodyFixtureDef.userData = 1;	
		dynamicBody.CreateFixture(dynamicBodyFixtureDef);
		this.dynamicBodies.push(dynamicBody);
		
	} else if (obj.shapes && obj.shapes.length > 1) {	// If object is concave.
		
		console.log('concave');
		
		for (var j = 0; j < obj.shapes.length; j++) {
		
			var shapes = obj.shapes[j];
			var dynamicBodyShape = new Box2D.Collision.Shapes.b2PolygonShape();
			
			var vertices = [];
			
			for (var k = 0; k < shapes.length; k++) {
				
				var shape = shapes[k];
				
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
			dynamicBodyFixtureDef.density = 1.0;
			dynamicBodyFixtureDef.friction = 1.0;
			dynamicBodyFixtureDef.restitution = restitution;
			dynamicBodyFixtureDef.userData = 1;
			
			dynamicBody.CreateFixture(dynamicBodyFixtureDef);
			this.dynamicBodies.push(dynamicBody);
		}
	} else if (!obj.shapes || (obj.shapes && obj.shapes.length < 1)) {	// If object has no shapes it must be a triangle.
		
		console.log('triangle');
		
		var dynamicBodyShape = new Box2D.Collision.Shapes.b2PolygonShape();
		dynamicBodyShape.SetAsBox(10.0, 10.0);

		var vertices = [];
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
		dynamicBodyFixtureDef.density = 1.0;
		dynamicBodyFixtureDef.friction = 1.0;
		dynamicBodyFixtureDef.restitution = restitution;
		dynamicBodyFixtureDef.userData = 1;

		dynamicBody.CreateFixture(dynamicBodyFixtureDef);
		
		this.dynamicBodies.push(dynamicBody);
	}
	
	obj.visible = true;
};

Stacktris.prototype.stepPhysics = function() {
	
	console.log('yvel: ' + this.dynamicBodies[this.dynamicBodies.length-1].GetLinearVelocity().y);
	console.log('pos: ' + this.dynamicBodies[this.dynamicBodies.length-1].GetPosition().y);
	
	if (this.dynamicBodies[this.dynamicBodies.length-1].GetPosition().y > 0.1 && this.dynamicBodies[this.dynamicBodies.length-1].GetLinearVelocity().y <= 4.0 && this.dynamicBodies[this.dynamicBodies.length-1].GetLinearVelocity().x <= 0.0) {
		
		console.log('settled');
		
		var a = this.angles[Math.floor(Math.random()) % this.angles.length];
		
		var obj = new (this.possibleObjects[Math.floor(Math.random()) % this.possibleObjects.length])(this.w/2 - 25, 0.0, a); 
		
		obj.x = this.w/2 - 25;
		obj.y = 0.0;
		
		obj.visible = true;
		
		var g = new PIXI.Graphics();
		g.beginFill(obj.colour);
		g.lineStyle(0, 0xFF0000);
		g.position.x = this.w/2 - 25;
		g.position.y = 0.0;
		g.drawPolygon(obj.vertices);
		this.stage.addChild(g);
		obj.g = g;
		this.objects.push(obj);
		this.updatePhysics();
		
		this.renderer.render(this.stage);
		return;
	}
	
	var timeStep = 1.0 / 60.0;
	var velocityIterations = 6;
	var positionIterations = 2;
	
	this.world.Step(timeStep, velocityIterations, positionIterations);
	this.world.ClearForces();
	
		for (var i = 0; i < this.objects.length; i++) {
			var obj = this.objects[i];
			
			var dynamicBodyPosition = this.dynamicBodies[i].GetPosition();
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
