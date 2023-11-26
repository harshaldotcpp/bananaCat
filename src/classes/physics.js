import Ray from "../lib/ray";
import * as PIXI from "pixi.js";




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

    rectvsDynammicRect(rect,targetRect){

        if(rect.velocity.x === 0 && rect.velocity.y === 0)
            return;

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


        if(result.collided){
            const contactNormal = result.contactNormal;

            if(!contactNormal) return false;
            const displacement = (1-result.t) * ray.getLength(); 
            rect.x = rect.x + ((contactNormal.x * displacement)); 
            rect.y = rect.y + ((contactNormal.y * displacement));
            rect.velocity.x += contactNormal.x;
            if(contactNormal.y !== 0)
                rect.velocity.y = 0;
        }


        return false;

    }

    handleCollision(object,quadtree,range){
        
        const nearObjects =  object.getNearByObjects(range,quadtree);
        nearObjects.forEach((otherObject)=>{
            this.rectvsDynammicRect(object,otherObject);
         })


    }


}


export default  Physics;
