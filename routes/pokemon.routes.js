const Router =require('express');
const PokemonController = require('../controllers/pokemon.controller');
const router = new Router();

router.route('/pokemon').get(PokemonController.getPokemons);
router.route('/pokemon/:pokeid').get(PokemonController.getPokemon);
router.route('/pokemon').post(PokemonController.addPokemon);
router.route('/pokemon/:pokeid').delete(PokemonController.deletePokemon);

module.exports = router