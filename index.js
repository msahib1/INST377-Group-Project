const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const SUPABASE_URL = 'https://bikicgbweumnlghjjkbg.supabase.co'; 
const SUPABASE_KEY = 'YOUR_SUPABASE_KEY'; // Replace with your Supabase key
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
