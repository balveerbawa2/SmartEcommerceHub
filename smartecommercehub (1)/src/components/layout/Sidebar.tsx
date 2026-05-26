import { Link } from "react-router-dom";
import { AreaChart, Package, LayoutDashboard, MessageSquare, IndianRupee, Settings, LogOut, Menu, UserCircle } from "lucide-react";

export function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (val: boolean) => void }) {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: MessageSquare, label: "AI Assistant", href: "/dashboard/assistant" },
    { icon: Package, label: "Product Search", href: "/dashboard/product-search" },
    { icon: AreaChart, label: "Analytics", href: "/dashboard/analytics" },
    { icon: IndianRupee, label: "Billing", href: "/dashboard/pricing" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
    { icon: UserCircle, label: "Profile", href: "/dashboard/profile" },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-200 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:inset-auto md:flex shadow-sm`}>
      <div className="flex items-center justify-between p-6 border-b border-slate-100 h-20">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
          <span className="font-bold text-lg tracking-tight text-slate-900">SmartEcommerceHub</span>
        </Link>
        <button className="md:hidden text-slate-500" onClick={() => setIsOpen(false)}>
          <Menu size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
              onClick={() => setIsOpen(false)} // Added missing close action on mobile navigation
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-900 text-white rounded-xl p-4 mb-4">
          <p className="text-xs text-slate-400 mb-1 font-medium uppercase tracking-wider">Active Plan</p>
          <p className="text-sm font-semibold mb-3">Business Pro</p>
          <div className="w-full bg-slate-700 h-1 rounded-full mb-2">
            <div className="bg-indigo-500 h-1 w-3/4 rounded-full"></div>
          </div>
          <p className="text-[10px] text-slate-400">750 / 1000 AI Credits left</p>
        </div>
        <button className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors">
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
