import { useState, useMemo } from "react";
import { DollarSign, Percent, IndianRupee } from "lucide-react";

export default function ProfitCalculator() {
  const [costPrice, setCostPrice] = useState<number | "">("");
  const [sellingPrice, setSellingPrice] = useState<number | "">("");
  const [platformFeePercent, setPlatformFeePercent] = useState<number | "">(10);
  const [shippingCost, setShippingCost] = useState<number | "">("");
  const [taxPercent, setTaxPercent] = useState<number | "">(18);

  const results = useMemo(() => {
    const cp = Number(costPrice) || 0;
    const sp = Number(sellingPrice) || 0;
    const pf = Number(platformFeePercent) || 0;
    const ship = Number(shippingCost) || 0;
    const tax = Number(taxPercent) || 0;

    const platformFeeAmount = sp * (pf / 100);
    const taxAmount = sp * (tax / 100);
    const totalDeductions = cp + platformFeeAmount + ship + taxAmount;
    
    const netEarnings = sp - totalDeductions;
    const margin = sp > 0 ? (netEarnings / sp) * 100 : 0;
    const roi = cp > 0 ? (netEarnings / cp) * 100 : 0;

    return {
      platformFeeAmount,
      taxAmount,
      totalDeductions,
      netEarnings,
      margin,
      roi
    };
  }, [costPrice, sellingPrice, platformFeePercent, shippingCost, taxPercent]);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Profit Calculator</h1>
        <p className="text-slate-500 mt-2">Accurately determine your net margins after all platform fees and taxes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Inputs</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Cost Price (INR)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IndianRupee size={16} className="text-slate-400" />
                </div>
                <input
                  type="number"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value ? Number(e.target.value) : "")}
                  className="pl-10 w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition outline-none"
                  placeholder="e.g. 500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Selling Price (INR)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IndianRupee size={16} className="text-slate-400" />
                </div>
                <input
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value ? Number(e.target.value) : "")}
                  className="pl-10 w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition outline-none"
                  placeholder="e.g. 1200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Platform Fee (%)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Percent size={16} className="text-slate-400" />
                </div>
                <input
                  type="number"
                  value={platformFeePercent}
                  onChange={(e) => setPlatformFeePercent(e.target.value ? Number(e.target.value) : "")}
                  className="pl-10 w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition outline-none"
                  placeholder="10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Shipping Cost (INR)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IndianRupee size={16} className="text-slate-400" />
                </div>
                <input
                  type="number"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(e.target.value ? Number(e.target.value) : "")}
                  className="pl-10 w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition outline-none"
                  placeholder="e.g. 60"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tax/GST (%)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Percent size={16} className="text-slate-400" />
                </div>
                <input
                  type="number"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(e.target.value ? Number(e.target.value) : "")}
                  className="pl-10 w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition outline-none"
                  placeholder="18"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl sticky top-8">
            <h2 className="text-xl font-medium mb-6 text-slate-200">Profit Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-slate-300 text-sm">
                <span>Selling Price</span>
                <span>â‚¹ {Number(sellingPrice || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300 text-sm">
                <span>Cost Price</span>
                <span className="text-rose-400">- â‚¹ {Number(costPrice || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300 text-sm">
                <span>Platform Fee</span>
                <span className="text-rose-400">- â‚¹ {results.platformFeeAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300 text-sm">
                <span>Tax</span>
                <span className="text-rose-400">- â‚¹ {results.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300 text-sm">
                <span>Shipping</span>
                <span className="text-rose-400">- â‚¹ {Number(shippingCost || 0).toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-6">
              <div className="flex justify-between items-end mb-2">
                <span className="text-slate-200 font-medium">Net Earnings</span>
                <span className={`text-3xl font-bold ${results.netEarnings >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  â‚¹ {results.netEarnings.toFixed(2)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-800 p-3 rounded-lg text-center">
                  <p className="text-xs text-slate-400 mb-1">Margin</p>
                  <p className={`font-semibold ${results.margin >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {results.margin.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-slate-800 p-3 rounded-lg text-center">
                  <p className="text-xs text-slate-400 mb-1">ROI</p>
                  <p className={`font-semibold ${results.roi >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {results.roi.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
