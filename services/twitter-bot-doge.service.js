const twit = require("twit");
const axios = require('axios');

const Pokemon = require("../models/pokemon");

const PokeDogeService = require("./pokedoge.service");
const PokemonService = require("./pokemon.service")
const PokeArtService = require("./pokeart.service")
const config = require("../config");
const randomRange = require("../utils/randomrange");

const bot_twitter = new twit({
  consumer_key: config.BOT_TWITTER_CONSUMER_KEY,
  consumer_secret: config.BOT_TWITTER_CONSUMER_SECRET,
  access_token: config.POKEDOGE_BOT_TWITTER_TOKEN,
  access_token_secret: config.POKEDOGE_BOT_TWITTER_SECRET,
});

async function checkChangeAndTweet() {
  let currentDoge = await PokeDogeService.getCurrentDoge();
  let lastTweet = await PokeDogeService.getLastTweetDoge();
  let valueChanged = 0;
  let changeString = "";
  let emoji = "";
  // Definindo se subiu ou desceu o valor
  if (lastTweet != currentDoge) {
    if (currentDoge > lastTweet) {
      valueChanged = 1;
      changeString = "subiu";
    } else {
      valueChanged = -1;
      changeString = "caiu";
    }
    PokeDogeService.updateLastTweetDoge(currentDoge);
  }
  let dogeString = `${currentDoge}`.replace(".", '');
  let dogeInt = parseInt(dogeString)
  if (valueChanged) {
    let pokemonCount = await Pokemon.find().countDocuments();
    
    let pokemonId = dogeInt
    if (dogeInt != pokemonCount){
      pokemonId %= pokemonCount
    }
    let pokemon = await PokemonService.getPokemonTweet(pokemonId)
    let approvedArts = pokemon.officialPokeArts.concat(pokemon.pokeArts);
    approvedArts = approvedArts.sort(function(a, b){return a.postAmount-b.postAmount})
    let pokeArt = approvedArts[0];

    let authorText = "";
    if (pokeArt.isOfficial) {
      authorText = `Arte oficial por ${pokeArt.creatorText}`;
    } else {
      let twitterId = pokeArt.author.twitterId;
      let userData = await bot_twitter.get('users/show', {user_id: twitterId})
      let twitterUser = userData.data.screen_name;
      authorText = `Fan-Art de @${twitterUser}`;
    }
    let textValue = `R$ ${currentDoge}`.replace(".", ",");
    let tweetString =
      `${config.ENV == 'debug' ? '[DEV] ' : ''}A Dogecoin ${changeString} para ${textValue}` +
      `\n\n\n#${pokemonId} - ${pokemon.name}` +
      `\n${authorText}`;
    try {
      const b64content = await getBase64(pokeArt.filePath)
      bot_twitter.post(
        "media/upload",
        {
          media_data: b64content,
        },
        async function (err, data, response) {
          const mediaIdStr = data.media_id_string;

          const altText = `${pokemon.name}`;
          let meta_params = {
            media_id: mediaIdStr,
            alt_text: { text: altText },
          };
          await bot_twitter.post("media/metadata/create", meta_params);
          let params = {
            status: tweetString,
            media_ids: [mediaIdStr],
          };

          let post = await bot_twitter.post("statuses/update", params);
        }
      );
    } catch (e) {
      console.log(e);
    }
  }
}

async function getBase64(url) {
  const img = await axios
    .get(url, {
      responseType: 'arraybuffer'
    })
  return Buffer.from(img.data, 'binary').toString('base64');
}

module.exports = {
  checkChangeAndTweet,
};
