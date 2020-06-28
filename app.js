const serverConfig = require('./config');
const mongoose = require('mongoose');
const passport = require('passport');
const Express = require('express');
const bb = require('express-busboy')
const routes = require('./routes');
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = new Express();
const twitterBot = require('./pokedolar_bot')

bb.extend(app, {
  upload: true,
  path: __dirname + '/pokearts',
  allowedPath: /./
});
app.use(cors())
app.use(require('express-session')({ secret: serverConfig.SECRET, resave: true, saveUninitialized: true }));
app.use(cookieParser())
// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});
app.get('/status', (req, res) => res.json({'status': 'Working'}));
app.use(function(req,res,next){console.log(req.url, req.method);next();});
app.use('/', routes);

app.use('/static', Express.static( __dirname + '/public'));
app.use('/pokearts', Express.static(__dirname + '/pokearts'));

mongoose.connect(serverConfig.mongoURL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
app.listen(serverConfig.port, () => console.log(`Example app listening at http://localhost:${serverConfig.port}`));