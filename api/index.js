const express = require('express');
const path = require("path");
const mongoose = require('mongoose');

const app = express();

// Set up database connection
mongoose
  .connect(process.env.VERIFICATION_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB database: Verify'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set EJS as the view engine
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

// Serve static files
app.use(express.static(path.join(__dirname, "../public")));

// Define Schema and Model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema, 'verifies');

// Routes
app.get('/register', (req, res) => {
   res.render('admin');
});


app.get('/', (req, res) => {
 res.render('index', {
    message: null, // or provide a default message
    error: false,  // default error status
  });
});
app.post('/', async (req, res) => { // Added async
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).render('index', {
      message: 'All fields are required',
      error: true,
    });
  }

  try {
    await User.create({ username, password });
    res.status(200).render('index', {
      message: 'User saved successfully!',
      error: false,
    });
  } catch (err) {
    console.error('Error saving user data:', err);
    res.status(500).render('index', {
      message: 'An error occurred while saving data',
      error: true,
    });
  }
});

// Export the serverless handler
module.exports = app;
