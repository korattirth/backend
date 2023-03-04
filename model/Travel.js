const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const travelSchema = new Schema({
    topic: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: [{
        type: String,
        required: true
    }],
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Travel", travelSchema);