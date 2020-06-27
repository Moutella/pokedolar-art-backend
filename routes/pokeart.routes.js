const Router =require('express');
const PokeArtController = require('../controllers/pokeart.controller')

const router = new Router();
const passport = require('passport')

router.route('/pokeart/random').get(PokeArtController.getRandomPokeArt);

router.route('/pokeart/changeapproval').patch(passport.authenticate('jwt', {session:false}), PokeArtController.changeApprovalPokeArt);
router.route('/pokeart').post(passport.authenticate('jwt', {session:false}), PokeArtController.addPokeArt);

router.route('/pokeart/:artid').get(PokeArtController.getPokeArt);
router.route('/pokeart/:artid').delete(passport.authenticate('jwt', {session:false}), PokeArtController.deletePokeArt);


module.exports = router