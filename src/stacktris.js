function Stacktris() {
	
}

Stacktris.prototype.start = function() {
	console.log('hello');
	
	this.renderer = new PIXI.WebGLRenderer(800, 600);
	document.body.appendChild(this.renderer.view);
	
	this.stage = new PIXI.Container();
	
	this.bunny = null;
	
	PIXI.loader.add('bunny', 'bunny.png').load((function(loader, resources) {
	    // This creates a texture from a 'bunny.png' image.
	    this.bunny = new PIXI.Sprite(resources.bunny.texture);

	    // Setup the position and scale of the bunny
	    this.bunny.position.x = 400;
	    this.bunny.position.y = 300;

	    this.bunny.scale.x = 2;
	    this.bunny.scale.y = 2;

	    // Add the bunny to the scene we are building.
	    this.stage.addChild(this.bunny);

	    // kick off the animation loop (defined below)
	    this.animate();
	}).bind(this));
};

Stacktris.prototype.animate = function() {
    // start the timer for the next animation loop
    requestAnimationFrame(this.animate.bind(this));

    // each frame we spin the bunny around a bit
    this.bunny.rotation += 0.01;

    // this is the main render call that makes pixi draw your container and its children.
    this.renderer.render(this.stage);
}
