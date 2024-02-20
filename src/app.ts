import * as PIXI from 'pixi.js';

// Create a PixiJS application
const app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
});
document.body.appendChild(app.view as unknown as Node);

// Create a new PIXI.Graphics object
const graphics = new PIXI.Graphics();
graphics.beginFill(0xff0000);
graphics.drawRect(0, 0, 100, 100);
graphics.endFill();

// Add the graphics to the stage
app.stage.addChild(graphics);
