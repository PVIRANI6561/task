const mongoose = require('mongoose');

// db connection
mongoose.connect('mongodb://127.0.0.1:27017/skyline', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected successfully"));