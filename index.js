// Import necessary modules
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');
const path = require('path');

// Create Express app
const app = express();
app.use(bodyParser.json());

// Initialize Supabase client
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://bikicgbweumnlghjjkbg.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'YOUR_SUPABASE_KEY';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes

// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'homePokemon.html'));
});

// About route
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'aboutPokemon.html'));
});

// Help route
app.get('/help', (req, res) => {
    res.sendFile(path.join(__dirname, 'helpPokemon.html'));
});

// Info route
app.get('/info', (req, res) => {
    res.sendFile(path.join(__dirname, 'infoPokemon.html'));
});

// CSS routes
app.get('/homePokemon.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'homePokemon.css'));
});

app.get('/aboutPokemon.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'aboutPokemon.css'));
});

app.get('/helpPokemon.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'helpPokemon.css'));
});

app.get('/infoPokemon.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'infoPokemon.css'));
});

// JavaScript routes
app.get('/homePokemon.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'homePokemon.js'));
});

app.get('/aboutPokemon.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'aboutPokemon.js'));
});

app.get('/helpPokemon.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'helpPokemon.js'));
});

app.get('/infoPokemon.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'infoPokemon.js'));
});

// Register route
app.post('/api/register', async (req, res) => {
    // Implementation for registering a new account
});

// Get caught status route
app.get('/api/get-caught-status', async (req, res) => {
    // Implementation for getting user account data and Pokémon caught status
});

// Set caught status route
app.post('/api/set-caught-status', async (req, res) => {
    // Implementation for updating Pokémon caught status
});

// Define the port for the server to listen on
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Export the app for local development
module.exports = app;
