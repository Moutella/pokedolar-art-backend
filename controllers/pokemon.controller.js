const sanitizeHtml = require('sanitize-html');
const PokemonService = require('../services/pokemon.service');
const pokemon = require('../models/pokemon');
const sanitize = require('sanitize-html');

/**
 * Get all pokemons
 * @param req
 * @param res
 * @returns void
 */
async function getPokemons(req, res) {
  try{
    returnValue = await PokemonService.getPokemons()
    console.log(returnValue)
    res.json(returnValue)
  }
  catch (e){
    console.log(e)
    return res.json({error: "Something went wrong"})
  }
    
}

/**
 * Save a Pokemon
 * @param req
 * @param res
 * @returns void
 */
function addPokemon(req, res) {
  
  if (!req.body.pokemon.name || !req.body.pokemon.id ) {
    console.log(req.body);
    res.status(403).end();
  }
  let pokemon = req.body.pokemon;
  pokemon.id = sanitizeHtml(pokemon.id);
  pokemon.name = sanitizeHtml(pokemon.name);
  try{
    PokemonService.addPokemon(pokemon)
    res.json({'success': true});
  }
  catch (e) {
    console.log(e);
    res.status(403).json({error: "True"})
  }
}

/**
 * Get a single pokemon
 * @param req
 * @param res
 * @returns void
 */
function getPokemon(req, res) {
  Pokemon.findOne({ cuid: req.params.cuid }).exec((err, pokemon) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ pokemon });
  });
}

/**
 * Delete a pokemon
 * @param req
 * @param res
 * @returns void
 */
function deletePokemon(req, res) {
  Pokemon.findOne({ cuid: req.params.cuid }).exec((err, pokemon) => {
    if (err) {
      res.status(500).send(err);
    }

    pokemon.remove(() => {
      res.status(200).end();
    });
  });
}

module.exports = {
  getPokemons,
  getPokemon,
  addPokemon,
  deletePokemon
}