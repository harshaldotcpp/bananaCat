import * as PIXI from "pixi.js";
import GAME_CONFIG from "@game";
import GameObject from "../gameObjects/gameObject";

class GameMap extends PIXI.Container {
    constructor(mapArray) {
        super();
        this.initializeTilesArray(mapArray);
        this.tileSize = GAME_CONFIG.TILE_SIZE;
        this.createBackground();
    }

    initializeTilesArray(mapArray) {
        this.tiles = new Array(GAME_CONFIG.TILES_COUNT).fill([]); // Use fill to initialize the array

        for (let i = mapArray.length - 1; i >= 0; i--) {
            this.tiles[this.tiles.length - 1 - (mapArray.length - 1 - i)] = [...mapArray[i]];
        }

    }

    createBackground() {
        const backgroundTexture = PIXI.Texture.from('/assests/sprites/parallax-forest-front-trees.png');
        const repeatingBackground = new PIXI.TilingSprite(backgroundTexture, 160 * 2, 160);

        repeatingBackground.scale.set(1);
        this.addChild(repeatingBackground);
    }

    generate(renderer) {
        for (let i = 0; i < this.tiles.length; i++) {
            const y = i * this.tileSize;

            for (let j = 0; j < this.tiles[i].length; j++) {
                const x = j * this.tileSize;
                const tileType = this.tiles[i][j];

                if (tileType === 1) {
                    const tile = this.createTileGraphic(x, y,renderer);
                    this.addChild(tile);
                }
            }
        }
    }

    createTileGraphic(x, y,renderer) {
        const graphic = new PIXI.Graphics();
        graphic.beginFill(0x7A9CC6);
        graphic.lineStyle(1, 0x000000);
        graphic.drawRect(x, y, this.tileSize, this.tileSize);
        graphic.endFill();

        const texture = renderer.generateTexture(graphic);
        const sprite = new PIXI.Sprite(texture);
        const gameObject = new GameObject();
        gameObject.addChild(sprite);
        gameObject.position.set(x,y);
        return gameObject;
    }

    getSize(){
        const size = {};
        const height = this.tiles.length;
        let width = GAME_CONFIG.TILES_COUNT;
        this.tiles.forEach((horizontalTiles)=>{
            width = Math.max(width,horizontalTiles.length);
        });

        size.height = height * this.tileSize;
        size.width = width * this.tileSize;

        return size;
    }
}

export default GameMap;

