/*
All helper functions can be foumd here
*/

const distance = (point_1, point_2) => {
	/*
	Uses pythagoras to find the distance between two points
	*/
	const x_dist = point_1.x - point_2.x;
	const y_dist = point_1.y - point_2.y;
	return Math.sqrt(x_dist ** 2 + y_dist ** 2);
}

const is_mouse_over_point = (mouse_x, mouse_y) => {
	/*
	Checks if the mouse is hovering over a point.
	If it is, return the point. If it isn't, return false
	*/

	// Iterate through all points
	for (let i = 0; i < points.length; i++) {
		const point = points[i];
		// Check if the mouse is within a certain distance to a point
		if (Math.abs(point.x - mouse_x) < POINT_HOVER_RADIUS && Math.abs(point.y - mouse_y) < POINT_HOVER_RADIUS) {
			return point;
		}
	}
	return false;
}

const is_mouse_over_stick = (mouse_x, mouse_y) => {
	/*
	Check if the mouse is hovering over one of the sticks
	If it is, return the stick. If it isn't, return false.

	If the sum of the distances from the mouse to either end
	of the stick is equal to the length of the stick (give or take)
	then the mouse must be hovering over the stick.
	*/

	// Iterate through all sticks
	for (let i = 0; i < sticks.length; i++) {
		const stick = sticks[i];

		// Calculate distance from the mouse to either end of the stick
		const distance_to_stick_1 = distance({
			x: mouse_x,
			y: mouse_y,
		}, stick.p0);

		const distance_to_stick_2 = distance({
			x: mouse_x,
			y: mouse_y
		}, stick.p1);

		// Check if the mouse is within a certain distance to the stick
		if ( Math.abs( stick.length - (distance_to_stick_1 + distance_to_stick_2) ) < LINE_HOVER_RADIUS ) {
			return stick;
		}
	}
	return false;
}
