import { useEffect, useState, useRef } from "react"
import { buildPath } from "../utils/buildPath";
import { ChevronLeft, ChevronRight, FolderHeart, Loader2 } from "lucide-react";
import { MOCK_CATEGORIES, MOCK_CLOTHES } from "../data/mock"; // mock data

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
    imagePath: string;
}

export const MyCloset = () => {

    const [clothes, setClothes] = useState<ClothingItem[]>(MOCK_CLOTHES);// remove mock once api works
    const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES); // remove mock once api works
    
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("User");

    // 1. Create a reference object to hold the scrollable divs
    const scrollRefs = useRef<{ [key: string | number]: HTMLDivElement | null }>({});

    // 2. Create the scroll function
    const scroll = (id: string | number, direction: 'left' | 'right') => {
        const container = scrollRefs.current[id];
        if (container) {
            const scrollAmount = 400; // Adjust this value for scroll distance
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

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
                
                // Fetching both clothes and categories
                const [clothesRes, categoriesRes] = await Promise.all([
                    fetch(buildPath('api/clothes/my-closet')),
                    fetch(buildPath('api/categories')) // Adjust this path to your categories API
                ]);

                const clothesdata = await clothesRes.json();
                const catData = await categoriesRes.json();


                if (clothesdata.ok) setClothes(clothesdata.clothes);
                if(catData.ok) setCategories(catData.categories);

            } catch (error) {
                console.error("Closet fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCloset();
    }, []);

    if (loading) {
        return <Loader2 className="animate-spin mx-auto mt-20 text-white" />;
    }

    return (

        <div className="flex flex-col gap-8 mt-8 animate-fade-in animation-delay-200">
            
            {/* Same Container as Overview */}
            <div className="flex flex-col gap-6 bg-black/40 border border-white/10 rounded-2xl px-8 py-6 backdrop-blur-md">
                
                {/* Header  */}
                <div className="flex flex-col gap-1">

                    <h1 className="text-white font-display font-bold text-3xl uppercase tracking-widest">
                        My Closet
                    </h1>

                    <p className="text-white/60 text-sm uppercase tracking-widest mt-1">
                        Tailored for <span className="text-white font-bold">{userName}</span>
                    </p>

                </div>

                {/* Main Collection Loop by Category */}
                {categories.length > 0 ? (

                    categories.map((cat) => {

                        // Filter clothes belonging to this specific category
                        const categoryItems = clothes.filter(item => String(item.categoryId) === String(cat._id));

                        if (categoryItems.length === 0) return null; // Hide empty categories

                        return (

                            <div key={cat._id} className="flex flex-col gap-4 mb-10">

                                
                                <div className="flex items-center gap-3">

                                    <FolderHeart size={20} className="text-white/80" />
                                    
                                    <h2 className="text-white text-lg font-bold uppercase tracking-[0.2em] font-display">
                                        {cat.title}
                                    </h2>
                                    
                                    <div className="h-px grow bg-white/60 ml-2" />
                                
                                </div>

                                <div className="relative group">

                                    <div ref={(el) => {scrollRefs.current[cat._id] = el}} className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory">
                                        
                                        {categoryItems.map((item) => (
                                            
                                            <div 
                                                key={item._id} 
                                                className="min-w-64 h-80 bg-black/50 rounded-2xl overflow-hidden border border-white/15 snap-center transition-all duration-300 hover:border-white/40 hover:bg-black/60 group/card"
                                            >
                                                
                                                <img src={item.imagePath} alt={item.title} className="w-full h-3/5 object-cover opacity-90 group-hover/card:opacity-100 transition-opacity" />
                                                
                                                <div className="p-4 flex flex-col justify-between h-2/5">
                                                    
                                                    <div>
                                                        
                                                        <h3 className="text-white font-display font-bold text-md tracking-wide uppercase truncate">
                                                            {item.title}
                                                        </h3>
                                                        
                                                        <p className="text-white/70 text-[11px] uppercase tracking-widest mt-1">
                                                            {item.brand} — {item.size}
                                                        </p>
                                                    
                                                    </div>
                                                    
                                                    <div className="flex gap-2">
                                                        
                                                        <span className="px-3 py-1 bg-white/5 text-white/80 text-[12px] rounded-full uppercase font-bold border border-white/5">
                                                            {item.type}
                                                        </span>
                                                    
                                                    </div>

                                                </div>

                                            </div>

                                        ))}

                                    </div>

                                    {/* Navigation Buttons for each Row */}
                                    {categoryItems.length > 3 && (
                                        
                                        <>

                                            <button onClick={() => scroll(cat._id, 'left')} className="absolute -left-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-white/10 text-white p-2 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-all z-10 cursor-pointer">
                                                <ChevronLeft size={18} />
                                            </button>
                                            
                                            <button onClick={() => scroll(cat._id, 'right')} className="absolute -right-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-white/10 text-white p-2 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-all z-10 cursor-pointer">
                                                <ChevronRight size={18} />
                                            </button>

                                        </>
                                        
                                    )}

                                </div>

                            </div>
                            
                        );

                    })
                ) : (

                    <div className="w-full py-20 text-center border-2 border-dashed border-white/20 rounded-2xl bg-black/20">
                        
                        <p className="text-white/60 font-display text-lg uppercase tracking-widest">
                            Your closet is empty <br /> Is everything in the laundry?
                        </p>

                    </div>
                )}

            </div>
        
        </div>

    );
}