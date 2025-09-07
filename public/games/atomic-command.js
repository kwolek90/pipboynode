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
        this.level = 1;
        this.enemyMissiles = [];
        this.playerMissiles = [];
        this.explosions = [];
        this.cities = [];
        this.launcher = { 
            x: 0, y: 0, 
            angle: 0, 
            targetAngle: 0, 
            rotationSpeed: 0.1,
            missileCount: 10,
            maxMissiles: 10
        };
        this.keys = {};
        this.lastShot = 0;
        this.shotCooldown = 300;
        this.gameOver = false;
        this.win = false;
        this.missilesSpawned = 0;
        this.missilesToSpawn = 5;
        this.spawnTimer = 0;
        this.spawnInterval = 2000;
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
                <div style="margin-top: 10px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                    <div>SCORE: <span id="atomic-score">0</span></div>
                    <div>LEVEL: <span id="atomic-level">1</span></div>
                    <div>MISSILES: <span id="missile-count">10</span></div>
                    <div>CITIES: <span id="cities-left">6</span></div>
                </div>
                <div style="font-size: 0.8em; margin-top: 10px; opacity: 0.7;">
                    Use A/D keys to aim launcher, SPACE to fire
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
        document.addEventListener('keydown', (e) => {
            if (this.gameRunning && !this.gameOver) {
                this.keys[e.key.toLowerCase()] = true;
                
                if (e.key === ' ') {
                    e.preventDefault();
                    this.fireMissile();
                }
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }
    
    start() {
        this.gameRunning = true;
        this.gameOver = false;
        this.win = false;
        this.score = 0;
        this.level = 1;
        this.enemyMissiles = [];
        this.playerMissiles = [];
        this.explosions = [];
        this.missilesSpawned = 0;
        this.missilesToSpawn = 5;
        this.spawnTimer = 0;
        this.lastShot = 0;
        
        // Initialize launcher position
        this.launcher.x = this.canvas.width / 2;
        this.launcher.y = this.canvas.height - 30;
        this.launcher.angle = 0;
        this.launcher.targetAngle = 0;
        this.launcher.missileCount = this.launcher.maxMissiles;
        
        // Initialize cities
        this.initCities();
        
        this.updateUI();
        this.gameLoop();
    }
    
    initCities() {
        this.cities = [];
        const cityWidth = 30;
        const citySpacing = (this.canvas.width - 6 * cityWidth) / 7;
        const cityY = this.canvas.height - 50;
        
        for (let i = 0; i < 6; i++) {
            this.cities.push({
                x: citySpacing + i * (cityWidth + citySpacing),
                y: cityY,
                width: cityWidth,
                height: 30,
                destroyed: false
            });
        }
    }
    
    stop() {
        this.gameRunning = false;
    }
    
    spawnEnemyMissile() {
        if (!this.gameRunning || this.gameOver) return;
        
        // Choose a random city as target
        const availableCities = this.cities.filter(city => !city.destroyed);
        if (availableCities.length === 0) return;
        
        const targetCity = availableCities[Math.floor(Math.random() * availableCities.length)];
        
        this.enemyMissiles.push({
            x: Math.random() * this.canvas.width,
            y: 0,
            targetX: targetCity.x + targetCity.width / 2,
            targetY: targetCity.y + targetCity.height / 2,
            speed: 1 + Math.random() * 0.5,
            trail: []
        });
        
        this.missilesSpawned++;
    }
    
    fireMissile() {
        const now = Date.now();
        if (now - this.lastShot < this.shotCooldown || this.launcher.missileCount <= 0) return;
        
        this.lastShot = now;
        this.launcher.missileCount--;
        
        // Calculate missile start position from barrel tip
        const barrelLength = 20;
        // The barrel points upward from the launcher, so we need to calculate the tip position
        // The launcher angle is the rotation of the barrel, so the tip is at that angle from vertical
        const startX = this.launcher.x + Math.sin(this.launcher.angle) * barrelLength;
        const startY = this.launcher.y - Math.cos(this.launcher.angle) * barrelLength;
        
        // Missile direction needs to be converted from launcher angle to movement direction
        // The launcher angle is the barrel direction, but missile movement needs different calculation
        const missileAngle = this.launcher.angle - Math.PI / 2;
        
        this.playerMissiles.push({
            x: startX,
            y: startY,
            angle: missileAngle,
            speed: 4,
            trail: []
        });
        
        this.updateUI();
    }
    
    gameLoop() {
        if (!this.gameRunning) return;
        
        this.update();
        this.draw();
        
        setTimeout(() => this.gameLoop(), 50);
    }
    
    update() {
        if (this.gameOver) return;
        
        // Handle launcher rotation
        if (this.keys['a']) {
            this.launcher.targetAngle = Math.max(-Math.PI/2, this.launcher.targetAngle - 0.05);
        }
        if (this.keys['d']) {
            this.launcher.targetAngle = Math.min(Math.PI/2, this.launcher.targetAngle + 0.05);
        }
        
        // Smooth launcher rotation
        const angleDiff = this.launcher.targetAngle - this.launcher.angle;
        this.launcher.angle += angleDiff * this.launcher.rotationSpeed;
        
        // Spawn enemy missiles
        this.spawnTimer += 16; // Assuming 60 FPS
        if (this.missilesSpawned < this.missilesToSpawn && this.spawnTimer >= this.spawnInterval) {
            this.spawnEnemyMissile();
            this.spawnTimer = 0;
        }
        
        // Update enemy missiles
        this.enemyMissiles = this.enemyMissiles.filter(missile => {
            // Add to trail
            missile.trail.push({ x: missile.x, y: missile.y });
            if (missile.trail.length > 15) {
                missile.trail.shift();
            }
            
            // Move missile towards target
            const dx = missile.targetX - missile.x;
            const dy = missile.targetY - missile.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < missile.speed) {
                // Missile reached target - check if it hit a city
                this.checkCityHit(missile.x, missile.y);
                this.explode(missile.x, missile.y);
                return false;
            }
            
            missile.x += (dx / distance) * missile.speed;
            missile.y += (dy / distance) * missile.speed;
            
            return missile.y >= 0 && missile.y <= this.canvas.height;
        });
        
        // Update player missiles
        this.playerMissiles = this.playerMissiles.filter(missile => {
            // Add to trail
            missile.trail.push({ x: missile.x, y: missile.y });
            if (missile.trail.length > 10) {
                missile.trail.shift();
            }
            
            // Move missile in direction
            missile.x += Math.cos(missile.angle) * missile.speed;
            missile.y += Math.sin(missile.angle) * missile.speed;
            
            // Check for hits with enemy missiles
            this.checkPlayerMissileHits(missile.x, missile.y);
            
            return missile.x >= 0 && missile.x <= this.canvas.width && 
                   missile.y >= 0 && missile.y <= this.canvas.height;
        });
        
        // Update explosions
        this.explosions = this.explosions.filter(explosion => {
            explosion.radius += 2;
            explosion.alpha -= 0.05;
            return explosion.alpha > 0;
        });
        
        // Check game over conditions
        this.checkGameOver();
    }
    
    explode(x, y) {
        this.explosions.push({
            x: x,
            y: y,
            radius: 0,
            alpha: 1.0
        });
    }
    
    checkPlayerMissileHits(x, y) {
        const hitRadius = 20;
        this.enemyMissiles = this.enemyMissiles.filter(missile => {
            const distance = Math.sqrt((missile.x - x) ** 2 + (missile.y - y) ** 2);
            if (distance < hitRadius) {
                this.score += 100;
                this.explode(missile.x, missile.y);
                this.updateUI();
                return false;
            }
            return true;
        });
    }
    
    checkCityHit(x, y) {
        this.cities.forEach(city => {
            if (!city.destroyed && 
                x >= city.x && x <= city.x + city.width &&
                y >= city.y && y <= city.y + city.height) {
                city.destroyed = true;
                this.explode(x, y);
                this.updateUI();
            }
        });
    }
    
    checkGameOver() {
        const citiesLeft = this.cities.filter(city => !city.destroyed).length;
        const enemyMissilesLeft = this.enemyMissiles.length;
        const missilesSpawned = this.missilesSpawned;
        
        if (citiesLeft === 0) {
            this.gameOver = true;
            this.win = false;
        } else if (enemyMissilesLeft === 0 && missilesSpawned >= this.missilesToSpawn) {
            // Level complete
            this.nextLevel();
        }
    }
    
    nextLevel() {
        this.level++;
        this.missilesSpawned = 0;
        this.missilesToSpawn = 5 + this.level * 2; // More missiles each level
        this.spawnInterval = Math.max(1000, 2000 - this.level * 100); // Faster spawning
        this.launcher.missileCount = this.launcher.maxMissiles; // Refill missiles
        this.enemyMissiles = [];
        this.playerMissiles = [];
        this.updateUI();
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000811';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw ground
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(0, this.canvas.height - 10, this.canvas.width, 10);
        
        // Draw cities
        this.cities.forEach(city => {
            if (!city.destroyed) {
                this.ctx.fillStyle = '#00ff00';
                this.ctx.fillRect(city.x, city.y, city.width, city.height);
                
                // City details
                this.ctx.fillStyle = '#001100';
                this.ctx.fillRect(city.x + 2, city.y + 2, city.width - 4, city.height - 4);
                
                // City windows
                this.ctx.fillStyle = '#00ff00';
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 2; j++) {
                        this.ctx.fillRect(city.x + 5 + i * 8, city.y + 5 + j * 8, 3, 3);
                    }
                }
            } else {
                // Destroyed city
                this.ctx.fillStyle = '#666666';
                this.ctx.fillRect(city.x, city.y, city.width, city.height);
            }
        });
        
        // Draw launcher
        this.ctx.save();
        this.ctx.translate(this.launcher.x, this.launcher.y);
        this.ctx.rotate(this.launcher.angle);
        
        // Launcher base
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(-15, -5, 30, 10);
        
        // Launcher barrel
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(-2, -15, 4, 20);
        
        this.ctx.restore();
        
        // Draw remaining missiles under launcher
        this.drawMissileIcons();
        
        // Draw enemy missiles
        this.enemyMissiles.forEach(missile => {
            // Draw trail
            this.ctx.strokeStyle = 'rgba(255, 100, 100, 0.5)';
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
            this.ctx.fillStyle = '#ff6666';
            this.ctx.fillRect(missile.x - 2, missile.y - 2, 4, 4);
        });
        
        // Draw player missiles
        this.playerMissiles.forEach(missile => {
            // Draw trail
            this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
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
            this.ctx.fillStyle = '#00ff00';
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
        
        // Draw game over screen
        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = this.win ? '#00ff00' : '#ff6666';
            this.ctx.font = 'bold 24px Courier Prime';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(this.win ? 'LEVEL COMPLETE!' : 'GAME OVER', this.canvas.width / 2, this.canvas.height / 2);
            
            this.ctx.font = '16px Courier Prime';
            this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 30);
            this.ctx.fillText(`Level: ${this.level}`, this.canvas.width / 2, this.canvas.height / 2 + 50);
        }
    }
    
    drawMissileIcons() {
        const iconSize = 8;
        const iconSpacing = 12;
        const startX = this.launcher.x - (this.launcher.maxMissiles * iconSpacing) / 2;
        const iconY = this.launcher.y + 20;
        
        for (let i = 0; i < this.launcher.maxMissiles; i++) {
            const iconX = startX + i * iconSpacing;
            
            if (i < this.launcher.missileCount) {
                // Draw available missile icon
                this.ctx.fillStyle = '#00ff00';
                this.ctx.fillRect(iconX, iconY, iconSize, iconSize);
                
                // Draw missile details
                this.ctx.fillStyle = '#001100';
                this.ctx.fillRect(iconX + 1, iconY + 1, iconSize - 2, iconSize - 2);
                
                // Draw missile tip
                this.ctx.fillStyle = '#00ff00';
                this.ctx.fillRect(iconX + 2, iconY + 2, iconSize - 4, 2);
            } else {
                // Draw empty missile slot
                this.ctx.strokeStyle = '#666666';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(iconX, iconY, iconSize, iconSize);
            }
        }
    }
    
    updateUI() {
        const scoreElement = document.getElementById('atomic-score');
        const levelElement = document.getElementById('atomic-level');
        const missileCountElement = document.getElementById('missile-count');
        const citiesLeftElement = document.getElementById('cities-left');
        
        if (scoreElement) scoreElement.textContent = this.score;
        if (levelElement) levelElement.textContent = this.level;
        if (missileCountElement) missileCountElement.textContent = this.launcher.missileCount;
        if (citiesLeftElement) {
            const citiesLeft = this.cities.filter(city => !city.destroyed).length;
            citiesLeftElement.textContent = citiesLeft;
        }
    }
}

// Global instance for the game
const atomicGame = new AtomicCommand();

// Export game info for Pipboy interface
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { gameInfo, AtomicCommand };
}
