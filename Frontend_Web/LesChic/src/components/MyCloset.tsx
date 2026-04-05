import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react";
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
    _id: string;    // this is a fallback if the first fails
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
    
    
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("User");

    // Filter & Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const uniqueTypes = Array.from(new Set(clothes.map(item => item.type))).sort();
    const uniqueBrands = Array.from(new Set(clothes.map(item => item.brand))).filter(Boolean).sort();
    
    const uniqueTags = Array.from(new Set(clothes.flatMap(item => item.tags?.map(t => t.title) || []))).sort();

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

    const toggleType = (type: string) => {

        setSelectedTypes(prev => 
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );

    };

    const toggleBrand = (brand: string) => {

        setSelectedBrands(prev => 
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );

    };

    const toggleTag = (tag: string) => {

        setSelectedTags(prev => 
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );

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

            } 
            catch (error) {
                console.error("Error parsing user data", error);
            }

        }

        const fetchCloset = async () => {

            if(!token){

                setLoading(false);

                return;
            }

            try {

                const res = await fetch(buildPath('api/clothes'), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-token': token
                    }
                });

                const data = await res.json();

                if (data.ok){
                    setClothes(data.clothes);
                }
                else{
                    console.error("API Error:", data.msg);
                }

            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCloset()

    }, []);

    const allTagObjects = Array.from(new Map(clothes.flatMap(item => item.tags || []).map(tag => [tag.id || tag._id, tag])).values());

    const handleUpdate = async (id: string, updatedData: Partial<ClothingItem>) => {
    
        // Prepare the UI data
        const uiData = { ...updatedData };
        
        // Check if tags exists and is an array of strings
        if (updatedData.tags && Array.isArray(updatedData.tags)) {
            const tagIds = updatedData.tags as unknown as string[];
            
            // Using 'allTagObjects'
            uiData.tags = allTagObjects.filter(t => 
                tagIds.includes(t.id || t._id)
            );
        }

        // Update local state for immediate feedback
        setClothes(prev => prev.map(item => 
            (item.id === id || item._id === id) ? { ...item, ...uiData as ClothingItem } : item
        ));

        // DATABASE: Permanent Save
        const storedUser = sessionStorage.getItem("user_data");
        const token = storedUser ? JSON.parse(storedUser).token : "";

        try {
            
            const response = await fetch(buildPath(`api/clothes/${id}`), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-token': token
                },
                body: JSON.stringify(updatedData)
            });

            const data = await response.json();
            
            if (!data.ok) {

                console.error("Server update failed:", data.msg);
                
            } else {

                console.log("Database updated successfully");
            }
        } catch (error) {

            console.error("Network error during update:", error);
        }
    };



    
    // Loading spinner 
    if (loading) {
        return <Loader2 className="animate-spin mx-auto mt-20 text-white" />;
    }






    return (

        <div className="flex flex-col gap-8 mt-8 animate-fade-in animation-delay-200">

            <div className="flex flex-col gap-6 bg-[#1a1a1a]/85 border border-white/10 rounded-2xl px-8 py-6 backdrop-blur-md">
                
                {/* Header */}
                <div className="flex flex-col gap-1">

                    <h1 className="text-white font-display font-bold text-3xl uppercase tracking-widest">
                        My Closet
                    </h1>

                    <p className="text-white/60 text-sm uppercase tracking-widest mt-1">
                        Tailored for <span className="text-white font-bold">{userName}</span>
                    </p>

                </div>


                {/* Sub-Component: Search & Dropdown */}
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


                {/* Sub-Component: Collection Rows */}
                <div className="mt-4">

                    {clothes.length > 0 ? (
                        uniqueTypes.map((type) => {
                            const typeItems = filteredClothes.filter(
                                item => item.type === type
                            );
                            
                            if (typeItems.length === 0) return null;

                            return (
                                <ClosetRow 
                                    key={type} 
                                    title={type} 
                                    items={typeItems}
                                    allTags={allTagObjects}
                                    onUpdate={handleUpdate} 
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
    );
}