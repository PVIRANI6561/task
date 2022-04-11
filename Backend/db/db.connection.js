const mongoose = require('mongoose');

// db connection
mongoose.connect('mongodb+srv://skyline:skyline@cluster0.mopic.mongodb.net/Skyline?retryWrites=true&w=majority');
// mongoose.connect('mongodb+srv://skyline:skyline@cluster0.mopic.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected successfully"));