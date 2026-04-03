import { useRef } from "react";
import { ChevronLeft, ChevronRight, FolderHeart } from "lucide-react";
import { ClothingCard } from "./ClothingCard";

interface ClosetRowProps {
    title: string;
    items: any[];
}

export const ClosetRow = ({ title, items }: ClosetRowProps) => {
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
                        <ClothingCard key={item._id} item={item} />
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