const express = require("express");
const {
    body
} = require("express-validator");
const upload = require('../util/uploader');
const auth = require("../middleware/auth");

const {
    createPost,getPostList, getSinglePost
} = require("../controller/travel");

const router = express.Router();

router.post("/create-post", upload.array('file', 5), [
    body('topic').trim().not().isEmpty(),
    body('description').trim().not().isEmpty(),
    body("date").isDate().not().isEmpty(),
],auth, createPost);

router.get("/travel-post-list",getPostList)
router.get("/travel-post/:postId",getSinglePost)
module.exports = router;