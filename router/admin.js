const express = require("express");
const { body } = require("express-validator");

const { userList } = require("../controller/admin");
const isAuthenticated = require("../middleware/auth");

const router = express.Router();

router.get("/user-list", isAuthenticated, userList);

module.exports = router;
