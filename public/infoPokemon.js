document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const pokemonName = params.get('pokemon');
    if (pokemonName) {
        document.getElementById('pokemonName').value = pokemonName;
        createPokemon();
    }
    checkAuthState();
});

async function createPokemon() {
    const pokemonName = document.getElementById("pokemonName").value.toLowerCase();
    const container = document.getElementById("pokemonInformation");
    const caughtContainer = document.getElementById("pokemonCaughtContainer");
    container.innerHTML = ''; // Clear previous information
    caughtContainer.innerHTML = ''; // Clear previous checkbox

    const pokemonID = document.createElement("p");
    const pokemonAbilities = document.createElement("p");
    const pokemonTypes = document.createElement("p");
    const pokemonGen = document.createElement("p");
    const pokemonLoc = document.createElement("p");

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        .then(response => response.json())
        .then(data => {
            const pokemonImage = data.sprites.front_default

            const Id = data.id;
            const abilities = [];
            const types = [];

            data.abilities.forEach(item => {
                abilities.push(item.ability.name.replace(/-/g, ' '));
            });
            data.types.forEach(item => {
                types.push(item.type.name.replace(/-/g, ' ')); 
            });
            
            document.getElementById("pokemonImage").innerHTML = `<img src="${pokemonImage}" alt="${pokemonName.replace(/-/g, ' ')}">`;
            pokemonID.textContent = `ID: ${Id}`;
            pokemonAbilities.textContent = `Abilities: ${abilities.join(', ')}`;
            pokemonTypes.textContent = `Types: ${types.join(', ')}`;

            container.append(pokemonID);
            container.append(pokemonAbilities);
            container.append(pokemonTypes);
            
            console.log(container)

            loadCaughtState(pokemonName, caughtContainer);
        })
        .catch(error => {
            console.error('Error fetching Pokemon:', error);
            document.getElementById("pokemonImage").innerHTML = "Pokemon not found.";
        });

    fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`)
        .then(response => response.json())
        .then(data => {
            const gen = data.generation.name.replace(/-/g, ' '); 
            pokemonGen.textContent = `Generation: ${gen}`;
            container.append(pokemonGen);
        })
        .catch(error => {
            console.error('Error fetching Pokemon generation:', error);
        });

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/encounters`)
        .then(response => response.json())
        .then(data => {
            const loc = [];
            data.forEach(item => {
                loc.push(item.location_area.name.replace(/-/g, ' ')); 
            });
            pokemonLoc.textContent = `Locations: ${loc.join(', ')}`;
            container.append(pokemonLoc);
        })
        .catch(error => {
            console.error('Error fetching Pokemon locations:', error);
        });
}

async function loadCaughtState(pokemonName, container) {
    const userId = localStorage.getItem('userId'); // Get user ID from local storage
    if (!userId) {
        //console.error('User is not authenticated');
        return;
    }

    try {
        const response = await fetch(`/api/get-caught-status?userId=${userId}&pokemonName=${pokemonName}`);
        const data = await response.json();

        const caughtCheckbox = document.createElement('input');
        caughtCheckbox.type = 'checkbox';
        caughtCheckbox.id = 'caughtCheckbox';
        caughtCheckbox.name = 'caughtCheckbox';
        caughtCheckbox.checked = data ? data.caught : false;

        const checkboxLabel = document.createElement('label');
        checkboxLabel.setAttribute('for', 'caughtCheckbox');
        checkboxLabel.textContent = `Caught ${pokemonName.replace(/-/g, ' ')}:`;

        container.appendChild(checkboxLabel);
        container.appendChild(caughtCheckbox);

        caughtCheckbox.addEventListener('change', () => {
            saveCaughtState(pokemonName, caughtCheckbox.checked);
        });
    } catch (error) {
        console.error('Error loading caught state:', error);
    }
}

async function saveCaughtState(pokemonName, state) {
    const userId = localStorage.getItem('userId'); // Get user ID from local storage
    if (!userId) {
        console.error('User is not authenticated');
        return;
    }

    try {
        const response = await fetch('/api/set-caught-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, pokemonName, caught: state })
        });

        const data = await response.json();
        console.log('Saved caught state:', data);
    } catch (error) {
        console.error('Error saving caught state:', error);
    }
}

async function registerUser() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log('Registered user:', data);
        if (data.user) {
            localStorage.setItem('userId', data.user.id); // Store the user ID in local storage
        }
    } catch (error) {
        console.error('Error registering user:', error);
    }
}

async function loginUser() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log('Logged in user:', data);
        if (data.user) {
            localStorage.setItem('userId', data.user.id); // Store the user ID in local storage
        }
    } catch (error) {
        console.error('Error logging in user:', error);
    }
}


function checkAuthState() {
    const userId = localStorage.getItem('userId');
    if (userId) {
        // User is logged in
    } else {
        // User is not logged in
    }
}

