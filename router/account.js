const express = require("express");
const User = require("../model/User");

const {
  body, validationResult
} = require("express-validator");
const {
  signIn,
  signUp,
  getCurrentUser,
  editUser,
  uploadUserImg
} = require("../controller/account");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/sign-in", signIn);
router.post(
  "/sign-up",
  [
    body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom((value, {
      req
    }) => {
      return User.findOne({
        Email: value,
      }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject("E-mail already exists!!");
        }
      });
    })
    .normalizeEmail(),
    body("password").trim().isLength({
      min: 5,
    }),
    body("fName").trim().not().isEmpty(),
    body("lName").trim().not().isEmpty(),
    body("homeAddress").trim().not().isEmpty(),
    body("address2").trim().not().isEmpty(),
    body("zipcode").trim().not().isEmpty(),
    body("city").trim().not().isEmpty(),
    body("state").trim().not().isEmpty(),
    body("department").trim().not().isEmpty(),
    body("dob").isDate(),
    body("confirmPassword")
    .custom((value, {
      req
    }) => {
      if (value !== req.body.password) {
        throw new Error("Password has to be match!");
      }
      return true;
    })
    .trim(),
  ],
  signUp
);

router.get('/current-user', auth, getCurrentUser);
router.post('/edit-user/:userId', [
    body("fName").trim().not().isEmpty(),
    body("lName").trim().not().isEmpty(),
    body("homeAddress").trim().not().isEmpty(),
    body("address2").trim().not().isEmpty(),
    body("zipcode").trim().not().isEmpty(),
    body("city").trim().not().isEmpty(),
    body("state").trim().not().isEmpty(),
    body("dob").isDate(),
], auth, editUser);

router.post('/upload-image/:userId',auth,uploadUserImg)

module.exports = router;