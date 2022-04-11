// env file
require('dotenv').config();

// modules
const express = require("express");
const http = require('http');
const bcrypt = require('bcrypt');
const hbs = require("hbs");
const path = require("path");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const rs = require('randomstring');
const validator = require('validator');
const fs = require("fs");
const event = require("events")
const events = new event;

// db connection file
require('./db/db.connection')

// schemas in db
const userModel = require('./schema/book.schema')
const loginModel = require('./schema/login.schema')

const app = express();
const SERVER_PORT = 5050;

// important while requesting
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json());


//static file connection
// app.set("view engine", "hbs")
// app.set("views", path.join(__dirname, "templates/views"))
// hbs.registerPartials(path.join(__dirname, "templates/partials"))

// Token verification
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

//render static file at root url
// app.get("/", (req, res) => {
//     res.render("index");
// })

//Register user
app.post("/register", async (request, response) => {

    if (validator.isEmail(request.body.email)) {

        // bcrypt.hash(request.body.password, 10, async function (err, hash) {
        // Store hash in your password DB.
        const users = await loginModel.find({ email: request.body.email });

        if (users.length > 0) {
            res = { err: "Email id is already exit." }
            response.send(res)
        } else {

            try {
                const user = new loginModel({ email: request.body.email, password: request.body.password });

                const token = await user.tokenGen();
                console.log(token);
                // await user.save();
                // response.send(user);
            } catch (error) {
                response.status(500).send(error);
            }
        }
        // });

    } else {
        res = { err: "Please enter valid email id" }
        response.send(res)
    }
})

//login page
app.post("/login", async (request, response) => {

    if (validator.isEmail(request.body.email)) {
        const users = await loginModel.find({ email: request.body.email });
        var res = null

        if (users.length > 0) {
            const user = { email: users[0].email, password: users[0].password };
            try {
                bcrypt.compare(request.body.password, user.password).then(async function (result) {
                    if (result) {
                        const token = jwt.sign(user, process.env.SECRET_CODE)
                        res = { token: token, err: null }
                        response.send(res);
                        // console.log(res);
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

//add book
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

//get book
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

//delete book
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

//update book
app.put("/update_book", verifyToken, (request, response) => {
    jwt.verify(request.token, process.env.SECRET_CODE, async (err, data) => {
        if (err) {
            response.send(err.message)
        } else {
            const users = await userModel.where({ _id: request.body._id }).update(request.body.data);

            try {
                response.send(users);
            } catch (error) {
                response.status(500).send(error);
            }
        }
    })
});

app.listen(SERVER_PORT,
    () => console.log(`API is running on http://localhost:${SERVER_PORT}`)
);