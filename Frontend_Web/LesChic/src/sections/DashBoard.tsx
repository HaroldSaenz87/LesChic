import { Outlet, useNavigate } from "react-router-dom";
import { SideNav } from "../components/SideNav";
import { useEffect, useState } from "react";
import { buildPath } from "../utils/buildPath";

export const DashBoard = () => {

    const navigate = useNavigate();

    // for the collection
    const [clothes, setClothes] = useState([]);
    const [lookbooks, setLookbooks] = useState([]);

    useEffect(() => {

        // If the user lands here but the data is gone, kick them out immediately
        const rawData = sessionStorage.getItem("user_data");
        const isAuthenticated = rawData !== null;
        

        if (!isAuthenticated) {
            navigate("/", { replace: true });
            return;
        }

        const userData = JSON.parse(rawData);

        // clothing items fetching
        const fetchClothes = async () => {
            try {
                // Use your buildPath utility here just like in your other components
                const response = await fetch(buildPath('api/clothes'), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-token': userData.token 
                    }
                });

                const data = await response.json();

                if (data.ok) {
                    // This updates the state that is passed to <Outlet context={{ clothes }} />
                    setClothes(data.clothes);
                }
            } catch (error) {
                console.error("LesChic Dashboard Fetch Error:", error);
            }
        };

        const fetchLookbooks = async () => {
            try{
                const response = await fetch(buildPath('api/lists'), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-token': userData.token
                    }
                });

                const data = await response.json();

                if(data.ok){
                    setLookbooks(data.lists);
                }

            }
            catch(error){
                console.error("Lookbook fetch error:", error);
            }
        };

        fetchClothes();
        fetchLookbooks();



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
                        <Outlet context={{clothes, lookbooks}} /> 
                    </div>
                    
                </main>
            
            </div>
        
        </div>
    );
};