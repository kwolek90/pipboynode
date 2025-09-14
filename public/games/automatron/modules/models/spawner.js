export { Spawner };
import { Enemy } from "./enemy.js";
import { generateRandomNumber, canAnimate } from "../helpers/globals.js";

class Spawner extends Enemy {
    constructor(game) {
        super(game, 30, 30);
        this.pointsAwarded = 1000;
        this.currentSprite = generateRandomNumber(1, 4);
        this.minHumanSpawnDistance = 0;
        this.minPlayerSpawnDistance = 400;
        this.minMoveSpeed = 2; // CHANGES ACCORDING TO WAVE
        this.maxMoveSpeed = 3; // CHANGES ACCORDING TO WAVE
        this.movementSpeed = generateRandomNumber(
            this.minMoveSpeed,
            this.maxMoveSpeed
        );
        this.secondsBeforeSpawningStarts = generateRandomNumber(3, 4); // CHANGES ACCORDING TO WAVE
        this.secondsBetweenSpawns = generateRandomNumber(1, 4); // Initial time between animation change and first enemy spawn
        // Hitbox based on the currentSprite
        this.hitboxConfig = {
            1: {
                itself: { width: 4, height: 4, xPosition: 20, yPosition: 20 },
            },
            2: {
                itself: { width: 9, height: 9, xPosition: 18, yPosition: 18 },
            },
            3: {
                itself: { width: 13, height: 13, xPosition: 16, yPosition: 16 },
            },
            4: {
                itself: { width: 16, height: 16, xPosition: 14, yPosition: 15 },
            },
            5: {
                itself: { width: 23, height: 23, xPosition: 11, yPosition: 11 },
            },
            6: {
                itself: { width: 29, height: 29, xPosition: 8, yPosition: 8 },
            },
            7: {
                itself: { width: 27, height: 27, xPosition: 9, yPosition: 9 },
            },
            8: {
                itself: {
                    width: 0,
                    height: 0,
                    xPosition: this.hiddenHitboxPosition,
                    yPosition: this.hiddenHitboxPosition,
                },
            },
        };
        setTimeout(() => {
            this.updateState("spawning");
        }, this.secondsBeforeSpawningStarts * 1000);
    }

    animate() {
        if (canAnimate(this)) {
            this.game.spriteMngr.moveToNextSpawnerSprite(this);
            this.game.hitboxMngr.updateSpawnerHitbox(this);
        }
    }

    spawnEnemies() {
        const { actorMngr, soundMngr } = this.game;
        if (this.spawnAmount <= 0) {
            this.updateState("vanished");
            return;
        }
        if (this.secondsBetweenSpawns <= 0) {
            actorMngr.addSpawner(this, 1, this.enemyToSpawn);
            soundMngr.playSound(this.spawnSound);
            this.spawnAmount--;
            this.secondsBetweenSpawns = generateRandomNumber(1, 3); // Time untill the next spawn
        } else if (this.game.debuggerr.shouldUpdateActors) {
            this.secondsBetweenSpawns -= 1 / 60;
        }
    }

    fadeOut() {
        this.animationDelay = 9;
        this.hitboxes = null;
        this.lastSprite = 8;
    }
}
