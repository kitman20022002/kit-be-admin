
export {};
const mongooseLoader = require('../../loaders/mongoose');
import dotenv from 'dotenv';
dotenv.config();

const init = async () => {
  await mongooseLoader();
};


init();