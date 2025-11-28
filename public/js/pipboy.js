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
            } else if (tabName === 'radio') {
                // Usuń poprzedni radio.js jeśli istnieje
                const oldScript = document.getElementById('radio-js');
                if (oldScript) {
                    oldScript.remove();
                }
                // Dynamicznie dołącz radio.js po załadowaniu zakładki Radio
                const script = document.createElement('script');
                script.src = '/js/radio.js';
                script.id = 'radio-js';
                // Po załadowaniu skryptu spróbuj uruchomić radio (window.startRadio)
                // script.onload = function() {
                //     try {
                //         console.log(window.startFalloutRadio);
                //         if (typeof window.startFalloutRadio === 'function') {
                //             window.startFalloutRadio();
                //         }
                //     } catch (e) {
                //         console.warn('startRadio onload failed', e && e.message);
                //     }
                // };
                document.body.appendChild(script);
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

// ========================================
// GAMES FUNCTIONALITY
// ========================================

let availableGames = [];
let currentGame = null;
let currentGameFrame = null;

// Load games from API
async function loadGames() {
    const gamesListContainer = document.getElementById('games-list');
    
    if (!gamesListContainer) return;
    
    gamesListContainer.innerHTML = '<div style="text-align: center; opacity: 0.7; padding: 20px;">SCANNING HOLOTAPES...</div>';
    
    try {
        const response = await fetch('/api/games');
        const data = await response.json();
        
        console.log('Games loaded:', data);
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        availableGames = data.games;
        gamesListContainer.innerHTML = '';
        
        // Display all games
        for (const gameInfo of availableGames) {
            createGameItem(gameInfo, gamesListContainer);
        }
        
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

// Create game item UI element
function createGameItem(gameInfo, container) {
    const gameItem = document.createElement('div');
    gameItem.className = 'inventory-item';
    gameItem.style.cursor = 'pointer';
    
    // Determine display status
    const statusColor = gameInfo.status === 'OPERATIONAL' ? '#00ff00' : 
                       gameInfo.status === 'CORRUPTED' ? '#ff6666' : '#ffaa00';
    
    gameItem.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 5px;">${gameInfo.name}</div>
        <div style="font-size: 0.8em; opacity: 0.8;">${gameInfo.classification || 'ARCADE'}</div>
        <div style="font-size: 0.7em; color: ${statusColor}; margin-top: 3px;">[${gameInfo.status}]</div>
        <div style="font-size: 0.6em; opacity: 0.6; margin-top: 2px;">${gameInfo.description}</div>
        ${gameInfo.players ? `<div style="font-size: 0.6em; opacity: 0.5; margin-top: 2px;">Players: ${gameInfo.players}</div>` : ''}
    `;
    
    gameItem.addEventListener('click', () => loadGame(gameInfo));
    container.appendChild(gameItem);
}

// Load and run a game
function loadGame(gameInfo) {
    console.log('Loading game:', gameInfo);
    
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) {
        console.error('Game container not found!');
        return;
    }

    // Stop current game if running

    // Ustaw currentGame early, tak aby Escape działał także podczas ładowania
    currentGame = gameInfo;

    if (currentGameFrame) {
        try {
            currentGameFrame.remove();
            currentGameFrame = null;
        } catch (e) {
            console.error('Error removing current game:', e);
        }
    }

    // Clear and show loading message
    gameContainer.innerHTML = `
        <div style="text-align: center; color: #00ff00; padding: 20px;">
            <div style="margin-bottom: 10px;">INITIALIZING ${gameInfo.name}...</div>
            <div style="font-size: 0.8em; opacity: 0.7;">Reading holotape data...</div>
        </div>
    `;

    // Determine how to load the game
    setTimeout(() => {
        try {
            if (gameInfo.hasIndex) {
                // Load games with their own index.html in an iframe
                loadGameInIframe(gameInfo, gameContainer);
            } else if (gameInfo.mainScript) {
                // Load games with just a main script
                loadGameScript(gameInfo, gameContainer);
            } else {
    // Add visual feedback
            }
        } catch (error) {
            console.error('Error loading game:', error);
            gameContainer.innerHTML = `
                <div style="text-align: center; color: #ff6666; padding: 20px;">
                    ERROR: Failed to load game<br>
                    <span style="font-size: 0.8em;">${error.message}</span>
                </div>
            `;
        }
    });
}

// Load game in iframe (for games with index.html)
function loadGameInIframe(gameInfo, container) {
    console.log('Loading game in iframe:', gameInfo.name);

    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '500px';
    iframe.style.border = '2px solid #00ff00';
    iframe.style.background = '#000';
    iframe.src = `${gameInfo.path}index.html`;

    // Add controls bar
    container.innerHTML = `
        <div style="background: rgba(0, 255, 0, 0.1); padding: 10px; margin-bottom: 10px; border: 1px solid #00ff00;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="font-weight: bold;">${gameInfo.name}</div>
                <button onclick="stopCurrentGame()" style="
                    background: #ff6666;
                    color: #000;
                    border: none;
                    padding: 5px 10px;
                    cursor: pointer;
                    font-family: monospace;
                    font-weight: bold;
                ">EXIT GAME</button>
            </div>
            ${gameInfo.controls ? createControlsDisplay(gameInfo.controls) : ''}
        </div>
    `;

    container.appendChild(iframe);
    currentGameFrame = iframe;
    currentGame = gameInfo;
}

// Load game script directly (for games with just JS files)
function loadGameScript(gameInfo, container) {
    console.log('Loading game script:', gameInfo.mainScript);

    // Create a container for the game
    const gameDiv = document.createElement('div');
    gameDiv.id = 'game-instance-' + Date.now();
    gameDiv.style.width = '100%';
    gameDiv.style.minHeight = '400px';

    // Add controls bar
    container.innerHTML = `
        <div style="background: rgba(0, 255, 0, 0.1); padding: 10px; margin-bottom: 10px; border: 1px solid #00ff00;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="font-weight: bold;">${gameInfo.name}</div>
                <button onclick="stopCurrentGame()" style="
                    background: #ff6666;
                    color: #000;
                    border: none;
                    padding: 5px 10px;
                    cursor: pointer;
                    font-family: monospace;
                    font-weight: bold;
                ">EXIT GAME</button>
            </div>
            ${gameInfo.controls ? createControlsDisplay(gameInfo.controls) : ''}
        </div>
    `;

    container.appendChild(gameDiv);

    // Try to load and initialize the game
    const script = document.createElement('script');
    script.src = `${gameInfo.path}${gameInfo.mainScript}`;
    script.onload = () => {
        console.log('Game script loaded');

        // Try to initialize the game with various methods
        setTimeout(() => {
            try {
                // Try common initialization patterns
                if (typeof window.initGame === 'function') {
                    window.initGame(gameDiv.id);
                } else if (typeof window.startGame === 'function') {
                    window.startGame(gameDiv.id);
                } else if (typeof window.Game === 'function') {
                    new window.Game(gameDiv.id);
                } else {
                    // If no standard init found, just hope the game auto-starts
                    console.log('No standard init function found, game may auto-start');
                }
            } catch (error) {
                console.error('Error initializing game:', error);
            }
        }, 100);
    };

    script.onerror = () => {
        console.error('Failed to load game script');
        container.innerHTML = `
            <div style="text-align: center; color: #ff6666; padding: 20px;">
                ERROR: HOLOTAPE READ ERROR<br>
                <span style="font-size: 0.8em;">Could not load ${gameInfo.name}</span>
            </div>
        `;
    };

    document.head.appendChild(script);
    currentGame = gameInfo;
}

// Create controls display
function createControlsDisplay(controls) {
    if (!controls || typeof controls !== 'object') return '';

    const controlsHtml = Object.entries(controls).map(([key, desc]) =>
        `<span style="margin-right: 15px; font-size: 0.8em; opacity: 0.7;">${key.toUpperCase()}: ${desc}</span>`
    ).join('');

    return `<div style="margin-top: 5px;">${controlsHtml}</div>`;
}

// Stop current game
window.stopCurrentGame = function() {
    if (currentGameFrame) {
        currentGameFrame.remove();
        currentGameFrame = null;
    }

    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        gameContainer.innerHTML = `
            <div style="text-align: center; opacity: 0.7; padding: 40px;">
                SELECT A PROGRAM TO EXECUTE
            </div>
        `;
    }

    currentGame = null;

    // Reset all game items background
    document.querySelectorAll('.inventory-item').forEach(item => {
        item.style.background = 'rgba(0, 255, 0, 0.05)';
    });
};

// Initialize games tab
function initializeGamesTab() {
    if (!availableGames || availableGames.length === 0) {
        loadGames();
    }
}

// ========================================
// INITIALIZATION
// ========================================

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
var startRadio = false;
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

    console.log(tabName);
    if (tabName === 'radio') {
        startRadio = true;
        // Jeśli skrypt radio.js już załadowany lub funkcja startRadio dostępna, odpal radio
            try {
                console.log(window.startFalloutRadio);
                if (typeof window.startFalloutRadio === 'function') {
                    window.startFalloutRadio();
                }
            } catch (e) {
                console.warn('Could not start radio audio on tab switch:', e && e.message);
            }
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
            if (currentGame) {
                stopCurrentGame();
            }
            break;
    }
});

// Console startup messages
console.log('%c██████╗ ██╗██████╗ ██████╗  ██████╗ ██╗   ██╗', 'color: #00ff00; font-family: monospace;');
console.log('%c██╔══██╗██║██╔══██╗██╔══██╗██╔═══██╗╚██╗ ██╔╝', 'color: #00ff00; font-family: monospace;');
console.log('%c██████╔╝██║██████╔╝██████╔╝██║   ██║ ╚████╔╝ ', 'color: #00ff00; font-family: monospace;');
console.log('%c██╔═══╝ ██║██╔═══╝ ██╔══██╗██║   ██║  ╚██╔╝  ', 'color: #00ff00; font-family: monospace;');
console.log('%c██║     ██║██║     ██████╔╝╚██████╔╝   ██║   ', 'color: #00ff00; font-family: monospace;');
console.log('%c╚═╝     ╚═╝╚═╝     ╚═════╝  ╚═════╝    ╚═╝   ', 'color: #00ff00; font-family: monospace;');
console.log('%c3000 MK IV - VAULT-TEC INDUSTRIES © 2077', 'color: #00ff00; font-family: monospace;');
console.log('%cTERMINAL INITIALIZED...', 'color: #00ff00; font-family: monospace;');

