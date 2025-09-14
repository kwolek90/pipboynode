export { Sprite };

class Sprite {
    constructor(spriteSrc, spritesIndex) {
        this.spritesheet = new Image();
        this.spritesheet.src = spritesIndex[spriteSrc];
    }
}
