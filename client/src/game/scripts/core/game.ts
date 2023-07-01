import "phaser";
import Phaser from "phaser";
import MouseWheelScrollerPlugin from "phaser3-rex-plugins/plugins/mousewheelscroller-plugin.js";
import RotateToPlugin from "phaser3-rex-plugins/plugins/rotateto-plugin.js";
import SoundFadePlugin from "phaser3-rex-plugins/plugins/soundfade-plugin.js";
import MoveToPlugin from "phaser3-rex-plugins/plugins/moveto-plugin.js";
import VirtualJoystickPlugin from "phaser3-rex-plugins/plugins/virtualjoystick-plugin.js";
import ButtonPlugin from "phaser3-rex-plugins/plugins/button-plugin.js";

import { MainScene, PreloadScene } from "~/scenes";
import type { Spaceship } from "~/objects";
const DEFAULT_WIDTH = 1920;
const DEFAULT_HEIGHT = 1080;
// const DEFAULT_WIDTH = 920;
// const DEFAULT_HEIGHT = 800;

// const graphicsSettings = { best: 1, medium: 0.75, low: 0.5 };
// const DPR = window.devicePixelRatio * graphicsSettings.low;
// // const { width, height } = window.screen;
// const { width, height } = { width: 1920, height: 1080 };

// // Set width and height.
// const WIDTH = Math.round(Math.max(width, height) * DPR);
// const HEIGHT = Math.round(Math.min(width, height) * DPR);

export const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    transparent: true,
    scale: {
        parent: "phaser-game",
        mode: Phaser.Scale.FIT,
        // mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
    },
    scene: [PreloadScene, MainScene],
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            gravity: {},
        },
    },
    plugins: {
        global: [
            {
                key: "rexMouseWheelScroller",
                plugin: MouseWheelScrollerPlugin,
                start: true,
            },
            {
                key: "rexRotateTo",
                plugin: RotateToPlugin,
                start: true,
            },
            {
                key: "rexSoundFade",
                plugin: SoundFadePlugin,
                start: true,
            },
            {
                key: "rexMoveTo",
                plugin: MoveToPlugin,
                start: true,
            },
            {
                key: "rexVirtualJoystick",
                plugin: VirtualJoystickPlugin,
                start: true,
            },
            {
                key: "rexButton",
                plugin: ButtonPlugin,
                start: true,
            },
        ],
    },
    input: {
        gamepad: true,
    },
};

export class Game {
    config;
    game: Phaser.Game;

    constructor(config) {
        this.config = config;
    }

    init = async (settings) => {
        const whenIsBooted = new Promise((resolve) => {
            this.game = new Phaser.Game({
                ...this.config,
                callbacks: { postBoot: () => resolve(true) },
            });
            this.game["settings"] = settings;
        });
        await whenIsBooted;

        const whenSceneCreated = new Promise((resolve) => {
            const MainScene = this.game.scene.keys.MainScene as MainScene;
            MainScene.events.on("create", resolve);
        });
        await whenSceneCreated;

        return this;
    };
    get scene(): MainScene | null {
        return (this.game?.scene?.keys?.MainScene as MainScene) ?? null;
    }
    get player(): Spaceship | null {
        return this.scene?.player ?? null;
    }
    destroy = () => {
        this.game.destroy(false);
    };
}

export const game = new Game(gameConfig);
