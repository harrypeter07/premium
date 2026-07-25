'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Check, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardFooter } from './card';

export default function GDPRConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);
  const [adsConsent, setAdsConsent] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('smr_gdpr_consent')) setShowBanner(true);
  }, []);

  const save = (analytics: boolean, ads: boolean) => {
    localStorage.setItem('smr_gdpr_consent', JSON.stringify({
      necessary: true, analytics, ads, tcfCompliant: true, timestamp: new Date().toISOString(),
    }));
    setShowBanner(false);
    setShowModal(false);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Compact bottom-right cookie banner */}
      <div className="fixed bottom-4 right-4 z-50 w-80 animate-in slide-in-from-bottom-4 fade-in duration-300">
        <Card className="border border-zinc-700 bg-zinc-900/95 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardContent className="p-4 space-y-3">
            {/* Header Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-xs font-semibold text-white">Cookie Consent</span>
              </div>
              <span className="text-[9px] text-zinc-500 font-mono">EEA / UK / CH</span>
            </div>

            {/* Short description always visible */}
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              We use cookies to serve ads and measure performance.{' '}
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-violet-400 hover:text-violet-300 underline underline-offset-2 inline-flex items-center gap-0.5"
              >
                {expanded ? 'Hide details' : 'Show details'}
                {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </p>

            {/* Collapsible details */}
            {expanded && (
              <div className="space-y-2 border-t border-zinc-700 pt-2">
                <div className="flex items-center justify-between py-1.5">
                  <div>
                    <p className="text-[11px] font-medium text-white">Strictly Necessary</p>
                    <p className="text-[9px] text-zinc-500">Site security &amp; streaming</p>
                  </div>
                  <span className="text-[9px] text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded">Always on</span>
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <div>
                    <p className="text-[11px] font-medium text-white">Analytics</p>
                    <p className="text-[9px] text-zinc-500">Performance &amp; engagement</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={analyticsConsent} onChange={e => setAnalyticsConsent(e.target.checked)} />
                    <div className="w-7 h-4 bg-zinc-700 peer-checked:bg-violet-600 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:w-3 after:h-3 after:transition-all peer-checked:after:translate-x-3" />
                  </label>
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <div>
                    <p className="text-[11px] font-medium text-white">Advertising (TCF v2.2)</p>
                    <p className="text-[9px] text-zinc-500">Google AdSense personalization</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={adsConsent} onChange={e => setAdsConsent(e.target.checked)} />
                    <div className="w-7 h-4 bg-zinc-700 peer-checked:bg-violet-600 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:w-3 after:h-3 after:transition-all peer-checked:after:translate-x-3" />
                  </label>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="p-3 pt-0 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => save(false, false)}
              className="flex-1 h-8 text-[11px] text-zinc-400 hover:text-white"
            >
              Reject
            </Button>
            {expanded && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => save(analyticsConsent, adsConsent)}
                className="flex-1 h-8 text-[11px] border-zinc-700"
              >
                Save
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => save(true, true)}
              className="flex-1 h-8 text-[11px] bg-violet-600 hover:bg-violet-500 text-white border-0"
            >
              <Check className="w-3 h-3 mr-1" />
              Accept All
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
