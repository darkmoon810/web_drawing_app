class ZoomPanTool {
    constructor() {
        this.icon = "assets/zoomPan.jpg"; // You'll need to add this icon
        this.name = "ZoomPan";
    }

    draw() {
        // This tool doesn't need to draw anything
        // Zoom and pan are handled by the global handlers
    }

    mousePressed() {
        // Optional: Add specific zoom/pan behavior when tool is selected
    }

    mouseReleased() {
        // Optional: Reset any tool-specific states
    }
} 