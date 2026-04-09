import { X, BookOpen, Calendar as CalendarIcon, Check } from 'lucide-react';
import { useState } from 'react';

interface SelectEnsembleModalProps {
    isOpen: boolean;
    onClose: () => void;
    lookbooks: any[];
    onSelect: (lookbook: any, date: string) => void;
}

export const SelectModal = ({ isOpen, onClose, lookbooks, onSelect }: SelectEnsembleModalProps) => {
    const [tempSelection, setTempSelection] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (tempSelection && selectedDate) {
            //Add a time component to ensure it stays on the selected day 
            // regardless of the user's timezone offset from UTC.
            const localDate = `${selectedDate}T12:00:00`; 
            
            onSelect(tempSelection, localDate);
            setTempSelection(null);
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-full max-w-6xl bg-[#1a1a1a] border border-white/10 rounded-2xl flex flex-col max-h-[90vh] shadow-2xl overflow-hidden animate-fade-in2">
                
                {/* Header */}
                <div className="flex justify-between items-start p-8 pb-4">
                    <div>
                        <h2 className="text-white font-display text-2xl uppercase tracking-widest">Plan Ensemble</h2>
                        <p className="text-white/40 text-xs uppercase tracking-widest mt-1">Select a look and set the schedule</p>
                    </div>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden p-8 gap-8">
                    {/* Left Column: The Card Grid (Matches OutfitsCard style) */}
                    <div className="flex-1 overflow-y-auto pr-4 grid grid-cols-1 md:grid-cols-2 gap-6 custom-scrollbar">
                        {lookbooks.map((lb) => {
                            const isSelected = (tempSelection?._id || tempSelection?.id) === (lb._id || lb.id);
                            const preview = lb.clothes?.slice(0, 5) || [];
                            const overflow = (lb.clothes?.length || 0) - 5;

                            return (
                                <button
                                    key={lb._id || lb.id}
                                    onClick={() => setTempSelection(lb)}
                                    className={`flex flex-col bg-[#242424] border rounded-2xl overflow-hidden transition-all duration-300 group relative text-left ${
                                        isSelected 
                                        ? 'border-secondary ring-2 ring-secondary' 
                                        : 'border-white/10 hover:border-white/30 hover:bg-[#2a2a2a]'
                                    }`}
                                >
                                    {/* Thumbnail Grid - Matches OutfitsCard */}
                                    <div className="relative h-36 border-b border-white/5 overflow-hidden">
                                        <div className="grid grid-cols-3 gap-0.5 p-0.5 h-full">
                                            {preview.map((item: any, i: number) => (
                                                <div
                                                    key={item._id || i}
                                                    className="relative bg-[#333] rounded-sm overflow-hidden"
                                                    style={{ gridRow: i === 0 ? "span 2" : "span 1" }}
                                                >
                                                    {item.imagePath ? (
                                                        <img src={item.imagePath} alt={item.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <BookOpen size={16} className="text-white/20" />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {overflow > 0 && (
                                                <div className="bg-[#2a2a2a] rounded-sm flex items-center justify-center">
                                                    <span className="font-display text-xs text-white/30">+{overflow}</span>
                                                </div>
                                            )}
                                        </div>
                                        {isSelected && (
                                            <div className="absolute inset-0 bg-secondary/10 flex items-center justify-center backdrop-blur-[1px]">
                                                <div className="bg-[lightgreen] text-black p-2 rounded-full shadow-xl">
                                                    <Check size={20} />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Content - Matches OutfitsCard Style */}
                                    <div className="px-4 py-3 flex flex-col gap-1 bg-accent">
                                        <p className="text-white font-display italic text-[20px] leading-tight truncate">
                                            {lb.title || "Untitled Lookbook"}
                                        </p>
                                        <span className="font-display text-[12px] text-white/65 uppercase tracking-widest">
                                            {lb.clothes?.length || 0} {lb.clothes?.length === 1 ? "piece" : "pieces"}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Column: Preview & Scheduler */}
                    <div className="w-80 bg-white/5 rounded-xl p-6 border border-white/10 flex flex-col gap-6 sticky top-0 h-fit">
                        <h3 className="text-secondary font-display text-sm uppercase tracking-widest border-b border-white/10 pb-2">Schedule Details</h3>
                        
                        {tempSelection ? (
                            <div className="flex flex-col gap-6 animate-fade-in">
                                <div className="space-y-1">
                                    <p className="text-white text-xl font-display italic uppercase tracking-tight">{tempSelection.title}</p>
                                    <p className="text-white/40 text-[10px] uppercase tracking-widest">
                                        Last worn: {tempSelection.lastUsed && tempSelection.lastUsed !== '1970-01-01T00:00:00.000Z' 
                                            ? new Date(tempSelection.lastUsed).toLocaleDateString() 
                                            : 'Never'}
                                    </p>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-white/5">
                                    <label className="text-white/60 text-[10px] uppercase tracking-widest flex items-center gap-2">
                                        <CalendarIcon size={12} className="text-secondary" /> Select Date
                                    </label>
                                    <input 
                                        type="date" 
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full bg-black/60 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-secondary outline-none transition-all"
                                    />
                                </div>

                                <button 
                                    onClick={handleConfirm}
                                    className="mt-4 w-full py-4 bg-secondary text-black font-display font-bold text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-white transition-all shadow-lg"
                                >
                                    Confirm Ensemble
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-white/20 text-xs uppercase text-center italic space-y-4 py-20">
                                <div className="p-4 border border-dashed border-white/10 rounded-full">
                                    <Check size={24} className="opacity-10" />
                                </div>
                                <p>Select a lookbook <br/> to schedule</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-4 border-t border-white/5 flex justify-start bg-[#1a1a1a]">
                    <button onClick={onClose} className="text-white/30 hover:text-red-400 text-[10px] uppercase tracking-[0.2em] transition-colors">
                        Abandon Selection
                    </button>
                </div>
            </div>
        </div>
    );
};