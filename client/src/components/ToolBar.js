import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

import "./ToolBar.css";

const ToolBar = () => {
  const [me, setMe] = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await axios.patch("/users/logout");
      setMe();
      toast.success("Log Out!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  return (
    <header style={{ width: "100%", height: "10vh", justifyContent: "center" }}>
      <Link to="/">
        <span
          style={{
            marginLeft: 100,
            fontWeight: 500,
            color: "black",
            fontSize: "2",
            textTransform: "uppercase",
            letterSpacing: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Home
        </span>
      </Link>
      {me ? (
        <span
          onClick={logoutHandler}
          style={{ float: "right", cursor: "pointer" }}
        >
          Logout ({me.name})
        </span>
      ) : (
        <>
          <Link
            to="/auth/login"
            style={{
              float: "right",
              marginRight: 150,
              fontWeight: 500,
              color: "black",
              fontSize: "2",
              textTransform: "uppercase",
              letterSpacing: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Sign In
          </Link>
          <Link
            to="/auth/register"
            style={{
              float: "right",
              marginRight: 20,
              fontWeight: 500,
              color: "black",
              fontSize: "2",
              textTransform: "uppercase",
              letterSpacing: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Sign Up
          </Link>
        </>
      )}
    </header>
  );
};

export default ToolBar;
