const express = require("express");
const {
    body
} = require("express-validator");

const {
    createPost,
    getAllPost,
    getSinglePost
} = require("../controller/post");
const isAuthenticated = require("../middleware/auth");
const upload = require('../util/uploader')

const router = express.Router();

router.post("/create-post", upload.single('file'), [
    body('topic').trim().not().isEmpty(),
    body('description').trim().not().isEmpty(),
], isAuthenticated, createPost);

router.get('/get-all-post', getAllPost)
router.get('/get-post/:postId', getSinglePost)

module.exports = router;