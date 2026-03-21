import React from 'react';

export default function MockMap({ location }: { location?: string }) {
    return (
        <div className="w-full h-full bg-slate-200 relative rounded-xl overflow-hidden shadow-inner group cursor-pointer">
            {location && (
                <div className="absolute top-4 left-4 bg-white p-2 rounded-lg shadow-md z-20 text-slate-700 font-medium">
                    Navigating to: {location}
                </div>
            )}
            <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Map_of_Chennai_Area.png/800px-Map_of_Chennai_Area.png')] bg-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-700"></div>

            {/* Elder Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-4 h-4 bg-emerald-500 rounded-full animate-ping absolute"></div>
                <div className="w-8 h-8 bg-emerald-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs relative z-10">
                    Dad
                </div>
            </div>

            {/* Volunteer Pin (Simulated movement) */}
            <div className="absolute top-1/3 left-1/3 flex flex-col items-center animate-bounce duration-[3000ms]">
                <div className="w-8 h-8 bg-amber-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs">
                    Vol
                </div>
            </div>

            <div className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-lg text-xs font-mono shadow-sm">
                Live Tracking Active
            </div>
        </div>
    );
}
