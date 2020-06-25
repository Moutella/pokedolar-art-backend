const serverConfig = require('./config');
const Express = require('express');

var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;

const mongoose = require('mongoose');
const bb = require('express-busboy')

var trustProxy = false;

passport.use(new Strategy({
  consumerKey: serverConfig.TWITTER_API_KEY,
  consumerSecret: serverConfig.TWITTER_API_SECRET,
  callbackURL: '/oauth/callback',
  proxy: trustProxy
},
function(token, tokenSecret, profile, cb) {
  // In this example, the user's Twitter profile is supplied as the user
  // record.  In a production-quality application, the Twitter profile should
  // be associated with a user record in the application's database, which
  // allows for account linking and authentication with other identity
  // providers.
  return cb(null, profile);
}));
const routes = require('./routes');
const pokemonRoutes = require('./routes/pokemon.routes')
const pokeArtRoutes = require('./routes/pokeart.routes');

const app = new Express();


app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

bb.extend(app, {
  upload: true,
  path: __dirname + '/pokearts',
  allowedPath: /./
});

app.get('/status', (req, res) => res.json({'status': 'Working'}));

//Log all requests to console

app.use(function(req,res,next){console.log(req.url, req.method);next();});

app.use('/api', routes);
app.use('/', pokemonRoutes);
app.use('/', pokeArtRoutes);

app.use('/static', Express.static( __dirname + '/public'));
app.use('/pokearts', Express.static(__dirname + '/pokearts'));



mongoose.connect(serverConfig.mongoURL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
app.listen(serverConfig.port, () => console.log(`Example app listening at http://localhost:${serverConfig.port}`));