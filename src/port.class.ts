import * as PIXI from 'pixi.js';
import { Dock } from './dock.class';
import { Ship } from './ship.class';
import { Tween } from '@tweenjs/tween.js';
import { delay } from './utils';
import { Queue } from './queue.class';
import { ShipEmpty } from './ship.empty.class';
import { ShipFull } from './ship.full.class';
import { Gate } from './gate.class';

export class Port {
    static readonly shipAppearanceFrequency: number = 8000; // Frequency of ships appearance: once per 8 seconds
    static readonly shipTimeInPort: number = 5000; // Time of the ship's stay in the port

    private readonly bg: number = 0x17577E;

    static readonly dockWidth: number = 40;
    static readonly dockHeight: number = 120;

    private readonly app: PIXI.Application;
    private readonly appWidth: number;
    private readonly appHeight: number;

    private readonly emptyShipsQueue: Queue;
    private readonly fullShipsQueue: Queue;

    private readonly width: number;
    private readonly height: number;
    private docks: Dock[];

    private gate: Gate;

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

        // Create port graphics
        const sprite: PIXI.Graphics = new PIXI.Graphics();
        sprite.beginFill(this.bg);
        sprite.drawRect(0, 0, width, height);
        sprite.endFill();
        this.app.stage.addChild(sprite);

        // Create the port Gate with calculated positions
        this.gate = new Gate(
            this.app,
            { x: this.width, y: Math.round(this.height / 3) },
            { x: this.width, y: Math.round(this.height - this.height / 3) }
        );

        // Create the queue lines
        this.emptyShipsQueue = new Queue(this.app, this.gate.topPosition.x + 20, this.gate.topPosition.y);
        this.fullShipsQueue = new Queue(this.app, this.gate.bottomPosition.x + 20, this.gate.bottomPosition.y);

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
        let newShip: Ship;
        // Create a ship of random type (empty or full)
        if (Math.random() < 0.495) {
            newShip = new ShipEmpty(this.app, this.appWidth, this.gate.topPosition.y);
        } else {
            newShip = new ShipFull(this.app, this.appWidth, this.gate.topPosition.y);
        }

        const movingLoop: Function = (ship: Ship, fromQueue: boolean = false) => {
            let gateInterval: NodeJS.Timeout;
            const toGateTween: Tween<PIXI.ObservablePoint> = this.moveShipToGate(ship, 0, fromQueue ? Ship.tweenShortDuration : Ship.tweenLongDuration)
                .onStart(() => {
                    gateInterval = setInterval(() => {
                        if (this.gate.open && toGateTween.isPaused()) {
                            toGateTween.resume();
                        }
                    }, 50);
                })
                .onUpdate((object: PIXI.ObservablePoint, elapsed: number) => {
                    if (!this.gate.open && elapsed > 0.5 && toGateTween.isPlaying()) {
                        toGateTween.pause();
                    }
                })
                .onComplete(() => {
                    clearInterval(gateInterval);

                    // Choose corresponding queue
                    const queue: Queue = ship.empty ? this.emptyShipsQueue : this.fullShipsQueue;
                    // Find available dock
                    const dockIndex: number = this.findAvailableDock(ship);
                    if (dockIndex < 0) {
                        queue.addShip(ship);
                        this.moveShipToQueue(ship, queue);
                    } else {
                        this.moveShipToDock(ship, dockIndex)
                            .onStart(() => {
                                this.docks[dockIndex].open = false;
                            })
                            .onComplete(async () => {
                                this.moveShipToGate(ship, Port.shipTimeInPort, Ship.tweenMiddleDuration)
                                    .onStart(() => {
                                        this.docks[dockIndex].open = true;
                                        // Choose corresponding queue
                                        const queue: Queue = ship.empty ? this.emptyShipsQueue : this.fullShipsQueue;
                                        if (!queue.empty) {
                                            const firstShip: Ship = queue.firstShip;
                                            const firstShipDockIndex: number = this.findAvailableDock(firstShip);
                                            if(firstShipDockIndex > -1) {
                                                queue.removeFirstShip();
                                                queue.ships.forEach((shipInQueue: Ship) => {
                                                    this.moveShipToQueue(shipInQueue, queue);
                                                });
                                                // use recursion to provide the moving loop
                                                movingLoop(firstShip, true);
                                            }
                                        }
                                    })
                                    .onUpdate((object: PIXI.ObservablePoint, elapsed: number) => {
                                        if (elapsed > 0.5) {
                                            this.gate.open = false;
                                        }
                                    })
                                    .onComplete(() => {
                                        this.moveShipToOutside(ship)
                                            .onComplete(() => {
                                                this.removeShip(ship);
                                            });
                                        this.gate.open = true;
                                    });

                                await delay(Port.shipTimeInPort / 2);

                                // Unload or load the ship and the target dock depending on their state
                                if (ship.empty) {
                                    ship.load();
                                    this.docks[dockIndex].unload();
                                } else {
                                    ship.unload();
                                    this.docks[dockIndex].load();
                                }
                            });
                    }
                });
        };

        movingLoop(newShip);
    }

    /**
     * Finds available dock for specified ship.
     * Returns dock index, or -1 if there are no docks available at the moment.
     *
     * @param ship for which to find an available dock
     * @private
     * @returns number
     */
    private findAvailableDock(ship: Ship): number {
        return this.docks.findIndex(
            (dock: Dock) => dock.open
                && (
                    ship.empty ? !dock.empty : !ship.empty ? dock.empty : -1
                )
        );
    }

    /**
     * Starts a tween to move ship to the center of the port Gate.
     *
     * @param ship is a reference to ship instance
     * @param delay - delay before start in milliseconds
     * @param duration - movement duration in milliseconds
     * @private
     * @returns Tween<PIXI.ObservablePoint>
     */
    private moveShipToGate(
        ship: Ship,
        delay: number = 0,
        duration: number = Ship.tweenLongDuration
    ): Tween<PIXI.ObservablePoint> {
        return ship.moveToTween(
            {
                x: this.gate.topPosition.x,
                y: this.gate.bottomPosition.y - Math.round((this.gate.bottomPosition.y - this.gate.topPosition.y) / 2)
            },
            duration
        ).delay(delay).start();
    }

    /**
     * Starts a tween to move ship to the specified dock.
     *
     * @param ship is a reference to ship instance
     * @param dockIndex is a dock index in docks array
     * @private
     * @returns Tween<PIXI.ObservablePoint>
     */
    private moveShipToDock(ship: Ship, dockIndex: number): Tween<PIXI.ObservablePoint> {
        return ship.moveToTween(this.docks[dockIndex].parkingPosition, Ship.tweenMiddleDuration).start();
    }

    /**
     * Starts a tween to move ship to the queue line.
     *
     * @param ship is a reference to ship instance
     * @param queue is a reference queue instance
     * @private
     * @returns Tween<PIXI.ObservablePoint>
     */
    private moveShipToQueue(ship: Ship, queue: Queue): Tween<PIXI.ObservablePoint> {
        return ship.moveToTween(queue.availablePosition(ship), Ship.tweenShortDuration).start();
    }

    /**
     * Starts a tween to move ship outside of scene.
     *
     * @param ship is a reference to ship instance
     * @private
     * @returns Tween<PIXI.ObservablePoint>
     */
    private moveShipToOutside(ship: Ship): Tween<PIXI.ObservablePoint> {
        return ship.moveToTween({ x: this.appWidth, y: this.gate.bottomPosition.y }).start();
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