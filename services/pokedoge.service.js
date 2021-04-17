
const axios = require("axios");
const PokemonService = require("./pokemon.service");
const PokeArt = require("../models/pokeart");
const Pokemon = require("../models/pokemon");
const DynConfig = require("../models/dynconfig");
const fileUtils = require("../utils/fileUtils");

async function getCurrentDoge() {
  let dynConfDoge = await DynConfig.findOne({ key: "dogeCurrentValue" });
  if (dynConfDoge) {
    return dynConfDoge.value;
  } else {
    return await updateCurrentDoge();
  }
}

async function updateCurrentDoge() {
  let request = await axios({
    method: "get",
    url:
      "https://api.binance.com/api/v3/avgPrice?symbol=DOGEBRL",
  });

  let currentValue = parseFloat(
    request.data.price
  ).toFixed(2);

  try {
    let dynConfDoge = await DynConfig.findOne({ key: "dogeCurrentValue" });
    if (dynConfDoge) {
      oldValue = parseFloat(dynConfDoge.value);
      if (currentValue > oldValue) {
        dynConfDoge.value = currentValue;
        await dynConfDoge.save();
      } else if (currentValue < oldValue) {
        dynConfDoge.value = currentValue;
        await dynConfDoge.save();
      }
    } else {
      let newdynConfDoge = new DynConfig({
        key: "dogeCurrentValue",
        value: currentValue,
      });
      await newdynConfDoge.save();
    }
    return currentValue;
  } catch (e) {
    console.log(e)
    throw new Error("Could not update current doge value");
  }
}

async function getLastTweetDoge() {
  let dynConfLastTweetDoge = await DynConfig.findOne({
    key: "lastDogeTweetValue",
  });
  if (dynConfLastTweetDoge) {
    return dynConfLastTweetDoge.value;
  } else {
    let value = await getCurrentDoge();
    let newdynConfDoge = new DynConfig({
      key: "lastDogeTweetValue",
      value: value,
    });
    newdynConfDoge.save();
    return value;
  }
}

async function updateLastTweetDoge(newValue) {
  try {
    let dynConfLastTweetDoge = await DynConfig.findOne({
      key: "lastDogeTweetValue",
    });
    if (dynConfLastTweetDoge) {
      dynConfLastTweetDoge.value = newValue;
      dynConfLastTweetDoge.save();
    } else {
      let dynConfLastTweetDoge = new DynConfig({
        key: "lastDogeTweetValue",
        value: currentValue,
      });
      await dynConfLastTweetDoge.save();
    }
    return newValue;
  } catch (e) {
    throw new Error("Could not update current doge value");
  }
}

module.exports = {
  getCurrentDoge,
  updateCurrentDoge,
  getLastTweetDoge,
  updateLastTweetDoge,
};
