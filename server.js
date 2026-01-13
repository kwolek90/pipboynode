const express = require('express');
const path = require('path');
const fs = require('fs');
const mm = require('music-metadata');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pipboy.html'));
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

// API endpoint: lista stacji radiowych
app.get('/api/radio_stations', (req, res) => {
    const stationsPath = path.join(__dirname, 'public', 'radio_stations');
    try {
        const stations = [];
        const stationDirs = fs.readdirSync(stationsPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory());
        for (const dir of stationDirs) {
            const stationDirPath = path.join(stationsPath, dir.name);
            const configPath = path.join(stationDirPath, 'config.json');
            if (fs.existsSync(configPath)) {
                try {
                    const configContent = fs.readFileSync(configPath, 'utf8');
                    const config = JSON.parse(configContent);
                    stations.push({
                        id: dir.name,
                        name: config.name || dir.name,
                        active: !!config.active,
                        frequency: config.frequency || '',
                        description: config.description || ''
                    });
                } catch (e) {
                    // Pomijaj błędne configi
                }
            }
        }
        res.json({
            stations: stations,
            count: stations.length
        });
    } catch (error) {
        res.json({ stations: [], count: 0, error: 'Could not access radio_stations directory' });
    }
});

// API endpoint: losowy utwór z wybranej stacji
app.get('/api/radio_stations/:station/random', async (req, res) => {
    const station = req.params.station;
    const stationDir = path.join(__dirname, 'public', 'radio_stations', station);
    const configPath = path.join(stationDir, 'config.json');
    if (!fs.existsSync(configPath)) {
        return res.status(404).json({ error: 'Station not found' });
    }
    try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (!config.active) {
            return res.status(403).json({ error: 'Station is not active' });
        }
        const files = fs.readdirSync(stationDir).filter(f => f.toLowerCase().endsWith('.mp3'));
        if (!files.length) {
            return res.status(404).json({ error: 'No mp3 files found' });
        }
        const randomFile = files[Math.floor(Math.random() * files.length)];
        const filePath = path.join(stationDir, randomFile);
        const fileUrl = `/radio_stations/${station}/${encodeURIComponent(randomFile)}`;
        let title = randomFile;
        let artist = '';
        let duration = 0;
        try {
            const metadata = await mm.parseFile(filePath);
            title = metadata.common.title || randomFile;
            artist = metadata.common.artist || '';
            duration = metadata.format.duration || 0;
        } catch (e) {
            // Jeśli nie uda się odczytać metadanych, użyj domyślnych wartości
        }
        res.json({ file: fileUrl, title, artist, duration });
    } catch (e) {
        res.status(500).json({ error: 'Error reading station data' });
    }
});

// API endpoint: lista wszystkich utworów z wybranej stacji
app.get('/api/radio_stations/:station/tracks', async (req, res) => {
    const station = req.params.station;
    const stationDir = path.join(__dirname, 'public', 'radio_stations', station);
    const configPath = path.join(stationDir, 'config.json');
    if (!fs.existsSync(configPath)) {
        return res.status(404).json({ error: 'Station not found' });
    }
    try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (!config.active) {
            return res.status(403).json({ error: 'Station is not active' });
        }
        const files = fs.readdirSync(stationDir).filter(f => f.toLowerCase().endsWith('.mp3'));
        const tracks = [];
        for (const file of files) {
            const filePath = path.join(stationDir, file);
            const fileUrl = `/radio_stations/${station}/${encodeURIComponent(file)}`;
            let title = file;
            let artist = '';
            let duration = 0;
            try {
                const metadata = await mm.parseFile(filePath);
                title = metadata.common.title || file;
                artist = metadata.common.artist || '';
                duration = metadata.format.duration || 0;
            } catch (e) {
                // Jeśli nie uda się odczytać metadanych, użyj domyślnych wartości
            }
            tracks.push({ file: fileUrl, title, artist, duration });
        }
        res.json({ tracks });
    } catch (e) {
        res.status(500).json({ error: 'Error reading station data' });
    }
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
