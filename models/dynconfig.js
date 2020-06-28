const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dynConfigSchema = new Schema({
  key: { type: 'String', required: true, unique: true},
  value: { type: 'String', required: true }
});


module.exports = mongoose.model('dynConfig', dynConfigSchema);