const express = require("express");
const User = require("../controller/model/User")


const {
    body
} = require("express-validator");
const {
    signIn,
    signUp
} = require("../controller/accountController");

const router = express.Router();

router.post("/sign-in", signIn);
router.post("/sign-up",
    [
        body("email")
        .isEmail()
        .withMessage("Please enter a valid email")
        .custom((value, {
            req
        }) => {
            return User.findOne({
                email: value
            }).then((userDoc) => {
                if (userDoc) {
                    return Promise.reject("E-mail already exists!!");
                }
            });
        })
        .normalizeEmail(),
        body("password").trim().isLength({
            min: 5
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
    signUp);

module.exports = router;