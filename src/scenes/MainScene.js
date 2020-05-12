import ground from "../assets/ground.png";
import characters from "../assets/characters.png";

export class MainScene extends Phaser.Scene {
    constructor(config) {
        super(config);
    }

    preload() {
        this.load.spritesheet('player', characters, { frameWidth: 16, frameHeight: 24 });
        this.load.image('ground', ground);
    }

    create() {
        const map = this.make.tilemap({width: 21, height: 21, tileWidth: 16, tileHeight: 16});

        const tiles = map.addTilesetImage('ground', null);
        const groundLayer = map.createBlankDynamicLayer('layer1', tiles);
        map.setCollisionBetween(0, 1, true, true, groundLayer);
        const wallLayer = map.createBlankDynamicLayer('layer2', tiles);
        map.setCollisionBetween(0, 1, true, true, wallLayer);

        groundLayer.fill(0)

        for (let x = 1; x < map.width -1; x++) {
            for (let y = 1; y < map.height -1; y++) {
                let state;

                if (y === 1) {
                    state = 2;
                } else {
                    state = x % 2 + (y % 2) * 2;
                }

                switch (state) {
                    case 1:
                    case 3:
                        groundLayer.putTileAt(3, x, y);

                        if(Math.random() < 0.2){
                            wallLayer.putTileAt(1, x, y);
                        }
                        break;
                    case 2:
                        groundLayer.putTileAt(2, x, y);
                        if(Math.random() < 0.2){
                            wallLayer.putTileAt(1, x, y);
                        }
                        break;
                }
            }
        }

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 3, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 6, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', { start: 9, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        let player = this.physics.add.sprite(24, 24, 'player', 2);
        this.physics.add.collider(player, groundLayer);
        this.physics.add.collider(player, wallLayer);
        //player.body.setSize(10,10)
        //player.body.setOffset(2,16)
        player.body.setCircle(6,2, 14)

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(player);

        let cursors = this.input.keyboard.createCursorKeys();

        this.player = player;
        this.cursors = cursors;
    }

    update (time, delta)
    {
        this.player.body.setVelocity(0);

        // Horizontal movement
        if (this.cursors.left.isDown)
        {
            this.player.body.setVelocityX(-100);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.setVelocityX(100);
        }

        // Vertical movement
        if (this.cursors.up.isDown)
        {
            this.player.body.setVelocityY(-100);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.body.setVelocityY(100);
        }

        // Update the animation last and give left/right animations precedence over up/down animations
        if (this.cursors.left.isDown)
        {
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.anims.play('right', true);
        }
        else if (this.cursors.up.isDown)
        {
            this.player.anims.play('up', true);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.anims.play('down', true);
        }
        else
        {
            this.player.anims.stop();
        }
    }
}