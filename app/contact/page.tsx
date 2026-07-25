'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-brand-purple text-xs font-bold uppercase tracking-wider">
          <Mail className="w-3.5 h-3.5" />
          <span>Press & Booking Inquiries</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white">Contact Smriti Shah Management</h1>
        <p className="text-xs sm:text-sm text-gray-300">
          For modeling bookings, brand sponsorships, media syndication, and private gallery print acquisitions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-3">
          <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-1">
            <Mail className="w-4 h-4 text-brand-purple" />
            <h4 className="text-xs font-bold text-white uppercase font-mono">Management Email</h4>
            <p className="text-xs text-gray-300">smritishans@gmail.com</p>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-1">
            <MapPin className="w-4 h-4 text-brand-purple" />
            <h4 className="text-xs font-bold text-white uppercase font-mono">Agencies & Locations</h4>
            <p className="text-xs text-gray-300">Mumbai • Paris • London</p>
          </div>
        </div>

        <div className="md:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
          {submitted ? (
            <div className="p-6 text-center text-white space-y-2">
              <CheckCircle className="w-8 h-8 text-brand-purple mx-auto" />
              <h3 className="font-bold text-base">Inquiry Submitted</h3>
              <p className="text-xs text-gray-300">Smriti Shah&apos;s team will review your proposal and respond to smritishans@gmail.com within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Your Full Name</label>
                  <input required type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-purple" />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Email Address</label>
                  <input required type="email" placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-purple" />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Subject</label>
                <input required type="text" placeholder="Campaign Inquiry / Fine Art Acquisition" className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-purple" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Message</label>
                <textarea required rows={4} placeholder="Write your proposal details..." className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-purple" />
              </div>
              <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-accent text-white font-bold text-xs shadow-neon hover:opacity-90 transition-all flex items-center justify-center gap-2">
                <Send className="w-3.5 h-3.5" />
                <span>Send Direct Proposal</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
