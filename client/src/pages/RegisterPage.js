import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import CustomInput from "../components/CustomInput";
import { AuthContext } from "../context/AuthContext";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [, setMe] = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      if (username.length < 3)
        throw new Error("Make the username longer than 3 characters");
      if (password.length < 6)
        throw new Error("Make the password longer than 6 characters");
      if (password !== passwordCheck)
        throw new Error("Password is different with Password Confirmation");
      const result = await axios.post("/users/register", {
        name,
        username,
        password,
      });
      console.log(result.data);
      setMe({
        userId: result.data.userId,
        sessionId: result.data.sessionId,
        name: result.data.name,
      });
      toast.success("Success!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  return (
    <div
      style={{
        marginTop: 100,
        maxWidth: 350,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <h3>Register</h3>
      <form onSubmit={submitHandler}>
        <CustomInput label="Name" setValue={setName} />
        <CustomInput label="Username" setValue={setUsername} />
        <CustomInput label="Password" setValue={setPassword} type="password" />
        <CustomInput
          label="Confirm Password"
          setValue={setPasswordCheck}
          type="password"
        />
        <button type="submit">Sign Up!</button>
      </form>
    </div>
  );
};

export default RegisterPage;
