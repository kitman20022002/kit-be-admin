export {};
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
module.exports = async function () {
  // const connection = await mongoose.connect(process.env.MONGODB_URL, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // });

  // return connection.connection.db;
  return null;
};
