import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSharedChat, DatabaseChatSession } from "../../lib/workspace";
import { Bot, User, ArrowLeft, Download } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { downloadAsTxt, downloadAsMarkdown } from "../../lib/exportUtils";

export default function SharedChat() {
  const { id } = useParams<{ id: string }>();
  const [chat, setChat] = useState<DatabaseChatSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getSharedChat(id).then(data => {
        setChat(data);
        setLoading(false);
      });
    }
  }, [id]);

  const handleExport = (format: 'txt' | 'md') => {
    if (!chat) return;
    let content = `# ${chat.title}\n\n`;
    chat.messages.forEach((msg: any) => {
      content += `**${msg.role === 'user' ? 'User' : 'Assistant'}**:\n${msg.content}\n\n`;
    });
    const filename = `shared_chat_${chat.id}`;
    if (format === 'txt') {
      downloadAsTxt(content, filename);
    } else {
      downloadAsMarkdown(content, filename);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading shared chat...</div>;
  }

  if (!chat) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 flex-col gap-4">
        <h2 className="text-xl font-bold text-slate-800">Shared Chat Not Found</h2>
        <p className="text-slate-500">This chat may have been deleted or the link is invalid.</p>
        <Link to="/" className="text-indigo-600 hover:underline">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-slate-100 rounded-full transition"><ArrowLeft size={20} className="text-slate-500" /></Link>
          <div>
            <h1 className="font-bold text-slate-800 text-lg">Shared: {chat.title}</h1>
            <p className="text-xs text-slate-500">Read-only view</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleExport('md')} className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition border border-slate-200">
            <Download size={16} /> Export MD
          </button>
          <Link to="/dashboard/assistant" className="hidden sm:inline-flex px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
            Open in Workspace
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {chat.messages.map((msg: any) => (
          <div key={msg.id} className={`flex gap-4 p-4 sm:p-6 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-50 border border-indigo-100 ml-auto max-w-3xl' : 'bg-white border border-slate-200 mr-auto max-w-3xl shadow-sm'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className="flex-1 max-w-full overflow-hidden">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-sm text-slate-800">{msg.role === 'user' ? 'User' : 'Assistant'}</span>
                <span className="text-xs text-slate-400">{new Date(msg.timestamp || Date.now()).toLocaleTimeString()}</span>
              </div>
              <div className="prose prose-sm prose-slate max-w-none break-words">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
