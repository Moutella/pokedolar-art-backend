
const Router = require('express');
const router = new Router();

router.route('/login/twitter',
  passport.authenticate('twitter'));