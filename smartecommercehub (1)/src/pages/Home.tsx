import { Link } from "react-router-dom";
import { ArrowRight, BarChart2, MessageSquare, Search, Zap } from "lucide-react";
import { motion } from "motion/react";

export default function Home() {
  const features = [
    { name: "Profit Calculator", desc: "Accurately compute net margins across platforms.", icon: BarChart2 },
    { name: "Product Intelligence", desc: "Analyze competition and demand scores.", icon: Search },
    { name: "AI Assistant", desc: "Get smart insights and Hindi/English support.", icon: MessageSquare },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8">
              Grow Your <span className="text-indigo-600">Ecommerce</span> Faster.
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
              SmartEcommerceHub gives you the AI-powered tools you need to find winning products, calculate precise profit margins, and scale your business seamlessly.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup" className="px-8 py-4 bg-indigo-600 text-white rounded-full font-medium text-lg hover:bg-indigo-700 transition-all shadow-md flex items-center justify-center gap-2">
                Start for free <ArrowRight size={20} />
              </Link>
              <Link to="/tools" className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-full font-medium text-lg hover:bg-slate-50 transition-all shadow-sm">
                Explore Tools
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to succeed</h2>
          <p className="text-lg text-slate-500">Powerful utilities built for modern sellers.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={f.name} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.2 }}
              className="p-8 rounded-2xl bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all"
            >
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <f.icon size={24} />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{f.name}</h3>
              <p className="text-slate-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to scale your store?</h2>
          <p className="text-xl text-slate-300 mb-10">Join thousands of sellers optimizing their business with AI today.</p>
          <Link to="/signup" className="inline-flex px-8 py-4 bg-white text-slate-900 rounded-full font-medium text-lg hover:bg-slate-50 transition-all">
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
