/*
All modules related to mouse / keyboard input
*/

const on_mouse_move = (e) => {
	/*
	Called every time the mouse is moved

	Essentially checking if the mouse is hovering
	over a point or a stick. It is ensured that
	you cannot be hovering over both a stick and a
	point simultaneously
	*/

	// Get the current mouse position
	mouse_x = e.clientX;
	mouse_y = e.clientY;

	// Determine if the mouse is hovering over a point
	const hovering_point = is_mouse_over_point(mouse_x, mouse_y);
	if (hovering_point && !current_stick) {
		current_hover = hovering_point;
	} else { 
		current_hover = false; 
	}

	// Determine if the mouse is hovering over a stick
	if (!prev_point && !current_hover) {
		const hovering_stick = is_mouse_over_stick(mouse_x, mouse_y);
		if (hovering_stick) {
			current_stick = hovering_stick;
		} else {
			current_stick = false;
		}
	}
}



const on_mouse_up = (e) => {
	/*
	Called after a mouse click
	*/
	const MOUSE_BTN = e.button;
	
	// Perform an action based on which mouse button was pressed
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
	/*
	Called after a keyboard button press
	*/
	if (e.code === SPACE_KEYCODE) {
		started = !started;
		prev_point = false;
		current_hover = false;
	}
}

const on_key_down = (e) => {
	/*
	Called on a keyboard button press
	*/
	if (prev_point) return;

	// Remove the stick that is being hovered over
	if (e.keyCode === X_KEYCODE && current_stick) {
		sticks = sticks.filter(stick => stick !== current_stick);
	}

	// Remove the point that is being hovered over
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
	/*
	Called on any left click
	*/
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
	/*
	Starts all the listeners when called
	*/
	canvas.addEventListener("mouseup", on_mouse_up);
	canvas.addEventListener("mousemove", on_mouse_move);
	window.addEventListener("keyup", on_key_up);
	window.addEventListener("keydown", on_key_down);
}
