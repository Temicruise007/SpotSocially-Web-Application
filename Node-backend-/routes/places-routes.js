const express = require('express');
const { check } = require('express-validator');

const placesControllers = require('../controllers/places-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/:pid', placesControllers.getPlaceById);

router.get('/user/:uid', placesControllers.getPlacesByUserId);

//request travls through middlwares from top to bottom in the file
// the first two get requests are handled by the two functions above and is open to everyone
router.use(checkAuth);
// the following requests are protected by the checkAuth middleware and can only be accessed by authenticated users
// the checkAuth middleware will run before the requests are processed
// the checkAuth middleware will check if the user is authenticated by checking the token
// if the user is authenticated, the request will be processed
// if the user is not authenticated, an error message will be returned

router.post(
  '/',
  fileUpload.single('image'),
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address')
      .not()
      .isEmpty()
  ],
  placesControllers.createPlace
);

router.patch(
  '/:pid',
  fileUpload.single('image'), //middleware to process image files if any
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  placesControllers.updatePlace
);

router.delete('/:pid', placesControllers.deletePlace);

module.exports = router;
