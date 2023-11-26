import * as PIXI from "pixi.js";
import GameObject from "../classes/gameObjects/gameObject"

class Point{
    constructor(x,y,userData){
       this.x = x;
       this.y = y;
       this.userData = userData;
    }
}


class Rectangle{
    constructor(point,width,height){
        this.point = point;
        this.width = width;
        this.height = height;
    }

    
    contains(point){
        return(
            point.x >= this.point.x - this.width &&
            point.x <= this.point.x + this.width &&
            point.y >= this.point.y - this.height &&
            point.y <= this.point.y + this.height
        );
   
    }

    intersection(range){
        return !(
            range.point.x - range.width >  this.point.x + this.width ||
            range.point.x + range.width <  this.point.x - this.width ||
            range.point.y - range.height > this.point.y + this.height ||
            range.point.y + range.height < this.point.y - this.height
        );
    }
}


class Quadtree{
    constructor(boundry){
        this.boundry = boundry;
        this.points = [];
        this.capacity = 4;
        this.isSubDivide = false;
    }
    
    insert(object){
        const point = new Point(object.x,object.y,object);

        if(!this.boundry.contains(point)){
            return false;
        }
            
        if(this.points.length < this.capacity){
            this.points.push(point);
            return true;
        }
        
        
        if(!this.isSubDivide)
            this.subDivide();
            
           
        return this.topLeft.insert(object) || this.topRight.insert(object) || this.bottomLeft.insert(object) || this.bottomRight.insert(object);
        
    }
    
    subDivide(){
        const x = this.boundry.point.x;
        const y = this.boundry.point.y;
        const width = this.boundry.width;
        const height = this.boundry.height;
        
        const topRightBoundry = new Rectangle(new Point(x+width/2,y-height/2),width/2,height/2);
        this.topRight = new Quadtree(topRightBoundry);
    
        const topLeftBoundry = new Rectangle(new Point(x-width/2,y-height/2),width/2,height/2);
        this.topLeft = new Quadtree(topLeftBoundry);
        
        const bottomRightBoundry = new Rectangle(new Point(x+width/2,y+height/2),width/2,height/2);
        this.bottomRight = new Quadtree(bottomRightBoundry);
        
        const bottomLeftBoundry = new Rectangle(new Point(x-width/2,y+height/2),width/2,height/2);
        this.bottomLeft = new Quadtree(bottomLeftBoundry);

        this.isSubDivide = true;
    }

    quary(range,points){
        if(this.boundry.intersection(range)){
            this.points.forEach((point)=>{
                if(range.contains(point)){
                    points.push(point.userData);
                }
            });
        }


        if(this.isSubDivide){

            this.topLeft.quary(range,points)
            this.topRight.quary(range,points)
            this.bottomLeft.quary(range,points)
            this.bottomRight.quary(range,points)
        }
    }

    show(gameWorld){
        const g = new PIXI.Graphics();
        g.lineStyle(0.5,0xFFFFFF);
        g.drawRect(this.boundry.point.x,this.boundry.point.y,this.boundry.width*2,this.boundry.height*2);
        g.pivot.set(this.boundry.width,this.boundry.height);
        const p = new PIXI.Graphics();
        this.points.forEach((point)=>{
            p.beginFill(0xFFF222);
            p.drawCircle(point.x,point.y,0.5,0.5);
            p.endFill();
        });
        gameWorld.addChild(g,p);

        if(this.isSubDivide){
            this.topLeft.show(gameWorld);
            this.topRight.show(gameWorld);
            this.bottomLeft.show(gameWorld);
            this.bottomRight.show(gameWorld);
        }
    }

    addObjects(objects){

        objects.forEach((object)=>{
            if(object instanceof GameObject)
                this.insert(object); 
        });

        return;
    }
}


export { Quadtree, Point, Rectangle };
