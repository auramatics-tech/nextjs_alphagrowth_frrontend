'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ChartArea } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { 
    Users, MessageCircle, Calendar, DollarSign, ChevronDown, Filter, MoreVertical, Linkedin, Mail, Phone, 
    PlusCircle, LayoutDashboard, Briefcase, Users as UsersIcon, BarChart2, CheckSquare, Target, GitBranch,
    PhoneCall, Inbox, Database, Contact, UserCheck, Building, ChevronLeft, ChevronRight, HelpCircle, Bell, Search
} from 'lucide-react';
// Layout is provided by the (dashboard)/layout.tsx

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// --- Mock Data ---
const MOCK_DATA = {
    kpis: [
        { title: 'Prospects Targeted', value: '2,342', change: '+12.5%', icon: Users, color: 'text-blue-500', gradient: 'from-blue-100 to-blue-200' },
        { title: 'Replies', value: '189', change: '+8.2%', icon: MessageCircle, color: 'text-orange-500', gradient: 'from-orange-100 to-orange-200' },
        { title: 'Meetings Booked', value: '34', change: '+2.1%', icon: Calendar, color: 'text-green-500', gradient: 'from-green-100 to-green-200' },
        { title: 'Pipeline Value', value: '$85,200', change: '+15%', icon: DollarSign, color: 'text-purple-500', gradient: 'from-purple-100 to-purple-200' }
    ],
    salesFunnel: [
        { stage: 'Qualified Interest', value: 80, color: 'bg-orange-400' },
        { stage: 'Meeting Scheduled', value: 60, color: 'bg-blue-400' },
        { stage: 'Meeting Completed', value: 40, color: 'bg-indigo-400' },
        { stage: 'Follow-up / Nurture', value: 30, color: 'bg-purple-400' },
        { stage: 'Closed Won', value: 10, color: 'bg-green-500' }
    ],
    meetingsTrend: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
        data: [5, 9, 7, 12, 10, 15, 14]
    },
    channelsPerformance: [
        { channel: 'Email', icon: Mail, prospects: 1050, openRate: '65%', acceptRate: '-', replies: 95, meetings: 18, pipeline: '$42,300' },
        { channel: 'LinkedIn', icon: Linkedin, prospects: 850, openRate: '-', acceptRate: '35%', replies: 78, meetings: 12, pipeline: '$31,500' },
        { channel: 'Voice Call', icon: Phone, prospects: 442, openRate: '-', acceptRate: '-', replies: 16, meetings: 4, pipeline: '$11,400' },
    ],
    tasks: [
        { name: 'Chait Jain', company: 'DataCorp', type: 'Create Task', date: '2025-09-16', time: '14:30', remark: 'Follow up on proposal Q4' },
        { name: 'Jane Doe', company: 'TechCorp', type: 'Send Email', date: '2025-09-16', time: '16:00', remark: 'Initial outreach for new campaign' },
        { name: 'Alex Ray', company: 'Innovate LLC', type: 'Call', date: '2025-09-17', time: '11:00', remark: 'Discuss integration options' },
    ]
};

// --- Reusable Themed Components ---
const StatCard = ({ item, index }: { item: any; index: number }) => ( 
    <motion.div 
        className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300" 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: index * 0.1 }}
    > 
        <div className="flex items-center justify-between"> 
            <p className="text-sm font-medium text-gray-500">{item.title}</p> 
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${item.gradient}`}> 
                <item.icon size={20} className={item.color} /> 
            </div> 
        </div> 
        <p className="text-4xl font-bold text-[#1E1E1E] mt-3">{item.value}</p> 
        <p className={`text-sm font-semibold mt-1 ${item.change.startsWith('+') ? 'text-[#3CCF91]' : 'text-[#FF4D4F]'}`}>{item.change}</p> 
    </motion.div> 
);

const SectionCard = ({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) => ( 
    <motion.div 
        className={`bg-white p-6 rounded-2xl border border-gray-200 shadow-sm ${className}`} 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.2 }}
    > 
        <div className="flex justify-between items-center mb-4"> 
            <h2 className="text-lg font-bold text-[#1E1E1E]">{title}</h2> 
            <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                <MoreVertical size={18} />
            </button> 
        </div> 
        {children} 
    </motion.div> 
);

// --- Main Dashboard Component ---
export default function DashboardPage() {
    const chartRef = useRef<ChartJS<'line'>>(null);
    const [chartData, setChartData] = useState<any>({ datasets: [] });

    const chartOptions: any = { 
        responsive: true, 
        maintainAspectRatio: false, 
        plugins: { legend: { display: false } }, 
        scales: { 
            x: { grid: { display: false } }, 
            y: { beginAtZero: true } 
        }, 
        elements: { 
            point: { radius: 4, backgroundColor: '#FF6B2C', hoverRadius: 6 } 
        } 
    };

    useEffect(() => {
        const chart = chartRef.current;
        if (!chart) return;
        const createGradient = (ctx: CanvasRenderingContext2D, area: ChartArea) => { 
            const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top); 
            gradient.addColorStop(0, 'rgba(58, 163, 255, 0.05)'); 
            gradient.addColorStop(1, 'rgba(255, 107, 44, 0.4)'); 
            return gradient; 
        }
        setChartData({ 
            labels: MOCK_DATA.meetingsTrend.labels, 
            datasets: [{ 
                label: 'Meetings', 
                data: MOCK_DATA.meetingsTrend.data, 
                borderColor: '#FF6B2C', 
                borderWidth: 2.5, 
                tension: 0.4, 
                fill: true, 
                backgroundColor: createGradient(chart.ctx, chart.chartArea), 
            }] 
        });
    }, []);

 

    return (
        <div className="max-w-7xl mx-auto">
            <motion.div 
                className="grid grid-cols-1 lg:grid-cols-3 gap-6" 
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }} 
                initial="hidden" 
                animate="show"
            >
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {MOCK_DATA.kpis.map((item, index) => (
                        <StatCard key={item.title} item={item} index={index} />
                    ))}
                </div>
                <div className="lg:col-span-3 grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <SectionCard title="Sales Funnel" className="xl:col-span-1">
                        <div className="space-y-1 mt-4">
                            {MOCK_DATA.salesFunnel.map((stage, i) => (
                                <div key={stage.stage} className="p-2">
                                    <div className="flex justify-between items-center text-xs font-bold text-gray-500 mb-1">
                                        <span>{stage.stage}</span>
                                        <span>{stage.value}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div 
                                            className={`${stage.color} h-2.5 rounded-full`} 
                                            style={{ width: `${(stage.value / MOCK_DATA.salesFunnel[0].value) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                    <SectionCard title="Meetings Trend (Weekly)" className="xl:col-span-2">
                        <div className="h-80 relative">
                            <Line ref={chartRef} options={chartOptions} data={chartData} />
                        </div>
                    </SectionCard>
                </div>
                <SectionCard title="Channels Performance" className="lg:col-span-3">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                <tr>
                                    {['Channel', 'Prospects', 'Replies', 'Meetings', 'Pipeline'].map(h => (
                                        <th key={h} className="px-6 py-3">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_DATA.channelsPerformance.map((row) => (
                                    <tr key={row.channel} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                                            <row.icon size={16} className="text-gray-400"/>
                                            {row.channel}
                                        </td>
                                        <td className="px-6 py-4">{row.prospects}</td>
                                        <td className="px-6 py-4">{row.replies}</td>
                                        <td className="px-6 py-4">{row.meetings}</td>
                                        <td className="px-6 py-4 font-bold text-[#1E1E1E]">{row.pipeline}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </SectionCard>
                <SectionCard title="Today's Tasks & Upcoming Meetings" className="lg:col-span-3">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                <tr>
                                    {['Name', 'Company', 'Task Type', 'Date & Time', 'Remark'].map(h => (
                                        <th key={h} className="px-6 py-3">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_DATA.tasks.map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{row.name}</td>
                                        <td className="px-6 py-4">{row.company}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                                {row.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{row.date} at {row.time}</td>
                                        <td className="px-6 py-4 text-gray-600">{row.remark}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </SectionCard>
            </motion.div>
        </div>
    );
}