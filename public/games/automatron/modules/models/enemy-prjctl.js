export { EnemyProjectile };
import { Projectile } from "./projectile.js";
import {
    generateRandomNumber,
    getDistanceBetween,
    getActorName,
} from "../helpers/globals.js";

class EnemyProjectile extends Projectile {
    constructor(sprite, screenX, screenY, speed) {
        super(sprite, screenX, screenY, speed);
        this.pointsAwarded = 25;
        this.sprite = sprite;
        this.animationDelay = speed;
        this.screenX = screenX;
        this.screenY = screenY;
        this.speed = speed;
    }

    move(game) {
        this.setMovementBoundaries(game);
        this.shoot(game);
        this.moveToDirection(game); // REMOVE GAME WITH DEBUGGER
        this.executeEnemyProjectileBehavior(game);
        this.stayWithinCanvas();
        this.elapseTimeOnScreen(game); // REMOVE GAME WITH DEBUGGER
        this.vanishAfterTimeElapsed();
    }

    // Moves to the player's position at the time of shooting (plus or minus randomOffset)
    shoot(game) {
        const { player } = game.actorMngr.actors;
        if (!this.fired) {
            const randomXOffset = generateRandomNumber(0, 40);
            const randomYOffset = generateRandomNumber(0, 20);
            const distanceX = player.screenX - (this.screenX + randomXOffset);
            const distanceY = player.screenY - (this.screenY + randomYOffset);
            const distance = getDistanceBetween(this, player);
            const directionX = distanceX / distance;
            const directionY = distanceY / distance;
            this.directionX = directionX;
            this.directionY = directionY;
            this.fired = true;
        }
    }

    moveToDirection(game) {
        if (game.debuggerr.shouldUpdateActors) {
            this.screenX += this.directionX * this.speed;
            this.screenY += this.directionY * this.speed;
        }
    }

    elapseTimeOnScreen(game) {
        if (this.timeOnScreen && game.debuggerr.shouldUpdateActors) {
            this.timeOnScreen--;
        }
    }

    vanishAfterTimeElapsed() {
        if (this.timeOnScreen <= 0) {
            this.updateState("vanished");
        }
    }

    setMovementBoundaries(game) {
        if (!this.movementBoundaries) {
            const { ui } = game;
            this.movementBoundaries = {
                x: ui.canvas.width - this.width,
                y: ui.canvas.height - this.height,
            };
        }
    }

    executeEnemyProjectileBehavior(game) {
        const actorName = getActorName(this);
        switch (actorName) {
            case "spark":
                this.rotate(game);
                break;
            case "bouncebomb":
                this.bounce(game);
                break;
        }
    }

    isTouchingCeiling() {
        return this.screenY <= 2;
    }

    isTouchingFloor() {
        return this.screenY >= this.movementBoundaries.y;
    }

    isTouchingLeftWall() {
        return this.screenX <= 2;
    }

    isTouchingRightWall() {
        return this.screenX >= this.movementBoundaries.x;
    }

    stayWithinCanvas() {
        const ceilingY = 2;
        const leftWallX = 2;
        if (this.isTouchingCeiling()) {
            this.screenY = ceilingY;
        } else if (this.isTouchingFloor()) {
            this.screenY = this.movementBoundaries.y;
        }
        if (this.isTouchingLeftWall()) {
            this.screenX = leftWallX;
        } else if (this.isTouchingRightWall()) {
            this.screenX = this.movementBoundaries.x;
        }
    }
}
