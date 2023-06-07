require("dotenv").config();
const { MONGO_URI, PORT, OPEN_API } = process.env;

const express = require("express");
const app = express();

const mongoose = require("mongoose");

const { imageRouter } = require("./routes/imageRouter");
const { userRouter } = require("./routes/userRouter");
const { createRouter } = require("./routes/createRouter");

const { authenticate } = require("./middleware/authentication");

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.use(express.json()); // Set up express middleware to parse JSON data

    app.use(authenticate);

    app.use("/uploads", express.static("uploads")); // Serve static files from the "uploads" directory

    app.use("/images", imageRouter);

    app.use("/users", userRouter);

    app.use("/create", createRouter);

    app.listen(PORT, () =>
      console.log("Express server listening on PORT " + PORT)
    );
  })
  .catch((err) => {
    console.log(err);
  });
