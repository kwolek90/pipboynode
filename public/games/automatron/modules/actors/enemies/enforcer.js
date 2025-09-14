export { Enforcer };
import { Enemy } from "../../models/enemy.js";
import { generateRandomNumber } from "../../helpers/globals.js";

class Enforcer extends Enemy {
    constructor(game) {
        super(game, 18, 22);
        this.pointsAwarded = 150;
        this.minMoveSpeed = 1; // CHANGES ACCORDING TO WAVE
        this.maxMoveSpeed = 3; // CHANGES ACCORDING TO WAVE
        this.movementSpeed = generateRandomNumber(
            this.minMoveSpeed,
            this.maxMoveSpeed
        );
        this.minDistanceFromPlayer = generateRandomNumber(500, 1000); // Distance before Enforcer slows down
        this.currentSprite = 1;
        this.lastSprite = 6; // Full size
        this.animationDelay = 7;
        this.projectileSpeed = generateRandomNumber(4, 6);
        this.projectileTimer = generateRandomNumber(5, 20);
        this.projectileDelay = generateRandomNumber(100, 300);
        this.shotSound = "sparkShot";
        this.hitboxes = {
            head: { width: 10, height: 7, xPosition: 8, yPosition: 4 },
            torso: { width: 19, height: 12, xPosition: 4, yPosition: 12 },
            rightArm: { width: 3, height: 8, xPosition: 0, yPosition: 15 },
            leftArm: { width: 3, height: 8, xPosition: 24, yPosition: 15 },
            legs: { width: 15, height: 6, xPosition: 6, yPosition: 26 },
        };
    }

    update() {
        if (this.isSpawnAnimationComplete()) {
            const moveTowards = true;
            this.ai.moveInRelationToPlayer(this, this.game, moveTowards);
            this.updateProjectileTimer();
            this.shoot();
        } else {
            this.fadeIn();
        }
    }
}
