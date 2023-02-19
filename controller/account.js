const { validationResult } = require("express-validator");
const bcypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../model/User");
const { Roles } = require("../util/enum");

const transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

const createData = (userEmail) => {
  const data = {
    from: "yashvantdesai7@gmail.com",
    to: userEmail,
    subject: "About cancelled service request",
    html: `
          <h3>Hello.</h3>
          `,
  };
  return data;
};

exports.signUp = (req, res, next) => {
  req.body.UserRole = Roles.Customer;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  bcypt
    .hash(req.body.password, 12)
    .then((hashedPw) => {
      const user = new User({
        FName: req.body.fName,
        LName: req.body.lName,
        Email: req.body.email,
        Password: hashedPw,
        HomeAddress: req.body.homeAddress,
        Address2: req.body.address2,
        Zipcode: req.body.zipcode,
        City: req.body.city,
        State: req.body.state,
        Department: req.body.department,
        DOB: req.body.dob,
        IsActive: false,
        UserRole: req.body.UserRole,
      });
      return user.save();
    })
    .then((user) => {
      res.status(201).json({
        message: "User created!",
        userId: user._id,
      });
      const data = createData(user.Email);

      transporter.sendMail(data, (error, body) => {
        if (error) {
          return res.json({ error: error.message });
        }
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
    email: email,
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
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        process.env.SECRET_KEY_JWT,
        {
          expiresIn: "2h",
        }
      );
      res.status(200).json({
        token: token,
        userId: loadedUser._id.toString(),
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
