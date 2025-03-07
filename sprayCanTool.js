function SprayCanTool() {

	this.name = "sprayCanTool";
	this.icon = "assets/sprayCan.jpg";

	var points = 13;
	var spread = 10;
	var pointSize = 1; // Default point size

	this.draw = function () {
		// Custom spray can cursor
		cursor('url(assets/sprayCursor.svg) 1 5, auto');
		// If you don't have a custom cursor image, use:
		// cursor('cell');
		if (mouseIsPressed) {
			push(); // Save current state
			strokeWeight(pointSize); // Apply point size

			for (var i = 0; i < points; i++) {
				point(random(mouseX - spread, mouseX + spread), random(mouseY - spread, mouseY + spread));
			}

			pop(); // Restore state
		}
	};

	this.populateOptions = function () {
		select(".options").html(
			`<div class="tool-options">
			<div>
				<p>Creates a spray paint effect with scattered points.</p>
				<div class="size-control">
					<label for="spraySize">Point Size:</label>
					<input type="range" id="spraySize" 
						   min="1" max="10" 
						   value="${pointSize}" 
						   step="1">
					<span id="spraySizeValue">${pointSize}</span>
				</div>
				<div class="spread-control">
					<label for="spraySpread">Spread:</label>
					<input type="range" id="spraySpread" 
						   min="5" max="50" 
						   value="${spread}" 
						   step="1">
					<span id="spreadValue">${spread}</span>
				</div>
			</div>
				
				<ul>
					<li>Click and hold to spray</li>
					<li>Adjust point size and spread using sliders</li>
					<li>Move while spraying for continuous effect</li>
				</ul>
			</div>`
		);

		// Add event listeners for the sliders
		select("#spraySize").input(() => {
			pointSize = select("#spraySize").value();
			select("#spraySizeValue").html(pointSize);
		});

		select("#spraySpread").input(() => {
			spread = select("#spraySpread").value();
			select("#spreadValue").html(spread);
		});
	};
}