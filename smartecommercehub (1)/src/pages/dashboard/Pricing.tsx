import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Pricing() {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free",
      price: "0",
      description: "Perfect for getting started and exploring tools.",
      features: [
        "Basic Profit Calculator",
        "Limited Product Search (5/day)",
        "Standard AI Assistant",
        "Community Support",
      ],
      button: "Current Plan",
      highlight: false
    },
    {
      name: "Pro",
      price: "999",
      period: "/month",
      description: "Everything you need to successfully scale your store.",
      features: [
        "Advanced Profit Calculator",
        "Unlimited Product Search",
        "Advanced GPT-4o AI Assistant",
        "Media Background Remover",
        "Email Support",
      ],
      button: "Upgrade to Pro",
      highlight: true
    },
    {
      name: "Business",
      price: "2499",
      period: "/month",
      description: "For established sellers needing advanced automation.",
      features: [
        "Everything in Pro",
        "Priority API Access",
        "3D Video Creator Tool",
        "Marketplace API Integrations",
        "24/7 Priority Support",
      ],
      button: "Upgrade to Business",
      highlight: false
    },
    {
      name: "Enterprise",
      price: "9999",
      period: "/month",
      description: "Custom solutions for large scale ecommerce operations.",
      features: [
        "Everything in Business",
        "Custom Feature Development",
        "Dedicated Account Manager",
        "On-premise Deployment Options",
        "SLA Guarantee",
      ],
      button: "Upgrade to Enterprise",
      highlight: false
    }
  ];

  const handleUpgrade = (plan: typeof plans[0]) => {
    if (plan.price === '0') {
      navigate('/dashboard');
    } else {
      navigate('/checkout', { state: { plan } });
    }
  };

  return (
    <div className="p-8 pb-20 max-w-7xl mx-auto min-h-screen">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-bold text-slate-900">Simple, transparent pricing</h1>
        <p className="text-lg text-slate-500 mt-4">Choose the plan that best fits your ecommerce needs. Prices are in INR (₹).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 items-start">
        {plans.map((plan) => (
          <div 
            key={plan.name} 
            className={`relative flex flex-col p-8 rounded-3xl ${
              plan.highlight 
                ? 'bg-slate-900 text-white shadow-2xl ring-1 ring-slate-900 border-none' 
                : 'bg-white border text-slate-900 border-slate-200'
            }`}
          >
            {plan.highlight && (
              <div className="absolute top-0 right-8 transform -translate-y-1/2">
                <span className="bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">Most Popular</span>
              </div>
            )}
            
            <div className="mb-6">
              <h3 className={`text-xl font-bold ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
              <p className={`mt-2 text-sm ${plan.highlight ? 'text-slate-300' : 'text-slate-500'}`}>{plan.description}</p>
            </div>
            
            <div className="mb-8">
              <span className="text-4xl font-extrabold flex items-baseline">
                ₹{plan.price}
                {plan.period && <span className={`text-lg font-normal ml-1 ${plan.highlight ? 'text-slate-300' : 'text-slate-500'}`}>{plan.period}</span>}
              </span>
            </div>
            
            <ul className="flex-1 space-y-4 mb-8">
              {plan.features.map(f => (
                <li key={f} className="flex items-start">
                  <Check size={20} className={`mr-3 flex-shrink-0 ${plan.highlight ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  <span className={`text-sm ${plan.highlight ? 'text-slate-200' : 'text-slate-600'}`}>{f}</span>
                </li>
              ))}
            </ul>
            
            <button 
              onClick={() => handleUpgrade(plan)}
              className={`w-full py-3.5 px-4 rounded-xl font-semibold transition-all ${
                plan.highlight 
                  ? 'bg-white text-slate-900 hover:bg-slate-100' 
                  : plan.price === '0' 
                    ? 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {plan.button}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
