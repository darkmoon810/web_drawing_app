//a tool for drawing straight lines to the screen. Allows the user to preview
//the a line to the current mouse position before drawing the line to the 
//pixel array.
function LineToTool(){
	this.icon = "assets/lineTo.jpg";
	this.name = "LineTo";

	var startMouseX = -1;
	var startMouseY = -1;
	var drawing = false;
	var strokeSize = 1; // Default line size

	//draws the line to the screen 
	this.draw = function(){
		cursor('crosshair'); // Precise cursor for line drawing
		//only draw when mouse is clicked
		if(mouseIsPressed){
			push(); // Save current state
			strokeWeight(strokeSize); // Apply stroke size
			
			//if it's the start of drawing a new line
			if(startMouseX == -1){
				startMouseX = mouseX;
				startMouseY = mouseY;
				drawing = true;
				//save the current pixel Array
				loadPixels();
			}

			else{
				//update the screen with the saved pixels to hide any previous
				//line between mouse pressed and released
				updatePixels();
				//draw the line
				line(startMouseX, startMouseY, mouseX, mouseY);
			}
			pop(); // Restore state
		}

		else if(drawing){
			//save the pixels with the most recent line and reset the
			//drawing bool and start locations
			loadPixels();
			drawing = false;
			startMouseX = -1;
			startMouseY = -1;
		}
	};

	this.populateOptions = function() {
		select(".options").html(
			`<div class="tool-options">
				
				<div>
					<p>Draw straight lines by clicking and dragging.</p>
					<div class="size-control">
						<label for="lineSize">Line Size:</label>
						<input type="range" id="lineSize" 
							min="1" max="50" 
							value="${strokeSize}" 
							step="1">
						<span id="lineSizeValue">${strokeSize}</span>
					</div>
				</div>
				<ul>
					<li>Click to set starting point</li>
					<li>Drag to see line preview</li>
					<li>Adjust line thickness using the slider</li>
					<li>Release to draw the final line</li>
				</ul>
			</div>`
		);

		// Add event listener for the size slider
		select("#lineSize").input(() => {
			strokeSize = select("#lineSize").value();
			select("#lineSizeValue").html(strokeSize);
		});
	};
}
