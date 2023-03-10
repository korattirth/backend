const {
    validationResult
} = require("express-validator");
const Post = require("../model/Post");
const {
    uploadToCloudinary
} = require('../util/imageUpload');
const Paginate = require('../dto/Paginate');



exports.createPost = async (req, res, next) => {
    try {
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
        let imagePath = await uploadToCloudinary(image.path);
        if (!imagePath) {
            const error = new Error('An error occurred while uploading the image');
            throw error
        }
        const post = new Post({
            topic: topic,
            description: description,
            image: imagePath.secure_url,
            userId: req.userId
        })
        await post.save();
        res.status(200).json({
            message: 'Post created successfully'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getAllPost = async (req, res, next) => {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 3;

        const totalItems = await Post.count();
        const totalPages = Math.ceil(totalItems / pageSize);
        
        const postList = await Post.find().populate({
            path: 'userId',
            select: 'fName lName role'
        }).limit(pageSize*currentPage);

        
        res.status(200).json(new Paginate(postList,currentPage,pageSize,totalPages))
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getSinglePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId).populate({
            path: 'userId',
            select: 'fName lName role image'
        })
        res.status(200).json(post)
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}