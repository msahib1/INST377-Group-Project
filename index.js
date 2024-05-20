const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to register a new account
app.post('/api/register', async (req, res) => {
    // Handle registration logic
});

// Endpoint to get user account data and Pokémon caught status
app.get('/api/get-caught-status', async (req, res) => {
    // Handle getting caught status logic
});

// Endpoint to update Pokémon caught status
app.post('/api/set-caught-status', async (req, res) => {
    // Handle updating caught status logic
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
