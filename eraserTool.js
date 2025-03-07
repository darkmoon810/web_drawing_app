function EraserTool() {
	//set an icon and a name for the object
	this.icon = "assets/eraser.jpg";
	this.name = "eraser";

	var previousMouseX = -1;
	var previousMouseY = -1;
	var strokeSize = 10; // Default eraser size

	this.draw = function () {
		// Custom eraser cursor
		cursor('url(assets/eraserCursor.svg) 8 15, auto');
		// If you don't have a custom cursor image, use:
		// cursor('grab');
		//reference to the currently selected colour
		var currentColour = colourP.selectedColour;

		//if the mouse is pressed
		if (mouseIsPressed) {
			push(); // Save current state
			fill("white");
			stroke("white");
			strokeWeight(strokeSize); // Apply stroke size

			//check if they previousX and Y are -1. set them to the current
			//mouse X and Y if they are.
			if (previousMouseX == -1) {
				previousMouseX = mouseX;
				previousMouseY = mouseY;
			}
			//if we already have values for previousX and Y we can draw a line from 
			//there to the current mouse location
			else {
				line(previousMouseX, previousMouseY, mouseX, mouseY);
				previousMouseX = mouseX;
				previousMouseY = mouseY;
			}
			pop(); // Restore state
		}
		//if the user has released the mouse we want to set the previousMouse values 
		//back to -1.
		//try and comment out these lines and see what happens!
		else {
			previousMouseX = -1;
			previousMouseY = -1;
		}
		//set the colour back to the previous state
		fill(currentColour);
		stroke(currentColour);
	};

	this.populateOptions = function () {
		select(".options").html(
			`<div class="tool-options">
				<div>
					<p>Erase parts of your drawing.</p>
					<div class="size-control">
						<label for="eraserSize">Eraser Size:</label>
						<input type="range" id="eraserSize" 
							min="1" max="50" 
							value="${strokeSize}" 
							step="1">
						<span id="eraserSizeValue">${strokeSize}</span>
					</div>
				</div>
				<ul>
					<li>Click and drag to erase</li>
					<li>Adjust eraser size using the slider</li>
					<li>Works like a white brush</li>
					<li>Erases any color underneath</li>
				</ul>
			</div>`
		);

		// Add event listener for the size slider
		select("#eraserSize").input(() => {
			strokeSize = select("#eraserSize").value();
			select("#eraserSizeValue").html(strokeSize);
		});
	};
}