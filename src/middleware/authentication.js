const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const verify = jwt.verify(token, "thisIsNodejs");
    const user = await User.findOne({ _id: verify._id, "tokens.token": token }); //this line of code check if the given token is valid & if yes then focus on finding the user in the database

    if (!user) {
      throw new Error();
    }

    req.token = token; //for logout purpose

    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate" });
  }
};

module.exports = auth;
