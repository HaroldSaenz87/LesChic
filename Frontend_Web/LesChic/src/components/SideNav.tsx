import { Gem, LayoutDashboard, List, LogOut, Shirt, Tags } from "lucide-react"

import { NavLink, useNavigate } from "react-router-dom"

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    to: string;
    end?: boolean
}

const NavItem = ({ icon, label, to, end }: NavItemProps) => (
    <NavLink 
        to={to} 
        end={end}
        className={({ isActive }) => `
            flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer 
            ${isActive 
                ? 'bg-blue-100/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 shadow-sm' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'}
        `}
    >
        {icon}
        <span className="text-sm font-medium">{label}</span>
    </NavLink>
);

export const SideNav = () =>{
    
    const navigate = useNavigate();
    

    {/* for now until proper logout */}
    const handleLogout = () => {
        localStorage.removeItem("user_session");
        navigate("/", { replace: true});
    };

    const menuItems = [
        { to: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard", end: true },
        { to: "/dashboard/closet", icon: <Shirt size={20} />, label: "My Closet" },
        { to: "/dashboard/lookbooks", icon: <List size={20} />, label: "Lookbooks" },
        { to: "/dashboard/tags", icon: <Tags size={20} />, label: "Tags" },
    ];


    return(
        <div className="w-64 h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col relative z-10 transition-all duration-300">

            <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-linear-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Gem size={22} className="text-white" />
                    </div>

                    <span className="font-display font-light text-xl tracking-widest dark:text-white uppercase">LesChic</span> 
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                
                {menuItems.map((item) => (
                    <NavItem
                        key={item.to}
                        icon={item.icon} 
                        label={item.label} 
                        to={item.to}
                        end={item.end}
                    />
                ))}
                
            </nav>

            <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
                <button 
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-slate-500 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 rounded-xl transition-all duration-200 group"
                >
                    <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                    <span className="text-sm font-medium uppercase tracking-wider">Sign Out</span>
                </button>
            </div>

        </div>
    );
};