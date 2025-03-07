function BrushTool() {
    this.icon = "assets/brush.svg";
    this.name = "brush";

    let previousMouseX = -1;
    let previousMouseY = -1;
    let brushSize = 10;
    let brushStyle = "round";
    let opacity = 255;

    this.draw = function() {
        cursor('url(assets/brush.svg) 10 5, crosshair'); // Custom cursor or use 'crosshair'

        if (mouseIsPressed) {
            let coords = mouseToCanvas(mouseX, mouseY);
            let prevCoords = mouseToCanvas(previousMouseX, previousMouseY);

            if (previousMouseX == -1) {
                previousMouseX = mouseX;
                previousMouseY = mouseY;
            } else {
                push();
                // Fix color alpha handling
                let c = colourP.selectedColour;
                let col = color(red(c), green(c), blue(c), opacity);
                stroke(col);
                strokeWeight(brushSize);
                strokeCap(ROUND);

                switch(brushStyle) {
                    case "round":
                        line(prevCoords.x, prevCoords.y, coords.x, coords.y);
                        break;

                    case "square":
                        strokeCap(SQUARE);
                        line(prevCoords.x, prevCoords.y, coords.x, coords.y);
                        break;

                    case "calligraphy":
                        let angle = atan2(coords.y - prevCoords.y, coords.x - prevCoords.x);
                        strokeWeight(map(abs(sin(angle)), 0, 1, brushSize/4, brushSize));
                        line(prevCoords.x, prevCoords.y, coords.x, coords.y);
                        break;

                    case "textured":
                        let steps = dist(prevCoords.x, prevCoords.y, coords.x, coords.y);
                        for(let i = 0; i < steps; i++) {
                            let x = lerp(prevCoords.x, coords.x, i/steps);
                            let y = lerp(prevCoords.y, coords.y, i/steps);
                            let randX = random(-brushSize/4, brushSize/4);
                            let randY = random(-brushSize/4, brushSize/4);
                            fill(col);
                            noStroke();
                            ellipse(x + randX, y + randY, random(1, brushSize/2));
                        }
                        break;

                    case "ribbon":
                        for(let i = 0; i < 3; i++) {
                            let offset = (i - 1) * brushSize/3;
                            let ribbonCol = color(red(c), green(c), blue(c), opacity/(i + 1));
                            stroke(ribbonCol);
                            strokeWeight(brushSize/(i + 1));
                            line(prevCoords.x, prevCoords.y + offset, 
                                 coords.x, coords.y + offset);
                        }
                        break;
                }
                pop();

                previousMouseX = mouseX;
                previousMouseY = mouseY;
            }
        } else {
            previousMouseX = -1;
            previousMouseY = -1;
        }
    };

    this.populateOptions = function() {
        select(".options").html(
            `<div class="tool-options">
                <div>
                    <p>Draw smooth lines with a brush.</p>
                    <div class="size-control">
                        <label for="brushStyle" style="align-content: center;">Brush Style:</label>
                        <select id="brushStyle">
                            <option value="round">Round</option>
                            <option value="square">Square</option>
                            <option value="calligraphy">Calligraphy</option>
                            <option value="textured">Textured</option>
                            <option value="ribbon">Ribbon</option>
                        </select>
                    </div>
                    <div class="size-control">
                        <label for="brushSize">Size:</label>
                        <input type="range" id="brushSize" 
                            min="1" max="50" value="${brushSize}">
                        <span id="brushSizeValue">${brushSize}</span>
                    </div>
                    <div class="size-control">
                        <label for="opacity">Opacity:</label>
                        <input type="range" id="opacity" 
                            min="1" max="255" value="${opacity}">
                        <span id="opacityValue">${opacity}</span>
                    </div>
                </div>
                <ul>
                    <li>Click and drag to paint</li>
                    <li>Adjust size and opacity using sliders</li>
                    <li>Try different brush styles for various effects</li>
                </ul>
            </div>`
        );

        // Add event listeners
        select("#brushStyle").changed(() => {
            brushStyle = select("#brushStyle").value();
        });

        select("#brushSize").input(() => {
            brushSize = select("#brushSize").value();
            select("#brushSizeValue").html(brushSize);
        });

        select("#opacity").input(() => {
            opacity = select("#opacity").value();
            select("#opacityValue").html(opacity);
        });
    };
} 