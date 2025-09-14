export { Projectile };

// Instantiated in projectileMngr
class Projectile {
    constructor(sprite, screenX, screenY, speed) {
        this.currentState = "moving";
        this.sprite = sprite;
        this.spritesheetX = 0;
        this.spritesheetY = 0;
        this.screenX = screenX;
        this.screenY = screenY;
        this.speed = speed;
        this.angle = 0;
        // Speed defined by each actor
    }

    // Updated in stateMngr.handleProjectileStates
    update(game) {
        this.move(game);
        if (this.isOutOfBounds(game.ui)) {
            this.updateState("outOfBounds");
        }
    }

    draw(game, context) {
        // REMOVE GAME WITH DEBUGGER
        const { width, height, screenX, screenY, angle } = this;
        context.save();
        context.translate(screenX + width / 2, screenY + height / 2);
        context.rotate(angle);
        context.drawImage(this.sprite, -width / 2, -height / 2);
        context.restore();
        game.debuggerr.drawHitboxes(this, context);
    }

    isOutOfBounds(ui) {
        const { screenX, screenY } = this;
        return (
            screenX > ui.canvas.width + 10 ||
            screenX < -10 ||
            screenY > ui.canvas.height + 10 ||
            screenY < -10
        );
    }

    updateState(state) {
        this.currentState = state;
    }
}
