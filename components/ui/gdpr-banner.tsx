'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
import { Badge } from './badge';
import { Shield, Settings, Check } from 'lucide-react';

export default function GDPRConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);
  const [adsConsent, setAdsConsent] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('smr_gdpr_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(
      'smr_gdpr_consent',
      JSON.stringify({
        necessary: true,
        analytics: true,
        ads: true,
        tcfCompliant: true,
        timestamp: new Date().toISOString(),
      })
    );
    setShowBanner(false);
    setShowManageModal(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem(
      'smr_gdpr_consent',
      JSON.stringify({
        necessary: true,
        analytics: false,
        ads: false,
        tcfCompliant: true,
        timestamp: new Date().toISOString(),
      })
    );
    setShowBanner(false);
    setShowManageModal(false);
  };

  const handleSaveCustomPreferences = () => {
    localStorage.setItem(
      'smr_gdpr_consent',
      JSON.stringify({
        necessary: true,
        analytics: analyticsConsent,
        ads: adsConsent,
        tcfCompliant: true,
        timestamp: new Date().toISOString(),
      })
    );
    setShowBanner(false);
    setShowManageModal(false);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Bottom Sticky Floating GDPR CMP Consent Banner */}
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5">
        <Card className="border border-brand-purple/40 shadow-2xl bg-[#140f21]/95">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Badge variant="default" className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-brand-purple" />
                <span>GDPR & IAB TCF Compliant</span>
              </Badge>
              <span className="text-[10px] text-gray-400 font-mono">EEA / UK / CH</span>
            </div>
            <CardTitle className="text-sm mt-1">Privacy & Cookie Consent</CardTitle>
            <CardDescription className="text-[11px] text-gray-300 leading-relaxed">
              We and our partners (Google AdSense) use cookies and user data to deliver personalized ads, measure audience insights, and optimize high-resolution media streaming.
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex flex-wrap items-center justify-end gap-2 pt-0">
            <Button variant="ghost" size="sm" onClick={() => setShowManageModal(true)} className="text-[11px]">
              <Settings className="w-3.5 h-3.5 mr-1" />
              Manage Options
            </Button>
            <Button variant="secondary" size="sm" onClick={handleRejectAll} className="text-[11px]">
              Do Not Consent
            </Button>
            <Button variant="gradient" size="sm" onClick={handleAcceptAll} className="text-[11px]">
              <Check className="w-3.5 h-3.5 mr-1" />
              Consent
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Preferences Dialog Modal */}
      {showManageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d0917]/90 backdrop-blur-xl animate-in fade-in">
          <Card className="w-full max-w-lg border border-brand-purple/40 shadow-2xl bg-[#181326] space-y-4 p-6">
            <CardHeader className="p-0">
              <Badge variant="default" className="w-fit mb-1">
                Transparency & Consent Framework (TCF v2.2)
              </Badge>
              <CardTitle className="text-lg">Cookie Preferences & Privacy Settings</CardTitle>
              <CardDescription className="text-xs">
                Customize your consent choices for personalized advertising and telemetry.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0 space-y-3 text-xs">
              {/* Strictly Necessary */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">Strictly Necessary Cookies</h4>
                  <p className="text-[10px] text-gray-400">Required for media streaming, security, and site functionality.</p>
                </div>
                <Badge variant="success">Always Active</Badge>
              </div>

              {/* Analytics */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">Analytics & Performance Telemetry</h4>
                  <p className="text-[10px] text-gray-400">Helps us measure audience engagement and video playback speeds.</p>
                </div>
                <input
                  type="checkbox"
                  checked={analyticsConsent}
                  onChange={(e) => setAnalyticsConsent(e.target.checked)}
                  className="w-4 h-4 accent-brand-purple rounded cursor-pointer"
                />
              </div>

              {/* Ad Personalization */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">Google AdSense Personalization (TCF v2.2)</h4>
                  <p className="text-[10px] text-gray-400">Used by Google certified CMP partners to serve relevant ads in EEA/UK/CH.</p>
                </div>
                <input
                  type="checkbox"
                  checked={adsConsent}
                  onChange={(e) => setAdsConsent(e.target.checked)}
                  className="w-4 h-4 accent-brand-purple rounded cursor-pointer"
                />
              </div>
            </CardContent>

            <CardFooter className="p-0 flex items-center justify-between pt-2 border-t border-white/10">
              <Button variant="ghost" size="sm" onClick={() => setShowManageModal(false)}>
                Cancel
              </Button>
              <Button variant="gradient" size="sm" onClick={handleSaveCustomPreferences}>
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
