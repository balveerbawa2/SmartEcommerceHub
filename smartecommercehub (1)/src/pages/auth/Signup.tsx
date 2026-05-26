import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-slate-50 px-4 py-12 overflow-y-auto">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 my-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Create an account</h2>
          <p className="text-slate-500 mt-2">Start scaling your business with AI</p>
        </div>
        
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input type="text" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition" placeholder="you@company.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition" placeholder="••••••••" />
          </div>
          <div className="flex items-start">
            <input id="terms" type="checkbox" required className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
            <label htmlFor="terms" className="ml-2 block text-sm text-slate-700">
              I agree to the <Link to="/legal/terms" className="text-indigo-600 hover:text-indigo-500">Terms</Link> and <Link to="/legal/privacy" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</Link>
            </label>
          </div>
          
          <Link to="/dashboard" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
            Create Account
          </Link>
        </form>
        
        <div className="mt-6 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
