import React, { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

import CreateImage from "../components/CreateImage";
import UploadForm from "../components/UploadForm";
import ImageList from "../components/ImageList";

const MainPage = () => {
  const [me] = useContext(AuthContext);
  return (
    <>
      <h2>Prompt Market</h2>
      {me && <CreateImage />}
      {/* {me && <UploadForm />} */}
      <ImageList />
    </>
  );
};

export default MainPage;
