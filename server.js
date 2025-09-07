const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint for Pipboy data (optional future expansion)
app.get('/api/status', (req, res) => {
    res.json({
        status: 'operational',
        vault: '111',
        timestamp: new Date().toISOString(),
        radiation: Math.floor(Math.random() * 100),
        health: 100
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Pipboy 3000 Terminal Server running on http://localhost:${PORT}`);
    console.log(`📡 Vault-Tec Industries © 2077`);
    console.log(`⚡ System Status: OPERATIONAL`);
});
