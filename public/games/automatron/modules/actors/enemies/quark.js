export { Quark };
import { Spawner } from "../../models/spawner.js";
import { Tank } from "./tank.js";

class Quark extends Spawner {
    constructor(game) {
        super(game);
        this.enemyToSpawn = Tank;
        this.spawnAmount = 3; // CHANGES ACCORDING TO WAVE
        this.spawnSound = "tankSpawn";
        this.animationDelay = 7;
        this.lastSprite = 4; // Sprite animation stops on this sprite before restarting
        this.movementDirections = 8;
    }

    update() {
        this.animate();
        this.ai.moveRandomly(this);
    }
}
