import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "./components/Layout/Loader";

const ProtectedRoute = ({ children }) => {
  const { isSeller, isLoading } = useSelector((state) => state.seller);
  if (isLoading === false) {
    if (isSeller) {
      return children;
    } else {
      return <Navigate to="/" replace />;
    }
  } else {
    return <Loader />;
  }
};

export default ProtectedRoute;
