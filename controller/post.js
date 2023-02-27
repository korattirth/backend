const cloudinary = require('cloudinary').v2;
const {
    validationResult
} = require("express-validator");
const PostDto = require('../dto/PostDto');
const Post = require("../model/Post");
const User = require('../model/User');

// Configuration 
cloudinary.config({
    cloud_name: "dflz4gt7i",
    api_key: "762262536931417",
    api_secret: "62fhXp0fDeKZdxtp1lopqaODm3k"
});


exports.createPost = (req, res, next) => {
    const image = req.file;
    const topic = req.body.topic;
    const description = req.body.description;
    const errors = validationResult(req);
    if (!errors.isEmpty() || !image) {
        const error = new Error("Validation failed");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    cloudinary.uploader.upload(image.path, (error, result) => {
        try {
            if (error) {
                res.status(500).send('An error occurred while uploading the image');
            } else {
                // Return the public URL of the uploaded image
                const post = new Post({
                    Topic: topic,
                    Description: description,
                    Image: result.secure_url,
                    userId: req.userId
                })

                return post.save().then(() => {
                    res.status(200).json({
                        message: 'Post created successfully'
                    });
                })
            }
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    });
}

exports.getAllPost = (req, res, next) => {
    let posts = [];
    let postsDto = [];
    let users = [];
    Post.find().then(post => {
        posts = post;
        User.find().then(user => {
            users = user;
            posts.forEach(post => {
                let user = users.find(x => x._id == post.userId);
                postsDto.push(new PostDto(post, user))
            })
            res.json(postsDto)
        })
    })
}