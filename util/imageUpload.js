const cloudinary = require('cloudinary').v2;
require("dotenv").config();
// Configuration 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUD_API_SE
});


async function uploadToCloudinary(locaFilePath) {

    return cloudinary.uploader
        .upload(locaFilePath)
}

exports.uploadToCloudinary = uploadToCloudinary