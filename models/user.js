const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  twitterId: { type: 'String', required: true, unique: true},
  
  //Posts
  postAmount: { type: "Number", default: 0, required: true },
  firstPosted: { type: "Date", required: false },
  lastSeen: { type: "Date", required: true, default: Date.now()},
  createdAt: { type: "Date", required: true, default: Date.now() },
  lastTweet: { type: 'String', required: false},

  //Arts
  pokeArts: [{ type: Schema.Types.ObjectId, ref: 'PokeArt' }]
});


module.exports = mongoose.model('User', userSchema);