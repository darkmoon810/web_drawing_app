function ImageUploadTool() {
    this.icon = "assets/image.svg";
    this.name = "imageUpload";

    let input = null;
    let loadedImage = null;
    let isDragging = false;
    let startX, startY;
    let currentX, currentY;
    let imageWidth, imageHeight;
    let originalCanvas = null;
    let currentScale = 1.0;
    let originalWidth, originalHeight;

    this.setup = function() {
        cursor('url(assets/image.svg) 10 10, pointer');
        input = createFileInput((file) => {
            if (file.type === 'image') {
                loadImage(file.data, (img) => {
                    loadedImage = img;
                    // Store original dimensions
                    const maxDim = 300;
                    if (img.width > img.height) {
                        originalWidth = maxDim;
                        originalHeight = (img.height / img.width) * maxDim;
                    } else {
                        originalHeight = maxDim;
                        originalWidth = (img.width / img.height) * maxDim;
                    }
                    // Set initial dimensions
                    imageWidth = originalWidth;
                    imageHeight = originalHeight;
                    currentScale = 1.0;
                    originalCanvas = get();
                    this.updateOptionsDisplay();
                });
            }
        });
        input.style('display', 'none');
        input.parent('content');
    };

    this.draw = function() {
        if (loadedImage) {
            if (mouseIsPressed && !isDragging) {
                let coords = mouseToCanvas(mouseX, mouseY);
                startX = coords.x;
                startY = coords.y;
                currentX = startX;
                currentY = startY;
                isDragging = true;
                originalCanvas = get();
            } else if (mouseIsPressed && isDragging) {
                let coords = mouseToCanvas(mouseX, mouseY);
                currentX = coords.x;
                currentY = coords.y;
                
                if (originalCanvas) {
                    image(originalCanvas, 0, 0);
                    image(loadedImage, 
                          currentX - imageWidth/2, 
                          currentY - imageHeight/2, 
                          imageWidth, 
                          imageHeight);
                }
            } else if (!mouseIsPressed && isDragging) {
                image(loadedImage, 
                      currentX - imageWidth/2, 
                      currentY - imageHeight/2, 
                      imageWidth, 
                      imageHeight);
                isDragging = false;
                loadedImage = null;
                originalCanvas = null;
                saveDrawingState();
                currentScale = 1.0;
                this.updateOptionsDisplay();
            }
        }
    };

    this.populateOptions = function() {
        select(".options").html(`
            <div class="upload-container"  style="padding: 10px;">
                <button id='uploadBtn'>Upload Image</button>
                <div id='scaleControls' style='margin-top: 10px;'>
                    <p>Use mouse drag to move image and click to place.</p>
                </div>
            </div>
        `);
        
        select("#uploadBtn").mousePressed(() => {
            if (input) {
                input.elt.click();
            } else {
                this.setup();
                input.elt.click();
            }
        });
    };

    this.updateOptionsDisplay = function() {
        let scaleDisplay = select('#scaleDisplay');
        if (scaleDisplay) {
            scaleDisplay.html(`Scale: ${(currentScale * 100).toFixed(0)}%`);
        }
    };

    this.unselectTool = function() {
        loadedImage = null;
        isDragging = false;
        originalCanvas = null;
        currentScale = 1.0;
        if (input) {
            input.remove();
            input = null;
        }
    };
} 