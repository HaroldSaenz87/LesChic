
export const DashBoard = () => {

    return (
        <div className="min-h-screen w-full bg-[#0c0c0c] flex flex-col items-center justify-center p-10">
        <h1 className="font-display text-white text-6xl font-light tracking-[0.2em] uppercase mb-4">
            Closet
        </h1>
        <p className="text-white/40 tracking-[0.5em] uppercase text-xs">
            Welcome back to LesChic
        </p>
        
        <button 
            onClick={() => {
            localStorage.removeItem("user_session");
            window.location.href = "/";
            }}
            className="mt-20 text-white/20 hover:text-white uppercase tracking-widest text-[10px] transition-all"
        >
            Sign Out
        </button>
        </div>
    );
};