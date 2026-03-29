import { Outlet, useNavigate } from "react-router-dom";
import { SideNav } from "../components/SideNav";
import { useEffect } from "react";

export const DashBoard = () => {

    const navigate = useNavigate();

    useEffect(() => {

        // If the user lands here but the data is gone, kick them out immediately
        const isAuthenticated = sessionStorage.getItem("user_data") !== null;
        

        if (!isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [navigate]);

    return (

        // Full screen container with background image
        <div className="min-h-screen bg-dashboard transition-all duration-500">

            <div className="flex h-screen overflow-hidden">

                {/* Fixed left sidebar with nav links */}
                <SideNav />

                {/* Scrollable main content area and renders the active nested route */}
                <main className="flex-1 overflow-y-auto p-8 relative">
                    
                    <div className="max-w-7xl mx-auto">
                        <Outlet /> 
                    </div>
                    
                </main>
            
            </div>
        
        </div>
    );
};