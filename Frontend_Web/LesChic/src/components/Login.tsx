import { useNavigate } from "react-router-dom"
import { buildPath } from "../utils/buildPath";
import { useState } from "react";

export const Login = ({onForgot}: {onForgot: () => void}) =>{

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState(""); // State to store error text

    const [isLoading, setIsLoading] = useState(false);


    const devMockLogin = () => {
        
        const mockUser = {
            userId: "u1",
            name: "Harold",
            lastName: "Vance",
            email: "harold@leschic.com",
            token: "mock_jwt_token_for_dev_purposes"
        };

        
        sessionStorage.setItem("user_data", JSON.stringify(mockUser));
        
        // Jump to the dashboard
        navigate("/dashboard", { replace: true });
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true); // Start loading immediately
        setMessage("");

        const payload = { 
            email: email, // Backend usually expects 'login' or 'email'
            password: password 
        };

        try {
            const response = await fetch(buildPath('api/login'), {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' }
            });

            const res = await response.json();

            if (!res.ok) {
                setMessage(res.msg || "Invalid credentials");

                setTimeout(() => {
                    setMessage("");
                }, 5000);

            } else {
                // Save the full user object (including the JWT token)
                sessionStorage.setItem("user_data", JSON.stringify({
                    userId: res.uid,
                    name: res.name,
                    token: res.token
                }));
                navigate("/dashboard", { replace: true });
            }
        } catch (error) {
            setMessage("Service unavailable. Please try again later.");
            setTimeout(() => {
                setMessage("");
            }, 5000);
        }finally {
            setIsLoading(false); // Stop loading regardless of success or error
        }
    };

    return(

        <form onSubmit={handleSubmit} className="px-10 py-8 flex flex-col gap-3">
            <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/10 border border-accent/20 rounded-xl px-5 py-3 text-white text-sm placeholder:text-white/50 outline-none focus:border-white/30 tracking-wider transition" />
            <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/10 border border-accent/20 rounded-xl px-5 py-3 text-white text-sm placeholder:text-white/50 outline-none focus:border-white/30 tracking-wider transition" />
            
            {message && (
                <span className="text-[12px] text-red-400 uppercase tracking-widest text-center animate-in fade-in zoom-in-95 duration-300">
                    {message}
                </span>
            )}
            
            <button type="submit" disabled={isLoading} className="mt-2 w-full py-3.5 rounded-full text-[15px] uppercase tracking-[0.45em] font-display text-white font-semibold bg-muted shadow-[0_6px_10px_rgba(0,0,0,0.25)] cursor-pointer transition-all active:translate-y-1">
                {isLoading ? "Verifying..." : "Sign In"}
            </button>

            <div className="text-center">
                <p onClick={onForgot} className="inline-block text-white/50 text-[13px] uppercase tracking-widest font-display mt-1 cursor-pointer hover:text-white transition-all">
                    Forgot password?
                </p>
            </div>



            {/*  bypass button */}
            <button 
                type="button" 
                onClick={devMockLogin}
                className="mt-4 text-[9px] text-white/20 uppercase tracking-[0.3em] hover:text-secondary transition-colors"
            >
                (Dev Mode: Skip to Dashboard)
            </button>
        </form>
    )

}