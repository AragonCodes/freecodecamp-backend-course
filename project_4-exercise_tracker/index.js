require('dotenv').config();

const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const bodyParser = require('body-parser');
const urlDecoder = bodyParser.urlencoded({ extended: false });
app.use(urlDecoder);

const cors = require('cors');
app.use(cors());

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// ==== solution ====
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
});
const User = mongoose.model('User', userSchema);

app.post('/api/users', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    res.json({ error: 'Empty username. Please provide a username' });
    return;
  }

  const newUser = new User({ username });
  const createdUser = await newUser.save();

  res.json(createdUser);
});

// ==================

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
