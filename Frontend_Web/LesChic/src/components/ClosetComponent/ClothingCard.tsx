interface ClothingItem {
    _id: string | number;
    title: string;
    brand: string;
    size: string | number;
    type: string;
    tags: string[];
    imagePath: string;
}

export const ClothingCard = ({ item }: { item: ClothingItem }) => {
    return (
        <div className="min-w-64 h-80 bg-accent rounded-2xl overflow-hidden border border-white/15 snap-center transition-all hover:border-white/40 hover:bg-black/60 group/card">
            <img src={item.imagePath} alt={item.title} className="w-full h-3/5 object-cover opacity-90 group-hover/card:opacity-100 transition-opacity" />
            <div className="p-4 flex flex-col justify-between h-2/5">
                <div>
                    <h3 className="text-white font-display font-bold text-md tracking-wide uppercase truncate">{item.title}</h3>
                    <p className="text-white/70 text-[11px] uppercase tracking-widest mt-1">{item.brand} — {item.size}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                    {item.tags?.map((tag, index) => (
                        <span 
                            key={index} 
                            className="px-2.5 py-0.5 bg-white/5 text-white/60 text-[12px] rounded-full uppercase font-bold border border-white/10 tracking-tighter"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

            </div>
        </div>
    );
};