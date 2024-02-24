import * as PIXI from 'pixi.js';
import { Dock } from './dock.class';
import { Ship } from './ship.class';

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
     * @param app - reference to the Pixi Application
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

        // Moves ship to the random dock
        const randomDock: number = Math.floor(Math.random() * 4); // Generates a random number between 0 and 3
        ship.moveTo(this.docks[randomDock].position);
    }
}