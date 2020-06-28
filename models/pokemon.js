const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pokemonSchema = new Schema({
  name: { type: "String", required: true, unique: true },
  id: { type: "Number", required: true, unique: true },
  type: [{type: "String"}],
  //Posts
  postAmount: { type: "Number", default: 0, required: true },
  firstPosted: { type: "Date", required: false },
  lastPosted: { type: "Date", required: false },
  lastTweet: { type: 'String', required: false},

  //Arts
  officialPokeArts: [{ type: Schema.Types.ObjectId, ref: 'PokeArt' }],
  pokeArts: [{ type: Schema.Types.ObjectId, ref: 'PokeArt' }]
});


module.exports = mongoose.model('Pokemon', pokemonSchema);