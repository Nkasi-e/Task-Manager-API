const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      //Adding a single field to the task model.. which creates a relationship between the user and the task
      //this field is gonna store the ID. of the user who created it which will allow us to lock down the task management
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", //the ref attribute is used to reference another model, in this case it is the User model
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);
//creating task that belongs to a specific user

module.exports = Task;
