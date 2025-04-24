import express from 'express';
import rateLimit from 'express-rate-limit';
const apiRouterV1 = require('../app/routes/v1/api');
const config = require('../app/config/app');
const cors = require('cors');
const helmet = require('helmet');
const { errorHandler } = require('./errorHandler');
const status = require('http-status');
const compression = require('compression');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = () => {
  const app = express();
  app.use((req, res, next) => {
    res.setTimeout(30000, () => {
      res.status(status.REQUEST_TIMEOUT).send('Request timeout');
    });
    next();
  });
  //global middleware
  app.use(compression());
  app.use(cors());
  app.use(express.json());
  if (process.env.LIMITER?.toString() === true.toString()) {
    app.use(limiter);
  }
  app.use(helmet());
  app.use(`${config.api.prefix}/v1`, apiRouterV1);
  app.use((err: Error, req: express.Request, res: express.Response) => {
    errorHandler.handleError(err, res);

    if (!res.headersSent) {
      res.status(status.INTERNAL_SERVER_ERROR).send();
    }
  });

  return app;
};
