import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              SmartEcommerceHub
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">About</Link>
            <Link to="/tools" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Tools</Link>
            <Link to="/dashboard/pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Pricing</Link>
            <div className="flex items-center space-x-4 ml-4">
              <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-slate-900">Sign in</Link>
              <Link to="/signup" className="text-sm font-medium px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-sm">
                Get Started
              </Link>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-16 w-full bg-white border-b border-slate-200 shadow-xl"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">About</Link>
              <Link to="/tools" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Tools</Link>
              <Link to="/dashboard/pricing" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Pricing</Link>
              <div className="border-t border-slate-100 my-2 pt-2">
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Sign In</Link>
                <Link to="/signup" className="block px-3 py-2 mt-1 rounded-md text-base font-medium bg-indigo-600 text-white text-center hover:bg-indigo-700">Get Started</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
