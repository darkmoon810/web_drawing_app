class OptionsBox {
    constructor() {
        this.x = 50;
        this.y = 50;
        this.width = 200;
        this.height = 300;
    }
    
    draw() {
        // Convert position to screen coordinates
        let screenPos = canvasToScreen(this.x, this.y);
        
        // Draw options box at screen coordinates
        push();
        fill(240);
        rect(screenPos.x, screenPos.y, this.width, this.height);
        
        // Position controls using screen coordinates
        this.sizeSlider.position(screenPos.x + 10, screenPos.y + 30);
        this.colorPicker.position(screenPos.x + 10, screenPos.y + 70);
        // ... other controls
        pop();
    }
    
    checkMouse() {
        // Convert bounds to screen coordinates for hit testing
        let screenPos = canvasToScreen(this.x, this.y);
        
        return mouseX > screenPos.x && mouseX < screenPos.x + this.width &&
               mouseY > screenPos.y && mouseY < screenPos.y + this.height;
    }
} 