import { Navigate } from "react-router-dom";

export default function AuthRedirect({ children }) {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/books" replace />;
  }

  return children;
}
