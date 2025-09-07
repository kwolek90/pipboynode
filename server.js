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
        const gameFiles = fs.readdirSync(gamesPath)
            .filter(file => file.endsWith('.js'))
            .map(file => {
                const filePath = path.join(gamesPath, file);
                const content = fs.readFileSync(filePath, 'utf8');
                
                // Extract game info from the file
                let gameInfo = {
                    filename: file,
                    name: file.replace('.js', '').toUpperCase().replace('-', ' '),
                    description: 'Vault-Tec Entertainment Program',
                    version: 'v1.0.0',
                    author: 'VAULT-TEC INDUSTRIES',
                    classification: 'RECREATION',
                    status: 'OPERATIONAL'
                };
                
                // Try to parse gameInfo from the file
                const gameInfoMatch = content.match(/const gameInfo = ({[\s\S]*?});/);
                if (gameInfoMatch) {
                    try {
                        const extractedInfo = eval('(' + gameInfoMatch[1] + ')');
                        gameInfo = { ...gameInfo, ...extractedInfo, filename: file };
                    } catch (e) {
                        console.log('Could not parse gameInfo from', file);
                    }
                }
                
                return gameInfo;
            });
        
        res.json({ games: gameFiles, count: gameFiles.length });
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
