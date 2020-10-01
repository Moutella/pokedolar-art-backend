
const axios = require("axios");
const PokemonService = require("../services/pokemon.service");
const PokeArt = require("../models/pokeart");
const Pokemon = require("../models/pokemon");
const DynConfig = require("../models/dynconfig");
const fileUtils = require("../utils/fileUtils");

async function getCurrentDollar() {
  let dynConfDolar = await DynConfig.findOne({ key: "currentValue" });
  if (dynConfDolar) {
    return dynConfDolar.value;
  } else {
    return await updateCurrentDollar();
  }
}

async function updateCurrentDollar() {
  let request = await axios({
    method: "get",
    url:
      "https://api.cotacoes.uol.com/currency/intraday/list/?format=JSON&fields=bidvalue,askvalue,maxbid,minbid,variationbid,variationpercentbid,openbidvalue,date&currency=1&",
  });

  let currentValue = parseFloat(
    request.data.docs[0].askvalue
  ).toFixed(2);

  try {
    let dynConfDolar = await DynConfig.findOne({ key: "currentValue" });
    if (dynConfDolar) {
      oldValue = parseFloat(dynConfDolar.value);
      if (currentValue > oldValue) {
        dynConfDolar.value = currentValue;
        await dynConfDolar.save();
      } else if (currentValue < oldValue) {
        dynConfDolar.value = currentValue;
        await dynConfDolar.save();
      }
    } else {
      let newDynconfDolar = new DynConfig({
        key: "currentValue",
        value: currentValue,
      });
      await newDynconfDolar.save();
    }
    return currentValue;
  } catch (e) {
    throw new Error("Could not update current dollar value");
  }
}

async function getLastTweetDollar() {
  let dynConfLastTweetDolar = await DynConfig.findOne({
    key: "lastTweetValue",
  });
  if (dynConfLastTweetDolar) {
    return dynConfLastTweetDolar.value;
  } else {
    let value = await getCurrentDollar();
    let newDynconfDolar = new DynConfig({
      key: "lastTweetValue",
      value: value,
    });
    newDynconfDolar.save();
    return value;
  }
}

async function updateLastTweetDollar(newValue) {
  try {
    let dynConfLastTweetDolar = await DynConfig.findOne({
      key: "lastTweetValue",
    });
    if (dynConfLastTweetDolar) {
      dynConfLastTweetDolar.value = newValue;
      dynConfLastTweetDolar.save();
    } else {
      let dynConfLastTweetDolar = new DynConfig({
        key: "lastTweetValue",
        value: currentValue,
      });
      await dynConfLastTweetDolar.save();
    }
    return newValue;
  } catch (e) {
    throw new Error("Could not update current dollar value");
  }
}

module.exports = {
  getCurrentDollar,
  updateCurrentDollar,
  getLastTweetDollar,
  updateLastTweetDollar,
};
