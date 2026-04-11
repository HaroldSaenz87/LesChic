import { Calendar, LayoutDashboard, List, Shirt } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom"
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
        <div onClick={() => navigate(to)} className="flex flex-col gap-4 p-6 rounded-r-2xl bg-[#242424] border border-white/35 border-l-4 border-l-secondary backdrop-blur-md cursor-pointer hover:bg-white/5 hover:border-white/40 hover:scale-[1.04] transition-all duration-200 group">
            
            

            <div className="flex flex-col gap-4">
                {/* Large count number */}
                <p className="text-4xl font-bold text-white stat-value tracking-tight">
                    {count}
                </p>

                <div className="flex items-center gap-3 min-w-0">

                    {/* Icon with hover scale effect */}
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200">
                        {icon}
                    </div>

                    {/* Section label */}
                    <p className="text-white/80 text-xs uppercase tracking-[0.15em] font-bold leading-tight truncate">
                        {label}
                    </p>


                </div>
            
            </div>
        
        
        </div>
        
    );
};

export const Overview = () => {

    const { clothes = [], lookbooks = [] } = useOutletContext<{ clothes: any[], lookbooks: any[] }>();


    const toDateString = (date: any) => {

        if (!date || date === '1970-01-01T00:00:00.000Z') return null;
        
        return new Date(date).toISOString().split('T')[0];
    };

    const totalPlannedEvents = lookbooks.reduce((acc, lb) => {
        
        const dates = Array.isArray(lb.plannedUsed) ? lb.plannedUsed : [lb.plannedUsed];
        const validDates = dates.filter((d: any) => toDateString(d) !== null);
        
        return acc + validDates.length;
    
    }, 0);

    const totalWornEvents = lookbooks.reduce((acc, lb) => {
        
        const dates = Array.isArray(lb.plannedUsed) ? lb.plannedUsed : [lb.plannedUsed];
        const lastUsedStr = toDateString(lb.lastUsed);
        
        // Count how many planned dates match the lastUsed date string
        const wornDates = dates.filter((d: any) => {
            
            const plannedStr = toDateString(d);
            
            return plannedStr !== null && plannedStr === lastUsedStr;
        });
        
        return acc + wornDates.length;
    
    }, 0);

    // Read user name from sessionStorage set at login
    const user = JSON.parse(sessionStorage.getItem("user_data") || "{}");
    
    // Stats card config (counts will be replaced with real api later)
    const stats = [
        { icon: <Shirt size={20} />, label: "Closet Items", count: clothes.length, to: "/dashboard/closet" },
        { icon: <List size={20} />, label: "Lookbooks", count: lookbooks.length, to: "/dashboard/lookbooks" },
        { icon: <Calendar size={20} />, label: "Planned Outfits", count: totalPlannedEvents, to: "/dashboard/planner" },
    ];

    return(
        <div className="flex flex-col gap-8 mt-8 ">

            {/* Welcome and stats container */}
            <div className="animate-fade-in animation-delay-400">

                <div className=" flex flex-col gap-5 bg-[#1A1A1A]/85 border border-white/10 rounded-2xl px-8 py-6">
                    
                    {/* Welcome message -> name pulled from sessionStorage */}
                    <div>
                        
                        <h1 className="text-white font-display font-bold text-3xl uppercase tracking-widest">
                            Welcome, {user.name}
                        </h1>
                        
                        <p className="text-white/70 text-sm uppercase tracking-widest mt-1">
                            A data-driven look at why you have nothing to wear
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

                <div className="flex flex-col gap-5 bg-[#1A1A1A]/85 border border-white/10 rounded-2xl px-8 py-6">
                    
                    {/* planned/used will be replaced with real API later */}
                    <OutfitChart planned={totalPlannedEvents} used={totalWornEvents} />

                </div>

            </div>

            

        </div>
    )
}