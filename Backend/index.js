const express = require("express");
const cors = require("cors");
const rs = require('randomstring');
require('./db/db.connection')
const userModel = require('./schema/book.schema')

const app = express();
const SERVER_PORT = 5050;

// bind the cors
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.post("/add_book", async (request, response) => {
    const user = new userModel(request.body);

    try {
        await user.save();
        response.send(user);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/get_book", async (request, response) => {
    const users = await userModel.find({});

    try {
        response.send(users);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.delete("/delete_book", async (request, response) => {
    const users = await userModel.deleteOne({ _id: request.body._id });

    try {
        response.send(users);
    } catch (error) {
        response.status(500).send(error);
    }
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