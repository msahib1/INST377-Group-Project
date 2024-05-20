const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(bodyParser.json());

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://bikicgbweumnlghjjkbg.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve each HTML file
app.get('/homePokemon.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'homePokemon.html'));
});

app.get('/aboutPokemon.html', (req, res) => { // Update route to '/about'
    res.sendFile(path.join(__dirname, 'aboutPokemon.html'));
});

app.get('/helpPokemon.html', (req, res) => { // Update route to '/help'
    res.sendFile(path.join(__dirname, 'helpPokemon.html'));
});

app.get('/infoPokemon.html', (req, res) => { // Update route to '/info'
    res.sendFile(path.join(__dirname, 'infoPokemon.html'));
});

// Serve each CSS file
app.get('/homePokemon.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'homePokemon.css'));
});

app.get('/aboutPokemon.css', (req, res) => { // Update route to '/aboutPokemon.css'
    res.sendFile(path.join(__dirname, 'aboutPokemon.css'));
});

app.get('/helpPokemon.css', (req, res) => { // Update route to '/helpPokemon.css'
    res.sendFile(path.join(__dirname, 'helpPokemon.css'));
});

app.get('/infoPokemon.css', (req, res) => { // Update route to '/infoPokemon.css'
    res.sendFile(path.join(__dirname, 'infoPokemon.css'));
});

// Serve each JavaScript file
app.get('/homePokemon.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'homePokemon.js'));
});

app.get('/aboutPokemon.js', (req, res) => { // Update route to '/aboutPokemon.js'
    res.sendFile(path.join(__dirname, 'aboutPokemon.js'));
});

app.get('/helpPokemon.js', (req, res) => { // Update route to '/helpPokemon.js'
    res.sendFile(path.join(__dirname, 'helpPokemon.js'));
});

app.get('/infoPokemon.js', (req, res) => { // Update route to '/infoPokemon.js'
    res.sendFile(path.join(__dirname, 'infoPokemon.js'));
});

// Endpoint to register a new account
app.post('/api/register', async (req, res) => {
    // Logic for registering a new account
});

// Endpoint to get user account data and Pokémon caught status
app.get('/api/get-caught-status', async (req, res) => {
    // Logic for getting caught status
});

// Endpoint to update Pokémon caught status
app.post('/api/set-caught-status', async (req, res) => {
    // Logic for updating caught status
});

const PORT = process.env.PORT || 3000;

// Export the app for local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Export the app as a serverless function for Vercel
module.exports = app;
