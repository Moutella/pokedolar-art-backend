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
  if (!req.body.artName || !req.body.pokemon || !req.files) {
    res.status(403).end();
  }
  console.log(req.body);
  console.log(req.files);
  console.log(req.user);
  let author = req.user;
  let file = req.files.image;
  let pokeId = req.body.pokemon;
  let name = req.body.artName;
  
  
  //add author later
  try {
    let pokeArt = await PokeArtService.addPokeArt(file, pokeId, name, author);
    res.json(pokeArt);
  } catch (e) {
    console.log(e);
    
    res.status(403).json({ error: e });
    fileUtils.removeFile(file.file);
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
    console.log(pokeart);
    return res.json(pokeart)
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
  console.log(status);
  
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

async function getPendingArts(req, res){
  if (!req.user || !req.user.admin){
    return res.status(403).end()
  }

  try{
    pendingArts = await PokeArtService.getPendingArts();
    console.log(pendingArts)
    return res.json(pendingArts)
  }
  catch(e){
    res.status(500).end();
  }
}

module.exports = {
  getRandomPokeArt,
  getPokeArt,
  addPokeArt,
  deletePokeArt,
  changeApprovalPokeArt,
  getPendingArts
};
