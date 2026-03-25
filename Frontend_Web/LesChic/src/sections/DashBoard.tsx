import { Outlet } from "react-router-dom";
import { SideNav } from "../components/SideNav";

export const DashBoard = () => {

    return (

        <div className="min-h-screen bg-linear-to-br fromslate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to=slate-900 transition-all duration-500">

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