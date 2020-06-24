const PokeArt = require('../models/pokeart');
const PokemonService = require('../services/pokemon.service');
const Pokemon = require('../models/pokemon');



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

  
  try {
    const newPokeArt= new PokeArt({
      name: name,
      pokemon: pokemon._id,
      filePath: `/${pokeart.uuid}/${pokeart.field}/${pokeart.filename}`,
      author: author
    });
    
    await newPokeArt.save()
    return true;
  }
  catch (e){
    console.log(e);
    throw new Error("Could not save this pokemon to the database")
  }
}

async function getPokeArt(pokeartId) {
  try {
    return await PokeArt.findOne({ id: pokeartId })
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



async function approvePokeArt(pokeartId) {
  try{
    let approvedPokeArt = await PokeArt.findOne({_id:pokeartId});
    approvedPokeArt.reviewed = true;
    approvedPokeArt.approved = true;
    let pokemon = await Pokemon.findById(approvedPokeArt.pokemon).populate('pokeArts');
    await pokemon.pokeArts.addToSet(approvedPokeArt);
    await Promise.all([approvedPokeArt.save(), pokemon.save()]);
    return true;
  }
  catch (e){
    console.log(e);
    throw new Error("Could not approve PokeArt")
  }
}

async function revokePokeArt(pokeartId) {
  try{
    let revokedPokeArt = await PokeArt.findOne({_id:pokeartId});
    revokedPokeArt.reviewed = true;
    revokedPokeArt.approved = false;
    let pokemon = await Pokemon.findById(revokedPokeArt.pokemon);
    await pokemon.pokeArts.pull(revokedPokeArt);
    await Promise.all([revokedPokeArt.save(), pokemon.save()]);
    return true;
  }
  catch (e){
    throw new Error("Could not approve PokeArt");
  }
}


module.exports = {
  getRandomPokeArt,
  addPokeArt,
  getPokeArt,
  deletePokeArt,
  approvePokeArt,
  revokePokeArt
}