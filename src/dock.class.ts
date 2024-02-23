import * as PIXI from 'pixi.js';
import { Position } from './types';

export class Dock {
    private app: PIXI.Application;
    private dockGraphics: PIXI.Graphics;

    /**
     * The class constructor.
     *
     * @param app - link to the Pixi Application
     * @param x - the dock `x` position
     * @param y - the dock `y` position
     * @param width - the dock width
     * @param height - the dock height
     */
    constructor(app: PIXI.Application, x: number, y: number, width: number, height: number) {
        this.app = app;

        this.dockGraphics = new PIXI.Graphics();
        this.dockGraphics.beginFill(0xffff00);
        this.dockGraphics.drawRect(0, 0, width, height);
        this.dockGraphics.endFill();
        this.dockGraphics.x = x;
        this.dockGraphics.y = y;
        this.app.stage.addChild(this.dockGraphics);
    }

    /**
     * Returns the dock position.
     * @returns Position.
     */
    get position(): Position {
        return {
            x: this.dockGraphics.x,
            y: this.dockGraphics.y
        }
    }
}