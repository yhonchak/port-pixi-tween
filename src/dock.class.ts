import * as PIXI from 'pixi.js';

export class Dock {
    private app: PIXI.Application;
    private dockGraphics: PIXI.Graphics;

    constructor(app: PIXI.Application, x: number, y: number, width: number, height: number) {
        this.app = app;

        this.dockGraphics = new PIXI.Graphics();
        this.dockGraphics.beginFill(0xffff00);
        this.dockGraphics.drawRect(x, y, width, height);
        this.dockGraphics.endFill();
        this.app.stage.addChild(this.dockGraphics);
    }
}