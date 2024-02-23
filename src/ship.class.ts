import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';
import { Tween } from '@tweenjs/tween.js';

export class Ship {
    static readonly width: number = 90;
    static readonly height: number = 30;

    private app: PIXI.Application;
    private sprite: PIXI.Graphics;

    /**
     * The class constructor.
     *
     * @param app - link to the Pixi Application
     * @param x - the object's position `x`
     * @param y - the object's position `y`
     */
    constructor(app: PIXI.Application, x: number = 0, y: number = 0) {
        this.app = app;

        this.sprite = new PIXI.Graphics();
        this.sprite.beginFill(0xABABAB);
        this.sprite.drawRect(0, 0, Ship.width, Ship.height);
        this.sprite.endFill();
        this.sprite.x = x;
        this.sprite.y = y;

        this.app.stage.addChild(this.sprite);

        this.moveTo(100, 100);
    }

    /**
     * Provides the sprite's animated movement from it's start position to the target position.
     *
     * @param targetX - target position `x`
     * @param targetY - target position `y`
     * @param duration - movement duration in milliseconds
     * @param startingDelay - delay in milliseconds before starting a movement
     * @returns Tween<PIXI.ObservablePoint>
     */
    moveTo(
        targetX: number,
        targetY: number,
        duration: number = 5000,
        startingDelay: number = 1000
    ): Tween<PIXI.ObservablePoint> {
        return new Tween(this.sprite.position)
            .to({ x: targetX, y: targetY }, duration)
            .easing(TWEEN.Easing.Linear.None)
            .start(startingDelay);
    }
}

