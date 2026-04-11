import { useMemo, useState } from "react";
import { Loader2, X, Check, Plus, Shirt } from "lucide-react";
import { buildPath } from "../../utils/buildPath";

interface ClothingItem {
    id: string;
    _id: string;
    title: string;
    brand: string;
    type: string;
    size: string;
    lastUsed: string | Date;
    imagePath: string;
}

interface CreateModalProps {
    allClothes: ClothingItem[];
    onClose: () => void;
    onCreated: () => void;
    initialData?: any;
}

export const OutfitsModal = ({ allClothes, onClose, onCreated, initialData }: CreateModalProps) => {
    
    const [title, setTitle] = useState(initialData?.title || "");
    const [selectedIds, setSelectedIds] = useState<string[]>(
        initialData?.clothes.map((c: any) => c._id || c.id) || []
    );

    // this weird part is like saying... variable = initialData ? true : false;
    const isEditing = !!initialData;

    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState<string>("All");

    const hasTitle = title.trim().length > 0;



    const categories = useMemo(() => {

        const types = allClothes.map(item => item.type);
        
        return ["All", "Selected", ...Array.from(new Set(types))];
    
    }, [allClothes]);

    const filtered = allClothes.filter(item => {
        const id = item._id || item.id;
        
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.type.toLowerCase().includes(searchQuery.toLowerCase());

        // NEW LOGIC: If 'Selected' is active, only show items whose ID is in selectedIds
        const matchesType = selectedType === "All" 
            ? true 
            : selectedType === "Selected" 
                ? selectedIds.includes(id) 
                : item.type === selectedType;

        return matchesSearch && matchesType;
    });


    const selectedItems = useMemo(() => {

        return allClothes.filter(item => selectedIds.includes(item._id || item.id));
    
    }, [allClothes, selectedIds]);




    const toggle = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };


    // create an update or outfit
    const handleCreate = async () => {

        if (!title.trim() || selectedIds.length === 0) return;

        const storedUser = sessionStorage.getItem("user_data");
        
        const token = storedUser ? JSON.parse(storedUser).token : "";

        // update or create outfit
        const endpoint = isEditing ? buildPath(`api/lists/${initialData._id || initialData.id}`) : buildPath("api/lists");
        
        const method = isEditing ? "PUT" : "POST";

        setSaving(true);

        try {
            const res = await fetch(endpoint, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "x-token": token,
                },
                body: JSON.stringify({ title, clothes: selectedIds }),
            });
            const data = await res.json();
            if (data.ok) {
                onCreated();
                onClose();
            }
        } catch (err) {
            console.error("Network error:", err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
            
            <div className="w-full max-w-4xl bg-[#1a1a1a] border border-white/10 rounded-2xl flex flex-col overflow-hidden h-[85vh] animate-fade-in2">
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
                    
                    <h2 className="text-white font-display font-bold text-xl uppercase tracking-widest">{isEditing ? `Edit: ${initialData.title}` : "New Lookbook"}</h2>
                    
                    <button onClick={onClose} className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:text-[red] transition-all cursor-pointer">
                        <X size={14} />
                    </button>
                
                </div>

                {/*Controls & Selection Preview */}
                <div className="px-6 pt-6 pb-2 flex flex-col gap-4 shrink-0 bg-[#1a1a1a]">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        <div>
                            
                            <label className="text-white/70 text-[15px] uppercase tracking-widest font-display block mb-2">Lookbook Name <span className="text-red-500">*</span></label>
                            
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="e.g. Summer in Positano"
                                className={`w-full bg-[#242424] border border-white/30 rounded-xl px-4 py-3 text-white font-display outline-none focus:border-white/60 transition-all ${
                                    !hasTitle && title.length > 0 ? "border-red-500/50" : "border-white/30 focus:border-white/60"}`}
                            />

                            {!hasTitle && title.length === 0 && (
                                <p className="text-[12px] text-white/30 mt-1 uppercase tracking-tighter italic">Name is required to outfits</p>
                            )}

                        </div>
                        
                        {/* Dynamic Selection Preview Bar */}
                        <div>
                            
                            <label className="text-white/50 text-[15px] uppercase tracking-widest font-display block mb-2">
                                Currently Selected ({selectedIds.length})
                            </label>
                            
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide min-h-12.5">
                                
                                {selectedItems.length > 0 ? (

                                    selectedItems.map(item => (
                                        
                                        <div 
                                            key={item._id || item.id}
                                            onClick={() => toggle(item._id || item.id)}
                                            className="relative group w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-white/20 cursor-pointer hover:border-red-500 transition-all"
                                        >
                                            <img src={`http://www.ec-albo.xyz:5000${item.imagePath}`} className="w-full h-full object-cover" alt="Selected" />
                                            
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <X size={12} className="text-white" />
                                            </div>
                                        </div>

                                    ))
                                ) : (
                                    
                                    <div className="flex items-center justify-center border border-dashed border-white/30 rounded-lg w-full h-12 text-white/20 text-[12px] uppercase tracking-widest">
                                        No items picked
                                    </div>
                                )}
                            
                            </div>

                        </div>
                    
                    </div>


                    {/* Filters */}
                    <div className="flex flex-col gap-3 mt-2">
                        
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search your closet..."
                            className="w-full bg-[#242424] border border-white/30 rounded-xl px-4 py-2.5 text-white font-display outline-none"
                        />
                        
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedType(cat)}
                                    className={`px-4 py-1.5 rounded-full border text-[10px] uppercase tracking-widest font-bold cursor-pointer transition-all flex items-center gap-2 ${
                                        selectedType === cat ? "bg-secondary text-black border-secondary" : "bg-transparent text-white/40 border-white/10 hover:border-white hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    {cat}
                                    {cat === "Selected" && selectedIds.length > 0 && (
                                        <span className={`ml-1 px-1.5 rounded-full ${selectedType === "Selected" ? "bg-black/20" : "bg-secondary/20 text-secondary"}`}>
                                            {selectedIds.length}
                                        </span>
                                    )}
                                </button>
                            ))}

                        </div>
                    
                    </div>

                </div>

                {/* Scrollable Grid */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    
                    <div className="grid grid-cols-3 gap-2 pb-4">
                        
                        {filtered.map(item => {

                            const id = item._id || item.id;

                            const selected = selectedIds.includes(id);

                            return (
                                
                                <div 
                                    key={id} 
                                    onClick={() => toggle(id)} 
                                    className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border transition-all ${
                                        selected ? "border-white/60" : "border-white/10"
                                    }`}
                                >
                                    {item.imagePath ? (
                                        <img src={`http://www.ec-albo.xyz:5000${item.imagePath}`} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-[#333] flex items-center justify-center">
                                            <Shirt size={20} className="text-white/10" />
                                        </div>
                                    )}

                                    {/* Item info (might change idk yet) */}
                                    <div className="absolute bottom-0 inset-x-0 px-2 py-1.5 bg-[#242424]">

                                        <p className="text-white text-[15px] truncate font-display uppercase">{item.title}</p>
                                        
                                        <p className="text-white text-[15px] truncate font-display opacity-70">Size: {item.size}</p>
                                    
                                    </div>

                                    {/* Centered Checkmark Overlay */}
                                    {selected && (
                                        
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 transition-all">
                                            
                                            <div className="w-10 h-10 bg-[lightgreen] rounded-full flex items-center justify-center shadow-2xl scale-110">
                                                <Check size={20} className="text-black stroke-[3px]" />
                                            </div>

                                        </div>
                                    )}

                                </div>

                            );

                        })}

                    </div>

                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between bg-[#1a1a1a] shrink-0">
                    
                    <button onClick={onClose} className="px-4 py-2 border border-red-600 bg-red-500 text-white font-display font-bold text-sm uppercase tracking-[0.2em] hover:bg-red-700 hover:border-red-700 transition-colors duration-300 rounded-xl cursor-pointer">Cancel</button>
                    
                    <button 
                        onClick={handleCreate} 
                        disabled={!title.trim() || selectedIds.length === 0 || saving} 
                        className="flex items-center gap-2 bg-secondary text-black font-display text-sm uppercase tracking-widest px-5 py-2.5 rounded-xl disabled:opacity-30 hover:brightness-110 transition-all cursor-pointer"
                    >
                        {saving ? (<Loader2 size={12} className="animate-spin" />) : (isEditing ? <Check size={12} /> : <Plus size={12} />)}
                        {isEditing ? "Save Changes" : "Create Lookbook"}
                    </button>
                
                </div>

            </div>
        
        </div>

    );

};