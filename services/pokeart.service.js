const serverConfig = require("../config");
const PokeArt = require("../models/pokeart");
const PokemonService = require("../services/pokemon.service");
const Pokemon = require("../models/pokemon");
const fileUtils = require("../utils/fileUtils");
const AWSUtils = require('../utils/awsUtils')

async function getRandomPokeArt() {
  try {
    let randomPoke = await PokeArt.findOne({ approved: true })
      .select(["id", "name", "filePath", "author", "createdAt", "pokemon", "lastTweet", "lastPosted"])
      .populate("pokemon");
    buildPokeArtUrl(randomPoke)
    return randomPoke;
  } catch (e) {
    throw new Error("Could not get all arts, please try again later");
  }
}

async function addPokeArt(pokeart, pokeid, name, author) {
  let pokemon = await PokemonService.getPokemon(pokeid);
  try {
    let awsUtils = new AWSUtils()
    awsUtils.putFile(pokeart.file, `pokearts/fanarts/${pokeart.uuid}${pokeart.field}${pokemon._id}.png`)
    const newPokeArt = new PokeArt({
      name: name,
      pokemon: pokemon._id,
      filePath: `pokearts/fanarts/${pokeart.uuid}${pokeart.field}${pokemon._id}.png`,
      author: author._id,
    });
    console.log(pokeart);
    fileUtils.removeFile(pokeart.file);
    let pokeArt = await newPokeArt.save();
    return pokeArt;
  } catch (e) {
    throw new Error("Could not save this art to the database");
  }
}

async function getPokeArt(pokeArtId) {
  try {
    let art = await PokeArt.findOne({ _id: pokeArtId }).populate('author').populate('pokemon');
    buildPokeArtUrl(art)
    return art
  } catch (e) {
    throw new Error(`Could not find pokemon wth id ${pokeArtId}`);
  }
}
async function deletePokeArt(pokeArtId) {
  try {
    let pokeart = await PokeArt.findOne({ _id: pokeArtId });
    let pokemon = await Pokemon.findById(pokeart.pokemon).populate('pokeArts');
    await pokemon.pokeArts.remove(pokeart);
    
    
    Promise.all([await pokemon.save(), await pokeart.remove()]);
    
    
    return pokeart;
  } catch (e) {
    throw new Error(`Could not delete ${pokeid}`);
  }
}

async function changeApprovalPokeArt(pokeArtId, approvalStatus) {
  try {
    let approvedPokeArt = await PokeArt.findOne({ _id: pokeArtId });
    approvedPokeArt.reviewed = true;
    approvedPokeArt.approved = approvalStatus;
    let pokemon = await Pokemon.findById(approvedPokeArt.pokemon).populate(
      "pokeArts"
    );
    if (approvedPokeArt.approved) {
      await pokemon.pokeArts.addToSet(approvedPokeArt);
    } else {
      await pokemon.pokeArts.remove(approvedPokeArt);
    }

    await Promise.all([approvedPokeArt.save(), pokemon.save()]);
    return true;
  } catch (e) {
    throw new Error("Could not approve PokeArt");
  }
}

async function getUserArts(author){
  let approvedArts = await PokeArt.find({author: author._id, approved: true})
  for(art in approvedArts){
    buildPokeArtUrl(art)
  }
  return approvedArts;
}

async function getPendingArts(){
  let pendingArts = await PokeArt.find({reviewed: false}).populate("author").populate('pokemon')
  for(art of pendingArts){
    buildPokeArtUrl(art)
  }
  return pendingArts;
}

async function updateTweetAndCount(pokeArtId, tweetId){
  try {
    let pokeArt = await PokeArt.findOne({ _id: pokeArtId });
    let date = new Date();
    if (!pokeArt.firstPosted) {
      pokeArt.firstPosted = date;
    }
    pokeArt.postAmount += 1;
    pokeArt.lastTweet = tweetId;
    pokeArt.lastPosted = date

    await Promise.all([pokeArt.save()]);
    return true;
  } catch (e) {
    console.log(e);
    throw new Error("Could not approve PokeArt");
  }
}

function  buildPokeArtUrl(art){
  art.filePath = serverConfig.CLOUDFRONT_URL + art.filePath
}

module.exports = {
  getRandomPokeArt,
  addPokeArt,
  getPokeArt,
  deletePokeArt,
  changeApprovalPokeArt,
  getUserArts,
  getPendingArts,
  updateTweetAndCount
};
