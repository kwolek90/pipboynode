export { Hulk };
import { Enemy } from "../../models/enemy.js";
import { canAnimate } from "../../helpers/globals.js";

class Hulk extends Enemy {
    constructor(game) {
        super(game, 26, 32);
        this.movementDirections = 4;
        this.movementSpeed = 8; // INCREASES ACCORDING TO WAVE
        this.animationDelay = 9;
        this.minHumanSpawnDistance = 120;
        this.hitboxConfig = {
            up: {
                head: { width: 9, height: 9, xPosition: 15, yPosition: 0 },
                torso: { width: 22, height: 22, xPosition: 9, yPosition: 9 },
                rightArm: { width: 9, height: 24, xPosition: 30, yPosition: 9 },
                leftArm: { width: 9, height: 24, xPosition: 0, yPosition: 9 },
                legs: { width: 15, height: 7, xPosition: 12, yPosition: 31 },
            },
            down: {},
            left: {
                head: { xPosition: 15, yPosition: 3 },
                torso: { xPosition: 9, yPosition: 12 },
                rightArm: {
                    width: 0,
                    height: 0,
                    xPosition: this.hiddenHitboxPosition,
                    yPosition: this.hiddenHitboxPosition,
                },
                leftArm: {
                    width: 0,
                    height: 0,
                    xPosition: this.hiddenHitboxPosition,
                    yPosition: this.hiddenHitboxPosition,
                },
                legs: { width: 12, height: 11, xPosition: 11, yPosition: 34 },
            },
            right: {
                head: { xPosition: 15, yPosition: 2 },
                torso: { xPosition: 9, yPosition: 11 },
                rightArm: {
                    width: 0,
                    height: 0,
                    xPosition: this.hiddenHitboxPosition,
                    yPosition: this.hiddenHitboxPosition,
                },
                leftArm: {
                    width: 0,
                    height: 0,
                    xPosition: this.hiddenHitboxPosition,
                    yPosition: this.hiddenHitboxPosition,
                },
                legs: { width: 12, height: 11, xPosition: 15, yPosition: 33 },
            },
        };
        this.hitboxConfig.down = { ...this.hitboxConfig.up };
        game.hitboxMngr.setAllHitboxes(this);
    }

    update() {
        if (canAnimate(this)) {
            this.ai.moveRandomly(this);
            this.animate(this, this.currentDirection);
        }
    }
}
