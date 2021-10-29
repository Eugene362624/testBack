const express = require("express");
const mongoose = require("mongoose");
const BP = require("body-parser");
const cors = require('cors')
const config = require("./config/config");
const matchRouter = require("./routes/matchRoutes");
const competitionRouter = require("./routes/competitionRoutes");
const sharedRouter = require("./routes/sharedRoutes");

const app = express();
app.use(BP.json());
app.use(cors())
app.use(BP.urlencoded({ extended: true }));

app.use(matchRouter);
app.use(competitionRouter);
app.use(sharedRouter);

const start = async () => {
  try {
    await mongoose.connect(config.dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("mongo db is connected");
    app.listen(config.port, () => {
      console.log("server started on port 3000");
    });
  } catch (error) {
    console.log(error);
  }
};

start();
