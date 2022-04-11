require('dotenv').config();

const mongoose = require('mongoose');
var validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


//Create schema
const loginSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate(email) {
            if (!validator.isEmail(email)) {
                throw new Error("Email is not validate.");
            }
        }
    },
    password: {
        type: String,
        required: true,
    }
}, {
    versionKey: false
});

loginSchema.methods.tokenGen = async () => {

    try {
        const token = await jwt.sign({ _id: this._id }, process.env.SECRET_CODE)
        // console.log(token);
        return token;
    } catch (error) {
        res.send(error);
    }
}

loginSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        console.log(this.password);
        this.password = await bcrypt.hash(this.password, 10);
        console.log(this.password);
    }
    next();
})

const loginModel = mongoose.model("Login", loginSchema);
module.exports = loginModel;