import { useEffect, useState, useCallback } from "react";
import { Loader2, Plus, BookOpen } from "lucide-react";
import { buildPath } from "../utils/buildPath";
import { OutfitsCard } from "./LookbookComponent/OutfitsCard";
import { OutfitsModal } from "./LookbookComponent/OutfitsModal";

export const Lookbooks = () => {

    const [lookbooks, setLookbooks] = useState<any[]>([]);
    const [allClothes, setAllClothes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [sortBy, setSortBy] = useState<"recent" | "az" | "most">("recent");


    const [editingLookbook, setEditingLookbook] = useState<any | null>(null);

    const deleteLookbook = async (id: string) => {
        try {
            const res = await fetch(buildPath(`api/lists/${id}`), {
                method: "DELETE",
                headers: { "x-token": getToken() }
            });

            if ((await res.json()).ok) fetchLookbooks();

        } catch (err) { 

            console.error(err); 
        }

    };

    const getToken = () => {

        const storedUser = sessionStorage.getItem("user_data");
        
        return storedUser ? JSON.parse(storedUser).token : "";
    };

    const fetchLookbooks = useCallback(async () => {
        
        const token = getToken();
        
        try {
            
            const res = await fetch(buildPath("api/lists"), { headers: { "x-token": token } });
            const data = await res.json();

            if (data.ok) setLookbooks(data.lists);

        } catch (err) {
            console.error("Error fetching lookbooks:", err);
        } finally {
            setLoading(false);
        }
        
    }, []);

    const fetchClothes = useCallback(async () => {
        const token = getToken();
        try {
            const res = await fetch(buildPath("api/clothes"), { headers: { "x-token": token } });
            const data = await res.json();
            if (data.ok) setAllClothes(data.clothes);
        } catch (err) {
            console.error("Error fetching clothes:", err);
        }
    }, []);

    useEffect(() => {
        fetchLookbooks();
        fetchClothes();
    }, [fetchLookbooks, fetchClothes]);

    const sortedLookbooks = [...lookbooks].sort((a, b) => {
        if (sortBy === "az") return (a.title || "").localeCompare(b.title || "");
        
        if (sortBy === "most") return b.clothes.length - a.clothes.length;

        if (sortBy === "recent") {
            // compare the MongoDB _id strings
            const idA = a?._id|| a?.id || "";
            const idB = b?._id || b?.id || "";
            console.log("Comparing:", idA, "with", idB);
            return idB.localeCompare(idA)
        }
        return 0;
    });

    if (loading) return <Loader2 className="animate-spin mx-auto mt-20 text-white" />;

    return (
        <>
            <div className="flex flex-col gap-8 mt-8 animate-fade-in animation-delay-200">
                
                <div className="flex flex-col gap-6 bg-[#1a1a1a]/85 border border-white/10 rounded-2xl px-8 py-6 backdrop-blur-md">
                    
                    <div className="flex items-start justify-between">
                        
                        <div>
                            
                            <h1 className="text-white font-display font-bold text-3xl uppercase tracking-widest">Lookbooks</h1>
                            
                            <p className="text-white/60 text-sm uppercase tracking-widest mt-1">
                                {lookbooks.length} {lookbooks.length === 1 ? "collection" : "collections"}
                            </p>
                        
                        </div>
                        
                        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 border border-white/50 rounded-full px-4 py-2 text-white/70 font-display text-sm uppercase cursor-pointer tracking-widest hover:border-white hover:text-white hover:bg-white/5">
                            <Plus size={15} /> New Lookbook
                        </button>
                    
                    </div>

                    <div className="flex items-center gap-4">
                        
                        {(["recent", "az", "most"] as const).map(opt => (
                            
                            <button key={opt} onClick={() => setSortBy(opt)} className={`font-display text-[15px] uppercase cursor-pointer tracking-widest border-b ${sortBy === opt ? "text-white border-white" : "text-white/40 border-transparent"}`}>
                                {opt === "recent" ? "Recent" : opt === "az" ? "A-Z" : "Most Pieces"}
                            </button>

                        ))}
                    </div>

                    {lookbooks.length > 0 ? (
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            
                            {sortedLookbooks.map(lb => (
                                <OutfitsCard key={lb._id || lb.id} lookbook={lb} onClick={() => setEditingLookbook(lb)} onDelete={deleteLookbook} />
                            ))}
                            
                            <div onClick={() => setShowCreate(true)} className="border border-dashed border-white/30 rounded-2xl h-52 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/3 transition-all">
                                
                                <Plus size={20} className="text-white/50" />
                                
                                <p className="italic text-white/50 text-md">Create a lookbook</p>
                            
                            </div>
                        
                        </div>
                    ) : (

                        <div className="w-full py-20 text-center border-2 border-dashed border-white/20 rounded-2xl bg-black/20 flex flex-col items-center gap-4">
                            
                            <BookOpen size={28} className="text-white/40" />
                            
                            <p className="text-white/70 font-display text-lg uppercase tracking-widest">No lookbooks yet</p>
                            
                            <button onClick={() => setShowCreate(true)} className="border border-white/30 rounded-full px-5 py-2 text-white/70 font-display text-sm uppercase tracking-widest cursor-pointer hover:border-white hover:text-white hover:bg-white/5">Create your first</button>
                        
                        </div>
                    )}
                
                </div>
            
            </div>

            {(showCreate || editingLookbook) && <OutfitsModal allClothes={allClothes} initialData={editingLookbook} onClose={() => {setShowCreate(false); setEditingLookbook(null); }} onCreated={fetchLookbooks} />}

            
        </>
    );
};