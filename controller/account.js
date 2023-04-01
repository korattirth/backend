const {
  validationResult
} = require("express-validator");
const bcypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../model/User");
const Oreders = require("../model/Orders");
const UserDto = require("../dto/UserDto");
const {
  uploadToCloudinary
} = require('../util/imageUpload');
const Orders = require("../model/Orders");
require("dotenv").config();
// const {
//   transporter
// } = require('../util/mail');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.PASSWORD,
  },
});


exports.signUp = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const hashedPw = await bcypt.hash(req.body.password, 12);
    const user = new User({
      fName: req.body.fName,
      lName: req.body.lName,
      email: req.body.email,
      password: hashedPw,
      homeAddress: req.body.homeAddress,
      address2: req.body.address2,
      zipcode: req.body.zipcode,
      city: req.body.city,
      state: req.body.state,
      dob: req.body.dob,
      isActive: false,
      role: req.body.department,
    });
    await user.save();
    var mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Signup successfully!!',
      html: "<h3>Welcome to TS High School</h3><p>Your account is under observation so wait until it's active</p>"
    };
    transporter.sendMail(mailOptions);
    res.status(201).json({
      message: "User created!",
      userId: user._id,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.signIn = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
      email: email
    }).populate({
      path: "cart.events.eventId",
      select: '_id topic image date price'
    })
    if (!user) {
      const error = new Error("Invalid Credentials!!");
      error.statusCode = 400;
      throw error;
    }
    const isEqual = await bcypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Invalid Credentials!!");
      error.statusCode = 400;
      throw error;
    }
    if (user.isActive === false) {
      const error = new Error("You have to wait until Admin is not approve your account");
      error.statusCode = 400;
      throw error;
    }
    const token = jwt.sign({
        email: user.email,
        userId: user._id.toString(),
      },
      process.env.SECRET_KEY_JWT, {
        expiresIn: "2h",
      }
    );
    res.status(200).json({
      token: token,
      userId: user._id.toString(),
      user: new UserDto(user)
    });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: "cart.events.eventId",
      select: '_id topic image date price'
    });
    if (!user) {
      const error = new Error("Invalid Credentials!!");
      error.statusCode = 400;
      throw error;
    }
    const userDto = new UserDto(user);
    res.status(200).json(userDto)

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.editUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const user = await User.findById(req.params.userId);
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
    await user.update({
      fName: fName,
      lName: lName,
      dOB: dob,
      zipcode: zipcode,
      city: city,
      state: state,
      homeAddress: homeAddress,
      address2: address2
    })
    const editUser = await User.findById(req.params.userId);
    res.status(200).json(new UserDto(editUser))
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.uploadUserImg = async (req, res, next) => {
  try {
    const image = req.file;
    if (!image) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      throw error;
    }
    let imagePath = await uploadToCloudinary(image.path);
    const user = await User.findById(req.params.userId);
    if (!user) {
      const error = new Error("Invalid Credentials!!");
      error.statusCode = 400;
      throw error;
    }
    user.image = imagePath.secure_url;
    await user.save();
    res.status(200).json(user.image)
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.postOrder = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const orders = new Oreders();
    orders.userId = user._id;
    user.cart.events.map((event) => {
      orders.events.push(event)
    })
    user.cart = [];
    await user.save();
    await orders.save();
    res.status(200).json({ message: "Order success" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.getMyOrders = async(req, res, next) => {
  try {
    const orders = await Orders.find({ userId: req.userId }).populate({
      path: 'eventId',
      select : '_id topic image date type price'
    });
    res.status(200).send(orders)
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}