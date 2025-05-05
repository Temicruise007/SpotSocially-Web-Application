const multer = require('multer');
const uuid = require('uuid/v1');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

//1st part is to configure where the file should be stored
//2nd part is to configure how the file should be named
//3rd part is to configure which file types are allowed

const fileUpload = multer({
    limits: 500000, // 500kb

    //storage key helps us control how data should be stored in the disk (file system)
    storage: multer.diskStorage({
        destination: (req, file, cb) => { //controls where the file should be stored on the disk (file system)
            cb(null, 'uploads/images');
        },
        filename: (req, file, cb) => { // controls how the file should be named on the disk (file system)
            const ext = MIME_TYPE_MAP[file.mimetype]; //extract the file extension from the file mimetype (e.g. 'image/png' => 'png')
            cb(null, uuid() + '.' + ext); //cb() is a callback function that multer will call once it has processed the file and has a filename for it (null is for error handling)
        }
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype]; // !! converts the value to a boolean (true or false) value (if the mimetype is in the MIME_TYPE_MAP, it will return true)
        let error = isValid ? null : new Error('Invalid mime type!');
        cb(error, isValid);
    }
});

module.exports = fileUpload;