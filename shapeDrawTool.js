function ShapeDrawTool() {
	this.name = "shapes";
	this.icon = "assets/shapeTool.svg";

	let startMouseX = null;
	let startMouseY = null;
	let originalCanvas = null;
	
	this.selectedShape = "Rectangle";
	this.fillMode = false;
	this.gradientMode = false;
	this.outlineMode = true;
	let gradientColor1 = color(255, 0, 0);
	let gradientColor2 = color(0, 0, 255);

	this.draw = function() {
		cursor('crosshair'); // Precise cursor for shape drawing
		if (mouseIsPressed) {
			if (!startMouseX && !startMouseY) {
				startMouseX = mouseX;
				startMouseY = mouseY;
				originalCanvas = get();
			}

			// Restore the original canvas state
			image(originalCanvas, 0, 0);

			push();
			if (this.outlineMode) {
				strokeWeight(1);
				stroke(colourP.selectedColour);
			} else {
				noStroke();
			}

			if (this.fillMode) {
				if (this.gradientMode) {
					this.createGradientFill(startMouseX, startMouseY, mouseX, mouseY);
				} else {
					fill(colourP.selectedColour);
				}
			} else {
				noFill();
			}

			switch (this.selectedShape) {
				case "Rectangle":
					rect(startMouseX, startMouseY, mouseX - startMouseX, mouseY - startMouseY);
					break;
					
				case "Circle":
					let radius = dist(startMouseX, startMouseY, mouseX, mouseY);
					if (this.gradientMode && this.fillMode) {
						this.createRadialGradient(startMouseX, startMouseY, radius);
					}
					ellipse(startMouseX, startMouseY, radius * 2);
					break;
					
				case "Triangle":
					let width = mouseX - startMouseX;
					let height = mouseY - startMouseY;
					triangle(
						startMouseX, startMouseY + height, // Bottom left
						startMouseX + width/2, startMouseY, // Top middle
						startMouseX + width, startMouseY + height // Bottom right
					);
					break;
					
				case "Pentagon":
					let pentRadius = dist(startMouseX, startMouseY, mouseX, mouseY);
					this.drawPolygon(startMouseX, startMouseY, pentRadius, 5);
					break;
					
				case "Star":
					let starRadius = dist(startMouseX, startMouseY, mouseX, mouseY);
					this.drawStar(startMouseX, startMouseY, starRadius * 0.5, starRadius, 5);
					break;
					
				case "Bubble":
					let bubbleRadius = dist(startMouseX, startMouseY, mouseX, mouseY);
					ellipse(startMouseX, startMouseY, bubbleRadius * 2);
					// Add highlight to make it look like a bubble
					push();
					noStroke();
					fill(255, 255, 255, 100);
					ellipse(startMouseX - bubbleRadius/3, startMouseY - bubbleRadius/3, bubbleRadius/2);
					pop();
					break;
			}
			pop();
		} else {
			startMouseX = null;
			startMouseY = null;
			originalCanvas = null;
		}
	};

	// Helper function to draw regular polygons
	this.drawPolygon = function(x, y, radius, sides) {
		beginShape();
		for (let i = 0; i < sides; i++) {
			let angle = TWO_PI * i / sides - HALF_PI;
			let px = x + cos(angle) * radius;
			let py = y + sin(angle) * radius;
			vertex(px, py);
		}
		endShape(CLOSE);
	};

	// Helper function to draw star
	this.drawStar = function(x, y, innerRadius, outerRadius, points) {
		let angle = TWO_PI / points;
		let halfAngle = angle / 2.0;
		beginShape();
		for (let a = -HALF_PI; a < TWO_PI - HALF_PI; a += angle) {
			let sx = x + cos(a) * outerRadius;
			let sy = y + sin(a) * outerRadius;
			vertex(sx, sy);
			sx = x + cos(a + halfAngle) * innerRadius;
			sy = y + sin(a + halfAngle) * innerRadius;
			vertex(sx, sy);
		}
		endShape(CLOSE);
	};

	// Helper function to draw heart
	this.drawHeart = function(x, y, size) {
		beginShape();
		for (let a = 0; a < TWO_PI; a += 0.01) {
			let r = size * (16 * pow(sin(a), 3)) / 16;
			let sx = x + r * cos(a);
			let sy = y - r * sin(a); // Subtract to flip heart right-side up
			vertex(sx, sy);
		}
		endShape(CLOSE);
	};

	// Helper function for linear gradient
	this.createGradientFill = function(x1, y1, x2, y2) {
		let gradient = drawingContext.createLinearGradient(x1, y1, x2, y2);
		gradient.addColorStop(0, gradientColor1.toString());
		gradient.addColorStop(1, gradientColor2.toString());
		drawingContext.fillStyle = gradient;
	};

	// Helper function for radial gradient (used for circles)
	this.createRadialGradient = function(centerX, centerY, radius) {
		let gradient = drawingContext.createRadialGradient(
			centerX, centerY, 0,
			centerX, centerY, radius
		);
		gradient.addColorStop(0, gradientColor1.toString());
		gradient.addColorStop(1, gradientColor2.toString());
		drawingContext.fillStyle = gradient;
	};

	this.populateOptions = function() {
		select(".options").html(
			`<select id="shapeSelect">
				<option value="Rectangle">Rectangle</option>
				<option value="Circle">Circle</option>
				<option value="Triangle">Triangle</option>
				<option value="Pentagon">Pentagon</option>
				<option value="Star">Star</option>
				<option value="Bubble">Bubble</option>
			 </select>
			 <div class="shape-options">
				<label><input type="checkbox" id="fillShape"> Fill Shape</label>
				<label><input type="checkbox" id="gradientFill"> Gradient Fill</label>
				<label><input type="checkbox" id="outlineShape" checked> Show Outline</label>
			 </div>
			 <div class="gradient-controls" style="display: none;">
				<label>Color 1: <input type="color" id="gradientColor1" value="#ff0000"></label>
				<label>Color 2: <input type="color" id="gradientColor2" value="#0000ff"></label>
			 </div>`
		);

		// Add event listeners
		select("#shapeSelect").changed(() => {
			this.selectedShape = select("#shapeSelect").value();
		});

		select("#fillShape").changed(() => {
			this.fillMode = select("#fillShape").checked();
			select(".gradient-controls").style("display", 
				(this.fillMode) ? "block" : "none");
		});

		select("#gradientFill").changed(() => {
			this.gradientMode = select("#gradientFill").checked();
		});

		// Add outline toggle listener
		select("#outlineShape").changed(() => {
			this.outlineMode = select("#outlineShape").checked();
		});

		// Gradient color pickers
		select("#gradientColor1").input(() => {
			gradientColor1 = color(select("#gradientColor1").value());
		});

		select("#gradientColor2").input(() => {
			gradientColor2 = color(select("#gradientColor2").value());
		});
	};

	this.unselectTool = function() {
		if (originalCanvas) {
			image(originalCanvas, 0, 0);
			originalCanvas = null;
		}
		startMouseX = null;
		startMouseY = null;
	};
}