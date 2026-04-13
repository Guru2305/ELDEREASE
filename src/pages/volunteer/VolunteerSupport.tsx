import { 
    Mail, 
    Phone, 
    MessageCircle, 
    Book, 
    HelpCircle,
    ClipboardList,
    DollarSign,
    Bug,
    User,
    AlertTriangle,
    HelpCircle as QuestionIcon,
    Video,
    Shield,
    FileText
} from 'lucide-react';

export default function VolunteerSupport() {
    const supportCategories = [
        {
            title: 'Task Issues',
            description: 'Problems with active or completed tasks',
            icon: ClipboardList
        },
        {
            title: 'Payment Questions',
            description: 'Issues with earnings and payments',
            icon: DollarSign
        },
        {
            title: 'App Technical Issues',
            description: 'Bugs and technical problems',
            icon: Bug
        },
        {
            title: 'Account Issues',
            description: 'Profile and account management',
            icon: User
        },
        {
            title: 'Safety Concerns',
            description: 'Emergency and safety-related issues',
            icon: AlertTriangle
        },
        {
            title: 'General Questions',
            description: 'Other inquiries and suggestions',
            icon: QuestionIcon
        }
    ];

    const faqs = [
        {
            question: 'How do I get paid for completed tasks?',
            answer: 'Payments are processed within 24 hours of task completion. You can view your earnings in the Rewards/Earnings section and withdraw them to your registered bank account.'
        },
        {
            question: 'What should I do in an emergency situation?',
            answer: 'In case of emergency, immediately call 108 for medical assistance, 100 for police, or 101 for fire department. Also notify ElderAssist support through the emergency hotline 1800-ELDER-01.'
        },
        {
            question: 'How are task ratings calculated?',
            answer: 'Ratings are based on feedback from elders you help, task completion time, and adherence to guidelines. Maintain high ratings to get more task opportunities.'
        },
        {
            question: 'Can I decline a task after accepting it?',
            answer: 'While possible, frequent declines may affect your rating. If you must decline, provide a valid reason and do so as soon as possible.'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Support Options */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Contact Support</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Phone className="w-5 h-5 text-blue-600" />
                            <h3 className="font-semibold text-blue-800">Phone Support</h3>
                        </div>
                        <p className="text-sm text-blue-700 mb-2">24/7 Hotline</p>
                        <p className="font-bold text-blue-800">1800-ELDER-01</p>
                    </div>
                    
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <MessageCircle className="w-5 h-5 text-emerald-600" />
                            <h3 className="font-semibold text-emerald-800">Live Chat</h3>
                        </div>
                        <p className="text-sm text-emerald-700 mb-2">Available 9 AM - 9 PM</p>
                        <button className="font-medium text-emerald-800 hover:text-emerald-900">
                            Start Chat →
                        </button>
                    </div>
                    
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Mail className="w-5 h-5 text-purple-600" />
                            <h3 className="font-semibold text-purple-800">Email Support</h3>
                        </div>
                        <p className="text-sm text-purple-700 mb-2">Response within 24h</p>
                        <p className="font-medium text-purple-800">support@elderassist.com</p>
                    </div>
                </div>

                {/* Support Categories */}
                <h3 className="font-semibold text-slate-800 mb-3">Report an Issue</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {supportCategories.map((category, index) => (
                        <button
                            key={index}
                            className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-left"
                        >
                            <category.icon className="w-6 h-6 text-slate-600" />
                            <div className="flex-1">
                                <h4 className="font-medium text-slate-800">{category.title}</h4>
                                <p className="text-sm text-slate-600">{category.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <HelpCircle className="w-5 h-5 text-slate-600" />
                    <h2 className="text-lg font-semibold text-slate-800">Frequently Asked Questions</h2>
                </div>
                
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border border-slate-200 rounded-lg p-4">
                            <h3 className="font-medium text-slate-800 mb-2">{faq.question}</h3>
                            <p className="text-sm text-slate-600">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Resources */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Book className="w-5 h-5 text-slate-600" />
                    <h2 className="text-lg font-semibold text-slate-800">Help Resources</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Book className="w-8 h-8 text-blue-600" />
                        <div>
                            <h4 className="font-medium text-slate-800">Volunteer Handbook</h4>
                            <p className="text-sm text-slate-600">Complete guide to volunteering</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Video className="w-8 h-8 text-purple-600" />
                        <div>
                            <h4 className="font-medium text-slate-800">Video Tutorials</h4>
                            <p className="text-sm text-slate-600">Step-by-step video guides</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <FileText className="w-8 h-8 text-green-600" />
                        <div>
                            <h4 className="font-medium text-slate-800">Task Guidelines</h4>
                            <p className="text-sm text-slate-600">Best practices and protocols</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Shield className="w-8 h-8 text-red-600" />
                        <div>
                            <h4 className="font-medium text-slate-800">Safety Guidelines</h4>
                            <p className="text-sm text-slate-600">Important safety information</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
