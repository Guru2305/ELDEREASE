import { TrendingUp, DollarSign, Award, Target, Calendar } from 'lucide-react';

export default function VolunteerEarnings() {
    const earningsData = [
        {
            month: 'January 2024',
            tasks: 18,
            earnings: 850,
            bonus: 100,
            total: 950
        },
        {
            month: 'February 2024',
            tasks: 24,
            earnings: 1200,
            bonus: 150,
            total: 1350
        }
    ];

    const recentTransactions = [
        {
            id: 1,
            type: 'task',
            description: 'Medicine Delivery',
            amount: 50,
            date: '2024-02-14',
            status: 'completed'
        },
        {
            id: 2,
            type: 'bonus',
            description: 'Weekly Bonus - 10+ tasks',
            amount: 100,
            date: '2024-02-13',
            status: 'completed'
        },
        {
            id: 3,
            type: 'task',
            description: 'Grocery Run',
            amount: 80,
            date: '2024-02-12',
            status: 'completed'
        },
        {
            id: 4,
            type: 'task',
            description: 'Emergency Assistance',
            amount: 0,
            date: '2024-02-11',
            status: 'completed'
        }
    ];

    const totalEarnings = earningsData.reduce((sum, month) => sum + month.total, 0);
    const totalTasks = earningsData.reduce((sum, month) => sum + month.tasks, 0);

    return (
        <div className="space-y-6">
            {/* Earnings Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 mb-1">Total Earnings</p>
                            <p className="text-2xl font-bold text-slate-800">₹{totalEarnings}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-emerald-600" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 mb-1">Tasks Completed</p>
                            <p className="text-2xl font-bold text-slate-800">{totalTasks}</p>
                        </div>
                        <Target className="w-8 h-8 text-blue-600" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 mb-1">Avg per Task</p>
                            <p className="text-2xl font-bold text-slate-800">₹{Math.round(totalEarnings / totalTasks)}</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-purple-600" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 mb-1">Bonus Earned</p>
                            <p className="text-2xl font-bold text-slate-800">₹250</p>
                        </div>
                        <Award className="w-8 h-8 text-yellow-600" />
                    </div>
                </div>
            </div>

            {/* Monthly Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Monthly Breakdown</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Month</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Tasks</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Base Earnings</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Bonus</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {earningsData.map((month, index) => (
                                <tr key={index} className="border-b border-slate-100">
                                    <td className="py-3 px-4 text-sm text-slate-800">{month.month}</td>
                                    <td className="py-3 px-4 text-sm text-slate-600">{month.tasks}</td>
                                    <td className="py-3 px-4 text-sm text-slate-600">₹{month.earnings}</td>
                                    <td className="py-3 px-4 text-sm text-emerald-600">₹{month.bonus}</td>
                                    <td className="py-3 px-4 text-sm font-medium text-slate-800">₹{month.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Transactions</h2>
                <div className="space-y-3">
                    {recentTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${
                                    transaction.type === 'task' ? 'bg-blue-500' : 'bg-emerald-500'
                                }`}></div>
                                <div>
                                    <p className="text-sm font-medium text-slate-800">{transaction.description}</p>
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {transaction.date}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-medium ${
                                    transaction.amount > 0 ? 'text-emerald-600' : 'text-slate-600'
                                }`}>
                                    {transaction.amount > 0 ? `+₹${transaction.amount}` : 'Volunteer'}
                                </p>
                                <p className="text-xs text-slate-500">{transaction.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
