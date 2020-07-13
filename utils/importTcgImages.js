const pokedex = require("./files/pokedex.json");

const fs = require("fs");
const Path = require("path");
const mongoose = require("mongoose");
const config = require("../config");
var Mongoose = require("mongoose").Mongoose;

let pokeart = new Mongoose();
pokeart.connect(config.mongoURL);

let pokemonarts = new Mongoose();
pokemonarts.connect("mongodb://localhost:27017/pokemontcgimages");

const Schema = mongoose.Schema;

const TcgImageSchema = new Schema({
  imageUrlHiRes: { type: "String", required: true },
  number: { type: "String", required: true },
  id: { type: "String", required: true },
  name: { type: "String", required: true },
  artist: { type: "String", required: true },
  subtype: { type: "String", required: true },
  filePath: { type: "String", required: true },
  setCode: { type: "String", required: true },
  cropped: { type: "Boolean" },

  nationalPokedexNumber: { type: "String", required: true },
});

const pokeArtSchema = new Schema({
  name: { type: "String", required: true },
  pokemon: { type: Schema.Types.ObjectId, ref: "Pokemon" },
  filePath: { type: "String", required: true, unique: true },
  createdAt: { type: "Date", default: Date.now, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: false },

  //Posts
  postAmount: { type: "Number", required: true, default: 0 },
  firstPosted: { type: "Date", required: false },
  lastPosted: { type: "Date", required: false },
  lastTweet: { type: "String", required: false },

  //official art stuff
  isOfficial: { type: "Boolean", required: true, default: false },
  creatorText: { type: "String", required: false },

  //admin
  approved: { type: "Boolean", required: true, default: false },
  reviewed: { type: "Boolean", required: true, default: false },
});

const pokemonSchema = new Schema({
  name: { type: "String", required: true, unique: true },
  id: { type: "Number", required: true, unique: true },
  type: [{ type: "String" }],
  //Posts
  postAmount: { type: "Number", default: 0, required: true },
  firstPosted: { type: "Date", required: false },
  lastPosted: { type: "Date", required: false },
  lastTweet: { type: "String", required: false },

  //Arts
  officialPokeArts: [{ type: Schema.Types.ObjectId, ref: "PokeArt" }],
  pokeArts: [{ type: Schema.Types.ObjectId, ref: "PokeArt" }],
});

const PokemonImg = pokemonarts.model("PokeTCG", TcgImageSchema);
const PokeArt = pokeart.model("PokeArt", pokeArtSchema);
const Pokemon = pokeart.model("Pokemon", pokemonSchema);
(async () => {
  console.log("Started");
  let pokemonImgs = await PokemonImg.find({ cropped: true });

  for (pokemonImg of pokemonImgs) {
    console.log(pokemonImg.id);
    let filename = pokemonImg.filePath.split("/")[1];
    try {
      let pokemon = await Pokemon.findOne({ id: pokemonImg.nationalPokedexNumber });
      fs.copyFileSync(
        `/home/moutella/projects/pokedolar-art-backend/pre_arts/tcg/arts/${filename}.png`,
        `/home/moutella/projects/pokedolar-art-backend/pokearts/official/tcg/${filename}.png`
      );

      let officialArt = await PokeArt({
        name: `TCG-${pokemon.id}`,
        pokemon: pokemon,
        filePath: `pokearts/official/tcg/${filename}.png`,

        creatorText: pokemonImg.artist,
        isOfficial: true,

        approved: true,
        reviewed: true,
      });
      await pokemon.officialPokeArts.addToSet(await officialArt.save());
      await pokemon.save();
    } catch (e) {
      console.log(e);
      
    }
  }
  console.log("Acabou");
})().catch((e) => {
  console.log(e);
});
