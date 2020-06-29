const twit = require("twit");
const dynConfig = require("./models/dynconfig");
const fs = require('fs')
const config = require("./config");
const axios = require("axios");
const emojis = require("./utils/emojis");
const Pokemon = require("./models/pokemon");
const randomRange = require("./utils/randomrange");

const bot_twitter = new twit({
  consumer_key: config.BOT_TWITTER_CONSUMER_KEY,
  consumer_secret: config.BOT_TWITTER_CONSUMER_SECRET,
  access_token: config.BOT_TWITTER_TOKEN,
  access_token_secret: config.BOT_TWITTER_SECRET,
});

async function checkChangeAndTweet() {
  let request = await axios({
    method: "get",
    url:
      "http://cotacoes.economia.uol.com.br/cambioJSONChart.html?type=d&cod=BRL&mt=off",
  });

  let currentValue = parseFloat(
    request.data[request.data.length - 1].ask
  ).toFixed(2);
  
  currentValue-=2.98;
  currentValue = currentValue.toFixed(2)
  
  let valueChanged = false;
  try {
    let dynConfDolar = await dynConfig.findOne({ key: "currentValue" });
    if (dynConfDolar) {
      oldValue = parseFloat(dynConfDolar.value);
      console.log(valueChanged);
      if (currentValue > oldValue) {
        valueChanged = 1;
        dynConfDolar.value = currentValue;
        dynConfDolar.save();
      } else if (currentValue < oldValue) {
        valueChanged = -1;
        dynConfDolar.value = currentValue;
        dynConfDolar.save();
      }
      console.log(`${oldValue}, ${currentValue}, ${valueChanged}`);
    } else {
      let newDynconfDolar = new dynConfig({
        key: "currentValue",
        value: currentValue,
      });
      newDynconfDolar.save();
    }
  } catch (e) {
    console.log(e);
  }
  if (valueChanged) {
    let changeString = "";
    let emoji = "";
    let pokemonId = parseInt(currentValue * 100);
    let pokemon = await Pokemon.findOne({ id: pokemonId })
      .populate("pokeArts")
      .populate("officialPokeArts");
    let approvedArts = pokemon.officialPokeArts.concat(pokemon.pokeArts);
    let pokeArt = approvedArts[randomRange(0, approvedArts.length)];

    if (valueChanged < 0) {
      changeString = "caiu";
      emoji = emojis.happy_emoji();
    } else {
      changeString = "subiu";
      emoji = emojis.sad_emoji();
    }
    
    let authorText = "";
    if (pokeArt.isOfficial) {
      authorText = `Arte oficial por ${pokeArt.creatorText}`;
    } else {
      let twitterHandle = pokeArt.author;
      authorText = `Arte por ${twitterHandle}`;
    }
    let textValue = `R$ ${currentValue}`.replace(".", ",")
    let tweetString = `TWEET DE TESTE\nDólar ${changeString} para ${textValue} ${emoji}\n\n\n#${pokemonId} - ${pokemon.name}\n${authorText}`;
    
    const b64content = fs.readFileSync(pokeArt.filePath, {
      encoding: "base64",
    });
    
    // first we must post the media to Twitter
    bot_twitter.post("media/upload", { media_data: b64content }, function (
      err,
      data,
      response
    ) {
      // now we can assign alt text to the media, for use by screen readers and
      // other text-based presentations and interpreters
      
      const mediaIdStr = data.media_id_string;
      const altText = `${pokemon.name}`;
      let meta_params = { media_id: mediaIdStr, alt_text: { text: altText } };

      bot_twitter.post("media/metadata/create", meta_params, function (
        err,
        data,
        response
      ) {
        if (!err) {
          // now we can reference the media and post a tweet (media will attach to the tweet)
          var params = {
            status: tweetString,
            media_ids: [mediaIdStr],
          };

          bot_twitter.post("statuses/update", params, function (err, data, response) {
            console.log('Twittou');
            console.log(tweetString);
          });
        }
      });
    });
  } else {
    console.log("Não mudou :(")
  }
}
(async () => {
  checkChangeAndTweet()
})();

module.exports = {
  checkChangeAndTweet,
};
