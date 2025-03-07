function BucketTool() {
    this.icon = "assets/bucket.svg";  // You'll need to add this icon
    this.name = "bucket";

    // Tolerance value for color matching (0-255)
    let tolerance = 20;

    this.draw = function () {
        cursor('url(assets/bucket.svg) 8 10, pointer'); // Custom cursor or use 'crosshair'

        if (mouseIsPressed) {
            // Get canvas coordinates
            let coords = mouseToCanvas(mouseX, mouseY);
            let x = Math.floor(coords.x);
            let y = Math.floor(coords.y);

            // Save current state before filling
            loadPixels();
            let originalPixels = pixels.slice();

            // Get target color from clicked pixel
            let index = 4 * (y * width + x);
            let targetR = pixels[index];
            let targetG = pixels[index + 1];
            let targetB = pixels[index + 2];

            // Get fill color
            let fillColor = color(colourP.selectedColour);
            let fillR = red(fillColor);
            let fillG = green(fillColor);
            let fillB = blue(fillColor);

            // Flood fill algorithm
            let stack = [[x, y]];
            let visited = new Set();

            while (stack.length > 0) {
                let [currentX, currentY] = stack.pop();
                let key = currentX + ',' + currentY;

                if (visited.has(key)) continue;
                if (currentX < 0 || currentX >= width || currentY < 0 || currentY >= height) continue;

                let currentIndex = 4 * (currentY * width + currentX);
                let currentR = pixels[currentIndex];
                let currentG = pixels[currentIndex + 1];
                let currentB = pixels[currentIndex + 2];

                // Check if current pixel matches target color within tolerance
                if (this.colorMatch(
                    currentR, currentG, currentB,
                    targetR, targetG, targetB,
                    tolerance
                )) {
                    // Fill current pixel
                    pixels[currentIndex] = fillR;
                    pixels[currentIndex + 1] = fillG;
                    pixels[currentIndex + 2] = fillB;
                    pixels[currentIndex + 3] = 255;

                    // Add adjacent pixels to stack
                    stack.push([currentX + 1, currentY]);
                    stack.push([currentX - 1, currentY]);
                    stack.push([currentX, currentY + 1]);
                    stack.push([currentX, currentY - 1]);

                    visited.add(key);
                }
            }

            updatePixels();
            saveDrawingState();
        }
    };

    // Helper function to check if colors match within tolerance
    this.colorMatch = function (r1, g1, b1, r2, g2, b2, tolerance) {
        return Math.abs(r1 - r2) <= tolerance &&
            Math.abs(g1 - g2) <= tolerance &&
            Math.abs(b1 - b2) <= tolerance;
    };

    this.populateOptions = function () {
        select(".options").html(
            `<div class="tool-options">
            <div>
                <p>Fill connected areas with the selected color.</p>
                <div class="size-control">
                    <label for="tolerance">Color Tolerance:</label>
                    <input type="range" id="tolerance" min="0" max="100" value="${tolerance}">
                    <span id="toleranceValue">${tolerance}</span>
                </div>
            </div>

            <ul>
                <li>Click any area to fill with selected color</li>
                <li>Adjust tolerance to control fill spread</li>
                <li>Higher tolerance fills more similar colors</li>
                <li>Lower tolerance fills only exact matches</li>
            </ul>
            </div>`
        );

        // Add event listener for tolerance slider
        select("#tolerance").input(() => {
            tolerance = select("#tolerance").value();
            select("#toleranceValue").html(tolerance);
        });
    };
} 