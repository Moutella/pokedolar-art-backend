const pokedex = require('./files/pokedex.json')
const Pokemon = require('../models/pokemon');
const PokedolarService = require('../services/pokedolar.service');
const mongoose = require('mongoose')
const config = require('../config');


mongoose.connect(config.mongoURL);
for(pokemon of pokedex){
  console.log(pokemon.id);
}

(async () => {
  for(pokemon of pokedex){
      try{
        let pokemonObj = await Pokemon.findOne({id: pokemon.id});
        if(!pokemonObj){
          let newPokemon = new Pokemon({
            id: pokemon.id,
            name: pokemon.name.english,
            type: pokemon.type
          })
          newPokemon.save()
        }
        else{
          throw new Error(`Pokemon ${pokemon.id}: ${pokemon.name.english} already in the DB`)
        }
      }
      catch (e){
        console.log(e)
      }
    }
  let value = await PokedolarService.updateCurrentDollar();
  console.log(value);
  await PokedolarService.updateLastTweetDollar(value);
  return "OK"
})().catch(e => "ok");