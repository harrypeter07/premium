'use client';

import React, { useState, useEffect } from 'react';

interface AdsterraAdProps {
  type: 
    | 'NATIVE_BANNER' 
    | 'BANNER_160X300' 
    | 'BANNER_320X50' 
    | 'BANNER_728X90' 
    | 'BANNER_160X600' 
    | 'BANNER_468X60' 
    | 'BANNER_300X250';
}

export default function AdsterraAd({ type }: AdsterraAdProps) {
  const [shouldRender, setShouldRender] = useState(false);

  // Map types to Adsterra keys, widths and heights
  const adMap: Record<string, { key: string; width: number; height: number }> = {
    BANNER_160X300: { key: 'd62d3a0f9e4cdbd384c5de81d2fcbdd9', width: 160, height: 300 },
    BANNER_320X50: { key: 'b6f26b5dda096cc3109e31a441ed646c', width: 320, height: 50 },
    BANNER_728X90: { key: '8352855b3c65fdf4826f41f317905878', width: 728, height: 90 },
    BANNER_160X600: { key: '19c41f8bc4de14517faf8429a966d960', width: 160, height: 600 },
    BANNER_468X60: { key: '5f1f001241e9e9bc449a2e2da67ab962', width: 468, height: 60 },
    BANNER_300X250: { key: '194178c7fb9f316a7f28fc219d192ec1', width: 300, height: 250 },
  };

  useEffect(() => {
    // Delay ad frame loading by 1.5 seconds so it mounts gracefully after main content load finishes
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // 1. Loading Skeletons
  if (!shouldRender) {
    if (type === 'NATIVE_BANNER') {
      return (
        <div className="flex flex-col items-center justify-center my-3 w-full">
          <span className="text-[9px] uppercase font-mono text-zinc-600 mb-1.5 tracking-widest animate-pulse">Loading Sponsor Link...</span>
          <div className="w-full h-32 rounded-2xl bg-zinc-900/60 border border-white/5 animate-pulse flex items-center justify-center">
            <span className="text-[10px] text-zinc-500 font-mono">Premium Fashion Feature</span>
          </div>
        </div>
      );
    }

    const ad = adMap[type];
    if (!ad) return null;

    return (
      <div className="flex flex-col items-center justify-center my-3 w-full">
        <span className="text-[9px] uppercase font-mono text-zinc-600 mb-1.5 tracking-widest animate-pulse">Loading Sponsor...</span>
        <div 
          style={{ width: ad.width, height: ad.height }} 
          className="rounded-2xl bg-zinc-900/60 border border-white/5 animate-pulse flex items-center justify-center"
        >
          <span className="text-[9px] text-zinc-600 font-mono">{ad.width}x{ad.height}</span>
        </div>
      </div>
    );
  }

  // 2. Active Rendered Frames
  if (type === 'NATIVE_BANNER') {
    return (
      <div className="flex flex-col items-center justify-center my-3 overflow-hidden w-full transition-opacity duration-500 opacity-100">
        <span className="text-[9px] uppercase font-mono text-zinc-500 mb-1 tracking-widest">Sponsored Link</span>
        <iframe
          srcDoc={`
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { margin: 0; padding: 0; background: transparent; display: flex; justify-content: center; }
                </style>
              </head>
              <body>
                <script async="async" data-cfasync="false" src="https://pl30595676.effectivecpmnetwork.com/ce21ab37b7a8836864c8c19be4b3207c/invoke.js"></script>
                <div id="container-ce21ab37b7a8836864c8c19be4b3207c"></div>
              </body>
            </html>
          `}
          width="100%"
          height="140"
          frameBorder="0"
          scrolling="no"
          style={{ border: 'none', overflow: 'hidden' }}
        />
      </div>
    );
  }

  const ad = adMap[type];
  if (!ad) return null;

  return (
    <div className="flex flex-col items-center justify-center my-3 overflow-hidden w-full transition-opacity duration-500 opacity-100">
      <span className="text-[9px] uppercase font-mono text-zinc-500 mb-1 tracking-widest">Sponsored Link</span>
      <iframe
        srcDoc={`
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; }
              </style>
            </head>
            <body>
              <script type="text/javascript">
                atOptions = {
                  'key' : '${ad.key}',
                  'format' : 'iframe',
                  'height' : ${ad.height},
                  'width' : ${ad.width},
                  'params' : {}
                };
              </script>
              <script type="text/javascript" src="https://www.highperformanceformat.com/${ad.key}/invoke.js"></script>
            </body>
          </html>
        `}
        width={ad.width}
        height={ad.height}
        frameBorder="0"
        scrolling="no"
        style={{ border: 'none', overflow: 'hidden' }}
      />
    </div>
  );
}
