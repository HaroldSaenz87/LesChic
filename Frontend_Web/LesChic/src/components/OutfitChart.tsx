import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface OutfitDonutChartProps {
    planned: number;
    used: number;
}

export const OutfitChart = ({ planned, used }: OutfitDonutChartProps) => {

    // Calculate how many outfits haven't been worn yet
    const remaining = Math.max(planned - used, 0);

    // Data shape recharts expects -> two segments: used and remaining
    const data = [
        { name: "Used", value: used },
        { name: "Remaining", value: remaining },
    ];

    
    const COLORS = ["#C4873A", "#ffffff55"]; // secondary gold + subtle white

    // Avoid division by zero if planned is 0
    const percentage = planned > 0 ? Math.round((used / planned) * 100) : 0;

    return (
        <div className="flex flex-col gap-3">

            <div className="flex items-center gap-2">
                <p className="text-white font-bold text-md uppercase tracking-widest font-display">
                    This Month's Outfits
                </p>
            </div>

            {/* Recharts responsive wrapper -> fills parent width */}
            <div className="relative w-full h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={75}
                            paddingAngle={3}
                            dataKey="value"
                            strokeWidth={0}
                        >
                            {/* Map each segment to its color */}
                            {data.map((_, index) => (
                                <Cell key={index} fill={COLORS[index]} />
                            ))}
                        </Pie>

                        {/* Hover tooltip  */}
                        <Tooltip
                            wrapperStyle={{ zIndex: 50 }}
                            contentStyle={{
                                backgroundColor: "rgba(0,0,0,0.7)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                borderRadius: "12px",
                                fontSize: "12px",
                                color: "#ffffff",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Percentage center label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    
                    <p className="text-3xl font-bold text-white font-display">{percentage}%</p>
                    
                    <p className="text-white/70 text-[12px] uppercase tracking-widest">used</p>
                
                </div>
            
            </div>

            {/* legend */}
            <div className="flex justify-center gap-6">

                <div className="flex items-center gap-2">

                    <div className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                    
                    <p className="text-white/90 text-xs uppercase tracking-widest">{used} Used</p>
                
                </div>

                <div className="flex items-center gap-2">
                
                    <div className="w-2.5 h-2.5 rounded-full bg-white/90 animate-pulse" />
                
                    <p className="text-white/90 text-xs uppercase tracking-widest">{remaining} Remaining</p>
                
                </div>

            </div>

        </div>
    );
};