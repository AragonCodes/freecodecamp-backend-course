require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

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

    try {
      // check if url is valid
      await dns.lookup(url);
    } catch {
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

// ==== solution ====

// listen for requests :)
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
