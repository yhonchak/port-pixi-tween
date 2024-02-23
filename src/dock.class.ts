import * as PIXI from 'pixi.js';

export class Dock {
    private app: PIXI.Application;
    private sprite: PIXI.Graphics;

    constructor(app: PIXI.Application, x: number, y: number, width: number, height: number) {
        this.app = app;

        this.sprite = new PIXI.Graphics();
        this.sprite.beginFill(0xffff00);
        this.sprite.drawRect(x, y, width, height);
        this.sprite.endFill();
        this.app.stage.addChild(this.sprite);
    }
}