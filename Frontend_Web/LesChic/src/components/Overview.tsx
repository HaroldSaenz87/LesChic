import { Calendar, LayoutDashboard, List, Shirt } from "lucide-react";
import { useNavigate } from "react-router-dom"
import { OutfitChart } from "./OutfitChart";

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    count: number;
    to: string;
}

// Clickable stat card that navigates to the related section on click
const StatCard = ({ icon, label, count, to }: StatCardProps) => {
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(to)} className="flex flex-col gap-4 p-6 rounded-2xl bg-black/50 border border-white/15 backdrop-blur-md cursor-pointer hover:bg-black/60 hover:border-white/30 transition-all duration-200 group">
            
            {/* Icon with hover scale effect */}
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200">
                {icon}
            </div>

            <div>
                {/* Large count number */}
                <p className="text-3xl font-bold text-white font-display">
                    {count}
                </p>

                {/* Section label */}
                <p className="text-white/80 text-xs uppercase tracking-widest mt-1">
                    {label}
                </p>
            
            </div>
        
        
        </div>
        
    );
};

export const Overview = () => {

    // Read user name from sessionStorage set at login
    const user = JSON.parse(sessionStorage.getItem("user_data") || "{}");
    
    // Stats card config (counts will be replaced with real api later)
    const stats = [
        { icon: <Shirt size={20} />, label: "Closet Items", count: 0, to: "/dashboard/closet" },
        { icon: <List size={20} />, label: "Lookbooks", count: 0, to: "/dashboard/lookbooks" },
        { icon: <Calendar size={20} />, label: "Planned Outfits", count: 10, to: "/dashboard/planner" },
    ];

    return(
        <div className="flex flex-col gap-8 mt-8 ">

            {/* Welcome and stats container */}
            <div className="animate-fade-in animation-delay-400">

                <div className=" flex flex-col gap-5 bg-black/40 border border-white/10 rounded-2xl px-8 py-6">
                    
                    {/* Welcome message -> name pulled from sessionStorage */}
                    <div>
                        
                        <h1 className="text-white font-display font-bold text-3xl uppercase tracking-widest">
                            Welcome, {user.name}
                        </h1>
                        
                        <p className="text-white/60 text-xs uppercase tracking-widest mt-1">
                            Here's your wardrobe at a glance
                        </p>
                    
                    </div>


                    {/* Header */}
                    <div className="flex items-center gap-3">
                        
                        <LayoutDashboard size={20} className="text-white" />
                        
                        <p className="text-white text-md font-bold uppercase tracking-widest font-display">Overview</p>
                    
                    </div>

                    {/* Stat cards grid  */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        
                        {stats.map((stat) => (
                            <StatCard key={stat.to} {...stat} />
                        ))}
                    
                    </div>
                    
                </div>

            </div>

            {/* Outfit donut chart container */}
            <div className="animate-fade-in animation-delay-600">

                <div className="flex flex-col gap-5 bg-black/40 border border-white/10 rounded-2xl px-8 py-6">
                    {/* planned/used will be replaced with real API later */}
                    <OutfitChart planned={10} used={4} />

                </div>

            </div>

            

        </div>
    )
}