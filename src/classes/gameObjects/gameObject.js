import * as PIXI from "pixi.js";


class GameObject extends PIXI.Container{

    constructor(x,y,aX,aY){
        x = x || 0;
        y = y || 0;
        aX = aX || 0;
        aY = aY || 0;

       super();
        this.position.set(x,y);
        this.velocity = {x:0,y:0};
        this.anchorPoint = {
            x: aX,
            y: aY,
        };


    }

    addChild(...sprites){

        sprites.forEach((sprite)=>{
            if(sprite instanceof PIXI.Sprite)
                sprite.anchor.set(this.anchorPoint.x,this.anchorPoint.y);
        });
         

        super.addChild(...sprites);
        return;
    }

    getObjectBound(){

        const width = Math.abs(this.width);
        const height = Math.abs(this.height);
        let x = this.x - (this.width * this.anchorPoint.x);
        let y = this.y - (this.height * this.anchorPoint.y);

        if(this.scale.x < 0) x = this.x - (width * (1 - this.anchorPoint.x));
        if(this.scale.y < 0) y = this.y - (height * (1 - this.anchorPoint.y));

        

        return new PIXI.Rectangle(x,y,width,height);
    }



    setTop(y){
        const height = this.height; 
        const anchorY = this.anchorPoint.y;
        
        this.y = y;

        this.y = this.y + (anchorY * height);
    }

    setBottom(y){
        const height = this.height; 
        const anchorY = this.anchorPoint.y;
        
        this.y = y;

        this.y = this.y - ((1-anchorY) * height);
    }

    setLeft(x){
        const width = this.width;
        const anchorX = this.anchorPoint.x;
        this.x = x;

        this.x = this.x - ((1-anchorX) * width );
    }

    setRight(x){
        const width = this.width;
        const anchorX = this.anchorPoint.x;
        this.x = x;

        this.x = this.x + (anchorX * width );
  
    }

    drawBound(graphic){
        graphic.clear();
        const bounds = this.getObjectBound();
        graphic.lineStyle(1,0x00FF00);
        graphic.drawRect(bounds.x,bounds.y,bounds.width,bounds.height);
    }

    getNearByObjects(boundry,quadtree){
        let objects = [];
        quadtree.quary(boundry,objects);
        objects.forEach((object)=>{
            object.tint = 0x837371;
        });

        return objects;
    }

    intersects(object){
        const aBounds = this.getObjectBound(); 
        const bBounds = object.getObjectBound();

        return (
            aBounds.right > bBounds.left &&
            aBounds.left < bBounds.right &&
            aBounds.bottom > bBounds.top &&
            aBounds.top < bBounds.bottom
        );

    }

}

export default GameObject;
