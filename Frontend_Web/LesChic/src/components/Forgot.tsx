import { MoveLeft } from "lucide-react";
import { useState } from "react";
import { buildPath } from "../utils/buildPath";


export const Forgot = ({onBack, onSent}: {onBack: () => void; onSent: () => void}) =>{

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        try{
            const response = await fetch(buildPath("api/auth/forgot-password"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({email}),
            });

            const res = await response.json();

            if(response.ok){
                // Move to forgotsent view regardless of whether email exist
                // This is intentional -> avoids whether an email is registered
                onSent();
            }
            else{
                setMessage(res.msg || "Something went wrong.");
                setTimeout(() => setMessage(""), 5000);
            }
        }
        catch{
            setMessage("Network error.");
            setTimeout(() => setMessage(""), 5000);
        }
        finally{
            setIsLoading(false);
        }
    };


    return(
        <form onSubmit={handleSubmit} className="px-10 py-8 flex flex-col gap-3 animate-in fade-in duration-500">
            

            <p className="text-white/80 text-[13px] uppercase tracking-widest font-display">
                Enter your email and we'll send a reset link.
            </p>

            {/* Controlled email input */}
            <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/10 border border-accent/20 rounded-xl px-5 py-3 text-white text-sm placeholder:text-white/50 outline-none focus:border-white/30 tracking-wider transition" />

            {/* Error message -> auto clears after 5 seconds*/}
            {message && (
                <span className="text-[12px] text-red-500 font-bold uppercase tracking-widest text-center animate-in fade-in duration-300">
                    {message}
                </span>
            )}
            
            
            <div className="flex gap-3 items-center justify-center">

                {/* Back button returns to login view without submitting*/}
                <button type="button" onClick={onBack} className="flex items-center justify-center gap-3 mt-2 w-1/2 py-3.5 rounded-full text-[15px] uppercase tracking-[0.45em] font-display text-white font-semibold bg-muted shadow-[0_6px_10px_rgba(0,0,0,0.25)] cursor-pointer transition-all active:translate-y-1">
                    <MoveLeft />
                    Back
                </button>

                {/* Submit button disabled while request is in flight*/}
                <button type="submit" disabled={isLoading} className="flex items-center justify-center mt-2 w-1/2 py-3.5 rounded-full text-[15px] uppercase tracking-[0.45em] font-display text-white font-semibold bg-muted shadow-[0_6px_10px_rgba(0,0,0,0.25)] cursor-pointer transition-all active:translate-y-1">
                    {isLoading ? "Sending..." : "Send"}
                </button>

            </div>

            
        </form>
    )
}