const pokeCard = document.querySelector('[data-poke-card]');
const pokeName = document.querySelector('[data-poke-name]');
const pokeImg = document.querySelector('[data-poke-img]');
const pokeImgContainer = document.querySelector('[data-poke-img-container]');
const pokeId = document.querySelector('[data-poke-id]');
const pokeTypes = document.querySelector('[data-poke-types]');
const pokeStats = document.querySelector('[data-poke-stats]');
const shinyButtonContainer = document.querySelector('[data-poke-shiny-container]');
console.log(shinyButtonContainer); // Debería mostrar el elemento si está correctamente referenciado
let shiny = false;

const typeColors = {
    fire: '#FF675C',
    grass: '#4A9681',
    water: '#0596C7',
    electric: '#FFEA70',
    normal: '#BDBFC1',
    ice: '#AFEAFD',
    rock: '#999799',
    flying: '#AFDCFF',
    psychic: '#FFC6D9',
    ghost: '#561D25',
    bug: '#A2FAA3',
    poison: '#551187',
    ground: '#D2B074',
    dragon: '#DA627D',
    steel: '#1D8A99',
    fighting: '#2F2F2F',
    fairy: '#F9A1BC',
    default: '#2A1A1F',
}

const receiveInput = event => {
    event.preventDefault(); //Se cancela el submit del formulario.
    searchPokemon(event.target.pokemon.value); //Se llama a la función searchPokemon.
    shiny = false; // Se asegura de que no se muestre la versión shiny

}
const searchPokemon = value => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${value.toLowerCase()}`) //Se hace la petición a la API.
        .then(data => data.json()) //Se convierte la respuesta a JSON.
        .then(response => renderPokemonData(response)) //Se llama a la función renderPokemonData con los datos obtenidos.
        .catch(err => renderNotFound()); //Se maneja el error.
}

const renderPokemonData = data => {
    shinyButtonContainer.classList.remove('hidden');
    let sprite;
    if (!shiny) {
        sprite = data.sprites.front_default; //Se obtiene la imagen del pokemon.   
    }
    else {
        sprite = data.sprites.front_shiny; //Se obtiene la imagen shiny del pokemon.
    }
    const { stats, types } = data; //Se obtienen las stats y los tipos del pokemon.
    const name = data.name; //Se obtiene el nombre del pokemon.
    const id = data.id; //Se obtiene el id del pokemon.

    pokeName.textContent = name; //Se asigna el nombre al elemento h2.
    pokeImg.setAttribute('src', sprite); //Se asigna la imagen al elemento img.
    pokeId.textContent = `N° ${id}`;
    setCardColor(types);
    renderPokemonTypes(types);
    renderPokemonStats(stats);
}

const setCardColor = types => {
    const colorOne = typeColors[types[0].type.name]; //Se obtiene el color del primer tipo.
    const colorTwo = types[1] ? typeColors[types[1].type.name] : typeColors.default; //Se obtiene el color del segundo tipo si existe, si no se asigna el color default.
    pokeImg.style.background = `radial-gradient(${colorTwo} 33%, ${colorOne} 33%)`; //Se asigna el gradiente al fondo de la imagen.
    pokeImg.style.backgroundSize = '5px 5px'; //Se asigna el tamaño del gradiente.
}

const renderPokemonTypes = types => {
    pokeTypes.innerHTML = ''; //Se limpia los tipos anteriores.
    types.forEach(type => {
        const typeTextElement = document.createElement('div'); //Se crea un div.
        typeTextElement.style.color = typeColors[type.type.name]; //Se asigna el color del tipo.
        typeTextElement.textContent = type.type.name; //Se asigna el nombre del tipo.
        pokeTypes.appendChild(typeTextElement); //Se agrega el div al contenedor de tipos.
    });
}

const renderPokemonStats = stats => {
    pokeStats.innerHTML = ''; //Se limpian las stats anteriores.
    stats.forEach(stat => {
        const statElement = document.createElement('div'); //Se crea un div general para las stats.
        const statElementName = document.createElement('div'); //Se crea un div para el nombre de la stat.
        const statElementAmount = document.createElement('div'); //Se crea un div para el valor de la stat.
        statElementName.textContent = stat.stat.name; //Se asigna el nombre de la stat.
        statElementAmount.textContent = stat.base_stat; //Se asigna el valor de la stat.
        statElement.appendChild(statElementName); //Se agrega el div del nombre al div general.
        statElement.appendChild(statElementAmount); //Se agrega el div del valor al div general.
        pokeStats.appendChild(statElement); //Se agrega el div general al contenedor de stats.
    });
}

const renderNotFound = () => {
    shinyButtonContainer.classList.add('hidden');
    pokeName.textContent = '???'; //Se asigna un mensaje de error.
    pokeImg.setAttribute('src', '/images/unknown-poke.png'); //Se asigna una imagen de pokeball.
    pokeImg.style.background = '#f3f4f7'; //Se asigna un color de fondo.
    pokeTypes.innerHTML = ''; //Se limpian los tipos.
    pokeStats.innerHTML = ''; //Se limpian las stats.
    pokeId.textContent = ''; //Se limpia el id.
}

const toggleShiny = () => {
    shiny = !shiny; // Se cambia el valor de shiny
    searchPokemon(pokeName.textContent); // Se vuelve a buscar el pokemon
}

async function actualizarPlaceholder() {
    try {
        // Llama a la API para obtener un Pokémon aleatorio
        const response = await fetch('https://pokeapi.co/api/v2/pokemon-species?limit=1&offset=' + Math.floor(Math.random() * 1024));
        const data = await response.json();
        const randomName = data.results[0].name;

        // Actualiza el placeholder con el nombre obtenido
        document.getElementById('input').placeholder = `Try with: ${randomName}`;
    } catch (error) {
        console.error('Error fetching random Pokémon:', error);
    }
}

// Llama a la función para cargar el placeholder al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarPlaceholder();
});




