function navigate(){
    location.href = "homePokemon.html";
}

async function createSlider(){
    for(let i = 0; i < 10; i++) {
        var pokemon = await getPokePics(Math.floor(Math.random() * (1025) + 1));
        document.getElementById("pics").appendChild(pokemon);
    }

    var slider = simpleslider.getSlider({
        container: document.getElementById("pics"),
        prop: 'left',
        init: -612,
        show: 0,
        end: 612,
        unit: 'px'
    });
}

function getPokePics(num){
    var pokemon = document.createElement('img');
    fetch(`https://pokeapi.co/api/v2/pokemon/${num}`)
    .then((res) => res.json())
    .then((res) => {
        pokemon.setAttribute("src", res.sprites.front_default);
        console.log('res')
    })
    return pokemon;
}

window.onload = createSlider