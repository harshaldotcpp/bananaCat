import * as PIXI from "pixi.js";
import initializeGame from "./initializeGame.js";


function initWindow(width, height) {
    const scaleFactor = window.innerWidth / width;

    const app = new PIXI.Application({
        width: width,
        height: height,
        antialias: true,
        transparent: true,
        resolution: scaleFactor,
    });

    document.addEventListener("DOMContentLoaded", () => {
        document.querySelector("#app").appendChild(app.view);
        initializeGame(app,scaleFactor);
    });

    return app;
}



export default initWindow;

