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


// This block is for handling errors that happen in the app.
// It checks if there is an error, and if so, it tries to delete any file
// that was uploaded before the error happened.
// If the file was uploaded, it tries to delete it from the server.
// If the response headers are already sent (meaning the response is already being sent to the client),
// it passes the error to the next error handler.
// If the headers are not sent yet, it sets the status code based on the error code.
// If the error code is a number, it uses that as the status code.
// If the error code is 'LIMIT_FILE_SIZE', it sets the status to 413 (which means "Payload Too Large").
// Finally, it sends a JSON response with the error message or a default message.
// This is a way to handle errors in a clean and organized way.
app.use((error, req, res, next) => {
  // If multer wrote a file before error, try to remove it.
  if (req.file) {
    fs.unlink(req.file.path, () => {});
  }
  // If headers are already sent, delegate to the default Express handler
  if (res.headerSent) {
    return next(error);
  }

  // Map error.code to a proper HTTP status
  let status = 500;
  if (typeof error.code === 'number') {
    status = error.code;            // your HttpError codes
  } else if (error.code === 'LIMIT_FILE_SIZE') {
    status = 413;                   // multer file-too-large
  }

  res
    .status(status)
    .json({ message: error.message || 'An unknown error occurred!' });
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


