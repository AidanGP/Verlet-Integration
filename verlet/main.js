window.onload = function() {

	// Initiate canvas
	const canvas = document.getElementById("canvas");
	const context = canvas.getContext("2d");

	// Window width and height
	const WIDTH = canvas.width = window.innerWidth;
	const HEIGHT = canvas.height = window.innerHeight;

	// Physics constants
	const BOUNCE = 0.9;
	const GRAVITY = 0.6;
	const FRICTION = 0.995;

	// Hovering constants
	const POINT_RADIUS = 5;
	const LINE_SHORTENING = POINT_RADIUS / 2;
	const POINT_HOVER_RADIUS = 9;
	const LINE_HOVER_RADIUS = 0.5;

	// Codes for mouse buttons
	const LEFT_MOUSE_BUTTON = 0;
	const MIDDLE_MOUSE_BUTTON = 1;
	const RIGHT_MOUSE_BUTTON = 2;

	// Codes for keyboard buttons
	const X_KEYCODE = 88;
	const SPACE_KEYCODE = 'Space';

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






	const on_mouse_move = (e) => {
		const MOUSE_X = e.clientX;
		const MOUSE_Y = e.clientY;

		const hovering_point = is_mouse_over_point(MOUSE_X, MOUSE_Y);
		if (hovering_point && !current_stick) {
			current_hover = hovering_point;
		} else { 
			current_hover = false; 
		}

		if (!prev_point && !current_hover) {
			const hovering_stick = is_mouse_over_stick(MOUSE_X, MOUSE_Y);
			if (hovering_stick) {
				current_stick = hovering_stick;
			} else {
				current_stick = false;
			}	
		}

		mouse_x = MOUSE_X;
		mouse_y = MOUSE_Y;

	}
	const is_mouse_over_point = (mouseX, mouseY) => {
		for (let i = 0; i < points.length; i++) {
			const point = points[i];
			if (Math.abs(point.x - mouseX) < POINT_HOVER_RADIUS && Math.abs(point.y - mouseY) < POINT_HOVER_RADIUS) {
				return point;
			}
		}
		return false;
	}

	const is_mouse_over_stick = (mouseX, mouseY) => {
		for (let i = 0; i < sticks.length; i++) {
			const stick = sticks[i];

			const d1 = distance({
				x: mouseX,
				y: mouseY,
			}, stick.p0);
			const d2 = distance({
				x: mouseX,
				y: mouseY
			}, stick.p1);

			if ( Math.abs( stick.length - (d1 + d2) ) < LINE_HOVER_RADIUS ) {
				return stick;
			}
		}
		return false;
	}

	const on_mouse_up = (e) => {

		const MOUSE_BTN = e.button;
		
		switch (MOUSE_BTN) {
		    case LEFT_MOUSE_BUTTON:
		    	on_left_click(e, false);
		    	break;
		    case MIDDLE_MOUSE_BUTTON:
		    	on_left_click(e, true);
		    	break;
		    case RIGHT_MOUSE_BUTTON:
		    	prev_point = false;
		    	current_hover = false;
		}
	}

	const on_key_up = (e) => {
		if (e.code === SPACE_KEYCODE) {
			started = !started;
			prev_point = false;
			current_hover = false;
		}
	}

	const on_key_down = (e) => {
		if (prev_point) return;
		if (e.keyCode === X_KEYCODE && current_stick) {
			sticks = sticks.filter(stick => stick !== current_stick);
		}
		if (e.keyCode === X_KEYCODE && current_hover) {
			const to_remove = [];
			for (let i = 0; i < sticks.length; i++) {
				let s = sticks[i];
				if (s.p0 === current_hover || s.p1 === current_hover) {
					to_remove.push(s);
				}
			}
			sticks = sticks.filter(stick => !to_remove.includes(stick));
			points = points.filter(point => point !== current_hover);
		}
	}

	const on_left_click = (e, is_fixed) => {
		const mouse_x = e.clientX;
		const mouse_y = e.clientY;
		const join = is_mouse_over_point(mouse_x, mouse_y);
		const prev_point_ = prev_point;

		if (!join && !current_stick) {
			points.push({
				x: mouse_x,
				y: mouse_y,
				oldx: mouse_x + Math.random(),
				oldy: mouse_y + Math.random(),
				fixed: is_fixed
			});
			prev_point = points[points.length - 1];
		} else if (prev_point_ && join != prev_point_) {
			sticks.push({
				p0: prev_point_,
				p1: join,
				length: distance(prev_point_, join)
			});
			prev_point = join;
		}

		if (prev_point_ && !join) {
			const current_point = points[points.length - 1]
			sticks.push({
				p0: prev_point_,
				p1: current_point,
				length: distance(prev_point_, current_point)
			});
		} else if (!prev_point && join) {
			prev_point = join;
		}
	}

	const start_listeners = () => {
		canvas.addEventListener("mouseup", on_mouse_up);
		canvas.addEventListener("mousemove", on_mouse_move);
		window.addEventListener("keyup", on_key_up);
		window.addEventListener("keydown", on_key_down);
	}








	const distance = (p0, p1) => {
		const x_dist = p1.x - p0.x;
		const y_dist = p1.y - p0.y;
		return Math.sqrt(x_dist ** 2 + y_dist ** 2);
	}

	

	const update = () => {
		if (started) {
			updatePoints();
			constrainPoints();
			for (let i = 0; i < 3; i++) {
				updateSticks();
			}
		}
		renderPoints();
		renderSticks();
		requestAnimationFrame(update);
	}

	const updatePoints = () => {
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
		context.clearRect(0, 0, WIDTH, HEIGHT);
		for(let i = 0; i < points.length; i++) {
			const p = points[i];
			context.beginPath();
			context.arc(p.x, p.y, POINT_RADIUS, 0, Math.PI * 2);
			if (p.fixed) {
				context.fillStyle = 'green';
			}
			if (p === current_hover && p != prev_point) {
				context.fillStyle = 'yellow';
			}
			context.fill();
			context.fillStyle = 'black';
		}
	}

	const renderSticks = () => {
		
		for (let i = 0; i < sticks.length; i++) {
			const s = sticks[i];
			context.beginPath();
			context.moveTo(s.p0.x, s.p0.y);
			context.lineTo(s.p1.x, s.p1.y);
			if (s === current_stick) {
				context.strokeStyle = 'orange';
				context.lineWidth = 5;
			} else {
				context.strokeStyle = 'black';
				context.lineWidth = 1;
			}
			context.stroke();
		}
		
		if (prev_point) {
			context.beginPath();
			context.moveTo(prev_point.x, prev_point.y);
			context.lineTo(mouse_x, mouse_y);
			context.stroke();
		}
	}

	update();
	start_listeners();
};