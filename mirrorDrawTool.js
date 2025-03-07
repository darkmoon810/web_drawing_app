function MirrorDrawTool() {
	this.name = "mirrorDraw";
	this.icon = "assets/mirrorDraw.jpg";

	this.axis = "x";
	this.lineOfSymmetry = width / 2;

	let strokeSize = 1;
	var self = this;
	var previousMouseX = -1;
	var previousMouseY = -1;
	var previousOppositeMouseX = -1;
	var previousOppositeMouseY = -1;
	var isDrawing = false;

	this.draw = function () {
		cursor('crosshair');

		if (mouseIsPressed) {
			// Get canvas coordinates
			let coords = mouseToCanvas(mouseX, mouseY);

			if (previousMouseX == -1) {
				previousMouseX = coords.x;
				previousMouseY = coords.y;
				previousOppositeMouseX = this.calculateOpposite(coords.x, "x");
				previousOppositeMouseY = this.calculateOpposite(coords.y, "y");
			} else {
				push();
				strokeWeight(strokeSize);
				stroke(colourP.selectedColour);

				// Draw the main line
				line(previousMouseX, previousMouseY, coords.x, coords.y);

				// Draw the mirrored line
				var oX = this.calculateOpposite(coords.x, "x");
				var oY = this.calculateOpposite(coords.y, "y");
				line(previousOppositeMouseX, previousOppositeMouseY, oX, oY);

				pop();

				// Update previous positions
				previousMouseX = coords.x;
				previousMouseY = coords.y;
				previousOppositeMouseX = oX;
				previousOppositeMouseY = oY;

				// Save the state after drawing
				if (!isDrawing) {
					isDrawing = true;
				}
			}
		} else {
			// Reset drawing state when mouse is released
			if (isDrawing) {
				saveDrawingState();
				isDrawing = false;
			}
			previousMouseX = -1;
			previousMouseY = -1;
			previousOppositeMouseX = -1;
			previousOppositeMouseY = -1;

			// Draw the symmetry line when not drawing
			push();
			strokeWeight(2);
			stroke(200, 0, 0, 120);
			if (this.axis == "x") {
				line(width / 2, 0, width / 2, height);
			} else {
				line(0, height / 2, width, height / 2);
			}
			pop();
		}
	};

	this.calculateOpposite = function (n, a) {
		if (a != this.axis) {
			return n;
		}

		let symmetryLine = (this.axis == "x") ? width / 2 : height / 2;

		if (n < symmetryLine) {
			return symmetryLine + (symmetryLine - n);
		} else {
			return symmetryLine - (n - symmetryLine);
		}
	};

	this.unselectTool = function () {
		isDrawing = false;
		select(".options").html("");
	};

	this.populateOptions = function () {
		select(".options").html(
			`<div class="tool-options">
                <div class="mirror-controls">
				<p>Draw with mirror effect:</p>
                    <button id='directionButton' class="mirror-button" style="margin-bottom: 10px;">Make Horizontal</button>
                    <div class="size-control">
                        <label for="mirrorStroke">Line Size:</label>
                        <input type="range" id="mirrorStroke" 
                               min="1" max="50" 
                               value="${strokeSize}" 
                               step="1">
                        <span id="strokeSizeValue">${strokeSize}</span>
                    </div>
                </div>
                <div class="tool-instructions">
                    
                    <ul>
                        <li>Click and drag to draw</li>
                        <li>Drawing is mirrored across the red line</li>
                        <li>Toggle between vertical and horizontal</li>
                        <li>Adjust line thickness with slider</li>
                    </ul>
                </div>
            </div>`
		);

		// Add event listeners
		select("#directionButton").mouseClicked(function () {
			var button = select("#" + this.elt.id);
			if (self.axis == "x") {
				self.axis = "y";
				self.lineOfSymmetry = height / 2;
				button.html('Make Vertical');
			} else {
				self.axis = "x";
				self.lineOfSymmetry = width / 2;
				button.html('Make Horizontal');
			}
		});

		// Add stroke size control
		select("#mirrorStroke").input(() => {
			strokeSize = select("#mirrorStroke").value();
			select("#strokeSizeValue").html(strokeSize);
		});
	};
}
