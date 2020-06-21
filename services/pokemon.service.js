const Pokemon = require('../models/pokemon');
const { response } = require('express');

async function getPokemons(){
    return Pokemon.find().sort('id')
}

function addPokemon(pokemon) {
  
  const newPokemon = new Pokemon(pokemon);
  newPokemon.save((err, saved) => {
    if (err) {
      throw new Error("Could not save this pokemon to the database")
    }
    return 1
  });
}


module.exports = {
  getPokemons,
  addPokemon
}