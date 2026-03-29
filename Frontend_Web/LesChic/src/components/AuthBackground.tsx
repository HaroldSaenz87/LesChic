import React from "react";
import closetImg from "../assets/closet.jpg"

// Shared background wrapper for standalone auth pages (verify email and reset password)
export const AuthBackground = ({ children }: { children: React.ReactNode }) => {
    
    return (

        // Full screen background image with cover + center to fill the screen size
        <div
            className="min-h-screen flex items-center justify-center pl-8 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${closetImg})` }}
        >
            {/* Dark overlay so content is readable against the background */}
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Content sits above the overlay */}
            <div className="w-full max-w-sm">
                {children}
            </div>
            
        </div>
    );
};