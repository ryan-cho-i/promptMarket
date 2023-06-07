import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/AuthContext";
import "./ImageList.css";

const ImageList = () => {
  const { images, myImages, isPublic, setIsPublic } = useContext(ImageContext);
  const [me] = useContext(AuthContext);

  const imgList = (isPublic ? images : myImages).map((image) => (
    <Link
      key={image.key} // 가상돔을 효율적으로 활용하기 위해서! 인덱스처럼 사용
      to={`/images/${image._id}`}
    >
      <img alt="" src={`http://localhost:8080/uploads/${image.key}`} />
    </Link>
  ));

  return (
    <div>
      <h3 style={{ display: "inline-block", marginRight: 10 }}>
        Image List ({isPublic ? "Public" : "Private"} Photo)
      </h3>
      {me && (
        <button onClick={() => setIsPublic(!isPublic)}>
          {(isPublic ? "Private" : "Public") + " Photo"}
        </button>
      )}
      <div className="image-list-container"> {imgList}</div>
    </div>
  );
};

export default ImageList;
