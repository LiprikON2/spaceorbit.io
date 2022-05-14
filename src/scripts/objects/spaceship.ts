export default class Spaceship extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCircularHitbox(50);

        this.setCollideWorldBounds(true).setScale(0.75).setOrigin(0.5);
    }

    setCircularHitbox(hitboxRadius) {
        this.body.setCircle(
            hitboxRadius,
            this.body.width / 2 - hitboxRadius,
            this.body.height / 2 - hitboxRadius
        );
        // this.body.setSize(50, 50);
        // this.body.setOffset(12, 5);
    }

    public update() {}

    lookAtPoint(x, y) {
        const angle = Phaser.Math.RAD_TO_DEG * Phaser.Math.Angle.Between(this.x, this.y, x, y) + 90;
        this.setAngle(angle);
    }

    shoot() {
        // Generates an "arrow" sprite
        const graphics = this.scene.add.graphics();
        graphics.setVisible(false);
        graphics.fillStyle(0x00ff00, 1);
        graphics.beginPath();
        graphics.moveTo(0, 0);
        graphics.lineTo(60, 0);
        graphics.lineTo(60, 20);
        graphics.lineTo(0, 20);
        graphics.lineTo(0, 0);
        graphics.fillPath();
        graphics.generateTexture("sprite", 60, 40);

        const bulletVelocity = 2000;
        const shipVelocityX = this.body.velocity.x;
        const shipVelocityY = this.body.velocity.y;
        const velocityX = Math.sin(this.rotation) * bulletVelocity + shipVelocityX;
        const velocityY = Math.cos(this.rotation) * -bulletVelocity + shipVelocityY;

        this.scene.physics.add
            .sprite(this.x, this.y, "sprite")
            .setRotation(this.rotation - Math.PI / 2)
            .setScale(0.5)
            .setOrigin(0.5)
            .setVelocity(velocityX, velocityY);
    }
}
