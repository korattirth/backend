const {
    validationResult
} = require("express-validator");
const bcypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("./model/User")

exports.signUp = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const fName = req.body.fName;
    const lName = req.body.lName;
    const email = req.body.email;
    const password = req.body.password;
    const homeAddress = req.body.homeAddress;
    const address2 = req.body.address2;
    const zipcode = req.body.zipcode;
    const city = req.body.city;
    const state = req.body.state;
    const department = req.body.department;
    const dob = req.body.dob;

    bcypt
        .hash(password, 12)
        .then((hashedPw) => {
            const user = new User({
                FName: fName,
                LName: lName,
                Email: email,
                Password: hashedPw,
                HomeAddress: homeAddress,
                Address2: address2,
                Zipcode: zipcode,
                City: city,
                State: state,
                Department: department,
                DOB: dob
            });
            return user.save();
        })
        .then((result) => {
            res.status(201).json({
                message: "User created!",
                userId: result._id
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.signIn = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    let loadedUser;

    User.findOne({
            email: email
        })
        .then((user) => {
            if (!user) {
                const error = new Error("Invalid Credentials!!");
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;

            return bcypt.compare(password, user.Password);
        })
        .then((isEqual) => {
            if (!isEqual) {
                const error = new Error("Invalid Credentials!!");
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign({
                    email: loadedUser.email,
                    userId: loadedUser._id.toString(),
                },
                "somesecret", {
                    expiresIn: "2h"
                }
            );
            res.status(200).json({
                token: token,
                userId: loadedUser._id.toString()
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};