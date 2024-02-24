import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';
import { Tween } from '@tweenjs/tween.js';
import { Position } from './types';

export class Ship {
    static readonly width: number = 90;
    static readonly height: number = 30;

    private app: PIXI.Application;
    private sprite: PIXI.Graphics;

    /**
     * The class constructor.
     *
     * @param app - link to the Pixi Application
     * @param x - the ship `x` position
     * @param y - the ship `y` position
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
    }

    /**
     * Provides the sprite's animated movement from its start position to the target position.
     * Use linear easing for animation.
     *
     * @param targetPosition - target position {`x`,`y`}
     * @param duration - movement duration in milliseconds
     * @returns Tween<PIXI.ObservablePoint>
     */
    moveTo(
        targetPosition: Position,
        duration: number = 4000
    ): Tween<PIXI.ObservablePoint> {
        return new Tween(this.sprite.position)
            .to({ x: targetPosition.x, y: targetPosition.y }, duration)
            .easing(TWEEN.Easing.Linear.None);
    }
}

