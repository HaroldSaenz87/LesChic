import { Edit2, MoreVertical, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { EditModal } from "./EditModal";
import { DeleteModal } from "./DeleteModal";

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

interface Tag {
    id: string;
    _id: string;
    title: string;
}

interface ClothingCardProps {
    item: ClothingItem;
    allTags?: Tag[];                                              // pass your full tag list from the parent
    onSave?: (id: string, data: Partial<ClothingItem>) => Promise<void>;
    onDelete?: (id: string) => void;
    onTagCreated: () => Promise<void>;
    onImageClick: (path: string) => void;
}

export const ClothingCard = ({ item, allTags = [], onSave, onDelete, onTagCreated, onImageClick }: ClothingCardProps) => {
    
    const [showMenu, setShowMenu] = useState(false);

    const[showEditModal, setShowEditModal] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {

            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }

        };

        if (showMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);

    }, [showMenu]);

    // any changes that user input and saves well... handle it here
    const handleSave = async(id: string, updatedData: Partial<ClothingItem>): Promise<void> => {

        if(onSave){
            await onSave(id, updatedData);
        }

    };
    
    
    return (
        <>
            <div onClick={() => onImageClick(item.imagePath)} className="min-w-64 h-80 bg-accent rounded-2xl overflow-hidden border border-white/15 snap-center transition-all hover:border-white/90 hover:bg-black/60 cursor-pointer group/card">
                
                {/* Image Container - Keep h-3/5 as requested */}
                <div className="relative w-full h-3/5">

                    <img 
                        src={`http://www.ec-albo.xyz:5000${item.imagePath}`}
                        alt={item.title} 
                        className="w-full h-full object-cover opacity-90 group-hover/card:opacity-100 transition-opacity" 
                    />
                    
                    {/* Dots & Popup Menu Container */}
                    <div className="absolute top-3 right-3" ref={menuRef}>

                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu(!showMenu);
                            }}
                            className="p-1.5 rounded-full bg-black/40 border border-white/10 text-white hover:bg-black/80 hover:text-white transition-all backdrop-blur-sm cursor-pointer"
                            
                        >
                            <MoreVertical size={18} />
                        </button>

                        {/* The Popup Menu */}
                        {showMenu && (
                            <div className="absolute right-0 mt-1 w-32 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 py-1.5 backdrop-blur-xl animate-in fade-in zoom-in duration-150">
                                
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        
                                        //console.log("Edit:", item.id || item._id); // show if it responds
                                        setShowMenu(false);
                                        setShowEditModal(true);

                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-[11px] text-white/70 hover:text-white hover:bg-white/5 transition-colors uppercase font-bold tracking-wider"
                                >
                                    <Edit2 size={12} /> Edit
                                </button>
                                
                                <div className="h-px bg-white/5 mx-2 my-1" />
                                
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        //console.log("Delete:", item.id || item._id);
                                        setShowMenu(false);
                                        setShowDeleteModal(true);

                                        
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-[11px] text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-colors uppercase font-bold tracking-wider"
                                >
                                    <Trash2 size={12} /> Delete
                                </button>
                            
                            </div>

                        )}

                    </div>
                    
                </div>

                <div className="p-4 flex flex-col justify-between h-2/5">

                    <div>
                        <h3 className="text-white font-display font-bold text-md tracking-wide uppercase truncate">{item.title}</h3>
                        <p className="text-white/70 text-[11px] uppercase tracking-widest mt-1">{item.brand} — {item.size}</p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-2">

                        {item.tags?.map((tag) => (
                            <span 
                                key={tag.id || tag._id} 
                                className="px-2.5 py-0.5 bg-white/10 text-white/70 text-[13px] rounded-full uppercase font-bold border border-white/50 tracking-wider"
                            >
                                {tag.title}
                            </span>

                        ))}

                    </div>

                </div>
                
            </div>

            {/* Render Delete Modal */}
            {showDeleteModal && (
                <DeleteModal 
                    title={item.title}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={() => {
                        onDelete?.(item.id || item._id);
                        setShowDeleteModal(false);
                    }}
                />
            )}

            {/* Render the edit box or modal or whatever you want to call it */}
            {showEditModal && (
                    <EditModal
                        item={item}
                        allTags={allTags}
                        onClose={() => setShowEditModal(false)}
                        onSave={handleSave}
                        onTagCreated={onTagCreated}
                    />
                )
            }

        </>
        
    );
};