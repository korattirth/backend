const { validationResult } = require("express-validator");
const bcypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../model/User");
const { Roles } = require("../util/enum");

exports.userList = (req, res, next) => {
  req.userId &&
    User.findById(req.userId)
      .then((user) => {
        if (user.UserRole == Roles.Admin) {
          res.status(200).json({
            user,
          });
        }
      })
      .catch((error) => console.log("error", error));
};
