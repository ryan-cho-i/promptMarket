import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import CustomInput from "../components/CustomInput";
import { ImageContext } from "../context/ImageContext";

const CreateImage = () => {
  const { images, setImages, myImages, setMyImages } = useContext(ImageContext);
  const [prompt, setPrompt] = useState("");
  const [loadingTime, setLoadingTime] = useState(false);
  const [imgName, setImgName] = useState("Loading...");
  const [imgSrc, setImgSrc] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      setLoadingTime(true);
      console.log(prompt);
      console.log(isPublic);

      const result = await axios.post("/create", {
        prompt,
        isPublic,
      });
      setImgName(result.data.newPrompt);
      setImgSrc(result.data.url);
      setLoadingTime(false);
      if (isPublic) setImages([...images, result.data]);
      setMyImages([...myImages, result.data]);
      toast.success("Success!");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  return (
    <div
      style={{
        maxWidth: "100%",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <form onSubmit={submitHandler}>
        <CustomInput label="Prompt" setValue={setPrompt} />
        <input
          type="checkbox"
          id="public-check"
          value={!isPublic}
          onChange={() => setIsPublic(!isPublic)}
        />
        <label htmlFor="public-check">비공개</label>
        <div>
          {" "}
          <button
            style={{
              marginTop: 5,
            }}
            type="submit"
          >
            Create Image!
          </button>
        </div>
      </form>
      {loadingTime && imgName}
      {loadingTime && (
        <img
          src={imgSrc}
          style={{
            maxWidth: "100%",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
      )}
    </div>
  );
};

export default CreateImage;
