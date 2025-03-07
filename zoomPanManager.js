function ZoomPanManager() {
    this.name = "zoomPan";
	this.icon = "assets/zoom.jpg";
    this.scale = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    
    // Minimum and maximum zoom levels
    const MIN_ZOOM = 0.5;
    const MAX_ZOOM = 3.0;
    const ZOOM_STEP = 0.1;

    // Create zoom indicator
    this.createZoomIndicator = function() {
        let zoomIndicator = createDiv('');
        zoomIndicator.id('zoomIndicator');
        zoomIndicator.style('position', 'absolute');
        zoomIndicator.style('right', '20px');
        zoomIndicator.style('top', '70px');
        zoomIndicator.style('background-color', 'rgba(0, 0, 0, 0.7)');
        zoomIndicator.style('color', 'white');
        zoomIndicator.style('padding', '5px 10px');
        zoomIndicator.style('border-radius', '4px');
        zoomIndicator.style('font-family', 'Arial');
        zoomIndicator.style('font-size', '14px');
        this.updateZoomIndicator();
    }

    // Update zoom indicator
    this.updateZoomIndicator = function() {
        let zoomIndicator = select('#zoomIndicator');
        if (zoomIndicator) {
            zoomIndicator.html(`Zoom: ${floor(this.scale * 100)}%`);
        }
    }

    // Draw method required for toolbox integration
    this.draw = function() {
        cursor('zoom-in');
        
        if (mouseIsPressed) {
            if (!this.isDragging) {
                this.isDragging = true;
                this.startX = mouseX - this.panX;
                this.startY = mouseY - this.panY;
            }
            
            this.panX = mouseX - this.startX;
            this.panY = mouseY - this.startY;
        } else {
            this.isDragging = false;
        }
    };

    // Add mouseWheel handler for zooming
    this.handleMouseWheel = function(event) {
        let mx = mouseX;
        let my = mouseY;
        
        if (event.delta > 0 && this.scale > MIN_ZOOM) {
            this.scale -= ZOOM_STEP;
        } else if (event.delta < 0 && this.scale < MAX_ZOOM) {
            this.scale += ZOOM_STEP;
        }
        
        this.scale = constrain(this.scale, MIN_ZOOM, MAX_ZOOM);
        
        this.panX = mx - (mx - this.panX) * (this.scale / (this.scale - ZOOM_STEP));
        this.panY = my - (my - this.panY) * (this.scale / (this.scale - ZOOM_STEP));
        
        // Update zoom indicator when zooming
        this.updateZoomIndicator();
        
        return false;
    };

    this.populateOptions = function() {
        select(".options").html(`
            <div style="padding: 10px;">
                <button id="resetViewButton">Reset View</button>
                <div>Zoom: ${floor(this.scale * 100)}%</div>
            </div>
        `);
        
        // Add reset view functionality
        select("#resetViewButton").mouseClicked(() => {
            this.scale = 1.0;
            this.panX = 0;
            this.panY = 0;
        });
    };

    this.setup = function() {
        // Add zoom controls
        select('#zoomInButton').mousePressed(() => this.zoomIn());
        select('#zoomOutButton').mousePressed(() => this.zoomOut());
        select('#resetZoomButton').mousePressed(() => this.resetView());

        // Add pan functionality with spacebar + drag
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                cursor('grab');
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.code === 'Space') {
                cursor(ARROW);
                this.isDragging = false;
            }
        });
    }

    this.zoomIn = function() {
        if (this.scale < MAX_ZOOM) {
            this.scale += ZOOM_STEP;
            this.updateZoomLevel();
        }
    }

    this.zoomOut = function() {
        if (this.scale > MIN_ZOOM) {
            this.scale -= ZOOM_STEP;
            this.updateZoomLevel();
        }
    }

    this.resetView = function() {
        this.scale = 1.0;
        this.panX = 0;
        this.panY = 0;
        this.updateZoomLevel();
    }

    this.updateZoomLevel = function() {
        select('#zoomLevel').html(floor(this.scale * 100) + '%');
    }

    this.handleMousePressed = function() {
        if (keyIsDown(32)) { // Space key
            this.isDragging = true;
            this.startX = mouseX - this.panX;
            this.startY = mouseY - this.panY;
            cursor('grabbing');
            return true;
        }
        return false;
    }

    this.handleMouseDragged = function() {
        if (this.isDragging) {
            this.panX = mouseX - this.startX;
            this.panY = mouseY - this.startY;
            return true;
        }
        return false;
    }

    this.handleMouseReleased = function() {
        if (this.isDragging) {
            this.isDragging = false;
            cursor(ARROW);
        }
    }

    this.applyTransform = function() {
        // Apply zoom and pan transformations
        translate(width/2, height/2);
        scale(this.scale);
        translate(-width/2, -height/2);
        translate(this.panX, this.panY);
    }
} 