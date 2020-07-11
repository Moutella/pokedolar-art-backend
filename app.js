const cron = require("node-cron");

const Express = require("express");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const cors = require("cors");
const helmet = require("helmet");
const bb = require("express-busboy");

const mongoose = require("mongoose");

const serverConfig = require("./config");
const routes = require("./routes");
const twitterBot = require("./pokedolar_bot");

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
    origin: "http://192.168.15.57:5556", // allow to server to accept request from different origin
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

app.listen(serverConfig.port, () =>
  console.log(`Example app listening at http://localhost:${serverConfig.port}`)
);

cron.schedule("45 9-17 * * 0-5", () => {
  twitterBot.checkChangeAndTweet();
});
// cron.schedule('* * * * *', () => {
//   twitterBot.checkChangeAndTweet();
// })
