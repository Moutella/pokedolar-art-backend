const Express = require('express');
const mongoose = require('mongoose');
const bb = require('express-busboy')
const serverConfig = require('./config');
const bodyParser = require('body-parser')

const routes = require('./routes');
const pokemonRoutes = require('./routes/pokemon.routes')
const pokeArtRoutes = require('./routes/pokeart.routes')

const app = new Express();

bb.extend(app, {
  upload: true,
  path: __dirname + '/static/pokearts',
  allowedPath: /./
});

app.get('/status', (req, res) => res.json({'status': 'Working'}));

app.use('/api', routes);
app.use('/', pokemonRoutes);
app.use('/', pokeArtRoutes);

app.use('/static', Express.static( __dirname + 'public'));
app.use('/arts', Express.static(__dirname + '/static/pokearts'));



mongoose.connect(serverConfig.mongoURL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
app.listen(serverConfig.port, () => console.log(`Example app listening at http://localhost:${serverConfig.port}`));