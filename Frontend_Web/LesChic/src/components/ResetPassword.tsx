import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { buildPath } from "../utils/buildPath";
import { CheckCircle, XCircle, Loader, Eye, EyeOff } from "lucide-react";
import { AuthBackground } from "./AuthBackground";

type Status = "idle" | "loading" | "success" | "error";

export const ResetPassword = () => {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Token is passed as a query param from the reset password email link
    const token = searchParams.get("token");

    const [status, setStatus] = useState<Status>("idle");
    const [message, setMessage] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {

        // If no token in URL, skip the form and go straight to error state
        if (!token) {
            setStatus("error");
            setMessage("No reset token found.");
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation before making the API call
        if (password !== confirm) {
            setMessage("Passwords do not match.");
            setStatus("error");
            return;
        }

        setStatus("loading");
        setMessage("");

        try {

            // POST token + new password to backend — backend validates token and updates hash
            const response = await fetch(buildPath("api/auth/reset-password"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const res = await response.json();

            if (response.ok) {
                setStatus("success");
                setMessage(res.msg || "Password reset successfully.");
            } else {
                setStatus("error");
                setMessage(res.msg || "Reset failed.");
            }
        } catch {
            setStatus("error");
            setMessage("Network error. Please try again.");
        }
    };

    return (

        <AuthBackground>

            <div className="flex flex-col items-center gap-5 px-15 py-16 rounded-4xl border border-accent/20 shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)] bg-background/30 backdrop-blur-2xl text-center max-w-md w-full animate-fade-in duration-500">

                {/* Spinner while reset request is in progress */}
                {status === "loading" && (
                    <>

                        <Loader className="text-white animate-spin" size={40} />
                        
                        <p className="text-white text-base uppercase tracking-widest font-display">
                            Resetting your password...
                        </p>
                   
                    </>
                )}

                {/* Success state — prompts user to sign in with new password */}
                {status === "success" && (
                    <>
                        <CheckCircle className="text-green-400" size={40} />
                        <p className="font-display text-white uppercase tracking-widest text-lg">
                            Password Reset
                        </p>
                        <p className="text-white text-sm tracking-wider">{message}</p>
                        <button
                            onClick={() => navigate("/", { replace: true })}
                            className="mt-2 w-full py-3.5 rounded-full text-[15px] uppercase tracking-[0.45em] font-display text-white font-semibold bg-muted shadow-[0_6px_10px_rgba(0,0,0,0.25)] cursor-pointer transition-all active:translate-y-1"
                        >
                            Sign In
                        </button>
                    </>
                )}

                {/* Error state — mismatched passwords, invalid token, or network failure */}
                {status === "error" && (
                    <>
                        <XCircle className="text-red-400" size={40} />
                        <p className="font-display text-white uppercase tracking-widest text-lg">
                            Something went wrong
                        </p>
                        <p className="text-white text-sm tracking-wider">{message}</p>
                        <button
                            onClick={() => navigate("/", { replace: true })}
                            className="mt-2 w-full py-3.5 rounded-full text-[15px] uppercase tracking-[0.45em] font-display text-white font-semibold bg-muted shadow-[0_6px_10px_rgba(0,0,0,0.25)] cursor-pointer transition-all active:translate-y-1"
                        >
                            Back to Sign In
                        </button>
                    </>
                )}

                {/* Idle state — the actual reset password form */}
                {(status === "idle") && (
                    <>
                        <p className="font-display text-white uppercase tracking-widest text-lg">
                            Reset Password
                        </p>
                        <p className="text-white/60 text-xs uppercase tracking-widest">
                            Enter your new password below
                        </p>

                        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">

                            {/* New password input with show/hide toggle */}
                            <div className="relative">
                                
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="New Password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/10 border border-accent/20 rounded-xl px-5 py-3 text-white text-sm placeholder:text-white/50 outline-none focus:border-white/30 tracking-wider transition pr-12"
                                />
                                
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            
                            </div>

                            {/* Confirm password input with show/hide toggle */}
                            <div className="relative">
                                
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    required
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    className="w-full bg-white/10 border border-accent/20 rounded-xl px-5 py-3 text-white text-sm placeholder:text-white/50 outline-none focus:border-white/30 tracking-wider transition pr-12"
                                />
                                
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                                >
                                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            
                            </div>

                            <button
                                type="submit"
                                className="mt-2 w-full py-3.5 rounded-full text-[15px] uppercase tracking-[0.45em] font-display text-white font-semibold bg-muted shadow-[0_6px_10px_rgba(0,0,0,0.25)] cursor-pointer transition-all active:translate-y-1"
                            >
                                Reset Password
                            </button>

                        </form>
                    </>
                )}

            </div>

        </AuthBackground>
    );
};