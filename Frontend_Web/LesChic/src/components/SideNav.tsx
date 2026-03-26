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
                ? 'bg-secondary/15 text-secondary border-l-2 border-secondary' 
                : 'text-primary/80 hover:text-primary hover:bg-accent/20'}
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
        <div className="w-64 h-full bg-surface border-r border-accent/40 flex flex-col relative z-10 shadow-[2px_0_12px_rgba(0,0,0,0.06)]">

            <div className="p-6 border-b border-accent/40">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl border border-secondary/40 bg-secondary/10 flex items-center justify-center ">
                        <Gem size={22} className="text-secondary" />
                    </div>

                    <span className="font-display font-bold text-xl tracking-widest text-primary uppercase">LesChic</span> 
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

            <div className="p-4 border-t border-accent/40 border-b border-accent/40">
                <button 
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 cursor-pointer text-primary/70 hover:text-red-500/70 hover:bg-red-50/60 rounded-xl transition-all duration-200 group"
                >
                    <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                    <span className="text-sm font-medium uppercase tracking-wider">Sign Out</span>
                </button>
            </div>

        </div>
    );
};