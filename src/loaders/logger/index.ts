
const buildDevLogger = require('./winston/devLogger');
const buildProdLogger = require('./winston/prodLogger');
const logger = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev' ? buildDevLogger() : buildProdLogger();

export { logger };
