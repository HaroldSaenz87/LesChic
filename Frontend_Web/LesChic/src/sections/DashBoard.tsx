import { Outlet, useNavigate } from "react-router-dom";
import { SideNav } from "../components/SideNav";
import { useEffect, useState, useCallback } from "react";
import { buildPath } from "../utils/buildPath";

export const DashBoard = () => {
    
    const navigate = useNavigate();
    const [clothes, setClothes] = useState([]);
    const [lookbooks, setLookbooks] = useState([]);

    // Lifted fetch function so it's accessible to the return/Outlet context
    const fetchLookbooks = useCallback(async () => {
        const rawData = sessionStorage.getItem("user_data");
        if (!rawData) return;
        const userData = JSON.parse(rawData);

        try {
            const response = await fetch(buildPath('api/lists'), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-token': userData.token
                }
            });
            const data = await response.json();
            if (data.ok) {
                setLookbooks(data.lists);
            }
        } catch (error) {
            console.error("Lookbook fetch error:", error);
        }
    }, []);

    const fetchClothes = async () => {
        const rawData = sessionStorage.getItem("user_data");
        if (!rawData) return;
        const userData = JSON.parse(rawData);

        try {
            const response = await fetch(buildPath('api/clothes'), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-token': userData.token 
                }
            });
            const data = await response.json();
            if (data.ok) setClothes(data.clothes);
        } catch (error) {
            console.error("Clothes Fetch Error:", error);
        }
    };

    useEffect(() => {
        const rawData = sessionStorage.getItem("user_data");
        if (!rawData) {
            navigate("/", { replace: true });
            return;
        }
        fetchClothes();
        fetchLookbooks();
    }, [navigate, fetchLookbooks]);

    return (
        <div className="min-h-screen bg-dashboard transition-all duration-500">
            <div className="flex h-screen overflow-hidden">
                <SideNav />
                <main className="flex-1 overflow-y-auto p-8 relative">
                    <div className="max-w-7xl mx-auto">
                        <Outlet context={{ clothes, lookbooks, fetchLookbooks }} /> 
                    </div>
                </main>
            </div>
        </div>
    );
};