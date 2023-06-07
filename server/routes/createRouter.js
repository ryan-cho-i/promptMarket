require("dotenv").config();

const { Router } = require("express");
const createRouter = Router();

const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const Image = require("../models/Image");
const mongoose = require("mongoose");

const { Configuration, OpenAIApi } = require("openai");

createRouter.post("/", async (req, res) => {
  try {
    console.log("public??" + req.body.isPublic);

    const configuration = new Configuration({
      apiKey: process.env.OPEN_API,
    });

    const openai = new OpenAIApi(configuration);

    let gpt_prompt = [
      {
        role: "system",
        content:
          "Imagine the detail appearance of the input. Response it shortly around 20 words.",
      },
    ];

    gpt_prompt.push({
      role: "user",
      content: req.body.prompt,
    });

    const prompt = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: gpt_prompt,
    });

    let detail = prompt.data.choices[0].message.content;

    const response = await openai.createImage({
      prompt: detail,
      n: 1,
      size: "1024x1024",
    });

    const imgName = `${uuid()}.jpeg`;

    console.log({
      imgName: imgName,
      description: detail,
      url: response.data.data[0].url,
    });

    axios({
      url: response.data.data[0].url,
      responseType: "stream",
    })
      .then((response) => {
        response.data
          .pipe(
            fs.createWriteStream(path.join(__dirname, "../uploads", imgName))
          )
          .on("finish", () => {
            console.log("Image downloaded successfully.");
          })
          .on("error", (error) => {
            console.error("Failed to download the image:", error);
          });
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    const image = await new Image({
      user: {
        _id: req.user.id,
        name: req.user.name,
        username: req.user.username,
      },
      public: req.body.isPublic,
      key: imgName,
      originalFileName: detail,
    }).save();

    res.json({
      imgName: imgName,
      description: detail,
      url: response.data.data[0].url,
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = { createRouter };
