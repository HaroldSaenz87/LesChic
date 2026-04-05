import { X, Save, Tag as TagIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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
}

export const EditModal = ({ item, allTags, onClose, onSave }: EditModalProps) => {
    
    const [title, setTitle] = useState(item.title);
    const [brand, setBrand] = useState(item.brand);
    const [size, setSize] = useState(item.size);
    const [type, setType] = useState(item.type);

    const [lastUsed, setLastUsed] = useState(
        item.lastUsed
            ? new Date(item.lastUsed).toISOString().split("T")[0]
            : ""
    );
    
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
        item.tags?.map((t) => t.id || t._id) ?? []
    );
    
    const [saving, setSaving] = useState(false);

    const overlayRef = useRef<HTMLDivElement>(null);



    // Close on backdrop click
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === overlayRef.current) onClose();
    };



    // Close on Escape
    useEffect(() => {
        
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        
        document.addEventListener("keydown", handleKey);
        
        return () => document.removeEventListener("keydown", handleKey);
    
    }, [onClose]);




    const toggleTag = (id: string) => {
        
        setSelectedTagIds((prev) =>
            
            prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
        
        );

    };

    const handleSave = async () => {
       
        setSaving(true);
       
        try {
       
            await onSave(item.id || item._id, {
                title,
                brand,
                size,
                type,
                lastUsed: new Date(lastUsed),
                tags: selectedTagIds as any,
            });
       
            onClose();
       
        } 
        catch (err) {
            
            console.error("Failed to save:", err);
        
        } 
        finally {
            
            setSaving(false);
        
        }

    };

    const modalLayout = (
        
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-200 p-4"
        >
            
            <div className="relative w-full max-w-3xl bg-[#111111] border border-white/50 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >

                    <X size={16} />

                </button>

                <div className="flex flex-col md:flex-row h-full">

                    {/* ── LEFT: Image Panel ── */}
                    <div className="relative md:w-2/5 h-56 md:h-auto bg-black/40 shrink-0">
                        
                        <img
                            src={item.imagePath}
                            alt={item.title}
                            className="w-full h-full object-cover opacity-80"
                        />
                        
                        {/* Some gradient overlay at bottom of image */}
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/60 to-transparent" />
                        
                        <div className="absolute bottom-4 left-4">
                            
                            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-white/70 bg-black/50 px-2 py-1 rounded-md border border-white/15 backdrop-blur-sm">
                                {item.type}
                            </span>

                        </div>

                    </div>


                    {/* RIGHT: Form Panel*/}
                    <div className="flex flex-col flex-1 p-6 md:p-8 overflow-y-auto max-h-[80vh] md:max-h-none">

                        {/* Header */}
                        <div className="mb-6">
                            
                            <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-white/30 mb-1">Editing Item</p>
                            
                            <h2 className="text-white text-xl font-bold uppercase tracking-widest truncate">{item.title}</h2>
                        
                        </div>


                        <div className="flex flex-col gap-4 flex-1">

                            {/* Title */}
                            <Field label="Title">
                                
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className={inputClass}
                                    placeholder="Item name"
                                />

                            </Field>

                            {/* Brand + Size (side by side) */}
                            <div className="grid grid-cols-2 gap-3">
                                
                                <Field label="Brand">
                                    
                                    <input
                                        type="text"
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                        className={inputClass}
                                        placeholder="Brand"
                                    />
                                    
                                </Field>
                                
                                <Field label="Size">
                                    
                                    <input
                                        type="text"
                                        value={size}
                                        onChange={(e) => setSize(e.target.value)}
                                        className={inputClass}
                                        placeholder="e.g. M, L, 32"
                                    />
                                
                                </Field>

                            </div>

                            
                            {/* Type + Last Used (side by side) */}
                            <div className="grid grid-cols-2 gap-3">
                                
                                <Field label="Type">
                                    
                                    <input
                                        type="text"
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className={inputClass}
                                        placeholder="e.g. Shirt, Jacket"
                                    />
                                
                                </Field>

                                <Field label="Last Used">
                                
                                <input
                                    type="date"
                                    value={lastUsed}
                                    onChange={(e) => setLastUsed(e.target.value)}
                                    className={`${inputClass} scheme-dark`}
                                />

                            </Field>
                                
                                

                            </div>
                            

                            {/* Tags */}
                            {allTags.length > 0 && (
                                <Field label="Tags">
                                    
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        
                                        {allTags.map((tag) => {
                                            
                                            const tagId = tag.id || tag._id;
                                            
                                            const active = selectedTagIds.includes(tagId);
                                            
                                            return (
                                                
                                                <button
                                                    key={tagId}
                                                    type="button"
                                                    onClick={() => toggleTag(tagId)}
                                                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                                                        active
                                                            ? "bg-white text-black border-white"
                                                            : "bg-white/5 text-white/50 border-white/15 hover:border-white/40 hover:text-white/80"
                                                    }`}
                                                >
                                                    <TagIcon size={15} />
                                                    {tag.title}
                                                </button>

                                            );

                                        })}

                                    </div>

                                </Field>

                            )}

                        </div>

                        {/* Footer Actions.. Basically buttons */}
                        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-white/10">
                            
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 text-[12px] uppercase tracking-widest font-bold text-white/50 hover:text-[red]/80 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-xl text-[12px] uppercase tracking-widest font-bold hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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

    // This is a portal basically takes the modal contents and  renders it 
    // as a child of body

    // It helped prevent the modal from being stuck in the containers 
    return createPortal(modalLayout, document.body);
};

// Helpers (I didnt want to keep writing the same thing over and over )

const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3.5 text-white text-[11px] uppercase tracking-widest font-bold placeholder:text-white/25 focus:outline-none focus:border-white/40 transition-all";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/60">{label}</label>
        {children}
    </div>
);