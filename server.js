const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();

const { PORT = 3000, DB_HOST } = process.env;

mongoose.set('strictQuery', false);
mongoose.Promise = global.Promise;
mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log('Database connection successful');
    app.listen(PORT, function () {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch(err => {
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1);
  });
