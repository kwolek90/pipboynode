export { ArtificialIntelligence };
import {
    generateRandomNumber,
    getDistanceBetween,
} from "../helpers/globals.js";

class ArtificialIntelligence {
    constructor() {
        this.directions = [
            "up",
            "down",
            "left",
            "right",
            "upleft",
            "upright",
            "downleft",
            "downright",
        ];
        this.previousDirections = [];
    }

    // [Player]  [Grunt]
    isAtPlayersLeftSide(grunt, player) {
        return grunt.screenX > player.screenX;
    }

    isBelowPlayer(grunt, player) {
        return grunt.screenY > player.screenY;
    }

    stepTowardsPlayer(grunt, game) {
        const player = game.actorMngr.actors.player;
        if (this.isAtPlayersLeftSide(grunt, player)) {
            grunt.screenX -= grunt.movementSpeed;
        } else {
            grunt.screenX += grunt.movementSpeed;
        }
        if (this.isBelowPlayer(grunt, player)) {
            grunt.screenY -= grunt.movementSpeed;
        } else {
            grunt.screenY += grunt.movementSpeed;
        }
    }

    // Grunts only. 50% change to stepTowardsPlayer
    moveAtRandomIntervals(grunt, game) {
        if (generateRandomNumber(1, 2) === 1) {
            this.stepTowardsPlayer(grunt, game);
            game.soundMngr.playSound("gruntStep");
            game.spriteMngr.moveToNextSprite(grunt);
        }
    }

    // Spheroids and Enforcers only
    moveInRelationToPlayer(actor, game, moveTowards = false) {
        const { player } = game.actorMngr.actors;
        const distanceX = player.screenX - actor.screenX;
        const distanceY = player.screenY - actor.screenY;
        const currentDistance = getDistanceBetween(actor, player); // Ranges from 40 to 1092
        const distanceToMaintain = actor.minDistanceFromPlayer;
        // Adjusts movement speed based on currentDistance
        const speedMultiplier = moveTowards
            ? currentDistance / distanceToMaintain
            : distanceToMaintain / currentDistance;
        const effectiveSpeed = actor.movementSpeed * speedMultiplier;
        const movementMultiplier = effectiveSpeed / currentDistance;
        actor.screenX +=
            (moveTowards ? distanceX : -distanceX) * movementMultiplier;
        actor.screenY +=
            (moveTowards ? distanceY : -distanceY) * movementMultiplier;
        // Spheroid rotates clockwise in relation to the Player if closer than distanceToMaintain
        if (!moveTowards && currentDistance <= distanceToMaintain) {
            actor.screenX += distanceY * movementMultiplier;
            actor.screenY -= distanceX * movementMultiplier;
        }
        actor.stayWithinCanvas(); // Might leave canvas' borders if in actor.update
    }

    moveActor(actor) {
        const reducedMovementSpeed = actor.movementSpeed * 0.8;
        switch (actor.currentDirection) {
            case "up":
                actor.screenY -= actor.movementSpeed;
                break;
            case "down":
                actor.screenY += actor.movementSpeed;
                break;
            case "left":
                actor.screenX -= actor.movementSpeed;
                break;
            case "right":
                actor.screenX += actor.movementSpeed;
                break;
            case "upleft":
                actor.screenY -= reducedMovementSpeed;
                actor.screenX -= reducedMovementSpeed;
                break;
            case "upright":
                actor.screenX += reducedMovementSpeed;
                actor.screenY -= reducedMovementSpeed;
                break;
            case "downleft":
                actor.screenX -= reducedMovementSpeed;
                actor.screenY += reducedMovementSpeed;
                break;
            case "downright":
                actor.screenX += reducedMovementSpeed;
                actor.screenY += reducedMovementSpeed;
                break;
        }
        actor.remainingWalkingDistance--;
    }

    setRandomWalkDistance(actor, extendDistance = false) {
        let minDistance, maxDistance;
        if (extendDistance) {
            minDistance = 60;
            maxDistance = 120;
        } else {
            minDistance = 16;
            maxDistance = 50;
        }
        actor.remainingWalkingDistance = generateRandomNumber(
            minDistance,
            maxDistance
        );
    }

    // Returns one of 4 or 8 directions based on the actor's movementDirections if not found in previousDirections
    getRandomDirection(actor, directions, previousDirections) {
        const availableDirections = directions
            .slice(0, actor.movementDirections)
            .filter((direction) => !previousDirections.includes(direction));
        return availableDirections[
            Math.floor(Math.random() * availableDirections.length)
        ];
    }

    isDesiredAmountReached(previousDirections, amountToStore) {
        return previousDirections.length === amountToStore;
    }

    // Stores the actor's last 2 or 4 directions based on its movementDirections
    storePreviousDirection(actor, previousDirections) {
        const amountToStore = actor.movementDirections === 4 ? 2 : 4;
        if (this.isDesiredAmountReached(previousDirections, amountToStore)) {
            previousDirections.shift();
        }
        previousDirections.push(actor.currentDirection);
    }

    setRandomDirection(actor) {
        const { directions, previousDirections } = this;
        actor.currentDirection = this.getRandomDirection(
            actor,
            directions,
            previousDirections
        );
        this.storePreviousDirection(actor, previousDirections);
    }

    // Moves to a random direction for a random distance
    moveToRandomDirection(actor, extendDistance) {
        if (actor.remainingWalkingDistance > 0) {
            this.moveActor(actor);
        } else {
            this.setRandomWalkDistance(actor, extendDistance);
            this.setRandomDirection(actor);
        }
    }

    isActorAgainstWall(actor) {
        const { screenX, screenY, movementBoundaries } = actor;
        return (
            screenX >= movementBoundaries.x ||
            screenX <= 2 ||
            screenY >= movementBoundaries.y ||
            screenY <= 2
        );
    }

    moveAwayFromWall(actor, extendDistance) {
        if (this.isActorAgainstWall(actor)) {
            this.setRandomDirection(actor);
            this.setRandomWalkDistance(actor, extendDistance);
        }
    }

    moveRandomly(actor, extendDistance) {
        this.moveAwayFromWall(actor, extendDistance);
        this.moveToRandomDirection(actor, extendDistance);
        actor.stayWithinCanvas();
    }
}
