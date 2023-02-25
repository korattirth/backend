const express = require("express");
const { body } = require("express-validator");

const { userList, editActiveStatus } = require("../controller/admin");
const isAuthenticated = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

router.get("/user-list", isAuthenticated, userList);
router.post("/user-status", isAuthenticated,isAdmin, editActiveStatus);

module.exports = router;
