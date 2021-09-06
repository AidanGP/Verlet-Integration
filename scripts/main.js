/*

*/

// Initiate canvas
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// Window width and height
const WIDTH = canvas.width = window.innerWidth;
const HEIGHT = canvas.height = window.innerHeight;

// Paused / unpaused
let started = false;

//making a chain
let prev_point;

let current_hover;
let current_stick;
let mouse_x;
let mouse_y;
let points = [];
let sticks = [];

const updatePoints = () => {
	/*

	*/
	for (let i = 0; i < points.length; i++) {
		const p = points[i];

		if (!p.fixed) {
			const vx = (p.x - p.oldx) * FRICTION;
			const vy = (p.y - p.oldy) * FRICTION;

			p.oldx = p.x;
			p.oldy = p.y;
			p.x += vx;
			p.y += vy;
			p.y += GRAVITY;
		}
	}
}

const constrainPoints = () => {
	/*

	*/
	for (let i = 0; i < points.length; i++) {
		const p = points[i];

		if (!p.fixed) {
			const vx = (p.x - p.oldx) * FRICTION;
			const vy = (p.y - p.oldy) * FRICTION;

			if(p.x > WIDTH) {
				p.x = WIDTH;
				p.oldx = p.x + vx * BOUNCE;
			}
			else if(p.x < 0) {
				p.x = 0;
				p.oldx = p.x + vx * BOUNCE;
			}
			if(p.y > HEIGHT) {
				p.y = HEIGHT;
				p.oldy = p.y + vy * BOUNCE;
			}
			else if(p.y < 0) {
				p.y = 0;
				p.oldy = p.y + vy * BOUNCE;
			}
		}
	}
}

const updateSticks = () => {
	/*

	*/
	for (let i = 0; i < sticks.length; i++) {
		const s = sticks[i],
			dx = s.p1.x - s.p0.x,
			dy = s.p1.y - s.p0.y,
			distance = Math.sqrt(dx * dx + dy * dy),
			difference = s.length - distance,
			percent = difference / distance / 2,
			offsetX = dx * percent,
			offsetY = dy * percent;

		if (!s.p0.fixed) {
			s.p0.x -= offsetX;
			s.p0.y -= offsetY;
		}
		if (!s.p1.fixed) {
			s.p1.x += offsetX;
			s.p1.y += offsetY;
		}
	}
}

const renderPoints = () => {
	/*

	*/
	context.clearRect(0, 0, WIDTH, HEIGHT);
	for(let i = 0; i < points.length; i++) {
		const p = points[i];
		context.beginPath();
		context.arc(p.x, p.y, POINT_RADIUS, 0, Math.PI * 2);
		if (p.fixed) {
			context.fillStyle = FIXED_POINT_COLOR;
		}
		if (p === current_hover && p != prev_point) {
			context.fillStyle = POINT_COLOR_HOVER;
		}
		context.fill();
		context.fillStyle = POINT_COLOR;
	}
}

const renderSticks = () => {
	/*

	*/
	for (let i = 0; i < sticks.length; i++) {
		const s = sticks[i];
		context.beginPath();
		context.moveTo(s.p0.x, s.p0.y);
		context.lineTo(s.p1.x, s.p1.y);
		if (s === current_stick) {
			context.strokeStyle = STICK_COLOR_HOVER;
			context.lineWidth = STICK_HOVER_WIDTH;
		} else {
			context.strokeStyle = POINT_COLOR;
			context.lineWidth = STICK_WIDTH;
		}
		context.stroke();
	}
	
	if (prev_point) {
		context.beginPath();
		context.moveTo(prev_point.x, prev_point.y);
		context.lineTo(mouse_x, mouse_y);
		context.strokeStyle = STICK_COLOR;
		context.stroke();
	}
}

const update = () => {
	/*

	*/
	if (started) {
		updatePoints();
		constrainPoints();
		for (let i = 0; i < 5; i++) {
			updateSticks();
		}
	}
	renderPoints();
	renderSticks();
	requestAnimationFrame(update);
}


//
update();
start_listeners();