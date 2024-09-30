const express = require('express'); // handling HTTP requests
const bodyParser = require('body-parser'); // parsing JSON request bodies for POST requests 
const mongoose = require('mongoose'); // MongoDB ORM (Object-Relational Mapping)
const cors = require('cors'); // Cross-Origin Resource Sharing (CORS) middleware
const dotenv = require('dotenv');
// Importing routes
const contactRoute = require('./routes/contact');
const newsletterRoute = require('./routes/newsletter');

dotenv.config(); // load environment variables from .env file (it stores sensitive information like database credentials)

const app = express(); // create an Express app
const PORT = process.env.PORT || 3000; // set the port to listen on


// (Middleware)
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(express.json()); // parse application/json

app.use(cors()); // enable CORS for all routes

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

// // Routes
// app.get('/', (req, res) => {
//     res.send("Backend is working!");
// });

// Using the routes to handle requests
app.use('/contact',contactRoute);
app.use('/newsletter', newsletterRoute);

//Start the server --> // Listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
