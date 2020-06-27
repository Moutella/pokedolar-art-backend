const Pokemon = require('../models/pokemon');

async function getPokemons(){
  try{
    return Pokemon.find().populate('pokeArts').select(['id', 'name', 'pokeArts', 'postAmount']).sort('id')
  }
  catch (e){
    throw new Error("Could not get all pokemons, please try again later")
  }

}

async function addPokemon(pokemon) {
  
  const newPokemon = new Pokemon(pokemon);
  try {
    return await newPokemon.save()
  }
  catch (e){
    throw new Error("Could not save this pokemon to the database")
  }
}

async function getPokemon(pokeid) {
  try {
    return Pokemon.findOne({ id: pokeid }).select(['id', 'name', 'pokeArts', 'postAmount'])
  }
  catch (e){
    throw new Error(`Could not find pokemon wth id ${pokeid}`)
  }
  
    
}
async function deletePokemon(pokeid) {
  try {
    
    let pokemon = await Pokemon.findOne({ id: pokeid });
    let remove = await pokemon.remove();
    return pokemon
    }
  catch (e) {
    throw new Error(`Could not delete ${pokeid}`)
  }
}

module.exports = {
  getPokemons,
  addPokemon,
  getPokemon,
  deletePokemon
}