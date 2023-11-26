import * as PIXI from "pixi.js";


class Camera extends PIXI.Container{
    constructor(){
        super();

    }

    moveRight(movementSpeed){
        this.x += movementSpeed;
    }

    moveLeft(movementSpeed){
        this.x -= movementSpeed;
    }



}


export default Camera;
