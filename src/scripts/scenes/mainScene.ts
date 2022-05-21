import Spaceship from "../objects/spaceship";
import GenericText from "../objects/genericText";

export default class MainScene extends Phaser.Scene {
    debugText: GenericText;
    player;
    background;
    keys;
    debugTextDict = {};
    backgroundDict = {};
    screen;
    emitter;
    constructor() {
        super({ key: "MainScene" });
    }

    create() {
        // Init keys
        this.keys = this.input.keyboard.addKeys("W,A,S,D,SPACE,CTRL,UP,LEFT,DOWN,RIGHT");

        this.player = new Spaceship(this, 0, 0, "F5S4", 10);
        this.cameras.main.startFollow(this.player);
        this.debugText = new GenericText(this, this.player).setDepth(100);
        this.loadBackground("map_1-2", 0.5);
        this.loadTileBackground(
            this,
            this.physics.world.bounds.width,
            this.physics.world.bounds.height,
            "particles",
            0.75
        );
        this.loadTileBackground(
            this,
            this.physics.world.bounds.width,
            this.physics.world.bounds.height,
            "particles",
            1,
            180
        );
        // Make player look at the cursor
        this.input.on("pointermove", (event) => {
            this.player.lookAtPoint(event.worldX, event.worldY);
        });
    }

    update() {
        this.debugText.update();

        this.player.stopMoving();

        // Key bindings
        const upBtn = this.keys.W.isDown || this.keys.UP.isDown;
        const leftBtn = this.keys.A.isDown || this.keys.LEFT.isDown;
        const rightBtn = this.keys.D.isDown || this.keys.RIGHT.isDown;
        const downBtn = this.keys.S.isDown || this.keys.DOWN.isDown;
        const primaryShootBtn = this.input.activePointer.isDown;

        // Moving
        if (upBtn && !leftBtn && !downBtn && !rightBtn) {
            this.player.moveUp();
        } else if (!upBtn && leftBtn && !downBtn && !rightBtn) {
            this.player.moveLeft();
        } else if (!upBtn && !leftBtn && downBtn && !rightBtn) {
            this.player.moveDown();
        } else if (!upBtn && !leftBtn && !downBtn && rightBtn) {
            this.player.moveRight();
        } else if (upBtn && leftBtn && !downBtn && !rightBtn) {
            this.player.moveUpLeft();
        } else if (upBtn && !leftBtn && !downBtn && rightBtn) {
            this.player.moveUpRight();
        } else if (!upBtn && leftBtn && downBtn && !rightBtn) {
            this.player.moveDownLeft();
        } else if (!upBtn && !leftBtn && downBtn && rightBtn) {
            this.player.moveDownRight();
        }

        // Shooting
        if (primaryShootBtn) {
            this.player.shoot();
        }
    }

    updateRootBackground(color?) {
        const root = document.getElementById("phaser-game");
        root!.style.backgroundColor = color ?? "#1d252c";
    }

    // https://blog.ourcade.co/posts/2020/add-pizazz-parallax-scrolling-phaser-3/
    // TODO a way to optimize it further would be to recylcle the tiles
    loadTileBackground = (
        scene: Phaser.Scene,
        totalWidth: number,
        totalHeight: number,
        texture: string,
        scrollFactor: number,
        angle: number = 0
    ) => {
        const { width: w, height: h } = scene.textures.get(texture).getSourceImage();
        const countX = Math.floor(totalWidth / w) * scrollFactor;
        const countY = Math.floor(totalHeight / h) * scrollFactor;

        let y = -h;
        for (let i = 0; i < countY + 3; i++) {
            let x = -w;
            for (let j = 0; j < countX + 3; ++j) {
                const m = scene.add
                    .image(x, y, texture)
                    .setOrigin(0, 1)
                    .setScrollFactor(scrollFactor)
                    .setAngle(angle);

                x += m.width;
            }
            y += scene.scale.height;
        }
    };

    loadBackground(atlasTexture: string, parallax: number) {
        const atlas = this.textures.get(atlasTexture);
        const width = atlas.frames["map"].width;
        const height = atlas.frames["map"].height;
        const color = atlas.customData["meta"].bgColor;

        const [imageOffset, boundsSize] = this.getScrollingFactorCollisionAdjustment(
            parallax,
            width,
            height
        );

        this.add
            .image(imageOffset.x, imageOffset.y, atlasTexture)
            .setOrigin(0, 0)
            .setScrollFactor(parallax);

        this.physics.world.setBounds(0, 0, boundsSize.width, boundsSize.height);

        this.updateRootBackground(color);
    }

    // https://newdocs.phaser.io/docs/3.54.0/focus/Phaser.GameObjects.Container-setScrollFactor
    getScrollingFactorCollisionAdjustment(
        parallax,
        textureWidth,
        textureHeight
    ): [
        {
            x: number;
            y: number;
        },
        any
    ] {
        var csx = this.cameras.main.scrollX;
        var csy = this.cameras.main.scrollY;

        var px = 0 + csx * parallax - csx;
        var py = 0 + csy * parallax - csy;

        const imageOffset: { x: number; y: number } = { x: px, y: py };
        const boundsSize: { width: number; height: number } = {
            width: (textureWidth * 1) / parallax,
            height: (textureHeight * 1) / parallax,
        };
        return [imageOffset, boundsSize];
    }
}
