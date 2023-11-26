import * as PIXI from "pixi.js";
import GameObject from "./gameObject";






class Character extends  GameObject {

    constructor(x,y,aX,aY){
        super(x,y,aX,aY);
        this.animations = {};

        this.movementSpeed = 1;
        this.canMoveLeft = true;
        
    }

    addAnimation(name,frames,animationSpeed){
        const animatedSprite = new PIXI.AnimatedSprite(frames);
        animatedSprite.animationSpeed = animationSpeed;
        animatedSprite.visible = false;
        this.animations[name] = animatedSprite;
        this.addChild(animatedSprite);
    };


    playAnimation(targetName){

        if(!this.animations[targetName])
            return;

        for(const [name,animatedSprite] of Object.entries(this.animations) ){
            animatedSprite.visible = false;
            animatedSprite.stop();
        }

        if(this.animations[targetName]){
            this.animations[targetName].visible = true;
            this.animations[targetName].play();
        }


    }

    addSpriteSheetAnimations(spritesheet){

        for(const [name,frames] of Object.entries(spritesheet.animations)){
            
            this.addAnimation(name,frames,0.2);
        } 

    }

    update(){
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    
    moveLeft(){
        if(this.canMoveLeft){
            this.velocity.x  = -this.movementSpeed; 
            this.playAnimation("running");
            this.scale.x = -Math.abs(this.scale.x);
        }
    }
    moveRight(){
        this.velocity.x = this.movementSpeed;
        this.playAnimation("running");
        this.scale.x = Math.abs(this.scale.x);
    }

    stop(){
        this.velocity.x = 0;
        this.playAnimation("idle");
    }

        jump(){
        this.velocity.y = -2;
    }

    

};


export default Character;
