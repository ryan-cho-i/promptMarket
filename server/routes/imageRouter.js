const { Router } = require("express");
const imageRouter = Router();
const Image = require("../models/Image");
const { upload } = require("../middleware/imageUpload");

const fs = require("fs");
const { promisify } = require("util");
const fileUnlink = promisify(fs.unlink);

const mongoose = require("mongoose");

imageRouter.post("/", upload.single("imageTest"), async (req, res) => {
  try {
    if (!req.user) throw new Error("No Authorization");
    const image = await new Image({
      user: {
        _id: req.user.id,
        name: req.user.name,
        username: req.user.username,
      },
      public: req.body.public,
      key: req.file.filename,
      originalFileName: req.file.originalname,
    }).save();
    res.json(image);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

imageRouter.get("/", async (req, res) => {
  const images = await Image.find({ public: true });
  res.json(images);
});

imageRouter.delete("/:imageId", async (req, res) => {
  try {
    if (!req.user) throw new Error("No Authorization");

    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error("The image ID is invalid");

    const image = await Image.findOneAndDelete({ _id: req.params.imageId }); // Delete data in MongoDB

    if (!image)
      return res.json({
        message: "The requested image file was already deleted",
      });

    await fileUnlink(`./uploads/${image.key}`); // Delete image file in local storage

    res.json({ message: "Delete!" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

imageRouter.patch("/:imageId/like", async (req, res) => {
  try {
    if (!req.user) throw new Error("No Authorization");
    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error("The image ID is invalid");
    const image = await Image.findByIdAndUpdate(
      { _id: req.params.imageId },
      {
        $addToSet: { likes: req.user.id },
      },
      { new: true }
    );
    res.json(image);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

imageRouter.patch("/:imageId/unlike", async (req, res) => {
  try {
    if (!req.user) throw new Error("No Authorization");
    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error("The image ID is invalid");
    const image = await Image.findByIdAndUpdate(
      { _id: req.params.imageId },
      {
        $pull: { likes: req.user.id },
      },
      { new: true }
    );
    res.json(image);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = { imageRouter };
