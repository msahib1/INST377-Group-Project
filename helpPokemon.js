document.getElementById("searchForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const pokemonName = document.getElementById("pokemonName").value.toLowerCase();

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        .then(response => response.json())
        .then(data => {
            const pokemonImage = data.sprites.front_default;
            document.getElementById("pokemonImage").innerHTML = `<img src="${pokemonImage}" alt="${pokemonName}">`;
        })
        .catch(error => {
            console.error('Error fetching Pokemon:', error);
            document.getElementById("pokemonImage").innerHTML = "Pokemon not found.";
        });
});