const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fName: {
    type: String,
    required: true,
  },
  lName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  homeAddress: {
    type: String,
    required: true,
  },
  address2: {
    type: String,
    required: true,
  },
  zipcode: {
    type: Number,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  role: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("User", userSchema);
