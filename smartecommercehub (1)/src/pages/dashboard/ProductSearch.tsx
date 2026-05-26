import { useState } from "react";
import { Search, Star, MessageSquareCode, TrendingUp, AlertCircle, ShoppingCart } from "lucide-react";
import type { ProductIdea } from "../../types";

export default function ProductSearch() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<ProductIdea[]>([]);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setIsSearching(true);
    setError(null);
    try {
      const res = await fetch("/api/product-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch data");
      
      setResults(data.results);
      setRecommendation(data.recommendation);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900">Product Search Intelligence</h1>
        <p className="text-slate-500 mt-2">Analyze real-time demand, verify competition context, and get AI-backed recommendations across platforms.</p>
        
        <form onSubmit={handleSearch} className="mt-8 relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Ceramic Coffee Mug, Smart Watch..."
            className="w-full px-6 py-4 pl-14 text-lg bg-white border border-slate-300 rounded-full shadow-lg shadow-slate-200/50 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition outline-none"
          />
          <Search className="absolute left-6 text-slate-400" size={24} />
          <button 
            type="submit" 
            disabled={isSearching}
            className="absolute right-2 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition disabled:opacity-70"
          >
            {isSearching ? 'Analyzing...' : 'Search Engine'}
          </button>
        </form>
        
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {['Amazon', 'Flipkart', 'Meesho', 'Myntra', 'Ajio'].map(p => (
            <span key={p} className="px-3 py-1 bg-white border border-slate-200 text-slate-500 rounded-full shadow-sm text-xs font-medium">
              {p}
            </span>
          ))}
        </div>
      </div>

      {error && (
        <div className="mt-6 text-center text-rose-600 bg-rose-50 p-4 rounded-xl">
          <AlertCircle className="inline mr-2" />
          {error}
        </div>
      )}

      {isSearching && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p>AI is scanning marketplaces and compiling analysis...</p>
        </div>
      )}

      {results.length > 0 && !isSearching && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Market Intelligence Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {results.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition">
                <div className="p-5 border-b border-slate-100 relative">
                  <div className="absolute top-3 right-3">
                    {item.worthSelling ? (
                      <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                        <TrendingUp size={12} className="mr-1" /> Worth Selling
                      </span>
                    ) : (
                      <span className="flex items-center text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md">
                        <AlertCircle size={12} className="mr-1" /> High Competition
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center mb-2">
                    <ShoppingCart size={14} className="mr-1" /> {item.platform}
                  </span>
                  <h3 className="font-bold text-slate-900 text-lg leading-tight truncate pr-16" title={item.title}>{item.title}</h3>
                  <div className="flex items-end mt-4 gap-3">
                    <span className="text-2xl font-bold text-slate-900">{item.price}</span>
                    <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mb-1">{item.discount} Off</span>
                  </div>
                </div>
                
                <div className="p-5 bg-slate-50 flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Rating</p>
                    <div className="flex items-center font-semibold text-slate-900">
                      <Star size={14} className="text-yellow-500 fill-yellow-500 mr-1" />
                      {item.rating} <span className="text-xs text-slate-400 font-normal ml-1">({item.reviews})</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Demand Score</p>
                    <p className="font-semibold text-slate-900">{item.demandScore}/100</p>
                  </div>
                  <div className="col-span-2 mt-2">
                    <p className="text-xs text-slate-500 mb-1">Competition Level</p>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                      <div 
                        className={`h-1.5 rounded-full ${item.competitionScore > 80 ? 'bg-rose-500' : item.competitionScore > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${item.competitionScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {recommendation && (
            <div className="mt-8 bg-indigo-50 border border-indigo-100 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center">
              <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center flex-shrink-0 text-indigo-600">
                <MessageSquareCode size={32} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">AI Recommendation</h3>
                <p className="text-slate-700">{recommendation}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
