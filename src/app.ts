import * as PIXI from 'pixi.js';
import { Port } from './port.class';
import { ICanvas } from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';

const appWidth: number = 900;
const appHeight: number = 600;
const appBg: number = 0x141163;

// Create a PixiJS application (sea)
const app: PIXI.Application<ICanvas> = new PIXI.Application({
    width: appWidth,
    height: appHeight,
    backgroundColor: appBg,
});
document.body.appendChild(app.view as unknown as Node);

// Create port
const portWidth: number = Math.round(appWidth / 3);
const portHeight: number = appHeight;
const port: Port = new Port(app, portWidth, portHeight, appWidth, appHeight);

setInterval(() => {
    TWEEN.update();
}, 16); // call approximately 60 times per second, which corresponds to a frame rate of 60 frames per second (FPS)
