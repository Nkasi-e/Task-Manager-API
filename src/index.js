//Loading the express
const express = require("express");
require("./db/mongoose");
const userRouter = require("./router/user");
const taskRouter = require("./router/task");

const app = express();

const port = process.env.PORT || 3000;

//Middleware

//express.json() converts a json file into an object file
app.use(express.json(), userRouter, taskRouter);
// app.use(userRouter, taskRouter);

app.listen(port, () => {
  console.log("server running on port 3000");
});
