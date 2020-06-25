
const Router = require('express');
const router = new Router();

router.route('/pokemon').get(PokemonController.getPokemons);

router.route('/login/twitter',
  passport.authenticate('twitter'));