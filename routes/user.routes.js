const serverConfig = require("../config");
const Router = require("express");
const router = new Router();

const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const JwtStrategy = require('passport-jwt').Strategy, ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken')

const User = require('../models/user');

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
        const newUser = new User({
          twitterId: profile.id,
        });
        await newUser.save();
        
        
        return cb(null, newUser);
      }
    }
  )
);

passport.use('jwt', new JwtStrategy(
  { jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: serverConfig.SECRET,
  },
  async function(jwt_payload, cb) {
    user = await User.findOne({twitterId: jwt_payload.twitterId});
    cb(null, user)
}));

router.route("/twitter/login").get(passport.authenticate("twitter"));
router
  .route("/twitter/callback")
  .get(
    passport.authenticate("twitter", { failureRedirect: "/login" }),
    function (req, res) {
      let token = jwt.sign({
        twitterId: req.user.twitterId
      }, serverConfig.SECRET);
      return res.json({user: req.user, token: `JWT ${token}`});
    }
  );

module.exports = router;
