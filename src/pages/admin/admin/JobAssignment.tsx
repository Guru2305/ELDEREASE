import React, { useState } from 'react';
import { MapPin, Smartphone, Users, Navigation, Filter, User, Clock, HeartPulse, Languages, Zap, ShieldAlert } from 'lucide-react';
import MockMap from '../../../components/shared/MockMap';

// Enriched Data Types
interface Job {
    id: number;
    type: string;
    elder: string;
    age: number;
    language: string;
    condition: string;
    loc: string;
    zone: string;
    time: string;
    status: 'Unassigned' | 'In Progress' | 'Assigned'; // Added 'Assigned'
    priority: 'high' | 'normal' | 'low';
    volunteer?: string;
}

interface Volunteer {
    id: number;
    name: string;
    zone: string;
    distance: string;
    status: 'Available' | 'Busy';
    rating: number;
}

// Mock Data
const initialJobs: Job[] = [
    {
        id: 101, type: 'SOS', elder: 'Kannan', age: 78, language: 'Tamil', condition: 'Diabetic, Mobility Issue',
        loc: 'Anna Nagar West', zone: 'Anna Nagar', time: '2 mins ago', status: 'Unassigned', priority: 'high'
    },
    {
        id: 102, type: 'Medicine', elder: 'Lakshmi', age: 65, language: 'English', condition: 'Hypertension',
        loc: 'T. Nagar North', zone: 'T. Nagar', time: '15 mins ago', status: 'Unassigned', priority: 'normal'
    },
    {
        id: 103, type: 'Ride', elder: 'Ramanathan', age: 82, language: 'Tamil', condition: 'Visual Impairment',
        loc: 'Adyar', zone: 'Adyar', time: '30 mins ago', status: 'In Progress', volunteer: 'Senthil', priority: 'normal'
    },
    {
        id: 104, type: 'Groceries', elder: 'Saraswathi', age: 70, language: 'Telugu', condition: 'Arthritis',
        loc: 'Velachery', zone: 'Velachery', time: '45 mins ago', status: 'Unassigned', priority: 'low'
    },
];

const mockVolunteers: Volunteer[] = [
    { id: 1, name: 'Senthil', zone: 'Anna Nagar', distance: '0.5 km', status: 'Available', rating: 4.8 },
    { id: 2, name: 'Divya', zone: 'T. Nagar', distance: '1.2 km', status: 'Available', rating: 4.9 },
    { id: 3, name: 'Arun', zone: 'Anna Nagar', distance: '2.0 km', status: 'Busy', rating: 4.5 },
    { id: 4, name: 'Priya', zone: 'Velachery', distance: '0.8 km', status: 'Available', rating: 5.0 },
    { id: 5, name: 'Karthik', zone: 'Adyar', distance: '1.5 km', status: 'Available', rating: 4.7 },
];

export default function JobAssignment() {
    const [jobs, setJobs] = useState<Job[]>(initialJobs);
    const [filterType, setFilterType] = useState('All');
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

    const filteredJobs = filterType === 'All'
        ? jobs
        : jobs.filter(job => job.type === filterType || job.priority === filterType.toLowerCase());

    const getNearbyVolunteers = (zone: string) => {
        return mockVolunteers.filter(v => v.zone === zone && v.status === 'Available');
    };

    const getJobById = (id: number | null) => jobs.find(j => j.id === id);

    const handleAutoAssign = (jobId: number, zone: string) => {
        const nearby = getNearbyVolunteers(zone);
        if (nearby.length === 0) return;

        // Simulate AI finding nearest (sort by distance string for mockup)
        const bestVolunteer = nearby.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))[0];

        setJobs(prev => prev.map(job => {
            if (job.id === jobId) {
                return { ...job, status: 'Assigned', volunteer: bestVolunteer.name };
            }
            return job;
        }));
    };

    const activeJob = getJobById(selectedJobId);

    // Logic: If job selected, show zone volunteers sorted by distance. 
    // If no job, show ALL volunteers (simulated roaming)
    const mapVolunteers = activeJob
        ? getNearbyVolunteers(activeJob.zone).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
        : mockVolunteers.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Live Job Dispatch</h1>
                    <p className="text-slate-500 text-sm">Track elders & assign nearby volunteers in real time</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex gap-2 mr-4">
                        <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">Anna Nagar: 3 Vol</span>
                        <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">T. Nagar: 2 Vol</span>
                    </div>

                    <div className="flex gap-2">
                        <span className="px-3 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700 font-medium flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 12 Online
                        </span>
                        <span className="px-3 py-1 text-xs rounded-full bg-amber-100 text-amber-700 font-medium flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span> 5 Busy
                        </span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {['All', 'SOS', 'Medicine', 'Ride', 'Groceries', 'High'].map(filter => (
                    <button
                        key={filter}
                        onClick={() => setFilterType(filter)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2
              ${filterType === filter
                                ? 'bg-slate-800 text-white shadow-md'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                    >
                        {filter === 'SOS' && <ShieldAlert className="w-3 h-3" />}
                        {filter}
                    </button>
                ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(100vh-220px)] min-h-[600px]">

                {/* Map Section */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative flex flex-col">
                    <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Navigation className="w-4 h-4 text-blue-600" />
                        Live Fleet Map
                    </div>

                    {/* Dynamic Mock Map */}
                    <div className="flex-1 bg-slate-100 relative">
                        <MockMap
                            jobs={jobs}
                            activeJob={activeJob}
                            volunteers={mapVolunteers}
                            showETA={selectedJobId !== null && activeJob?.status === 'Unassigned'}
                        />
                    </div>
                </div>

                {/* Dispatch Panel */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-500" />
                            Request Queue ({filteredJobs.length})
                        </h3>
                        <button className="text-slate-400 hover:text-slate-600">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {filteredJobs.map(job => {
                            const nearby = getNearbyVolunteers(job.zone).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
                            const isSelected = selectedJobId === job.id;
                            const isSOS = job.type === 'SOS';

                            return (
                                <div
                                    key={job.id}
                                    onClick={() => setSelectedJobId(isSelected ? null : job.id)}
                                    className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer group
                    ${isSelected ? 'border-blue-500 ring-4 ring-blue-50/50 bg-blue-50/10' :
                                            isSOS ? 'border-red-500 bg-red-50 shadow-red-100 shadow-lg animate-pulse' :
                                                job.priority === 'high' ? 'border-red-100 bg-red-50/30' :
                                                    'border-slate-200 bg-white hover:border-slate-300 shadow-sm hover:shadow-md'
                                        }`}
                                >
                                    {/* Job Header */}
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide flex items-center gap-1
                      ${isSOS ? 'bg-red-600 text-white animate-bounce' :
                                                job.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {isSOS && <ShieldAlert className="w-3 h-3" />}
                                            {job.type}
                                        </span>
                                        <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {job.time}
                                        </span>
                                    </div>

                                    {/* Elder Info */}
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-lg shrink-0 overflow-hidden relative">
                                            {/* Placeholder Avatar */}
                                            <div className="absolute inset-0 bg-slate-300"></div>
                                            <span className="relative z-10">{job.elder.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">{job.elder}</h4>
                                            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
                                                <span className="flex items-center gap-1" title="Age"><User className="w-3 h-3" /> {job.age} yrs</span>
                                                <span className="flex items-center gap-1" title="Language"><Languages className="w-3 h-3" /> {job.language}</span>
                                            </div>
                                            <div className="mt-1 flex items-center gap-1 text-xs text-red-500 font-medium">
                                                <HeartPulse className="w-3 h-3" /> {job.condition}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-start gap-2 text-sm text-slate-600 bg-white/50 p-2 rounded-lg border border-slate-100 mb-3">
                                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                        <span>{job.loc}</span>
                                    </div>

                                    {/* Assignment Section */}
                                    {job.status === 'Unassigned' ? (
                                        <div className="mt-3">
                                            {isSelected ? (
                                                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">

                                                    {/* Auto Assign Button */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleAutoAssign(job.id, job.zone);
                                                        }}
                                                        className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-bold shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                                                    >
                                                        <Zap className="w-4 h-4 fill-yellow-400 text-yellow-100" />
                                                        Assign Nearest Volunteer (AI)
                                                    </button>

                                                    <div>
                                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Recommended</p>
                                                        {nearby.length > 0 ? nearby.map(vol => (
                                                            <div key={vol.id} className="flex justify-between items-center p-2 bg-white rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 cursor-pointer transition-colors group/vol">
                                                                <div>
                                                                    <p className="font-medium text-slate-800 text-sm">{vol.name}</p>
                                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                                        <span className="text-emerald-600 font-medium">{vol.distance} away</span>
                                                                        <span>•</span>
                                                                        <span>⭐ {vol.rating}</span>
                                                                    </div>
                                                                </div>
                                                                <button className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-md opacity-0 group-hover/vol:opacity-100 transition-opacity">
                                                                    Assign
                                                                </button>
                                                            </div>
                                                        )) : (
                                                            <p className="text-xs text-slate-400 italic">No volunteers nearby.</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <button className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm shadow-blue-200 transition-all flex items-center justify-center gap-2">
                                                    <Smartphone className="w-4 h-4" />
                                                    Assign Volunteer
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="mt-3 flex items-center gap-2 text-sm font-medium text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                                            <div className="relative">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 absolute inset-0 animate-ping opacity-75"></div>
                                            </div>
                                            Assigned to {job.volunteer}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {filteredJobs.length === 0 && (
                            <div className="text-center py-10 text-slate-400">
                                <p>No jobs found for this filter.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
