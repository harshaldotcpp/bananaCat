import InputEvents from "../../constants/inputEvents.js";

class PlayerCharacterObserver {

    constructor(playerCharacter){
        this.playerCharacter = playerCharacter;
    }

    handleInput(event){
    
        switch(event.type){
            case InputEvents.LEFT_UP:
                this.playerCharacter.moveLeft();
                break;
            case InputEvents.RIGHT_UP:
                this.playerCharacter.moveRight();
                break;
            case InputEvents.JUMP_UP:
                this.playerCharacter.jump();
                break;
            case InputEvents.LEFT_DOWN:
            case InputEvents.RIGHT_DOWN:
                this.playerCharacter.stop();
                break;
        }
    }

}

export default PlayerCharacterObserver;
