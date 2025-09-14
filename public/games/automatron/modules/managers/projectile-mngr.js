export { ProjectileManager };
import { Spark } from "../projectiles/spark.js";
import { BounceBomb } from "../projectiles/bounce-bomb.js";
import { PlayerProjectile } from "../projectiles/player-prjctl.js";
import { getActorName } from "../helpers/globals.js";

class ProjectileManager {
    constructor() {
        this.projectiles = {
            player: new Set(),
            enemies: new Set(),
        };
    }

    draw(game, context) {
        // REMOVE GAME WITH DEBUGGER
        const { projectiles } = this;
        Object.values(projectiles).forEach((projectileSet) => {
            projectileSet.forEach((projectile) => {
                projectile.draw(game, context);
            });
        });
    }

    createProjectile(actor, screenX, screenY, speed, direction) {
        let projectile;
        const actorName = getActorName(actor);
        switch (actorName) {
            case "enforcer":
                projectile = new Spark(
                    actor.projectileSprite,
                    screenX,
                    screenY,
                    speed
                );
                this.projectiles.enemies.add(projectile);
                break;
            case "tank":
                projectile = new BounceBomb(
                    actor.projectileSprite,
                    screenX,
                    screenY,
                    speed
                );
                this.projectiles.enemies.add(projectile);
                break;
            case "player":
                projectile = new PlayerProjectile(
                    actor.projectileSprite,
                    screenX,
                    screenY,
                    speed,
                    direction
                );
                this.projectiles.player.add(projectile);
                break;
        }
        return projectile;
    }

    eraseAllPlayerProjectiles() {
        this.projectiles.player.clear();
    }
}
