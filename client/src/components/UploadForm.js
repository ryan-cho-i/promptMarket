import React, { useState, useContext } from "react";
import axios from "axios";
import "./UploadForm.css";
import { toast } from "react-toastify";
import ProgressBar from "./ProgressBar";
import { ImageContext } from "../context/ImageContext";

const UploadForm = () => {
  const { images, setImages, myImages, setMyImages } = useContext(ImageContext);
  const defaultFileName = "Please upload image file";
  const [imageFile, setImageFile] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [fileName, setFileName] = useState(defaultFileName);
  const [percent, setPercent] = useState(0);
  const [isPublic, setIsPublic] = useState(true);

  const imageSelectHandler = (event) => {
    const imageFileInfo = event.target.files[0];
    setImageFile(imageFileInfo);
    setFileName(imageFileInfo.name);
    const fileReader = new FileReader();
    fileReader.readAsDataURL(imageFileInfo);
    fileReader.onload = (e) => setImgSrc(e.target.result);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("imageTest", imageFile);
    formData.append("public", isPublic);
    try {
      const res = await axios.post("/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          setPercent(Math.round((100 * e.loaded) / e.total));
        },
      });

      if (isPublic) setImages([...images, res.data]);
      setMyImages([...myImages, res.data]);

      toast.success("success!");
      setTimeout(() => {
        setPercent(0);
        setFileName(defaultFileName);
        setImgSrc(null);
      }, 3000);
    } catch (err) {
      console.log({ err });
      setPercent(0);
      setFileName(defaultFileName);
      setImgSrc(null);
      toast.error("fail!");
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <img
          src={imgSrc}
          alt=""
          className={`image-preview ${imgSrc && "image-preview-show"}`}
        ></img>
        <ProgressBar percent={percent} />
        <div className="file-dropper">
          {fileName}
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={imageSelectHandler}
          />
        </div>
        <input
          type="checkbox"
          id="public-check"
          value={!isPublic}
          onChange={() => setIsPublic(!isPublic)}
        />
        <label htmlFor="public-check">비공개</label>
        <button
          type="submit"
          style={{
            width: "100%",
            height: 40,
            borderRadius: 3,
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default UploadForm;
