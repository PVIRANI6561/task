require('dotenv').config();
const http = require('http');
const bcrypt = require('bcrypt');
const express = require("express");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const rs = require('randomstring');
var validator = require('validator');
require('./db/db.connection')
const userModel = require('./schema/book.schema')
const loginModel = require('./schema/login.schema')

const app = express();
const SERVER_PORT = 5050;

// bind the cors
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.post("/login", async (request, response) => {
    if (validator.isEmail(request.body.email)) {
        const users = await loginModel.find({ email: request.body.email });
        var res = null

        if (users.length > 0) {
            const user = { email: users[0].email, pass: users[0].pass };
            try {
                bcrypt.compare(request.body.password, user.pass).then(function (result) {
                    if (result) {
                        const token = jwt.sign(user, process.env.SECRET_CODE)
                        res = { token: token, err: null }
                        response.send(res);
                        console.log(res);
                    }
                    else {
                        res = { token: null, err: "Password is incorrect" }
                        response.send(res)
                    }
                });
            } catch (error) {
                response.status(500).send(error);
            }
        } else {
            res = { token: null, err: "Email id doesn't exit" }
            response.send(res)
        }
    }
    else {
        res = { token: null, err: "Please enter valid email id" }
        response.send(res)
    }
});

// Token verification
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    console.log(bearerHeader);
    if (bearerHeader) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

app.post("/add_book", verifyToken, (request, response) => {
    jwt.verify(request.token, process.env.SECRET_CODE, async (err, data) => {
        if (err) {
            response.send(err.message)
        } else {
            const user = new userModel(request.body);

            try {
                await user.save();
                response.send(user);
            } catch (error) {
                response.status(500).send(error);
            }
        }
    })
});

app.get("/get_book", verifyToken, (request, response) => {
    jwt.verify(request.token, process.env.SECRET_CODE, async (err, data) => {
        if (err) {
            response.send(err.message)
        } else {
            const users = await userModel.find({});
            try {
                response.send(users);
            } catch (error) {
                response.status(500).send(error);
            }
        }
    })
});

app.delete("/delete_book", verifyToken, (request, response) => {
    jwt.verify(request.token, process.env.SECRET_CODE, async (err, data) => {
        if (err) {
            response.send(err.message)
        } else {
            const users = await userModel.deleteOne({ _id: request.body._id });
            try {
                response.send(users);
            } catch (error) {
                response.status(500).send(error);
            }
        }
    })
});

app.put("/update_book", async (request, response) => {
    const users = await userModel.where({ _id: request.body._id }).update(request.body.data);

    try {
        response.send(users);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.listen(SERVER_PORT,
    () => console.log(`API is running on http://localhost:${SERVER_PORT}`)
);