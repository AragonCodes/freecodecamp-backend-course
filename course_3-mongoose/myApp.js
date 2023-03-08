require('dotenv').config();

const mongoose = require('mongoose');

const PERSON_COLLECTION_NAME = 'Person';

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  favoriteFoods: {
    type: [String],
    default: [],
  },
});

const Person = mongoose.model(PERSON_COLLECTION_NAME, personSchema);

const createAndSavePerson = (done) => {
  const newPerson = new Person({
    name: 'Kevin Aragon',
    age: 28,
    favoriteFoods: ['sushi', 'lahmacun', 'pizza'],
  });

  newPerson.save((error, data) => {
    if (error) {
      done(error);
    }

    done(null, data);
  });
};

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (error, data) => {
    if (error) {
      done(error);
    }
    done(null, data);
  });
};

const findPeopleByName = (name, done) => {
  Person.find({ name }, (error, persons) => {
    if (error) done(error);

    done(null, persons);
  });
};

const findOneByFood = async (food, done) => {
  try {
    const person = await Person.findOne({ favoriteFoods: [food] });

    done(null, person);
  } catch (error) {
    done(error);
  }
};

const findPersonById = async (personId, done) => {
  try {
    const person = await Person.findById(personId);

    done(null, person);
  } catch (error) {
    done(error);
  }
};

const findEditThenSave = async (personId, done) => {
  const foodToAdd = 'hamburger';

  try {
    const person = await Person.findById(personId);
    person.favoriteFoods = [...person.favoriteFoods, foodToAdd];

    await person.save();

    done(null, person);
  } catch (error) {
    done(error);
  }
};

const findAndUpdate = async (personName, done) => {
  const ageToSet = 20;
  const query = { name: personName };

  try {
    const person = await Person.findOneAndUpdate(
      query,
      { age: ageToSet },
      { new: true }
    );

    done(null, person);
  } catch (error) {
    done(error);
  }
};

const removeById = async (personId, done) => {
  try {
    const deletedPerson = await Person.findByIdAndDelete(personId);

    done(null, deletedPerson);
  } catch (error) {
    done(error);
  }
};

const removeManyPeople = async (done) => {
  const nameToRemove = 'Mary';

  try {
    const personsDeletionOperation = await Person.remove({
      name: nameToRemove,
    });
    console.log(
      'removeManyPeople -> personsDeletionOperation:',
      personsDeletionOperation
    );

    done(null, personsDeletionOperation);
  } catch (error) {
    done(error);
  }
};

const queryChain = async (done) => {
  const foodToSearch = 'burrito';

  try {
    const result = await Person.find({
      favoriteFoods: { $all: [foodToSearch] },
    })
      .sort('name')
      .limit(2)
      .select('name favoriteFoods');
    console.log('queryChain -> result:', result);

    done(null, result);
  } catch (error) {
    done(error);
  }
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
