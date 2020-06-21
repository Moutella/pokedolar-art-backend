const Express = require('express');
const mongoose = require('mongoose');
const serverConfig = require('./config');
const bodyParser = require('body-parser')

const routes = require('./routes');
const pokemonRoutes = require('./routes/pokemon.routes')

const app = new Express();

app.use(bodyParser.json())
app.get('/status', (req, res) => res.json({'status': 'Working'}));
app.use('/api', routes);
app.use('/', pokemonRoutes);

app.use('/static', Express.static('public'));
app.use(Express.static('files'));



mongoose.connect(serverConfig.mongoURL, {useNewUrlParser: true, useUnifiedTopology: true});
app.listen(serverConfig.port, () => console.log(`Example app listening at http://localhost:${serverConfig.port}`));