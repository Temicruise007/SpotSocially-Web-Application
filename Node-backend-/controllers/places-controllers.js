const fs = require('fs'); //e can get the unlink method from the fs module to delete files from the file system

const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');


const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid; 

  let place;
  try{
    place = await Place.findById(placeId);
  } catch{
    //error displayed when get request generally has some kind of problem. for example if we have missen information
    const error = new HttpError(
      'Something went wrong, could not find a place.',
      500
    );
    return next(error);
  }

  //if the requests is successful but we just don't have our places id in the database, then this error will be displayed
  if (!place) {
    const error = new HttpError(
      'Could not find a place for the provided id.',
      404);
    return next(error);
  }

  res.json({ place: place.toObject( {getters: true }) }); // => { place } => { place: place }
};



const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithPlaces;
  try{
    userWithPlaces = await Place.find({creator: userId});
  } catch(err){
    const error = new HttpError(
      'Fetching places failed, please try again later.',
      500
    );
    return next(error);
  }


  if (!userWithPlaces || userWithPlaces.length === 0) {
    return res.status(200).json({ places: [] });
  }

  res.json({ places: userWithPlaces.map(place => place.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description, address } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator: req.userData.userId
  }); //new Place({ title, description, address, location: coordinates, image })


  //before saving, we need to check if the user exists in the database
  let user;
  try{
    //we want to access the creator property of the user object and check whether the ID of the logged in user is
    //already stored in here, So we want to check if the ID of the user is existing.
    user = await User.findById(req.userData.userId);
  } catch(err){
    const error = new HttpError(
      'Creating place failed, please try again.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id.', 404);
    return next(error);
  }

  //optional
  console.log(user);

  //if the user exists, then we want to add the created place to the user's places array
  //and then save the place to the database, and then save the user to the database.
  //if the user doesn't exist, then we want to return an error
  try{
    //we are using a session to make sure that both operations are executed or none of them is executed
    //if one of them fails, then the other one will also be rolled back
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  }catch(err){
    const error = new HttpError(
      'Creating place failed, please try again.',
      500
    );
    // used to stop code execution. if not, the code will continue to run
    return next(error);
  }

  //we are converting our mongoose object, the createdPlace to a plain/default JavaScript object
  //and then we are returning that object to the client
  //we are also setting the status code to 201, which means that a resource was created
  //and we are sending back the place object
  //setting getters to true will convert the _id to id
  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try{
    place = await Place.findById(placeId);
  } catch(err){
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    );
    return next(error);
  }

  if(place.creator.toString() !== req.userData.userId){
    const error = new HttpError(
      'You are not Authorized to edit this place',
      401
    );
    return next(error);
  }
  //only the user who created the place will make it past the if statement above.
  
  place.title = title;
  place.description = description;

  // If a new image file was provided, delete the old image and update the image path
  if (req.file) {
    const oldImagePath = place.image;
    place.image = req.file.path; // new image path from multer

    // Delete the old image file from the file system
    fs.unlink(oldImagePath, err => {
      if (err) {
        console.error('Error deleting old image:', err);
      }
    });
  }

  //making sure updated information is saved in the database
  try{
    await place.save();
  } catch(err){
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    );
    return next(error);
  }

  //we are converting our mongoose object the createdPlace to a plain/default JavaScript object
  //and then we are returning that object to the client
  //we are also setting the status code to 200, which means that a resource was created
  //and we are sending back the place object
  //seeting getters to true will convert the _id to id
  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  
  let place;
  try {
    //we are using the populate method to get the creator object and not just the creator ID
    place = await Place.findById(placeId).populate('creator');
    if (!place) {
      const error = new HttpError('Could not find place for this id.', 404);
      return next(error);
    }
  } catch (err) {
    const error = new HttpError('Something went wrong, could not delete place.',500);
    return next(error);
  }

  // Check if the logged-in user is really the creator of the place
  if (place.creator.id !== req.userData.userId) {
    const error = new HttpError('You are not Authorized to delete this place.', 401);
    return next(error);
  }

  const imagePath = place.image; // Store the image path to delete it later

  // Delete the place from the database and remove it from the user's places array
  // We use a session to ensure that both operations are executed or none of them
  // If one of them fails, then the other one will also be rolled back
  // We use the deleteOne method to delete the place from the database
  // and the pull method to remove the place from the user's places array
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({ session: sess });
    place.creator.places.pull(place);//Remove the place from the user's places array
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.error("Error during operation: ", err); // Log the full error for internal monitoring
    return next(new HttpError('Something went wrong, please try again later.', 500)); // Send generic message to the client
  }

  fs.unlink(imagePath, err => {
    console.error("Error during operation: ", err); // Log the full error for internal monitoring
  });
  
  res.status(200).json({ message: 'Deleted place.' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
