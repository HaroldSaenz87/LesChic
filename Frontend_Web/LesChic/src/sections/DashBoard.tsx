import { Outlet } from "react-router-dom";
import { SideNav } from "../components/SideNav";

export const DashBoard = () => {

    return (

        <div className="min-h-screen bg-linear-to-br from-background via-background to-accent/40 transition-all duration-500">

            <div className="flex h-screen overflow-hidden">

                <SideNav />

                <main className="flex-1 overflow-y-auto p-8 relative">
                    <div className="max-w-7xl mx-auto">
                        <Outlet /> 
                    </div>
                </main>
            
            </div>
        
        </div>
    );
};