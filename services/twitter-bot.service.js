const fs = require("fs");
const twit = require("twit");

const Pokemon = require("../models/pokemon");

const PokeDolarService = require("./pokedolar.service");

const config = require("../config");
const emojis = require("../utils/emojis");
const randomRange = require("../utils/randomrange");

const bot_twitter = new twit({
  consumer_key: config.BOT_TWITTER_CONSUMER_KEY,
  consumer_secret: config.BOT_TWITTER_CONSUMER_SECRET,
  access_token: config.BOT_TWITTER_TOKEN,
  access_token_secret: config.BOT_TWITTER_SECRET,
});

async function checkChangeAndTweet() {
  let currentDollar = await PokeDolarService.getCurrentDollar();
  let lastTweet = await PokeDolarService.getLastTweetDollar();
  let valueChanged = 0;
  let changeString = "";
  let emoji = "";
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

  
  if (valueChanged) {
    let pokemonCount = await Pokemon.find().count();
    let pokemonId = parseInt(currentDollar * 100) % pokemonCount;
    let pokemon = await Pokemon.findOne({ id: pokemonId })
      .populate({ path: 'pokeArts', populate: {path: 'author'}})
      .populate("officialPokeArts");
    
    let approvedArts = pokemon.officialPokeArts.concat(pokemon.pokeArts);
    let pokeArt = approvedArts[randomRange(0, approvedArts.length)];

    let authorText = "";
    if (pokeArt.isOfficial) {
      authorText = `Arte oficial por ${pokeArt.creatorText}`;
    } else {
      let twitterId = pokeart.author.twitterId;
      let userData = await bot_twitter.get('users/show', {user_id: twitterId})
      let twitterUser = userData.data.screen_name;
      authorText = `Arte de @${twitterUser}`;
    }
    let textValue = `R$ ${currentDollar}`.replace(".", ",");
    let tweetString =
      `O dólar ${changeString} para ${textValue} ${emoji}` +
      `\n\n\n#${pokemonId} - ${pokemon.name}` +
      `\n${authorText}`;
    try {
      const b64content = fs.readFileSync(pokeArt.filePath, {
        encoding: "base64",
      });

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

          await bot_twitter.post("statuses/update", params);
          console.log("Twittou");
          console.log(tweetString);
        }
      );
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = {
  checkChangeAndTweet,
};
