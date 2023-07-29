const mongoose = require('mongoose');

const connectToDatabase = async () => {
  try {
    const dbURI = process.env.DATABASE.replace('<password>',process.env.DATABASE_PASSWORD); 
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exit the process with a failure code
  }
};

module.exports = connectToDatabase;
