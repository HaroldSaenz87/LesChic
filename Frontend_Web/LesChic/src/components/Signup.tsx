import { useState } from "react"
import { buildPath } from "../utils/buildPath";



export const Signup = () =>{


    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");
    const [isSent, setIsSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const doSignup = async (e: React.FormEvent) => {

        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        const payload = {name, lastName, email, password};
        
        try
        {
            const response = await fetch(buildPath('api/register'), {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json'}
            });

            const res = await response.json();

            if(res.ok)
            {
                setIsSent(true);
                setMessage(res.msg);
            }
            else
            {
                setMessage(res.msg || "Error on register");
            }
        }
        catch(error)
        {

            setMessage("Network error. Please try again later.");

        }
        finally
        {
            setIsLoading(false);
        }
    };

    if(isSent)
    {
        return (
            <div className="px-10 py-8 text-center space-y-4">
                <h2 className="text-secondary font-display text-xl uppercase tracking-widest">Check Your Email</h2>
                
                <p className="text-white/70 text-sm leading-relaxed">
                    We've sent a verification link to <span className="text-white">{email}</span>. 
                    Please verify your account to sign in.
                </p>

            </div>

        )

    }



    return(
        <form onSubmit={doSignup} className="px-10 py-8 flex flex-col gap-3">
            <div className="flex flex-col gap-3">
                <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="First" required className="w-full bg-white/10 border border-accent/20 rounded-xl px-5 py-3 text-white text-sm placeholder:text-white/50 outline-none focus:border-white/30 tracking-wider transition" />
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" placeholder="Last" required className="w-full bg-white/10 border border-accent/20 rounded-xl px-5 py-3 text-white text-sm placeholder:text-white/50 outline-none focus:border-white/30 tracking-wider transition" />
            </div>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" required className="w-full bg-white/10 border border-accent/20 rounded-xl px-5 py-3 text-white text-sm placeholder:text-white/50 outline-none focus:border-white/30 tracking-wider transition" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" required className="w-full bg-white/10 border border-accent/20 rounded-xl px-5 py-3 text-white text-sm placeholder:text-white/50 outline-none focus:border-white/30 tracking-wider transition" />
            
            {message && <span className="text-[11px] text-accent text-center uppercase tracking-widest">{message}</span>}
            
            <button type="submit" disabled={isLoading} className="mt-2 w-full py-3.5 rounded-full text-[15px] uppercase tracking-[0.45em] font-display text-white font-semibold bg-muted shadow-[0_6px_10px_rgba(0,0,0,0.25)] cursor-pointer transition-all active:translate-y-1">
                {isLoading ? "Registering..." : "Register"}
            </button>
        </form>
    )
}