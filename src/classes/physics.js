import Ray from "../lib/ray";
import * as PIXI from "pixi.js";
import PriorityQueue from "../lib/priorityQueue";




class Physics{
    constructor(config){
        this.gravity = config.gravity;
    }

        applyGravity(object){
        object.velocity.y += this.gravity;
    }


    rectanglesIntersects(objectA,objectB){
        const aBounds = objectA.getObjectBound(); 
        const bBounds = object.getObjectBound();

        return (
            aBounds.right > bBounds.left &&
            aBounds.left < bBounds.right &&
            aBounds.bottom > bBounds.top &&
            aBounds.top < bBounds.bottom
        );

    }

    rayRectIntersect(ray,object){

        const intersectReuslt = {
            collided: false,
            contactPoint: null,
            contactNormal: null,
            t: null,
        }
        
        let tNearX = (object.x - ray.origin.x)/ray.direction.x;
        let tNearY = (object.y - ray.origin.y)/ray.direction.y;
        let tFarX = (object.x + object.width - ray.origin.x)/ray.direction.x;
        let tFarY = (object.y + object.height - ray.origin.y)/ray.direction.y;


        if(tNearX >  tFarX) [tNearX , tFarX]  = [tFarX,tNearX];
        if(tNearY > tFarY) [tNearY, tFarY] = [tFarY,tNearY];

        if(tNearX > tFarY || tNearY > tFarX){
            return intersectReuslt;
        } 

        const tNear = Math.max(tNearX,tNearY);
        const tFar = Math.min(tFarX,tFarY);

        if(tFar < 0 || tNear > 1){
            return intersectReuslt;
        }
 
        
        
        if(tNearX > tNearY){
            if(ray.direction.x < 0){
                intersectReuslt.contactNormal = { x:1, y:0, };
            }
            else{
                intersectReuslt.contactNormal = { x:-1, y:0, };
            }
        }
        else if(tNearX < tNearY){
            if(ray.direction.y < 0){
                intersectReuslt.contactNormal = { x:0, y:1, };
            } 
            else{
                intersectReuslt.contactNormal = { x:0, y:-1, };
            }
        }
        intersectReuslt.contactPoint = {
             x:ray.origin.x + ray.direction.x * tNear,
             y:ray.origin.y + ray.direction.y * tNear
         }


        intersectReuslt.t = tNear;
        intersectReuslt.collided = true;
        return intersectReuslt;
    }

    rectvsDynammicRect(rect,targetRect,g){


        if(rect.velocity.x === 0 && rect.velocity.y === 0){
            return 0;
        }
        const rectBound = rect.getObjectBound();

        
        const ray = new Ray(
            {
                x: (rectBound.x + rectBound.width * 0.5),
                y: (rectBound.y + rectBound.height * 0.5),
            },
            {
                x: (rectBound.x + rectBound.width * 0.5) + rect.velocity.x, 
                y: (rectBound.y + rectBound.height * 0.5) + rect.velocity.y,
            }
        );

        const  targetBoundry = targetRect.getObjectBound();
        const expendedBoundry = new PIXI.Rectangle(targetBoundry.x - rectBound.width/2,targetBoundry.y - rectBound.height/2, targetBoundry.width + rectBound.width, targetBoundry.height + rectBound.height);
        const result = this.rayRectIntersect(ray,expendedBoundry);

        /*
        g.lineStyle(1,0xFFFFFF);
        g.moveTo(ray.origin.x,ray.origin.y)
        g.lineTo(ray.end.x,ray.end.y)

        g.lineStyle(1,0x32F565);
        g.drawRect(expendedBoundry.x,expendedBoundry.y,expendedBoundry.width,expendedBoundry.y);

        */



        if(result.collided){
            const contactNormal = result.contactNormal;
            if(!contactNormal){
                result.collided = false;
                return 0;
            }

            /*
            g.beginFill("0xFFFFFF");
            g.drawCircle(result.contactPoint.x,result.contactPoint.y,1);
            g.endFill();
            */
            
            rect.velocity.x += contactNormal.x * Math.abs(rect.velocity.x) * (1-result.t);
            rect.velocity.y += contactNormal.y * Math.abs(rect.velocity.y) * (1-result.t);

            rect.x += contactNormal.x * 0.1;
            rect.y += contactNormal.y * 0.1;


            return contactNormal.y;
            
        }


        return 0;

    }

    handleCollision(object,quadtree,range,g){
        
        const nearObjects =  object.getNearByObjects(range,quadtree);
        const priorityQueue = new PriorityQueue();
        

        nearObjects.forEach((otherObject)=>{
            const result = this.rectvsDynammicRect(object,otherObject,g);
         });


    }



}


export default  Physics;
