import { useState } from 'react';
import { User, Mail, CreditCard, Calendar, Shield, Save, LogOut, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: 'Balveer Bawa',
    email: 'balveerbawa2@gmail.com',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Your Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 text-center shadow-sm">
            <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
              {profile.name.charAt(0)}
            </div>
            <h2 className="text-lg font-bold text-slate-900">{profile.name}</h2>
            <p className="text-sm text-slate-500 mb-4">{profile.email}</p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">
              <Shield size={14} /> Pro Plan
            </span>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-slate-600 text-sm">
              <Calendar size={18} className="text-slate-400" />
              <span>Joined May 2026</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 text-sm">
              <CreditCard size={18} className="text-slate-400" />
              <span>Billed Annually</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Personal Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="pl-10 w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="pl-10 w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">Email cannot be changed currently.</p>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 font-medium"
              >
                {isSaving ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Save size={18} />}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>

          <div className="bg-white p-6 rounded-xl border border-rose-200 shadow-sm">
            <h3 className="text-lg font-semibold text-rose-600 mb-2 flex items-center gap-2">
              <AlertCircle size={20} /> Danger Zone
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Permanently delete your account and all of your content. This action is not reversible, so please continue with caution.
            </p>
            <button
              type="button"
              className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-100 transition font-medium text-sm"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Profile updated successfully
        </div>
      )}
    </div>
  );
}
