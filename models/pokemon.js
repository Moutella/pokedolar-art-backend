const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pokemonSchema = new Schema({
  name: { type: "String", requred: true, unique: true },
  id: { type: "Number", required: true, unique: true },
  
  //Posts
  postAmount: { type: "Number", default: 0, required: true },
  firstPosted: { type: "Date", required: false },
  lastPosted: { type: "Date", required: false },
  lastTweet: { type: 'String', required: false},

  //Arts
  pokeArts: [{ type: Schema.Types.ObjectId, ref: 'PokeArt' }]
});


module.exports = mongoose.model('Pokemon', pokemonSchema);