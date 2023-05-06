const express = require("express");
const { body } = require("express-validator");

const { postQuestion,getQuestion,getQuestionForAdmin,postAnswer, getAllStudentList, getAllEventList, postSuggestedStudents } = require("../controller/contact");
const isAuthenticated = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

router.post("/add-question", isAuthenticated, postQuestion);
router.post("/add-answer/:questionId", isAuthenticated,isAdmin,postAnswer);
router.get("/get-question", isAuthenticated, getQuestion);
router.get("/get-student-list", isAuthenticated, getAllStudentList);
router.get("/get-event-list", isAuthenticated, getAllEventList);
router.post("/suggest-students", isAuthenticated, postSuggestedStudents);
router.get("/get-question-admin", isAuthenticated,isAdmin, getQuestionForAdmin);

module.exports = router;
