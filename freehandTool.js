function FreehandTool() {
	//set an icon and a name for the object
	this.icon = "assets/freehand.jpg";
	this.name = "freehand";

	//to smoothly draw we'll draw a line from the previous mouse location
	//to the current mouse location. The following values store
	//the locations from the last frame. They are -1 to start with because
	//we haven't started drawing yet.
	var previousMouseX = -1;
	var previousMouseY = -1;
	var strokeSize = 1; // Default stroke size

	this.draw = function () {
		cursor('url(assets/pencil.svg) 5 20, crosshair'); // Custom cursor or use 'crosshair'
		//if the mouse is pressed
		if (mouseIsPressed) {
			//check if they previousX and Y are -1. set them to the current
			//mouse X and Y if they are.
			if (previousMouseX == -1) {
				previousMouseX = mouseX;
				previousMouseY = mouseY;
			}
			//if we already have values for previousX and Y we can draw a line from 
			//there to the current mouse location
			else {
				push(); // Save the current drawing state
				strokeWeight(strokeSize); // Set the line thickness
				line(previousMouseX, previousMouseY, mouseX, mouseY);
				pop(); // Restore the drawing state
				previousMouseX = mouseX;
				previousMouseY = mouseY;
			}
		}
		//if the user has released the mouse we want to set the previousMouse values 
		//back to -1.
		//try and comment out these lines and see what happens!
		else {
			previousMouseX = -1;
			previousMouseY = -1;
		}
	};

	this.populateOptions = function () {
		select(".options").html(
			`<div class="tool-options">
				
				<div>
				<p>Click and drag to draw freely on the canvas.</p>
				<div class="size-control">
					<label for="strokeSize">Line Size:</label>
					<input type="range" id="strokeSize" 
						   min="1" max="50" 
						   value="${strokeSize}" 
						   step="1">
					<span id="sizeValue">${strokeSize}</span>
				</div>
				</div>
				<ul>
					<li>Click and hold to start drawing</li>
					<li>Drag to create continuous lines</li>
					<li>Release to stop drawing</li>
					<li>Adjust line size using the slider</li>
					<li>Use the color picker to change line color</li>
				</ul>
			</div>`
		);

		// Add event listener for the size slider
		select("#strokeSize").input(() => {
			strokeSize = select("#strokeSize").value();
			select("#sizeValue").html(strokeSize);
		});
	};
}