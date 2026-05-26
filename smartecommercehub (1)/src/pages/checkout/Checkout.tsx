import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan;

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "netbanking" | "wallet">("card");

  useEffect(() => {
    // If no plan is passed, redirect back to pricing
    if (!plan) {
      navigate("/dashboard/pricing");
    }
  }, [plan, navigate]);

  if (!plan) return null;

  const handlePayment = async () => {
    setIsLoading(true);
    setStatus("idle");
    setErrorMessage("");
    
    try {
      // 1. Create order on backend
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: plan.name })
      });
      
      const order = await res.json();
      if (!res.ok) throw new Error(order.error || "Failed to create order");
      
      // 2. Initialize Razorpay popup
      const options = {
        key: order.key_id, 
        amount: order.amount,
        currency: order.currency,
        name: "SmartEcommerceHub",
        description: `${plan.name} Subscription`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response)
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.status === "success") {
              setStatus("success");
            } else {
              setStatus("error");
              setErrorMessage("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            setStatus("error");
            setErrorMessage("Error verifying payment.");
          }
        },
        prefill: {
          name: "Ecommerce User",
          email: "user@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#4f46e5"
        }
      };
      
      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setStatus("error");
        setErrorMessage(response.error.description || "Payment failed");
      });
      rzp.open();
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Failed to initiate payment");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center border border-slate-100">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Upgrade Successful!</h2>
          <p className="text-slate-500 mb-8">Your payment of ₹{plan.price} using {paymentMethod.toUpperCase()} was successful. You are now on the {plan.name} plan.</p>
          <Link 
            to="/dashboard" 
            className="block w-full py-3.5 px-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-8 transition"
        >
          <ArrowLeft size={16} className="mr-2" />
          Cancel & Return to Pricing
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Payment Details</h2>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md border border-slate-200">Secure Checkout</span>
            </div>
            
            {status === "error" && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                <AlertCircle className="text-red-500 shrink-0" size={20} />
                <p className="text-sm font-medium text-red-700">{errorMessage}</p>
              </div>
            )}

            <div className="flex border-b border-slate-200 mb-6 overflow-x-auto hide-scrollbar">
              <button 
                onClick={() => setPaymentMethod("card")}
                className={`py-3 px-4 text-sm font-medium whitespace-nowrap border-b-2 transition ${paymentMethod === 'card' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                Credit / Debit Card
              </button>
              <button 
                onClick={() => setPaymentMethod("upi")}
                className={`py-3 px-4 text-sm font-medium whitespace-nowrap border-b-2 transition ${paymentMethod === 'upi' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                UPI
              </button>
              <button 
                onClick={() => setPaymentMethod("netbanking")}
                className={`py-3 px-4 text-sm font-medium whitespace-nowrap border-b-2 transition ${paymentMethod === 'netbanking' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                Net Banking
              </button>
              <button 
                onClick={() => setPaymentMethod("wallet")}
                className={`py-3 px-4 text-sm font-medium whitespace-nowrap border-b-2 transition ${paymentMethod === 'wallet' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                Wallets
              </button>
            </div>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
              {paymentMethod === "card" && (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Card Information</label>
                    <div className="border border-slate-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition shadow-sm">
                      <input type="text" placeholder="Card number" required className="w-full px-4 py-3 border-b border-slate-300 focus:outline-none" />
                      <div className="flex">
                        <input type="text" placeholder="MM / YY" required className="w-1/2 px-4 py-3 border-r border-slate-300 focus:outline-none" />
                        <input type="password" placeholder="CVC" required className="w-1/2 px-4 py-3 focus:outline-none" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Name on Card</label>
                    <input type="text" placeholder="Full Name" required className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition outline-none" />
                  </div>
                </div>
              )}

              {paymentMethod === "upi" && (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 pt-2">
                  <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl mb-4">
                    <p className="text-sm text-slate-600">Scan QR or enter UPI ID to complete the payment.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">UPI ID</label>
                    <input type="text" placeholder="username@upi" required className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition outline-none" />
                  </div>
                </div>
              )}

              {paymentMethod === "netbanking" && (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 pt-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Select Bank</label>
                    <select required className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition outline-none appearance-none">
                      <option value="">Choose your bank</option>
                      <option value="sbi">State Bank of India</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="axis">Axis Bank</option>
                      <option value="kotak">Kotak Mahindra Bank</option>
                    </select>
                  </div>
                </div>
              )}

              {paymentMethod === "wallet" && (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 pt-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Select Wallet</label>
                    <select required className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition outline-none appearance-none">
                      <option value="">Choose a wallet</option>
                      <option value="paytm">Paytm</option>
                      <option value="phonepe">PhonePe</option>
                      <option value="amazon">Amazon Pay</option>
                      <option value="mobikwik">MobiKwik</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100">
                <label className="block text-sm font-medium text-slate-700 mb-2">Billing Email</label>
                <input type="email" placeholder="you@company.com" required className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition outline-none" />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 px-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 mt-6 shadow-md"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  `Pay ₹${plan.price}`
                )}
              </button>
              
              <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1.5 mt-4">
                Secured by Razorpay. 256-bit SSL encryption.
              </p>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl sticky top-8">
              <h3 className="text-lg font-medium text-slate-300 mb-6 uppercase tracking-wider">Order Summary</h3>
              
              <div className="flex justify-between items-baseline mb-4">
                <h4 className="text-3xl font-bold">{plan.name}</h4>
                <div className="text-right">
                  <span className="text-2xl font-bold">₹{plan.price}</span>
                  <span className="text-slate-400">{plan.period}</span>
                </div>
              </div>
              
              <p className="text-slate-400 text-sm mb-8 pb-8 border-b border-slate-800">{plan.description}</p>
              
              <div className="space-y-4 mb-8">
                {plan.features.slice(0, 4).map((f: string, i: number) => (
                  <div key={i} className="flex items-center text-sm text-slate-300">
                    <CheckCircle2 size={16} className="text-indigo-400 mr-3 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-800 space-y-3 font-medium">
                <div className="flex justify-between text-slate-300 text-sm">
                  <span>Subtotal</span>
                  <span>₹{plan.price}</span>
                </div>
                <div className="flex justify-between text-slate-300 text-sm">
                  <span>Taxes</span>
                  <span>Calculated at next step</span>
                </div>
                <div className="flex justify-between text-white text-lg mt-4 pt-4 border-t border-slate-800">
                  <span>Total due today</span>
                  <span className="font-bold">₹{plan.price}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
