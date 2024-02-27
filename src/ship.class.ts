import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';
import { Tween } from '@tweenjs/tween.js';
import { Container, Position } from './types';

export enum ShipTypeOptions {
    empty = 'empty',
    full = 'full'
}
export type ShipType = ShipTypeOptions.empty | ShipTypeOptions.full;

export class Ship implements Container {
    static readonly width: number = 75;
    static readonly height: number = 30;
    static readonly tweenLongDuration: number = 5000; // one tween movement long duration in milliseconds
    static readonly tweenMiddleDuration: number = 4000; // one tween movement middle duration in milliseconds
    static readonly tweenShortDuration: number = 1000; // one tween movement short duration in milliseconds

    private app: PIXI.Application;
    private readonly sprite: PIXI.Graphics;
    private readonly color: number = 0xABABAB;
    private readonly type: ShipType;

    private _empty: boolean = false;

    /**
     * The class constructor.
     *
     * @param app - reference to the Pixi Application
     * @param x - the ship `x` position
     * @param y - the ship `y` position
     * @param type - the ship type
     * @param color - the ship color
     */
    constructor(
        app: PIXI.Application,
        x: number = 0,
        y: number = 0,
        type: ShipType = ShipTypeOptions.empty,
        color: number = 0xABABAB
    ) {
        this.app = app;
        this.type = type;
        this.color = color;

        this.sprite = new PIXI.Graphics();
        this.sprite.pivot.set(0, Ship.height / 2);
        this.sprite.x = x;
        this.sprite.y = y;

        if (this.type === ShipTypeOptions.empty) {
            this.unload();
        } else {
            this.load();
        }

        this.app.stage.addChild(this.sprite);
    }

    /**
     * Provides the sprite's animated movement from its start position to the target position.
     * Use linear easing for animation.
     *
     * @param targetPosition - target position {`x`,`y`}
     * @param duration - movement duration in milliseconds
     * @returns Tween<PIXI.ObservablePoint>
     */
    moveToTween(
        targetPosition: Position,
        duration: number = Ship.tweenLongDuration
    ): Tween<PIXI.ObservablePoint> {
        return new Tween(this.sprite.position)
            .to({ x: targetPosition.x, y: targetPosition.y }, duration)
            .easing(TWEEN.Easing.Linear.None);
    }

    /**
     * Loads (fill) the ship.
     */
    load(): void {
        this._empty = false;
        this.drawFullShip();
    }

    /**
     * Unloads (empty) the ship.
     */
    unload(): void {
        this._empty = true;
        this.drawEmptyShip();
    }

    /**
     * Returns flag whether the ship is empty.
     */
    get empty(): boolean {
        return this._empty;
    }

    /**
     * Draws filled (full) ship.
     * Clears sprite before drawing.
     * @private
     */
    private drawFullShip(): void {
        if (!this.sprite.destroyed) {
            this.sprite.clear();
            this.sprite.beginFill(this.color);
            this.sprite.drawRect(0, 0, Ship.width, Ship.height);
            this.sprite.endFill();
        }
    }

    /**
     * Draws empty ship.
     * Clears sprite before drawing.
     * @param thickness is a line thickness in pixels
     * @private
     */
    private drawEmptyShip(thickness: number = 4): void {
        if (!this.sprite.destroyed) {
            this.sprite.clear();
            this.sprite.lineStyle(thickness, this.color);
            this.sprite.drawRect(0, 0, Ship.width - Math.round(thickness/2), Ship.height - Math.round(thickness/2));
        }
    }

    /**
     * Removes the ship from the app stage.
     * Destroys the sprite object completely.
     */
    remove(): void {
        this.app.stage.removeChild(this.sprite);
        this.sprite.destroy({ children: true, texture: true, baseTexture: true });
    }
}

