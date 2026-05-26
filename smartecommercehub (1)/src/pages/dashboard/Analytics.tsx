import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { MessageSquare, FileText, Search, Mic, Zap, Bookmark, Box } from 'lucide-react';
import { useEffect, useState } from 'react';

const weeklyData = [
  { name: 'Mon', chats: 12, prompts: 25 },
  { name: 'Tue', chats: 19, prompts: 35 },
  { name: 'Wed', chats: 8, prompts: 15 },
  { name: 'Thu', chats: 15, prompts: 28 },
  { name: 'Fri', chats: 22, prompts: 42 },
  { name: 'Sat', chats: 10, prompts: 18 },
  { name: 'Sun', chats: 5, prompts: 10 },
];

export default function Analytics() {
  const [stats, setStats] = useState({
    totalChats: 42,
    totalPrompts: 184,
    filesAnalyzed: 12,
    voiceChats: 8,
    webSearches: 45,
    savedPrompts: 0,
  });

  useEffect(() => {
    try {
      const chats = localStorage.getItem("smarthub_ai_chats");
      const prompts = localStorage.getItem("smarthub_ai_prompts");
      
      let cCount = 42;
      let mCount = 184;
      let sCount = 3;

      if (chats) {
        const pChats = JSON.parse(chats);
        cCount = pChats.length;
        mCount = pChats.reduce((acc: number, c: any) => acc + (c.messages?.length || 0), 0);
      }
      
      if (prompts) {
        sCount = JSON.parse(prompts).length;
      }
      
      setStats(prev => ({
        ...prev,
        totalChats: cCount > 0 ? cCount : prev.totalChats,
        totalPrompts: mCount > 0 ? mCount : prev.totalPrompts,
        savedPrompts: sCount
      }));
    } catch(e) {}
  }, []);

  const statCards = [
    { name: "Total Chats", value: stats.totalChats, icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Total Prompts", value: stats.totalPrompts, icon: Zap, color: "text-indigo-600", bg: "bg-indigo-50" },
    { name: "Files Analyzed", value: stats.filesAnalyzed, icon: FileText, color: "text-emerald-600", bg: "bg-emerald-50" },
    { name: "Voice Queries", value: stats.voiceChats, icon: Mic, color: "text-rose-600", bg: "bg-rose-50" },
    { name: "Web Searches", value: stats.webSearches, icon: Search, color: "text-violet-600", bg: "bg-violet-50" },
    { name: "Saved Prompts", value: stats.savedPrompts, icon: Bookmark, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Usage Analytics</h1>
        <p className="text-slate-500">Monitor your AI assistant usage, file insights, and performance.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-900 leading-none mb-1">{stat.value}</p>
            <p className="text-xs font-medium text-slate-500">{stat.name}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Activity */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Weekly Activity (Prompts)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                <Tooltip 
                  cursor={{ fill: '#F1F5F9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="prompts" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chats History vs Prompts (Area) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Engagement Overview</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorChats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="chats" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorChats)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
