import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
    const isAuthenticated = sessionStorage.getItem("user_data") !== null;
    return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}