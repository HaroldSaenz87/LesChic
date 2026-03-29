import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { buildPath } from "../utils/buildPath";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { AuthBackground } from "./AuthBackground";

type Status = "loading" | "success" | "error";

export const VerifyEmail = () => {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const [status, setStatus] = useState<Status>("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {

        // If no token in URL, show error immediately without making an API call
        if (!token) {
            setStatus("error");
            setMessage("No verification token found.");
            return;
        }

        const verify = async () => {
            try {

                // POST token to backend — backend validates and marks email as verified
                const response = await fetch(buildPath("api/auth/verify-email"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });

                const res = await response.json();

                if (response.ok) {
                    setStatus("success");
                    setMessage(res.msg || "Email verified successfully.");
                } else {
                    setStatus("error");
                    setMessage(res.msg || "Verification failed.");
                }
            } catch {
                setStatus("error");
                setMessage("Network error. Please try again.");
            }
        };

        verify();
    }, [token]);

    return (

        <AuthBackground>

            <div className="flex flex-col items-center gap-5 px-15 py-16 rounded-4xl border border-accent/20 shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)] bg-background/30 backdrop-blur-2xl text-center max-w-md w-full animate-fade-in duration-500">

                {/* Spinner while API call is in progress */}
                {status === "loading" && (
                    <>
                        <Loader className="text-white/60 animate-spin" size={40} />
                       
                        <p className="text-white/60 text-sm uppercase tracking-widest font-display">
                            Verifying your email...
                        </p>
                    
                    </>
                )}

                {/* Success state — prompts user to sign in */}
                {status === "success" && (
                    <>
                        <CheckCircle className="text-green-400" size={40} />
                        
                        <p className="font-display text-white uppercase tracking-widest text-lg">
                            Email Verified
                        </p>
                        
                        <p className="text-white/70 text-sm tracking-wider">{message}</p>
                        
                        <button
                            onClick={() => navigate("/", { replace: true })}
                            className="mt-2 w-full py-3.5 rounded-full text-[15px] uppercase tracking-[0.45em] font-display text-white font-semibold bg-muted shadow-[0_6px_10px_rgba(0,0,0,0.25)] cursor-pointer transition-all active:translate-y-1"
                        >
                            Sign In
                        </button>
                   
                    </>
                )}

                {/* Error state — invalid/expired token or no token in URL */}
                {status === "error" && (
                    <>
                        
                        <XCircle className="text-red-400" size={40} />
                        
                        <p className="font-display text-white/90 uppercase tracking-widest text-sm">
                            Verification Failed
                        </p>
                        
                        <p className="text-white/40 text-xs tracking-wider">{message}</p>
                        
                        <button
                            onClick={() => navigate("/", { replace: true })}
                            className="mt-2 w-full py-3.5 rounded-full text-[15px] uppercase tracking-[0.45em] font-display text-white font-semibold bg-muted shadow-[0_6px_10px_rgba(0,0,0,0.25)] cursor-pointer transition-all active:translate-y-1"
                        >
                            Back to Sign In
                        </button>
                    
                    </>
                )}

            </div>
        </AuthBackground>
    );
};