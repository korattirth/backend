const express = require("express");
const {
    body
} = require("express-validator");

const {
    createPost, getAllPost
} = require("../controller/post");
const isAuthenticated = require("../middleware/auth");

const router = express.Router();

router.post("/create-post", [
    body('topic').trim().not().isEmpty(),
    body('description').trim().not().isEmpty(),
], isAuthenticated, createPost);

router.get('/get-all-post' , getAllPost)

module.exports = router;