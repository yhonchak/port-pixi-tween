import * as PIXI from 'pixi.js';
import { Container, Position } from './types';

export class Dock implements Container {
    private app: PIXI.Application;
    private sprite: PIXI.Graphics;

    private readonly color: number = 0xEED202;
    private width: number;
    private height: number;

    private _empty: boolean = false;

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
        this.width = width;
        this.height = height;

        this.sprite = new PIXI.Graphics();
        this.sprite.x = x;
        this.sprite.y = y;

        this.unload();

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

    /**
     * Loads (fill) the dock.
     */
    load(): void {
        this._empty = false;
        this.drawFullDock();
    }

    /**
     * Unloads (empty) the dock.
     */
    unload(): void {
        this._empty = true;
        this.drawEmptyDock();
    }

    /**
     * Returns flag whether the dock is empty.
     */
    get empty(): boolean {
        return this._empty;
    }

    /**
     * Draws filled (full) dock.
     * Clears sprite before drawing.
     * @private
     */
    private drawFullDock(): void {
        this.sprite.clear();
        this.sprite.beginFill(this.color);
        this.sprite.drawRect(
            0,
            0,
            this.width,
            this.height
        );
        this.sprite.endFill();
    }

    /**
     * Draws empty dock.
     * Clears sprite before drawing.
     * @private
     */
    private drawEmptyDock(thickness: number = 4): void {
        this.sprite.clear();
        this.sprite.lineStyle(thickness, this.color);
        this.sprite.drawRect(
            Math.round(thickness / 2),
            Math.round(thickness / 2),
            this.width - thickness,
            this.height - thickness
        );
    }
}