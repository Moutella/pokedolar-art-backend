const serverConfig = require("../config");
const Router = require("express");
const router = new Router();
const userController = require("../controllers/user.controller");
const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const JwtStrategy = require('passport-jwt').Strategy, ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken')
const User = require('../models/user');

//Authentication and Registering
passport.use('twitter',
  new TwitterStrategy(
    {
      consumerKey: serverConfig.TWITTER_API_KEY,
      consumerSecret: serverConfig.TWITTER_API_SECRET,
      callbackURL: "/auth/twitter/callback", //will have to change to app url later
    },
    async function (token, tokenSecret, profile, cb) {
      let user = await User.findOne({twitterId:profile.id});
      if (user){
        
        return cb(null,user);
        
      }
      else{
        console.log(profile.name)
        const newUser = await new User({
          twitterId: profile.id,
          twitterDisplayName: profile.displayName,
          twitterUsername: profile.username,
          profileImageUrl: profile.photos[0].value.replace("_normal", "_200x200")
        });
        await newUser.save();
        
        
        return cb(null, newUser);
      }
    }
  )
);
const jwtCookie = function(req){
  let token = null;
  if(req && req.cookies)
    token = req.cookies['JWT'];
  return token;
}
passport.use('jwt', new JwtStrategy(
  { jwtFromRequest: req => jwtCookie(req),
    secretOrKey: serverConfig.SECRET,
  },
  async function(jwt_payload, cb) {
    console.log(jwt_payload);
    console.log("JWTTOKEN HERE");
    user = await User.findOne({twitterId: jwt_payload.twitterId});
    cb(null, user)
}));

router.route("/auth/twitter/login").get(passport.authenticate("twitter"));
router
  .route("/auth/twitter/callback")
  .get(
    passport.authenticate("twitter", { failureRedirect: "/login" }),
    function (req, res) {
      let token = jwt.sign({
        twitterId: req.user.twitterId
      }, serverConfig.SECRET);
      res.cookie('JWT', token, {
        maxAge: new Date(Date.now() + 9999999),
        httpOnly: true
      })
      return res.json({user: req.user, token: `JWT ${token}`});
    }
  );



//Admin Utilities
router.route("/user/admin").post(passport.authenticate('jwt'), userController.changeAdminStatus)

//User view
router.route("/user/:userId").get(userController.getUser)


module.exports = router;
