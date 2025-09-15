// Wasteland Pong - Classic Pong Game
console.log('[PONG] Script loading...');

const gameInfo = {
    name: "WASTELAND PONG",
    description: "Classic paddle game for the wasteland",
    version: "v1.0.0",
    author: "VAULT-TEC ENTERTAINMENT",
    classification: "ARCADE/CLASSIC",
    status: "OPERATIONAL"
};

class WastelandPong {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gameRunning = false;
        this.ball = { x: 300, y: 200, vx: 4, vy: 3 };
        this.paddle1 = { x: 20, y: 150, height: 80, score: 0 };
        this.paddle2 = { x: 560, y: 150, height: 80, score: 0 };
        this.keys = {};
        this.initialized = false;
    }
    
    init(containerId) {
        console.log('[PONG] Initializing...');
        
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                throw new Error(`Container ${containerId} not found`);
            }
            
            container.innerHTML = `
                <div style="text-align: center; color: #00ff00; font-family: 'Courier New', monospace;">
                    <h3 style="text-shadow: 0 0 10px #00ff00;">${gameInfo.name}</h3>
                    <p style="font-size: 0.9em; opacity: 0.8;">${gameInfo.description}</p>
                    <canvas id="pong-canvas" width="600" height="400" 
                            style="border: 2px solid #00ff00; background: #001100;"></canvas>
                    <div style="margin-top: 10px;">
                        <button onclick="pongGame.start()" 
                                style="background: transparent; border: 2px solid #00ff00; color: #00ff00; 
                                       padding: 10px 20px; margin: 5px; cursor: pointer;">
                            START GAME
                        </button>
                        <button onclick="pongGame.stop()" 
                                style="background: transparent; border: 2px solid #00ff00; color: #00ff00; 
                                       padding: 10px 20px; margin: 5px; cursor: pointer;">
                            STOP
                        </button>
                    </div>
                    <div style="margin-top: 10px; font-size: 1.2em;">
                        PLAYER 1: <span id="pong-score1">0</span> | 
                        PLAYER 2: <span id="pong-score2">0</span>
                    </div>
                    <div style="font-size: 0.8em; margin-top: 10px; opacity: 0.7;">
                        Player 1: W/S keys | Player 2: ↑/↓ arrows | Space: Pause
                    </div>
                </div>
            `;
            
            this.canvas = document.getElementById('pong-canvas');
            this.ctx = this.canvas.getContext('2d');
            
            // Setup keyboard controls
            this.setupControls();
            
            // Draw initial state
            this.draw();
            
            this.initialized = true;
            console.log('[PONG] Initialization complete');
            
        } catch (error) {
            console.error('[PONG] Init error:', error);
            throw error;
        }
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (e.key === ' ' && this.gameRunning) {
                e.preventDefault();
                this.togglePause();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }
    
    start() {
        if (this.gameRunning) return;
        
        console.log('[PONG] Starting game...');
        this.gameRunning = true;
        this.ball = { x: 300, y: 200, vx: 4, vy: 3 };
        this.gameLoop();
    }
    
    stop() {
        console.log('[PONG] Stopping game...');
        this.gameRunning = false;
    }
    
    togglePause() {
        this.paused = !this.paused;
    }
    
    gameLoop() {
        if (!this.gameRunning) return;
        if (!this.paused) {
            this.update();
        }
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        // Move paddles
        if (this.keys['w'] && this.paddle1.y > 0) {
            this.paddle1.y -= 5;
        }
        if (this.keys['s'] && this.paddle1.y < this.canvas.height - this.paddle1.height) {
            this.paddle1.y += 5;
        }
        if (this.keys['ArrowUp'] && this.paddle2.y > 0) {
            this.paddle2.y -= 5;
        }
        if (this.keys['ArrowDown'] && this.paddle2.y < this.canvas.height - this.paddle2.height) {
            this.paddle2.y += 5;
        }
        
        // Move ball
        this.ball.x += this.ball.vx;
        this.ball.y += this.ball.vy;
        
        // Ball collision with walls
        if (this.ball.y <= 5 || this.ball.y >= this.canvas.height - 5) {
            this.ball.vy = -this.ball.vy;
        }
        
        // Ball collision with paddles
        if (this.ball.x <= 30 && this.ball.x >= 20 &&
            this.ball.y >= this.paddle1.y && this.ball.y <= this.paddle1.y + this.paddle1.height) {
            this.ball.vx = -this.ball.vx;
            this.ball.x = 30;
        }
        
        if (this.ball.x >= 570 && this.ball.x <= 580 &&
            this.ball.y >= this.paddle2.y && this.ball.y <= this.paddle2.y + this.paddle2.height) {
            this.ball.vx = -this.ball.vx;
            this.ball.x = 570;
        }
        
        // Scoring
        if (this.ball.x < 0) {
            this.paddle2.score++;
            this.updateScore();
            this.resetBall();
        }
        if (this.ball.x > this.canvas.width) {
            this.paddle1.score++;
            this.updateScore();
            this.resetBall();
        }
    }
    
    resetBall() {
        this.ball.x = 300;
        this.ball.y = 200;
        this.ball.vx = (Math.random() > 0.5 ? 1 : -1) * 4;
        this.ball.vy = (Math.random() - 0.5) * 6;
    }
    
    draw() {
        if (!this.ctx) return;
        
        // Clear canvas
        this.ctx.fillStyle = '#001100';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw center line
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.setLineDash([10, 10]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // Draw paddles
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(this.paddle1.x, this.paddle1.y, 10, this.paddle1.height);
        this.ctx.fillRect(this.paddle2.x, this.paddle2.y, 10, this.paddle2.height);
        
        // Draw ball
        this.ctx.fillRect(this.ball.x - 5, this.ball.y - 5, 10, 10);
        
        // Draw pause indicator
        if (this.paused) {
            this.ctx.font = 'bold 48px Courier New';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
        }
    }
    
    updateScore() {
        document.getElementById('pong-score1').textContent = this.paddle1.score;
        document.getElementById('pong-score2').textContent = this.paddle2.score;
    }
}

// Create global instance
const pongGame = new WastelandPong();

// Make it globally accessible
if (typeof window !== 'undefined') {
    window.pongGame = pongGame;
}

console.log('[PONG] Script loaded');
