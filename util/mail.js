const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "korattirth2001@gmail.com",
      pass: "pvvblfazahvmvezj",
    },
});
  
module.exports = transporter;