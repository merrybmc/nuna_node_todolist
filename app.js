const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index');
require('dotenv').config();
const mongoURI = process.env.REACT_APP_BACKEND_PROD;
const cors = require('cors');
const cookieParser = require('cookie-parser');
const csrfCheck = require('./common/guard/csrfcheck');
const app = express();

const port = process.env.PORT || 5000;

const corsOption = {
  origin: [
    'http://localhost:3000',
    'https://localhost:3000',
    'http://nunatodo.s3-website-us-east-1.amazonaws.com',
    'https://nunatodo.s3-website-us-east-1.amazonaws.com',
    'http://d3dlvbxpgesgac.cloudfront.net',
    'https://d3dlvbxpgesgac.cloudfront.net',
  ],
  credentials: true, // header의 정보가 안전한 것이라고 브라우저가 판단할 수 있게
};

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOption));

app.use(csrfCheck);
app.use('/api', indexRouter);

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
