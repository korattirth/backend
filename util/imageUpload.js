const cloudinary = require('cloudinary').v2;

// Configuration 
cloudinary.config({
    cloud_name: "dflz4gt7i",
    api_key: "762262536931417",
    api_secret: "62fhXp0fDeKZdxtp1lopqaODm3k"
});


async function uploadToCloudinary(locaFilePath) {

    return cloudinary.uploader
        .upload(locaFilePath)
}

exports.uploadToCloudinary = uploadToCloudinary