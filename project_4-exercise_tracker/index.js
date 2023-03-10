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
const exerciseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});
const Exercise = mongoose.model('Exercise', exerciseSchema);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  log: {
    type: [exerciseSchema],
    default: [],
  },
});
const User = mongoose.model('User', userSchema);

app
  .route('/api/users')
  .post(async (req, res) => {
    const { username } = req.body;

    if (!username) {
      res.json({ error: 'Empty username. Please provide a username' });
      return;
    }

    const newUser = new User({ username });
    const createdUser = await newUser.save();

    res.json(createdUser);
  })
  .get(async (req, res) => {
    const allUsers = await User.find();

    res.json(allUsers);
  });

const isValidDateParam = (dateString) => /^\d{4}-\d{2}-\d{2}$/.test(dateString);

app.post('/api/users/:userId/exercises', async (req, res) => {
  const { userId } = req.params;
  const { description, duration: durationParam, date: dateParam } = req.body;

  const duration = Number(durationParam);
  const date = isValidDateParam(dateParam) ? new Date(dateParam) : new Date();
  const dateString = date.toDateString();

  const newExercisePayload = {
    description,
    duration,
    date: dateString,
  };
  const newExercise = new Exercise(newExercisePayload);

  const user = await User.findById(userId);
  user.log.push(newExercise);

  await user.save();

  const response = {
    ...newExercisePayload,
    username: user.username,
    _id: user._id,
  };

  res.json(response);
});

app.get('/api/users/:userId/logs', async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).lean();

  const logs = {
    ...user,
    count: user.log.length,
  };

  res.json(logs);
});
// ==================

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
