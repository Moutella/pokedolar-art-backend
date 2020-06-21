const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/pokeart',
  port: process.env.PORT || 5555,
};

module.exports = config