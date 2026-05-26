import { Mail, MapPin, Phone } from "lucide-react";

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 min-h-[calc(100vh-64px)]">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Contact Us</h1>
        <p className="text-lg text-slate-600">
          Have questions about SmartEcommerceHub or need help choosing the right plan? Our team is here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h2>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition outline-none" placeholder="Jane" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition outline-none" placeholder="Smith" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition outline-none" placeholder="jane@company.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
              <textarea rows={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition outline-none" placeholder="How can we help you?"></textarea>
            </div>

            <button type="submit" className="w-full py-4 px-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition">
              Send Message
            </button>
          </form>
        </div>

        <div className="space-y-10 lg:pl-10">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                <Mail size={20} />
              </div>
              Email Us
            </h3>
            <p className="text-slate-600 mb-2">Our friendly team is here to help.</p>
            <a href="mailto:support@smartecommercehub.com" className="text-indigo-600 font-medium hover:text-indigo-700 transition">support@smartecommercehub.com</a>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                <MapPin size={20} />
              </div>
              Office
            </h3>
            <p className="text-slate-600 mb-2">Come say hello at our India HQ.</p>
            <p className="text-slate-900 font-medium">100 Tech Park, HSR Layout<br />Bengaluru, Karnataka 560102</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                <Phone size={20} />
              </div>
              Phone
            </h3>
            <p className="text-slate-600 mb-2">Mon-Fri from 9am to 6pm IST.</p>
            <p className="text-slate-900 font-medium">+91 98765 43210</p>
          </div>
        </div>
      </div>
    </div>
  );
}
