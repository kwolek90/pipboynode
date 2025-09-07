// Atomic Command - A Fallout-styled missile defense game
// Game metadata for Pipboy interface
const gameInfo = {
    name: "ATOMIC COMMAND",
    description: "Defend your vault from incoming nuclear missiles",
    version: "v2.0.3",
    author: "ROBCO INDUSTRIES",
    classification: "STRATEGY/DEFENSE",
    status: "OPERATIONAL"
};

// Atomic Command game implementation
class AtomicCommand {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gameRunning = false;
        this.score = 0;
        this.missiles = [];
        this.explosions = [];
    }
    
    init(containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = `
            <div style="text-align: center; color: #00ff00; font-family: 'Courier Prime', monospace;">
                <h3>${gameInfo.name}</h3>
                <p>${gameInfo.description}</p>
                <canvas id="atomic-canvas" width="400" height="300" style="border: 2px solid #00ff00; background: #001100; cursor: crosshair;"></canvas>
                <div style="margin-top: 10px;">
                    <button onclick="atomicGame.start()" style="background: transparent; border: 2px solid #00ff00; color: #00ff00; padding: 10px; margin: 5px; cursor: pointer;">LAUNCH DEFENSE</button>
                    <button onclick="atomicGame.stop()" style="background: transparent; border: 2px solid #00ff00; color: #00ff00; padding: 10px; margin: 5px; cursor: pointer;">CEASE FIRE</button>
                </div>
                <div style="margin-top: 10px;">
                    <div>SCORE: <span id="atomic-score">0</span></div>
                    <div>MISSILES DESTROYED: <span id="missiles-destroyed">0</span></div>
                </div>
                <div style="font-size: 0.8em; margin-top: 10px; opacity: 0.7;">
                    Click to fire defensive missiles
                </div>
            </div>
        `;
        
        this.canvas = document.getElementById('atomic-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupControls();
        this.missiles = [];
        this.explosions = [];
        this.missilesDestroyed = 0;
    }
    
    setupControls() {
        this.canvas.addEventListener('click', (e) => {
            if (this.gameRunning) {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.fireDefensiveMissile(x, y);
            }
        });
    }
    
    start() {
        this.gameRunning = true;
        this.score = 0;
        this.missilesDestroyed = 0;
        this.missiles = [];
        this.explosions = [];
        this.updateUI();
        this.spawnMissiles();
        this.gameLoop();
    }
    
    stop() {
        this.gameRunning = false;
    }
    
    spawnMissiles() {
        if (!this.gameRunning) return;
        
        // Spawn enemy missile from top
        this.missiles.push({
            x: Math.random() * this.canvas.width,
            y: 0,
            targetX: Math.random() * this.canvas.width,
            targetY: this.canvas.height,
            speed: 1 + Math.random(),
            type: 'enemy',
            trail: []
        });
        
        // Schedule next missile
        setTimeout(() => this.spawnMissiles(), 2000 + Math.random() * 3000);
    }
    
    fireDefensiveMissile(targetX, targetY) {
        this.missiles.push({
            x: this.canvas.width / 2,
            y: this.canvas.height,
            targetX: targetX,
            targetY: targetY,
            speed: 3,
            type: 'defense',
            trail: []
        });
    }
    
    gameLoop() {
        if (!this.gameRunning) return;
        
        this.update();
        this.draw();
        
        setTimeout(() => this.gameLoop(), 50);
    }
    
    update() {
        // Update missiles
        this.missiles = this.missiles.filter(missile => {
            // Add to trail
            missile.trail.push({ x: missile.x, y: missile.y });
            if (missile.trail.length > 10) {
                missile.trail.shift();
            }
            
            // Move missile towards target
            const dx = missile.targetX - missile.x;
            const dy = missile.targetY - missile.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < missile.speed) {
                // Missile reached target
                this.explode(missile.x, missile.y);
                if (missile.type === 'defense') {
                    // Check for enemy missile hits
                    this.checkHits(missile.x, missile.y);
                }
                return false;
            }
            
            missile.x += (dx / distance) * missile.speed;
            missile.y += (dy / distance) * missile.speed;
            
            return missile.y >= 0 && missile.y <= this.canvas.height;
        });
        
        // Update explosions
        this.explosions = this.explosions.filter(explosion => {
            explosion.radius += 2;
            explosion.alpha -= 0.05;
            return explosion.alpha > 0;
        });
    }
    
    explode(x, y) {
        this.explosions.push({
            x: x,
            y: y,
            radius: 0,
            alpha: 1.0
        });
    }
    
    checkHits(x, y) {
        const hitRadius = 30;
        this.missiles = this.missiles.filter(missile => {
            if (missile.type === 'enemy') {
                const distance = Math.sqrt((missile.x - x) ** 2 + (missile.y - y) ** 2);
                if (distance < hitRadius) {
                    this.missilesDestroyed++;
                    this.score += 100;
                    this.updateUI();
                    return false;
                }
            }
            return true;
        });
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000811';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw ground
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(0, this.canvas.height - 10, this.canvas.width, 10);
        
        // Draw missiles
        this.missiles.forEach(missile => {
            // Draw trail
            this.ctx.strokeStyle = missile.type === 'enemy' ? 'rgba(255, 100, 100, 0.5)' : 'rgba(0, 255, 0, 0.5)';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            missile.trail.forEach((point, i) => {
                if (i === 0) {
                    this.ctx.moveTo(point.x, point.y);
                } else {
                    this.ctx.lineTo(point.x, point.y);
                }
            });
            this.ctx.stroke();
            
            // Draw missile
            this.ctx.fillStyle = missile.type === 'enemy' ? '#ff6666' : '#00ff00';
            this.ctx.fillRect(missile.x - 2, missile.y - 2, 4, 4);
        });
        
        // Draw explosions
        this.explosions.forEach(explosion => {
            this.ctx.strokeStyle = `rgba(0, 255, 0, ${explosion.alpha})`;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
            this.ctx.stroke();
        });
        
        // Draw crosshair at mouse position (if available)
        this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
        this.ctx.lineWidth = 1;
    }
    
    updateUI() {
        const scoreElement = document.getElementById('atomic-score');
        const destroyedElement = document.getElementById('missiles-destroyed');
        if (scoreElement) scoreElement.textContent = this.score;
        if (destroyedElement) destroyedElement.textContent = this.missilesDestroyed;
    }
}

// Global instance for the game
const atomicGame = new AtomicCommand();

// Export game info for Pipboy interface
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { gameInfo, AtomicCommand };
}
