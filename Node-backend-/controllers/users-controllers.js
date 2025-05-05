const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');
//const user = require('../models/user');


//sending a request which returns all the users stored in our databade
// only want to return email and name, not password.
const getUsers = async (req, res, next) => {
  let users;
  try{
    users = await User.find({}, '-password');
  } catch(err){
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  } 

  //find returns an array of users, so we want to map through the array 
  //and convert each user to a plain JavaScript object
  res.json({users: users.map(user => user.toObject({ getters: true}))})
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { name, email, password } = req.body;

  let existingUser
  try{
    existingUser = await User.findOne({ email: email });
  } 
  //if findOne() method fails or doesn't work as intended, then we want to catch any potential errors,
  //and then store the error in a variable called 'error'
  catch(err){
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    );
    return next(error);
  }

  let hashedPassword;
  let saltRounds = 12;
  try{
    hashedPassword = await bcrypt.hash(password, saltRounds);
  } catch(err){
    const error = new HttpError('Could not create user, please try again.', 500);
    return next(error);
  }


  const createdUser = new User({
    name,
    email,
    image: req.file.location, //multer-s3 exposes the S3 URL here
    password: hashedPassword,
    places: []
  });

  //now want to save the user to the database
  try{
    await createdUser.save();
  } catch(err){
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }


  let token;
  try {
    token = jwt.sign(
      {userId: createdUser.id, email: createdUser.email}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'}
    );
  } catch (error) {
    const err = new HttpError('Signing up failed, please try again later.', 500);
    return next(err);
  }

  res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try{
    existingUser = await User.findOne({ email: email });
  } catch(err){
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  //if the user does not exist, we want to return an error message to the client
  if (!existingUser){
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return next(error);
  }

  //if we do find the user, we want to compare the password that the user entered with the password that is stored in the database
  let isValidPassword = true;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  }
  catch(err){//an error that might occur when we try to compare the passwords, still returns a false value.
    const error = new HttpError('Could not log you in, please check your credentials and try again.', 500);
    return next(error);
  }

  if (!isValidPassword){ //for incorrect password entered by user
    const error = new HttpError(
      'Incorrect Password or Email entered.',
      401
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      //using the same private key as in the signup function otherwise the token will not be valid for the client to use for authentication purposes
      {userId: existingUser.id, email: existingUser.email}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'} 
    );
  } catch (error) {
    const err = new HttpError('Signing up failed, please try again later.', 500);
    return next(err);
  }

  res.json({
    userId: existingUser.id, email: existingUser.email, token: token
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
