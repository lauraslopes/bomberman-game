const KeyCodes = Phaser.Input.Keyboard.KeyCodes;

// Tile width in pixels
export const MAP_WIDTH = 21;
export const MAP_HEIGHT = 21;

export const TILE_WIDTH = 16;
export const TILE_HEIGHT = 16;

export const MAX_BOMB = 10;
export const MAX_SPEED = 10;
export const MAX_POWER = 10;

export const AvailablePowerups = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 3, 3, 4, 4, 4, 4, 4, 5, 5, 6];

export const PlayerDirection = {
    Up: 0,
    Right: 1,
    Down: 2,
    Left: 3,
}

export const WallType = {
    Concrete: 0,
    Brick: 1,
    GrassShadow: 2,
    Grass: 3,
}

export const PowerupType = {
    Bomb: 0,
    Speed: 1,
    Kick: 2,
    Punch: 3,
    Power: 4,
    Curse: 5,
    SuperPower: 6,
}

export const PlayerConfig = {
    0: {
        keys: {
            up: KeyCodes.W,
            right: KeyCodes.D,
            down: KeyCodes.S,
            left: KeyCodes.A,
            space: KeyCodes.SPACE,
        }
    },
    1: {
        keys: {
            up: KeyCodes.UP,
            right: KeyCodes.RIGHT,
            down: KeyCodes.DOWN,
            left: KeyCodes.LEFT,
            space: KeyCodes.NUMPAD_ZERO,
        }
    },
    2: {
        keys: {
            up: KeyCodes.I,
            right: KeyCodes.L,
            down: KeyCodes.K,
            left: KeyCodes.J,
            space: KeyCodes.ENTER,
        }
    },
    3: {
        keys: {
            up: KeyCodes.NUMPAD_EIGHT,
            right: KeyCodes.NUMPAD_SIX,
            down: KeyCodes.NUMPAD_FIVE,
            left: KeyCodes.NUMPAD_FOUR,
            space: KeyCodes.NUMPAD_SEVEN,
        }
    },
}
