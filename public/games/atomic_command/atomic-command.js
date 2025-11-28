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
        this.batteries = [];
        this.playerMissiles = [];
        this.enemyMissiles = [];
        this.explosions = [];
        this.initialized = false;
        this.cursor = { x: 300, y: 200 };
        this.selectedBattery = 0; // 0: left, 1: center, 2: right
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
                            style="border: 2px solid #00ff00; background: #000033;"></canvas>
                    <div style="margin-top: 10px; font-size: 1.2em;">
                        SCORE: <span id="atomic-score">0</span> | 
                        CITIES: <span id="atomic-cities">4</span> | 
                        AMMO: <span id="atomic-ammo">10/10/10</span>
                    </div>
                </div>
            `;

            this.canvas = document.getElementById('atomic-canvas');
            this.ctx = this.canvas.getContext('2d');

            // Initialize cities and batteries
            this.initCities();
            this.initBatteries();

            // Setup keyboard controls
            this.setupKeyboardControls();

            // Draw initial state
            this.draw();

            this.initialized = true;
            console.log('[ATOMIC COMMAND] Initialization complete');

        } catch (error) {
            console.error('[ATOMIC COMMAND] Init error:', error);
            throw error;
        }
    }

    setupKeyboardControls() {
        // Mouse click to fire
        this.canvas.addEventListener('click', (e) => {
            if (!this.gameRunning) return;
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.fireMissile(x, y);
        });

        window.addEventListener('keydown', (e) => {
            switch (e.key) {
                case '1':
                    if (this.gameRunning) this.selectedBattery = 0;
                    break;
                case '2':
                    if (this.gameRunning) this.selectedBattery = 1;
                    break;
                case '3':
                    if (this.gameRunning) this.selectedBattery = 2;
                    break;
                case 'r': // R to restart
                    this.start();
                    break;
                case 'Escape':
                    if (window.parent && window.parent.stopCurrentGame) {
                        window.parent.stopCurrentGame();
                    }
                    break;
            }
        });
    }

    fireMissile(x, y) {
        const battery = this.batteries[this.selectedBattery];
        if (!battery.alive || battery.ammo <= 0) return;

        battery.ammo--;
        this.updateAmmo();

        // Calculate direction
        const dx = x - battery.x;
        const dy = y - battery.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const speed = 5;
        const vx = (dx / dist) * speed;
        const vy = (dy / dist) * speed;

        this.playerMissiles.push({
            x: battery.x,
            y: battery.y,
            vx: vx,
            vy: vy,
            trail: [],
            targetX: x,
            targetY: y
        });
    }

    initCities() {
        this.cities = [];
        const batteryPositions = [100, 300, 500];
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                this.cities.push({
                    x: batteryPositions[i] + 50 + j * 50,
                    y: this.canvas.height - 30,
                    alive: true
                });
            }
        }
    }

    initBatteries() {
        this.batteries = [];
        const positions = [100, 300, 500];
        for (let i = 0; i < 3; i++) {
            this.batteries.push({
                x: positions[i],
                y: this.canvas.height - 30,
                ammo: 10,
                alive: true
            });
        }
    }

    start() {
        if (this.gameRunning) return;

        console.log('[ATOMIC COMMAND] Starting game...');
        this.gameRunning = true;
        this.score = 0;
        this.playerMissiles = [];
        this.enemyMissiles = [];
        this.explosions = [];
        this.initCities();
        this.initBatteries();
        this.updateAmmo();
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
        this.enemyMissiles.push({
            x: Math.random() * this.canvas.width,
            y: 0,
            vx: (Math.random() - 0.5) * 2,
            vy: 1 + Math.random(),
            trail: [],
            size: 1 // 1: normal, 0.5: small
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
        // Update player missiles
        for (let i = this.playerMissiles.length - 1; i >= 0; i--) {
            const missile = this.playerMissiles[i];
            missile.trail.push({ x: missile.x, y: missile.y });
            if (missile.trail.length > 10) missile.trail.shift();
            missile.x += missile.vx;
            missile.y += missile.vy;

            // Remove if off screen
            if (missile.x < 0 || missile.x > this.canvas.width || missile.y < 0 || missile.y > this.canvas.height) {
                this.playerMissiles.splice(i, 1);
            }
        }

        // Update enemy missiles
        for (let i = this.enemyMissiles.length - 1; i >= 0; i--) {
            const missile = this.enemyMissiles[i];
            missile.trail.push({ x: missile.x, y: missile.y });
            if (missile.trail.length > 20) missile.trail.shift();
            missile.x += missile.vx;
            missile.y += missile.vy;

            // Check if hit ground
            if (missile.y >= this.canvas.height - 30) {
                // Check if hit city
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
                this.enemyMissiles.splice(i, 1);
            }

            // Check collision with explosions
            for (let explosion of this.explosions) {
                const dist = Math.sqrt(Math.pow(missile.x - explosion.x, 2) + Math.pow(missile.y - explosion.y, 2));
                if (dist < explosion.radius) {
                    if (missile.size > 0.5) {
                        // Split into smaller missiles
                        this.enemyMissiles.push({
                            x: missile.x,
                            y: missile.y,
                            vx: missile.vx + 1,
                            vy: missile.vy,
                            trail: [],
                            size: 0.5
                        });
                        this.enemyMissiles.push({
                            x: missile.x,
                            y: missile.y,
                            vx: missile.vx - 1,
                            vy: missile.vy,
                            trail: [],
                            size: 0.5
                        });
                    }
                    this.enemyMissiles.splice(i, 1);
                    this.score += 10 * missile.size;
                    this.updateScore();
                    break;
                }
            }
        }

        // Check collisions between player missiles and enemy missiles
        for (let i = this.playerMissiles.length - 1; i >= 0; i--) {
            const pMissile = this.playerMissiles[i];
            for (let j = this.enemyMissiles.length - 1; j >= 0; j--) {
                const eMissile = this.enemyMissiles[j];
                const dist = Math.sqrt(Math.pow(pMissile.x - eMissile.x, 2) + Math.pow(pMissile.y - eMissile.y, 2));
                if (dist < 10) {
                    // Destroy enemy missile
                    this.enemyMissiles.splice(j, 1);
                    this.score += 10 * eMissile.size;
                    this.updateScore();
                    // Create explosion
                    this.explosions.push({
                        x: eMissile.x,
                        y: eMissile.y,
                        radius: 0,
                        maxRadius: 40,
                        growing: true
                    });
                    // Remove player missile
                    this.playerMissiles.splice(i, 1);
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

        // Draw batteries
        for (let i = 0; i < this.batteries.length; i++) {
            const battery = this.batteries[i];
            if (battery.alive) {
                this.ctx.fillStyle = i === this.selectedBattery ? '#ffff00' : '#00ff00';
                this.ctx.fillRect(battery.x - 10, battery.y - 10, 20, 10);
                this.ctx.fillStyle = '#00ff00';
                this.ctx.fillText(battery.ammo.toString(), battery.x - 5, battery.y - 15);
            }
        }

        // Draw ground
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height - 30);
        this.ctx.lineTo(this.canvas.width, this.canvas.height - 30);
        this.ctx.stroke();

        // Draw player missiles
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.fillStyle = '#00ff00';
        for (let missile of this.playerMissiles) {
            this.ctx.beginPath();
            if (missile.trail.length > 0) {
                this.ctx.moveTo(missile.trail[0].x, missile.trail[0].y);
                for (let point of missile.trail) {
                    this.ctx.lineTo(point.x, point.y);
                }
            }
            this.ctx.lineTo(missile.x, missile.y);
            this.ctx.stroke();
            this.ctx.fillRect(missile.x - 1, missile.y - 1, 2, 2);
        }

        // Draw enemy missiles
        this.ctx.strokeStyle = '#ff0000';
        this.ctx.fillStyle = '#ff0000';
        for (let missile of this.enemyMissiles) {
            this.ctx.beginPath();
            if (missile.trail.length > 0) {
                this.ctx.moveTo(missile.trail[0].x, missile.trail[0].y);
                for (let point of missile.trail) {
                    this.ctx.lineTo(point.x, point.y);
                }
            }
            this.ctx.lineTo(missile.x, missile.y);
            this.ctx.stroke();
            const size = missile.size * 4;
            this.ctx.fillRect(missile.x - size/2, missile.y - size/2, size, size);
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

    updateAmmo() {
        const ammoElement = document.getElementById('atomic-ammo');
        if (ammoElement) {
            ammoElement.textContent = this.batteries.map(b => b.ammo).join('/');
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
