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
const TwitterDogeService = require("./services/twitter-bot-doge.service")
const PokeDolarService =  require('./services/pokedolar.service')
const PokeDogeService =  require('./services/pokedoge.service')
const serverConfig = require("./config");
const routes = require("./routes");

const app = new Express();


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
    origin: ["https://pokedolar.art", "http://10.0.0.102:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
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

if (serverConfig.ENV == 'prod'){
  var privateKey  = fs.readFileSync(__dirname + '/cert/privkey.pem', 'utf8');
  var certificate = fs.readFileSync(__dirname + '/cert/cert.pem', 'utf8');
  var credentials = {key: privateKey, cert: certificate};
  let httpsServer = https.createServer(credentials, app);
  
  httpsServer.listen(serverConfig.port, () =>
    console.log(`Pokedolar listening at PROD ${serverConfig.port}`)
  );
}
else {
app.listen(serverConfig.port, () => {
  console.log(`Pokedolar listening at DEV ${serverConfig.port}`)
})
}

let dollarJob = new CronJob("5,35 9-18 * * 1-5", async () => {
  await PokeDolarService.updateCurrentDollar();
  TwitterBotService.checkChangeAndTweet();
}, null, true, 'America/Sao_Paulo', null, false);



let dogeJob = new CronJob("20,50 * * * *", async () => {
  await PokeDogeService.updateCurrentDoge();
  TwitterDogeService.checkChangeAndTweet();
}, null, true, 'America/Sao_Paulo', null, false);


