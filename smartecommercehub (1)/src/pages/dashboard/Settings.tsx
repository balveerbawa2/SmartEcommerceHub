import { useState, useEffect } from 'react';
import { Save, Sliders, MessageSquare, Global, Type, Search, Mic, Moon, Bell, Layout } from 'lucide-react';

export default function Settings() {
  const [aiSettings, setAiSettings] = useState({
    responseStyle: 'Balanced',
    tone: 'Professional',
    language: 'Auto',
    autoWebSearch: true,
    autoRead: false,
  });

  const [appSettings, setAppSettings] = useState({
    darkMode: false,
    notifications: true,
    compactChat: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    try {
      const vSet = localStorage.getItem("smarthub_ai_voice_settings");
      if (vSet) {
        const parsed = JSON.parse(vSet);
        setAiSettings(prev => ({ ...prev, autoRead: parsed.autoRead || false }));
      }
    } catch(e) {}
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    // sync to AI
    try {
      const vSet = localStorage.getItem("smarthub_ai_voice_settings");
      const parsed = vSet ? JSON.parse(vSet) : {};
      parsed.autoRead = aiSettings.autoRead;
      localStorage.setItem("smarthub_ai_voice_settings", JSON.stringify(parsed));
    } catch(e) {}

    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 800);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500">Manage your AI assistant and application preferences.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 font-medium"
        >
          {isSaving ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Save size={18} />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* AI Settings */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sliders size={20} className="text-indigo-500" /> AI Preferences
          </h2>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <label className="flex items-center justify-between text-sm font-medium text-slate-700 mb-2">
                Response Style
              </label>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                {['Concise', 'Balanced', 'Detailed'].map(style => (
                  <button
                    key={style}
                    onClick={() => setAiSettings({ ...aiSettings, responseStyle: style })}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition ${aiSettings.responseStyle === style ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center justify-between text-sm font-medium text-slate-700 mb-2">
                Assistant Tone
              </label>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                {['Professional', 'Friendly', 'Neutral'].map(tone => (
                  <button
                    key={tone}
                    onClick={() => setAiSettings({ ...aiSettings, tone })}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition ${aiSettings.tone === tone ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-sm font-medium text-slate-800">Auto Web Search</span>
                  <span className="text-xs text-slate-500">Allow AI to search live web data</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={aiSettings.autoWebSearch} onChange={(e) => setAiSettings({ ...aiSettings, autoWebSearch: e.target.checked })} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-sm font-medium text-slate-800">Auto-Read Responses</span>
                  <span className="text-xs text-slate-500">Speak AI answers aloud automatically</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={aiSettings.autoRead} onChange={(e) => setAiSettings({ ...aiSettings, autoRead: e.target.checked })} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* App Settings */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layout size={20} className="text-indigo-500" /> App Preferences
          </h2>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-sm font-medium text-slate-800">Dark Mode</span>
                <span className="text-xs text-slate-500">Toggle dark theme</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={appSettings.darkMode} onChange={(e) => setAppSettings({ ...appSettings, darkMode: e.target.checked })} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-800"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="block text-sm font-medium text-slate-800">Push Notifications</span>
                <span className="text-xs text-slate-500">Alerts for files, searches, generation</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={appSettings.notifications} onChange={(e) => setAppSettings({ ...appSettings, notifications: e.target.checked })} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="block text-sm font-medium text-slate-800">Compact Chat UI</span>
                <span className="text-xs text-slate-500">Reduce padding in chat bubbles</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={appSettings.compactChat} onChange={(e) => setAppSettings({ ...appSettings, compactChat: e.target.checked })} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

          </div>
        </div>
      </div>
      
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Settings saved successfully
        </div>
      )}
    </div>
  );
}
