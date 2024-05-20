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
    generations.forEach((gen, i) => {
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
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=600'); 
            const data = await response.json();
            const fetches = data.results.map(result => fetch(result.url).then(res => res.json()));
            pokemonList = await Promise.all(fetches);
            await fetchGenerationData(pokemonList);
            displayPokemon(pokemonList);
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
        }
    }

    async function fetchGenerationData(pokemonArray) {
        const generationMapping = {
            'generation i': 'generation-1',
            'generation ii': 'generation-2',
            'generation iii': 'generation-3',
            'generation iv': 'generation-4',
            'generation v': 'generation-5',
            'generation vi': 'generation-6',
            'generation vii': 'generation-7',
            'generation viii': 'generation-8',
            'generation ix': 'generation-9',
        };

        for (const pokemon of pokemonArray) {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`);
                const data = await response.json();
                const gen = data.generation.name.replace(/-/g, ' '); 
                pokemon.generation = generationMapping[gen];
            } catch (error) {
                console.error(`Error fetching generation data for ${pokemon.name}:`, error);
            }
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
        card.setAttribute('data-generation', pokemon.generation);

        const image = document.createElement('img');
        image.src = pokemon.sprites.front_default;
        image.alt = pokemon.name;

        const name = document.createElement('a');
        name.textContent = pokemon.name;
        name.href = `infoPokemon.html?pokemon=${pokemon.name}`;

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
            filteredPokemon = filteredPokemon.filter(pokemon => pokemon.generation === selectedGeneration);
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
