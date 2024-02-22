import * as PIXI from 'pixi.js';
import { Dock } from './dock.class';
import { Ship } from './ship.class';

export class Port {
    private readonly bg: number = 0x17577E;

    static readonly dockWidth: number = 40;
    static readonly dockHeight: number = 120;

    private readonly app: PIXI.Application;
    private width: number;
    private height: number;
    private docks: Dock[];
    private ships: Ship[];

    constructor(app: PIXI.Application, width: number, height: number) {
        this.app = app;
        this.width = width;
        this.height = height;
        this.docks = [];
        this.ships = [];

        // Create port graphics
        const portGraphics: PIXI.Graphics = new PIXI.Graphics();
        portGraphics.beginFill(this.bg);
        portGraphics.drawRect(0, 0, width, height);
        portGraphics.endFill();
        this.app.stage.addChild(portGraphics);

        // Create docks
        for (let i: number = 0; i < 4; i++) {
            const dockX: number = 0;
            const dockY: number = i * (Port.dockHeight + 20) + 30; // Adjust for spacing between docks
            const dock: Dock = new Dock(this.app, dockX, dockY, Port.dockWidth, Port.dockHeight);
            this.docks.push(dock);
        }

        // Create one ship
        const ship: Ship = new Ship(this.app);
        this.ships.push(ship);
    }
}