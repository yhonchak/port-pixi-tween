import * as PIXI from 'pixi.js';

export class Ship {
    static readonly width: number = 90;
    static readonly height: number = 30;

    private app: PIXI.Application;
    private sprite: PIXI.Graphics;

    constructor(app: PIXI.Application) {
        this.app = app;

        this.sprite = new PIXI.Graphics();
        this.sprite.beginFill(0xABABAB);
        this.sprite.drawRect(0, 0, Ship.width, Ship.height);
        this.sprite.endFill();
        this.sprite.x = 300;
        this.sprite.y = 300;

        this.app.stage.addChild(this.sprite);
    }
}