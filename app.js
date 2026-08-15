function openMenu() {
  document.querySelector(".menu").classList.add("menu--open");
}

function closeMenu() {
  document.querySelector(".menu").classList.remove("menu--open");
}

async function fetchPokemonData(pokemon) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
    return null;
  }
}

const featuredPokemon = [
  "charizard",
  "gyarados",
  "dragonite",
  "gengar",
  "lapras",
  "moltres",
  "zapdos",
  "articuno",
  "mewtwo",
  "mew"
];



let lastIndex = -1;

async function displayFeaturedPokemon() {
  let randomIndex;

  do {
    randomIndex = Math.floor(Math.random() * featuredPokemon.length);
  } while (randomIndex === lastIndex);

  lastIndex = randomIndex;

  const pokemonName = featuredPokemon[randomIndex];
  const pokemon = await fetchPokemonData(pokemonName);

  const heroPokemon = document.querySelector(".hero__pokemon");

  heroPokemon.src = pokemon.sprites.front_shiny;
  heroPokemon.alt = `Shiny ${pokemon.name}`;
}


async function displayPokemon(pokemon) {
  const pokemonData = await fetchPokemonData(pokemon);

  if (!pokemonData) {
    return;
  }

  const pokemonList = document.querySelector(".pokemon__list");

  const typesHTML = pokemonData.types
    .map((type) => {
      return `
        <span class="pokemon__type pokemon__type--${type.type.name}">
          ${type.type.name}
        </span>
      `;
    })
    .join("");


  pokemonList.innerHTML += `
    <div class="pokemon__card">

      <span class="pokemon__number">
        #${pokemonData.id.toString().padStart(3, "0")}
      </span>

      <img
        src="${pokemonData.sprites.front_shiny}"
        alt="Shiny ${pokemonData.name}"
        class="pokemon__image"
      />

      <h3 class="pokemon__name">
        ${pokemonData.name}
      </h3>

      <div class="pokemon__types">
        ${typesHTML}
      </div>

    </div>
  `;
}

async function displayKantoPokemon() {
  for (let i = 1; i <= 151; i++) {
    await displayPokemon(i);
  }
}

const searchInput = document.querySelector(".hero__search--input");

searchInput.addEventListener("input", () => {
  const searchValue = searchInput.value.toLowerCase().trim();
  const pokemonCards = document.querySelectorAll(".pokemon__card");

  pokemonCards.forEach((card) => {
    const pokemonName = card
      .querySelector(".pokemon__name")
      .textContent
      .toLowerCase();

    const pokemonNumber = card
      .querySelector(".pokemon__number")
      .textContent;

    const matchesSearch =
      pokemonName.includes(searchValue) ||
      pokemonNumber.includes(searchValue);

    card.style.display = matchesSearch ? "" : "none";
  });
});

displayFeaturedPokemon();
setInterval(displayFeaturedPokemon, 5000);

displayKantoPokemon();