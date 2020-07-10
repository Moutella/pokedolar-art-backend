require('dotenv').config()
const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/pokeart',
  port: process.env.PORT || 5555,
  TWITTER_API_KEY: process.env.TWITTER_API_KEY,
  TWITTER_API_SECRET: process.env.TWITTER_API_SECRET,
  SECRET: process.env.SECRET,
  BOT_TWITTER_CONSUMER_KEY: process.env.BOT_TWITTER_CONSUMER_KEY,
  BOT_TWITTER_CONSUMER_SECRET: process.env.BOT_TWITTER_CONSUMER_SECRET,
  BOT_TWITTER_TOKEN: process.env.BOT_TWITTER_TOKEN,
  BOT_TWITTER_SECRET: process.env.BOT_TWITTER_SECRET,
  SPA_URL: process.env.SPA_URL
};
module.exports = config