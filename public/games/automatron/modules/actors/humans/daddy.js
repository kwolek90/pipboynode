export { Daddy };
import { Human } from "../../models/human.js";

class Daddy extends Human {
    constructor(game) {
        super(game, 16, 26);
        this.hitboxConfig = {
            up: {
                head: { width: 9, height: 9, xPosition: 9, yPosition: 0 },
                torso: { width: 14, height: 14, xPosition: 7, yPosition: 9 },
                rightArm: { width: 3, height: 13, xPosition: 3, yPosition: 9 },
                leftArm: { width: 3, height: 13, xPosition: 21, yPosition: 9 },
                legs: { width: 10, height: 10, xPosition: 9, yPosition: 23 },
            },
            down: {
                head: { width: 9, height: 9, xPosition: 6, yPosition: 0 },
                torso: { width: 14, height: 14, xPosition: 4, yPosition: 9 },
                rightArm: { width: 3, height: 13, xPosition: 0, yPosition: 9 },
                leftArm: { width: 3, height: 13, xPosition: 18, yPosition: 9 },
                legs: { width: 10, height: 10, xPosition: 6, yPosition: 23 },
            },
            left: {
                head: { xPosition: 9, yPosition: 0 },
                torso: { width: 10, height: 11, xPosition: 9, yPosition: 11 },
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
                legs: { width: 7, height: 19, xPosition: 9, yPosition: 17 },
            },
            right: {
                head: { xPosition: 6, yPosition: 0 },
                torso: { width: 10, height: 11, xPosition: 6, yPosition: 11 },
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
                legs: { width: 7, height: 19, xPosition: 8, yPosition: 17 },
            },
            upleft: {},
            upright: {},
            downleft: {},
            downright: {},
        };
        this.hitboxConfig.upleft = { ...this.hitboxConfig.left };
        this.hitboxConfig.upright = { ...this.hitboxConfig.right };
        this.hitboxConfig.downleft = { ...this.hitboxConfig.left };
        this.hitboxConfig.downright = { ...this.hitboxConfig.right };
        game.hitboxMngr.setAllHitboxes(this);
    }
}
