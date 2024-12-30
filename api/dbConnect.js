const mongoose = require('mongoose');

// MongoDB URI (Replace with your actual URI)
const MONGODB_URI = process.env.VERIFICATION_DB_URI || 'mongodb://127.0.0.1:27017/Verify';

// Function to connect to MongoDB
async function connectToDatabase() {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('Already connected to MongoDB.');
      return;
    }
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB database.');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
  }
}

// Initial connection
connectToDatabase();

// Reconnect every 5 minutes (300,000 milliseconds)
setInterval(() => {
  console.log('Attempting to reconnect to MongoDB...');
  connectToDatabase();
}, 300000); // 300,000 ms = 5 minutes
