import { Ship, ShipTypeOptions } from './ship.class';
import * as PIXI from 'pixi.js';

export class ShipFull extends Ship {
    constructor(app: PIXI.Application, x: number = 0, y: number = 0) {
        super(app, x, y, ShipTypeOptions.full, 0xFF2400);
    }
}