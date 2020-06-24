const sanitizeHtml = require("sanitize-html");
const PokemonService = require("../services/pokemon.service");

/**
 * Get all pokemons
 * @param req
 * @param res
 * @returns void
 */
async function getPokemons(req, res) {
  try {
    returnValue = await PokemonService.getPokemons();
    res.json(returnValue);
  } catch (e) {
    return res.json({ error: e });
  }
}

/**
 * Save a Pokemon
 * @param req
 * @param res
 * @returns void
 */
async function addPokemon(req, res) {
  if (!req.body.name || !req.body.id) {
    res.status(403).end();
  }

  let pokemon = {};
  pokemon.id = sanitizeHtml(req.body.id);
  pokemon.name = sanitizeHtml(req.body.name);

  try {
    let newPokemon = await PokemonService.addPokemon(pokemon);
    res.json({ success: true, pokemon: newPokemon });
  } catch (e) {
    res.status(403).json({ error: e });
  }
}

/**
 * Get a single pokemon
 * @param req
 * @param res
 * @returns void
 */
async function getPokemon(req, res) {
  if (!req.params.pokeid){
    res.status(403).end();
  }

  try {
    let pokeid = req.params.pokeid
    let pokemon = await PokemonService.getPokemon(pokeid);
    return res.json({pokemon: pokemon})
  }
  catch (e) {
    res.status(403).json({ error: e });
  }
}

/**
 * Delete a pokemon
 * @param req
 * @param res
 * @returns void
 */
async function deletePokemon(req, res) {
  if (!req.body.pokemon.id) {
    res.status(403).end();
  }
  let pokeid = req.body.pokemon.id;
  try {
    let deleted = await PokemonService.deletePokemon(pokeid);
    return res.json({success: `Successfuly deleted ${pokeid}:${deleted.name}`})
  }
  catch (e){
    res.status(403).json({ error: e.message });
  }
}

module.exports = {
  getPokemons,
  getPokemon,
  addPokemon,
  deletePokemon,
};
