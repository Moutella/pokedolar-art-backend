const serverConfig = require("../config");
const Pokemon = require("../models/pokemon");

async function getPokemons() {
  try {
    return Pokemon.find()
      .select(["id", "name", "pokeArts", "postAmount", 'officialPokeArts'])
      .sort("id");
  } catch (e) {
    throw new Error("Could not get all pokemons, please try again later");
  }
}

async function addPokemon(pokemon) {
  const newPokemon = new Pokemon(pokemon);
  try {
    return await newPokemon.save();
  } catch (e) {
    throw new Error("Could not save this pokemon to the database");
  }
}

async function getPokemon(pokeid) {
  try {
    let pokemon = await Pokemon.findOne({ id: pokeid })
    .populate("pokeArts").populate("officialPokeArts", 'filePath creatorText')
    .select([
      "id",
      "name",
      "postAmount",
      "pokeArts",
      "officialPokeArts",
    ]);
    for(art of pokemon.officialPokeArts){
      buildPokeArtUrl(art)
    }
    return pokemon
  } catch (e) {
    throw new Error(`Could not find pokemon wth id ${pokeid}`);
  }
}

async function getPokemonTweet(pokemonId){
  try{
      
    let pokemon = await Pokemon.findOne({ id: pokemonId })
      .populate({ path: 'pokeArts', populate: {path: 'author'}})
      .populate("officialPokeArts");

    for(art of pokemon.officialPokeArts){
      buildPokeArtUrl(art)
    }
    return pokemon
    
  } catch (e){
    throw new Error(`Could not find pokemon wth id ${pokemonId}`);
  }

}
async function deletePokemon(pokeid) {
  try {
    let pokemon = await Pokemon.findOne({ id: pokeid });
    let remove = await pokemon.remove();
    return pokemon;
  } catch (e) {
    throw new Error(`Could not delete ${pokeid}`);
  }
}

function  buildPokeArtUrl(art){
  art.filePath = serverConfig.CLOUDFRONT_URL + art.filePath
}

module.exports = {
  getPokemons,
  getPokemonTweet,
  addPokemon,
  getPokemon,
  deletePokemon,
};
