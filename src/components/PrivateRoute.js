import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
import { Navigate } from "react-router-dom";

const PrivateOutlet = ({ children }) => {
  const { user } = useContext(AuthContext);
  const checkUser = Object.keys(user).length !== 0;
  return checkUser ? children : <Navigate to="/login" />;
};

export default PrivateOutlet;
