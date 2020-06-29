const pokedex = require('./files/pokedex.json')
const PokeArt = require('../models/pokeart')
const Pokemon = require('../models/pokemon');
const dynConfig = require("../models/dynconfig");
const mongoose = require('mongoose')
const config = require('../config')
const axios = require("axios");


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
  let request = await axios({
    method: "get",
    url:
      "http://cotacoes.economia.uol.com.br/cambioJSONChart.html?type=d&cod=BRL&mt=off",
  });

  let dolarValue = parseFloat(
    request.data[request.data.length - 1].ask
  ).toFixed(2);
  try {
    let dynConfDolar = await dynConfig.findOne({ key: "dolarValue" });
    if (dynConfDolar) {
      console.log(` Old dolar value: ${dynConfDolar.value}`);
    } else {
      let newDynconfDolar = new dynConfig({
        key: "currentValue",
        value: dolarValue,
      });
      newDynconfDolar.save();
    }
  } catch (e) {
    console.log(e);
  }
  return "OK"
})().catch(e => "ok");