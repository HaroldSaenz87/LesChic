import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useOutletContext } from 'react-router-dom';
import { CheckCircle2, Circle } from 'lucide-react';

export const Planner = () => {
    
    const { lookbooks = [] } = useOutletContext<{ 
        lookbooks: any[], 
        //fetchLookbooks: () => void 
    }>();

    // Transform Lookbooks into FullCalendar "Events"
    const events = lookbooks
        .filter(lb => lb.plannedUsed && lb.plannedUsed !== '1970-01-01T00:00:00.000Z')
        .map(lb => ({
            id: lb._id,
            title: lb.title,
            start: lb.plannedUsed,
            allDay: true,
            extendedProps: { ...lb } // Pass the whole object for custom rendering
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
        
        <div className="flex flex-col gap-8 mt-8 animate-fade-in animation-delay-200">
            {/* The Main "Card" or Surface */}
            <div className="flex flex-col bg-[#1a1a1a]/85 border border-white/10 rounded-2xl px-8 py-6 backdrop-blur-md">
                
                {/* Unified Header Section inside the background */}
                <div className="flex flex-col gap-1 mb-10 border-b border-accent/10 pb-6">
                    <h1 className="text-white font-display font-bold text-3xl uppercase tracking-widest">
                        The Schedule
                    </h1>
                    <p className="text-white/60 text-sm uppercase tracking-widest mt-1">
                        Strategizing the ensemble architecture
                    </p>
                </div>

                {/* The Calendar Container */}
                <div className="full-calendar-container">
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        eventContent={renderEventContent}
                        headerToolbar={{
                            left: 'prev next today',
                            center: 'title',
                            right: ''
                        }}
                        height="auto"
                    />
                </div>

            </div>
        </div>
    );
};