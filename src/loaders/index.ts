export {};
const expressLoader = require('./express');
const serverLoader = require('./server');
const mongooseLoader = require('./mongoose');
const redisLoader = require('./redis');

exports.init = () => {
  mongooseLoader();
  redisLoader();
  const app = expressLoader();
  serverLoader(app);
};
