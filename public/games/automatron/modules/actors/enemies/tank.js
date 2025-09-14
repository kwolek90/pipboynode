export { Tank };
import { Enemy } from "../../models/enemy.js";
import { generateRandomNumber, canAnimate } from "../../helpers/globals.js";

class Tank extends Enemy {
    constructor(game) {
        super(game, 26, 32);
        this.pointsAwarded = 200;
        this.movementDirections = 8;
        this.minMoveSpeed = 1; // CHANGES ACCORDING TO WAVE
        this.maxMoveSpeed = 2; // CHANGES ACCORDING TO WAVE
        this.movementSpeed = generateRandomNumber(
            this.minMoveSpeed,
            this.maxMoveSpeed
        );
        this.currentSprite = 1;
        this.lastSprite = 4;
        this.projectileSpeed = generateRandomNumber(6, 8);
        this.projectileTimer = generateRandomNumber(5, 20);
        this.projectileDelay = generateRandomNumber(100, 300);
        this.shotSound = "bombShot";
        this.hitboxes = {
            head: { width: 14, height: 12, xPosition: 12, yPosition: 0 },
            torso: { width: 32, height: 22, xPosition: 3, yPosition: 15 },
            legs: { width: 30, height: 8, xPosition: 4, yPosition: 39 },
        };
    }

    update() {
        if (this.isSpawnAnimationComplete() && canAnimate(this)) {
            this.animationDelay = 2;
            this.spritesheetY = 32;
            this.game.spriteMngr.moveToNextSprite(this);
        } else if (!this.isSpawnAnimationComplete()) {
            this.animationDelay = 7;
            this.fadeIn();
            return;
        }
        this.ai.moveRandomly(this, true);
        this.updateProjectileTimer();
        this.shoot();
    }
}
