import { Ship, ShipTypeOptions } from './ship.class';
import * as PIXI from 'pixi.js';

export class ShipEmpty extends Ship {
    constructor(app: PIXI.Application, x: number = 0, y: number = 0) {
        super(app, x, y, ShipTypeOptions.empty, 0x50C878);
    }
}