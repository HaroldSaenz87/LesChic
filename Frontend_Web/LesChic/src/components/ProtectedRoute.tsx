import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
    
    // Check if user_data exists in sessionStorage
    const isAuthenticated = sessionStorage.getItem("user_data") !== null;
    
    // If authenticated render child routes, otherwise redirect to login
    return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}