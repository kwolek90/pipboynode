export { Spark };
import { EnemyProjectile } from "../models/enemy-prjctl.js";
import { canAnimate } from "../helpers/globals.js";

class Spark extends EnemyProjectile {
    constructor(sprite, screenX, screenY, speed) {
        super(sprite, screenX, screenY, speed);
        this.width = 21;
        this.height = 21;
        this.timeOnScreen = 150; // Time in updates (2.5 seconds)
    }

    rotate(game) {
        if (canAnimate(this, game)) {
            this.angle += 45;
        }
    }
}
