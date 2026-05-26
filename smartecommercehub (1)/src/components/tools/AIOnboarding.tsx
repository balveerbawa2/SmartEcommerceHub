import { 
  MessageSquare, Lightbulb, PenTool, BookOpen, 
  Layout, BarChart3, Image as ImageIcon, Sparkles, ArrowRight, Zap 
} from "lucide-react";
import { useState, useEffect } from "react";

export function AIOnboarding({ onStart, onSetInput }: { onStart: () => void, onSetInput?: (text: string) => void }) {
  const [typedText, setTypedText] = useState("");
  const fullText = "A powerful AI assistant built for smart conversations, deep thinking, content generation, problem solving, business help, research, and productivity — inspired by modern AI experiences.";
  
  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 20); // Fast typing effect
    return () => clearInterval(typingInterval);
  }, []);

  const capabilities = [
    {
      icon: <MessageSquare className="text-blue-600" size={22} />,
      title: "Smart Conversations",
      points: ["Human-like replies", "Context-aware chats", "Multi-turn conversations", "Deep understanding"],
      bg: "bg-blue-50"
    },
    {
      icon: <Lightbulb className="text-amber-600" size={22} />,
      title: "Deep Thinking",
      points: ["Step-by-step reasoning", "Brainstorming ideas", "Complex task breakdown", "Logical suggestions"],
      bg: "bg-amber-50"
    },
    {
      icon: <PenTool className="text-emerald-600" size={22} />,
      title: "Content Creation",
      points: ["Emails & Blogs", "Product descriptions", "Ad copies & SEO content", "Social media captions"],
      bg: "bg-emerald-50"
    },
    {
      icon: <BookOpen className="text-violet-600" size={22} />,
      title: "Research & Learning",
      points: ["Explain topics simply", "Summarize content", "Compare ideas", "Industry insights"],
      bg: "bg-violet-50"
    },
    {
      icon: <Layout className="text-pink-600" size={22} />,
      title: "Productivity",
      points: ["Task planning", "Daily workflow help", "Note generation", "Smart resource suggestions"],
      bg: "bg-pink-50"
    },
    {
      icon: <BarChart3 className="text-indigo-600" size={22} />,
      title: "Business Intelligence",
      points: ["Product research", "Pricing strategy", "Profit margin guidance", "Scaling & growth"],
      bg: "bg-indigo-50"
    },
    {
      icon: <ImageIcon className="text-teal-600" size={22} />,
      title: "Media Intelligence",
      points: ["File upload understanding", "Image/PDF analysis", "Background remover", "HD enhancer integration"],
      bg: "bg-teal-50"
    },
    {
      icon: <Sparkles className="text-purple-600" size={22} />,
      title: "Advanced Features",
      points: ["Chat memory (session)", "Fast response streaming", "Voice input support", "Premium modern UI"],
      bg: "bg-purple-50"
    }
  ];

  const examplePrompts = [
    "Help me grow my business",
    "Write SEO product description",
    "Analyze this file",
    "Compare marketing strategies",
    "Give pricing suggestions",
    "Create social media content",
    "Research product trends",
    "Solve a complex problem"
  ];

  const handlePromptClick = (prompt: string) => {
    if (onSetInput) {
      onSetInput(prompt);
    }
    onStart(); // Optionally start right away or just focus input
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Hero Section */}
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center p-3 text-slate-800 bg-white border border-slate-200 shadow-sm rounded-2xl mb-6 transition-transform hover:scale-105 duration-300 relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <Sparkles size={24} className="text-indigo-600 mr-2" />
          <span className="font-semibold text-sm">Next-Generation AI</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
          Meet SmartEcommerceHub <br/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            AI Assistant
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 h-24 sm:h-20 md:h-16 flex items-center justify-center px-4 leading-relaxed font-medium">
          {typedText}
          <span className="inline-block w-0.5 h-6 ml-1 bg-indigo-600 animate-pulse"></span>
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <button 
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 flex items-center justify-center gap-2 text-lg group"
          >
            Start Chatting <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => {
              document.getElementById("example-prompts")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex items-center justify-center gap-2 text-lg"
          >
            <Zap size={20} className="text-amber-500" />
            Try Example Prompts
          </button>
        </div>
      </div>

      {/* Modern Capabilities Grid */}
      <div className="mb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900">What This AI Can Help You With</h2>
          <p className="text-slate-500 mt-2">Deep intelligence across various domains</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((cap, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${cap.bg} group-hover:scale-110 transition-transform duration-300`}>
                {cap.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">{cap.title}</h3>
              <ul className="space-y-3">
                {cap.points.map((point, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0 group-hover:bg-indigo-400 transition-colors"></div>
                    <span className="leading-tight">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Example Prompts */}
      <div id="example-prompts" className="mb-10 bg-slate-900 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-pink-500 rounded-full blur-3xl opacity-20"></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Not sure where to start?</h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">Try one of these preset prompts to see the advanced reasoning and response capabilities of the AI Assistant.</p>
          
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {examplePrompts.map((prompt, idx) => (
              <button 
                key={idx}
                onClick={() => handlePromptClick(prompt)}
                className="px-5 py-3 bg-slate-800/80 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 rounded-2xl text-sm md:text-base font-medium transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gentle Notice */}
      <div className="text-center text-xs text-slate-400 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
        <span className="font-semibold text-slate-500">Note:</span>
        <p>AI may generate inaccurate information. It cannot directly process payments, log into external accounts, or act as legal/financial counsel.</p>
      </div>
      
    </div>
  );
}
