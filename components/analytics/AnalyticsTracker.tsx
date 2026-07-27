'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function getVisitorFingerprint(): string {
  if (typeof window === 'undefined') return 'anon';
  let id = localStorage.getItem('smr_visitor_id');
  if (!id) {
    id = `fp-${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
    localStorage.setItem('smr_visitor_id', id);
  }
  return id;
}

function detectDeviceDetails() {
  if (typeof window === 'undefined') {
    return { device: 'Desktop', browser: 'Unknown', os: 'Unknown', screen: '1920x1080' };
  }

  const ua = navigator.userAgent;
  let device = 'Desktop';
  if (/mobile/i.test(ua)) device = 'Mobile';
  else if (/ipad|tablet/i.test(ua)) device = 'Tablet';

  let browser = 'Chrome';
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('OPR') || ua.includes('Opera')) browser = 'Opera';

  let os = 'Windows';
  if (ua.includes('Mac OS')) os = 'macOS';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('Linux')) os = 'Linux';

  const screen = `${window.screen.width}x${window.screen.height}`;

  return { device, browser, os, screen };
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevPathRef = useRef<string | null>(null);

  useEffect(() => {
    const currentPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    const visitorId = getVisitorFingerprint();
    const details = detectDeviceDetails();
    const referrer = typeof document !== 'undefined' ? document.referrer : '';

    const payload = {
      type: prevPathRef.current ? 'NAVIGATION' : 'PAGE_VIEW',
      path: currentPath,
      fromPath: prevPathRef.current || null,
      visitorId,
      referrer: referrer || null,
      ...details,
      timestamp: Date.now(),
    };

    // Send tracking data silently
    try {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    } catch {}

    prevPathRef.current = currentPath;
  }, [pathname, searchParams]);

  // Session Heartbeat Uptime Tracking Ping (Every 15s)
  useEffect(() => {
    const interval = setInterval(() => {
      const visitorId = getVisitorFingerprint();
      const details = detectDeviceDetails();
      const currentPath = window.location.pathname;

      try {
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'HEARTBEAT',
            path: currentPath,
            visitorId,
            ...details,
            timestamp: Date.now(),
          }),
          keepalive: true,
        }).catch(() => {});
      } catch {}
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
