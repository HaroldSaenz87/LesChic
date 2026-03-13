import { MoveLeft } from "lucide-react";


export const Forgot = ({onBack, onSent}: {onBack: () => void; onSent: () => void}) =>{
    
    {/* will be changed when doing actual calls */}
    return(
        <form onSubmit={(e) => {e.preventDefault(); onSent()}} className="px-10 py-8 flex flex-col gap-3 animate-in fade-in duration-500">
            

            <p className="text-white/80 text-[13px] uppercase tracking-widest font-display">
                Enter your email and we'll send a reset link.
            </p>

            <input type="email" placeholder="Email" required className="w-full bg-white/10 border border-accent/20 rounded-xl px-5 py-3 text-white text-sm placeholder:text-white/50 outline-none focus:border-white/30 tracking-wider transition" />

            <div className="flex gap-3 items-center justify-center">

                <button onClick={onBack} className="flex items-center justify-center gap-3 mt-2 w-1/2 py-3.5 rounded-full text-[15px] uppercase tracking-[0.45em] font-display text-white font-semibold bg-muted shadow-[0_6px_10px_rgba(0,0,0,0.25)] cursor-pointer transition-all active:translate-y-1">
                    <MoveLeft />
                    Back
                </button>

                <button type="submit" className="flex items-center justify-center mt-2 w-1/2 py-3.5 rounded-full text-[15px] uppercase tracking-[0.45em] font-display text-white font-semibold bg-muted shadow-[0_6px_10px_rgba(0,0,0,0.25)] cursor-pointer transition-all active:translate-y-1">
                    Send
                </button>

            </div>

            
        </form>
    )
}