const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  Topic: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Image: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Post", postSchema);