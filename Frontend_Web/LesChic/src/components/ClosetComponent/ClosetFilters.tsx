import { Search, ChevronDown, Check } from "lucide-react";
import { useState } from "react";


interface ClosetFiltersProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;

    categories: string[];
    selectedCat: string[];
    onToggleCategory: (type: string) => void;

    brands: string[];
    selectedBrands: string[];
    onToggleBrand: (brand: string) => void;

    tags: string[];
    selectedTags: string[];
    onToggleTag: (tag: string) => void;

    onReset: () => void;
}

// Reusable Dropdown Component
const FilterDropdown = ({ label, options, selected, onToggle, isOpen, onOpen }: {label: string, options: string[], selected: string[], onToggle: (val: string) => void, isOpen: boolean, onOpen: () => void}) => (
    <div className="relative w-full md:w-44">
        <button 
            onClick={onOpen}
            className="w-full flex items-center justify-between cursor-pointer bg-black/20 border border-white/30 rounded-xl py-2.5 px-4 text-white/80 hover:border-white/60 transition-all"
        >
            <span className="text-[10px] uppercase tracking-widest font-bold truncate">
                {selected.length > 0 ? `${selected.length} ${label}` : `Filter ${label}`}
            </span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#121212] border border-white/10 rounded-xl shadow-2xl z-50 py-2 backdrop-blur-xl max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1">
                {options.map((opt) => {
                    
                    const isSelected = selected.includes(opt);
                    
                    return (
                        <label key={opt} className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 cursor-pointer transition-colors">
                            <input type="checkbox" className="hidden" checked={isSelected} onChange={() => onToggle(opt)} />
                            <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-white border-white' : 'border-white/40'}`}>
                                {isSelected && <Check size={10} className="text-black" strokeWidth={4} />}
                            </div>
                            <span className="text-white/70 text-[10px] uppercase tracking-[0.2em] font-bold">{opt}</span>
                        </label>
                    );
                })}
            </div>
        )}
    </div>
);

export const ClosetFilters = ({
    searchQuery, setSearchQuery, categories, selectedCat, onToggleCategory,
    brands, selectedBrands, onToggleBrand, tags, selectedTags, onToggleTag, onReset
}: ClosetFiltersProps) => {
    // Track which dropdown is open to ensure only one is visible at a time
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const toggleDropdown = (name: string) => {
        setActiveDropdown(activeDropdown === name ? null : name);
    };

    const hasFilters = selectedCat.length > 0 || selectedBrands.length > 0 || selectedTags.length > 0;

    return (
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center w-full justify-between">
            {/* Search Bar */}
            <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                <input 
                    type="text" 
                    placeholder="Search items..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className="w-full bg-black/40 border border-white/30 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-white/60 focus:outline-none focus:border-white/60 transition-all" 
                />
            </div>

            {/* Filter Group */}
            <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-start md:justify-end">
                <FilterDropdown 
                    label="Type" options={categories} selected={selectedCat} 
                    onToggle={onToggleCategory} isOpen={activeDropdown === 'category'} 
                    onOpen={() => toggleDropdown('category')} 
                />
                
                <FilterDropdown 
                    label="Brand" options={brands} selected={selectedBrands} 
                    onToggle={onToggleBrand} isOpen={activeDropdown === 'brand'} 
                    onOpen={() => toggleDropdown('brand')} 
                />

                <FilterDropdown 
                    label="Tag" options={tags} selected={selectedTags} 
                    onToggle={onToggleTag} isOpen={activeDropdown === 'tag'} 
                    onOpen={() => toggleDropdown('tag')} 
                />

                {hasFilters && (
                    <button onClick={onReset} className="px-2 text-[10px] text-white/50 hover:text-white uppercase tracking-widest transition-colors">
                        Reset
                    </button>
                )}
            </div>
        </div>
    );
};