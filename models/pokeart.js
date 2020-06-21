const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pokeArtSchema = new Schema({
  name: { type: "String", requred: true },
  id: { type: "Number", required: true },
  postAmount: { type: "Number", required: true },
  firstPosted: { type: "Date", required: false },
  lastPosted: { type: "Date", required: false },
  lastTweet: { type: 'String', required: false},
  createdAt: { type: 'Date', default: Date.now, required: false}
});


module.exports = mongoose.model('PokeArt', pokeArtSchema);