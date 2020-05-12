import Phaser from "phaser";
import {MainScene} from "./scenes/MainScene";


const config = {
    type: Phaser.AUTO,
    scaleMode: Phaser.Scale.FIT,
    pixelArt: true,
    width: 336,
    height: 336,
    parent: "phaser-example",
    scene: [MainScene],
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 }
        }
    }
};

new Phaser.Game(config);