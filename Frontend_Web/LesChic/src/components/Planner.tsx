import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useOutletContext } from 'react-router-dom';
import { CalendarPlus, CheckCircle2, Circle, X } from 'lucide-react';
import { useState } from 'react';
import { SelectModal } from './PlannerComponents/SelectModal';
import { buildPath } from '../utils/buildPath';

export const Planner = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPlanningMode, setIsPlanningMode] = useState(false);
    const [selectedLookbook, setSelectedLookbook] = useState<any>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    
    const { lookbooks = [], fetchLookbooks } = useOutletContext<{ 
        lookbooks: any[], 
        fetchLookbooks?: () => void 
    }>();

    // UPDATED: This now handles the direct save from the Modal
    const handleOutfitSelect = async (lb: any, date: string) => {
        const lookbookId = lb._id || lb.id;
        if (!lookbookId) return;

        setIsUpdating(true);
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
                // Reset planning mode if it was on
                setIsPlanningMode(false);
                setSelectedLookbook(null);
            }
        } catch (err) {
            console.error("Failed to schedule outfit:", err);
        } finally {
            setIsUpdating(false);
        }
    };

    // KEEP THIS: This allows users to still click a date first, then pick an outfit
    const handleDateClick = (arg: any) => {
        // If user clicks a date, we open the modal and could 
        // technically pass 'arg.dateStr' to the modal if we wanted to pre-fill it.
        setIsModalOpen(true);
    };

    const events = lookbooks
        .filter(lb => lb.plannedUsed && lb.plannedUsed !== '1970-01-01T00:00:00.000Z')
        .map(lb => ({
            id: lb._id || lb.id, // Fixed: handle both ID types for events
            title: lb.title,
            start: lb.plannedUsed,
            allDay: true,
            extendedProps: { ...lb }
        }));

    // Custom Event Renderer (This is how we make it look "LesChic")
    const renderEventContent = (eventInfo: any) => {
        const lb = eventInfo.event.extendedProps;
        const isUsed = lb.lastUsed === lb.plannedUsed;

        return (
            <div className={`flex items-center justify-between w-full p-1 rounded-md transition-all ${
                // Swapped white background for primary background for better contrast
                isUsed 
                    ? "bg-green-600/20 text-green-800" 
                    : "bg-primary/10 text-primary"
            }`}>
                <span className="truncate text-[9px] uppercase tracking-tighter italic pl-1 font-medium">
                    {eventInfo.event.title}
                </span>
                {isUsed ? <CheckCircle2 size={12} /> : <Circle size={12} className="opacity-30" />}
            </div>
        );
    };

    
    return (

        <>
        
            <div className="flex flex-col gap-8 mt-8 animate-fade-in animation-delay-200">
                {/* The Main "Card" or Surface */}
                <div className="flex flex-col bg-[#1a1a1a]/85 border border-white/10 rounded-2xl px-8 py-6 backdrop-blur-md">
                    
                    {/* Header with Plan Button */}
                    <div className="flex flex-row justify-between items-end mb-10 border-b border-accent/10 pb-6">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-white font-display font-bold text-3xl uppercase tracking-widest">
                                The Schedule
                            </h1>
                            <p className="text-white/60 text-sm uppercase tracking-widest mt-1">
                                Strategizing the ensemble architecture
                            </p>
                        </div>

                        {/* New Action Button */}
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-3 px-6 py-2.5 bg-secondary text-black font-display font-bold text-sm uppercase tracking-[0.2em] border border-secondary rounded-xl hover:bg-accent hover:text-white transition-all duration-300"
                        >
                            <CalendarPlus size={18} />
                            Plan Outfit
                        </button>
                    </div>

                    {/* The Calendar Container */}
                    <div className={`full-calendar-container transition-all ${isPlanningMode ? "cursor-crosshair ring-2 ring-accent/50 rounded-lg" : ""}`}>
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            allDaySlot={false}
                            events={events}
                            eventContent={renderEventContent}
                            dateClick={handleDateClick}
                            headerToolbar={{
                                start: 'prev today next',
                                center: 'title',
                                end: 'dayGridMonth timeGridWeek timeGridDay'
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

        </>

    );
};