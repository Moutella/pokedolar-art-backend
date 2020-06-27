const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  twitterId: { type: 'String', required: true, unique: true},
  twitterUsername: { type: 'String', required: true },
  twitterDisplayName: { type: 'String', required: true },
  profileImageUrl: { type: 'String', required: true},
  //Posts
  postAmount: { type: "Number", default: 0, required: true },
  firstPosted: { type: "Date", required: false },
  lastSeen: { type: "Date", required: true, default: Date.now()},
  createdAt: { type: "Date", required: true, default: Date.now() },
  lastTweet: { type: 'String', required: false},
  
  //Arts
  pokeArts: [{ type: Schema.Types.ObjectId, ref: 'PokeArt' }],

  //admin
  admin: { type: 'Boolean', required: true, default: false},
});


module.exports = mongoose.model('User', userSchema);