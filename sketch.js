// Global variables for canvas and tools
let canvas;
let canvasContainer;
let toolbox;
let colourP;
let currentScale = 1.0;
let panX = 0;
let panY = 0;
let undoStack = [];
let selectedTool = null;

function setup() {
    // Create canvas container div
    canvasContainer = select('#content');
    canvas = createCanvas(canvasContainer.width, canvasContainer.height);
    canvas.parent("content");

    // Set initial background
    background(255);

    // Create toolbox and color palette
    toolbox = new Toolbox();
    colourP = new ColourPalette();

    // Initialize tools
    toolbox.addTool(new FreehandTool());
    toolbox.addTool(new LineToTool());
    toolbox.addTool(new SprayCanTool());
    toolbox.addTool(new MirrorDrawTool());
    toolbox.addTool(new EraserTool());
    toolbox.addTool(new ShapeDrawTool());
    toolbox.addTool(new TextTool());
	toolbox.addTool(new CropTool());
    toolbox.addTool(new ImageUploadTool());
    toolbox.addTool(new BucketTool());
    toolbox.addTool(new BrushTool());

    new HelperFunctions();

    // Save initial canvas state
    saveDrawingState();

    // Add event listeners for keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Undo: Ctrl/Cmd + Z
        if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
            undo();
            event.preventDefault();
        }
        // Add save shortcut (Ctrl/Cmd + S)
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            saveCanvas();
            event.preventDefault();
        }
        // Add clear shortcut (Ctrl/Cmd + Shift + C)
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'C') {
            clearCanvas();
            event.preventDefault();
        }
    });

    // Add mouse wheel event for zoom
    canvas.mouseWheel(function(event) {
        if (event.ctrlKey || event.metaKey) {
            let scaleFactor = 1;
            if (event.delta < 0) {
                scaleFactor = 1.05;
            } else {
                scaleFactor = 0.95;
            }
            
            // Limit zoom level
            let newScale = currentScale * scaleFactor;
            if (newScale >= 0.5 && newScale <= 3) {
                // Get mouse position before zoom
                let mouseXBeforeZoom = (mouseX - panX) / currentScale;
                let mouseYBeforeZoom = (mouseY - panY) / currentScale;

                currentScale = newScale;

                // Adjust pan to keep the point under mouse cursor fixed
                panX = mouseX - mouseXBeforeZoom * currentScale;
                panY = mouseY - mouseYBeforeZoom * currentScale;

                event.preventDefault();
            }
        }
    });

    // Create clear and save buttons
    let clearButton = createButton('Clear Canvas');
    clearButton.parent('content');
    clearButton.position(10, 10);
    clearButton.mousePressed(clearCanvas);
    clearButton.class('action-button');

    let saveButton = createButton('Save Image');
    saveButton.parent('content');
    saveButton.position(100, 10);
    saveButton.mousePressed(saveCanvas);
    saveButton.class('action-button');
}

function draw() {
    push(); // Save transformation state
    
    // Apply transformations for pan and zoom
    translate(panX, panY);
    scale(currentScale);

    // Call the draw function of selected tool
    if (toolbox.selectedTool && toolbox.selectedTool.hasOwnProperty("draw")) {
        toolbox.selectedTool.draw();
    }
    
    pop(); // Restore transformation state
}

// Convert mouse coordinates to canvas coordinates
function mouseToCanvas(x, y) {
    return {
        x: (x - panX) / currentScale,
        y: (y - panY) / currentScale
    };
}

// Save current canvas state for undo
function saveDrawingState() {
    push(); // Save current transformation state
    
    // Reset transformations temporarily to capture the whole canvas
    translate(-panX, -panY);
    scale(1/currentScale);
    
    // Limit undo stack size
    if (undoStack.length >= 20) {
        undoStack.shift();
    }
    
    // Capture the current canvas state
    let state = get();
    undoStack.push(state);
    
    pop(); // Restore transformation state
}

// Undo last action
function undo() {
    if (undoStack.length > 1) {
        undoStack.pop(); // Remove current state
        let previousState = undoStack[undoStack.length - 1];
        
        push(); // Save current transformation state
        
        // Reset transformations temporarily
        translate(-panX, -panY);
        scale(1/currentScale);
        
        // Clear canvas and draw previous state
        clear();
        image(previousState, 0, 0);
        
        pop(); // Restore transformation state
    }
}

// Handle window resize
function windowResized() {
    // Resize canvas to fit container
    resizeCanvas(canvasContainer.width, canvasContainer.height);
    
    // Redraw canvas content
    if (undoStack.length > 0) {
        image(undoStack[undoStack.length - 1], 0, 0);
    }
}

// Handle mouse drag for panning
function mouseDragged() {
    if (mouseButton === CENTER) {
        panX += mouseX - pmouseX;
        panY += mouseY - pmouseY;
        return false;
    }
}

// Add this function to handle tool changes
function mouseReleased() {
    // Save state after drawing is complete
    if (toolbox.selectedTool) {
        saveDrawingState();
    }
}

// Clear canvas function
function clearCanvas() {
    // Save the current transformation state
    push();
    
    // Reset transformations
    translate(-panX, -panY);
    scale(1/currentScale);
    
    // Clear the canvas
    background(255);
    
    // Restore transformation state
    pop();
    
    // Clear the undo stack except for this new blank state
    undoStack = [];
    saveDrawingState();
}

// Save canvas function
function saveCanvas() {
    // Save the current transformation state
    push();
    
    // Reset transformations to capture the whole canvas
    translate(-panX, -panY);
    scale(1/currentScale);
    
    // Get current date and time for filename
    let date = new Date();
    let filename = 'drawing_' + 
                  date.getFullYear() + 
                  (date.getMonth() + 1) + 
                  date.getDate() + '_' +
                  date.getHours() + 
                  date.getMinutes() + 
                  date.getSeconds();
    
    // Save the canvas
    saveCanvas(canvas, filename, 'png');
    
    // Restore transformation state
    pop();
}
