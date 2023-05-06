const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    question: {
        type: String,
        required: true,
    },
    questionType: {
        type: String,
        required: true,
    },
    answer:{
        type: String,
        required: false,
    },
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    }
});

module.exports = mongoose.model("Contact", contactSchema);