const PokemonService = require("../services/pokemon.service");
const PokeDolarService = require("../services/pokedolar.service")
const fileUtils = require("../utils/fileUtils");

/**
 * Get first page data
 * @param req
 * @param res
 * @returns void
 */
async function getFirstPageData(req, res) {
  try {
    let dolar = await PokeDolarService.getCurrentDollar()
    let pokemon = await PokemonService.getPokemon(dolar.replace(".", ""))
    response = {
      'dolar': dolar,
      'pokemon': pokemon
    }
    return res.json(response);
  } catch (e) {
    return res.json({ error: e });
  }
}

module.exports = {
  getFirstPageData,
};
