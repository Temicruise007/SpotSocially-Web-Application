const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controllers');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', usersController.getUsers);

router.post(
  '/signup',
  fileUpload.single('image'), //single() is a middleware provided by multer that will extract a single file from the request (in this case, it extracts the image file from the request with the key 'image') and store it in the 'uploads/images' directory on the server with a unique filename generated 
  // by the uuid() function (e.g. '123abc.jpg') and a file extension based on the MIME type of the file (e.g. 'image/png' => 'png')
  [
    check('name') //check() is a middleware provided by express-validator that will check the request body for the specified field and apply the specified validation rules to it (in this case, it checks if the name field is not empty)
      .not() //not() is a method provided by express-validator that will negate the following validation rule (in this case, it will check if the name field is not empty)
      .isEmpty(), //isEmpty() is a method provided by express-validator that will check if the field is empty
    check('email') //check() is a middleware provided by express-validator that will check the request body for the specified field and apply the specified validation rules to it (in this case, it checks if the email field is a valid email address)
      .normalizeEmail() //normalizeEmail() is a method provided by express-validator that will normalize the email address (e.g. convert it to lowercase)
      .isEmail(), //isEmail() is a method provided by express-validator that will check if the field is a valid email address
    check('password').isLength({ min: 6 }) //check() is a middleware provided by express-validator that will check the request body for the specified field and apply the specified validation rules to it (in this case, it checks if the password field has a minimum length of 6 characters)
  ],
  usersController.signup
);

router.post('/login', usersController.login);

module.exports = router;
