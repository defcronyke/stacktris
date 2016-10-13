function Qwas(x, y, rot, w, h, density, friction, restitution) {
	
	this.x = x;
	this.y = y;
	this.rot = rot;
	this.w = w;
	this.h = h;
	this.density = density;
	this.friction = friction;
	this.restitution = restitution;
	
	var scale = 40;
	
	this.vertices = [
         -0.5 * scale, 0.5 * scale,
         0.5 * scale, 0.5 * scale,
         0.5 * scale, -0.5 * scale,
         -0.5 * scale, -0.5 * scale
//         -0.25 * scale, -0.75 * scale,
//         -0.75 * scale, -0.75 * scale,
//         -0.75 * scale, 0.75 * scale
    ];
	
	// TODO: Fix this
	this.shapes = [
        [
	        [-0.75 * scale, -0.25 * scale],
	        [0.75 * scale, -0.25 * scale],
	        [0.75 * scale, 0.25 * scale],
	        [-0.75 * scale, 0.25 * scale]
        ],
        [
			[0.25 * scale, 0.25 * scale],
			[0.75 * scale, 0.25 * scale],
			[0.75 * scale, 0.75 * scale],
			[0.25 * scale, 0.75 * scale]
        ]
    ];
	
	this.colour = 0xAA66FF;
}

