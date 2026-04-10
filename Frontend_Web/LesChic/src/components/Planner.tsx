import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useOutletContext } from 'react-router-dom';
import { CalendarPlus, CheckCircle2, Circle } from 'lucide-react';
import { useState } from 'react';
import { SelectModal } from './PlannerComponents/SelectModal';
import { buildPath } from '../utils/buildPath';

export const Planner = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lookbookToRemove, setLookbookToRemove] = useState<any>(null);

    const { lookbooks = [], fetchLookbooks } = useOutletContext<{ 
        lookbooks: any[], 
        fetchLookbooks?: () => void 
    }>();

   const handleToggleWorn = async () => {
        if (!lookbookToRemove) return;

        const isCurrentlyWorn = lookbookToRemove.lastUsed === lookbookToRemove.plannedUsed;
        const lookbookId = lookbookToRemove._id || lookbookToRemove.id;
        const storedUser = sessionStorage.getItem("user_data");
        const token = storedUser ? JSON.parse(storedUser).token : "";

        try {
            const res = await fetch(buildPath(`api/lists/${lookbookId}`), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-token": token,
                },
                body: JSON.stringify({ 
                    title: lookbookToRemove.title,
                    clothes: lookbookToRemove.clothes.map((c: any) => c._id || c.id),
                    plannedUsed: lookbookToRemove.plannedUsed, 
                    // If already worn, reset lastUsed. If not, set it to the planned date.
                    lastUsed: isCurrentlyWorn 
                        ? '1970-01-01T00:00:00.000Z' 
                        : lookbookToRemove.plannedUsed 
                }),
            });

            const data = await res.json();
            if (data.ok) {
                fetchLookbooks?.(); 
                setLookbookToRemove(null); 
            }
        } catch (err) {
            console.error("Failed to toggle worn status:", err);
        }
    };

    const handleOutfitSelect = async (lb: any, date: string) => {
        const lookbookId = lb._id || lb.id;
        if (!lookbookId) return;

        const storedUser = sessionStorage.getItem("user_data");
        const token = storedUser ? JSON.parse(storedUser).token : "";

        try {
            const res = await fetch(buildPath(`api/lists/${lookbookId}`), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-token": token,
                },
                body: JSON.stringify({ 
                    title: lb.title,
                    clothes: lb.clothes.map((c: any) => c._id || c.id),
                    plannedUsed: date, 
                    lastUsed: lb.lastUsed || new Date(0).toISOString() 
                }),
            });

            const data = await res.json();
            if (data.ok) {
                fetchLookbooks?.(); 
                setIsModalOpen(false); 
            }
        } catch (err) {
            console.error("Failed to schedule outfit:", err);
        }
    };

    const handleDateClick = () => {
        setIsModalOpen(true);
    };

    const handleConfirmRemove = async () => {

        if (!lookbookToRemove) return;

        const lookbookId = lookbookToRemove._id || lookbookToRemove.id;
        const storedUser = sessionStorage.getItem("user_data");
        const token = storedUser ? JSON.parse(storedUser).token : "";

        try {
            const res = await fetch(buildPath(`api/lists/${lookbookId}`), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-token": token,
                },
                body: JSON.stringify({ 
                    title: lookbookToRemove.title,
                    clothes: lookbookToRemove.clothes.map((c: any) => c._id || c.id),
                    plannedUsed: '1970-01-01T00:00:00.000Z', 
                    lastUsed: lookbookToRemove.lastUsed || new Date(0).toISOString() 
                }),
            });

            const data = await res.json();
            if (data.ok) {
                fetchLookbooks?.(); 
                setLookbookToRemove(null); 
            }
        } catch (err) {
            console.error("Failed to remove schedule:", err);
        }
    };

    const events = lookbooks
        .filter(lb => lb.plannedUsed && lb.plannedUsed !== '1970-01-01T00:00:00.000Z')
        .map(lb => ({
            id: lb._id || lb.id,
            title: lb.title,
            start: lb.plannedUsed,
            allDay: true,
            extendedProps: { ...lb }
        }));

    const renderEventContent = (eventInfo: any) => {
        const lb = eventInfo.event.extendedProps;
        const isUsed = lb.lastUsed === lb.plannedUsed;

        return (
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    setLookbookToRemove(lb);
                }}
                /* origin-center: Ensures it grows outward from the middle.
                hover:scale-105: A gentler pop (5% instead of 10%) to stay within bounds.
                z-50: Ensures that while hovering, it sits ABOVE all other grid lines.
                */
                className={`flex items-center justify-center w-full p-1 rounded-md transition-all duration-300 cursor-pointer relative z-10 hover:z-50 hover:scale-105 origin-center shadow-sm border backdrop-blur-md ${
                    isUsed 
                        ? "bg-green-400/50! text-white border-green-400/50 hover:brightness-125 hover:shadow-green-500/30" 
                        : "bg-secondary! text-black border-secondary/30 hover:brightness-110 hover:shadow-md hover:shadow-secondary/20"
                }`}
            >
                <div className="flex items-center justify-center gap-1.5 truncate pointer-events-none w-full px-2">
                    {isUsed ? (
                        <CheckCircle2 size={13} className="shrink-0 text-green-400" />
                    ) : (
                        <Circle size={12} className="opacity-40 shrink-0 text-black" />
                    )}
                    <span className="truncate text-[8px] sm:text-[9px] uppercase tracking-[0.12em] leading-none font-bold py-0.5">
                        {eventInfo.event.title}
                    </span>
                </div>
            </button>
        );
    };

    return (
        <>
            <div className="flex flex-col gap-8 mt-8 animate-fade-in animation-delay-200">
                <div className="flex flex-col bg-[#1a1a1a]/85 border border-white/10 rounded-2xl px-8 py-6 backdrop-blur-md">
                    
                    <div className="flex flex-row justify-between items-end mb-10 border-b border-accent/10 pb-6">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-white font-display font-bold text-3xl uppercase tracking-widest">
                                The Schedule
                            </h1>
                            <p className="text-white/60 text-sm uppercase tracking-widest mt-1">
                                Strategizing the ensemble architecture
                            </p>
                        </div>

                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-3 px-6 py-2.5 bg-secondary text-black font-display font-bold text-sm uppercase tracking-[0.2em] border border-secondary rounded-xl hover:bg-accent hover:text-white transition-all duration-300"
                        >
                            <CalendarPlus size={18} />
                            Plan Outfit
                        </button>
                    </div>

                    <div className="full-calendar-container transition-all">
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            allDaySlot={false}
                            events={events}
                            eventContent={renderEventContent}
                            dateClick={handleDateClick}
                            headerToolbar={{
                                start: 'prev next',
                                center: 'title',
                                end: 'today'
                            }}
                            height="auto"
                        />
                    </div>
                </div>
            </div>

            <SelectModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                lookbooks={lookbooks}
                onSelect={handleOutfitSelect}
            />

            {/* View & Remove Modal */}
            {lookbookToRemove && (
                <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setLookbookToRemove(null)} />
                    
                    <div className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl max-w-sm w-full shadow-2xl animate-fade-in2 overflow-hidden">
                        
                        {/* 5-Piece Image Preview Grid (Matching OutfitsCard style) */}
                        <div className="h-36 bg-accent/20 grid grid-cols-5 gap-0.5 p-0.5 border-b border-white/10">
                            {lookbookToRemove.clothes.slice(0, 5).map((item: any, i: number) => (
                                <div key={i} className="bg-[#242424] overflow-hidden">
                                    <img src={item.imagePath} alt="" className="w-full h-full object-cover opacity-80" />
                                </div>
                            ))}
                        </div>

                        <div className="p-8 text-center">
                            <h3 className="text-white font-display text-xl uppercase tracking-widest mb-1">
                                {lookbookToRemove.title}
                            </h3>
                            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-8">
                                Scheduled for {new Date(lookbookToRemove.plannedUsed).toLocaleDateString()}
                            </p>
                            
                            <div className="flex flex-col items-center gap-3">
    
                                {/* Toggle Button: Mark or Unmark as Worn */}
                                <button 
                                    onClick={handleToggleWorn}
                                    className={`w-full py-3 font-display font-bold text-sm uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                                        lookbookToRemove.lastUsed === lookbookToRemove.plannedUsed
                                            ? "bg-amber-500/40 text-amber-400 border border-amber-500/50 hover:bg-amber-500/30"
                                            : "bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-900/20"
                                    }`}
                                >
                                    <CheckCircle2 size={16} />
                                    {lookbookToRemove.lastUsed === lookbookToRemove.plannedUsed 
                                        ? "Unmark as Worn" 
                                        : "Mark as Worn"
                                    }
                                </button>

                                <button 
                                    onClick={() => setLookbookToRemove(null)}
                                    className="w-full py-3 bg-white text-black font-display font-bold text-sm uppercase tracking-widest rounded-xl hover:bg-secondary transition-all cursor-pointer"
                                >
                                    Close View
                                </button>

                                <button 
                                    onClick={handleConfirmRemove}
                                    className="w-full py-3 border border-red-600 bg-red-500 text-white font-display font-bold text-sm uppercase tracking-widest rounded-xl hover:bg-red-700 hover:border-red-700 cursor-pointer transition-all"
                                >
                                    Confirm Removal
                                </button>

                                <button 
                                    onClick={() => setLookbookToRemove(null)}
                                    className="w-fit py-3 text-white/40 font-display text-sm uppercase tracking-widest hover:text-white cursor-pointer transition-colors"
                                >
                                    Nevermind
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};