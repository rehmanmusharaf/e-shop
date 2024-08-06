import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "./components/Layout/Loader";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.user);
  if (isLoading === false) {
    if (isAuthenticated) {
      return children;
    } else {
      return <Navigate to="/login" replace />;
    }
  } else {
    return <Loader />;
  }
};

export default ProtectedRoute;
