export { PlayerProjectile };
import { Projectile } from "../models/projectile.js";

class PlayerProjectile extends Projectile {
    constructor(sprite, screenX, screenY, speed, direction) {
        super(sprite, screenX, screenY, speed);
        this.width = 3;
        this.height = 20;
        this.sprite = sprite;
        this.spritesheetX = 0;
        this.spritesheetY = 0;
        this.screenX = screenX;
        this.screenY = screenY;
        this.direction = direction;
        this.speed = speed;
        this.pushForce = 6;
    }

    move() {
        if (this.direction === "up") {
            this.moveUp();
        } else if (this.direction === "upleft") {
            this.moveUpLeft();
        } else if (this.direction === "upright") {
            this.moveUpRight();
        }
        if (this.direction === "down") {
            this.moveDown();
        } else if (this.direction === "downleft") {
            this.moveDownLeft();
        } else if (this.direction === "downright") {
            this.moveDownRight();
        }
        if (this.direction === "left") {
            this.moveLeft();
        } else if (this.direction === "right") {
            this.moveRight();
        }
    }

    pushEnemy(hulk) {
        const directionMap = {
            up: { x: 0, y: -1 },
            down: { x: 0, y: 1 },
            left: { x: -1, y: 0 },
            right: { x: 1, y: 0 },
            upleft: { x: -1, y: -1 },
            upright: { x: 1, y: -1 },
            downleft: { x: -1, y: 1 },
            downright: { x: 1, y: 1 },
        };
        const { x: pushXDirection, y: pushYDirection } =
            directionMap[this.direction];
        hulk.screenX += pushXDirection * this.pushForce;
        hulk.screenY += pushYDirection * this.pushForce;
    }

    // Height is adjusted to eliminate gaps between hitboxes (sprite is unchanged)
    moveUp() {
        this.angle = 0;
        this.height = 24;
        this.screenY -= this.speed;
    }

    moveUpLeft() {
        this.angle = -Math.PI / 4;
        this.height = 34;
        this.screenX -= this.speed;
        this.screenY -= this.speed;
    }

    moveUpRight() {
        this.angle = Math.PI / 4;
        this.height = 34;
        this.screenX += this.speed;
        this.screenY -= this.speed;
    }

    moveDown() {
        this.angle = 0;
        this.height = 24;
        this.screenY += this.speed;
    }

    moveDownLeft() {
        this.angle = 3 * (-Math.PI / 4);
        this.height = 34;
        this.screenX -= this.speed;
        this.screenY += this.speed;
    }

    moveDownRight() {
        this.angle = 3 * (Math.PI / 4);
        this.height = 34;
        this.screenX += this.speed;
        this.screenY += this.speed;
    }

    moveLeft() {
        this.angle = -Math.PI / 2;
        this.height = 24;
        this.screenX -= this.speed;
    }

    moveRight() {
        this.angle = Math.PI / 2;
        this.height = 24;
        this.screenX += this.speed;
    }
}
