function CropTool() {
    this.name = "crop";
    this.icon = "assets/crop.svg";

    let startX = -1;
    let startY = -1;
    let cropX = -1;
    let cropY = -1;
    let cropWidth = -1;
    let cropHeight = -1;
    let isDragging = false;
    let isSelecting = false;
    let originalCanvas = null;

    this.draw = function() {
        cursor('crosshair');

        // Store the original canvas state if not already stored
        if (!originalCanvas && !isSelecting) {
            originalCanvas = get();
        }

        // Drawing the crop area
        if (mouseIsPressed) {
            if (startX == -1) {
                startX = mouseX;
                startY = mouseY;
                isSelecting = true;
            }

            if (isSelecting) {
                // Update crop dimensions
                cropX = min(startX, mouseX);
                cropY = min(startY, mouseY);
                cropWidth = abs(mouseX - startX);
                cropHeight = abs(mouseY - startY);

                // Redraw original canvas
                image(originalCanvas, 0, 0);

                // Draw crop overlay
                push();
                // Dark overlay outside crop area
                fill(0, 0, 0, 100);
                noStroke();
                // Top
                rect(0, 0, width, cropY);
                // Bottom
                rect(0, cropY + cropHeight, width, height - (cropY + cropHeight));
                // Left
                rect(0, cropY, cropX, cropHeight);
                // Right
                rect(cropX + cropWidth, cropY, width - (cropX + cropWidth), cropHeight);

                // Crop rectangle
                noFill();
                stroke(255);
                strokeWeight(2);
                rect(cropX, cropY, cropWidth, cropHeight);

                // Draw handles
                fill(255);
                stroke(0);
                strokeWeight(1);
                const handleSize = 8;
                // Corner handles
                rect(cropX - handleSize/2, cropY - handleSize/2, handleSize, handleSize);
                rect(cropX + cropWidth - handleSize/2, cropY - handleSize/2, handleSize, handleSize);
                rect(cropX - handleSize/2, cropY + cropHeight - handleSize/2, handleSize, handleSize);
                rect(cropX + cropWidth - handleSize/2, cropY + cropHeight - handleSize/2, handleSize, handleSize);

                // Display dimensions
                noStroke();
                fill(255);
                rect(cropX, cropY - 25, 100, 20);
                fill(0);
                textSize(12);
                text(`${cropWidth} × ${cropHeight}`, cropX + 5, cropY - 10);
                pop();
            }
        } else {
            if (isSelecting) {
                isSelecting = false;
            }
        }
    };

    this.populateOptions = function() {
        select(".options").html(`
            <div style="padding: 10px;">
                <div class="crop-controls">
                    <button id="applyCrop" class="crop-button">
                        <span>✓</span> Apply Crop
                    </button>
                    <button id="cancelCrop" class="crop-button">
                        <span>✕</span> Cancel
                    </button>
                </div>
                <div class="crop-info" style="margin-top: 10px;">
                    <p>Click and drag to select crop area</p>
                    <p>Selected: <span id="cropDimensions">No selection</span></p>
                </div>
            </div>
        `);

        // Add styles
        let style = document.createElement('style');
        style.textContent = `
            .crop-controls {
                display: flex;
                gap: 10px;
            }

            .crop-button {
                padding: 8px 15px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 5px;
                font-size: 14px;
                transition: all 0.3s ease;
            }

            #applyCrop {
                background-color: #4CAF50;
                color: white;
            }

            #applyCrop:hover {
                background-color: #45a049;
            }

            #cancelCrop {
                background-color: #f44336;
                color: white;
            }

            #cancelCrop:hover {
                background-color: #da190b;
            }

            .crop-info {
                font-size: 16px;
                color: #ffffff;
                font-family: Arial, sans-serif;
            }
        `;
        document.head.appendChild(style);

        // Add event listeners
        select("#applyCrop").mouseClicked(() => {
            if (cropWidth > 0 && cropHeight > 0) {
                // Get the cropped portion of the original canvas
                let croppedImage = originalCanvas.get(cropX, cropY, cropWidth, cropHeight);
                
                // Resize canvas and draw the cropped image
                resizeCanvas(cropWidth, cropHeight);
                background(255);
                image(croppedImage, 0, 0);
                
                // Update the state array for undo functionality
                if (typeof saveDrawingState === 'function') {
                    saveDrawingState();
                }
                
                // Reset crop values and original canvas
                this.resetCrop();
            }
        });

        select("#cancelCrop").mouseClicked(() => {
            // Restore original canvas
            if (originalCanvas) {
                image(originalCanvas, 0, 0);
            }
            this.resetCrop();
        });
    };

    this.resetCrop = function() {
        startX = -1;
        startY = -1;
        cropX = -1;
        cropY = -1;
        cropWidth = -1;
        cropHeight = -1;
        isSelecting = false;
        originalCanvas = null;
    };

    this.unselectTool = function() {
        // Restore original canvas if canceling
        if (originalCanvas) {
            image(originalCanvas, 0, 0);
        }
        this.resetCrop();
    };
} 