import { Trash2, X } from "lucide-react";
import { createPortal } from "react-dom";

interface DeleteModalProps {
    title: string;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteModal = ({ title, onClose, onConfirm }: DeleteModalProps) => {

    const modalLayout = (
        
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 ">
            
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            
            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/30 rounded-3xl overflow-hidden shadow-2xl animate-fade-in2 zoom-in">
                
                <div className="p-8 text-center">
                    
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                        <Trash2 className="text-red-500" size={28} />
                    </div>
                    
                    <h2 className="text-xl font-display font-bold text-white uppercase tracking-widest mb-2">
                        Remove Item?
                    </h2>
                    
                    <p className="text-white/50 text-[13px] leading-relaxed mb-8">
                        Are you sure you want to delete <span className="text-white font-bold">"{title}"</span>? 
                        This action cannot be undone.
                    </p>

                    <div className="flex flex-col gap-3">
                        
                        <button
                            onClick={onConfirm}
                            className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[11px] uppercase tracking-[0.2em] font-bold transition-all shadow-lg shadow-red-500/10 cursor-pointer"
                        >
                            Confirm Delete
                        </button>
                        
                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl text-[11px] uppercase tracking-[0.2em] font-bold cursor-pointer transition-all"
                        >
                            Keep Item
                        </button>
                    
                    </div>
                
                </div>

                <button 
                    onClick={onClose}
                    className="absolute top-5 right-5 text-white/30 hover:text-[red] transition-colors"
                >
                    <X size={20} />
                </button>
            
            </div>
        
        </div>
    );

    return createPortal(modalLayout, document.body);
};