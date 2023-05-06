const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const suggestedStudentsSchema = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    suggestedUser : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    suggestedEvent : {
        type : Schema.Types.ObjectId,
        ref : 'Event',
        required : true
    }
});

module.exports = mongoose.model("SuggestedUser", suggestedStudentsSchema);