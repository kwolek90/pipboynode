const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to list available games
app.get('/api/games', (req, res) => {
    const gamesPath = path.join(__dirname, 'public', 'games');
    try {
        const games = [];
        const gameDirs = fs.readdirSync(gamesPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory());
        for (const dir of gameDirs) {
            const gameDirPath = path.join(gamesPath, dir.name);
            // Domyślne dane gry
            let gameInfo = {
                id: dir.name,
                name: dir.name.replace(/_/g, ' ').toUpperCase(),
                description: 'Vault-Tec Entertainment Program',
                version: 'v1.0.0',
                author: 'VAULT-TEC INDUSTRIES',
                classification: 'RECREATION',
                status: 'OPERATIONAL',
                type: 'ARCADE',
                difficulty: 'NORMAL',
                players: '1',
                hasIndex: false,
                mainScript: 'main.js',
                thumbnail: null
            };
            // Wczytaj game.config.json jeśli istnieje
            const configPath = path.join(gameDirPath, 'game.config.json');
            if (fs.existsSync(configPath)) {
                try {
                    const configContent = fs.readFileSync(configPath, 'utf8');
                    const config = JSON.parse(configContent);
                    gameInfo = { ...gameInfo, ...config };
                } catch (e) {
                    console.log(`Could not parse config for ${dir.name}:`, e.message);
                }
            }
            // Sprawdź index.html
            const indexPath = path.join(gameDirPath, 'index.html');
            gameInfo.hasIndex = fs.existsSync(indexPath);
            // Ustaw ścieżkę względną
            gameInfo.path = `games/${dir.name}/`;
            // mainScript zawsze main.js
            gameInfo.mainScript = 'main.js';
            games.push(gameInfo);
        }
        res.json({
            games: games.sort((a, b) => a.name.localeCompare(b.name)), 
            count: games.length 
        });
    } catch (error) {
        console.error('Error reading games directory:', error);
        res.json({ games: [], count: 0, error: 'Could not access games directory' });
    }
});

// API endpoint for Pipboy data (optional future expansion)
app.get('/api/status', (req, res) => {
    res.json({
        status: 'operational',
        vault: '111',
        timestamp: new Date().toISOString(),
        radiation: Math.floor(Math.random() * 100),
        health: 100,
        gamesLoaded: true
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Pipboy 3000 Terminal Server running on http://localhost:${PORT}`);
    console.log(`📡 Vault-Tec Industries © 2077`);
    console.log(`⚡ System Status: OPERATIONAL`);
    console.log(`🎮 Games Directory: ${path.join(__dirname, 'public', 'games')}`);
    
    // Check if games directory exists
    const gamesPath = path.join(__dirname, 'public', 'games');
    if (fs.existsSync(gamesPath)) {
        const gameCount = fs.readdirSync(gamesPath).filter(f => f.endsWith('.js')).length;
        console.log(`🕹️  Loaded ${gameCount} recreation programs`);
    } else {
        console.log(`⚠️  Games directory not found`);
    }
});
