const {
  validationResult
} = require("express-validator");
const bcypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../model/User");
const {
  Roles
} = require("../util/enum");
const UserDto = require("../dto/UserDto");
const cloudinary = require('cloudinary').v2;

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

// Configuration 
cloudinary.config({
  cloud_name: "dflz4gt7i",
  api_key: "762262536931417",
  api_secret: "62fhXp0fDeKZdxtp1lopqaODm3k"
});

exports.signUp = (req, res, next) => {

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
        DOB: req.body.dob,
        IsActive: false,
        UserRole: req.body.department,
      });
      return user.save();
    })
    .then((user) => {
      res.status(201).json({
        message: "User created!",
        userId: user._id,
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
      Email: email
    })
    .then((user) => {
      if (!user) {
        const error = new Error("Invalid Credentials!!");
        error.statusCode = 400;
        throw error;
      }
      loadedUser = user;

      return bcypt.compare(password, user.Password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Invalid Credentials!!");
        error.statusCode = 400;
        throw error;
      }
      const token = jwt.sign({
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        process.env.SECRET_KEY_JWT, {
          expiresIn: "2h",
        }
      );

      res.status(200).json({
        token: token,
        userId: loadedUser._id.toString(),
        user: new UserDto(loadedUser)
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getCurrentUser = (req, res, next) => {

  User.findById(req.userId).then(user => {
    if (!user) {
      const error = new Error("Invalid Credentials!!");
      error.statusCode = 400;
      throw error;
    }
    const userDto = new UserDto(user);
    res.status(200).json(userDto)
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  })
}

exports.editUser = (req, res, next) => {
  let userDto;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  User.findById(req.params.userId).then(user => {
      if (!user) {
        const error = new Error("Invalid Credentials!!");
        error.statusCode = 400;
        throw error;
      }

      const {
        fName,
        lName,
        dob,
        zipcode,
        city,
        state,
        homeAddress,
        address2
      } = req.body;
      user.update({
        FName: fName,
        LName: lName,
        DOB: dob,
        Zipcode: zipcode,
        City: city,
        State: state,
        HomeAddress: homeAddress,
        Address2: address2
      }).then(() => {
        User.findById(req.params.userId).then(user => {
          userDto = new UserDto(user);
          res.status(200).json(userDto)
        })
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
}

exports.uploadUserImg = (req, res, next) => {
  const image = req.file;
  if (!image) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    throw error;
  }
  cloudinary.uploader.upload(image.path, (error, result) => {
    let loadedUser;
    if (error) {
      res.status(500).send('An error occurred while uploading the image');
    } else {
      User.findById(req.params.userId).then(user => {
          loadedUser = user;
          user.Image = result.secure_url;
          return user.save();
        }).then(() => {
          res.status(200).json(loadedUser.Image)
        })
        .catch(err => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        })
    }
  })
}