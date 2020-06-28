const twit = require("twit");
const dynConfig = require("./models/dynconfig");
const config = require("./config");
const axios = require("axios");

const mongoose = require('mongoose')
mongoose.connect(config.mongoURL);


const bot_twitter = new twit({
  consumer_key: config.TWITTER_API_KEY,
  consumer_secret: config.TWITTER_API_SECRET,
  access_token: config.BOT_TWITTER_TOKEN,
  access_token_secret: config.BOT_TWITTER_SECRET,
});

async function checkChangeAndTweet() {
  let request = await axios({
    method: "get",
    url:
      "http://cotacoes.economia.uol.com.br/cambioJSONChart.html?type=d&cod=BRL&mt=off",
  });

  let dolarValue = parseFloat(
    request.data[request.data.length - 1].ask
  ).toFixed(2);
  console.log(`New dolar value: ${dolarValue}`);
  let valueChanged = false;
  try {
    let dynConfDolar = await dynConfig.findOne({ key: "dolarValue" });
    if (dynConfDolar) {
      oldValue = parseFloat(dynConfDolar.value);
      console.log(valueChanged);
      if(oldValue!=dolarValue){
        valueChanged = true;
      }
      console.log(`${oldValue}, ${dolarValue}, ${valueChanged}`);
      
    } else {
      let newDynconfDolar = new dynConfig({
        key: "dolarValue",
        value: dolarValue,
      });
      newDynconfDolar.save();
    }
  } catch (e) {
    console.log(e);
  }
  
}

(async () => {
  checkChangeAndTweet();
})();

module.exports = {
  checkChangeAndTweet,
};
