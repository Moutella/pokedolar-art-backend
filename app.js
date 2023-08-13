// const CronJob = require("cron").CronJob;
const https = require("https");
const fs = require("fs");
const Express = require("express");
const serverless = require("serverless-http");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const cors = require("cors");
const helmet = require("helmet");
const bb = require("express-busboy");
const mongoose = require("mongoose");

const serverConfig = require("./config");
const routes = require("./routes");

const app = new Express();

app.use(
  cors({
    origin: ["https://pokedolar.art", "http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
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
app.use(
  cookieSession({
    name: "session",
    keys: [serverConfig.SECRET],
    maxAge: 24 * 60 * 60 * 100,
  })
);
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

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

module.exports.handler = serverless(app);

dollarMethod = async (event) => {
  console.log(event);
  const TwitterBotService = require("./services/twitter-bot.service");
  const PokeDolarService = require("./services/pokedolar.service");
  await PokeDolarService.updateCurrentDollar();
  await TwitterBotService.checkChangeAndTweet();
};

module.exports.dollarJob = dollarMethod;

// dollarMethod();
