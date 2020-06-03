// @ts-ignore
import ground from "../assets/ground.png";
// @ts-ignore
import characters from "../assets/characters.png";
// @ts-ignore
import bomb from "../assets/bomb.png";
// @ts-ignore
import powerUps from "../assets/powerups.png";
// @ts-ignore
import skull from "../assets/skull.png";

import {Player} from "../Entities/Player";
import {
    AvailablePowerups,
    MAP_HEIGHT,
    MAP_WIDTH,
    MAX_POWER,
    PowerupType,
    TILE_HEIGHT,
    TILE_WIDTH,
    WallType
} from "../Constants";

import Tile = Phaser.Tilemaps.Tile;
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import Tilemap = Phaser.Tilemaps.Tilemap;
import Socket = SocketIOClient.Socket;

export class MainScene extends Phaser.Scene {
    players: Map<number, Player>;
    wallCount: number;
    powerUpStash!: PowerupType[];
    keys: any;
    wallLayer: any;
    map!: Tilemap;
    groundLayer!: DynamicTilemapLayer;
    powerupLayer!: DynamicTilemapLayer;
    socket: Socket | undefined;

    constructor() {
        super({
            key: "MainScene",
            physics: {
                default: "arcade",
                arcade: {
                    gravity: {y: 0},
                    debug: true
                }
            }
        });

        this.players = new Map();
        this.wallCount = 0;
    }

    preload() {
        this.load.spritesheet('player', characters, {frameWidth: 16, frameHeight: 24});
        this.load.spritesheet('bomb', bomb, {frameWidth: 16, frameHeight: 16});
        this.load.image('powerUps', powerUps);
        this.load.image('ground', ground);
        this.load.image('skull', skull);
    }

    create() {
        this.generateMap();
        this.initKeys();

        this.powerUpStash = Phaser.Utils.Array.Shuffle([...AvailablePowerups]);
    }

    update(time: any, delta: any) {
        Array.from(this.players.values()).forEach(player => player.update());

        // FOR TEST ONLY
        if (this.keys.TAB.isDown) {
            // If space bar is down, destroy the wall on this tile
            let bla = this.wallLayer.findByIndex(WallType.Brick)
            bla && this.destroyWall(bla.x, bla.y);
        }
    }

    generateMap() {
        const map = this.make.tilemap({
            width: MAP_WIDTH,
            height: MAP_HEIGHT,

            tileWidth: TILE_WIDTH,
            tileHeight: TILE_HEIGHT
        });
        this.map = map;

        const groundTiles = map.addTilesetImage('ground');
        const powerupTiles = map.addTilesetImage('powerUps');

        const groundLayer = map.createBlankDynamicLayer('ground', groundTiles);
        this.groundLayer = groundLayer;
        map.setCollisionBetween(0, 1, true, true, groundLayer);

        const wallLayer = map.createBlankDynamicLayer('walls', groundTiles);
        this.wallLayer = wallLayer;
        map.setCollisionBetween(0, 1, true, true, wallLayer);

        this.powerupLayer = map.createBlankDynamicLayer('powerupLayer', powerupTiles);
        this.powerupLayer.setTileIndexCallback([0, 1, 2, 3, 4, 5, 6], this.onPowerUpCollision(), this);
        map.setCollisionBetween(0, 6, false, true, this.powerupLayer);

        groundLayer.fill(WallType.Concrete)

        for (let x = 1; x < map.width - 1; x++) {
            for (let y = 1; y < map.height - 1; y++) {
                let state;

                if (y === 1) {
                    state = 2;
                } else {
                    state = x % 2 + (y % 2) * 2;
                }

                switch (state) {
                    // X is Even, Y is Even
                    case 0:
                        // do nothing, leave concrete wall
                        break;
                    // X is Odd, Y is Even
                    case 1:
                    // X is Odd, Y is Odd
                    case 3:
                        groundLayer.putTileAt(WallType.Grass, x, y);
                        this.spawnWall(x, y);
                        break;
                    // X is Even, Y is Odd
                    case 2:
                        // This scenario means we are right below a concrete pillar
                        groundLayer.putTileAt(WallType.GrassShadow, x, y);
                        this.spawnWall(x, y);
                        break;
                }
            }
        }

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }

    onPowerUpCollision() {
        return (player: Player, powerup: Tile) => {
            /* TODO: Picking up a powerup should make the curse respawn somewhere else in the map */
            player.isCursed = false;

            switch (powerup.index) {
                case PowerupType.Bomb:
                    player.bombs++;
                    break;
                case PowerupType.Speed:
                    player.speed++;
                    break;
                case PowerupType.Kick:
                    player.canKick = true;
                    break;
                case PowerupType.Punch:
                    player.canPunch = true;
                    break;
                case PowerupType.Power:
                    player.power++;
                    break;
                case PowerupType.Curse:
                    player.isCursed = true;
                    break;
                case PowerupType.SuperPower:
                    player.power = MAX_POWER;
                    break;
            }

            console.log({
                bombs: player.bombs,
                power: player.power,
                speed: player.speed,
                canKick: player.canKick,
                canPunch: player.canPunch,
                cursed: player.isCursed,
            });

            this.powerupLayer.removeTileAt(powerup.x, powerup.y);
        };
    }

    /**
     * Spawns a powerup
     * @param {integer} x
     * @param {integer} y
     */
    spawnPowerup(x: number, y: number) {
        if (this.powerUpStash.length > 0) {
            this.powerupLayer.putTileAt(this.powerUpStash.pop() as number, x, y);
        }
    }

    /**
     * bla
     * @param {integer} x
     * @param {integer} y
     */
    spawnWall(x: number, y: number) {
        let boardCenterX = Math.round((MAP_WIDTH - 2) / 2);
        let boardCenterY = Math.round((MAP_HEIGHT - 2) / 2);

        const MAX_WALL_SPAWN_RADIUS = Math.round(Phaser.Math.Distance.Between(1, 1, boardCenterX, boardCenterY)) - 1;
        let roundedDistanceToCenter = Math.round(Phaser.Math.Distance.Between(x, y, boardCenterX, boardCenterY));

        let isRightNextToSpawn = roundedDistanceToCenter === MAX_WALL_SPAWN_RADIUS - 1;
        if (isRightNextToSpawn || roundedDistanceToCenter < MAX_WALL_SPAWN_RADIUS && Math.random() < 0.5) {
            this.wallLayer.putTileAt(WallType.Brick, x, y);
            this.wallCount++;
        }
    }

    /**
     * Destroy brick wall and potentially place power up on its place
     * @param {integer} x
     * @param {integer} y
     */
    destroyWall(x: number, y: number) {
        let tileAt = this.wallLayer.getTileAt(x, y);
        if (tileAt && tileAt.index === 1) {
            this.wallLayer.removeTileAt(x, y);
            this.wallCount--;

            // Use random to define if we'll spawn a powerUp under this wall or not
            if (Math.random() < this.powerUpStash.length / this.wallCount) {
                this.spawnPowerup(x, y);
            }
        }
    }

    getSpawnPosition() {
        // Players spawn positions
        return [
            this.map.getTileAt(1, 1, true),
            this.map.getTileAt(MAP_WIDTH - 2, 1, true),
            this.map.getTileAt(1, MAP_HEIGHT - 2, true),
            this.map.getTileAt(MAP_WIDTH - 2, MAP_HEIGHT - 2, true),
        ];
    }

    initKeys() {
        let KeyCodes = Phaser.Input.Keyboard.KeyCodes;

        const F1 = this.input.keyboard.addKey(KeyCodes.F1);
        const F2 = this.input.keyboard.addKey(KeyCodes.F2);
        const F3 = this.input.keyboard.addKey(KeyCodes.F3);
        const F4 = this.input.keyboard.addKey(KeyCodes.F4);
        const TAB = this.input.keyboard.addKey(KeyCodes.TAB);

        F1.on('down', () => this.createPlayer(0));
        F2.on('down', () => this.createPlayer(1));
        F3.on('down', () => this.createPlayer(2));
        F4.on('down', () => this.createPlayer(3));

        this.keys = {
            F1,
            F2,
            F3,
            F4,
            TAB,
        }
    }

    createPlayer(playerNum: number) {
        if (!this.players.has(playerNum)) {
            let spawnPosition = this.getSpawnPosition();
            let spawn = spawnPosition[playerNum];

            let player = new Player(this, spawn.getCenterX(), spawn.getCenterY(), undefined, false);
            player.setCollisionLayer([this.groundLayer, this.wallLayer, this.powerupLayer]);
            this.players.set(playerNum, player);

            return player;
        }
    }
}