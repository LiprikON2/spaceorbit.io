export default class Spaceship extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true).setScale(0.5).setOrigin(0.5);
    }

    public update() {}

    lookAtPoint(x, y) {
        const angle = Phaser.Math.RAD_TO_DEG * Phaser.Math.Angle.Between(this.x, this.y, x, y) + 90;
        this.setAngle(angle);
    }

    moveUp() {
        this.y -= 1;
    }
    moveLeft() {
        this.x -= 1;
    }
    moveDown() {
        this.y += 1;
    }
    moveRight() {
        this.x += 1;
    }

    shoot() {
        // Generates an "arrow" sprite
        const graphics = this.scene.add.graphics();
        graphics.setVisible(false);
        graphics.fillStyle(0x00ff00, 1);
        graphics.beginPath();
        graphics.moveTo(0, 0);
        graphics.lineTo(60, 10);
        graphics.lineTo(0, 20);
        graphics.lineTo(0, 0);
        graphics.fillPath();
        graphics.generateTexture("sprite", 60, 40);

        const velocity = 1000;
        const velocityX = Math.sin(this.rotation) * velocity;
        const velocityY = Math.cos(this.rotation) * -velocity;

        this.scene.physics.add
            .sprite(this.x, this.y, "sprite")
            .setRotation(this.rotation - Math.PI / 2)
            .setScale(0.5)
            .setOrigin(0.5)
            .setVelocity(velocityX, velocityY);
    }
}
