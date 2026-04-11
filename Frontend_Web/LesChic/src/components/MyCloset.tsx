import { useEffect, useState, useCallback, useRef } from "react"
import { Loader2, X } from "lucide-react";
import { buildPath } from "../utils/buildPath";

import { ClosetFilters } from "../components/ClosetComponent/ClosetFilters";
import { ClosetRow } from "../components/ClosetComponent/ClosetRow";

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

export const MyCloset = () => {

    // State Management
    const [clothes, setClothes] = useState<ClothingItem[]>([]);
    const [userTags, setUserTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("User");

    const overlayRef = useRef<HTMLDivElement>(null);

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const closeModal = () => setSelectedImage(null);

    // Filter & Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);


    // Define fetchAllTags FIRST so it is available to the rest of the component
    const fetchAllTags = useCallback(async () => {
        const storedUser = sessionStorage.getItem("user_data");
        const token = storedUser ? JSON.parse(storedUser).token : "";
        
        if (!token) return;

        try {
            const res = await fetch(buildPath('api/tags'), {
                headers: { 'x-token': token }
            });
            const data = await res.json();
            if (data.ok) setUserTags(data.tags);
        } catch (error) {
            console.error("Error refreshing tags:", error);
        }
    }, []);

    const uniqueTypes = Array.from(new Set(clothes.map(item => item.type))).sort();
    const uniqueBrands = Array.from(new Set(clothes.map(item => item.brand))).filter(Boolean).sort();
    const uniqueTags = userTags.map(tag => tag.title);

    // Logic: Filtering
    const filteredClothes = clothes.filter((item) => {
        
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
            item.title.toLowerCase().includes(searchLower) || 
            item.brand.toLowerCase().includes(searchLower) || 
            item.type.toLowerCase().includes(searchLower) ||
            item.tags?.some(tag => tag.title.toLowerCase().includes(searchLower));

        const matchesType = selectedTypes.length === 0 || selectedTypes.includes(item.type);
        const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(item.brand);
        const matchesTag = selectedTags.length === 0 || item.tags?.some(tag => selectedTags.includes(tag.title));

        return matchesSearch && matchesType && matchesBrand && matchesTag;
    });

    // Event Handlers
    const toggleType = (type: string) => {
        setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    };

    const toggleBrand = (brand: string) => {
        setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
    };

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    // Data Fetching
    useEffect(() => {
        const storedUser = sessionStorage.getItem("user_data");
        let token = "";

        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUserName(userData.name || "User");
                token = userData.token;
            } catch (error) {
                console.error("Error parsing user data", error);
            }
        }

        const fetchInitialData = async () => {
            if(!token){
                setLoading(false);
                return;
            }
            
            try {
                const response = await fetch(buildPath('api/clothes'), {
                    headers: { 'x-token': token }
                });
                const data = await response.json();
                if (data.ok) setClothes(data.clothes);

                // Re-use the tag fetcher
                await fetchAllTags();

            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [fetchAllTags]);

    const handleUpdate = async (id: string, updatedData: Partial<ClothingItem>) => {
        // Prepare Data
        const uiData = { ...updatedData };
        
        if (updatedData.tags && Array.isArray(updatedData.tags)) {
            // Check if the first element is a string or an object
            const isStringArray = typeof updatedData.tags[0] === 'string';

            if (isStringArray) {
                // If they are IDs
                const tagIds = updatedData.tags as unknown as string[];
                uiData.tags = userTags.filter(t => tagIds.includes(t.id || t._id));
            } else {
                // If they are already objects (from EditModal), just use them
                uiData.tags = updatedData.tags;
            }
        }

        // Update Local State
        setClothes(prev => prev.map(item => 
            (item.id === id || item._id === id) ? { ...item, ...uiData as ClothingItem } : item
        ));

        // Prepare API Data
        const apiData = {
            ...updatedData,
            tags: updatedData.tags?.map(t => (typeof t === 'string' ? t : (t.id || t._id)))
        };

        const storedUser = sessionStorage.getItem("user_data");
        const token = storedUser ? JSON.parse(storedUser).token : "";

        try {
            const response = await fetch(buildPath(`api/clothes/${id}`), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-token': token
                },
                body: JSON.stringify(apiData) // Send the IDs to the server
            });
            
            const data = await response.json();
            if (!data.ok) console.error("Server update failed:", data.msg);
        } catch (error) {
            console.error("Network error during update:", error);
        }
    };


    const handleDelete = async(id: string) => {
        
        const storedUser = sessionStorage.getItem("user_data");
        const token = storedUser ? JSON.parse(storedUser).token : "";

        try {
            const response = await fetch(buildPath(`api/clothes/${id}`), {
                method: 'DELETE',
                headers: {
                    'x-token': token
                }
            });

            const data = await response.json();

            if (data.ok) {
                // Optimistically update UI by removing the item from state
                setClothes(prev => prev.filter(item => (item.id !== id && item._id !== id)));
            } else {
                console.error("Delete failed:", data.msg);
            }
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    if (loading) {
        return <Loader2 className="animate-spin mx-auto mt-20 text-white" />;
    }

    return (

        <>
            <div className="flex flex-col gap-8 mt-8 animate-fade-in animation-delay-200">
                
                <div className="flex flex-col gap-6 bg-[#1a1a1a]/85 border border-white/10 rounded-2xl px-8 py-6 backdrop-blur-md">
                    
                    <div className="flex flex-col gap-1">
                        
                        <h1 className="text-white font-display font-bold text-3xl uppercase tracking-widest">
                            My Closet
                        </h1>
                        
                        <p className="text-white/60 text-sm uppercase tracking-widest mt-1">
                            Tailored for <span className="text-white font-bold">{userName}</span>
                        </p>
                    </div>

                    <ClosetFilters 
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        categories={uniqueTypes}
                        selectedCat={selectedTypes}
                        onToggleCategory={toggleType}
                        brands={uniqueBrands}
                        selectedBrands={selectedBrands}
                        onToggleBrand={toggleBrand}
                        tags={uniqueTags}
                        selectedTags={selectedTags}
                        onToggleTag={toggleTag}
                        onReset={() => {setSelectedTypes([]); setSelectedBrands([]); setSelectedTags([])}}
                    />

                    <div className="mt-4">
                        
                        {clothes.length > 0 ? (
                            uniqueTypes.map((type) => {
                                const typeItems = filteredClothes.filter(item => item.type === type);
                                if (typeItems.length === 0) return null;

                                return (
                                    <ClosetRow 
                                        key={type} 
                                        title={type} 
                                        items={typeItems}
                                        allTags={userTags}
                                        onUpdate={handleUpdate}
                                        onDelete={handleDelete}
                                        onTagCreated={fetchAllTags} 
                                        onImageClick={(path) => setSelectedImage(path)}
                                    />
                                );
                            })
                        ) : (
                            <div className="w-full py-20 text-center border-2 border-dashed border-white/20 rounded-2xl bg-black/20">
                                
                                <p className="text-white/60 font-display text-lg uppercase tracking-widest">
                                    Your closet is empty
                                </p>
                            
                            </div>
                        )}

                    </div>

                </div>


            </div>

            {/* Full Image Lightbox matches modal Style */}
            {selectedImage && (
                
                <div 
                    ref={overlayRef} // Ensure you have an overlayRef or use a simple onClick
                    onClick={closeModal}
                    className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
                >
                    
                    <div 
                        className="relative w-full max-w-3xl bg-[#111111] border border-white/50 rounded-2xl shadow-2xl overflow-hidden animate-fade-in2 zoom-in-95"
                        onClick={(e) => e.stopPropagation()} 
                    >
                        {/* Close button matches the EditModal position and style */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-[red] hover:bg-white/10 transition-all cursor-pointer"
                        >
                            <X size={16} />
                        </button>

                        <div className="flex flex-col">
                           
                            <div className="relative w-full bg-black/40 shrink-0 flex items-center justify-center">
                                <img 
                                    src={selectedImage} 
                                    alt="Full View" 
                                    className="max-h-[80vh] w-full object-contain opacity-90" 
                                />
                                
                                {/* Bottom gradient/info bar similar to the EditModal sidebar */}
                                <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/80 to-transparent" />
                                
                                <div className="absolute bottom-6 left-8">
                                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/50">
                                        Viewing Item Image
                                    </p>
                                </div>
                            
                            </div>
                        
                        </div>
                    
                    </div>
                
                </div>

            )}

        </>

    );
}