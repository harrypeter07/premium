'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Check, Heart, Sparkles } from 'lucide-react';

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MembershipModal({ isOpen, onClose }: MembershipModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'supporter' | 'vip' | 'collector'>('vip');
  const [tipAmount, setTipAmount] = useState<number>(250);

  if (!isOpen) return null;

  const handlePlanClick = async (plan: 'supporter' | 'vip' | 'collector') => {
    setSelectedPlan(plan);
    
    // Log CREATOR_APP_CLICK in Analytics database
    try {
      const visitorId = localStorage.getItem('smr_visitor_id') || 'anon';
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'CREATOR_APP_CLICK',
          path: window.location.pathname,
          visitorId,
          referrer: `Tier Card: ${plan}`,
        }),
      });
    } catch (err) {
      console.error('Failed to track creator app click:', err);
    }

    // Redirect to Creator App website
    window.open('https://smritishans.mywebsite.social/', '_blank');
  };

  const handleCtaClick = async () => {
    // Log CREATOR_APP_CLICK in Analytics database
    try {
      const visitorId = localStorage.getItem('smr_visitor_id') || 'anon';
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'CREATOR_APP_CLICK',
          path: window.location.pathname,
          visitorId,
          referrer: `CTA Button: ${selectedPlan}`,
        }),
      });
    } catch (err) {
      console.error('Failed to track creator app click:', err);
    }

    // Redirect to Creator App website
    window.open('https://smritishans.mywebsite.social/', '_blank');
    onClose();
  };

  const handleTipClick = async (amt: number) => {
    setTipAmount(amt);

    // Log CREATOR_APP_CLICK in Analytics database
    try {
      const visitorId = localStorage.getItem('smr_visitor_id') || 'anon';
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'CREATOR_APP_CLICK',
          path: window.location.pathname,
          visitorId,
          referrer: `Tip Jar: ₹${amt}`,
        }),
      });
    } catch (err) {
      console.error('Failed to track creator app click:', err);
    }

    // Redirect to Creator App website
    window.open('https://smritishans.mywebsite.social/', '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-3xl bg-zinc-950 border border-brand-purple/40 rounded-3xl p-6 sm:p-8 shadow-2xl my-auto text-white overflow-hidden"
        >
          {/* Top Decorative Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-purple/20 blur-[100px] pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full glass-card hover:bg-white/20 text-gray-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center max-w-xl mx-auto space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/50 text-brand-purple text-xs font-bold uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5" />
              <span>Collector & Membership Pass</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
              Unlock Exclusive Archives & Early Releases
            </h2>
            <p className="text-sm text-gray-300">
              Support independent fine art photography, unedited 4K editorial video cuts, and private studio livestreams.
            </p>
          </div>

          {/* Pricing Tiers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {/* Supporter Tier */}
            <div
              onClick={() => handlePlanClick('supporter')}
              className={`p-5 rounded-2xl cursor-pointer border transition-all ${
                selectedPlan === 'supporter'
                  ? 'bg-brand-purple/10 border-brand-purple shadow-neon'
                  : 'glass-card border-white/10 hover:border-white/20'
              }`}
            >
              <h3 className="font-bold text-sm text-white mb-1">Supporter</h3>
              <p className="font-display font-extrabold text-xl text-white mb-3">₹99<span className="text-xs font-normal text-gray-400">/mo</span></p>
              <ul className="space-y-2 text-xs text-gray-300">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-brand-purple" /> 4K Ultra HD Streaming</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-brand-purple" /> Ad-Free Experience</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-brand-purple" /> Supporter Badge</li>
              </ul>
            </div>

            {/* VIP All-Access */}
            <div
              onClick={() => handlePlanClick('vip')}
              className={`relative p-5 rounded-2xl cursor-pointer border transition-all ${
                selectedPlan === 'vip'
                  ? 'bg-gradient-to-b from-brand-purple/30 to-brand-accent/20 border-brand-accent shadow-neon'
                  : 'glass-card border-white/10 hover:border-white/20'
              }`}
            >
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-brand-accent text-white shadow-md">
                Most Popular
              </span>
              <h3 className="font-bold text-sm text-white mb-1">VIP All-Access</h3>
              <p className="font-display font-extrabold text-xl text-white mb-3">₹299<span className="text-xs font-normal text-gray-400">/mo</span></p>
              <ul className="space-y-2 text-xs text-gray-300">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-brand-accent" /> All Supporter Perks</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-brand-accent" /> Unedited Editorial Raw Cuts</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-brand-accent" /> Private Studio Q&A Sessions</li>
              </ul>
            </div>

            {/* Collector VIP */}
            <div
              onClick={() => handlePlanClick('collector')}
              className={`p-5 rounded-2xl cursor-pointer border transition-all ${
                selectedPlan === 'collector'
                  ? 'bg-brand-purple/10 border-brand-purple shadow-neon'
                  : 'glass-card border-white/10 hover:border-white/20'
              }`}
            >
              <h3 className="font-bold text-sm text-white mb-1">Collector Patron</h3>
              <p className="font-display font-extrabold text-xl text-white mb-3">₹999<span className="text-xs font-normal text-gray-400">/mo</span></p>
              <ul className="space-y-2 text-xs text-gray-300">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-brand-purple" /> Signed Archival Fine Art Print</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-brand-purple" /> Direct Producer Access</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-brand-purple" /> VIP Gala Invitation</li>
              </ul>
            </div>
          </div>

          {/* One-Time Support Tip Jar */}
          <div className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent">
                <Heart className="w-5 h-5 fill-brand-accent" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">One-Time Studio Tip Jar</h4>
                <p className="text-[11px] text-gray-400">Send a quick gesture of support for upcoming travel films.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {[100, 250, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleTipClick(amt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    tipAmount === amt ? 'bg-brand-accent text-white shadow-neon' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Action CTA */}
          <button
            onClick={handleCtaClick}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-accent text-white font-bold text-sm shadow-neon hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <Crown className="w-4 h-4" />
            <span>Join {selectedPlan.toUpperCase()} Membership Pass</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
