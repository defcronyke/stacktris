function Stacktris() {
	
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
	while (!break_out) {
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
            new Easd(100, 100, a),
            new Qasd(100, 100, a),
            new Qwas(100, 100, a),
            new Wasd(100, 100, a)
        ];
		
		this.shuffle(this.possibleObjects);
		
		var obj = this.possibleObjects[Math.floor(Math.random()) % this.possibleObjects.length];
		
		console.log(obj);
		
		var g = new PIXI.Graphics();
		g.beginFill(obj.colour);
		g.lineStyle(0, 0xFF0000);
		g.position.x = obj.x;
		g.position.y = obj.y;
		g.rotation = a * Math.PI / 180.0;
		g.drawPolygon(obj.vertices);
		this.stage.addChild(g);
		
		this.objects = [
            obj
        ];
		
		break;
	}
	
	this.animate();
};

Stacktris.prototype.animate = function() {
    // start the timer for the next animation loop
    requestAnimationFrame(this.animate.bind(this));

    // each frame we spin the bunny around a bit
//    this.bunny.rotation += 0.01;

    // this is the main render call that makes pixi draw your container and its children.
    this.renderer.render(this.stage);
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
