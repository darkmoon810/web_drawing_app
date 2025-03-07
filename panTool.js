function PanTool() {
    this.icon = "assets/pan.png"; // You'll need to add a pan icon to your assets folder
    this.name = "pan";

    let isPanning = false;
    let lastX, lastY;

    this.draw = function() {
        cursor('grab');
        
        if (mouseIsPressed) {
            cursor('grabbing');
            
            if (!isPanning) {
                // Start panning
                isPanning = true;
                lastX = mouseX;
                lastY = mouseY;
            } else {
                // Calculate the distance moved
                let deltaX = mouseX - lastX;
                let deltaY = mouseY - lastY;
                
                // Update the pan position in ZoomPanManager
                zoomPanManager.panX += deltaX;
                zoomPanManager.panY += deltaY;
                
                // Update last position
                lastX = mouseX;
                lastY = mouseY;
            }
        } else {
            isPanning = false;
        }
    };

    this.unselectTool = function() {
        cursor(ARROW);
        isPanning = false;
    };

    this.populateOptions = function() {
        select(".options").html(
            "<p>Click and drag to pan the canvas</p>" +
            "<button id='resetPan'>Reset Pan</button>"
        );

        // Add reset button functionality
        select("#resetPan").mousePressed(() => {
            zoomPanManager.panX = 0;
            zoomPanManager.panY = 0;
        });
    };
} 