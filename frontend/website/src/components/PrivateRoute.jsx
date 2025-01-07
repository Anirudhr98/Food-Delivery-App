import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux"; // Or context if you're using context API

const PrivateRoute = ({ allowedRoles }) => {
  const user = useSelector((state) => state.user.userDetails); // Replace with your actual user selector

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.registered_as)) {
    // Redirect to the home page or an unauthorized page if role is not allowed
    return <Navigate to="/" replace />;
  }

  // Render the child components if role is allowed
  return <Outlet />;
};

export default PrivateRoute;
