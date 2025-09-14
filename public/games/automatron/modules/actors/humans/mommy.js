export { Mommy };
import { Human } from "../../models/human.js";

class Mommy extends Human {
    constructor(game) {
        super(game, 14, 28);
        this.hitboxConfig = {
            up: {
                head: { width: 9, height: 9, xPosition: 6, yPosition: 2 },
                torso: { width: 14, height: 10, xPosition: 4, yPosition: 12 },
                rightArm: { width: 3, height: 10, xPosition: 0, yPosition: 12 },
                leftArm: { width: 3, height: 10, xPosition: 18, yPosition: 12 },
                legs: { width: 9, height: 13, xPosition: 6, yPosition: 23 },
            },
            down: {},
            left: {
                head: { yPosition: 5 },
                torso: { width: 9, height: 9, xPosition: 6, yPosition: 14 },
                leftArm: {
                    width: 0,
                    height: 0,
                    xPosition: this.hiddenHitboxPosition,
                    yPosition: this.hiddenHitboxPosition,
                },
                rightArm: {
                    width: 0,
                    height: 0,
                    xPosition: this.hiddenHitboxPosition,
                    yPosition: this.hiddenHitboxPosition,
                },
                legs: { width: 7, height: 19, xPosition: 6, yPosition: 21 },
            },
            right: {
                head: { yPosition: 3 },
                torso: { width: 9, height: 9, xPosition: 6, yPosition: 13 },
                leftArm: {
                    width: 0,
                    height: 0,
                    xPosition: this.hiddenHitboxPosition,
                    yPosition: this.hiddenHitboxPosition,
                },
                rightArm: {
                    width: 0,
                    height: 0,
                    xPosition: this.hiddenHitboxPosition,
                    yPosition: this.hiddenHitboxPosition,
                },
                legs: { width: 7, height: 19, xPosition: 8, yPosition: 21 },
            },
            upleft: {},
            upright: {},
            downleft: {},
            downright: {},
        };
        this.hitboxConfig.down = { ...this.hitboxConfig.up };
        this.hitboxConfig.upleft = { ...this.hitboxConfig.left };
        this.hitboxConfig.upright = { ...this.hitboxConfig.right };
        this.hitboxConfig.downleft = { ...this.hitboxConfig.left };
        this.hitboxConfig.downright = { ...this.hitboxConfig.right };
        game.hitboxMngr.setAllHitboxes(this);
    }
}
