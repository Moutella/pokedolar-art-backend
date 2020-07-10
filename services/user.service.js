const User = require('../models/user');


async function getUser(userId){
  try{
    let user = await User.findOne({_id: userId})
    return user;
  }
  catch (e){
    return false;
  }
}


module.exports = {
  getUser
}