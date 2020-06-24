const PokeArt = require('../models/pokeart');
const PokemonService = require('../services/pokemon.service')



async function getRandomPokeArt(){
  try{
    let randomPoke = await PokeArt.findOne({ approved: true})
                                  .select([
                                    'id',
                                    'name',
                                    'filePath',
                                    'author',
                                    'createdAt',
                                    'pokemon'
                                  ]).sort('id').populate('pokemon')
    return randomPoke
  }
  catch (e){
    throw new Error("Could not get all pokemons, please try again later")
  }

}

async function addPokeArt(pokeart, pokeid, name, author) {
  
  let pokemon = await PokemonService.getPokemon(pokeid);
  console.log(pokemon);
  console.log(pokemon._id);

  
  try {
    const newPokeArt= new PokeArt({
      name: name,
      pokemon: pokemon._id,
      filePath: `/${pokeart.uuid}/${pokeart.field}/${pokeart.filename}`,
    });
    await newPokeArt.save()
    return true;
  }
  catch (e){
    console.log(e);
    throw new Error("Could not save this pokemon to the database")
  }
}

async function getPokeArt(pokeid) {
  try {
    return PokeArt.findOne({ id: pokeid })
  }
  catch (e){
    
    throw new Error(`Could not find pokemon wth id ${pokeid}`)
  }
}
async function deletePokeArt(pokeid) {
  try {
    
    let pokemon = await Pokemon.findOne({ id: pokeid });
    await pokemon.remove();
    return pokemon
    }
  catch (e) {
    throw new Error(`Could not delete ${pokeid}`)
  }
}

module.exports = {
  getRandomPokeArt,
  addPokeArt,
  getPokeArt,
  deletePokeArt
}