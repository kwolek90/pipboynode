export { SoundManager };
import { SoundEffect } from "../models/sound-effect.js";
import { soundFxIndex } from "../helpers/indexes.js";

// Plays one sound at a time depending on its priority
// Priority levels range from 1 (lowest) to 6 (highest)
class SoundManager {
    constructor() {
        this.currentSound = new SoundEffect();
    }

    // A high priority sound (5 or 6) or a sound of current priority
    shouldPlayNow(priority) {
        return priority >= this.currentSound.priority || priority > 4;
    }

    stopCurrentSound(currentSound) {
        if (currentSound.sound) {
            currentSound.sound.muted = true;
            currentSound.sound = null;
        }
    }

    createNewSound(soundFile, priority) {
        const newSound = new Audio(soundFile);
        this.currentSound.sound = newSound;
        this.currentSound.priority = priority;
    }

    userInteractedWithPage() {
        return navigator.userActivation.hasBeenActive;
    }

    playNewSound(currentSound) {
        if (this.userInteractedWithPage()) {
            // Avoids an error
            currentSound.sound.play();
        }
    }

    playExclusively(minimumDurationInSeconds) {
        if (minimumDurationInSeconds) {
            this.currentSound.timeout = setTimeout(() => {
                this.currentSound.timeout = null;
            }, minimumDurationInSeconds * 1000);
        }
    }

    playSound(sound) {
        const { currentSound } = this;
        const soundFile = soundFxIndex[sound][0];
        const priority = soundFxIndex[sound][1];
        const minimumDurationInSeconds = soundFxIndex[sound][2];
        if (this.shouldPlayNow(priority)) {
            clearTimeout(currentSound.timeout);
        }
        // Ignores any sound of lower priority than the current one
        else if (currentSound.timeout !== null) {
            return;
        }
        this.stopCurrentSound(currentSound);
        this.createNewSound(soundFile, priority);
        this.playNewSound(currentSound);
        this.playExclusively(minimumDurationInSeconds);
    }
}
