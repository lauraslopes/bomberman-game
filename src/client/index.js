import Phaser from "phaser";
import {MainScene} from "./scenes/MainScene";
import {StartMenu} from "./scenes/StartMenu";

const config = {
    type: Phaser.AUTO,
    scaleMode: Phaser.Scale.ZOOM_2X,
    pixelArt: true,
    width: 336,
    height: 336,
    scene: [StartMenu, MainScene],
};

new Phaser.Game(config);