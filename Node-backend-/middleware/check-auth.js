const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {

    //a required adjustment to ensure that our options request is not blocked by CORS policy when we send a request to the server from the frontend
    //the actual post request which then triggers our place creation logic will still be validated
    if (req.method === 'OPTIONS'){ //OPTIONS is a default method that is sent by the browser to check which methods are allowed by the server
        return next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1]; // Authorization 'Bearer TOKEN'
        if (!token) {
            throw new Error('Authentication failed!');
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userData = { userId: decodedToken.userId };
        next();
    } catch (err) {
        const error = new HttpError('Authentication failed!', 403);
        return next(error);
    }

    
};