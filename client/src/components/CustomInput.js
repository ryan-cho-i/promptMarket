import React from "react";

const CustomInput = ({ label, setValue, type = "text" }) => {
  return (
    <div>
      <label>{label}</label>
      <input
        style={{ width: "100%" }}
        type={type}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default CustomInput;
