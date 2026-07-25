import React from 'react';
import { Shield } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-brand-purple text-xs font-bold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          <span>Terms of Use</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white">Terms of Service</h1>
        <p className="text-xs text-gray-400 font-mono">Last updated: July 24, 2026</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6 text-sm text-gray-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-bold text-lg text-white">1. Copyright & Intellectual Property</h2>
          <p>All imagery, editorial video cuts, and branding on this platform are protected by international copyright laws. Un-authorized commercial distribution or web scraping is strictly prohibited.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-lg text-white">2. Affiliate Disclosure</h2>
          <p>Some links on this site are affiliate links. If you purchase products through these links, we may earn a small referral commission at no additional cost to you.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-lg text-white">3. Platform Modifications</h2>
          <p>We reserve the right to modify media availability, membership passes, or platform features at any time without prior notice.</p>
        </section>
      </div>
    </div>
  );
}
