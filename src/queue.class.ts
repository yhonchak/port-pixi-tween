import * as PIXI from 'pixi.js';
import { Position } from './types';
import { Ship } from './ship.class';

export class Queue {
    static gap: number = 10;

    private app: PIXI.Application;
    private readonly sprite: PIXI.Graphics;

    private readonly _ships: Ship[];

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
        this.sprite.x = x;
        this.sprite.y = y;

        this.app.stage.addChild(this.sprite);

        this._ships = [];
    }

    /**
     * Returns available position in the queue.
     * @param ship for calculating its position
     * @returns Position.
     */
    availablePosition(ship: Ship): Position {
        return {
            x: this.sprite.x + this._ships.indexOf(ship) * (Ship.width + Queue.gap),
            y: this.sprite.y
        }
    }

    /**
     * Returns all ships.
     */
    get ships(): Ship[] {
        return this._ships;
    }

    /**
     * Adds ship to the queue line.
     * @param ship to be added
     */
    addShip(ship: Ship): void {
        this._ships.push(ship);
    }

    /**
     * Returns the first ship from queue.
     * Returns `null` if queue is empty.
     */
    get firstShip(): Ship {
        return this.empty ? null : this._ships[0];
    }

    /**
     * Removes the first ship from the queue.
     */
    removeFirstShip(): void {
        this._ships.shift();
    }

    /**
     * Checks whether the queue is empty.
     */
    get empty(): boolean {
        return this._ships.length === 0;
    }
}