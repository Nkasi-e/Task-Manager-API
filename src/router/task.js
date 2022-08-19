const express = require("express");
const router = new express.Router();
const Task = require("../models/task");
const auth = require("../middleware/authentication");

//Task Endpoint
router.post("/tasks", auth, async (req, res) => {
  // const task = new Task(req.body);
  const task = new Task({
    ...req.body, //the spread operator is going to copy all of the props of body over to this object
    owner: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send();
  }
});

//Read task
router.get("/tasks", auth, async (req, res) => {
  const match = {}; //Filtering data
  const sort = {}; //sorting data
  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const inputs = req.query.sortBy.split(":");
    sort[inputs[0]] = inputs[1] === "desc" ? -1 : 1;
  }
  try {
    // const task = await Task.find({ owner: req.user._id }); //Method one
    //Using the populate function: Method two
    await req.user.populate({
      path: "tasks",
      match,
      options: {
        //Pagination
        limit: parseInt(req.query.limit), //parseInt() allows user to pass a string that contains a number into an actual integer
        skip: parseInt(req.query.skip),
        sort,
      },
    }); //filtering
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

//Read a specific task
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    // const task = await Task.({});
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});
//Updating task
router.patch("/tasks/:id", auth, async (req, res) => {
  //setting up error message and allowed field to update
  const allowedUpdate = ["description", "completed"];
  const updateFile = Object.keys(req.body);
  const validUpdate = updateFile.every((update) =>
    allowedUpdate.includes(update)
  );
  if (!validUpdate) {
    res.status(400).send({ error: "Invalid field" });
  }

  try {
    // const task = await Task.findById(req.params.id);
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    /*const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });*/
    if (!task) {
      res.status(404).send();
    }
    updateFile.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(400).send();
  }
});

//Deleting tasks
router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      res.status(404).send({ error: "No task found" });
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
