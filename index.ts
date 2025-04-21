export {};
const mongoose = require('mongoose');
const mongoosePlugin = require('./src/loaders/mongoose-plugin/renameId');
mongoose.plugin(mongoosePlugin.plugin);

const loader = require('./src/loaders');
loader.init();
