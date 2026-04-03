import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react";
import { buildPath } from "../utils/buildPath";
import { MOCK_CATEGORIES, MOCK_CLOTHES } from "../data/mock"; // mock later delete when api done
import { ClosetFilters } from "../components/ClosetComponent/ClosetFilters";
import { ClosetRow } from "../components/ClosetComponent/ClosetRow";

interface Category {
    _id: string | number;
    title: string;
    color: string;
}

interface ClothingItem {
    _id: string | number;
    categoryId: string | number;
    title: string;
    brand: string;
    size: string | number;
    type: string;
    tags: string[];
    imagePath: string;
}

export const MyCloset = () => {

    // 1. State Management
    const [clothes, setClothes] = useState<ClothingItem[]>(MOCK_CLOTHES);
    const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("User");

    // 2. Filter & Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCat, setCat] = useState<(string | number)[]>([]);

    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const uniqueBrands = Array.from(new Set(clothes.map(item => item.brand))).filter(Boolean);
    const uniqueTags = Array.from(new Set(clothes.flatMap(item => item.tags || []))).filter(Boolean);

    // 3. Logic: Filtering
    const filteredClothes = clothes.filter((item) => {

        const searchLower = searchQuery.toLowerCase();

        const matchesSearch = 
            item.title.toLowerCase().includes(searchLower) || 
            item.brand.toLowerCase().includes(searchLower) || 
            item.type.toLowerCase().includes(searchLower) ||
            item.tags.some(tag => tag.toLowerCase().includes(searchLower));

        const matchesCategory = selectedCat.length === 0 || selectedCat.includes(item.categoryId);

        const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(item.brand);
        const matchesTag = selectedTags.length === 0 || item.tags.some(tag => selectedTags.includes(tag));

        return matchesSearch && matchesCategory && matchesBrand && matchesTag;
    });

    const toggleCategory = (id: string | number) => {

        setCat(prev => 
            prev.includes(id) ? prev.filter(catId => catId !== id) : [...prev, id]
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



    // 4. Data Fetching
    useEffect(() => {

        const storedUser = sessionStorage.getItem("user_data");

        if (storedUser) {

            try {
                const userData = JSON.parse(storedUser);
                setUserName(userData.name || "User");
            } catch (error) {
                console.error("Error parsing user data", error);
            }

        }

        const fetchCloset = async () => {

            try {
                const [clothesRes, categoriesRes] = await Promise.all([
                    fetch(buildPath('api/clothes/my-closet')),
                    fetch(buildPath('api/categories'))
                ]);
                const clothesdata = await clothesRes.json();
                const catData = await categoriesRes.json();

                if (clothesdata.ok) setClothes(clothesdata.clothes);
                if (catData.ok) setCategories(catData.categories);
            } catch (error) {
                console.error("Closet fetch error:", error);
            } finally {
                setLoading(false);
            }

        };

        fetchCloset();

    }, []);



    
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
                    categories={categories}
                    selectedCat={selectedCat}
                    onToggleCategory={toggleCategory}
                    brands={uniqueBrands}
                    selectedBrands={selectedBrands}
                    onToggleBrand={toggleBrand}
                    tags={uniqueTags}
                    selectedTags={selectedTags}
                    onToggleTag={toggleTag}
                    onReset={() => {setCat([]); setSelectedBrands([]); setSelectedTags([])}}
    
                />

                {/* Sub-Component: Collection Rows */}
                <div className="mt-4">
                    {categories.length > 0 ? (
                        categories.map((cat) => {
                            const categoryItems = filteredClothes.filter(
                                item => String(item.categoryId) === String(cat._id)
                            );
                            
                            if (categoryItems.length === 0) return null;

                            return (
                                <ClosetRow 
                                    key={cat._id} 
                                    title={cat.title} 
                                    items={categoryItems} 
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