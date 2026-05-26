import { Link } from "react-router-dom";
import { Calculator, Search, Bot } from "lucide-react";

export default function Tools() {
  const tools = [
    { icon: Calculator, name: "Profit Calculator", desc: "Calculate exact margins including platform fees, tax, and shipping costs.", link: "/dashboard/profit-calculator", color: "text-indigo-600", bg: "bg-indigo-50" },
    { icon: Search, name: "Product Intelligence", desc: "Cross-platform data analyzing competition, demand, and reviews.", link: "/dashboard/product-search", color: "text-indigo-600", bg: "bg-indigo-50" },
    { icon: Bot, name: "AI Assistant", desc: "Your dedicated ecommerce co-pilot supporting custom workflows.", link: "/dashboard/assistant", color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Ecommerce Tool Suite</h1>
          <p className="text-lg text-slate-500">Everything you need inside a unified hub.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tools.map((t) => (
            <Link to={t.link} key={t.name} className="block p-8 rounded-2xl bg-white border border-slate-200 hover:shadow-lg transition-all group">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${t.bg} ${t.color} mb-6`}>
                <t.icon size={28} />
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{t.name}</h2>
              <p className="text-slate-500">{t.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
