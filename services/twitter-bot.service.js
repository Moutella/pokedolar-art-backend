const fs = require("fs");
const twit = require("twit");
const { TwitterApi } = require("twitter-api-v2");
const axios = require("axios");

const Pokemon = require("../models/pokemon");

const PokeDolarService = require("./pokedolar.service");
const PokemonService = require("./pokemon.service");
const PokeArtService = require("./pokeart.service");
const config = require("../config");
const emojis = require("../utils/emojis");
const randomRange = require("../utils/randomrange");

console.log({
  appKey: config.BOT_APP_KEY,
  appSecret: config.BOT_APP_SECRET,
  accessToken: config.BOT_ACCESS_TOKEN,
  accessSecret: config.BOT_ACCESS_SECRET,
});

const client = new TwitterApi({
  appKey: config.BOT_APP_KEY,
  appSecret: config.BOT_APP_SECRET,
  accessToken: config.BOT_ACCESS_TOKEN,
  accessSecret: config.BOT_ACCESS_SECRET,
});

async function checkChangeAndTweet() {
  let currentDollar = await PokeDolarService.getCurrentDollar();
  let lastTweet = await PokeDolarService.getLastTweetDollar();
  let valueChanged = 0;
  let changeString = "";
  let emoji = "";

  // Definindo se subiu ou desceu o valor
  if (lastTweet != currentDollar) {
    if (currentDollar > lastTweet) {
      valueChanged = 1;
      changeString = "subiu";
      emoji = emojis.sad_emoji();
    } else {
      valueChanged = -1;
      changeString = "caiu";
      emoji = emojis.happy_emoji();
    }
    PokeDolarService.updateLastTweetDollar(currentDollar);
  }
  let dollarString = `${currentDollar}`.replace(".", "");
  let dollarInt = parseInt(dollarString);

  if (valueChanged) {
    let pokemonCount = await Pokemon.find().countDocuments();

    let pokemonId = dollarInt;
    if (dollarInt != pokemonCount) {
      pokemonId %= pokemonCount;
    }
    let pokemon = await PokemonService.getPokemonTweet(pokemonId);
    let approvedArts = pokemon.officialPokeArts.concat(pokemon.pokeArts);
    approvedArts = approvedArts.sort(function (a, b) {
      return a.postAmount - b.postAmount;
    });
    let pokeArt = approvedArts[0];

    console.log(pokeArt);

    let authorText = "";
    if (pokeArt.isOfficial) {
      authorText = `Arte oficial por ${pokeArt.creatorText}`;
    } else {
      let twitterId = pokeArt.author.twitterId;
      // let userData = await bot_twitter.get("users/show", {
      //   user_id: twitterId,
      // });
      // let twitterUser = userData.data.screen_name;
      authorText = `Fan-Art de @${twitterId}`;
    }
    let textValue = `R$ ${currentDollar}`.replace(".", ",");
    let tweetString =
      `${
        config.ENV == "debug" ? "[DEV] " : ""
      }O dólar ${changeString} para ${textValue} ${emoji}` +
      `\n\n\n#${pokemonId} - ${pokemon.name}` +
      `\n${authorText}`;

    console.log(tweetString);
    try {
      const buffer = await getBuffer(pokeArt.filePath);
      const parts = pokeArt.filePath.split(".");
      const type = parts[parts.length - 1];
      const mimetypes = {
        jpg: "media/jpeg",
        jpeg: "media/jpeg",
        png: "media/png",
      };
      const mediaIds = await Promise.all([
        // file path
        client.v1.uploadMedia(buffer, { mimeType: mimetypes[type] }),
      ]);
      const retorno = await client.v2.tweet({
        text: tweetString,
        media: { media_ids: mediaIds },
      });
      console.log(retorno);
      let tweetId = retorno.data.id;
      PokeArtService.updateTweetAndCount(pokeArt._id, tweetId);
    } catch (e) {
      console.log(e);
    }
  }
}

async function getBuffer(url) {
  const img = await axios.get(url, {
    responseType: "arraybuffer",
  });
  return Buffer.from(img.data, "binary");
}

module.exports = {
  checkChangeAndTweet,
};
