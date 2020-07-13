const CronJob = require("cron").CronJob;
const https = require('https');
const fs = require('fs');
const Express = require("express");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const cors = require("cors");
const helmet = require("helmet");
const bb = require("express-busboy");
const mongoose = require("mongoose");

const TwitterBotService = require('./services/twitter-bot.service');
const PokeDolarService =  require('./services/pokedolar.service')
const serverConfig = require("./config");
const routes = require("./routes");

const app = new Express();

var privateKey  = fs.readFileSync(__dirname + '/cert/server.key', 'utf8');
var certificate = fs.readFileSync(__dirname + '/cert/server.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

app.use(helmet());
mongoose.connect(serverConfig.mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

bb.extend(app, {
  upload: true,
  path: __dirname + "/pokearts",
  allowedPath: /./,
});
app.use(cookieSession({
  name: "session",
  keys: [serverConfig.SECRET],
  maxAge: 24 * 60 * 60 * 100
}));
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "https://pokedolar.art", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow session cookie from browser to pass through
  })
);

// Initialize Passport and restore authentication state, if any, from the
// session.
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

app.get("/status", (req, res) => res.json({ status: "Working" }));

app.use(function (req, res, next) {
  console.log(req.url, req.method);
  next();
});
app.use("/", routes);

app.use("/static", Express.static(__dirname + "/public"));
app.use("/pokearts", Express.static(__dirname + "/pokearts"));

let httpsServer = https.createServer(credentials, app);

httpsServer.listen(serverConfig.port, () =>
  console.log(`Example app listening at http://localhost:${serverConfig.port}`)
);

let dollarJob = new CronJob("* 9-17 * * 1-5", async () => {
  console.log("Update current dollar")
  await PokeDolarService.updateCurrentDollar();
  currentMinute = new Date().getMinutes();
  console.log(currentMinute);
  if (currentMinute == 5 || currentMinute == 35){
    console.log("twittou"); 
    TwitterBotService.checkChangeAndTweet();
  }
}, null, true, 'America/Sao_Paulo', null, true);
