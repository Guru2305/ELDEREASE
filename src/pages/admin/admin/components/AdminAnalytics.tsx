import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function AdminAnalytics() {
    // 1. Weekly Activity Data (Line Chart)
    const weeklyActivityData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Requests',
                data: [12, 19, 15, 25, 22, 30, 28],
                borderColor: 'rgb(16, 185, 129)', // Emerald 500
                backgroundColor: 'rgba(16, 185, 129, 0.5)',
                tension: 0.3,
            },
            {
                label: 'Completed',
                data: [10, 15, 12, 20, 18, 25, 24],
                borderColor: 'rgb(59, 130, 246)', // Blue 500
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                tension: 0.3,
            },
        ],
    };

    const lineOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Weekly Request Activity',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    // 2. Request Status Breakdown (Doughnut Chart)
    const statusData = {
        labels: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
        datasets: [
            {
                label: '# of Requests',
                data: [5, 8, 45, 2],
                backgroundColor: [
                    'rgba(245, 158, 11, 0.8)', // Amber (Pending)
                    'rgba(59, 130, 246, 0.8)', // Blue (In Progress)
                    'rgba(16, 185, 129, 0.8)', // Emerald (Completed)
                    'rgba(239, 68, 68, 0.8)',  // Red (Cancelled)
                ],
                borderColor: [
                    'rgba(245, 158, 11, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(239, 68, 68, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const doughnutOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right' as const,
            },
            title: {
                display: true,
                text: 'Request Status All-Time',
            },
        },
    };

    // 3. Top Volunteer Ratings (Bar Chart)
    const volunteerPerformanceData = {
        labels: ['Senthil', 'Divya', 'Arun', 'Priya', 'Karthik'],
        datasets: [
            {
                label: 'Rating (out of 5)',
                data: [4.8, 4.9, 4.5, 5.0, 4.7],
                backgroundColor: 'rgba(139, 92, 246, 0.7)', // Violet
                borderColor: 'rgb(139, 92, 246)',
                borderWidth: 1,
            },
            {
                label: 'Tasks Completed',
                data: [45, 32, 15, 28, 12],
                backgroundColor: 'rgba(236, 72, 153, 0.7)', // Pink
                borderColor: 'rgb(236, 72, 153)',
                borderWidth: 1,
                yAxisID: 'y1',
            }
        ],
    };

    const barOptions = {
        responsive: true,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            title: {
                display: true,
                text: 'Top Volunteer Performance',
            },
        },
        scales: {
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                max: 5,
                title: {
                    display: true,
                    text: 'Rating'
                }
            },
            y1: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                grid: {
                    drawOnChartArea: false,
                },
                title: {
                    display: true,
                    text: 'Tasks'
                }
            },
        },
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Weekly Activity */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
                <div className="h-[300px] w-full flex justify-center">
                    <Line options={lineOptions} data={weeklyActivityData} />
                </div>
            </div>

            {/* Status Breakdown */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="h-[300px] w-full flex justify-center items-center">
                    <Doughnut options={doughnutOptions} data={statusData} />
                </div>
            </div>

            {/* Volunteer Performance */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="h-[300px] w-full flex justify-center">
                    <Bar options={barOptions} data={volunteerPerformanceData} />
                </div>
            </div>
        </div>
    );
}
