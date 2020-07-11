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
      callbackURL: "/twitter/callback", //will have to change to app url later
    },
    async function (token, tokenSecret, profile, cb) {
      console.log(profile);
      let user = await User.findOne({twitterId:profile.id});
      if (user){
        user.twitterDisplayName = profile.twitterDisplayName
        user.twitterUsername = profile.username
        user.profileImageUrl = profile.photos[0].value.replace("_normal", "_200x200")
        user.save()
        return cb(null,user);
        
      }
      else{
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
    user = await User.findOne({twitterId: jwt_payload.twitterId});
    cb(null, user)
}));

router.route("/login").get(passport.authenticate("twitter", {session: false}));
router
  .route("/twitter/callback")
  .get(
    passport.authenticate("twitter", {
      successRedirect: serverConfig.SPA_URL+"user",
      failureRedirect: "/auth/login/failed"
    })
  );



//Admin Utilities
router.route("/user/admin").post(passport.authenticate('jwt'), userController.changeAdminStatus)

//User views
router.route("/user/:userId").get(userController.getUser)
router.route("/user").get(userController.currentUser)


module.exports = router;
