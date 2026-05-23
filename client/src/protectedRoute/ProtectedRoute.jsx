import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (!user || !user.role) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;








