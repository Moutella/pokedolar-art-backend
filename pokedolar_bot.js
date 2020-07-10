const twit = require("twit");
const dynConfig = require("./models/dynconfig");
const fs = require("fs");
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
  )

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
    let pokemonCount = await Pokemon.find().count()
    let pokemonId = parseInt(currentValue * 100) % pokemonCount;
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
      authorText = `Arte de @${twitterHandle}`;
    }
    let textValue = `R$ ${currentValue}`.replace(".", ",");
    let tweetString = `TWEET DE TESTE\nO dólar ${changeString} para ${textValue} ${emoji}\n\n\n#${pokemonId} - ${pokemon.name}\n${authorText}`;

    try {
      const b64content = fs.readFileSync(pokeArt.filePath, {
        encoding: "base64",
      });

      bot_twitter.post("media/upload", {
        media_data: b64content,
      }, async function(err, data, response){
        
        const mediaIdStr = data.media_id_string;
        
        const altText = `${pokemon.name}`;
        let meta_params = { media_id: mediaIdStr, alt_text: { text: altText } };
        await bot_twitter.post("media/metadata/create", meta_params);
        let params = {
          status: tweetString,
          media_ids: [mediaIdStr],
        };

        await bot_twitter.post("statuses/update", params);        
        console.log("Twittou");
        console.log(tweetString);
        });
      
    } catch (e) {
      console.log(e);
    }
  } else {
    console.log("Não mudou :(");
  }
}

module.exports = {
  checkChangeAndTweet,
};
