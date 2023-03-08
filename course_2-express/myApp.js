require('dotenv').config();
const bodyParser = require('body-parser');

let express = require('express');
let app = express();

const urlDecoder = bodyParser.urlencoded({ extended: false });
app.use(urlDecoder);

const PUBLIC_DIR = __dirname + '/public';
app.use('/public', express.static(PUBLIC_DIR));

app.use('', (req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);

  next();
});

app.get('/', (_, res) => {
  const indexFile = __dirname + '/views/index.html';
  res.sendFile(indexFile);
});

const WORD_ROUTE_PARAM = 'word';
app.get(`/:${WORD_ROUTE_PARAM}/echo`, (req, res) => {
  const word = req.params[WORD_ROUTE_PARAM];
  res.json({ echo: word });
});

app.get(
  '/now',
  (req, res, next) => {
    req.time = new Date().toString();
    next();
  },
  (req, res) => {
    res.json({ time: req.time });
  }
);

app
  .route('/name')
  .get((req, res) => {
    const { first: firstName, last: lastName } = req.query;
    const name = `${firstName} ${lastName}`;

    res.json({ name });
  })
  .post((req, res) => {
    const { first: firstName, last: lastName } = req.body;
    const name = `${firstName} ${lastName}`;

    res.json({ name });
  });

app.get('/json', (_, res) => {
  const message =
    process.env.MESSAGE_STYLE === 'uppercase' ? 'HELLO JSON' : 'Hello json';

  res.json({ message });
});

module.exports = app;
