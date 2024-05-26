const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index');
require('dotenv').config();
const app = express();
const mongoURI = process.env.REACT_APP_BACKEND_PROD;
const cors = require('cors');

const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());
app.use('/api', indexRouter);

// const mongoURI = `mongodb://localhost:27017/todo-demo`;
console.log(mongoURI);
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('mongoose connect');
  })
  .catch((e) => {
    console.log('DB connect fail', e);
  });

app.listen(port, () => {
  console.log('server on 5000');
});
