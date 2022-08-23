//Loading mongoose and validator npm library
const mongoose = require("mongoose");

// const connection = process.env.MONGODB_URL;

//setting up mongoose
const connection = process.env.MONGODB_URL;
mongoose.connect(connection, { useNewUrlParser: true });

/*//setting up mongoose
const connection = dotenv.config({ path: "../../config/dev.env" });
// const connection = process.env.MONGODB_URL;
mongoose.connect(connection, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
});*/
