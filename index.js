const express = require("express");
const app = express();
const { connect } = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const { PORT, MONGODB_URI, CLIENT_URL, CLIENT_URL_WEB } = process.env;

app.use(express.json());
app.use(cors());

const connectDB = async () => {
  try {
    const conn = await connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("connected to mongo db", conn.connection.host);
  } catch (error) {
    console.error("error connecting to mongodb", error);
    process.exit(1);
  }
};

app.get("/", (req, res, next) => {
  res.send("(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ Hello world, I am a server!");
  next();
});

app.use("/db", require("./routes/memeRouter.js"));

app.use((err, req, res, next) => {
  console.log(err);
  if (err.name === "UnauthorizedError") {
    res.status(err.status);
  }
  return res.send({ errMsg: err.message });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on local port ${PORT}`);
  });
});
