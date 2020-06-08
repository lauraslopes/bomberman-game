import KeyCodes = Phaser.Input.Keyboard.KeyCodes;
import {PlayerConfig} from "./Entities/PlayerConfig";

export enum PlayerDirection {
    Up,
    Right,
    Down,
    Left,
}

export enum WallType {
    Concrete,
    Brick,
    GrassShadow,
    Grass,
}

export enum PowerupType {
    Bomb,
    Speed,
    Kick,
    Punch,
    Power,
    Curse,
    SuperPower,
}


export const PlayerConfigDictionary: { playerConfigs: PlayerConfig[]; getConfig(playerNumber: number): PlayerConfig } = {
    playerConfigs: [
        new PlayerConfig(
            KeyCodes.W,
            KeyCodes.D,
            KeyCodes.S,
            KeyCodes.A,
            KeyCodes.SPACE
        ),
        new PlayerConfig(
            KeyCodes.UP,
            KeyCodes.RIGHT,
            KeyCodes.DOWN,
            KeyCodes.LEFT,
            KeyCodes.NUMPAD_ZERO
        ),
        new PlayerConfig(
            KeyCodes.I,
            KeyCodes.L,
            KeyCodes.K,
            KeyCodes.J,
            KeyCodes.ENTER
        ),
        new PlayerConfig(
            KeyCodes.NUMPAD_EIGHT,
            KeyCodes.NUMPAD_SIX,
            KeyCodes.NUMPAD_FIVE,
            KeyCodes.NUMPAD_FOUR,
            KeyCodes.NUMPAD_SEVEN
        ),
    ],

    /**
     * Returns a configuration
     * @param {number} playerNumber
     */
    getConfig(playerNumber: number) {
        return this.playerConfigs[playerNumber];
    },
}

/** Tilemap Width in Tiles */
export const MAP_WIDTH = 21;
/** Tilemap Height in Tiles */
export const MAP_HEIGHT = 21;

/** Tile Width in Pixels */
export const TILE_WIDTH = 16;
/** Tile Height in Pixels */
export const TILE_HEIGHT = 16;

/** Player Bomb Cap */
export const MAX_BOMB = 10;
/** Player Speed Cap */
export const MAX_SPEED = 10;
/** Player Power Cap */
export const MAX_POWER = 10;

/** Available powerups for level */
export const AvailablePowerups = [
    PowerupType.Bomb,
    PowerupType.Bomb,
    PowerupType.Bomb,
    PowerupType.Bomb,
    PowerupType.Bomb,
    PowerupType.Speed,
    PowerupType.Speed,
    PowerupType.Speed,
    PowerupType.Speed,
    PowerupType.Speed,
    PowerupType.Kick,
    PowerupType.Kick,
    PowerupType.Punch,
    PowerupType.Punch,
    PowerupType.Power,
    PowerupType.Power,
    PowerupType.Power,
    PowerupType.Power,
    PowerupType.Power,
    PowerupType.Curse,
    PowerupType.Curse,
    PowerupType.SuperPower,
];