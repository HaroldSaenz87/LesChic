import { useRef } from "react";
import { ChevronLeft, ChevronRight, FolderHeart } from "lucide-react";
import { ClothingCard } from "./ClothingCard";

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

interface ClosetRowProps {
    title: string;
    items: ClothingItem[];
    allTags: Tag[];                  
    onUpdate: (id: string, data: Partial<ClothingItem>) => Promise<void>;
    onTagCreated: () => Promise<void>;
    onDelete: (id:string) => Promise<void>;
    onImageClick: (path: string) => void;
}

export const ClosetRow = ({ title, items, allTags, onUpdate, onDelete, onTagCreated, onImageClick }: ClosetRowProps) => {

    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = (direction: 'left' | 'right') => {
        
        if (scrollRef.current) {

            const scrollAmount = 400;

            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });

        }
    };

    return (

        <div className="flex flex-col gap-4 mb-10">

            <div className="flex items-center gap-3">

                <FolderHeart size={20} className="text-white/80" />
                
                <h2 className="text-white text-lg font-bold uppercase tracking-[0.2em] font-display">{title}</h2>
                
                <div className="h-px grow bg-white/60 ml-2" />
            
            </div>


            <div className="relative group">
                
                <div ref={scrollRef} className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory">
                    
                    {items.map((item) => (
                        <ClothingCard key={item.id || item._id} item={item} allTags={allTags} onSave={onUpdate} onDelete={onDelete} onTagCreated={onTagCreated} onImageClick={onImageClick}/>
                    ))}

                </div>

                {items.length > 3 && (
                    <>
                        <button onClick={() => handleScroll('left')} className="absolute -left-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-white/10 text-white p-2 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-all z-10 cursor-pointer">
                            <ChevronLeft size={18} />
                        </button>
                        
                        <button onClick={() => handleScroll('right')} className="absolute -right-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-white/10 text-white p-2 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-all z-10 cursor-pointer">
                            <ChevronRight size={18} />
                        </button>
                    
                    </>
                )}

            </div>
            
        </div>
    );
};