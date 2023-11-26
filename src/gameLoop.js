import InputEvents from "./constants/inputEvents";
import GAME_CONFIG from "../gameSetting";
import {Rectangle, Point} from "./lib/quadtree";
import Physics from "./classes/physics";
import Ray from "./lib/ray";
import * as PIXI from "pixi.js";

const physics = new Physics({gravity:0.1});
let i = 0;


let graphicAdded = false;

const rayGraphic = new PIXI.Graphics();
const contactPGraphic = new PIXI.Graphics();



function gameLoop(gameContext){

    rayGraphic.clear();
    contactPGraphic.clear();
    
    const { delta, gameObjects:GAME_OBJECTS, inputHandler, sceneGraph, g, quadtree } = gameContext;  
    const { playerCharacter } = GAME_OBJECTS;

    if(!graphicAdded){
        sceneGraph.gameWorld.addChild(rayGraphic,contactPGraphic);
        graphicAdded = true; 
    }

    const range = new Rectangle(
        new Point(playerCharacter.x,playerCharacter.y),
        64,64,
    );




    const playerBound = playerCharacter.getObjectBound();
    playerCharacter.drawBound(g);


    manageInput(inputHandler,sceneGraph);
    
        
    playerCharacter.update();
    physics.handleCollision(playerCharacter,quadtree,range);
    physics.applyGravity(playerCharacter);
    console.log(playerCharacter.velocity);




    //temporary code
    if(playerBound.bottom > GAME_CONFIG.HEIGHT){
        playerCharacter.setBottom(GAME_CONFIG.HEIGHT);
        playerCharacter.velocity.y = 0;
    }


    


}

function manageInput(inputHandler,sceneGraph){
    if(inputHandler.uiButtonState.left){
        inputHandler.notify({type:InputEvents.LEFT_UP});
        //sceneGraph.camera.moveRight(1);
    }

    if(inputHandler.uiButtonState.right){
        inputHandler.notify({type:InputEvents.RIGHT_UP});
        //sceneGraph.camera.moveLeft(1);
    }

    if(inputHandler.uiButtonState.jump){
        inputHandler.notify({type:InputEvents.JUMP_UP});
    }

}

function testdraw(graphic,ray,touch){
    graphic.lineStyle(1,0x00FF00);
    graphic.moveTo(ray.origin.x,ray.origin.y);
    graphic.lineTo(ray.end.x,ray.end.y);
}



export default gameLoop;
