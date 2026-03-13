import { Check } from "lucide-react"

export const ForgotSent = ({onBack}: {onBack: () => void}) =>{
    return(
        <div className="px-10 py-8 flex flex-col items-center text-center animate-in fade-in duration-500">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-white text-xl mb-5">
                <Check />
            </div>
            <p className="font-display text-white/90 uppercase tracking-widest text-sm mb-2">Check your inbox</p>
            <p className="text-white/40 text-xs tracking-wider mb-8">
                If that email is registered, a reset link is on its way.
            </p>
            <button onClick={onBack} className="w-full py-3.5 rounded-full text-[15px] uppercase tracking-[0.45em] font-display text-white font-semibold bg-muted shadow-[0_6px_10px_rgba(0,0,0,0.25)] cursor-pointer transition-all active:translate-y-1">
                Back to Sign In
            </button>
        </div>

    )
}