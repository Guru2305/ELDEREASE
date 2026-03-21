import { useMemo, useState } from 'react';
import {
    MessageSquare, Phone, CheckCircle, Clock, Search, Filter, User, AlertTriangle, Download,
    Reply, AlertOctagon, Shield
} from 'lucide-react';

// --- Types ---
type Ticket = {
    id: number;
    user: string;
    role: 'Elder' | 'Volunteer'; // Who raised it
    type: 'App Issue' | 'Payment' | 'General' | 'Emergency';
    subject: string;
    description: string;
    status: 'Open' | 'Resolved' | 'Pending';
    priority: 'High' | 'Medium' | 'Low';
    time: string;
    avatarColor: string;
};

// --- Mock Data ---
const TICKETS: Ticket[] = [
    {
        id: 1,
        user: 'Rukmini Amma',
        role: 'Elder',
        type: 'App Issue',
        subject: 'Voice command not working',
        description: "I am trying to use the voice feature to request medicine but it doesn't respond.",
        status: 'Open',
        priority: 'High',
        time: '10 mins ago',
        avatarColor: 'bg-rose-100 text-rose-700'
    },
    {
        id: 2,
        user: 'David Raj',
        role: 'Volunteer',
        type: 'Payment',
        subject: 'Payment not received for Task #1023',
        description: "Completed the grocery run yesterday but wallet balance hasn't updated.",
        status: 'Open',
        priority: 'Medium',
        time: '1 hour ago',
        avatarColor: 'bg-blue-100 text-blue-700'
    },
    {
        id: 3,
        user: 'Narayanan S',
        role: 'Elder',
        type: 'General',
        subject: 'How to change language?',
        description: "My app is in English, I want to switch to Tamil.",
        status: 'Resolved',
        priority: 'Low',
        time: 'Yesterday',
        avatarColor: 'bg-emerald-100 text-emerald-700'
    },
    {
        id: 4,
        user: 'Priya K',
        role: 'Volunteer',
        type: 'Emergency',
        subject: 'Incorrect Location on Map',
        description: "The location for Mrs. Lakshmi's house is showing 2km away from actual spot.",
        status: 'Pending',
        priority: 'High',
        time: '2 hours ago',
        avatarColor: 'bg-purple-100 text-purple-700'
    },
    {
        id: 5,
        user: 'Lakshmi Mom',
        role: 'Elder',
        type: 'General',
        subject: 'Volunteer was very kind',
        description: "Just wanted to appreciate Senthil for his help today.",
        status: 'Resolved',
        priority: 'Low',
        time: '2 days ago',
        avatarColor: 'bg-amber-100 text-amber-700'
    },
    {
        id: 6,
        user: 'Karthik R',
        role: 'Volunteer',
        type: 'App Issue',
        subject: 'Cannot upload document',
        description: "Upload button is disabled for my driving license.",
        status: 'Open',
        priority: 'Medium',
        time: '3 hours ago',
        avatarColor: 'bg-cyan-100 text-cyan-700'
    },
    {
        id: 7,
        user: 'System Bot',
        role: 'Volunteer',
        type: 'General',
        subject: 'Automated Flag: Late Arrival',
        description: "Volunteer marked arrived 30 mins after ETA.",
        status: 'Resolved',
        priority: 'Low',
        time: '1 week ago',
        avatarColor: 'bg-slate-100 text-slate-700'
    },
    {
        id: 8,
        user: 'Sarah J',
        role: 'Elder',
        type: 'Payment',
        subject: 'Refund Request',
        description: "I was charged twice for the last medical transport.",
        status: 'Open',
        priority: 'High',
        time: '5 hours ago',
        avatarColor: 'bg-indigo-100 text-indigo-700'
    }
];

export default function AdminHelpCenter() {
    const [tickets, setTickets] = useState(TICKETS);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | Ticket['status']>('All');

    // Stats calculation
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t.status === 'Open').length;
    const resolvedTickets = tickets.filter(t => t.status === 'Resolved').length;
    const highPriority = tickets.filter(t => t.priority === 'High' && t.status !== 'Resolved').length;

    const filteredTickets = useMemo(() => {
        return tickets.filter(t => {
            const matchesSearch = t.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.subject.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [tickets, searchTerm, statusFilter]);

    const handleResolve = (id: number) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'Resolved' } : t));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Help Center & Support</h1>
                    <p className="text-slate-500 text-sm">Manage support requests from elders and volunteers</p>
                </div>
                <button className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-medium shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2">
                    <Download className="w-4 h-4" /> Export Report
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg text-blue-600"><MessageSquare className="w-5 h-5" /></div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase">Total Tickets</p>
                        <p className="text-xl font-bold text-slate-800">{totalTickets}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="bg-amber-50 p-3 rounded-lg text-amber-600"><AlertOctagon className="w-5 h-5" /></div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase">Pending</p>
                        <p className="text-xl font-bold text-slate-800">{openTickets}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600"><CheckCircle className="w-5 h-5" /></div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase">Resolved</p>
                        <p className="text-xl font-bold text-slate-800">{resolvedTickets}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="bg-rose-50 p-3 rounded-lg text-rose-600"><AlertTriangle className="w-5 h-5" /></div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase">High Priority</p>
                        <p className="text-xl font-bold text-slate-800">{highPriority}</p>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search tickets by user, subject..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-slate-200 focus:ring-2 focus:ring-slate-200 outline-none text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-slate-400"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                        >
                            <option value="All">All Status</option>
                            <option value="Open">Open</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Pending">Pending</option>
                        </select>
                        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg border border-slate-200 bg-white">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Ticket List */}
                <div className="divide-y divide-slate-100">
                    {filteredTickets.length > 0 ? (
                        filteredTickets.map(ticket => (
                            <div key={ticket.id} className="p-4 hover:bg-slate-50 transition-colors group">
                                <div className="flex flex-col md:flex-row gap-4">
                                    {/* Avatar & User Info */}
                                    <div className="flex items-start gap-4 min-w-[200px]">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${ticket.avatarColor}`}>
                                            {ticket.user.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-800 text-sm">{ticket.user}</h4>
                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                {ticket.role === 'Elder' ? <User className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                                                {ticket.role}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Ticket Content */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border 
                                                ${ticket.type === 'Emergency' ? 'bg-red-50 text-red-600 border-red-100' :
                                                    ticket.type === 'Payment' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                        'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                                {ticket.type}
                                            </span>
                                            <span className="text-slate-300 text-xs">•</span>
                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {ticket.time}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-slate-800 mb-1">{ticket.subject}</h3>
                                        <p className="text-sm text-slate-600 line-clamp-1">{ticket.description}</p>
                                    </div>

                                    {/* Status & Actions */}
                                    <div className="flex flex-col items-end gap-2 justify-between min-w-[140px]">
                                        <div className="flex items-center gap-2">
                                            {ticket.priority === 'High' && (
                                                <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                                                    <AlertTriangle className="w-3 h-3" /> High Priority
                                                </span>
                                            )}
                                            <StatusBadge status={ticket.status} />
                                        </div>

                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {ticket.status !== 'Resolved' && (
                                                <button
                                                    onClick={() => handleResolve(ticket.id)}
                                                    className="px-3 py-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center gap-1 transition-colors"
                                                >
                                                    <CheckCircle className="w-3 h-3" /> Resolve
                                                </button>
                                            )}
                                            <button className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1 transition-colors">
                                                <Reply className="w-3 h-3" /> Reply
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-slate-800 font-bold">No tickets found</h3>
                            <p className="text-slate-500 text-sm">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: Ticket['status'] }) {
    const styles = {
        Open: "bg-amber-50 text-amber-700 border-amber-200",
        Resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
        Pending: "bg-slate-100 text-slate-600 border-slate-200"
    };

    const icons = {
        Open: <AlertOctagon className="w-3 h-3" />,
        Resolved: <CheckCircle className="w-3 h-3" />,
        Pending: <Clock className="w-3 h-3" />
    };

    return (
        <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${styles[status]}`}>
            {icons[status]} {status}
        </span>
    );
}
