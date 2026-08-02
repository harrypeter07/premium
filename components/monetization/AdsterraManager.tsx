'use client';

import React, { useEffect } from 'react';

export default function AdsterraManager() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ((window as any).adsterra_popunder_loaded) return;

    let clickCount = 0;

    const injectPopunder = () => {
      if ((window as any).adsterra_popunder_loaded) return;
      (window as any).adsterra_popunder_loaded = true;

      // Dynamically load the Adsterra Popunder Script after user interaction criteria met
      const script = document.createElement('script');
      script.src = 'https://pl30595675.effectivecpmnetwork.com/19/65/40/196540cfdbb2eec6ba55744cc20886e7.js';
      script.async = true;
      document.head.appendChild(script);

      // Clean up global click listener
      document.removeEventListener('click', handleGlobalClick);
    };

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Skip click count increment for navigation, headers, buttons, anchors, and media grid card posts
      const isNavLink = 
        target.closest('header') || 
        target.closest('a') || 
        target.closest('button') ||
        target.closest('.masonry-item') ||
        target.closest('.glass-card') ||
        target.closest('.glass-panel') ||
        target.closest('[role="dialog"]');
      if (isNavLink) return;

      clickCount += 1;
      // Triggers Popunder ONLY after 2 global user interaction clicks
      if (clickCount >= 2) {
        injectPopunder();
      }
    };

    // Bind global click observer
    document.addEventListener('click', handleGlobalClick);

    // Fallback: Trigger Popunder after user stays on the website for 15 seconds
    const timeout = setTimeout(() => {
      injectPopunder();
    }, 15000);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
      clearTimeout(timeout);
    };
  }, []);

  return null;
}
