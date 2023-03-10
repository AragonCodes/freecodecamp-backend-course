// index.js
// where your node app starts
require('dotenv').config();

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.use('', (req, _, next) => {
  const { path, params, body } = req;
  console.log({ path, params, body });

  next();
});

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (_, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/api/:date?', function (req, res) {
  const dateParam = req.params.date;

  const isUnixTimestamp = /^\d+$/.test(dateParam);
  const parsedDateParam = isUnixTimestamp ? Number(dateParam) : dateParam;

  const date = parsedDateParam ? new Date(parsedDateParam) : new Date();

  if (date.toString() === 'Invalid Date') {
    res.json({ error: 'Invalid Date' });
    return;
  }

  res.json({ utc: date.toUTCString(), unix: date.getTime() });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
