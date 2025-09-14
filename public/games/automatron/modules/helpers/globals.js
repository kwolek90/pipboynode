export {
    generateRandomNumber,
    isActorOfType,
    canAnimate,
    getDistanceBetween,
    getActorName,
};

// Generates a random integer between (and including) min and max
function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isActorOfType(actor, type) {
    return actor.constructor.name === type;
}

function canAnimate(actor, game) {
    if (actor.game) {
        return actor.game.globalTimer % actor.animationDelay === 0;
    } else {
        return game.globalTimer % actor.animationDelay === 0;
    }
}

function getDistanceBetween(actorA, actorB) {
    const distanceX = actorB.screenX - actorA.screenX;
    const distanceY = actorB.screenY - actorA.screenY;
    return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
}

function getActorName(actor) {
    return actor.constructor.name.toLowerCase(); // e.g. 'player'
}
