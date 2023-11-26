import * as PIXI from "pixi.js";
async function loadSpritesheet(jsonPath,imagePath){ 


     const json = await PIXI.Assets.load(jsonPath);
     const texture = await PIXI.Assets.load(imagePath);

    texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

        const spritesheet = new PIXI.Spritesheet(
            texture,
            json.data,
        ); 
        await spritesheet.parse();
        
       return spritesheet; 
}


export { loadSpritesheet };
