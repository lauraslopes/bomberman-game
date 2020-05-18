import Phaser from "phaser";
import {MainScene} from "./scenes/MainScene";

const config = {
    type: Phaser.AUTO,
    scaleMode: Phaser.Scale.ZOOM_2X,
    pixelArt: true,
    width: 336,
    height: 336,
    scene: [MainScene],
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 0},
            debug: true
        }
    }
};

new Phaser.Game(config);