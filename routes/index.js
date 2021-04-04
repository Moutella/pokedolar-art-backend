const Router = require('express');
const router = new Router();
const baseRoute = require("../controllers/index")
const pokemonRoutes = require('./pokemon.routes')
const pokeartRoutes = require('./pokeart.routes')
const userRoutes = require('./user.routes');
const user = require('../models/user');

router.use('/', pokemonRoutes);
router.use('/', pokeartRoutes);
router.use('/', userRoutes);
router.route('/').get(baseRoute.getFirstPageData);

module.exports = router