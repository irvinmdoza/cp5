const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const argon2 = require("argon2");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// connect to the database
mongoose.connect('mongodb://localhost:27017/inventory2', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: [
    'secretValue'
  ],
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// USER APIS
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password'))
    return next();

  try {
    const hash = await argon2.hash(this.password);
    this.password = hash;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userSchema.methods.comparePassword = async function(password) {
  try {
    const isMatch = await argon2.verify(this.password, password);
    return isMatch;
  } catch (error) {
    return false;
  }
};

userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
}

const User = mongoose.model('User', userSchema);

const validUser = async (req, res, next) => {
  if (!req.session.userID)
    return res.status(403).send({
      message: "not logged in"
    });
  try {
    const user = await User.findOne({
      _id: req.session.userID
    });
    if (!user) {
      return res.status(403).send({
        message: "not logged in"
      });
    }
    req.user = user;
  } catch (error) {
    return res.status(403).send({
      message: "not logged in"
    });
  }
  next();
};

// create a new user
app.post('/api/users', async (req, res) => {
  if (!req.body.firstName || !req.body.lastName || !req.body.username || !req.body.password)
    return res.status(400).send({
      message: "First Name, Last Name, Username and Password are required!"
    });

  try {
    const existingUser = await User.findOne({
      username: req.body.username
    });
    if (existingUser)
      return res.status(403).send({
        message: "Username already exists!"
      });

    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: req.body.password
    });
    await user.save();
    req.session.userID = user._id;

    return res.send({
      user: user
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// login a user
app.post('/api/users/login', async (req, res) => {
  if (!req.body.username || !req.body.password)
    return res.sendStatus(400);

  try {
    const user = await User.findOne({
      username: req.body.username
    });
    if (!user)
      return res.status(403).send({
        message: "username or password is wrong"
      });

    if (!await user.comparePassword(req.body.password))
      return res.status(403).send({
        message: "username or password is wrong"
      });

    req.session.userID = user._id;

    return res.send({
      user: user
    });

  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get logged in user
app.get('/api/users', validUser, async (req, res) => {
  try {
    res.send({
      user: req.user
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// logout
app.delete("/api/users", validUser, async (req, res) => {
  try {
    req.session = null;
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// ITEM APIS
const itemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  name: String,
  type: String,
  defense: String,
  rarity: String,
  equipped: String,
});
itemSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
itemSchema.set('toJSON', {
  virtuals: true
});
const Item = mongoose.model('Item', itemSchema);

// CREATE
app.post('/api/items', validUser, async (req, res) => {
  const item = new Item({
    user: req.user,
    name: req.body.name,
    type: req.body.type,
    defense: req.body.defense,
    rarity: req.body.rarity,
    equipped: req.body.equipped
  });
  try {
    await item.save();
    res.send(item);
  } catch (error) {
    //console.log(error);
    res.sendStatus(500);
  }
});

// READ
app.get('/api/items', validUser, async (req, res) => {
  try {
    let items = await Item.find({
      user: req.user
    }).populate('user');
    //return res.send(items);
    res.send(items);
  } catch (error) {
    //console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/items/equipped', validUser, async (req, res) => {
  try {
    let items = await Item.find({
      user: req.user,
      equipped: "true"
    })
    res.send(items);
  } catch (error) {
    //console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/items/:id', validUser, async (req, res) => {
  try {
    let item = await Item.findOne({_id: req.params.id}).populate('user');
    if (!item) {
      res.send(404);
      return;
    }
    res.send(item);
  } catch (error) {
    //console.log(error);
    res.sendStatus(500);
  }
});

// UPDATE
app.put('/api/items/:id', validUser, async (req, res) => {
  try {
    let item = await Item.findOne({_id: req.params.id});
    if (!item) {
      res.send(404);
      return;
    }
    item.name = req.body.name;
    item.type = req.body.type;
    item.defense = req.body.defense;
    item.rarity = req.body.rarity;
    //item.equipped = req.body.equipped;
    await item.save();
    res.send(item);
  } catch (error) {
    //console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/items/equipped/:id', validUser, async (req, res) => {
  try {
    let item = await Item.findOne({_id: req.params.id});
    if (!item) {
      res.send(404);
      return;
    }
    item.equipped = req.body.equipped;
    await item.save();
    res.send(item);
  } catch (error) {
    //console.log(error);
    res.sendStatus(500);
  }
})

// DELETE
app.delete('/api/items/:id', validUser, async (req, res) => {
  try {
    let item = await Item.findOne({_id: req.params.id});
    if (!item) {
      res.send(404);
      return;
    }
    await item.delete();
    res.sendStatus(200);
  } catch (erro) {
    //console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3003, () => console.log('Server listening on port 3003!'));
