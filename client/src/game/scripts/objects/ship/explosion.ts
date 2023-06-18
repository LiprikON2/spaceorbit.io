type ExplosionConfig = {
    keys?: string[];
    scale?: number;
    silent?: boolean;
    double?: boolean;
    doubleDiff?: number;
};

export default class Explosion extends Phaser.GameObjects.Sprite {
    explosionSound: Phaser.Sound.BaseSound;
    options: ExplosionConfig;
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        targetDepth: number,
        options?: ExplosionConfig
    ) {
        const defaults = {
            keys: ["explosion_1", "explosion_2", "explosion_3", "explosion_4"],
            scale: 2,
            silent: false,
            double: false,
            doubleDiff: 2,
        };
        const mergedOptions = Object.assign({}, defaults, options);

        super(scene, x, y, mergedOptions.keys[0]);
        this.options = mergedOptions;
        scene.add.existing(this);

        this.setDepth(targetDepth + 1);
        this.setScale(mergedOptions.scale);
        this.setAngle(Phaser.Math.Angle.Random());

        // @ts-ignore
        scene.soundManager.addSounds("explosion", ["explosion_sound_1"]);

        if (!mergedOptions.silent) {
            // @ts-ignore
            scene.soundManager.play("explosion", { sourceX: x, sourceY: y });
        }
        if (mergedOptions.double) {
            this.doublyExplode(scene, x, y, targetDepth);
        }
        this.explode(mergedOptions.keys.at(-1));
    }

    explode(key?: string) {
        this.play(`${key}-anim`);

        this.on("animationcomplete", () => {
            this.destroy();
        });
    }

    doublyExplode(scene: Phaser.Scene, x: number, y: number, targetDepth: number) {
        const underTargetExplosionConf = {
            // @ts-ignore
            keys: [this.options.keys[0]],
            scale: (this.options.scale ?? 0) + (this.options.doubleDiff ?? 0) ?? 1,
            silent: true,
            double: false,
        };

        new Explosion(scene, x, y, targetDepth - 1, underTargetExplosionConf);
    }
}