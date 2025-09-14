// Wasteland Pong - A post-apocalyptic version of classic Pong
// Game metadata for Pipboy interface
const gameInfo = {
    name: "WASTELAND PONG",
    description: "Classic paddle game with radioactive twist",
    version: "v1.0.7",
    author: "VAULT-TEC RECREATION",
    classification: "ARCADE/SPORTS",
    status: "OPERATIONAL"
};

// Wasteland Pong game implementation
class WastelandPong {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gameRunning = false;
        this.score = { player: 0, ai: 0 };
        this.ball = { x: 200, y: 150, dx: 3, dy: 3, size: 8 };
        this.playerPaddle = { x: 20, y: 120, width: 10, height: 60, speed: 5 };
        this.aiPaddle = { x: 370, y: 120, width: 10, height: 60, speed: 3 };
        this.keys = {};
        this.particles = [];
    }
    
    init(containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = `
            <div style="text-align: center; color: #00ff00; font-family: 'Courier Prime', monospace;">
                <h3>${gameInfo.name}</h3>
                <p>${gameInfo.description}</p>
                <canvas id="pong-canvas" width="400" height="300" style="border: 2px solid #00ff00; background: #001100;"></canvas>
                <div style="margin-top: 10px;">
                    <button onclick="pongGame.start()" style="background: transparent; border: 2px solid #00ff00; color: #00ff00; padding: 10px; margin: 5px; cursor: pointer;">START MATCH</button>
                    <button onclick="pongGame.stop()" style="background: transparent; border: 2px solid #00ff00; color: #00ff00; padding: 10px; margin: 5px; cursor: pointer;">END MATCH</button>
                </div>
                <div style="margin-top: 10px; display: flex; justify-content: center; gap: 50px;">
                    <div>PLAYER: <span id="player-score">0</span></div>
                    <div>A.I.: <span id="ai-score">0</span></div>
                </div>
                <div style="font-size: 0.8em; margin-top: 10px; opacity: 0.7;">
                    Use W/S keys to control your paddle
                </div>
            </div>
        `;
        
        this.canvas = document.getElementById('pong-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupControls();
        this.resetGame();
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }
    
    start() {
        this.gameRunning = true;
        this.gameLoop();
    }
    
    stop() {
        this.gameRunning = false;
    }
    
    resetGame() {
        this.score = { player: 0, ai: 0 };
        this.resetBall();
        this.updateScore();
    }
    
    resetBall() {
        this.ball = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            dx: (Math.random() > 0.5 ? 3 : -3),
            dy: (Math.random() - 0.5) * 4,
            size: 8
        };
    }
    
    gameLoop() {
        if (!this.gameRunning) return;
        
        this.update();
        this.draw();
        
        setTimeout(() => this.gameLoop(), 16); // ~60 FPS
    }
    
    update() {
        // Player paddle movement
        if (this.keys['w'] && this.playerPaddle.y > 0) {
            this.playerPaddle.y -= this.playerPaddle.speed;
        }
        if (this.keys['s'] && this.playerPaddle.y < this.canvas.height - this.playerPaddle.height) {
            this.playerPaddle.y += this.playerPaddle.speed;
        }
        
        // AI paddle movement (simple following AI)
        const aiCenter = this.aiPaddle.y + this.aiPaddle.height / 2;
        const ballY = this.ball.y;
        
        if (aiCenter < ballY - 10 && this.aiPaddle.y < this.canvas.height - this.aiPaddle.height) {
            this.aiPaddle.y += this.aiPaddle.speed;
        } else if (aiCenter > ballY + 10 && this.aiPaddle.y > 0) {
            this.aiPaddle.y -= this.aiPaddle.speed;
        }
        
        // Ball movement
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
        
        // Ball collision with top/bottom walls
        if (this.ball.y <= this.ball.size || this.ball.y >= this.canvas.height - this.ball.size) {
            this.ball.dy = -this.ball.dy;
            this.createParticles(this.ball.x, this.ball.y);
        }
        
        // Ball collision with paddles
        if (this.ballHitsPaddle(this.playerPaddle) || this.ballHitsPaddle(this.aiPaddle)) {
            this.ball.dx = -this.ball.dx;
            // Add some variation to ball direction
            this.ball.dy += (Math.random() - 0.5) * 2;
            this.createParticles(this.ball.x, this.ball.y);
        }
        
        // Ball goes off screen (scoring)
        if (this.ball.x < 0) {
            this.score.ai++;
            this.updateScore();
            this.resetBall();
        } else if (this.ball.x > this.canvas.width) {
            this.score.player++;
            this.updateScore();
            this.resetBall();
        }
        
        // Update particles
        this.particles = this.particles.filter(particle => {
            particle.x += particle.dx;
            particle.y += particle.dy;
            particle.life--;
            return particle.life > 0;
        });
    }
    
    ballHitsPaddle(paddle) {
        return this.ball.x - this.ball.size < paddle.x + paddle.width &&
               this.ball.x + this.ball.size > paddle.x &&
               this.ball.y - this.ball.size < paddle.y + paddle.height &&
               this.ball.y + this.ball.size > paddle.y;
    }
    
    createParticles(x, y) {
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: x,
                y: y,
                dx: (Math.random() - 0.5) * 4,
                dy: (Math.random() - 0.5) * 4,
                life: 20
            });
        }
    }
    
    draw() {
        // Clear canvas with slight trail effect
        this.ctx.fillStyle = 'rgba(0, 8, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw center line
        this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([10, 10]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // Draw paddles
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(this.playerPaddle.x, this.playerPaddle.y, this.playerPaddle.width, this.playerPaddle.height);
        this.ctx.fillRect(this.aiPaddle.x, this.aiPaddle.y, this.aiPaddle.width, this.aiPaddle.height);
        
        // Draw ball with glow effect
        this.ctx.shadowColor = '#00ff00';
        this.ctx.shadowBlur = 10;
        this.ctx.fillStyle = '#00ff00';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        
        // Draw particles
        this.ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    updateScore() {
        const playerElement = document.getElementById('player-score');
        const aiElement = document.getElementById('ai-score');
        if (playerElement) playerElement.textContent = this.score.player;
        if (aiElement) aiElement.textContent = this.score.ai;
    }
}

// Global instance for the game
const pongGame = new WastelandPong();

// Export game info for Pipboy interface
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { gameInfo, WastelandPong };
}
