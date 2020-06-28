const UserService = require('../services/user.service')
const pokeartService = require('../services/pokeart.service');


async function getUser(req, res){
  console.log(req.params.userId)
  let userId = req.params.userId
  let user = await UserService.getUser(userId)
  console.log(user);
  let arts = await pokeartService.getUserArts(user)
  if(user){
    res.send({
      user: user,
      arts: arts
    })
  }
  else{
    res.send({error:"User not found."})
  }
}

/**
 * Get all pokemons
 * @param req
 * @param res
 * @returns void
 */
async function changeAdminStatus(req, res) {
  try {
    if (!req.user.admin){
      return res.json({"error": "You don't have permission to edit users"});  
    }

    return res.json(returnValue);
  } catch (e) {
    
    return res.json({ error: e });
  }
}


module.exports = {
  changeAdminStatus,
  getUser
};