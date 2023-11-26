// initializeGame.js
import * as PIXI from "pixi.js";
import { initializeGameObjects } from "./classes/initGameObject";
import Camera from "./classes/camera";
import gameLoop from "./gameLoop";
import InputHandler from './classes/inputHandler';
import PlayerCharacterObserver from "./classes/observers/playerCharacterObserver";
import { Quadtree,Point,Rectangle } from "./lib/quadtree";



async function initializeGame(app,scaleFactor) {
    const sceneGraph = setupSceneGraph(app);
    const gameObjects = await initializeGameObjects(sceneGraph.gameWorld,app);


    //initializing input handler and observers
    const inputHandler = new InputHandler();
    const playerCharacterObserver = new PlayerCharacterObserver(gameObjects.playerCharacter);
    inputHandler.addObserver(playerCharacterObserver);


    //initilizing Quadtree for efficient collision detection
    const quadtree = initQuadtree(gameObjects.gameMap); 
    quadtree.addObjects(gameObjects.gameMap.children);

   
    // debuggng code
    const g = new PIXI.Graphics();
    sceneGraph.gameWorld.addChild(g); 

    sceneGraph.gameWorld.interactive = true;
    sceneGraph.gameWorld.on("touchmove",onTouchStart);
    const touch = {
        x: null,
        y: null,
    }

    function onTouchStart(event){
        touch.x = event.data.getLocalPosition(sceneGraph.gameWorld).x;
        touch.y = event.data.getLocalPosition(sceneGraph.gameWorld).y;
    }





    
    const tickerCallback = (delta) => gameLoop({
        delta,
        gameObjects,
        inputHandler,
        g,
        sceneGraph,
        quadtree,
        touch,
    });
    app.ticker.add(tickerCallback);
}

function setupSceneGraph(app) {
    const sceneGraph = {};
    sceneGraph.camera = new Camera();
    sceneGraph.gameWorld = new PIXI.Container();
    sceneGraph.camera.addChild(sceneGraph.gameWorld);
    app.stage.addChild(sceneGraph.camera);
    return sceneGraph;
}


function initQuadtree(gameMap){
    const mapSize = gameMap.getSize();
    const rectPoint =  new Point(mapSize.width/2,mapSize.height/2);
    const quadtreeBoundry = new Rectangle( rectPoint, mapSize.width/2,mapSize.height/2);

    return new Quadtree(quadtreeBoundry);
 
}

export default initializeGame;



