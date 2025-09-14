export { Grunt };
import { Enemy } from "../../models/enemy.js";

class Grunt extends Enemy {
    constructor(game) {
        super(game, 18, 27);
        this.pointsAwarded = 100;
        this.movementSpeed = 8; // INCREASES ACCORDING TO WAVE ELAPSED TIME (TAKING TOO LONG)
        this.movementTimer = 0;
        this.movementInterval = 10; // DECREASES ACCORDING TO WAVE ELAPSED TIME
        this.hitboxes = {
            head: { width: 10, height: 11, xPosition: 8, yPosition: 0 },
            torso: { width: 20, height: 10, xPosition: 4, yPosition: 12 },
            rightArm: { width: 3, height: 12, xPosition: 0, yPosition: 12 },
            leftArm: { width: 3, height: 12, xPosition: 24, yPosition: 12 },
            legs: { width: 15, height: 10, xPosition: 6, yPosition: 23 },
        };
    }

    update(game) {
        this.move(game);
    }

    canMove() {
        return this.movementTimer > this.movementInterval;
    }

    move(game) {
        if (this.canMove()) {
            this.ai.moveAtRandomIntervals(this, game);
            this.stayWithinCanvas();
            this.movementTimer = 0;
        } else {
            this.movementTimer++;
        }
    }
}
