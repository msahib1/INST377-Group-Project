function navigate() {
    location.href = "homePokemon.html";
}

async function createSliderNGraph() {
    const picsContainer = document.getElementById("pics");
    
    for (let i = 0; i < 10; i++) {
        const pokemon = await getPokePics(Math.floor(Math.random() * 1025) + 1);
        picsContainer.appendChild(pokemon);
    }

    const slider = simpleslider.getSlider({
        container: picsContainer,
        prop: 'left',
        init: -612,
        show: 0,
        end: 612,
        unit: 'px'
    });
    
    await getGen(); // Ensure generation chart is loaded after images
}

async function getPokePics(num) {
    const pokemon = document.createElement('img');
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${num}`);
    const data = await response.json();
    pokemon.setAttribute("src", data.sprites.front_default);
    return pokemon;
}

async function getGen() {
    const genList = [];
    const labels = [];

    const response = await fetch(`https://pokeapi.co/api/v2/generation`);
    const data = await response.json();
    
    const promises = data.results.map(async (gen, index) => {
        const genResponse = await fetch(gen.url);
        const genData = await genResponse.json();
        genList.push(genData.pokemon_species.length);
        labels.push(`Gen ${index + 1}`);
    });

    await Promise.all(promises);

    const ctx = document.getElementById('genChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: "Number of New Pokémon per Generation",
                data: genList,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

window.onload = createSliderNGraph;
