import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const ImagePage = () => {
  const navigate = useNavigate();
  const { imageId } = useParams();
  const { images, myImages, setImages, setMyImages } = useContext(ImageContext);
  const [me] = useContext(AuthContext);
  const [hasLiked, setHasLiked] = useState(false);
  const image =
    images.find((image) => image._id === imageId) ||
    myImages.find((image) => image._id === imageId);
  useEffect(() => {
    if (me && image && image.likes.includes(me.userId)) setHasLiked(true);
  }, [me, image]);

  if (!image) return <h3>Loading...</h3>;

  const updateImage = (images, image) =>
    [...images.filter((image) => image._id !== imageId), image].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  const onSubmit = async () => {
    const result = await axios.patch(
      `/images/${imageId}/${hasLiked ? "unlike" : "like"}`
    );
    if (result.data.public) setImages(updateImage(images, result.data));
    else setImages(updateImage(myImages, result.data));
    setHasLiked(!hasLiked);
  };

  const deleteHandler = async () => {
    try {
      if (!window.confirm("Do you want to delete really?")) return;
      const result = await axios.delete(`/images/${imageId}`);
      setImages(images.filter((image) => image._id !== imageId));
      setMyImages(myImages.filter((image) => image._id !== imageId));
      navigate("/");
      toast.success(result.data.message);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div>
      <h3>Prompt : {image.originalFileName}</h3>
      <img
        style={{ width: "100%" }}
        alt={imageId}
        src={`http://localhost:8080/uploads/${image.key}`}
      />
      <span> Like {image.likes.length}</span>
      {me && image.user._id === me.userId && (
        <button
          style={{ float: "right", marginLeft: 10 }}
          onClick={deleteHandler}
        >
          Delete
        </button>
      )}
      {me && (
        <button style={{ float: "right" }} onClick={onSubmit}>
          {hasLiked ? "Cancel Like" : "Like"}
        </button>
      )}
    </div>
  );
};

export default ImagePage;
