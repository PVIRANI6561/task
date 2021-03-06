const mongoose = require('mongoose');

//Create schema
const UserSchema = new mongoose.Schema({
    bookName: {
        type: String,
        required: true,
    },
    authorName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    }
}, {
    versionKey: false
});

const userModel = mongoose.model("User", UserSchema);
module.exports = userModel;