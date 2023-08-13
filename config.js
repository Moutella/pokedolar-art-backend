require("dotenv").config();
const config = {
  mongoURL: process.env.MONGO_URL || "mongodb://localhost:27017/pokeart",
  port: process.env.PORT || 5555,
  SECRET: process.env.SECRET,
  BOT_APP_KEY: process.env.BOT_APP_KEY,
  BOT_APP_SECRET: process.env.BOT_APP_SECRET,
  BOT_ACCESS_TOKEN: process.env.BOT_ACCESS_TOKEN,
  BOT_ACCESS_SECRET: process.env.BOT_ACCESS_SECRET,
  TWITTER_CALLBACK_URL: process.env.TWITTER_CALLBACK_URL,
  SPA_URL: process.env.SPA_URL,
  CLOUDFRONT_URL: process.env.CLOUDFRONT_URL,
  AWS_BUCKET: process.env.AWS_BUCKET,
  ENV: process.env.ENV || "debug",
};
module.exports = config;
