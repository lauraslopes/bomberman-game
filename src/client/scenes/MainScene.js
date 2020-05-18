import ground from "../assets/ground.png";
import characters from "../assets/characters.png";
import bomb from "../assets/bomb.png";
import powerUps from "../assets/powerups.png";
import skull from "../assets/skull.png";

//import io from "socket.io-client"

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

export class MainScene extends Phaser.Scene {
    constructor(config) {
        super(config);

        this.players = new Map();
        //this.activePlayers = [];
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
        //this.startConnection();
        this.initKeys();

        this.powerUpStash = Phaser.Utils.Array.Shuffle([...AvailablePowerups]);
    }

    update(time, delta) {
        Array.from(this.players.values()).forEach(player => player.update(time, delta));

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

        const groundTiles = map.addTilesetImage('ground', null);
        const powerupTiles = map.addTilesetImage('powerUps', null);

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
        return (player, powerup) => {
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
    spawnPowerup(x, y) {
        if (this.powerUpStash.length > 0) {
            this.powerupLayer.putTileAt(this.powerUpStash.pop(), x, y);
        }
    }

    /**
     * bla
     * @param {integer} x
     * @param {integer} y
     */
    spawnWall(x, y) {
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
    destroyWall(x, y) {
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

    //startConnection() {
    //    const WebSocketClient = require('websocket').client;
    //
    //    const client = new WebSocketClient();
    //
    //    client.on('connectFailed', error => console.log('Connect Error: ' + error.toString()));
    //
    //    const WebSocketConnection = require("websocket/lib/WebSocketConnection");
    //    /** @param {WebSocketConnection} connection */
    //    let initConnection = function(connection) {
    //        console.log('WebSocket Client Connected');
    //
    //        connection.on('error', error => console.log("Connection Error: " + error.toString()));
    //        connection.on('close', () => console.log('echo-protocol Connection Closed'));
    //        connection.on('message', message => {
    //            if (message.type === 'utf8') {
    //                console.log("Received: '" + message.utf8Data + "'");
    //            }
    //        });
    //
    //        function sendNumber() {
    //            if (connection.connected) {
    //                const number = Math.round(Math.random() * 0xFFFFFF);
    //                connection.sendUTF(number.toString());
    //                setTimeout(sendNumber, 1000);
    //            }
    //        }
    //
    //        sendNumber();
    //    };
    //    client.on('connect', initConnection);
    //
    //    client.connect('ws://localhost:8080/', 'echo-protocol');
    //}

    //startConnection() {
    //    let spawns = this.getSpawnPosition();
    //
    //    this.socket = io({path: "/api/multiplayer"});
    //
    //    this.socket.on('welcome', playerInfo => {
    //        console.log(playerInfo);
    //        let playerNumber = playerInfo.playerNumber;
    //
    //        this.activePlayers.push(playerNumber);
    //        let spawn = spawns[playerNumber];
    //        let player = new Player(this, spawn.getCenterX(), spawn.getCenterY(), playerInfo, false);
    //        player.setCollisionLayer([this.groundLayer, this.wallLayer, this.powerupLayer]);
    //        this.cameras.main.startFollow(player);
    //
    //        this.players.set(playerInfo.playerNumber, player);
    //
    //        this.socket.emit("hello", player.getInfo());
    //    });
    //
    //    this.socket.on('currentPlayers', (state) => {
    //        Object.keys(state).forEach(key => {
    //            let playerInfo = state[key];
    //            if (this.activePlayers.includes(playerInfo.playerNumber)) {
    //                let player = this.players.get(key);
    //                if (player) {
    //                    if (playerInfo.position) {
    //                        [player.x, player.y] = [playerInfo.position.x, playerInfo.position.y];
    //                        console.log("posset" + playerInfo.playerNumber);
    //                    }
    //                    player.isDead = playerInfo.isDead;
    //                    player.isCursed = playerInfo.isCursed;
    //                } else {
    //                    let spawn = spawns[playerInfo.playerNumber];
    //                    player = new Player(this, spawn.getCenterX(), spawn.getCenterY(), playerInfo, true);
    //                    this.players.set(playerInfo.id, player);
    //                }
    //            }
    //
    //        })
    //        console.log(state);
    //    });
    //
    //    this.socket.on('PM', state => {
    //        console.log(`Player move received`);
    //        /** @type {Player} */
    //        let player = this.players.get(state[0]);
    //        if (player) {
    //            player.walkTo(state[1], state[2], state[3]);
    //        }
    //    });
    //
    //    this.socket.on('playerLeft', playerId => {
    //        console.log(`Player left received`);
    //        /** @type {Player} */
    //        let player = this.players.get(playerId);
    //        if (player) {
    //            this.players.delete(playerId)
    //            player.destroy();
    //        }
    //    });
    //}

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

    createPlayer(playerNum) {
        if (!this.players.has(playerNum)) {
            //this.activePlayers.push(playerNum);
            let spawnPosition = this.getSpawnPosition();
            let spawn = spawnPosition[playerNum];

            let player = new Player(this, spawn.getCenterX(), spawn.getCenterY(), {playerNumber: playerNum}, false);
            player.setCollisionLayer([this.groundLayer, this.wallLayer, this.powerupLayer]);
            this.players.set(playerNum, player);

            return player;
        }
    }
}