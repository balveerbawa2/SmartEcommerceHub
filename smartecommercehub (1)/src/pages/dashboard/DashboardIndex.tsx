import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { IndianRupee, TrendingUp, Search, MessageSquare, Plus, Mic, Paperclip, Clock, Calendar, Zap, FolderOpen, Users, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { getChats, getProjects, DatabaseChatSession, WorkspaceProject } from '../../lib/workspace';

const data = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 2000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

export default function DashboardIndex() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recentChats, setRecentChats] = useState<DatabaseChatSession[]>([]);
  const [activeProjects, setActiveProjects] = useState<WorkspaceProject[]>([]);
  const [totalPrompts, setTotalPrompts] = useState(0);

  useEffect(() => {
    if (user) {
      getChats(user.uid).then(chats => {
        setRecentChats(chats.slice(0, 4));
        setTotalPrompts(chats.reduce((acc, c) => acc + (c.messages?.length || 0), 0));
      });
      getProjects(user.uid).then(projects => {
        setActiveProjects(projects.slice(0, 3));
      });
    } else {
      try {
        const chats = localStorage.getItem("smarthub_ai_chats");
        if (chats) {
          const parsed = JSON.parse(chats);
          setRecentChats(parsed.slice(0, 4));
          setTotalPrompts(parsed.reduce((acc: number, c: any) => acc + (c.messages?.length || 0), 0));
        }
      } catch(e) {}
    }
  }, [user]);

  const stats = [
    { name: "Total AI Prompts", value: totalPrompts.toString(), change: "+18%", icon: MessageSquare, color: "text-indigo-600", bg: "bg-indigo-50" },
    { name: "Profit Calculations", value: "142", change: "+12.5%", icon: IndianRupee, color: "text-emerald-600", bg: "bg-emerald-50" },
    { name: "Searches Analyzed", value: "85", change: "-2.5%", icon: Search, color: "text-violet-600", bg: "bg-violet-50" },
    { name: "Active Projects", value: activeProjects.length.toString(), change: "+1 New", icon: FolderOpen, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'Guest'}!</h1>
          <p className="text-slate-500">Here's an overview of your workspace and AI usage.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard/assistant')} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm font-medium text-sm">
            <Plus size={16} /> New Chat
          </button>
          <button onClick={() => navigate('/dashboard/assistant')} className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition shadow-sm font-medium text-sm">
            <Mic size={16} className="text-slate-500" /> Voice Assistant
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
            <p className="text-slate-500 text-sm font-medium">{stat.name}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Chats & Projects */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Recent AI Chats</h2>
              <Link to="/dashboard/assistant" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All Workspace</Link>
            </div>
            
            {recentChats.length > 0 ? (
              <div className="space-y-3">
                {recentChats.map(chat => (
                  <Link 
                    key={chat.id} 
                    to={`/dashboard/assistant`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-indigo-100 hover:bg-indigo-50/30 transition gap-3"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <MessageSquare size={18} />
                      </div>
                      <div className="truncate">
                        <h3 className="font-semibold text-slate-900 text-sm truncate">{chat.title}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock size={12} /> Last updated {new Date(chat.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 pl-12 sm:pl-0 text-indigo-600 font-medium text-xs hidden sm:block">
                      Continue Chat &rarr;
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <MessageSquare size={32} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium text-sm">No recent chats found.</p>
                <button onClick={() => navigate('/dashboard/assistant')} className="mt-3 text-indigo-600 hover:text-indigo-700 font-medium text-sm">Start your first chat</button>
              </div>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Usage Analytics (Platform)</h2>
            <div className="h-64 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                  <Tooltip 
                    cursor={{ fill: '#F1F5F9' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right column Quick Access */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Quick AI Actions</h2>
            <div className="space-y-3">
              <Link to="/dashboard/assistant" className="flex items-center p-3 sm:p-4 border border-slate-100 rounded-xl hover:border-indigo-200 hover:bg-slate-50 transition-colors group">
                <div className="w-10 h-10 bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors rounded-lg flex items-center justify-center mr-4 shrink-0">
                  <FolderOpen size={18} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Workspace Projects</p>
                  <p className="text-xs text-slate-500">Organize your workflow</p>
                </div>
              </Link>
              
              <Link to="/dashboard/profit-calculator" className="flex items-center p-3 sm:p-4 border border-slate-100 rounded-xl hover:border-emerald-200 hover:bg-slate-50 transition-colors group">
                <div className="w-10 h-10 bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors rounded-lg flex items-center justify-center mr-4 shrink-0">
                  <IndianRupee size={18} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Profit Calculator</p>
                  <p className="text-xs text-slate-500">Calculate net margins accurately</p>
                </div>
              </Link>
              
              <Link to="/dashboard/product-search" className="flex items-center p-3 sm:p-4 border border-slate-100 rounded-xl hover:border-violet-200 hover:bg-slate-50 transition-colors group">
                <div className="w-10 h-10 bg-slate-100 text-slate-600 group-hover:bg-violet-100 group-hover:text-violet-600 transition-colors rounded-lg flex items-center justify-center mr-4 shrink-0">
                  <Search size={18} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Product Search</p>
                  <p className="text-xs text-slate-500">Analyze winning products</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Team Workspace</h2>
              <button className="text-indigo-600 hover:text-indigo-700 bg-indigo-50 p-1.5 rounded-lg transition" title="Invite Member">
                <UserPlus size={16} />
              </button>
            </div>
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                      {user.email?.charAt(0).toUpperCase() || 'O'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 truncate max-w-[120px]">{user.email?.split('@')[0]}</p>
                      <p className="text-xs text-slate-500">Owner</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Active</span>
                </div>
                <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center text-xs font-bold">
                      T
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 truncate max-w-[120px]">team@demo.com</p>
                      <p className="text-xs text-slate-500">Editor</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">Invited</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Users size={24} className="mx-auto text-slate-300 mb-2" />
                <p className="text-slate-500 font-medium text-xs mb-2">Sign in to collaborate</p>
                <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium text-xs">Login</Link>
              </div>
            )}
          </div>
          
          <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 p-6 rounded-xl border border-indigo-800 shadow-sm text-white">
            <h2 className="text-lg font-bold mb-2">Upgrade to Pro</h2>
            <p className="text-indigo-200 text-sm mb-4">Get unlimited web searches, longer context windows, and advanced HD image tools.</p>
            <Link to="/dashboard/pricing" className="inline-block w-full text-center px-4 py-2 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 transition shadow-sm font-semibold text-sm">
              View Plans
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
