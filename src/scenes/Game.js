import Phaser from '../lib/phaser.js'

export default class Game extends Phaser.Scene {
    /** @type {Phaser.Physics.Arcade.Sprite} */
    player

    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    platforms

    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors

    constructor() {
        super('game')
    }

    preload() {
        // Load assets
        this.load.image('background', 'assets/Background/bg_layer1.png')
        this.load.image('platform', 'assets/Environment/ground_grass.png')
        this.load.image('bunny-stand', 'assets/Players/bunny2_stand.png')

        // Load keys
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    create() {
        this.cursors

        // add background - make it static
        this.add.image(240, 320, 'background').setScrollFactor(1, 0)
        
        // add platforms
        this.platforms = this.physics.add.staticGroup()

        // let's add 5!
        for (let i = 0; i < 5; i++) {
            const x = Phaser.Math.Between(80, 400)
            const y = 150 * i

            /** @type {Phaser.Physics.Arcade.Sprite} */
            // add image to platform
            const platform = this.platforms.create(x, y, 'platform')
            platform.scale = 0.5

            /** @type {Phaser.Physics.Arcade.StaticBody} */
            const body = platform.body
            body.updateFromGameObject()
        }

        //add image to player
        this.player = this.physics.add.sprite(240, 320, 'bunny-stand').setScale(0.5)

        // collide for player
        this.physics.add.collider(this.platforms, this.player)
        this.player.body.checkCollision.up = false
        this.player.body.checkCollision.left = false
        this.player.body.checkCollision.right = false

        // follow player
        this.cameras.main.startFollow(this.player)
    }

    update() { // CAUTION: performs every frame
        this.platforms.children.iterate(child => {
            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = child

            const scrollY = this.cameras.main.scrollY
            if (platform.y >= scrollY + 700) {
                platform.y = scrollY - Phaser.Math.Between(50, 100)
                platform.body.updateFromGameObject()
            }
        }) 
        
        const touchingDown = this.player.body.touching.down

        if (touchingDown) {
            this.player.setVelocityY(-300)
        }

        // Left and right input logic
        if (this.cursors.left.isDown && !touchingDown) {
            this.player.setVelocityX(-200)
        }
        else if (this.cursors.right.isDown && !touchingDown) {
            this.player.setVelocityX(200)
        }
        else {
            this.player.setVelocityX(0)
        }
    }
}