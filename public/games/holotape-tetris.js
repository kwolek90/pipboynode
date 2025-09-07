// Holotape Tetris - A Fallout-styled Tetris game
console.log('[TETRIS] Script loading started...');

// Game metadata for Pipboy interface
const gameInfo = {
    name: "HOLOTAPE TETRIS",
    description: "Classic block-stacking game found on a Vault-Tec holotape",
    version: "v1.2.1",
    author: "VAULT-TEC ENTERTAINMENT",
    classification: "PUZZLE/ARCADE",
    status: "OPERATIONAL"
};

console.log('[TETRIS] Game info defined:', gameInfo);

// Simple Tetris-like game implementation
class HolotapeTetris {
    constructor() {
        console.log('[TETRIS] HolotapeTetris constructor called');
        this.canvas = null;
        this.ctx = null;
        this.gameRunning = false;
        this.score = 0;
        this.containerId = null;
        this.initialized = false;
        console.log('[TETRIS] Constructor completed, instance created');
    }
    
    init(containerId) {
        console.log('[TETRIS] init() called with containerId:', containerId);
        
        try {
            // Store container ID
            this.containerId = containerId;
            
            // Check if container exists
            const container = document.getElementById(containerId);
            console.log('[TETRIS] Container element found:', container ? 'YES' : 'NO');
            
            if (!container) {
                throw new Error(`Container with ID '${containerId}' not found`);
            }
            
            console.log('[TETRIS] Container dimensions:', {
                width: container.offsetWidth,
                height: container.offsetHeight,
                display: window.getComputedStyle(container).display
            });
            
            // Build HTML
            const html = `
                <div style="text-align: center; color: #00ff00; font-family: 'Courier Prime', monospace;">
                    <h3>${gameInfo.name}</h3>
                    <p>${gameInfo.description}</p>
                    <canvas id="tetris-canvas" width="300" height="400" style="border: 2px solid #00ff00; background: #001100;"></canvas>
                    <div style="margin-top: 10px;">
                        <button id="tetris-start-btn" style="background: transparent; border: 2px solid #00ff00; color: #00ff00; padding: 10px; margin: 5px; cursor: pointer;">START GAME</button>
                        <button id="tetris-stop-btn" style="background: transparent; border: 2px solid #00ff00; color: #00ff00; padding: 10px; margin: 5px; cursor: pointer;">STOP</button>
                    </div>
                    <div style="margin-top: 10px;">SCORE: <span id="tetris-score">0</span></div>
                    <div style="font-size: 0.8em; margin-top: 10px; opacity: 0.7;">
                        Use ARROW KEYS to control blocks
                    </div>
                </div>
            `;
            
            console.log('[TETRIS] Setting container innerHTML...');
            container.innerHTML = html;
            console.log('[TETRIS] HTML content set successfully');
            
            // Get canvas element
            this.canvas = document.getElementById('tetris-canvas');
            console.log('[TETRIS] Canvas element found:', this.canvas ? 'YES' : 'NO');
            
            if (!this.canvas) {
                throw new Error('Canvas element not found after HTML insertion');
            }
            
            // Get context
            this.ctx = this.canvas.getContext('2d');
            console.log('[TETRIS] Canvas context obtained:', this.ctx ? 'YES' : 'NO');
            
            if (!this.ctx) {
                throw new Error('Could not get 2D context from canvas');
            }
            
            // Setup button event listeners
            console.log('[TETRIS] Setting up button event listeners...');
            const startBtn = document.getElementById('tetris-start-btn');
            const stopBtn = document.getElementById('tetris-stop-btn');
            
            console.log('[TETRIS] Start button found:', startBtn ? 'YES' : 'NO');
            console.log('[TETRIS] Stop button found:', stopBtn ? 'YES' : 'NO');
            
            if (startBtn) {
                startBtn.onclick = () => {
                    console.log('[TETRIS] Start button clicked');
                    this.start();
                };
            }
            
            if (stopBtn) {
                stopBtn.onclick = () => {
                    console.log('[TETRIS] Stop button clicked');
                    this.stop();
                };
            }
            
            // Setup keyboard controls
            console.log('[TETRIS] Setting up keyboard controls...');
            this.setupControls();
            
            // Draw initial state
            console.log('[TETRIS] Drawing initial game state...');
            this.draw();
            
            // Mark as initialized
            this.initialized = true;
            console.log('[TETRIS] Initialization complete! Game ready.');
            
        } catch (error) {
            console.error('[TETRIS] Error during initialization:', error);
            console.error('[TETRIS] Error stack:', error.stack);
            
            // Try to show error in container
            try {
                const container = document.getElementById(containerId);
                if (container) {
                    container.innerHTML = `
                        <div style="text-align: center; color: #ff6666; padding: 20px;">
                            <h3>TETRIS INITIALIZATION ERROR</h3>
                            <p style="font-size: 0.9em;">${error.message}</p>
                            <p style="font-size: 0.8em; opacity: 0.7; margin-top: 10px;">Check console for details</p>
                        </div>
                    `;
                }
            } catch (displayError) {
                console.error('[TETRIS] Could not display error message:', displayError);
            }
            
            throw error;
        }
    }
    
    setupControls() {
        console.log('[TETRIS] setupControls() called');
        
        // Remove any existing listeners first
        if (this.keyHandler) {
            document.removeEventListener('keydown', this.keyHandler);
            console.log('[TETRIS] Removed existing key handler');
        }
        
        // Create new handler
        this.keyHandler = (e) => {
            if (this.gameRunning) {
                console.log('[TETRIS] Key pressed during game:', e.key);
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        console.log('[TETRIS] Move left');
                        // Move left logic would go here
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        console.log('[TETRIS] Move right');
                        // Move right logic would go here
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        console.log('[TETRIS] Soft drop');
                        // Soft drop logic would go here
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        console.log('[TETRIS] Rotate');
                        // Rotate logic would go here
                        break;
                }
            }
        };
        
        document.addEventListener('keydown', this.keyHandler);
        console.log('[TETRIS] Keyboard controls setup complete');
    }
    
    start() {
        console.log('[TETRIS] start() called');
        console.log('[TETRIS] Current state - initialized:', this.initialized, 'running:', this.gameRunning);
        
        if (!this.initialized) {
            console.error('[TETRIS] Cannot start - game not initialized');
            return;
        }
        
        if (this.gameRunning) {
            console.log('[TETRIS] Game already running');
            return;
        }
        
        this.gameRunning = true;
        this.score = 0;
        this.updateScore();
        console.log('[TETRIS] Game started, beginning game loop...');
        this.gameLoop();
    }
    
    stop() {
        console.log('[TETRIS] stop() called');
        console.log('[TETRIS] Was running:', this.gameRunning);
        this.gameRunning = false;
        
        // Clean up event listeners
        if (this.keyHandler) {
            document.removeEventListener('keydown', this.keyHandler);
            console.log('[TETRIS] Removed keyboard handler');
        }
        
        console.log('[TETRIS] Game stopped');
    }
    
    gameLoop() {
        if (!this.gameRunning) {
            console.log('[TETRIS] Game loop ended (game stopped)');
            return;
        }
        
        this.draw();
        this.score += 1;
        this.updateScore();
        
        setTimeout(() => this.gameLoop(), 100);
    }
    
    draw() {
        try {
            if (!this.ctx) {
                console.error('[TETRIS] Cannot draw - no context');
                return;
            }
            
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
        } catch (error) {
            console.error('[TETRIS] Error during draw:', error);
        }
    }
    
    updateScore() {
        const scoreElement = document.getElementById('tetris-score');
        if (scoreElement) {
            scoreElement.textContent = this.score;
        }
    }
}

console.log('[TETRIS] Creating global tetrisGame instance...');

// Global instance for the game
let tetrisGame = null;

try {
    tetrisGame = new HolotapeTetris();
    console.log('[TETRIS] Global tetrisGame instance created successfully');
    console.log('[TETRIS] tetrisGame object:', tetrisGame);
} catch (error) {
    console.error('[TETRIS] Failed to create tetrisGame instance:', error);
}

// Make it globally accessible
if (typeof window !== 'undefined') {
    window.tetrisGame = tetrisGame;
    console.log('[TETRIS] tetrisGame attached to window object');
}

// Export game info for Pipboy interface
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { gameInfo, HolotapeTetris };
    console.log('[TETRIS] Module exports set');
}

console.log('[TETRIS] Script loading complete');
console.log('[TETRIS] Final check - tetrisGame exists:', typeof tetrisGame !== 'undefined');
console.log('[TETRIS] Final check - tetrisGame value:', tetrisGame);
