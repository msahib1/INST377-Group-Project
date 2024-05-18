document.addEventListener('DOMContentLoaded', () => {
    const pokemonContainer = document.getElementById('pokemon-container');
    const searchInput = document.getElementById('search');
    const sortSelect = document.getElementById('sort');
    const filterGeneration = document.getElementById('filter-generation');
    const filterType = document.getElementById('filter-type');
    const filterCompletion = document.getElementById('filter-completion');

    let pokemonList = [];
    let caughtPokemon = new Set(JSON.parse(localStorage.getItem('caughtPokemon')) || []);

    const generations = [...Array(9).keys()].map(i => `Generation ${i + 1}`);
    generations.forEach(gen => {
        const option = document.createElement('option');
        option.value = gen.toLowerCase().replace(' ', '-');
        option.textContent = gen;
        filterGeneration.appendChild(option);
    });

    const types = ['Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'];
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type.toLowerCase();
        option.textContent = type;
        filterType.appendChild(option);
    });

    async function fetchPokemonData() {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151'); 
            const data = await response.json();
            const fetches = data.results.map(result => fetch(result.url).then(res => res.json()));
            pokemonList = await Promise.all(fetches);
            displayPokemon(pokemonList);
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
        }
    }

    function displayPokemon(pokemonArray) {
        pokemonContainer.innerHTML = '';
        pokemonArray.forEach(pokemon => {
            const pokemonCard = createPokemonCard(pokemon);
            pokemonContainer.appendChild(pokemonCard);
        });
    }

    function createPokemonCard(pokemon) {
        const card = document.createElement('div');
        card.className = 'pokemon-card';

        const image = document.createElement('img');
        image.src = pokemon.sprites.front_default;
        image.alt = pokemon.name;

        const name = document.createElement('h3');
        name.textContent = pokemon.name;

        const button = document.createElement('button');
        button.textContent = 'Catch';
        button.addEventListener('click', () => toggleCaught(pokemon.id, card));

        if (caughtPokemon.has(pokemon.id)) {
            const checkmark = document.createElement('div');
            checkmark.className = 'checkmark';
            checkmark.textContent = '✔';
            card.appendChild(checkmark);
        }

        card.appendChild(image);
        card.appendChild(name);
        card.appendChild(button);

        return card;
    }

    function toggleCaught(pokemonId, card) {
        if (caughtPokemon.has(pokemonId)) {
            caughtPokemon.delete(pokemonId);
            card.querySelector('.checkmark').remove();
        } else {
            caughtPokemon.add(pokemonId);
            const checkmark = document.createElement('div');
            checkmark.className = 'checkmark';
            checkmark.textContent = '✔';
            card.appendChild(checkmark);
        }
        localStorage.setItem('caughtPokemon', JSON.stringify([...caughtPokemon]));
    }

    function filterAndSortPokemon() {
        let filteredPokemon = [...pokemonList];
        const searchTerm = searchInput.value.toLowerCase();
        const selectedGeneration = filterGeneration.value;
        const selectedType = filterType.value;
        const selectedCompletion = filterCompletion.value;
        const sortOption = sortSelect.value;

        if (searchTerm) {
            filteredPokemon = filteredPokemon.filter(pokemon => pokemon.name.includes(searchTerm));
        }

        if (selectedGeneration !== 'all') {
            const generationNumber = parseInt(selectedGeneration.split('-')[1]);
            filteredPokemon = filteredPokemon.filter(pokemon => pokemon.id <= generationNumber * 151);
        }

        if (selectedType !== 'all') {
            filteredPokemon = filteredPokemon.filter(pokemon => pokemon.types.some(type => type.type.name === selectedType));
        }

        if (selectedCompletion !== 'all') {
            if (selectedCompletion === 'caught') {
                filteredPokemon = filteredPokemon.filter(pokemon => caughtPokemon.has(pokemon.id));
            } else if (selectedCompletion === 'uncaught') {
                filteredPokemon = filteredPokemon.filter(pokemon => !caughtPokemon.has(pokemon.id));
            }
        }

        if (sortOption === 'name') {
            filteredPokemon.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOption === 'number') {
            filteredPokemon.sort((a, b) => a.id - b.id);
        }

        displayPokemon(filteredPokemon);
    }

    searchInput.addEventListener('input', filterAndSortPokemon);
    sortSelect.addEventListener('change', filterAndSortPokemon);
    filterGeneration.addEventListener('change', filterAndSortPokemon);
    filterType.addEventListener('change', filterAndSortPokemon);
    filterCompletion.addEventListener('change', filterAndSortPokemon);

    fetchPokemonData();
});
