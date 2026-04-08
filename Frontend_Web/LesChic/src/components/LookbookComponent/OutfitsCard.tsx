import { BookOpen, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Tag {
    id: string;
    _id: string;
    title: string;
}

interface ClothingItem {
    id: string;
    _id: string;
    title: string;
    brand: string;
    size: string;
    type: string;
    palette: string;
    lastUsed: string | Date;
    imagePath: string;
    tags: Tag[];
}

interface Lookbook {
    _id: string;
    userId: string;
    title: string;
    clothes: ClothingItem[];
}

interface LookbookCardProps {
    lookbook: Lookbook;
    onClick: () => void;
    onDelete: (id: string) => void;
}

export const OutfitsCard = ({ lookbook, onClick, onDelete }: LookbookCardProps) => {
    
    const preview = lookbook.clothes.slice(0, 5);
    const overflow = lookbook.clothes.length - 5;

    const [isConfirming, setIsConfirming] = useState(false);

    useEffect(() => {
        if (isConfirming) {
            
            const timer = setTimeout(() => setIsConfirming(false), 3000);
            
            return () => clearTimeout(timer);
        }
    }, [isConfirming]);

    const handleRemove = (e: React.MouseEvent) => {
        
        e.stopPropagation();

        if (!isConfirming) {
            setIsConfirming(true);
        } else {
            onDelete(lookbook._id);
            setIsConfirming(false);
        }
    };

    return (

        <div
            onClick={onClick}
            className="flex flex-col bg-[#242424] border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-white/30 hover:bg-[#2a2a2a] transition-all duration-300 group relative"
        >
            {/* THUMBNAIL grid*/}
            <div className="relative h-36 border-b border-white/5 overflow-hidden">
                
                {/* CENTER EDIT in thumbnail area */}
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                    
                    <div className="flex flex-col items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        
                        <div className="bg-white text-black p-2.5 rounded-full shadow-2xl">
                            <Pencil size={20} />
                        </div>
                        
                        <span className="text-white font-display text-[13px] uppercase tracking-[0.3em] font-bold">
                            Edit Outfit
                        </span>
                    
                    </div>
                
                </div>

                {/* The actual thumbnail */}
                <div className="grid grid-cols-3 gap-0.5 p-0.5 h-full">
                    
                    {preview.map((item, i) => (
                        
                        <div
                            key={item._id || i}
                            className="relative bg-[#333] rounded-sm overflow-hidden"
                            style={{ gridRow: i === 0 ? "span 2" : "span 1" }}
                        >
                            {item.imagePath ? (
                                <img src={item.imagePath} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <BookOpen size={16} className="text-white/20" />
                                </div>
                            )}
                        </div>
                    
                    ))}
                    
                    {overflow > 0 && (
                        
                        <div className="bg-[#2a2a2a] rounded-sm flex items-center justify-center">
                            <span className="font-display text-xs text-white/30">+{overflow}</span>
                        </div>
                    )}
                
                </div>
            
            </div>

            {/* CARD  */}
            <div className="px-4 py-3 flex flex-col gap-2">
                
                <p className="text-white font-display italic text-[23px] leading-tight truncate pr-10">
                    {lookbook.title || "Untitled Lookbook"}
                </p>
                
                <div className="flex items-center justify-between">
                    
                    <span className="font-display text-[15px] text-white/65 uppercase tracking-widest">
                        {lookbook.clothes.length} {lookbook.clothes.length === 1 ? "piece" : "pieces"}
                    </span>

                    <button
                        onClick={handleRemove}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-300 cursor-pointer ${
                            isConfirming 
                            ? "bg-red-500/20 text-red-500 scale-105" 
                            : "text-white/20 hover:text-red-500"
                        }`}
                    >
                        {isConfirming && <span className="text-[13px] font-bold uppercase tracking-tighter">Confirm?</span>}
                        <Trash2 size={20} />
                    </button>
                
                </div>
            
            </div>
        
        </div>

    );
    
};