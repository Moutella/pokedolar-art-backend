const Express = require('express');
const mongoose = require('mongoose');

const bb = require('express-busboy')
const serverConfig = require('./config');

const routes = require('./routes');
const pokemonRoutes = require('./routes/pokemon.routes')
const pokeArtRoutes = require('./routes/pokeart.routes');

const app = new Express();

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
console.log(__dirname+'pokearts')
app.use('/pokearts', Express.static(__dirname + '/pokearts'));



mongoose.connect(serverConfig.mongoURL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
app.listen(serverConfig.port, () => console.log(`Example app listening at http://localhost:${serverConfig.port}`));