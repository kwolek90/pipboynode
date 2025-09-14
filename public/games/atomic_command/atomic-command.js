// Atomic Command - Missile Defense Game
console.log('[ATOMIC COMMAND] Script loading...');

// Game metadata for Pipboy interface
const gameInfo = {
    name: "ATOMIC COMMAND",
    description: "Defend your cities from nuclear missiles",
    version: "v2.0.0",
    author: "ROBCO INDUSTRIES",
    classification: "STRATEGY/DEFENSE",
    status: "OPERATIONAL"
};

class AtomicCommand {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gameRunning = false;
        this.score = 0;
        this.cities = [];
        this.missiles = [];
        this.explosions = [];
        this.initialized = false;
    }
    
    init(containerId) {
        console.log('[ATOMIC COMMAND] Initializing...');
        
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                throw new Error(`Container ${containerId} not found`);
            }
            
            // Build game HTML
            container.innerHTML = `
                <div style="text-align: center; color: #00ff00; font-family: 'Courier New', monospace;">
                    <h3 style="text-shadow: 0 0 10px #00ff00;">${gameInfo.name}</h3>
                    <p style="font-size: 0.9em; opacity: 0.8;">${gameInfo.description}</p>
                    <canvas id="atomic-canvas" width="600" height="400" 
                            style="border: 2px solid #00ff00; background: #000033; cursor: crosshair;"></canvas>
                    <div style="margin-top: 10px;">
                        <button onclick="atomicGame.start()" 
                                style="background: transparent; border: 2px solid #00ff00; color: #00ff00; 
                                       padding: 10px 20px; margin: 5px; cursor: pointer;">
                            START DEFENSE
                        </button>
                        <button onclick="atomicGame.stop()" 
                                style="background: transparent; border: 2px solid #00ff00; color: #00ff00; 
                                       padding: 10px 20px; margin: 5px; cursor: pointer;">
                            CEASE FIRE
                        </button>
                    </div>
                    <div style="margin-top: 10px; font-size: 1.2em;">
                        SCORE: <span id="atomic-score">0</span> | 
                        CITIES: <span id="atomic-cities">6</span>
                    </div>
                    <div style="font-size: 0.8em; margin-top: 10px; opacity: 0.7;">
                        Click to fire anti-missile batteries at incoming threats
                    </div>
                </div>
            `;
            
            this.canvas = document.getElementById('atomic-canvas');
            this.ctx = this.canvas.getContext('2d');
            
            // Initialize cities
            this.initCities();
            
            // Setup mouse controls
            this.canvas.addEventListener('click', (e) => this.handleClick(e));
            
            // Draw initial state
            this.draw();
            
            this.initialized = true;
            console.log('[ATOMIC COMMAND] Initialization complete');
            
        } catch (error) {
            console.error('[ATOMIC COMMAND] Init error:', error);
            throw error;
        }
    }
    
    initCities() {
        this.cities = [];
        for (let i = 0; i < 6; i++) {
            this.cities.push({
                x: 100 * i + 50,
                y: this.canvas.height - 30,
                alive: true
            });
        }
    }
    
    handleClick(e) {
        if (!this.gameRunning) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Create explosion at click point
        this.explosions.push({
            x: x,
            y: y,
            radius: 0,
            maxRadius: 50,
            growing: true
        });
        
        // Play sound effect (visual feedback)
        this.canvas.style.filter = 'brightness(1.5)';
        setTimeout(() => {
            this.canvas.style.filter = 'brightness(1)';
        }, 100);
    }
    
    start() {
        if (this.gameRunning) return;
        
        console.log('[ATOMIC COMMAND] Starting game...');
        this.gameRunning = true;
        this.score = 0;
        this.missiles = [];
        this.explosions = [];
        this.initCities();
        this.gameLoop();
        this.spawnMissiles();
    }
    
    stop() {
        console.log('[ATOMIC COMMAND] Stopping game...');
        this.gameRunning = false;
    }
    
    spawnMissiles() {
        if (!this.gameRunning) return;
        
        // Spawn a new missile
        this.missiles.push({
            x: Math.random() * this.canvas.width,
            y: 0,
            vx: (Math.random() - 0.5) * 2,
            vy: 1 + Math.random(),
            trail: []
        });
        
        // Schedule next missile
        setTimeout(() => this.spawnMissiles(), 2000 + Math.random() * 3000);
    }
    
    gameLoop() {
        if (!this.gameRunning) return;
        
        this.update();
        this.draw();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        // Update missiles
        for (let i = this.missiles.length - 1; i >= 0; i--) {
            const missile = this.missiles[i];
            
            // Add to trail
            missile.trail.push({ x: missile.x, y: missile.y });
            if (missile.trail.length > 20) {
                missile.trail.shift();
            }
            
            // Move missile
            missile.x += missile.vx;
            missile.y += missile.vy;
            
            // Check if missile hit ground
            if (missile.y >= this.canvas.height - 30) {
                // Check if hit a city
                for (let city of this.cities) {
                    if (city.alive && Math.abs(missile.x - city.x) < 30) {
                        city.alive = false;
                        this.explosions.push({
                            x: city.x,
                            y: city.y,
                            radius: 0,
                            maxRadius: 60,
                            growing: true
                        });
                    }
                }
                this.missiles.splice(i, 1);
            }
            
            // Check collision with explosions
            for (let explosion of this.explosions) {
                const dist = Math.sqrt(
                    Math.pow(missile.x - explosion.x, 2) + 
                    Math.pow(missile.y - explosion.y, 2)
                );
                if (dist < explosion.radius) {
                    this.missiles.splice(i, 1);
                    this.score += 10;
                    this.updateScore();
                    break;
                }
            }
        }
        
        // Update explosions
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            const explosion = this.explosions[i];
            if (explosion.growing) {
                explosion.radius += 3;
                if (explosion.radius >= explosion.maxRadius) {
                    explosion.growing = false;
                }
            } else {
                explosion.radius -= 2;
                if (explosion.radius <= 0) {
                    this.explosions.splice(i, 1);
                }
            }
        }
        
        // Check game over
        const aliveCities = this.cities.filter(c => c.alive).length;
        document.getElementById('atomic-cities').textContent = aliveCities;
        if (aliveCities === 0 && this.gameRunning) {
            this.gameOver();
        }
    }
    
    draw() {
        if (!this.ctx) return;
        
        // Clear canvas
        this.ctx.fillStyle = '#000033';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw cities
        this.ctx.fillStyle = '#00ff00';
        for (let city of this.cities) {
            if (city.alive) {
                this.ctx.fillRect(city.x - 15, city.y - 20, 30, 20);
                this.ctx.fillRect(city.x - 5, city.y - 30, 10, 10);
            }
        }
        
        // Draw ground
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height - 30);
        this.ctx.lineTo(this.canvas.width, this.canvas.height - 30);
        this.ctx.stroke();
        
        // Draw missiles
        this.ctx.strokeStyle = '#ff0000';
        this.ctx.fillStyle = '#ff0000';
        for (let missile of this.missiles) {
            // Draw trail
            this.ctx.beginPath();
            if (missile.trail.length > 0) {
                this.ctx.moveTo(missile.trail[0].x, missile.trail[0].y);
                for (let point of missile.trail) {
                    this.ctx.lineTo(point.x, point.y);
                }
            }
            this.ctx.lineTo(missile.x, missile.y);
            this.ctx.stroke();
            
            // Draw missile head
            this.ctx.fillRect(missile.x - 2, missile.y - 2, 4, 4);
        }
        
        // Draw explosions
        for (let explosion of this.explosions) {
            const gradient = this.ctx.createRadialGradient(
                explosion.x, explosion.y, 0,
                explosion.x, explosion.y, explosion.radius
            );
            gradient.addColorStop(0, 'rgba(255, 255, 0, 0.8)');
            gradient.addColorStop(0.5, 'rgba(255, 128, 0, 0.5)');
            gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    updateScore() {
        const scoreElement = document.getElementById('atomic-score');
        if (scoreElement) {
            scoreElement.textContent = this.score;
        }
    }
    
    gameOver() {
        this.gameRunning = false;
        this.ctx.fillStyle = '#ff0000';
        this.ctx.font = 'bold 48px Courier New';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.font = '24px Courier New';
        this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 40);
    }
}

// Create global instance
const atomicGame = new AtomicCommand();

// Make it globally accessible
if (typeof window !== 'undefined') {
    window.atomicGame = atomicGame;
}

console.log('[ATOMIC COMMAND] Script loaded');
