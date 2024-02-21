import * as PIXI from 'pixi.js';
import { Port } from './port.class';

const appWidth: number = 900;
const appHeight: number = 600;
const appBg: number = 0x141163;

// Create a PixiJS application
const app = new PIXI.Application({
    width: appWidth,
    height: appHeight,
    backgroundColor: appBg,
});
document.body.appendChild(app.view as unknown as Node);

// Create port
const portWidth: number = Math.round(appWidth / 3);
const port = new Port(app, portWidth, appHeight);
