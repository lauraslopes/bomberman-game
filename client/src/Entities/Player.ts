import {MAX_BOMB, MAX_POWER, MAX_SPEED, PlayerConfigDictionary, PlayerDirection} from "../Constants";
import {GameScene} from "../../@types/GameScene";
import {Bomb} from "../Entities/Bomb";

import ParticleEmitter = Phaser.GameObjects.Particles.ParticleEmitter;
import Sprite = Phaser.GameObjects.Sprite;
import Container = Phaser.GameObjects.Container;
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import Vector3 = Phaser.Math.Vector3;
import Body = Phaser.Physics.Arcade.Body;
import Vector2 = Phaser.Math.Vector2;

export interface PlayerInfo {
    id: string;
    playerNumber: number;
    isCursed: boolean;
    isDead: boolean;
    position: Vector2;
}

export class Player extends Container {
    canPunch: boolean;
    isDead: boolean;
    canKick: boolean;
    isNPC: boolean;
    playerSprite!: Sprite;
    emitter!: ParticleEmitter;
    playerNumber: number;
    playerId: string;
    lastMoveUpdate: number | undefined;
    moveTween: Phaser.Tweens.Tween | undefined;
    cursors: any;
    oldPosition: Vector3 | undefined;
    body!: Body
    scene!: GameScene

    constructor(scene: Phaser.Scene, x: number = 0, y: number = 0, playerInfo: any = {
        id: "",
        playerNumber: -1,
    }, isNPC: boolean = false) {
        super(scene, x, y);

        this.playerId = playerInfo.id;
        this.playerNumber = playerInfo.playerNumber;
        this.isNPC = isNPC;

        this._speed = 1;
        this._power = 1;
        this._bombs = 1;
        this._isCursed = false;

        this.canKick = false;
        this.canPunch = false;
        this.isDead = false;

        this.enablePhysics();

        this.createSprite();
        this.createCursor();
        this.createEmitter();
        this.createAnimations();

        scene.add.existing(this);
    }

    private _isCursed: boolean;

    set isCursed(value: boolean) {
        this._isCursed = value;

        if (value) {
            const RandomRGB = Phaser.Display.Color.RandomRGB;

            this.playerSprite.setTint(
                RandomRGB().color,
                RandomRGB().color,
                RandomRGB().color,
                RandomRGB().color
            );

            if (this.emitter) {
                this.emitter.on = true;
            }
        } else {
            if (this.emitter) {
                this.emitter.on = false;
            }

            this.playerSprite.clearTint();
        }
    }

    private _speed: number;

    //region Setters/Getters
    get speed() {
        if (this._isCursed) {
            return 1;
        }

        return this._speed;
    }

    set speed(value) {
        this._speed = Math.min(value, MAX_SPEED);
    }

    private _power: number;

    get power() {
        if (this._isCursed) {
            return 1;
        }

        return this._power;
    }

    set power(value) {
        this._power = Math.min(value, MAX_POWER);
    }

    private _bombs: number;

    get bombs() {
        if (this._isCursed) {
            return 1;
        }

        return this._bombs;
    }

    set bombs(value) {
        this._bombs = Math.min(value, MAX_BOMB);

        // Update player scoreboard
        let divName = "player" + (this.playerNumber + 1) + "LivesSpan";
        document.getElementById(divName)!.innerHTML = this._bombs.toString();
    }

    //endregion

    get spriteOffset() {
        return this.playerNumber * 20;
    }

    enablePhysics() {
        this.scene.physics.world.enable(this);
        this.body.setCircle(5, -3, -3);
    }

    createSprite() {
        let sprite = this.scene.add.sprite(0, 0, "player", this.spriteOffset);
        sprite.setDisplayOrigin(5, 16);
        this.add(sprite);
        this.playerSprite = sprite;
    }

    plantBomb() {
      if (this.bombs > 0){
        new Bomb(this.scene, this.x, this.y, this.power);
        this.bombs--;
      }
    }

    createCursor() {
        let keys = PlayerConfigDictionary.getConfig(this.playerNumber).keys;

        if (!this.isNPC) {
            this.cursors = {
                up: this.scene.input.keyboard.addKey(keys.up),
                right: this.scene.input.keyboard.addKey(keys.right),
                down: this.scene.input.keyboard.addKey(keys.down),
                left: this.scene.input.keyboard.addKey(keys.left),
                space: this.scene.input.keyboard.addKey(keys.space),
            };

            this.cursors.space.on('down', () => this.plantBomb());
        }
    }

    createEmitter() {
        let particleEmitterManager = this.scene.add.particles("skull");
        // Attach the emitter to the sprite
        this.add(particleEmitterManager);

        this.emitter = particleEmitterManager.createEmitter({
            angle: {min: -80, max: -100},
            blendMode: 'SCREEN',
            frequency: 900,
            lifespan: 1000,
            on: false,
            quantity: 1,
            rotate: {min: 10, max: -10},
            scale: {start: 2, end: 0},
            speed: {min: 5, max: 40},
            x: 6,
            y: -10,
        });
    }

    createAnimations() {
        this.scene.anims.create({
            key: `player${this.playerNumber}_down`,
            frames: this.scene.anims.generateFrameNumbers("player", {
                start: this.spriteOffset,
                end: this.spriteOffset + 2
            }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: `player${this.playerNumber}_left`,
            frames: this.scene.anims.generateFrameNumbers("player", {
                start: this.spriteOffset + 3,
                end: this.spriteOffset + 5
            }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: `player${this.playerNumber}_right`,
            frames: this.scene.anims.generateFrameNumbers("player", {
                start: this.spriteOffset + 6,
                end: this.spriteOffset + 8
            }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: `player${this.playerNumber}_up`,
            frames: this.scene.anims.generateFrameNumbers("player", {
                start: this.spriteOffset + 9,
                end: this.spriteOffset + 11
            }),
            frameRate: 10,
            repeat: -1
        });
    }

    setCollisionLayer(layers: DynamicTilemapLayer[]) {
        layers.forEach(layer => this.scene.physics.add.collider(this, layer));
    }

    update() {
        if (!this.isNPC) {
            this.updateMovement();
        }
    }

    walkTo(x: number, y: number, direction: number) {
        switch (direction) {
            case PlayerDirection.Up:
                this.playerSprite.anims.play(`player${this.playerNumber}_up`, true);
                break;
            case PlayerDirection.Down:
                this.playerSprite.anims.play(`player${this.playerNumber}_down`, true);
                break;
            case PlayerDirection.Left:
                this.playerSprite.anims.play(`player${this.playerNumber}_left`, true);
                break;
            case PlayerDirection.Right:
                this.playerSprite.anims.play(`player${this.playerNumber}_right`, true);
                break;
            default:
                this.playerSprite.anims.stop();
        }

        if (this.moveTween) {
            this.moveTween.remove();
        }

        this.moveTween = this.scene.tweens.add({
            targets: this,
            y: y,
            x: x,
            duration: 500,
            onComplete: () => this.playerSprite.anims.stop(),
        });
    }

    updateMovement() {
        this.body.setVelocity(0);

        const actualSpeed = 50 + this.speed * 10;

        // Horizontal movement
        if (this.cursors.left.isDown) {
            this.body.setVelocityX(-actualSpeed);
        } else if (this.cursors.right.isDown) {
            this.body.setVelocityX(actualSpeed);
        }

        // Vertical movement
        if (this.cursors.up.isDown) {
            this.body.setVelocityY(-actualSpeed);
        } else if (this.cursors.down.isDown) {
            this.body.setVelocityY(actualSpeed);
        }

        let direction;
        // Update the animation last and give left/right animations precedence over up/down animations
        if (this.cursors.left.isDown) {
            this.playerSprite.anims.play(`player${this.playerNumber}_left`, true);
            direction = PlayerDirection.Left;
        } else if (this.cursors.right.isDown) {
            this.playerSprite.anims.play(`player${this.playerNumber}_right`, true);
            direction = PlayerDirection.Right;
        } else if (this.cursors.up.isDown) {
            this.playerSprite.anims.play(`player${this.playerNumber}_up`, true);
            direction = PlayerDirection.Up;
        } else if (this.cursors.down.isDown) {
            this.playerSprite.anims.play(`player${this.playerNumber}_down`, true);
            direction = PlayerDirection.Down;
        } else {
            this.playerSprite.anims.stop();
        }

        if (this.scene.socket && this.lastMoveUpdate && Date.now() - this.lastMoveUpdate < 200) {
            const pos = new Phaser.Math.Vector3(this.x, this.y, direction);
            if (this.oldPosition && !pos.equals(this.oldPosition)) {
                this.scene.socket.emit('PM', [pos.x, pos.y, direction]);
            }
            // save old position data
            this.oldPosition = pos;
        }

        this.lastMoveUpdate = Date.now();
    }

    getInfo() {
        return {
            id: this.playerId,
            number: this.playerNumber,
            isDead: false,
            isCursed: this._isCursed,
            position: {
                x: this.x,
                y: this.y,
            }
        };
    }
}
