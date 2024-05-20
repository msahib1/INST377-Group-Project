const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://bikicgbweumnlghjjkbg.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpa2ljZ2J3ZXVtbmxnaGpqa2JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYwNTk0MTAsImV4cCI6MjAzMTYzNTQxMH0.ihnm8NLMYs80v1OFeiGIiewGFoViGcEeHZFsGBzcOfY';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve specific HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'homePokemon.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'aboutPokemon.html'));
});

app.get('/help', (req, res) => {
    res.sendFile(path.join(__dirname, 'helpPokemon.html'));
});

// Serve specific CSS files
app.get('/homePokemon.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'homePokemon.css'));
});

app.get('/aboutPokemon.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'aboutPokemon.css'));
});

app.get('/helpPokemon.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'helpPokemon.css'));
});

// Serve specific JS files
app.get('/homePokemon.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'homePokemon.js'));
});

app.get('/aboutPokemon.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'aboutPokemon.js'));
});

app.get('/helpPokemon.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'helpPokemon.js'));
});

// Endpoint to register a new account
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;

    const { user, error } = await supabase.auth.signUp({
        email,
        password
    });

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ user });
});

// Endpoint to get user account data and Pokémon caught status
app.get('/api/get-caught-status', async (req, res) => {
    const { userId, pokemonName } = req.query;

    let { data, error } = await supabase
        .from('pokemon_caught')
        .select('caught')
        .eq('user_id', userId)
        .eq('pokemon_name', pokemonName)
        .single();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
});

// Endpoint to update Pokémon caught status
app.post('/api/set-caught-status', async (req, res) => {
    const { userId, pokemonName, caught } = req.body;

    let { data, error } = await supabase
        .from('pokemon_caught')
        .upsert({ user_id: userId, pokemon_name: pokemonName, caught }, { onConflict: ['user_id', 'pokemon_name'] });

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
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
