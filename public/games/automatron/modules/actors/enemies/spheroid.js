export { Spheroid };
import { Spawner } from "../../models/spawner.js";
import { Enforcer } from "./enforcer.js";

class Spheroid extends Spawner {
    constructor(game) {
        super(game);
        this.minDistanceFromPlayer = 850; // Used in ai.moveInRelationToPlayer
        this.enemyToSpawn = Enforcer;
        this.spawnAmount = 3; // CHANGES ACCORDING TO WAVE
        this.spawnSound = "enforcerSpawn";
        this.animationDelay = 4;
        this.lastSprite = 5; // Sprite animation stops on this sprite before restarting
    }

    update() {
        this.animate();
        this.ai.moveInRelationToPlayer(this, this.game); // Avoids Player
    }
}
