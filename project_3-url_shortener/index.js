require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const urlDecoder = bodyParser.urlencoded({ extended: false });
app.use(urlDecoder);

const cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// ==== solution ====
const urlsDirectory = {};
let currentUrlIndexId = 0;

const isValidUrl = (urlString) => {
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    return false;
  }
};

app
  .route('/api/shorturl/:shortUrlId?')
  .get((req, res) => {
    const shortUrlId = req.params.shortUrlId;

    const urlInfo = urlsDirectory[shortUrlId];

    if (!urlInfo) {
      res.json({ error: `short_url not found: ${shortUrlId}` });
      return;
    }

    res.redirect(urlInfo.original_url);
  })
  .post(async (req, res) => {
    const url = req.body.url;

    if (!isValidUrl(url)) {
      res.json({ error: 'invalid url' });
      return;
    }

    const newUrlEntry = {
      original_url: url,
      short_url: currentUrlIndexId,
    };

    urlsDirectory[currentUrlIndexId] = newUrlEntry;

    res.json(newUrlEntry);
  });

// ================================

// listen for requests :)
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
