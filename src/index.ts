import * as PIXI from 'pixi.js';

export class GameManager{
    private app:PIXI.Application;

    public constructor(){
        this.app = new PIXI.Application({ width: 400, height: 400, backgroundColor: 0xFFFFFF });
        document.body.appendChild(this.app.view);

        this.app.loader.add('gecko', 'assets/gecko.png');
        // @ts-ignore
        this.app.loader.on("complete", this.onLoadComplete.bind(this) );
        this.app.loader.load();
    }

    // @ts-ignore
    private onLoadComplete( loader:PIXI.loaders.Loader, resources:PIXI.loaders.ResourceDictionary ):void{
        //create a sprite from a 'gecko.png' image
        let gecko:PIXI.Sprite = new PIXI.Sprite(resources.gecko.texture);

        //position the gecko in the center of the screen
        gecko.x = this.app.renderer.width / 2;
        gecko.y = this.app.renderer.height / 2;

        //add an anchor so the rotate pivots the center of the image
        gecko.anchor.x = 0.5;
        gecko.anchor.y = 0.5;

        //add the gecko to the screen
        this.app.stage.addChild(gecko);

        //listen for frame updates
        this.app.ticker.add(() => {
            //each frame spin the gecko around a tiny bit
            gecko.rotation -= 0.01;
        });
    }
}

window.onload = function () {
    new GameManager();
}

window.PIXI = PIXI