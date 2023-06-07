const { Router } = require("express");
const userRouter = Router();
const User = require("../models/User");
const { hash, compare } = require("bcryptjs"); // hash function
const mongoose = require("mongoose");
const Image = require("../models/Image");

userRouter.post("/register", async (req, res) => {
  try {
    const hashedPassword = await hash(req.body.password, 10);

    const user = await new User({
      name: req.body.name,
      username: req.body.username,
      hashedPassword,
      sessions: [{ createdAt: new Date() }],
    }).save(); // raw (JSON)

    const session = user.sessions[0];

    res.json({
      message: "User registered",
      sessionId: session._id,
      name: user.name,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.patch("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) throw new Error("Invalid Information");
    const isValid = await compare(req.body.password, user.hashedPassword);
    if (!isValid) throw new Error("Invalid Information");

    user.sessions.push({ createdAt: new Date() });
    await user.save();

    const session = user.sessions[user.sessions.length - 1];
    console.log(session);

    res.json({
      message: "User Validated",
      sessionId: session._id,
      name: user.name,
      userId: user._id,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.patch("/logout", async (req, res) => {
  try {
    if (!req.user) throw new Error("Invalid Session ID");
    await User.updateOne(
      { _id: req.user.id },
      {
        $pull: { sessions: { _id: req.headers.sessionid } },
      }
    );
    res.json({ message: "User is logged out" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/me", (req, res) => {
  try {
    if (!req.user) throw new Error("No Authorization");
    res.json({
      message: "success",
      sessionId: req.headers.sessionid,
      name: req.user.name,
      userId: req.user._id,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/me/images", async (req, res) => {
  try {
    if (!req.user) throw new Error("No Authorization");
    const images = await Image.find({ "user._id": req.user.id });
    res.json(images);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = { userRouter };
