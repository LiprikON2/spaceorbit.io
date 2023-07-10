import debounce from "lodash/debounce";

import type { Spaceship } from "./spaceship";

export default class Shields extends Phaser.Physics.Arcade.Sprite {
    id: string;
    scene: Phaser.Scene;
    ship: Spaceship;
    lastHit = -Infinity;
    tweenFade;
    soundManager;

    constructor(ship) {
        super(ship.scene, ship.x, ship.y, "shield");
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.ship = ship;
        this.id = ship.id + "-shield";
        const scale = 0.7;
        this.setOrigin(0.5)
            .setDepth(ship.depth + 1)
            .setScale(scale)
            .setAlpha(0, 0.1, 0, 0);

        const shieldHitboxRadius = (ship.baseStats.hitboxRadius / 0.7) * 1.5;
        this.body.setCircle(
            shieldHitboxRadius,
            this.width / 2 - shieldHitboxRadius,
            this.height / 2 - shieldHitboxRadius
        );
        this.tweenFade = this.scene.tweens.add({
            targets: this,
            alphaTopLeft: { value: 1, duration: 500, ease: "Power1" },
            alphaBottomRight: { value: 1, duration: 1000, ease: "Power1" },
            alphaBottomLeft: { value: 1, duration: 500, ease: "Power1", delay: 500 },
            yoyo: true,
        });
        if (this.ship.soundManager) {
            this.ship.soundManager.addSounds("shield", ["shield_sound_1"]);
            this.ship.soundManager.addSounds("shield_down", ["shield_down_sound_1"]);
        }
    }

    getHit = debounce(
        () => {
            if (!this.tweenFade.isPlaying()) {
                this.tweenFade.play();
                if (this.ship.soundManager) {
                    this.ship.soundManager.play("shield", {
                        sourceX: this.x,
                        sourceY: this.y,
                        volume: 1,
                    });
                }
            }
        },
        200,
        { leading: true }
    );

    crack(silent = false) {
        this.disableBody(true, true);
        if (!silent && this.ship.soundManager) {
            this.ship.soundManager.play("shield_down", {
                sourceX: this.x,
                sourceY: this.y,
                volume: 0.3,
            });
        }
    }
}
