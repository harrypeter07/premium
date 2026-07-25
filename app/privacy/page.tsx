import React from 'react';
import { Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-brand-purple text-xs font-bold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          <span>Legal & Compliance</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white">Privacy Policy</h1>
        <p className="text-xs text-gray-400 font-mono">Last updated: July 24, 2026</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6 text-sm text-gray-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-bold text-lg text-white">1. Information We Collect</h2>
          <p>We respect your privacy. We collect minimal telemetry data including page views, watch duration, device operating system, and country location to optimize high-speed Cloudflare CDN edge streaming performance.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-lg text-white">2. Google AdSense & Third-Party Cookies</h2>
          <p>Google AdSense may use cookies to serve personalized advertisements based on your visits to this website. You can opt out of personalized advertising by visiting Google Ad Settings.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-lg text-white">3. Local Storage</h2>
          <p>Your saved bookmarks and watch history are stored locally in your web browser. You can clear your local history at any time from the History page.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-lg text-white">4. Contact Us</h2>
          <p>For questions regarding our privacy practices, email press@elenavance.com.</p>
        </section>
      </div>
    </div>
  );
}
