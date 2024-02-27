import * as PIXI from 'pixi.js';
import { Position } from './types';
import { Ship } from './ship.class';

export class Queue {
    static gap: number = 10;

    private app: PIXI.Application;
    private readonly sprite: PIXI.Graphics;

    private ships: Ship[];

    /**
     * The class constructor.
     *
     * @param app - reference to the Pixi Application
     * @param x - the queue `x` position
     * @param y - the queue `y` position
     */
    constructor(app: PIXI.Application, x: number = 0, y: number = 0) {
        this.app = app;

        this.sprite = new PIXI.Graphics();
        // temporary graphics
        this.sprite.beginFill(0x000000);
        this.sprite.drawRect(0, 0, 25, 25);
        this.sprite.endFill();

        this.sprite.x = x;
        this.sprite.y = y;

        this.app.stage.addChild(this.sprite);

        this.ships = [];
    }

    /**
     * Returns available position in the queue.
     * @returns Position.
     */
    get availablePosition(): Position {
        return {
            x: this.sprite.x + this.ships.length * (Ship.width + Queue.gap),
            y: this.sprite.y
        }
    }

    /**
     * Adds ship to the queue line.
     * @param ship to be added
     */
    addShip(ship: Ship): void {
        this.ships.push(ship);
    }
}