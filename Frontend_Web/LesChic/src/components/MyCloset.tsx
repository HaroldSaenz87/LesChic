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

    const [clothes, setClothes] = useState<ClothingItem[]>([]);
    const [allUserTags, setAllUserTags] = useState<Tag[]>([]);

    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("User");

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const uniqueTypes = Array.from(new Set(clothes.map(item => item.type))).sort();
    const uniqueBrands = Array.from(new Set(clothes.map(item => item.brand))).filter(Boolean).sort();

    // Use allUserTags for the filter dropdown — shows ALL user tags, not just ones on items
    const uniqueTags = allUserTags.map(t => t.title).sort();

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

    const toggleType = (type: string) =>
        setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);

    const toggleBrand = (brand: string) =>
        setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);

    const toggleTag = (tag: string) =>
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

    const getToken = (): string => {
        try {
            const stored = sessionStorage.getItem("user_data");
            return stored ? JSON.parse(stored).token : "";
        } catch {
            return "";
        }
    };

    const fetchCloset = async (token: string) => {
        try {
            const res = await fetch(buildPath('api/clothes'), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'x-token': token }
            });
            const data = await res.json();
            if (data.ok) setClothes(data.clothes);
            else console.error("API Error:", data.msg);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    const fetchAllTags = async (token: string) => {
        try {
            const res = await fetch(buildPath('api/tags'), {
                headers: { 'x-token': token }
            });
            const data = await res.json();
            if (data.ok) {
                // Normalize: Tag.js has a broken toObject transform that strips _id
                // So we use .lean()-style workaround: stringify then parse to get plain _id string
                const normalized: Tag[] = data.tags.map((t: any) => {
                    // The tag comes back as { userId, title } with _id stripped by the broken transform
                    // BUT JSON.stringify of a Mongoose doc calls toJSON, which should set id = _id
                    // If id is still missing, fall back to stringifying the raw object
                    const id = t.id || t._id?.toString() || "";
                    return { ...t, id, _id: id };
                });
                setAllUserTags(normalized);
            }
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    };

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

        const init = async () => {
            if (!token) { setLoading(false); return; }
            await Promise.all([fetchCloset(token), fetchAllTags(token)]);
            setLoading(false);
        };

        init();
    }, []);

    // Tags already on clothes items (for the edit modal — these have proper id from populate)
    const allTagObjects = Array.from(
        new Map(
            clothes.flatMap(item => item.tags || []).map(tag => [tag.id || tag._id, tag])
        ).values()
    );

    // Merge: allTagObjects (have real IDs from populate) + allUserTags (may lack IDs due to backend bug)
    // Prefer allTagObjects entries since they come from populate and have proper IDs
    const mergedTagsMap = new Map<string, Tag>();
    allTagObjects.forEach(t => mergedTagsMap.set(t.title, t));
    allUserTags.forEach(t => {
        if (!mergedTagsMap.has(t.title)) mergedTagsMap.set(t.title, t);
    });
    const mergedTags = Array.from(mergedTagsMap.values());

    const handleUpdate = async (id: string, updatedData: Partial<ClothingItem>) => {

        // Build API payload: extract tag IDs as plain strings
        const apiPayload: any = { ...updatedData };
        if (updatedData.tags && Array.isArray(updatedData.tags)) {
            apiPayload.tags = (updatedData.tags as unknown as string[]);
        }

        // Build UI payload: resolve tag IDs back to full Tag objects for optimistic update
        const uiData = { ...updatedData };
        if (updatedData.tags && Array.isArray(updatedData.tags)) {
            const tagIds = updatedData.tags as unknown as string[];
            uiData.tags = mergedTags.filter(t => tagIds.includes(t.id || t._id));
        }

        // Optimistic UI update
        setClothes(prev => prev.map(item =>
            (item.id === id || item._id === id) ? { ...item, ...uiData as ClothingItem } : item
        ));

        const token = getToken();

        try {
            const response = await fetch(buildPath(`api/clothes/${id}`), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-token': token },
                body: JSON.stringify(apiPayload)
            });

            const data = await response.json();

            if (data.ok) {
                // Server returns populated doc — use as source of truth
                setClothes(prev => prev.map(item =>
                    (item.id === id || item._id === id) ? data.clothes : item
                ));
                console.log("Database updated successfully");
            } else {
                console.error("Server update failed:", data.msg);
            }
        } catch (error) {
            console.error("Network error during update:", error);
        }
    };

    if (loading) {
        return <Loader2 className="animate-spin mx-auto mt-20 text-white" />;
    }

    return (
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
                    onReset={() => { setSelectedTypes([]); setSelectedBrands([]); setSelectedTags([]); }}
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
                                    allTags={mergedTags}
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