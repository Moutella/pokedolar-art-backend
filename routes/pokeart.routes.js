const Router =require('express');
const PokeArtController = require('../controllers/pokeart.controller')

const router = new Router();

router.route('/pokeart/random').get(PokeArtController.getRandomPokeArt);
router.route('/pokeart/approve').patch(PokeArtController.approvePokeArt);
router.route('/pokeart/revoke').patch(PokeArtController.revokePokeArt);
router.route('/pokeart').post(PokeArtController.addPokeArt);

router.route('/pokeart/:artid').get(PokeArtController.getPokeArt);
router.route('/pokeart/:artid').delete(PokeArtController.deletePokeArt);


module.exports = router