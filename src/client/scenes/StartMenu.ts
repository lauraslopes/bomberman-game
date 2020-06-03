import logo from "../assets/UI/logo.gif";
import cursor from "../assets/UI/cursor.png";
import {Menu, MenuOption} from "../Entities/Menu";

export class StartMenu extends Phaser.Scene {
    constructor() {
        super({
            key: "StartMenu"
        });
    }

    preload() {
        this.load.image('logo', logo);
        this.load.image('cursor', cursor);
    }

    create() {
        let camera = this.cameras.main;

        this.add.image(camera.centerX, camera.centerY - 50, 'logo').setScale(0.5);
        this.add.existing(new Menu(this, camera.centerX - 80, camera.centerY + 30, [
            new MenuOption("Single Player", () => this.singlePlayer()),
            new MenuOption("Multiplayer", () => this.multiplayer()),
            new MenuOption("Options", () => this.options()),
        ]));

    }

    singlePlayer() {
        this.scene.transition({
            target: "MainScene",
        })
    }

    multiplayer() {
        alert("Coming Soon!");
    }

    options() {
        alert("Coming Soon!");
    }
}