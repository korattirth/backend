const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  FName: {
    type: String,
    required: true,
  },
  LName: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  HomeAddress: {
    type: String,
    required: true,
  },
  Address2: {
    type: String,
    required: true,
  },
  Zipcode: {
    type: Number,
    required: true,
  },

  City: {
    type: String,
    required: true,
  },
  State: {
    type: String,
    required: true,
  },
  Department: {
    type: String,
    required: true,
  },
  DOB: {
    type: Date,
    required: true,
  },
  IsActive: {
    type: Boolean,
    required: true,
  },
  UserRole: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
