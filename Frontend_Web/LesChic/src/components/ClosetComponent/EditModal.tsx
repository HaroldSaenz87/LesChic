import { X, Save, Tag as TagIcon, Plus } from "lucide-react";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { buildPath } from "../../utils/buildPath";

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

interface EditModalProps {
    item: ClothingItem;
    allTags: Tag[];
    onClose: () => void;
    onSave: (id: string, updatedData: Partial<ClothingItem>) => Promise<void>;
    onTagCreated: () => Promise<void>; 
}

export const EditModal = ({ item, allTags, onClose, onSave, onTagCreated }: EditModalProps) => {

    const [title, setTitle] = useState(item.title);
    const [brand, setBrand] = useState(item.brand);
    const [size, setSize] = useState(item.size);
    const [type, setType] = useState(item.type);

    

    // Track selected IDs for the UI toggle logic
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
        item.tags?.map(t => t.id || t._id) || []
    );
    
    const [isAddingTag, setIsAddingTag] = useState(false);
    const [newTagTitle, setNewTagTitle] = useState("");
    const [creatingTag, setCreatingTag] = useState(false);
    const [saving, setSaving] = useState(false);

    const overlayRef = useRef<HTMLDivElement>(null);

    const handleOverlayClick = (e: React.MouseEvent) => {

        if (e.target === overlayRef.current) onClose();

    };

    const toggleTag = (tagId: string) => {

        setSelectedTagIds(prev => 
            prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
        );

    };

    // Handle tags

    const handleCreateTag = async () => {

        const trimmedTitle = newTagTitle.trim();

        if (!trimmedTitle) return;

        setCreatingTag(true);

        const storedUser = sessionStorage.getItem("user_data");
        const token = storedUser ? JSON.parse(storedUser).token : "";

        try {

            const response = await fetch(buildPath("api/tags"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-token": token
                },
                body: JSON.stringify({ title: trimmedTitle })
            });

            const data = await response.json();

            if (response.ok && data.ok) {
                await onTagCreated(); // Refresh parent global tag list
                const newId = data.tag._id || data.tag.id;
                setSelectedTagIds(prev => [...prev, newId]);
                setNewTagTitle("");
                setIsAddingTag(false);
            }

        } catch (error) {
            console.error("Error creating tag:", error);
        } finally {
            setCreatingTag(false);
        }
    };


    
    const [deletingTagId, setDeletingTagId] = useState<string | null>(null);

    const handleDeleteTag = async (e: React.MouseEvent, tagId: string) => {

        e.stopPropagation();

        // First click: Enter confirmation state
        if (deletingTagId !== tagId) {
            setDeletingTagId(tagId);
            // Auto-cancel after 3 seconds if they don't click again
            setTimeout(() => setDeletingTagId(null), 3000);
            return;
        }

        // Second click: Proceed with deletion
        const storedUser = sessionStorage.getItem("user_data");
        const token = storedUser ? JSON.parse(storedUser).token : "";

        try {
            const response = await fetch(buildPath(`api/tags/${tagId}`), {
                method: "DELETE",
                headers: { "x-token": token }
            });

            if (response.ok) {
                await onTagCreated();
                setSelectedTagIds(prev => prev.filter(id => id !== tagId));
                setDeletingTagId(null);
            }
        } catch (error) {
            console.error("Error deleting tag:", error);
            setDeletingTagId(null);
        }
    };

    const handleSave = async () => {

        setSaving(true);
        try {

            // Map IDs back to full objects for the onSave handler
            const finalTags = allTags.filter(t => selectedTagIds.includes(t.id || t._id));
            
            await onSave(item.id || item._id, {
                title,
                brand,
                size,
                type,
                //lastUsed,
                tags: finalTags
            });
            onClose();
        } catch (error) {
            console.error("Save failed:", error);
        } finally {
            setSaving(false);
        }
    };

    const modalLayout = (

        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
        >
            
            <div className="relative w-full max-w-3xl bg-[#111111] border border-white/50 rounded-2xl shadow-2xl overflow-hidden animate-fade-in2 zoom-in-95 ">
                
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-[red] hover:bg-white/10 transition-all cursor-pointer"
                >
                    <X size={16} />
                </button>

                <div className="flex flex-col md:flex-row h-full">
                    
                    {/* Left: Image Sidebar */}
                    <div className="relative md:w-2/5 h-56 md:h-auto bg-black/40 shrink-0">
                        
                        <img src={`http://www.ec-albo.xyz:5000${item.imagePath}`} alt={item.title} className="w-full h-full object-cover opacity-80" />
                        
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/60 to-transparent" />
                        
                        <div className="absolute bottom-4 left-4">
                            
                            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-white/70 bg-black/50 px-2 py-1 rounded-md border border-white/15 backdrop-blur-sm">
                                {type || item.type}
                            </span>
                        
                        </div>

                    </div>

                    {/* Right: Form Content */}
                    <div className="flex flex-col flex-1 p-6 md:p-8 overflow-y-auto max-h-[80vh] md:max-h-150 scrollbar-hide">
                        
                        <div className="mb-6">
                            
                            <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-white/30 mb-1">Editing Item</p>
                            
                            <h2 className="text-white text-xl font-bold uppercase tracking-widest truncate">{title || item.title}</h2>
                        
                        </div>

                        <div className="flex flex-col gap-4 flex-1">
                            
                            <Field label="Title">
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Item name" />
                            </Field>

                            <div className="grid grid-cols-2 gap-3">
                                
                                <Field label="Brand">
                                    <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} className={inputClass} placeholder="Brand" />
                                </Field>
                                
                                <Field label="Size">
                                    <input type="text" value={size} onChange={(e) => setSize(e.target.value)} className={inputClass} placeholder="M, L, 32" />
                                </Field>
                            
                            </div>

                            <div className="grid gap-3">
                                
                                <Field label="Type">
                                    <input type="text" value={type} onChange={(e) => setType(e.target.value)} className={inputClass} placeholder="Shirt, Jacket, Pants..." />
                                </Field>
                                
                        
                            
                            </div>

                            <Field label="Tags">
                                
                                <div className="flex flex-wrap gap-2 pt-1">
                                    
                                    {allTags.map((tag) => {
                                        const tagId = tag.id || tag._id;
                                        const isConfirming = deletingTagId === tagId;
                                        const active = selectedTagIds.includes(tagId);

                                        return (
                                            
                                            <div key={tagId} className="relative group">
                                                
                                                <button
                                                    type="button"
                                                    onClick={() => !isConfirming && toggleTag(tagId)}
                                                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider border transition-all cursor-pointer 
                                                        ${isConfirming 
                                                            ? "bg-red-500/20 text-red-500 border-red-500/50 ring-1 ring-red-500/50" 
                                                            : active 
                                                                ? "bg-white text-black border-white" 
                                                                : "bg-white/5 text-white/50 border-white/15 hover:border-white/40 hover:text-white/80"
                                                        }`}
                                                >
                                                    <TagIcon size={13} className={isConfirming ? "animate-pulse" : ""} />
                                                    {isConfirming ? "Delete?" : tag.title}
                                                </button>

                                                {/* The Delete Trigger */}
                                                {!isConfirming ? (
                                                    
                                                    <div
                                                        onClick={(e) => handleDeleteTag(e, tagId)}
                                                        className="absolute -top-1.5 -right-1.5 bg-white text-black rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 cursor-pointer shadow-lg z-20 border border-black/10"
                                                    >
                                                        <X size={10} strokeWidth={3} />
                                                    </div>
                                                ) : (
                                                    
                                                    // Invisible overlay to cancel confirmation if clicking outside the tag
                                                    <div 
                                                        className="fixed inset-0 z-10" 
                                                        onClick={() => setDeletingTagId(null)} 
                                                    />
                                                
                                                )}
                                                
                                                {/* If confirming, second click anywhere on the button deletes it */}
                                                {isConfirming && (
                                                    
                                                    <div 
                                                        onClick={(e) => handleDeleteTag(e, tagId)}
                                                        className="absolute inset-0 z-20 cursor-pointer rounded-full"
                                                    />
                                                
                                                )}
                                            
                                            </div>
                                        );

                                    })}

                                    {isAddingTag ? (
                                        
                                        <div className="flex items-center gap-2 animate-in slide-in-from-left-2 duration-200">
                                            
                                            <input
                                                autoFocus
                                                type="text"
                                                value={newTagTitle}
                                                onChange={(e) => setNewTagTitle(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleCreateTag();
                                                    }
                                                }}
                                                placeholder="TAG NAME..."
                                                className="bg-white/10 border border-white/30 rounded-full px-3 py-1 text-[11px] uppercase tracking-widest text-white focus:outline-none focus:border-white w-28"
                                                disabled={creatingTag}
                                            />
                                            
                                            <button 
                                                type="button"
                                                onClick={handleCreateTag} 
                                                disabled={creatingTag}
                                                className="text-white/80 hover:text-white disabled:opacity-50"
                                            >
                                                <Plus size={16}/>
                                            </button>

                                            <button 
                                                type="button"
                                                onClick={() => setIsAddingTag(false)} 
                                                className="text-white/30 hover:text-white"
                                            >
                                                <X size={14}/>
                                            </button>

                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setIsAddingTag(true)}
                                            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider border border-dashed border-white/20 text-white/30 hover:border-white/50 hover:text-white/70 transition-all cursor-pointer"
                                        >
                                            <Plus size={13} />
                                            New Tag
                                        </button>
                                    )}

                                </div>

                            </Field>

                        </div>

                        {/* Footer Actions */}
                        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-white/10">
                            
                            <button onClick={onClose} className="px-4 py-2 border border-red-600 bg-red-500 text-white font-display font-bold text-sm uppercase tracking-[0.2em] hover:bg-red-700 hover:border-red-700 transition-colors duration-300 rounded-xl cursor-pointer">
                                Cancel
                            </button>
                            
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 bg-secondary text-black font-display text-sm uppercase tracking-widest px-5 py-2.5 rounded-xl disabled:opacity-30 hover:brightness-110 transition-all cursor-pointer"
                            >
                                <Save size={18} />
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        
                        </div>
                    
                    </div>
                
                </div>
            
            </div>
        
        </div>
    );

    return createPortal(modalLayout, document.body);
};

const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3.5 text-white text-[11px] uppercase tracking-widest font-bold placeholder:text-white/25 focus:outline-none focus:border-white/40 transition-all";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/60">{label}</label>
        {children}
    </div>
);