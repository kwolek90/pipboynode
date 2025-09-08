// Pipboy 3000 Terminal JavaScript

// Tab loading system
const tabsLoaded = {};

async function loadTabContent(tabName) {
    console.log(`Loading tab content: ${tabName}`);
    
    // Check if already loaded
    if (tabsLoaded[tabName]) {
        console.log(`Tab ${tabName} already loaded`);
        return;
    }
    
    try {
        const response = await fetch(`tabs/${tabName}.html`);
        if (!response.ok) {
            throw new Error(`Failed to load tab: ${response.status}`);
        }
        
        const content = await response.text();
        const tabElement = document.getElementById(tabName);
        
        if (tabElement) {
            tabElement.innerHTML = content;
            tabsLoaded[tabName] = true;
            console.log(`Tab ${tabName} loaded successfully`);
            
            // Reinitialize tab-specific functionality
            if (tabName === 'stat') {
                initializeStatAnimations();
            } else if (tabName === 'inv') {
                initializeInventoryItems();
            } else if (tabName === 'games') {
                initializeGamesTab();
            }
        }
    } catch (error) {
        console.error(`Error loading tab ${tabName}:`, error);
        const tabElement = document.getElementById(tabName);
        if (tabElement) {
            tabElement.innerHTML = `
                <div style="text-align: center; color: #ff6666; padding: 20px;">
                    ERROR: Failed to load tab content<br>
                    <span style="font-size: 0.8em;">${error.message}</span>
                </div>
            `;
        }
    }
}

// Initialize stat animations
function initializeStatAnimations() {
    setTimeout(() => {
        document.querySelectorAll('.progress-fill').forEach(fill => {
            const width = fill.style.width;
            fill.style.width = '0%';
            setTimeout(() => {
                fill.style.width = width;
            }, 100);
        });
    }, 100);
}

// Initialize inventory items
function initializeInventoryItems() {
    document.querySelectorAll('.inventory-item').forEach(item => {
        item.addEventListener('click', function() {
            this.style.background = 'rgba(0, 255, 0, 0.3)';
            setTimeout(() => {
                this.style.background = 'rgba(0, 255, 0, 0.05)';
            }, 200);
        });
    });
}

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
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM loaded, initializing Pipboy...');
    
    // Load all tabs
    const tabs = ['stat', 'inv', 'data', 'map', 'radio', 'games'];
    
    // Load the active tab first (stat)
    await loadTabContent('stat');
    
    // Load other tabs in background
    tabs.filter(tab => tab !== 'stat').forEach(tab => {
        loadTabContent(tab);
    });
    
    // Initialize other features after a small delay
    setTimeout(() => {
        console.log('Initializing additional features...');
    }, 500);
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
            // Wait a bit for the script to fully initialize
            setTimeout(() => {
                const gameInstance = getGameInstance(gameInfo.filename);
                if (gameInstance) {
                    gameInstances[gameInfo.filename] = gameInstance;
                }
                // Always create the game item, even if instance not found
                createGameItem(gameInfo, container);
                resolve();
            }, 200);
        };
        script.onerror = () => {
            // Still create the game item even if script fails
            createGameItem(gameInfo, container);
            resolve();
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
    
    gamesListContainer.innerHTML = '<div style="text-align: center; opacity: 0.7; padding: 20px;">SCANNING HOLOTAPES...</div>';
    
    try {
        // Fetch games from the API endpoint
        const response = await fetch('/api/games');
        const data = await response.json();
        
        console.log('Games API response:', data);
        
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
                createErrorGameItem(gameInfo, gamesListContainer, error.message);
            }
        }
        
        // Update available games array
        availableGames = data.games;
        
    } catch (error) {
        console.error('Failed to load games:', error);
        gamesListContainer.innerHTML = `
            <div style="text-align: center; color: #ff6666; padding: 20px;">
                ERROR: HOLOTAPE READER MALFUNCTION<br>
                <span style="font-size: 0.8em;">${error.message}</span>
            </div>
        `;
    }
}

// Create error game item
function createErrorGameItem(gameInfo, container, errorMsg) {
    const gameItem = document.createElement('div');
    gameItem.className = 'inventory-item';
    gameItem.style.cursor = 'pointer';
    gameItem.style.opacity = '0.5';
    gameItem.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 5px;">${gameInfo.name}</div>
        <div style="font-size: 0.8em; opacity: 0.8;">${gameInfo.classification}</div>
        <div style="font-size: 0.7em; color: #ff6666; margin-top: 3px;">[CORRUPTED]</div>
        <div style="font-size: 0.6em; opacity: 0.6; margin-top: 2px;">${errorMsg}</div>
    `;
    
    gameItem.addEventListener('click', () => {
        const gameContainer = document.getElementById('game-container');
        gameContainer.innerHTML = `
            <div style="text-align: center; color: #ff6666; padding: 20px;">
                ERROR: HOLOTAPE CORRUPTED<br>
                <span style="font-size: 0.8em;">Unable to execute ${gameInfo.name}</span><br>
                <span style="font-size: 0.7em; margin-top: 10px; display: block;">${errorMsg}</span>
            </div>
        `;
    });
    
    container.appendChild(gameItem);
}

// Load and initialize a specific game
function loadGame(gameFile, gameName) {
    console.log('=== LOADGAME START ===');
    console.log(`Loading game: ${gameFile} (${gameName})`);
    
    const gameContainer = document.getElementById('game-container');
    console.log('Game container found:', gameContainer ? 'YES' : 'NO');
    
    if (!gameContainer) {
        console.error('Game container not found!');
        return;
    }
    
    // Stop current game if running
    if (currentGame && typeof currentGame.stop === 'function') {
        try {
            console.log('Stopping current game...');
            currentGame.stop();
            console.log('Current game stopped');
        } catch (e) {
            console.error('Error stopping current game:', e);
        }
    }
    
    gameContainer.innerHTML = `
        <div style="text-align: center; color: #00ff00; padding: 20px;">
            <div style="margin-bottom: 10px;">INITIALIZING ${gameName}...</div>
            <div style="font-size: 0.8em; opacity: 0.7;">Reading holotape data...</div>
        </div>
    `;
    
    // Create a unique container ID for the game
    const gameId = 'game-' + Date.now();
    console.log('Generated game container ID:', gameId);
    
    setTimeout(() => {
        console.log('=== INITIALIZATION PHASE ===');
        
        try {
            // Create the game container div
            gameContainer.innerHTML = `<div id="${gameId}" style="width: 100%; min-height: 400px;"></div>`;
            console.log('Game container div created');
            
            // Verify the container was created
            const createdContainer = document.getElementById(gameId);
            console.log('Container verification:', createdContainer ? 'SUCCESS' : 'FAILED');
            
            // Try different ways to get the game instance
            let gameInstance = null;
            
            // Method 1: Check stored instances
            console.log('Method 1: Checking stored instances...');
            console.log('Stored instances:', Object.keys(gameInstances));
            if (gameInstances[gameFile]) {
                gameInstance = gameInstances[gameFile];
                console.log('Found game in stored instances:', gameInstance);
            } else {
                console.log('Not found in stored instances');
            }
            
            // Method 2: Check global variables directly
            if (!gameInstance) {
                console.log('Method 2: Checking global variables...');
                
                // Also check window object
                console.log('Checking window.tetrisGame:', typeof window.tetrisGame);
                console.log('Checking global tetrisGame:', typeof tetrisGame);
                
                switch (gameFile) {
                    case 'holotape-tetris.js':
                        console.log('Looking for tetrisGame...');
                        console.log('typeof tetrisGame:', typeof tetrisGame);
                        console.log('typeof window.tetrisGame:', typeof window.tetrisGame);
                        
                        if (typeof window.tetrisGame !== 'undefined') {
                            gameInstance = window.tetrisGame;
                            console.log('Found window.tetrisGame');
                        } else if (typeof tetrisGame !== 'undefined') {
                            gameInstance = tetrisGame;
                            console.log('Found global tetrisGame');
                        }
                        
                        console.log('tetrisGame instance:', gameInstance);
                        break;
                    case 'atomic-command.js':
                        if (typeof atomicGame !== 'undefined') {
                            gameInstance = atomicGame;
                            console.log('Found atomicGame globally');
                        }
                        break;
                    case 'wasteland-pong.js':
                        if (typeof pongGame !== 'undefined') {
                            gameInstance = pongGame;
                            console.log('Found pongGame globally');
                        }
                        break;
                }
            }
            
            // Method 3: Try to load the script if game instance not found
            if (!gameInstance) {
                console.log('Method 3: Game instance not found, loading script...');
                loadGameScript(gameFile, gameId, gameName);
                return;
            }
            
            // Initialize the game
            console.log('=== GAME INIT PHASE ===');
            console.log('Game instance:', gameInstance);
            console.log('Has init method:', typeof gameInstance.init === 'function');
            
            if (gameInstance && typeof gameInstance.init === 'function') {
                console.log('Calling game.init() with container ID:', gameId);
                gameInstance.init(gameId);
                currentGame = gameInstance;
                console.log('Game initialized successfully!');
                console.log('Current game set to:', currentGame);
            } else {
                const errorMsg = gameInstance ? 
                    'Game instance found but init method missing' : 
                    'Game instance is null/undefined';
                console.error(errorMsg);
                throw new Error(errorMsg);
            }
            
        } catch (error) {
            console.error('=== ERROR IN GAME LOADING ===');
            console.error('Error:', error);
            console.error('Stack:', error.stack);
            
            gameContainer.innerHTML = `
                <div style="text-align: center; color: #ff6666; padding: 20px;">
                    SYSTEM ERROR: HOLOTAPE UNREADABLE<br>
                    <span style="font-size: 0.8em;">Game initialization failed</span><br>
                    <span style="font-size: 0.7em; margin-top: 10px; display: block; opacity: 0.7;">${error.message}</span>
                </div>
            `;
        }
    }, 1000);
    
    // Add visual feedback
    document.querySelectorAll('.inventory-item').forEach(item => {
        item.style.background = 'rgba(0, 255, 0, 0.05)';
    });
    
    // Safely get the clicked element
    if (event && event.target) {
        const clickedItem = event.target.closest('.inventory-item');
        if (clickedItem) {
            clickedItem.style.background = 'rgba(0, 255, 0, 0.2)';
        }
    }
    
    console.log('=== LOADGAME END ===');
}

// Load game script dynamically
function loadGameScript(gameFile, gameId, gameName) {
    const gameContainer = document.getElementById('game-container');
    
    console.log(`Loading script: games/${gameFile}`);
    
    const script = document.createElement('script');
    script.src = `games/${gameFile}`;
    script.onload = () => {
        console.log('Script loaded, waiting for initialization...');
        setTimeout(() => {
            try {
                let gameInstance = null;
                
                // Try to get the game instance after script load
                switch (gameFile) {
                    case 'holotape-tetris.js':
                        gameInstance = typeof tetrisGame !== 'undefined' ? tetrisGame : null;
                        break;
                    case 'atomic-command.js':
                        gameInstance = typeof atomicGame !== 'undefined' ? atomicGame : null;
                        break;
                    case 'wasteland-pong.js':
                        gameInstance = typeof pongGame !== 'undefined' ? pongGame : null;
                        break;
                }
                
                if (gameInstance && typeof gameInstance.init === 'function') {
                    console.log('Game instance found after script load, initializing...');
                    gameInstance.init(gameId);
                    currentGame = gameInstance;
                    gameInstances[gameFile] = gameInstance; // Store for future use
                    console.log('Game initialized successfully after script load!');
                } else {
                    throw new Error('Game instance not available after script load');
                }
            } catch (error) {
                console.error('Error initializing game after script load:', error);
                gameContainer.innerHTML = `
                    <div style="text-align: center; color: #ff6666; padding: 20px;">
                        ERROR: HOLOTAPE CORRUPTED<br>
                        <span style="font-size: 0.8em;">Unable to execute ${gameName}</span><br>
                        <span style="font-size: 0.7em; margin-top: 10px; display: block; opacity: 0.7;">Script loaded but game failed to initialize</span>
                    </div>
                `;
            }
        }, 500);
    };
    
    script.onerror = () => {
        console.error('Failed to load game script:', gameFile);
        gameContainer.innerHTML = `
            <div style="text-align: center; color: #ff6666; padding: 20px;">
                ERROR: HOLOTAPE NOT FOUND<br>
                <span style="font-size: 0.8em;">Could not load ${gameName}</span><br>
                <span style="font-size: 0.7em; margin-top: 10px; display: block; opacity: 0.7;">Script file missing or corrupted</span>
            </div>
        `;
    };
    
    document.head.appendChild(script);
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
