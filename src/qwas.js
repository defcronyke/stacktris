function Qwas(x, y, rot, w, h, density, friction, restitution) {
	
	this.x = x;
	this.y = y;
	this.rot = rot;
	this.w = w;
	this.h = h;
	this.density = density;
	this.friction = friction;
	this.restitution = restitution;
	
	var scale = 70;
	
	this.vertices = [
         0.0 * scale, 0.0 * scale,
         0.5 * scale, 0.0 * scale,
         0.5 * scale, 0.5 * -scale,
         0.0 * scale, 0.5 * -scale
    ];

	this.shapes = [
        [
	        [0.0 * scale, 0.5 * -scale],
	        [0.5 * scale, 0.5 * -scale],
	        [0.5 * scale, 0.0 * scale],
	        [0.0 * scale, 0.0 * scale]
        ]
    ];
	
	this.colour = 0xFFAAFF;
}
