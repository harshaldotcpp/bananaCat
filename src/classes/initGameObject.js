import * as PIXI from "pixi.js";
import Character from "./gameObjects/Character.js";
import GameMap from "./gameObjects/gameMap.js"; // Adjust the filename to match the actual filename
import { loadSpritesheet } from "../lib/utilities.js";

async function initializeGameObjects(gameWorld,app) {
    // Create and generate the game map
    const gameMap = new GameMap([
        [1,1,1,1,1,1,1,1,1,1,1,1,1],
        [0,0,1,1,1,1,1,1,1,0,0,0,0],
        [0,0,0,1,0,0,1,1,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,1,1,1,0,0,0,0,0],
        [1,1,1,1,1,1,1,1,1,0,0,0,0],
    ]);
    gameMap.generate(app.renderer);

    // Load and create player character
    const spritesheetJsonPath = "/assests/sprites/bananacat.json";
    const spritesheetImagePath = "/assests/sprites/bananacat.png";
    const spritesheet = await loadSpritesheet(spritesheetJsonPath, spritesheetImagePath);
    
    const playerCharacter = createPlayerCharacter(spritesheet);

    // Add objects to the game world
    gameWorld.addChild(gameMap, playerCharacter);

    return { playerCharacter,gameMap };
}

function createPlayerCharacter(spritesheet) {
    const playerCharacter = new Character(80, 80,0.5,0.5);
    playerCharacter.addSpriteSheetAnimations(spritesheet);
    playerCharacter.playAnimation("idle");
    return playerCharacter;
}

export { initializeGameObjects };

