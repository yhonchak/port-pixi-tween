import * as PIXI from 'pixi.js';
import { Dock } from './dock.class';
import { Ship } from './ship.class';
import { Tween } from '@tweenjs/tween.js';
import { Position } from './types';
import { delay } from './utils';

export class Port {
    static readonly shipAppearanceFrequency: number = 8000; // Frequency of ships appearance: once per 8 seconds

    private readonly bg: number = 0x17577E;

    static readonly dockWidth: number = 40;
    static readonly dockHeight: number = 120;

    private readonly app: PIXI.Application;
    private readonly appWidth: number;
    private readonly appHeight: number;
    private readonly gateTopPosition: Position;
    private readonly gateBottomPosition: Position;

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

        // Calculate Gate's positions
        this.gateTopPosition = { x: this.width, y: Math.round(this.height / 3) };
        this.gateBottomPosition = { x: this.width, y: Math.round(this.height - this.height / 3) };

        // Create barriers graphics
        const barrierWidth: number = 5;
        const barrierColor: number = 0xEED202;

        const barrierTop: PIXI.Graphics = new PIXI.Graphics();
        barrierTop.beginFill(barrierColor);
        barrierTop.drawRect(width - barrierWidth, 0, barrierWidth, this.gateTopPosition.y);
        barrierTop.endFill();
        this.app.stage.addChild(barrierTop);

        const barrierBottom: PIXI.Graphics = new PIXI.Graphics();
        barrierBottom.beginFill(barrierColor);
        barrierBottom.drawRect(width - barrierWidth, this.gateBottomPosition.y, barrierWidth, this.height);
        barrierBottom.endFill();
        this.app.stage.addChild(barrierBottom);

        // Create docks
        for (let i: number = 0; i < 4; i++) {
            const dockX: number = 0;
            const dockY: number = i * (Port.dockHeight + 20) + 30; // Adjust for spacing between docks
            const dock: Dock = new Dock(this.app, dockX, dockY, Port.dockWidth, Port.dockHeight);
            // Dock is empty by default
            dock.unload();

            this.docks.push(dock);
        }

        // Start the new ship travelling
        this.startShipTravel();

        setInterval(() => {
            // Start the new ship travelling
            this.startShipTravel();
        }, Port.shipAppearanceFrequency);
    }

    /**
     * Creates a new ship.
     * Starts tweens chain to provide the ship travel.
     * Removes ship when the travel is finished.
     * @private
     */
    private startShipTravel(): void {
        // Create one ship
        const ship: Ship = new Ship(this.app, this.appWidth, 0);
        if (Math.floor(Math.random() * 2) === 0) {
            ship.unload();
        } else {
            ship.load();
        }

        // Add the new ship to the class array
        this.ships.push(ship);

        // Generate a random number between 0 and 3
        const randomDock: number = Math.floor(Math.random() * 4);
        // Prepare tween to move ship to the center of the port Gate to go inside
        const shipToGateIn: Tween<PIXI.ObservablePoint> = ship.moveTo(
            {
                x: this.gateTopPosition.x,
                y: this.gateBottomPosition.y - Math.round((this.gateBottomPosition.y - this.gateTopPosition.y) / 2)
            }
        );
        // Prepare tween to move ship to the center of the port Gate to go outside
        const shipToGateOut: Tween<PIXI.ObservablePoint> = ship.moveTo(
            {
                x: this.gateTopPosition.x,
                y: this.gateBottomPosition.y - Math.round((this.gateBottomPosition.y - this.gateTopPosition.y) / 2)
            }
        );
        // Prepare tween to move ship to the random dock
        const shipToDock: Tween<PIXI.ObservablePoint> = ship.moveTo(this.docks[randomDock].position);
        // Prepare tween to move ship outside the stage
        const shipToOutside: Tween<PIXI.ObservablePoint> = ship.moveTo({ x: this.appWidth, y: this.appHeight });

        const timeInterval: number = 1000;
        // Chain the tweens with a delay of 1 second between them
        shipToGateIn.chain(shipToDock);
        shipToDock.chain(shipToGateOut).onComplete(async () => {
            await delay(timeInterval / 2);

            // Unload or load the ship and the target dock depending on their state
            if (ship.empty) {
                if (!this.docks[randomDock].empty) {
                    ship.load();
                    this.docks[randomDock].unload();
                }
            } else {
                if (this.docks[randomDock].empty) {
                    ship.unload();
                    this.docks[randomDock].load();
                }
            }
        });
        shipToGateOut.chain(shipToOutside);

        shipToGateOut.delay(timeInterval);
        shipToOutside.onComplete(() => {
            this.removeShip(ship);
        });
        // Start a tween within delay of 1 second
        shipToGateIn.start();
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