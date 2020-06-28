const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pokeArtSchema = new Schema({
  name: { type: "String", required: true },
  pokemon: { type: Schema.Types.ObjectId, ref: 'Pokemon' },
  filePath: { type: 'String', required: true, unique: true},
  createdAt: { type: 'Date', default: Date.now, required: true},
  author: { type: Schema.Types.ObjectId, ref: 'User', required: false},
  
  //Posts
  postAmount: { type: "Number", required: true, default:0 },
  firstPosted: { type: "Date", required: false },
  lastPosted: { type: "Date", required: false },
  lastTweet: { type: 'String', required: false},
  
  //official art stuff
  isOfficial: { type: 'Boolean', required: true, default: false},
  creatorText: { type: 'String', required: false},
  

  //admin
  approved: { type: 'Boolean', required: true, default: false},
  reviewed: { type: 'Boolean', required: true, default: false},

});


module.exports = mongoose.model('PokeArt', pokeArtSchema);