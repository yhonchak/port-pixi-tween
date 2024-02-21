import * as PIXI from 'pixi.js';

export class Port {
    private readonly bg: number = 0x17577E;

    private app: PIXI.Application;
    private width: number;
    private height: number;

    constructor(app: PIXI.Application, width: number, height: number) {
        this.app = app;
        this.width = width;
        this.height = height;

        // Create port graphics
        const portGraphics = new PIXI.Graphics();
        portGraphics.beginFill(this.bg);
        portGraphics.drawRect(0, 0, width, height);
        portGraphics.endFill();
        this.app.stage.addChild(portGraphics);
    }
}