const fs = require('fs'); //allows us to interact with files in our file system and it also allows us to delete files for example
const path = require('path'); //allows us to work with file paths in our file system

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');


/* This line creates a new Express application, calling it app. 
This app will handle all the different actions our server performs. */
const app = express();


/* Here, we tell the app to use bodyParser to understand 
any data sent as JSON (a format for sending data), so our 
app can read it and work with it easily. */
app.use(bodyParser.json()); 

/* 
This line tells the app to serve files from the 'uploads/images' folder statically.
This means that when someone tries to access a file in this folder, the app will serve it directly.
This is useful for serving images, videos, or other files that are uploaded by users.
The URL path '/uploads/images' is the base URL for accessing files in this folder.
For example, if a file is uploaded with the name 'image.jpg', it can be accessed at 'http://localhost:5000/uploads/images/image.jpg'.
This is a way to make files accessible to the public without exposing the entire file system.
The express.static() function is a built-in middleware function in Express that serves static files and is based on the serve-static package. */
app.use('/uploads/images', express.static(path.join('uploads/images')));

/* This block is setting rules for "Cross-Origin Resource Sharing" (CORS). 
CORS is like a security measure that controls which other websites or apps can talk to our app.
Access-Control-Allow-Origin set to '*' means we allow any website or app to connect.
The next lines allow certain types of headers and methods, so the app can use them safely.
next() lets the request continue on to the next step in the code. */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});


/* This tells the app, "If someone visits /api/places, 
use the routes defined in placesRoutes." This way, all code 
related to places goes in one file, and all code related to 
users goes in another, making the app more organized. */
app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);


/* This block runs if someone tries to visit a route (path) that 
doesn’t exist in the app. It creates a new error message, saying, 
"Could not find this route" with an error code 404, which means "Not Found." 
Then it throws this error to be handled. */
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});


/* This block runs if any of the previous blocks
threw an error. It takes the error, and sends a
response with the error message and code. */
/* This is a special function for handling errors. If any error is thrown in the app, 
this function runs to catch it. if (res.headerSent) checks if a response has already been sent. 
If yes, it moves to the next action.Otherwise, it sends a response with an error code 
(error.code or 500 for "Server Error") and a message describing the problem. */
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500)
  res.json({message: error.message || 'An unknown error occurred!'});
});


mongoose
  .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.txypd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`)
  .then(() => { //if connection is successful, then start backend server
    console.log("Successfully connected to database!!")
    console.log("Starting backend server")
    app.listen(5000, () => {
      console.log('Server is running on port 5000')
    });
  })
  .catch(err => {
    console.log(err); //if connection is not successful, then log the error
  });


