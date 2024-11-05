const mongoose = require('mongoose');
const config = require('config');

// Using the correct MongoDB URI without the leading slash
const uri = 'mongodb://127.0.0.1:27017/scatch';

mongoose.connect(uri)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

module.exports = mongoose.connection;
