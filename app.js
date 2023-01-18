const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const contactsRouter = require('./routes/api/contacts');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
// parse application/json
app.use(express.json());

app.use('/api/contacts', contactsRouter);

// catch 404 and forward to error handler
app.use((_, res) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    message: 'Not found',
    data: 'Not found',
  });
});

// error handler
app.use((err, _, res, __) => {
  const { status = 500, message = 'Internal Server Error' } = err;
  res.status(status).json({
    status: 'fail',
    code: status,
    message,
    data: 'Internal Server Error',
  });
});

module.exports = app;
