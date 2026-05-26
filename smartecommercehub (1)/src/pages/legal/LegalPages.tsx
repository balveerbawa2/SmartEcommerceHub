import { useParams } from "react-router-dom";

export default function LegalPages() {
  const { slug } = useParams();
  
  const titles: Record<string, string> = {
    'privacy': 'Privacy Policy',
    'terms': 'Terms of Service',
    'refund': 'Refund Policy',
    'risk': 'Risk Disclaimer',
    'cookie': 'Cookie Policy',
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 min-h-screen">
      <h1 className="text-4xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-200">
        {titles[slug as string] || 'Legal Information'}
      </h1>
      <div className="text-slate-600 space-y-6">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>This is a standard template page for {titles[slug as string] || 'Legal Content'}. For a production environment, complete legal documentation should be reviewed by counsel.</p>
        <p>If you have questions regarding this {titles[slug as string] || 'policy'}, please contact our support team.</p>
      </div>
    </div>
  );
}
