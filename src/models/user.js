const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

//Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String, //Note: we can also set up custom validation in this field but at it most basic we can set up types for the fields
      require: true,
    },
    email: {
      unique: true,
      type: String,
      required: true,
      validate(e) {
        if (!validator.isEmail(e)) {
          throw new Error("Please Enter a valid email");
        }
      },
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Please Enter a positive age");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Password must not contain 'Password' ");
        }
      },
    },
    //Storing a user token
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    profileImage: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

//Setting Up a virtual Prop.. relationship between two entities, in this case user and task
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id", //relationship btw the _id and the owner field
  foreignField: "owner", //name of field on the other database we're setting a relationship with
});

//Hiding Private Data
userSchema.methods.toJSON = function () {
  //the JSON must be in uppercase and not lowercase
  const user = this;
  const userObject = user.toObject(); //the toObject() method is going to give us the raw profile data

  //Deleting some files off the object using the delete keyword
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.profileImage;

  return userObject;
};

//Generating authentication token
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  //saving the token
  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

//Logging in for users
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

//Setting up the middleware / hashing the plane text password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  //Hashing User Password
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

//Delete user tasks middleware when user is removed

userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });

  next();
});

//Setting up the first function model
const User = mongoose.model("User", userSchema);

module.exports = User;
