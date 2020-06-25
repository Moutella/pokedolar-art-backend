require('dotenv').config()
const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/pokeart',
  port: process.env.PORT || 5555,
  TWITTER_API_KEY: process.env.TWITTER_API_KEY,
  TWITTER_API_SECRET: process.env.TWITTER_API_SECRET,
  SECRET: process.env.SECRET
};
module.exports = config