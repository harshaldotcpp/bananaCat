
class Ray{

    constructor(origin,end){
        this.origin = origin;
        this.end = end;
        this.direction = {
            x: end.x - origin.x,
            y: end.y - origin.y,
        };
    }
    getLength() {
        const length = Math.sqrt(this.direction.x * this.direction.x + this.direction.y * this.direction.y);
        return length;
    }

}


export default Ray;
