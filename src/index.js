//Loading the express
const express = require("express");
require("./db/mongoose");
const userRouter = require("./router/user");
const taskRouter = require("./router/task");

const app = express();

const port = process.env.PORT || 3000;

//File upload
const multer = require("multer");

//multer middleware
const upload = multer({
  dest: "images",
  //the limits property helps to configure the file size limit
  limits: {
    fileSize: 1000000,
  },
  //fileFilter() property helps to configure/filter the files we don't want to have uploaded

  fileFilter(req, file, callback) {
    //For multiple file type use regular expression (regex)
    if (!file.originalname.match(/\.(doc|docx|pdf)$/)) {
      callback(new Error("File format not supported"));
    }
    callback(undefined, true);

    //for single type file
    /*if (!file.originalname.endsWith(".pdf")) {
      return callback(new Error("Please upload a PDF format"));
    }
    callback(undefined, true);*/
  },
});

//Post Request for file upload
app.post("/upload", upload.single("upload"), (req, res) => {
  res.send();
});

//Middleware

//express.json() converts a json file into an object file
app.use(express.json(), userRouter, taskRouter);
// app.use(userRouter, taskRouter);

app.listen(port, () => {
  console.log("server running on port 3000");
});
