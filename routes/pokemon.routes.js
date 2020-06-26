const Router =require('express');
const PokemonController = require('../controllers/pokemon.controller');
const router = new Router();

const passport = require('passport')

router.route('/pokemon').get(PokemonController.getPokemons);
router.route('/pokemon/:pokeid').get(PokemonController.getPokemon);
router.route('/pokemon').post(passport.authenticate('jwt', {session:false}), PokemonController.addPokemon);
router.route('/pokemon/:pokeid').delete(PokemonController.deletePokemon);

module.exports = router