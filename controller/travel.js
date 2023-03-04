const {
    validationResult
} = require("express-validator");
const Travel = require("../model/Travel");
const {
    uploadToCloudinary
} = require('../util/imageUpload');
const Paginate = require('../dto/Paginate');

exports.createPost = async (req, res, next) => {
    try {
        const image = req.files;
        const errors = validationResult(req);
        if (!errors.isEmpty() || !image) {
            const error = new Error("Validation failed");
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        var imageUrlList = [];
        let multiplePicturePromise = image.map((picture) =>
            uploadToCloudinary(picture.path)
        );
        let imageResponses = await Promise.all(multiplePicturePromise);

        imageResponses.map(img => {
            imageUrlList.push(img.secure_url)
        })
        const travelPost = new Travel({
            topic: req.body.topic,
            description: req.body.description,
            userId: req.userId,
            image: imageUrlList,
            date: req.body.date
        })

        await travelPost.save();
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

exports.getPostList = async (req, res, next) => {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 3;

        const totalItems = await Travel.count();
        const totalPages = Math.ceil(totalItems / pageSize);

        const travelPostList = await Travel.find().populate({
            path: 'userId',
            select: 'fName lName role image'
        }).limit(pageSize * currentPage);
        
        res.status(200).json(new Paginate(travelPostList,currentPage,pageSize,totalPages))
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getSinglePost = async (req, res, next) => {
    try {
        const post = await Travel.findById(req.params.postId).populate({
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