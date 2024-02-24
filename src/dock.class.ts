import * as PIXI from 'pixi.js';
import { Position } from './types';

export class Dock {
    private app: PIXI.Application;
    private sprite: PIXI.Graphics;

    /**
     * The class constructor.
     *
     * @param app - reference to the Pixi Application
     * @param x - the dock `x` position
     * @param y - the dock `y` position
     * @param width - the dock width
     * @param height - the dock height
     */
    constructor(app: PIXI.Application, x: number, y: number, width: number, height: number) {
        this.app = app;

        this.sprite = new PIXI.Graphics();
        this.sprite.beginFill(0xffff00);
        this.sprite.drawRect(0, 0, width, height);
        this.sprite.endFill();
        this.sprite.x = x;
        this.sprite.y = y;
        this.app.stage.addChild(this.sprite);
    }

    /**
     * Returns the dock position.
     * @returns Position.
     */
    get position(): Position {
        return {
            x: this.sprite.x,
            y: this.sprite.y
        }
    }
}