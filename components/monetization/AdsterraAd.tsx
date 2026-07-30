'use client';

import React, { useEffect, useRef } from 'react';

interface AdsterraAdProps {
  type: 'NATIVE_BANNER' | 'BANNER_160X300' | 'BANNER_320X50';
}

export default function AdsterraAd({ type }: AdsterraAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear previous children
    containerRef.current.innerHTML = '';
    const container = containerRef.current;

    try {
      if (type === 'NATIVE_BANNER') {
        const script = document.createElement('script');
        script.async = true;
        script.setAttribute('data-cfasync', 'false');
        script.src = 'https://pl30595676.effectivecpmnetwork.com/ce21ab37b7a8836864c8c19be4b3207c/invoke.js';
        
        const div = document.createElement('div');
        div.id = 'container-ce21ab37b7a8836864c8c19be4b3207c';
        
        container.appendChild(script);
        container.appendChild(div);
      } else if (type === 'BANNER_160X300') {
        const atScript = document.createElement('script');
        // Define options globally
        (window as any).atOptions = {
          'key': 'd62d3a0f9e4cdbd384c5de81d2fcbdd9',
          'format': 'iframe',
          'height': 300,
          'width': 160,
          'params': {}
        };
        
        const invokeScript = document.createElement('script');
        invokeScript.src = 'https://www.highperformanceformat.com/d62d3a0f9e4cdbd384c5de81d2fcbdd9/invoke.js';
        
        container.appendChild(invokeScript);
      } else if (type === 'BANNER_320X50') {
        const atScript = document.createElement('script');
        // Define options globally
        (window as any).atOptions = {
          'key': 'b6f26b5dda096cc3109e31a441ed646c',
          'format': 'iframe',
          'height': 50,
          'width': 320,
          'params': {}
        };
        
        const invokeScript = document.createElement('script');
        invokeScript.src = 'https://www.highperformanceformat.com/b6f26b5dda096cc3109e31a441ed646c/invoke.js';
        
        container.appendChild(invokeScript);
      }
    } catch (e) {
      console.warn('Adsterra element initialization skipped:', e);
    }
  }, [type]);

  return (
    <div className="flex flex-col items-center justify-center my-2 overflow-hidden min-h-[50px] w-full">
      <span className="text-[9px] uppercase font-mono text-zinc-500 mb-1.5 tracking-widest">Sponsored Link</span>
      <div ref={containerRef} className="w-full flex justify-center items-center" />
    </div>
  );
}
