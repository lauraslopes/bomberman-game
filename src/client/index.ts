import Phaser from "phaser";
import {MainScene} from "./scenes/MainScene";
import {StartMenu} from "./scenes/StartMenu";

import Scale = Phaser.Scale;
import Zoom = Phaser.Scale.Zoom;

new Phaser.Game({
    type: Phaser.AUTO,
    scale: {
        autoCenter: Scale.Center.CENTER_BOTH,
        zoom: Zoom.ZOOM_2X
    },
    width: 336,
    height: 336,
    scene: [StartMenu, MainScene],
});