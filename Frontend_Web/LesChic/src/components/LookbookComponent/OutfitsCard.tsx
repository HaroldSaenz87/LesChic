import { BookOpen } from "lucide-react";

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
}

export const OutfitsCard = ({ lookbook, onClick }: LookbookCardProps) => {
    
    const preview = lookbook.clothes.slice(0, 5);
    const overflow = lookbook.clothes.length - 5;

    return (

        <div
            onClick={onClick}
            className="flex flex-col bg-[#242424] border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-white/30 hover:bg-[#2a2a2a] transition-all duration-200 group"
        >

            {/* Thumbnail grid */}
            <div className="grid grid-cols-3 gap-0.5 p-0.5 h-36">
                
                {preview.map((item, i) => (
                    
                    <div
                        key={item._id || i}
                        className="relative bg-[#333] rounded overflow-hidden"
                        style={{ gridRow: i === 0 ? "span 2" : "span 1" }}
                    >
                        
                        {item.imagePath ? (
                            <img
                                src={item.imagePath}
                                alt={item.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <BookOpen size={16} className="text-white/20" />
                            </div>
                        )}

                    </div>
                
                ))}

                {overflow > 0 && (
                    <div className="bg-[#2a2a2a] rounded flex items-center justify-center">
                        <span className="font-display text-sm text-white/30">+{overflow}</span>
                    </div>
                )}
                
                {Array.from({ length: Math.max(0, 5 - preview.length) }).map((_, i) => (
                    <div key={`empty-${i}`} className="bg-[#2a2a2a] rounded" />
                ))}

            </div>

            {/* Card body */}
            <div className="px-4 py-3 flex flex-col gap-2">
                
                <p className="text-white font-display italic text-base leading-tight truncate">
                    {lookbook.title || "Untitled Lookbook"}
                </p>
                
                <div className="flex items-center justify-between">
                    
                    <span className="font-display text-[10px] text-white/35 uppercase tracking-widest">
                        {lookbook.clothes.length} {lookbook.clothes.length === 1 ? "piece" : "pieces"}
                    </span>
                    
                    <div className="flex gap-1">
                        
                        {lookbook.clothes.slice(0, 3).flatMap(item =>
                            (item.palette || "").split(",").slice(0, 1).map((color, ci) => (
                                <div
                                    key={`${item._id}-${ci}`}
                                    className="w-2.5 h-2.5 rounded-full border border-white/10"
                                    style={{ background: color.trim() }}
                                />
                            ))

                        )}

                    </div>

                </div>
            
            </div>

        </div>

    );
    
};