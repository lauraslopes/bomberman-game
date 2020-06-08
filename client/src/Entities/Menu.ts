import {PlayerConfigDictionary} from "../Constants";
import Image = Phaser.GameObjects.Image;
import Math = Phaser.Math;

export class MenuOption {
    text: string;
    callback: Function;

    /**
     * A Menu Item Object.
     *
     * This class is just a simple information container for menu options.
     *
     * @param {string} text
     * @param {function} callback
     */
    constructor(text: string, callback: Function) {
        this.text = text;
        this.callback = callback;
    }
}

export class Menu extends Phaser.GameObjects.Container {
    private _selectedOption: any;
    menuOptions: MenuOption[];
    cursor: Image | undefined;
    inputs: any;

    //region Getters/Setters
    /**
     * Returns the selected option's index
     * @returns {number}
     */
    get selectedOption() {
        return this._selectedOption;
    }

    /**
     * Sets the selected option's index. This operation is clamped to the <b>menuOptions</b> array size
     * @param {integer} value
     */
    set selectedOption(value) {
        this._selectedOption = Math.Clamp(value, 0, this.menuOptions.length - 1);

        if (this.cursor) {
            this.cursor.y = this._selectedOption * 20;
        }
    }

    //endregion

    /**
     * A Menu Game Object.
     *
     * This class implements a UI menu, accepting an array of options as parameters.
     * It extends the Container class, making it easy to add new UI elements to it (such as a background)
     *
     * @param {Phaser.Scene} scene
     * @param {integer} x
     * @param {integer} y
     * @param {MenuOption[]} menuOptions An array of options to be displayed in the menu
     */
    constructor(scene: Phaser.Scene, x: number = 0, y: number = 0, menuOptions: MenuOption[] = []) {
        super(scene, x, y);

        this.menuOptions = menuOptions
        this._selectedOption = 0;

        this.createContent();
        this.initKeys();
    }

    /**
     * Creates the basic GameObject components for the menu
     */
    createContent() {
        this.cursor = this.scene.add.image(-5, this.selectedOption * 20, 'cursor').setOrigin(0);

        /* Animates the menu cursor */
        this.scene.tweens.add({
            targets: this.cursor,
            x: 2,
            ease: 'Quad.easeIn',
            duration: 500,
            repeat: -1,
            repeatDelay: 200,
            yoyo: true,
        });

        /* Animates the menu cursor */
        this.add([
            this.cursor,
            /* Adds the menu options as text instances */
            ...this.menuOptions.map((option:MenuOption, index:number) => this.scene.add.text(20, index * 20, option.text))
        ]);
    }

    /**
     * Sets the required inputs and implements key press functionality
     */
    initKeys() {
        // Loads keys from user settings
        let keys = PlayerConfigDictionary.getConfig(0).keys;

        this.inputs = {
            up: this.scene.input.keyboard.addKey(keys.up),
            down: this.scene.input.keyboard.addKey(keys.down),
            space: this.scene.input.keyboard.addKey(keys.space),
        };

        this.inputs.up.on('down', () => this.selectedOption--);
        this.inputs.down.on('down', () => this.selectedOption++);
        this.inputs.space.on('down', () => this.menuOptions[this.selectedOption].callback());
    }
}