const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pokemonSchema = new Schema({
  name: { type: "String", requred: true },
  id: { type: "Number", required: true },
  postAmount: { type: "Number", default: 0, required: true },
  firstPosted: { type: "Date", required: false },
  lastPosted: { type: "Date", required: false },
  lastTweet: { type: 'String', required: false}
});


module.exports = mongoose.model('Pokemon', pokemonSchema);