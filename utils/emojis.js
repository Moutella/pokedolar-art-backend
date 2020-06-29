const getEmoji = require('node-emoji')
const randomRange = require("./randomrange");

function sad_emoji() {
  let sadEmojis = [
    "hankey",
    "sweat",
    "confused",
    "confounded",
    "disappointed",
    "worried",
    "angry",
    "rage",
    "cry",
    "persevere",
    "triumph",
    "disappointed_relieved",
    "frowning",
    "anguished",
    "fearful",
    "weary",
    "tired_face",
    "sob",
    "open_mouth",
    "cold_sweat",
    "scream",
    "astonished",
    "pouting_cat",
    "crying_cat_face",
    "scream_cat",
    "slightly_frowning_face",
    "face_with_symbols_on_mouth",
    "white_frowning_face",
  ];

  return getEmoji.get(sadEmojis[randomRange(0, sadEmojis.length)]);
}

function happy_emoji() {
  let happyEmojis = [
    "grinning",
    "grin",
    "smiley",
    "smile",
    "sweat_smile",
    "laughing",
    "wink",
    "heart_eyes",
    "stuck_out_tongue",
    "no_mouth",
    "slightly_smiling_face",
    "upside_down_face",
    "money_mouth_face",
    "clown_face",
  ];
  return getEmoji.get(happyEmojis[randomRange(0, happyEmojis.length)]);
}

module.exports = {
  sad_emoji,
  happy_emoji,
};
