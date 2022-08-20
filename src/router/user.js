const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/authentication");
const router = new express.Router();
const upload = require("../middleware/upload");
const sharp = require("sharp");

//User Endpoint
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken(); //token for the saved user
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

//Login User route
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token }); //the toJSON is a custom func/method for hiding user data but not manually, located in the user model
  } catch (e) {
    res.status(400).send();
  }
});

//Logout User route
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

//Logout of all devices
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

//Reading all users
// router.get("/users", auth, async (req, res) => {
//   try {
//     const user = await User.find({});
//     res.send(user);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

//Read user - like profile
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

//Reading a specific user
// router.get("/users/:id", async (req, res) => {
//   const _id = req.params.id;
//   try {
//     const user = await User.findById(_id);
//     if (!user) {
//       return res.status(404).send();
//     }

//     res.send(user);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

//Updating a user
router.patch("/users/me", auth, async (req, res) => {
  //setting the field that can be allowed to update and Error response custom code
  const allowedUpdate = ["name", "email", "password", "age"];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) =>
    allowedUpdate.includes(update)
  );
  if (!isValidOperation) {
    res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    //configure for mongoose middleware
    // const user = await User.findById(req.user._id);
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();

    /* const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });*/
    // if (!user) {
    //   res.status(404).send();
    // }
    res.send(req.user);
  } catch (error) {
    res.status(400).send();
  }
});

//Deleting users
router.delete("/users/me", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);
    // if (!user) {
    //   res.status(404).send({ error: "No user found" });
    // }

    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

//File Upload endpoint for creating and updating
router.post(
  "/users/me/upload",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    //using sharp to auto crop and format the image
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 200, height: 200 })
      .png()
      .toBuffer();
    req.user.profileImage = buffer;
    await req.user.save();
    res.send("File upload successful");
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//delete endpoint for file upload
router.delete(
  "/users/me/upload",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    req.user.profileImage = undefined;
    await req.user.save();
    res.send("File deleted successfully");
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//serving up file(avatar) url
router.get("/users/:id/upload", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.profileImage) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(user.profileImage);
  } catch (e) {
    res.status(404).send();
  }
});

module.exports = router;
