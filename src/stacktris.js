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
	
	
	
//	this.graphics = new PIXI.Graphics();
//	this.graphics.beginFill(0xFFFF00);
//	this.graphics.lineStyle(0, 0xFF0000);
//	this.graphics.drawRect(0, 0, 300, 200);
//	this.stage.addChild(this.graphics);
	
	var break_out = false;
//	while (!break_out) {
		this.stage = new PIXI.Container();
		this.angles = [
           0.0, 
           90.0, 
           180.0, 
           270.0
        ];
		this.shuffle(this.angles);
		//console.log(angles);
		var a = this.angles[Math.floor(Math.random()) % this.angles.length];
		
		this.possibleObjects = [
            new Asdf(100, 100, a),
//            new Easd(100, 100, a),
//            new Qasd(100, 100, a),
//            new Qwas(100, 100, a),
//            new Wasd(100, 100, a)
        ];
		
		this.shuffle(this.possibleObjects);
		
		var obj = this.possibleObjects[Math.floor(Math.random()) % this.possibleObjects.length];
		
		console.log(obj);
		
		this.g = new PIXI.Graphics();
		this.g.beginFill(obj.colour);
		this.g.lineStyle(0, 0xFF0000);
		this.g.position.x = obj.x;
		this.g.position.y = obj.y;
		this.g.rotation = a * Math.PI / 180.0;
		this.g.drawPolygon(obj.vertices);
		this.stage.addChild(this.g);
		
		this.objects = [
            obj
        ];
		
		this.initPhysics(this.objects);
		
//		break;
//	}
	
	this.animate();
};

Stacktris.prototype.animate = function() {
	
	//console.log('animate');
	
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
//	groundBodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
	console.log(groundBodyDef);
	groundBodyDef.position.Set(0.0, 600.0);
	var gravity = new Box2D.Common.Math.b2Vec2(0.0, 50.0);
	this.world = new Box2D.Dynamics.b2World(gravity);
//	console.log('world');
//	console.log(this.world);
	var groundBody = this.world.CreateBody(groundBodyDef);
	var groundBodyShape = new Box2D.Collision.Shapes.b2PolygonShape();
	groundBodyShape.SetAsBox(500.0, 0.0);
	var groundBodyFixtureDef = new Box2D.Dynamics.b2FixtureDef();
//	groundBodyShape.Set(new Box2D.Common.Math.b2Vec2(-40.0, -6.0), new Box2D.Common.Math.b2Vec2(40.0, -6.0));
	
//	groundBody.CreateFixture(groundBodyShape, 0.0);
	
	//groundBodyShape.SetAsBox(400.0, 0.0);
//	var groundBodyFixtureDef = Box2D.b2FixtureDef;
	groundBodyFixtureDef.shape = groundBodyShape;
	groundBodyFixtureDef.density = 1.0;
	groundBodyFixtureDef.friction = 1.0;
	
//	try {
		groundBody.CreateFixture(groundBodyFixtureDef);
//	} catch(e) {
//		console.log(e);
//	} 
//	this.dynamicBodies = [];
//	
	for (var i = 0; i < objs.length; i++) {
		var obj = objs[i];
		var dynamicBodyDef = new Box2D.Dynamics.b2BodyDef();
		dynamicBodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
		dynamicBodyDef.position = new Box2D.Common.Math.b2Vec2(obj.x, obj.y);
//		dynamicBodyDef.set_position([obj.x, obj.y]);
//		dynamicBodyDef.set_angle(obj.rot * Math.PI / 180.0);
//		dynamicBodyDef.set_bullet(true);
		var dynamicBody = this.world.CreateBody(dynamicBodyDef);
//		var dynamicBody = this.world.CreateBody();
//		
//		console.log('!');
//		console.log(dynamicBodyDef);
//		console.log('!!');
//		console.log(dynamicBody);
//		
		console.log('shapes len');
		console.log(obj.shapes.length);
		
		if (obj.shapes && obj.shapes.length == 1) {	// If object is convex.
			
			console.log('convex');
			
			var dynamicBodyShape = new Box2D.Collision.Shapes.b2PolygonShape();
			
			var vertices = [];
			
			for (var j = 0; j < obj.shapes[0].length; j++) {
				
				var shape = obj.shapes[0][j];
				
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
			
			
			var dynamicBodyFixtureDef = new Box2D.Dynamics.b2FixtureDef();
			dynamicBodyFixtureDef.shape = dynamicBodyShape;

//			dynamicBodyFixtureDef.density = 1.0;
//			dynamicBodyFixtureDef.friction = 1.0;
//			dynamicBodyFixtureDef.restitution = 1.0;
			dynamicBodyFixtureDef.density = obj.density;
			dynamicBodyFixtureDef.friction = obj.friction;
			dynamicBodyFixtureDef.restitution = obj.restitution;
			dynamicBodyFixtureDef.userData = 1;
			
			console.log('! ');
			console.log(dynamicBodyFixtureDef);
			
			dynamicBody.CreateFixture(dynamicBodyFixtureDef);
			
			
			
		} else if (obj.shapes && obj.shapes.length > 1) {	// If object is concave.
			
			console.log('concave');
			
			for (var j = 0; j < obj.shapes.length; j++) {
			
				var shape = obj.shapes[j];
				var dynamicBodyShape = new Box2D.b2PolygonShape();
				dynamicBodyShape.Set(shape[0], shape.length);
				var dynamicBodyFixtureDef = new Box2D.b2FixtureDef();
				dynamicBodyFixtureDef.shape = dynamicBodyShape;
				dynamicBodyFixtureDef.density = obj.density;
				dynamicBodyFixtureDef.friction = obj.friction;
				dynamicBodyFixtureDef.restitution = obj.restitution;
				dynamicBodyFixtureDef.userData = 1;
				
				dynamicBody.CreateFixture(dynamicBodyFixtureDef);
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
		}
		
		console.log('push dynamicBody:');
		console.log(dynamicBody);
		
		this.dynamicBodies.push(dynamicBody);
		
		obj.visible = true;
	}
	
	this.world.SetContactListener(new MyContactListener());
};

//Stacktris.prototype.updatePhysics = function(objs) {
//	for (var i = 0; i < objs.length; i++) {
//		var obj = objs[i];
//		
//		if (!obj.visible) {
//			var dynamicBodyDef = new Box2D.b2BodyDef();
//			dynamicBodyDef.set_type(Box2D.b2_dynamicBody);
//			dynamicBodyDef.set_position([obj.x, obj.y]);
//			dynamicBodyDef.set_angle(obj.rot * Math.PI / 180.0);
//			dynamicBodyDef.set_bullet(true);
//			var dynamicBody = this.world.CreateBody(dynamicBodyDef);
//			this.dynamicBodies.push(dynamicBody);
//			
//			if (obj.shapes && obj.shapes.length == 1) {	// If object is convex.
//				
//				var dynamicBodyShape = new Box2D.b2PolygonShape();
//				dynamicBodyShape.Set(obj.shapes[0][0], obj.shapes[0].length);
//				var dynamicBodyFixtureDef = new Box2D.b2FixtureDef();
//				dynamicBodyFixtureDef.shape = dynamicBodyShape;
//				dynamicBodyFixtureDef.density = obj.density;
//				dynamicBodyFixtureDef.friction = obj.friction;
//				dynamicBodyFixtureDef.restitution = obj.restitution;
//				dynamicBodyFixtureDef.userData = 1;
//				dynamicBody.CreateFixture(dynamicBodyFixtureDef);
//				
//			} else if (obj.shapes && obj.shapes.length > 1) {	// If object is concave.
//				
//				for (var j = 0; j < obj.shapes.length; j++) {
//				
//					var shape = obj.shapes[j];
//					var dynamicBodyShape = new Box2D.b2PolygonShape();
//					dynamicBodyShape.Set(shape[0], shape.length);
//					var dynamicBodyFixtureDef = new Box2D.b2FixtureDef();
//					dynamicBodyFixtureDef.shape = dynamicBodyShape;
//					dynamicBodyFixtureDef.density = obj.density;
//					dynamicBodyFixtureDef.friction = obj.friction;
//					dynamicBodyFixtureDef.restitution = obj.restitution;
//					dynamicBodyFixtureDef.userData = 1;
//					
//					dynamicBody.CreateFixture(dynamicBodyFixtureDef);
//				}
//			} else if (obj.shapes && obj.shapes.length < 1) {	// If object has no shapes it must be a triangle.
//				
//				var dynamicBodyShape = new Box2D.b2PolygonShape();
//
//				var vertices = [];
//				for (var j = 0; j < obj.vertices.length; j++)
//				{
//					vertices.push({
//						x: obj.vertices[j].x,
//						y: obj.vertices[j].y
//					});
//				}
//
//				dynamicBodyShape.Set(vertices, obj.vertices.length);
//
//				var dynamicBodyFixtureDef = new Box2D.b2FixtureDef();
//				dynamicBodyFixtureDef.shape = dynamicBodyShape;
//				dynamicBodyFixtureDef.density = obj.density;
//				dynamicBodyFixtureDef.friction = obj.friction;
//				dynamicBodyFixtureDef.restitution = obj.restitution;
//				dynamicBodyFixtureDef.userData = 1;
//
//				dynamicBody.CreateFixture(dynamicBodyFixtureDef);
//			}
//			
//			obj.visible = true;
//		}
//	}
//};

Stacktris.prototype.stepPhysics = function(objs) {
	
	var timeStep = 1.0 / 60.0;
	var velocityIterations = 6;
	var positionIterations = 2;
	
	this.world.Step(timeStep, velocityIterations, positionIterations);
	this.world.ClearForces();
	
	for (var i = 0; i < objs.length; i++) {
		var obj = objs[i];
		
//		console.log(this.dynamicBodies[i]);
		
//		this.dynamicBodies[i].set_position([this.dynamicBodies[i].GetPosition().x - 1.0, this.dynamicBodies[i].GetPosition().y - 1.0]);
		
		var dynamicBodyPosition = this.dynamicBodies[i].GetPosition();
//		console.log('!!! ');
//		console.log(dynamicBodyPosition);
		obj.x = dynamicBodyPosition.x;
		obj.y = dynamicBodyPosition.y;
		this.g.position.x = obj.x;
		this.g.position.y = obj.y;
		
		var dynamicBodyAngle = this.dynamicBodies[i].GetAngle() * 180.0 / Math.PI;
		obj.rot = Math.fmod(dynamicBodyAngle, 360.0);
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
