import InputEvents from "../constants/inputEvents";


class InputHandler {
    constructor() {
        this.observers = [];
        this.uiButtonState = {
            left: false,
            right: false,
            jump: false,
        };

        const setupTouchListeners = (button, stateProperty) => {

            const events = {
                "left": {pressed: InputEvents.LEFT_UP, release: InputEvents.LEFT_DOWN},
                "right": {pressed: InputEvents.RIGHT_UP,release:InputEvents.RIGHT_DOWN},
                "jump": {pressed:InputEvents.JUMP_UP,release:InputEvents.JUMP_DOWN},
            }

            const pressedEvent = {type: events[stateProperty].preseed};
            const releaseEvent = {type: events[stateProperty].release};

            button.addEventListener('touchstart', () => {
                this.uiButtonState[stateProperty] = true;
                this.notify(pressedEvent);
            });

            button.addEventListener('touchend', () => {
                this.uiButtonState[stateProperty] = false;
                this.notify(releaseEvent)
            });
        };

        // Set up touch event listeners for UI buttons
        setupTouchListeners(document.querySelector("#leftBtn"), "left");
        setupTouchListeners(document.querySelector("#rightBtn"), "right");
        setupTouchListeners(document.querySelector("#jumpBtn"), "jump");
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        this.observers = this.observers.filter((o) => o !== observer);
    }

    notify(event) {
        this.observers.forEach((observer) => {
            observer.handleInput(event);
        });
    }
}


export default InputHandler;
