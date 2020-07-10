const PokeArtService = require("../services/pokeart.service");
const fileUtils = require('../utils/fileUtils');

/**
 * Get all pokemons
 * @param req
 * @param res
 * @returns void
 */
async function getRandomPokeArt(req, res) {
  try {
    let returnValue = await PokeArtService.getRandomPokeArt();
    return res.json(returnValue);
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
async function addPokeArt(req, res) {
  if (!req.body.artName || !req.body.pokeid || !req.files) {
    res.status(403).end();
  }
  let author = req.user;
  let file = req.files.pokeart;
  let pokeId = req.body.pokeid;
  let name = req.body.artName;
  
  //add author later
  try {
    let pokeArtId = await PokeArtService.addPokeArt(file, pokeId, name, author);
    res.json({ success: pokeArtId });
  } catch (e) {
    fileUtils.removeFile(file.file);
    res.status(403).json({ error: e });
  }
}

/**
 * Get a single pokemon
 * @param req
 * @param res
 * @returns void
 */
async function getPokeArt(req, res) {
  if (!req.body){
    res.status(403).end();
  }
  try {
    let artid = req.params.artid
    let pokeart = await PokeArtService.getPokeArt(artid);
    return res.json({pokeart: pokeart})
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
async function deletePokeArt(req, res) {
  if (!req.query.id) {
    return res.status(403).end();
  }
  let pokeArtId = req.query.id;
  try {
    let deleted = await PokeArtService.deletePokeArt(pokeArtId);
    return res.json({success: `Successfuly deleted ${pokeArtId}:${deleted.name}`})
  }
  catch (e){
    return res.status(403).json({ error: e });
  }
}




async function changeApprovalPokeArt(req, res) {
  if (!req.query.id) {
    return res.status(403).end();
  }
  
  let pokeArtId = req.query.id;
  let status = req.query.status;
  
  try {
    await PokeArtService.changeApprovalPokeArt(pokeArtId, status);
    status_string = "Revoked"
    if (status != 'false'){
      status_string = "Approved"
    }
    return res.json({success: `${status_string} pokeart ${pokeArtId}`})
  }
  catch(e){
    return res.status(403).json({ error: e });
  }
}

module.exports = {
  getRandomPokeArt,
  getPokeArt,
  addPokeArt,
  deletePokeArt,
  changeApprovalPokeArt
};
