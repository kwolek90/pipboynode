// Pipboy 3000 Terminal JavaScript
// DateTime update
function updateDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString('en-US');
    const time = now.toLocaleTimeString('en-US');
    document.getElementById('datetime').textContent = `${date} ${time}`;
}

setInterval(updateDateTime, 1000);
updateDateTime();


// Radio functionality
const stations = [
    { freq: '105.7', name: 'DIAMOND CITY RADIO', song: 'Atom Bomb Baby' },
    { freq: '98.3', name: 'CLASSICAL RADIO', song: 'Für Elise' },
    { freq: '101.1', name: 'RADIO FREEDOM', song: 'Yankee Doodle' },
    { freq: '89.9', name: 'ENCLAVE RADIO', song: 'Battle Hymn of the Republic' },
    { freq: '94.5', name: 'GALAXY NEWS RADIO', song: 'I Don\'t Want to Set the World on Fire' }
];

let currentStation = 0;
let radioPlaying = true;

function changeStation(direction) {
    currentStation = (currentStation + direction + stations.length) % stations.length;
    const station = stations[currentStation];
    
    document.getElementById('frequency').textContent = `${station.freq} FM`;
    document.getElementById('station-name').textContent = station.name;
    
    // Add static effect
    document.getElementById('station-name').style.opacity = '0.3';
    setTimeout(() => {
        document.getElementById('station-name').style.opacity = '1';
    }, 200);
}

function toggleRadio() {
    radioPlaying = !radioPlaying;
    document.getElementById('radio-toggle').textContent = radioPlaying ? 'PAUSE' : 'PLAY';
}

// Inventory item interaction
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.inventory-item').forEach(item => {
        item.addEventListener('click', function() {
            this.style.background = 'rgba(0, 255, 0, 0.3)';
            setTimeout(() => {
                this.style.background = 'rgba(0, 255, 0, 0.05)';
            }, 200);
        });
    });
    
    // Initialize stat animations
    setTimeout(() => {
        document.querySelectorAll('.progress-fill').forEach(fill => {
            const width = fill.style.width;
            fill.style.width = '0%';
            setTimeout(() => {
                fill.style.width = width;
            }, 100);
        });
    }, 500);
    
    // Initialize games on page load
    loadGames();
});

// Sound effects (visual feedback)
document.addEventListener('click', function() {
    // Create brief flash effect
    const flash = document.createElement('div');
    flash.style.position = 'absolute';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100%';
    flash.style.height = '100%';
    flash.style.background = 'rgba(0, 255, 0, 0.1)';
    flash.style.pointerEvents = 'none';
    flash.style.zIndex = '200';
    
    document.body.appendChild(flash);
    
    setTimeout(() => {
        flash.remove();
    }, 50);
});

// Custom cursor glow effect
document.addEventListener('mousemove', function(e) {
    // Add subtle glow effect at mouse position
    const glow = document.createElement('div');
    glow.style.position = 'absolute';
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    glow.style.width = '10px';
    glow.style.height = '10px';
    glow.style.background = 'rgba(0, 255, 0, 0.5)';
    glow.style.borderRadius = '50%';
    glow.style.pointerEvents = 'none';
    glow.style.zIndex = '150';
    glow.style.transform = 'translate(-50%, -50%)';
    
    document.body.appendChild(glow);
    
    setTimeout(() => {
        glow.remove();
    }, 100);
});

// Random data updates
function updateRandomData() {
    // Update radiation level randomly
    const radiationLevels = ['LOW', 'MODERATE', 'HIGH', 'EXTREME'];
    const radiationTexts = document.querySelectorAll('div');
    radiationTexts.forEach(div => {
        if (div.textContent && div.textContent.includes('RADIATION LEVEL:')) {
            const randomLevel = radiationLevels[Math.floor(Math.random() * radiationLevels.length)];
            div.textContent = `RADIATION LEVEL: ${randomLevel}`;
        }
    });
    
    // Update hostiles detected
    const hostileCount = Math.floor(Math.random() * 6);
    radiationTexts.forEach(div => {
        if (div.textContent && div.textContent.includes('HOSTILES DETECTED:')) {
            div.textContent = `HOSTILES DETECTED: ${hostileCount}`;
        }
    });
}

// Update random data every 30 seconds
//setInterval(updateRandomData, 30000);

// Console startup messages
console.log('%c██████╗ ██╗██████╗ ██████╗  ██████╗ ██╗   ██╗', 'color: #00ff00; font-family: monospace;');
console.log('%c██╔══██╗██║██╔══██╗██╔══██╗██╔═══██╗╚██╗ ██╔╝', 'color: #00ff00; font-family: monospace;');
console.log('%c██████╔╝██║██████╔╝██████╔╝██║   ██║ ╚████╔╝ ', 'color: #00ff00; font-family: monospace;');
console.log('%c██╔═══╝ ██║██╔═══╝ ██╔══██╗██║   ██║  ╚██╔╝  ', 'color: #00ff00; font-family: monospace;');
console.log('%c██║     ██║██║     ██████╔╝╚██████╔╝   ██║   ', 'color: #00ff00; font-family: monospace;');
console.log('%c╚═╝     ╚═╝╚═╝     ╚═════╝  ╚═════╝    ╚═╝   ', 'color: #00ff00; font-family: monospace;');
console.log('%c3000 MK IV - VAULT-TEC INDUSTRIES © 2077', 'color: #00ff00; font-family: monospace;');
console.log('%cTERMINAL INITIALIZED...', 'color: #00ff00; font-family: monospace;');

// Games functionality
let availableGames = [];
let currentGame = null;
let gameInstances = {}; // Store game instances by filename

// Load games sequentially to avoid conflicts
async function loadGamesSequentially(games, container) {
    for (const gameInfo of games) {
        try {
            await loadSingleGame(gameInfo, container);
        } catch (error) {
            console.error(`Failed to load game: ${gameInfo.filename}`, error);
            // Add error item
            const gameItem = document.createElement('div');
            gameItem.className = 'inventory-item';
            gameItem.style.cursor = 'pointer';
            gameItem.style.opacity = '0.5';
            gameItem.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 5px;">${gameInfo.name}</div>
                <div style="font-size: 0.8em; opacity: 0.8;">${gameInfo.classification}</div>
                <div style="font-size: 0.7em; color: #ff6666; margin-top: 3px;">[ERROR]</div>
                <div style="font-size: 0.6em; opacity: 0.6; margin-top: 2px;">Load failed</div>
            `;
            container.appendChild(gameItem);
        }
    }
}

// Load a single game script
function loadSingleGame(gameInfo, container) {
    return new Promise((resolve, reject) => {
        // Check if script already exists
        const existingScript = document.querySelector(`script[src="games/${gameInfo.filename}"]`);
        if (existingScript) {
            // Script already loaded, just create the UI element
            createGameItem(gameInfo, container);
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = `games/${gameInfo.filename}`;
        script.onload = () => {
            // Store the game instance based on filename
            console.log(`Script loaded: ${gameInfo.filename}`);
            const gameInstance = getGameInstance(gameInfo.filename);
            console.log(`Game instance found:`, gameInstance);
            if (gameInstance) {
                gameInstances[gameInfo.filename] = gameInstance;
                createGameItem(gameInfo, container);
                resolve();
            } else {
                console.log(`Game instance not found for ${gameInfo.filename}, available globals:`, {
                    tetrisGame: typeof tetrisGame,
                    atomicGame: typeof atomicGame,
                    pongGame: typeof pongGame
                });
                reject(new Error(`Game instance not found for ${gameInfo.filename}`));
            }
        };
        script.onerror = () => {
            reject(new Error(`Failed to load script: ${gameInfo.filename}`));
        };
        document.head.appendChild(script);
    });
}

// Get game instance based on filename
function getGameInstance(filename) {
    switch (filename) {
        case 'holotape-tetris.js':
            return typeof tetrisGame !== 'undefined' ? tetrisGame : null;
        case 'atomic-command.js':
            return typeof atomicGame !== 'undefined' ? atomicGame : null;
        case 'wasteland-pong.js':
            return typeof pongGame !== 'undefined' ? pongGame : null;
        default:
            return null;
    }
}

// Create game item UI element
function createGameItem(gameInfo, container) {
    const gameItem = document.createElement('div');
    gameItem.className = 'inventory-item';
    gameItem.style.cursor = 'pointer';
    gameItem.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 5px;">${gameInfo.name}</div>
        <div style="font-size: 0.8em; opacity: 0.8;">${gameInfo.classification}</div>
        <div style="font-size: 0.7em; color: #00aa00; margin-top: 3px;">[${gameInfo.status}]</div>
        <div style="font-size: 0.6em; opacity: 0.6; margin-top: 2px;">${gameInfo.description}</div>
    `;
    
    gameItem.addEventListener('click', () => loadGame(gameInfo.filename, gameInfo.name));
    container.appendChild(gameItem);
}

// Load games from directory
async function loadGames() {
    const gamesListContainer = document.getElementById('games-list');
    
    if (!gamesListContainer) return;
    
    gamesListContainer.innerHTML = '<div style="text-align: center; opacity: 0.7; padding: 20px;">LOADING GAMES...</div>';
    
    try {
        // Fetch games from the API endpoint
        const response = await fetch('/api/games');
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        gamesListContainer.innerHTML = '';
        
        // Load all games at once
        for (const gameInfo of data.games) {
            try {
                await loadSingleGame(gameInfo, gamesListContainer);
            } catch (error) {
                console.error(`Failed to load game: ${gameInfo.filename}`, error);
                // Still add the game item even if script fails
                const gameItem = document.createElement('div');
                gameItem.className = 'inventory-item';
                gameItem.style.cursor = 'pointer';
                gameItem.style.opacity = '0.5';
                gameItem.innerHTML = `
                    <div style="font-weight: bold; margin-bottom: 5px;">${gameInfo.name}</div>
                    <div style="font-size: 0.8em; opacity: 0.8;">${gameInfo.classification}</div>
                    <div style="font-size: 0.7em; color: #ff6666; margin-top: 3px;">[ERROR]</div>
                    <div style="font-size: 0.6em; opacity: 0.6; margin-top: 2px;">Load failed</div>
                `;
                gamesListContainer.appendChild(gameItem);
            }
        }
        
        // Update available games array
        availableGames = data.games;
        
    } catch (error) {
        console.error('Failed to load games:', error);
        gamesListContainer.innerHTML = `
            <div style="text-align: center; color: #ff6666; padding: 20px;">
                ERROR LOADING GAMES<br>
                <span style="font-size: 0.8em;">${error.message}</span>
            </div>
        `;
    }
}

// Load and initialize a specific game
function loadGame(gameFile, gameName) {
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) return;
    
    // Stop current game if running
    if (currentGame && typeof currentGame.stop === 'function') {
        currentGame.stop();
    }
    
    gameContainer.innerHTML = `
        <div style="text-align: center; color: #00ff00; padding: 20px;">
            <div style="margin-bottom: 10px;">LOADING ${gameName}...</div>
            <div style="font-size: 0.8em; opacity: 0.7;">Please wait while the holotape is read...</div>
        </div>
    `;
    
    // Create a unique container ID for the game
    const gameId = 'game-' + Date.now();
    
    setTimeout(() => {
        gameContainer.innerHTML = `<div id="${gameId}" style="width: 100%;"></div>`;
        
        // Initialize the appropriate game based on the filename
        try {
            console.log(`Loading game: ${gameFile}`);
            console.log('Available game instances:', Object.keys(gameInstances));
            const gameInstance = gameInstances[gameFile];
            if (gameInstance && typeof gameInstance.init === 'function') {
                console.log('Using stored game instance');
                gameInstance.init(gameId);
                currentGame = gameInstance;
            } else {
                console.log('Game instance not found in storage, trying fallback...');
                // Fallback to global variables
                let fallbackInstance = null;
                switch (gameFile) {
                    case 'holotape-tetris.js':
                        fallbackInstance = typeof tetrisGame !== 'undefined' ? tetrisGame : null;
                        break;
                    case 'atomic-command.js':
                        fallbackInstance = typeof atomicGame !== 'undefined' ? atomicGame : null;
                        break;
                    case 'wasteland-pong.js':
                        fallbackInstance = typeof pongGame !== 'undefined' ? pongGame : null;
                        break;
                }
                
                console.log('Fallback instance:', fallbackInstance);
                if (fallbackInstance && typeof fallbackInstance.init === 'function') {
                    console.log('Using fallback instance');
                    fallbackInstance.init(gameId);
                    currentGame = fallbackInstance;
                } else {
                    console.log('No fallback instance found');
                    gameContainer.innerHTML = `
                        <div style="text-align: center; color: #ff6666; padding: 20px;">
                            ERROR: HOLOTAPE CORRUPTED<br>
                            <span style="font-size: 0.8em;">Unable to execute ${gameName}</span>
                        </div>
                    `;
                }
            }
        } catch (error) {
            console.error('Error loading game:', error);
            gameContainer.innerHTML = `
                <div style="text-align: center; color: #ff6666; padding: 20px;">
                    SYSTEM ERROR: EXECUTION FAILED<br>
                    <span style="font-size: 0.8em;">Please check holotape integrity</span>
                </div>
            `;
        }
    }, 1000);
    
    // Add visual feedback
    document.querySelectorAll('.inventory-item').forEach(item => {
        item.style.background = 'rgba(0, 255, 0, 0.05)';
    });
    event.target.closest('.inventory-item').style.background = 'rgba(0, 255, 0, 0.2)';
}

// Initialize games when the games tab is first accessed
function initializeGamesTab() {
    if (!document.getElementById('games-list').hasChildNodes()) {
        loadGames();
    }
}

// Tab switching
function switchTab(tabName) {
    // Remove active from all tabs and content
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Add active to clicked tab and corresponding content
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
    
    // Initialize games if switching to games tab
    if (tabName === 'games') {
        initializeGamesTab();
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    switch(e.key) {
        case '1':
            document.querySelector('[onclick="switchTab(\'stat\')"]').click();
            break;
        case '2':
            document.querySelector('[onclick="switchTab(\'inv\')"]').click();
            break;
        case '3':
            document.querySelector('[onclick="switchTab(\'data\')"]').click();
            break;
        case '4':
            document.querySelector('[onclick="switchTab(\'map\')"]').click();
            break;
        case '5':
            document.querySelector('[onclick="switchTab(\'radio\')"]').click();
            break;
        case '6':
            document.querySelector('[onclick="switchTab(\'games\')"]').click();
            break;
        case 'ArrowLeft':
            if (document.getElementById('radio').classList.contains('active')) {
                changeStation(-1);
            }
            break;
        case 'ArrowRight':
            if (document.getElementById('radio').classList.contains('active')) {
                changeStation(1);
            }
            break;
        case ' ':
            if (document.getElementById('radio').classList.contains('active')) {
                e.preventDefault();
                toggleRadio();
            }
            break;
        case 'Escape':
            // Stop current game
            if (currentGame && typeof currentGame.stop === 'function') {
                currentGame.stop();
            }
            break;
    }
});
