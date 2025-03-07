function TextTool() {
    this.name = "text";
    this.icon = "assets/textTool.svg";

    let isTyping = false;
    let textInput = null;
    let textX = 0;
    let textY = 0;
    let fontSize = 16;
    let fontFamily = 'Arial';
    let textColor = '#000000';

    this.draw = function () {
        cursor('text');

        if (mouseIsPressed && !isTyping) {
            // Create text input when clicking on canvas
            textX = mouseX;
            textY = mouseY;
            isTyping = true;

            // Create and position the input element
            textInput = createInput('');
            textInput.position(textX, textY);
            textInput.style('font-family', fontFamily);
            textInput.style('font-size', fontSize + 'px');
            textInput.style('color', textColor);
            textInput.style('border', '1px dashed #999');
            textInput.style('background', 'transparent');
            textInput.style('padding', '2px');

            // Focus the input
            textInput.elt.focus();

            // Handle enter key to finish typing
            textInput.elt.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    finalizeText();
                }
            });

            // Handle click outside to finish typing
            select('canvas').mousePressed(function () {
                if (isTyping && textInput) {
                    finalizeText();
                }
            });
        }
    };

    function finalizeText() {
        if (textInput && textInput.value()) {
            // Draw the text on canvas
            push();
            textSize(fontSize);
            textFont(fontFamily);
            fill(textColor);
            noStroke();
            text(textInput.value(), textX, textY + fontSize); // Add fontSize to Y to align properly
            pop();
        }

        // Clean up
        if (textInput) {
            textInput.remove();
            textInput = null;
        }
        isTyping = false;
    }

    this.populateOptions = function () {
        select(".options").html(`
            <div style="padding: 10px; font-family: Helvetica, sans-serif; font-size: 15px;">
                <div style="margin-bottom: 10px;">
                    <label>Font Size:</label>
                    <input type="range" id="textSize" min="8" max="72" value="${fontSize}">
                    <span id="sizeValue">${fontSize}px</span>
                </div>
                <div style="margin-bottom: 10px;">
                    <label>Font:</label>
                    <select id="fontFamily" class="text-tool-checkbox">
                        <option value="Arial" ${fontFamily === 'Arial' ? 'selected' : ''}>Arial</option>
                        <option value="Times New Roman" ${fontFamily === 'Times New Roman' ? 'selected' : ''}>Times New Roman</option>
                        <option value="Courier New" ${fontFamily === 'Courier New' ? 'selected' : ''}>Courier New</option>
                        <option value="Georgia" ${fontFamily === 'Georgia' ? 'selected' : ''}>Georgia</option>
                    </select>
                </div>
                <div>
                    <label>Color:</label>
                    <input type="color" id="textColor" value="${textColor}">
                </div>
            </div>
        `);

        // Add event listeners for options
        select("#textSize").input(function () {
            fontSize = this.value();
            select("#sizeValue").html(fontSize + "px");
        });

        select("#fontFamily").changed(function () {
            fontFamily = this.value();
        });

        select("#textColor").input(function () {
            textColor = this.value();
        });
    };

    this.unselectTool = function () {
        // Clean up when switching tools
        if (textInput) {
            finalizeText();
        }
    };
} 