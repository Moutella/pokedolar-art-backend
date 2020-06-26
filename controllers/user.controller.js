const User = require("../services/pokeart.service");
const axios = require('axios')

/**
 * Get all pokemons
 * @param req
 * @param res
 * @returns void
 */
async function loginWithTwitter(req, res) {
  try {
    
    return res.json(returnValue);
  } catch (e) {
    
    return res.json({ error: e });
  }
}


module.exports = {
  loginWithTwitter
};
