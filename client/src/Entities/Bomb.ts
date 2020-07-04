import {MAX_BOMB, MAX_POWER, BOMB_TIMER, PlayerConfigDictionary, PlayerDirection} from "../Constants";
import {GameScene} from "../../@types/GameScene";

import ParticleEmitter = Phaser.GameObjects.Particles.ParticleEmitter;
import Sprite = Phaser.GameObjects.Sprite;
import Container = Phaser.GameObjects.Container;
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import Vector3 = Phaser.Math.Vector3;
import Body = Phaser.Physics.Arcade.Body;
import Vector2 = Phaser.Math.Vector2;

export class Bomb extends Container {
    bombSprite!: Sprite;
    // timestamp: number;
    private _power: number;

    constructor(scene: Phaser.Scene, x: number, y: number, power: number) {
        super(scene, x, y);

        console.log({
            x: x,
            y: y,
            _power: power,
        });

        this._power = power;
        //this.enablePhysics();
        this.createSprite();
        // this.timestamp = new Date.now()

        scene.add.existing(this);
    }

    enablePhysics() {
        this.scene.physics.world.enable(this);
        // this.body.setCircle(5, -3, -3);
    }

    createSprite() {
        let sprite = this.scene.add.sprite(0, 0, "bomb");
        this.add(sprite);
        this.bombSprite = sprite;

        this.createAnimations();
        this.bombSprite.anims.play(`bomb_pulse`, true);

    }

    createAnimations() {
        this.scene.anims.create({
            key: `bomb_pulse`,
            frames: this.scene.anims.generateFrameNumbers("bomb", {
                start: 0,
                end: 2
            }),
            frameRate: 10,
            repeat: -1
        });
        // this.scene.anims.create({
        //     key: `player${this.playerNumber}_left`,
        //     frames: this.scene.anims.generateFrameNumbers("player", {
        //         start: this.spriteOffset + 3,
        //         end: this.spriteOffset + 5
        //     }),
        //     frameRate: 10,
        //     repeat: -1
        // });
    }

    // setCollisionLayer(layers: DynamicTilemapLayer[]) {
    //     layers.forEach(layer => this.scene.physics.add.collider(this, layer));
    // }

    update() {
        console.log("update");
    }

    // getInfo() {
    //     return {
    //         power: this._power,
    //         timer: this.timer,
    //         position: {
    //             x: this.x,
    //             y: this.y,
    //         }
    //     };
    // }
}
