import * as PIXI from 'pixi.js';
import { Dock } from './dock.class';
import { Ship } from './ship.class';
import { Tween } from '@tweenjs/tween.js';

export class Port {
    private readonly bg: number = 0x17577E;

    static readonly dockWidth: number = 40;
    static readonly dockHeight: number = 120;

    private readonly app: PIXI.Application;
    private readonly appWidth: number;
    private readonly appHeight: number;
    private width: number;
    private height: number;
    private docks: Dock[];
    private ships: Ship[];

    /**
     *  The class constructor.
     *
     * @param app - link to the Pixi Application
     * @param width - the port width
     * @param height - the port height
     * @param appWidth - the application width
     * @param appHeight - the application height
     */
    constructor(app: PIXI.Application, width: number, height: number, appWidth: number, appHeight: number) {
        this.app = app;
        this.appWidth = appWidth;
        this.appHeight = appHeight;
        this.width = width;
        this.height = height;
        this.docks = [];
        this.ships = [];

        // Create port graphics
        const sprite: PIXI.Graphics = new PIXI.Graphics();
        sprite.beginFill(this.bg);
        sprite.drawRect(0, 0, width, height);
        sprite.endFill();
        this.app.stage.addChild(sprite);

        // Create docks
        for (let i: number = 0; i < 4; i++) {
            const dockX: number = 0;
            const dockY: number = i * (Port.dockHeight + 20) + 30; // Adjust for spacing between docks
            const dock: Dock = new Dock(this.app, dockX, dockY, Port.dockWidth, Port.dockHeight);
            this.docks.push(dock);
        }

        // Create one ship
        const ship: Ship = new Ship(this.app, this.appWidth, 0);
        this.ships.push(ship);

        const randomDock: number = Math.floor(Math.random() * 4); // Generates a random number between 0 and 3
        // Prepare tween to move ship to the random dock
        const shipToDock: Tween<PIXI.ObservablePoint> = ship.moveTo(this.docks[randomDock].position);
        // Prepare tween to move ship outside the stage
        const shipToOutside: Tween<PIXI.ObservablePoint> = ship.moveTo({ x: this.appWidth, y: this.appHeight });

        // Chain the tweens with a delay of 1 second between them
        shipToDock.chain(shipToOutside);
        shipToOutside.delay(1000).onComplete(() => {
            this.removeShip(ship);
        });
        // Start a tween within delay of 1 second
        shipToDock.start(1000);
    }

    /**
     * Removes ship instance from the app.
     * @param ship to be removed
     */
    private removeShip(ship: Ship): void {
        ship.remove();
        ship = null;
    }
}