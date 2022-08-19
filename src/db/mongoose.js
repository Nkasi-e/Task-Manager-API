//Loading mongoose and validator npm library
const mongoose = require("mongoose");

//setting up mongoose
const connection = "mongodb://127.0.0.1:27017/task-manager-api";
mongoose.connect(connection, { useNewUrlParser: true });
