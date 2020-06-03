export class PlayerInput {
    up: number;
    right: number;
    down: number;
    left: number;
    space: number;

    constructor(up: number, right: number, down: number, left: number, space: number) {
        this.up = up;
        this.right = right;
        this.down = down;
        this.left = left;
        this.space = space;
    }
}

export class PlayerConfig {
    /**
     * The player's input key map
     * @type PlayerInput
     */
    keys: PlayerInput;

    constructor(up: number, right: number, down: number, left: number, space: number) {
        this.keys = new PlayerInput(up, right, down, left, space);
    }
}