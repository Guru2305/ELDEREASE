import { useMemo, useState } from 'react';
import {
    Search, MapPin, Phone, Star, Filter, Shield,
    CheckCircle, Clock, AlertTriangle, User, Grid, List, X, Mail, Calendar,
    FileText, ChevronRight, UserPlus, AlertOctagon, XCircle, CheckSquare, Users
} from 'lucide-react';

// --- Types ---
type Volunteer = {
    id: number;
    name: string;
    role: string; // e.g., "Senior Caregiver"
    phone: string;
    email: string;
    service: string;
    status: 'Available' | 'Busy' | 'Offline';
    location: string;
    workingAt: string;
    rating: number;
    tasksCompleted: number;
    verified: 'Verified' | 'Pending';
    skills: string[];
    joinedDate: string;
    lastSeen: string;
    avatarColor: string;
    bio: string;
    documents: { name: string; status: 'Verified' | 'Pending' }[];
};

type Issue = {
    id: number;
    volunteerName: string;
    volunteerId: number;
    type: 'Behavior' | 'Missed Task' | 'Policy Violation' | 'Other';
    severity: 'Low' | 'Medium' | 'Critical';
    description: string;
    reportedBy: string;
    date: string;
    status: 'Open' | 'Resolved';
};

// --- Mock Data ---
const ISSUES: Issue[] = [
    {
        id: 1,
        volunteerName: "Arun Vijay",
        volunteerId: 3,
        type: "Missed Task",
        severity: "Medium",
        description: "Failed to show up for a scheduled grocery run for Mrs. Lakshmi.",
        reportedBy: "Lakshmi (Elder)",
        date: "2 days ago",
        status: "Open"
    },
    {
        id: 2,
        volunteerName: "Senthil Kumar",
        volunteerId: 1,
        type: "Policy Violation",
        severity: "Low",
        description: "Did not wear the volunteer ID badge during the visit.",
        reportedBy: "System Audit",
        date: "5 days ago",
        status: "Resolved"
    },
    {
        id: 3,
        volunteerName: "Karthik R",
        volunteerId: 5,
        type: "Behavior",
        severity: "Critical",
        description: "Rude behavior reported by the elder's family member during a call.",
        reportedBy: "reenish (Family)",
        date: "1 week ago",
        status: "Open"
    },
    {
        id: 4,
        volunteerName: "Divya Ramesh",
        volunteerId: 2,
        type: "Other",
        severity: "Low",
        description: "Requested last-minute cancellation for a non-emergency reason.",
        reportedBy: "Dispatch Team",
        date: "2 weeks ago",
        status: "Resolved"
    },
    {
        id: 5,
        volunteerName: "Manoj K",
        volunteerId: 6,
        type: "Missed Task",
        severity: "Medium",
        description: "Arrived 45 minutes late for a medical appointment pickup.",
        reportedBy: "Kannan (Elder)",
        date: "3 weeks ago",
        status: "Resolved"
    }
];

// --- Mock Data ---
const VOLUNTEERS: Volunteer[] = [
    {
        id: 1,
        name: "Senthil Kumar",
        role: "Medical Assistant",
        phone: "+91 98765 43210",
        email: "senthil.k@example.com",
        service: "Transport",
        status: "Available",
        location: "Anna Nagar",
        workingAt: "TCS, Siruseri",
        rating: 4.9,
        tasksCompleted: 45,
        verified: "Verified",
        skills: ["Two-Wheeler", "First Aid", "Tamil", "English"],
        joinedDate: "Jan 15, 2024",
        lastSeen: "2 mins ago",
        avatarColor: "bg-emerald-100 text-emerald-700",
        bio: "Passionate about helping elders with transportation and medical visits. I have a two-wheeler and free on weekends.",
        documents: [{ name: "Driving License", status: "Verified" }, { name: "ID Proof", status: "Verified" }]
    },
    {
        id: 2,
        name: "Divya Ramesh",
        role: "Registered Nurse",
        phone: "+91 98765 12345",
        email: "divya.r@example.com",
        service: "Medical Aid",
        status: "Busy",
        location: "Adyar",
        workingAt: "Apollo Hospitals",
        rating: 4.9,
        tasksCompleted: 82, // Increased
        verified: "Verified",
        skills: ["Medical", "CPR", "BP Check", "Diabetes Care"],
        joinedDate: "Feb 10, 2024",
        lastSeen: "Online",
        avatarColor: "bg-blue-100 text-blue-700",
        bio: "Professional nurse willing to help with basic medical needs and checkups nearby Adyar.",
        documents: [{ name: "Nursing License", status: "Verified" }, { name: "Aadhaar", status: "Verified" }]
    },
    {
        id: 3,
        name: "Arun Vijay",
        role: "General Volunteer",
        phone: "+91 98765 67890",
        email: "arun.v@example.com",
        service: "Groceries",
        status: "Offline",
        location: "T. Nagar",
        workingAt: "Freelancer",
        rating: 4.5,
        tasksCompleted: 15,
        verified: "Pending",
        skills: ["Delivery", "Shopping"],
        joinedDate: "Mar 05, 2024",
        lastSeen: "1 hr ago",
        avatarColor: "bg-amber-100 text-amber-700",
        bio: "Can help with grocery shopping and errands in T. Nagar area.",
        documents: [{ name: "ID Proof", status: "Pending" }]
    },
    {
        id: 4,
        name: "Priya Krishna",
        role: "Companion",
        phone: "+91 98765 98765",
        email: "priya.k@example.com",
        service: "Companionship",
        status: "Available",
        location: "Velachery",
        workingAt: "Tech Mahindra",
        rating: 5.0,
        tasksCompleted: 28,
        verified: "Verified",
        skills: ["Listening", "Reading", "Chess", "Singing"],
        joinedDate: "Jan 20, 2024",
        lastSeen: "5 mins ago",
        avatarColor: "bg-purple-100 text-purple-700",
        bio: "Love spending time with elders, reading books, and playing board games. I am a patient listener.",
        documents: [{ name: "ID Proof", status: "Verified" }]
    },
    {
        id: 5,
        name: "Karthik Raja",
        role: "Emergency Responder",
        phone: "+91 98765 54321",
        email: "karthik.r@example.com",
        service: "Emergency",
        status: "Available",
        location: "Mylapore",
        workingAt: "Student, IIT Madras",
        rating: 4.8,
        tasksCompleted: 12,
        verified: "Verified",
        skills: ["First Aid", "CPR", "Running", "Swimming"],
        joinedDate: "Apr 01, 2024",
        lastSeen: "Online",
        avatarColor: "bg-red-100 text-red-700",
        bio: "Young and active student ready to help in emergency situations. Experienced in scout training.",
        documents: [{ name: "Student ID", status: "Verified" }]
    },
    {
        id: 6,
        name: "Lakshmi Narayanan",
        role: "Retired Teacher",
        phone: "+91 91234 56789",
        email: "lakshmi.n@example.com",
        service: "Companionship",
        status: "Available",
        location: "Besant Nagar",
        workingAt: "Retired",
        rating: 4.9,
        tasksCompleted: 60,
        verified: "Verified",
        skills: ["Teaching", "Reading", "Counseling"],
        joinedDate: "Dec 12, 2023",
        lastSeen: "10 mins ago",
        avatarColor: "bg-indigo-100 text-indigo-700",
        bio: "I love teaching and reading stories. Happy to spend time with others who need company.",
        documents: [{ name: "Aadhaar", status: "Verified" }]
    },
    {
        id: 7,
        name: "Mohamed Riaz",
        role: "Driver",
        phone: "+91 99887 76655",
        email: "riaz.m@example.com",
        service: "Transport",
        status: "Busy",
        location: "Triplicane",
        workingAt: "Uber Driver",
        rating: 4.7,
        tasksCompleted: 110,
        verified: "Verified",
        skills: ["Driving", "Car Maintenance", "Navigation"],
        joinedDate: "Nov 05, 2023",
        lastSeen: "Just now",
        avatarColor: "bg-cyan-100 text-cyan-700",
        bio: "Professional driver with own car. Available for hospital visits and emergency transport.",
        documents: [{ name: "Driving License", status: "Verified" }, { name: "RC Book", status: "Verified" }]
    },
    {
        id: 8,
        name: "Sarah Joseph",
        role: "Physiotherapist",
        phone: "+91 90000 11111",
        email: "sarah.j@example.com",
        service: "Medical Aid",
        status: "Offline",
        location: "Nungambakkam",
        workingAt: "Ortho Clinic",
        rating: 5.0,
        tasksCompleted: 40,
        verified: "Verified",
        skills: ["Physiotherapy", "Massage", "Rehab"],
        joinedDate: "Feb 28, 2024",
        lastSeen: "3 hrs ago",
        avatarColor: "bg-pink-100 text-pink-700",
        bio: "Certified physiotherapist. I can help with mobility exercises and post-surgery recovery.",
        documents: [{ name: "Degree Cert", status: "Verified" }]
    },
    {
        id: 9,
        name: "Prem Kumar",
        role: "Tech Support",
        phone: "+91 95555 44444",
        email: "prem.k@example.com",
        service: "Technology",
        status: "Available",
        location: "OMR",
        workingAt: "Infosys",
        rating: 4.6,
        tasksCompleted: 22,
        verified: "Pending",
        skills: ["Smartphone Help", "Computers", "Online Banking"],
        joinedDate: "Mar 15, 2024",
        lastSeen: "Online",
        avatarColor: "bg-slate-100 text-slate-700",
        bio: "I can help elders learn how to use smartphones, video calls, and digital payments.",
        documents: [{ name: "ID Proof", status: "Pending" }]
    },
    {
        id: 10,
        name: "Anitha Paul",
        role: "Home Maker",
        phone: "+91 97777 88888",
        email: "anitha.p@example.com",
        service: "Cooking",
        status: "Available",
        location: "Kodambakkam",
        workingAt: "Home Maker",
        rating: 4.8,
        tasksCompleted: 55,
        verified: "Verified",
        skills: ["Cooking", "Cleaning", "Gardening"],
        joinedDate: "Jan 05, 2024",
        lastSeen: "45 mins ago",
        avatarColor: "bg-orange-100 text-orange-700",
        bio: "I enjoy cooking healthy meals and gardening. Can prepare home-cooked food.",
        documents: [{ name: "Aadhaar", status: "Verified" }]
    },
    {
        id: 11,
        name: "Rajesh Kannan",
        role: "Pharmacy Runner",
        phone: "+91 92222 33333",
        email: "rajesh.k@example.com",
        service: "Medicine",
        status: "Available",
        location: "Vadapalani",
        workingAt: "College Student",
        rating: 4.7,
        tasksCompleted: 18,
        verified: "Verified",
        skills: ["Two-Wheeler", "Quick Delivery"],
        joinedDate: "Apr 10, 2024",
        lastSeen: "Online",
        avatarColor: "bg-lime-100 text-lime-700",
        bio: "Student looking to earn karma points. Can pick up medicines and small items.",
        documents: [{ name: "Student ID", status: "Verified" }]
    }
];

// --- Components ---

export default function VolunteerManagement() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'volunteers' | 'approvals' | 'issues'>('volunteers');
    const [issues, setIssues] = useState(ISSUES);

    // Calculate stats dynamic
    const totalVolunteers = VOLUNTEERS.length;
    const activeNow = VOLUNTEERS.filter(v => v.status === 'Available').length;
    const pendingVerification = VOLUNTEERS.filter(v => v.verified === 'Pending').length;
    const openIssues = issues.filter(i => i.status === 'Open').length;

    const filteredVolunteers = useMemo(() => {
        return VOLUNTEERS.filter(v =>
            v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const handleResolveIssue = (id: number) => {
        setIssues(prev => prev.map(issue => issue.id === id ? { ...issue, status: 'Resolved' } : issue));
    };

    return (
        <div className="space-y-6">
            {/* Header & Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Volunteer Management</h1>
                    <p className="text-slate-500 text-sm">Manage your fleet, approvals, and reports</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl font-medium shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
                >
                    <UserPlus className="w-4 h-4" />
                    Add Volunteer
                </button>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg text-blue-600"><Users className="w-5 h-5" /></div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase">Total Volunteers</p>
                        <p className="text-xl font-bold text-slate-800">{totalVolunteers}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600"><CheckCircle className="w-5 h-5" /></div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase">Active Now</p>
                        <p className="text-xl font-bold text-slate-800">{activeNow}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="bg-amber-50 p-3 rounded-lg text-amber-600"><Shield className="w-5 h-5" /></div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase">Pending Review</p>
                        <p className="text-xl font-bold text-slate-800">{pendingVerification}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="bg-red-50 p-3 rounded-lg text-red-600"><AlertOctagon className="w-5 h-5" /></div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase">Reported Issues</p>
                        <p className="text-xl font-bold text-slate-800">{openIssues}</p>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-slate-200">
                <div className="flex gap-6">
                    <button
                        onClick={() => setActiveTab('volunteers')}
                        className={`pb-3 text-sm font-semibold transition-colors relative ${activeTab === 'volunteers' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Active Volunteers
                        {activeTab === 'volunteers' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-t-full"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('approvals')}
                        className={`pb-3 text-sm font-semibold transition-colors relative flex items-center gap-2 ${activeTab === 'approvals' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Pending Approvals
                        {pendingVerification > 0 && <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full">{pendingVerification}</span>}
                        {activeTab === 'approvals' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-t-full"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('issues')}
                        className={`pb-3 text-sm font-semibold transition-colors relative flex items-center gap-2 ${activeTab === 'issues' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Reported Issues
                        {openIssues > 0 && <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full">{openIssues}</span>}
                        {activeTab === 'issues' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-t-full"></div>}
                    </button>
                </div>
            </div>

            {/* TAB CONTENT: ACTIVE VOLUNTEERS */}
            {activeTab === 'volunteers' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Controls */}
                    <div className="flex flex-col md:flex-row justify-between gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search volunteers by name, skill, or location..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 border-none focus:ring-2 focus:ring-slate-200 outline-none text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                            <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-medium transition-colors border border-slate-200">
                                <Filter className="w-4 h-4" /> Filter
                            </button>
                        </div>
                    </div>

                    {/* Volunteer List/Grid View */}
                    {/* Reusing existing logic but wrapped */}
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredVolunteers.map(volunteer => (
                                <VolunteerCard key={volunteer.id} data={volunteer} onClick={() => setSelectedVolunteer(volunteer)} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <VolunteerTable data={filteredVolunteers} onClick={setSelectedVolunteer} />
                        </div>
                    )}
                </div>
            )}

            {/* TAB CONTENT: PENDING APPROVALS */}
            {activeTab === 'approvals' && (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
                        <Shield className="w-8 h-8 text-amber-500" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Pending Verification</h3>
                    <p className="text-slate-500 text-sm max-w-sm text-center mt-2">
                        There are {pendingVerification} volunteers waiting for document verification. Review their documents to approve them.
                    </p>
                    <button className="mt-6 px-5 py-2 bg-slate-900 text-white rounded-lg font-medium shadow hover:bg-slate-800">
                        Review Documents
                    </button>
                </div>
            )}

            {/* TAB CONTENT: REPORTED ISSUES */}
            {activeTab === 'issues' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {issues.map(issue => (
                        <div key={issue.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 
                                    ${issue.severity === 'Critical' ? 'bg-red-50 text-red-600' :
                                        issue.severity === 'Medium' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                                    <AlertOctagon className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-slate-800">{issue.type}</h3>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border 
                                            ${issue.severity === 'Critical' ? 'bg-red-50 text-red-700 border-red-100' :
                                                issue.severity === 'Medium' ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                            {issue.severity}
                                        </span>
                                        {issue.status === 'Resolved' && (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                                <CheckCircle className="w-3 h-3" /> Resolved
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-600 text-sm mb-2">{issue.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-slate-400">
                                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> Reported by {issue.reportedBy}</span>
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {issue.date}</span>
                                        <span className="font-medium text-slate-600">Volunteer: {issue.volunteerName}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 md:self-center self-end">
                                {issue.status === 'Open' ? (
                                    <>
                                        <button className="px-3 py-1.5 text-xs font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-lg flex items-center gap-1">
                                            Contact
                                        </button>
                                        <button className="px-3 py-1.5 text-xs font-bold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 rounded-lg flex items-center gap-1">
                                            <XCircle className="w-3 h-3" /> Suspend
                                        </button>
                                        <button
                                            onClick={() => handleResolveIssue(issue.id)}
                                            className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1 shadow-sm"
                                        >
                                            <CheckSquare className="w-3 h-3" /> Resolve
                                        </button>
                                    </>
                                ) : (
                                    <button disabled className="px-4 py-2 text-xs font-bold text-slate-400 bg-slate-100 rounded-lg cursor-not-allowed">
                                        Action Taken
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* Modals */}
            {selectedVolunteer && (
                <VolunteerDetailsModal volunteer={selectedVolunteer} onClose={() => setSelectedVolunteer(null)} />
            )}

            {isAddModalOpen && (
                <AddVolunteerModal onClose={() => setIsAddModalOpen(false)} />
            )}

        </div>
    );
}

// --- Sub-Components ---


function VolunteerCard({ data, onClick }: { data: Volunteer; onClick: () => void }) {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all cursor-pointer group flex flex-col overflow-hidden"
        >
            <div className="p-5 flex items-start gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shadow-inner ${data.avatarColor}`}>
                    {data.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-slate-800 truncate group-hover:text-emerald-700 transition-colors">{data.name}</h3>
                            <p className="text-sm text-slate-500 truncate">{data.role}</p>
                        </div>
                        {data.verified === 'Verified' && <Shield className="w-4 h-4 text-emerald-500 fill-emerald-100" />}
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                        <StatusBadge status={data.status} />
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {data.rating}
                        </span>
                    </div>
                </div>
            </div>

            <div className="px-5 pb-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{data.location}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                    {data.skills.slice(0, 3).map(skill => (
                        <span key={skill} className="text-[10px] uppercase font-semibold px-2 py-1 rounded border border-slate-200 text-slate-500">
                            {skill}
                        </span>
                    ))}
                    {data.skills.length > 3 && <span className="text-[10px] text-slate-400 py-1">+{data.skills.length - 3}</span>}
                </div>
            </div>

            <div className="mt-auto px-5 py-3 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
                <span className="text-xs text-slate-500">
                    Working at <span className="font-medium text-slate-700">{data.workingAt}</span>
                </span>
                <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1 group/btn">
                    Details <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
            </div>
        </div>
    );
}

function VolunteerTable({ data, onClick }: { data: Volunteer[]; onClick: (v: Volunteer) => void }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Volunteer</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Status</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Location</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Rating</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Joined</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((volunteer) => (
                            <tr key={volunteer.id} onClick={() => onClick(volunteer)} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${volunteer.avatarColor}`}>
                                            {volunteer.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-slate-800">{volunteer.name}</h3>
                                            <p className="text-xs text-slate-500">{volunteer.role}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4"><StatusBadge status={volunteer.status} /></td>
                                <td className="px-6 py-4 text-sm text-slate-600">{volunteer.location}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1 text-sm font-medium text-slate-700">
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {volunteer.rating}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">{volunteer.joinedDate}</td>
                                <td className="px-6 py-4">
                                    <button className="text-slate-400 group-hover:text-emerald-600 transition-colors p-1 rounded hover:bg-emerald-50">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        Available: "bg-emerald-100 text-emerald-700 border-emerald-200",
        Busy: "bg-amber-100 text-amber-700 border-amber-200",
        Offline: "bg-slate-100 text-slate-600 border-slate-200"
    };

    const icons: any = {
        Available: <CheckCircle className="w-3 h-3" />,
        Busy: <Clock className="w-3 h-3" />,
        Offline: <AlertTriangle className="w-3 h-3" />
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
            {icons[status]} {status}
        </span>
    );
}

function VolunteerDetailsModal({ volunteer, onClose }: { volunteer: Volunteer; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-end sm:justify-center bg-black/20 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="relative h-32 bg-gradient-to-r from-emerald-600 to-teal-700">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="absolute -bottom-12 left-8 flex items-end">
                        <div className={`w-24 h-24 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold ${volunteer.avatarColor}`}>
                            {volunteer.name.charAt(0)}
                        </div>
                    </div>
                </div>

                <div className="pt-16 pb-6 px-8 flex-1 overflow-y-auto">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold text-slate-800">{volunteer.name}</h2>
                                {volunteer.verified === 'Verified' && <Shield className="w-5 h-5 text-emerald-500 fill-emerald-100" />}
                            </div>
                            <p className="text-slate-500 font-medium">{volunteer.role} • {volunteer.location}</p>
                        </div>
                        <div className="flex gap-2">
                            <a href={`tel:${volunteer.phone}`} className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:text-emerald-600 hover:border-emerald-200 transition-colors">
                                <Phone className="w-5 h-5" />
                            </a>
                            <a href={`mailto:${volunteer.email}`} className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:text-emerald-600 hover:border-emerald-200 transition-colors">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Rating</p>
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                                <span className="text-xl font-bold text-slate-800">{volunteer.rating}</span>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Tasks Completed</p>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                                <span className="text-xl font-bold text-slate-800">{volunteer.tasksCompleted}</span>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Status</p>
                            <StatusBadge status={volunteer.status} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <section>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">About</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">{volunteer.bio}</p>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <section>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Skills & Services</h3>
                                <div className="flex flex-wrap gap-2">
                                    {volunteer.skills.map(skill => (
                                        <span key={skill} className="bg-white border border-slate-200 px-3 py-1 rounded-full text-sm text-slate-600 shadow-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Documents</h3>
                                <ul className="space-y-2">
                                    {volunteer.documents.map((doc, idx) => (
                                        <li key={idx} className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-100">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm text-slate-700">{doc.name}</span>
                                            </div>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${doc.status === 'Verified' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                                                {doc.status}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                    <button onClick={onClose} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-medium">Close</button>
                    <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium shadow-sm">Assign Task</button>
                </div>
            </div>
        </div>
    );
}

function AddVolunteerModal({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-800">Add New Volunteer</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600">First Name</label>
                            <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="John" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600">Last Name</label>
                            <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Doe" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Email Address</label>
                        <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="john@example.com" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Phone Number</label>
                        <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="+91 98765 43210" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Role / Designation</label>
                        <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                            <option>General Volunteer</option>
                            <option>Medical Assistant</option>
                            <option>Driver</option>
                            <option>Caregiver</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Location</label>
                        <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Anna Nagar" />
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                    <button onClick={onClose} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-medium text-sm">Cancel</button>
                    <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm shadow-sm">Save Volunteer</button>
                </div>
            </div>
        </div>
    )
}
