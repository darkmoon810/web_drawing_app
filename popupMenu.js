class PopupMenu {
    constructor() {
        this.items = [];
        this.isVisible = false;
    }
    
    show(x, y) {
        // Convert canvas position to screen coordinates
        let screenPos = canvasToScreen(x, y);
        
        this.isVisible = true;
        
        // Position menu at screen coordinates
        this.menuElement = createDiv();
        this.menuElement.position(screenPos.x, screenPos.y);
        this.menuElement.class('popup-menu');
        
        // Add menu items
        this.items.forEach(item => {
            let menuItem = createButton(item.label);
            menuItem.parent(this.menuElement);
            menuItem.mousePressed(() => {
                item.action();
                this.hide();
            });
        });
    }
} 