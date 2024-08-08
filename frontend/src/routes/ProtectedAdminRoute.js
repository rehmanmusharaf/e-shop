import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../components/Layout/Loader";

const ProtectedAdminRoute = ({ children }) => {
  const { isLoading, isAuthenticated, user } = useSelector(
    (state) => state.user
  );
  console.log(
    "here is the admin proteatacted route data:",
    isLoading,
    isAuthenticated
  );
  if (isLoading === false) {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    } else if (user.role !== "Admin") {
      return <Navigate to="/" replace />;
    }
    return children;
  } else {
    <Loader />;
  }
};

export default ProtectedAdminRoute;
