import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-xs">S</div>
              SmartEcommerceHub
            </Link>
            <p className="mt-4 text-sm text-slate-500 max-w-xs">
              Empowering ecommerce entrepreneurs with AI-driven intelligence, profit analysis, and workflow automation.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Product</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link to="/tools" className="hover:text-slate-900">Features</Link></li>
              <li><Link to="/dashboard/pricing" className="hover:text-slate-900">Pricing</Link></li>
              <li><Link to="/dashboard/assistant" className="hover:text-slate-900">AI Tools</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link to="/about" className="hover:text-slate-900">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-slate-900">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link to="/legal/privacy" className="hover:text-slate-900">Privacy Policy</Link></li>
              <li><Link to="/legal/terms" className="hover:text-slate-900">Terms of Service</Link></li>
              <li><Link to="/legal/refund" className="hover:text-slate-900">Refund Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-200 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} SmartEcommerceHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
