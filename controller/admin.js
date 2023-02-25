const {validationResult} = require("express-validator");
const bcypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../model/User");
const {Roles} = require("../util/enum");
const UserDto = require("../dto/UserDto");
const {
  json
} = require("body-parser");

exports.userList = (req, res, next) => {
  req.userId &&
    User.findById(req.userId)
    .then((user) => {
      if (user && user.UserRole == Roles.Admin) {
        User.find().then((userList) => {
          let userListDto = [];
          userList.forEach(user => {
            userListDto.push(new UserDto(user))
          })
          res.status(200).json(userListDto);
        })
      } else {
        const error = new Error("User does Not Authorized");
        error.statusCode = 401;
        throw error;
      }
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.editActiveStatus = (req, res, next) => {
  req.userId && User.findById(req.body.userId).then(user => {
    if (!user) {
      const error = new Error("somthing went wrong!!");
      error.statusCode = 400;
      throw error;
    }
    user.IsActive = !user.IsActive;
    return user.save();
  }).then(() => {
    res.status(200).json({
      message: 'Status change successfully'
    });
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  })
}