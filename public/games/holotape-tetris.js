// Holotape Tetris - A Fallout-styled Tetris game
// Game metadata for Pipboy interface
const gameInfo = {
    name: "HOLOTAPE TETRIS",
    description: "Classic block-stacking game found on a Vault-Tec holotape",
    version: "v1.2.1",
    author: "VAULT-TEC ENTERTAINMENT",
    classification: "PUZZLE/ARCADE",
    status: "OPERATIONAL"
};

// Simple Tetris-like game implementation
class HolotapeTetris {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gameRunning = false;
        this.score = 0;
    }
    
    init(containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = `
            <div style="text-align: center; color: #00ff00; font-family: 'Courier Prime', monospace;">
                <h3>${gameInfo.name}</h3>
                <p>${gameInfo.description}</p>
                <canvas id="tetris-canvas" width="300" height="400" style="border: 2px solid #00ff00; background: #001100;"></canvas>
                <div style="margin-top: 10px;">
                    <button onclick="tetrisGame.start()" style="background: transparent; border: 2px solid #00ff00; color: #00ff00; padding: 10px; margin: 5px; cursor: pointer;">START GAME</button>
                    <button onclick="tetrisGame.stop()" style="background: transparent; border: 2px solid #00ff00; color: #00ff00; padding: 10px; margin: 5px; cursor: pointer;">STOP</button>
                </div>
                <div style="margin-top: 10px;">SCORE: <span id="tetris-score">0</span></div>
                <div style="font-size: 0.8em; margin-top: 10px; opacity: 0.7;">
                    Use ARROW KEYS to control blocks
                </div>
            </div>
        `;
        
        this.canvas = document.getElementById('tetris-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupControls();
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (this.gameRunning) {
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        // Move left logic would go here
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        // Move right logic would go here
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        // Soft drop logic would go here
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        // Rotate logic would go here
                        break;
                }
            }
        });
    }
    
    start() {
        this.gameRunning = true;
        this.score = 0;
        this.updateScore();
        this.gameLoop();
    }
    
    stop() {
        this.gameRunning = false;
    }
    
    gameLoop() {
        if (!this.gameRunning) return;
        
        this.draw();
        this.score += 1;
        this.updateScore();
        
        setTimeout(() => this.gameLoop(), 100);
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#001100';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw simple falling block animation
        this.ctx.fillStyle = '#00ff00';
        const y = (Date.now() / 10) % this.canvas.height;
        this.ctx.fillRect(140, y, 20, 20);
        
        // Draw grid lines
        this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.2)';
        this.ctx.lineWidth = 1;
        for (let x = 0; x < this.canvas.width; x += 20) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y < this.canvas.height; y += 20) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    updateScore() {
        const scoreElement = document.getElementById('tetris-score');
        if (scoreElement) {
            scoreElement.textContent = this.score;
        }
    }
}

// Global instance for the game
const tetrisGame = new HolotapeTetris();

// Export game info for Pipboy interface
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { gameInfo, HolotapeTetris };
}
