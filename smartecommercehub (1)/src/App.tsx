import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Sidebar } from "./components/layout/Sidebar";
import { useState } from "react";

// Pre-define pages before creating them for routing
import Home from "./pages/Home";
import About from "./pages/About";
import Tools from "./pages/Tools";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import DashboardIndex from "./pages/dashboard/DashboardIndex";
import ProfitCalculator from "./pages/dashboard/ProfitCalculator";
import ProductSearch from "./pages/dashboard/ProductSearch";
import AIAssistant from "./pages/dashboard/AIAssistant";
import Pricing from "./pages/dashboard/Pricing";
import Settings from "./pages/dashboard/Settings";
import Profile from "./pages/dashboard/Profile";
import Analytics from "./pages/dashboard/Analytics";
import LegalSettings from "./pages/legal/LegalPages"; // Generic wrapper for legal 
import Checkout from "./pages/checkout/Checkout";
import Contact from "./pages/Contact";
import SharedChat from "./pages/public/SharedChat";

function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
          <span className="font-bold text-slate-900">Dashboard</span>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -mr-2 bg-slate-100 rounded-md">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/legal/:slug" element={<LegalSettings />} />
        </Route>
        
        <Route path="/shared/:id" element={<SharedChat />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardIndex />} />
          <Route path="profit-calculator" element={<ProfitCalculator />} />
          <Route path="product-search" element={<ProductSearch />} />
          <Route path="assistant" element={<AIAssistant />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
