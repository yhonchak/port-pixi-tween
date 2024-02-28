import * as PIXI from 'pixi.js';
import { Position } from './types';

export class Gate {
    private app: PIXI.Application;
    private readonly top: Position;
    private readonly bottom: Position;
    private _open: boolean = true;

    /**
     * The class constructor.
     *
     * @param app - reference to the Pixi Application
     * @param top - the gate (entrance) top position
     * @param bottom - the gate (entrance) bottom position
     */
    constructor(app: PIXI.Application, top: Position, bottom: Position) {
        this.app = app;
        this.top = top;
        this.bottom = bottom;

        // Create barriers graphics
        const barrierWidth: number = 5;
        const barrierColor: number = 0xEED202;

        const barrierTop: PIXI.Graphics = new PIXI.Graphics();
        barrierTop.beginFill(barrierColor);
        barrierTop.drawRect(top.x - barrierWidth, 0, barrierWidth, top.y);
        barrierTop.endFill();
        this.app.stage.addChild(barrierTop);

        const barrierBottom: PIXI.Graphics = new PIXI.Graphics();
        barrierBottom.beginFill(barrierColor);
        barrierBottom.drawRect(top.x - barrierWidth, bottom.y, barrierWidth, barrierTop.height);
        barrierBottom.endFill();
        this.app.stage.addChild(barrierBottom);
    }

    /**
     * Returns the gate top position.
     * @returns Position.
     */
    get topPosition(): Position {
        return this.top;
    }

    /**
     * Returns the gate bottom position.
     * @returns Position.
     */
    get bottomPosition(): Position {
        return this.bottom;
    }

    /**
     * Returns flag whether the gate is open.
     */
    get open(): boolean {
        return this._open;
    }

    /**
     * Sets a flag whether the gate is open.
     */
    set open(value: boolean) {
        this._open = value;
    }
}