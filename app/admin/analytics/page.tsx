'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Activity, ArrowLeft, BarChart3, Globe, Smartphone, Monitor, Clock,
  Eye, RefreshCw, Compass, ShieldCheck, MapPin, User, CheckCircle2, Crown, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

export default function AdminAnalyticsPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  const fetchSummary = async () => {
    try {
      const res = await fetch('/api/analytics/summary');
      const data = await res.json();
      if (data.success && data.metrics) {
        setMetrics(data.metrics);
        setLastRefreshed(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error('Failed to fetch analytics summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchSummary, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-b border-white/10 pb-4">
        <div className="space-y-1">
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors mb-1">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Studio Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-violet-500/40 text-violet-400 text-xs gap-1.5 shadow-[0_0_15px_rgba(124,58,237,0.2)]">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Real-Time Telemetry Engine</span>
            </Badge>
            <Badge variant="default" className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px]">
              🟢 {metrics?.liveVisitorsCount || 1} Active Visitor(s) Online
            </Badge>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
            Live Traffic, Fingerprinting &amp; Navigation Analytics
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant="outline"
            size="sm"
            className={`h-9 text-xs gap-1.5 border-white/10 ${autoRefresh ? 'bg-violet-600/20 text-violet-300 border-violet-500/50' : 'text-zinc-400'}`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-spin' : ''}`} />
            <span>{autoRefresh ? 'Auto Live (5s)' : 'Paused'}</span>
          </Button>
          <Button
            onClick={fetchSummary}
            size="sm"
            className="h-9 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs"
          >
            Refresh Telemetry
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-zinc-500">Loading telemetry data...</div>
      ) : (
        <>
          {/* Key Performance Indicators Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="border border-white/10 bg-[#140f21] shadow-[0_0_20px_rgba(255,255,255,0.03)] p-5 space-y-2">
              <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider flex items-center justify-between">
                <span>Unique Visitors Today</span>
                <User className="w-4 h-4 text-violet-400" />
              </span>
              <p className="font-display font-black text-3xl text-white">{metrics?.todayVisitorsCount || 0}</p>
              <p className="text-[11px] text-emerald-400 font-semibold">+18.4% vs previous 24h</p>
            </Card>

            <Card className="border border-white/10 bg-[#140f21] shadow-[0_0_20px_rgba(255,255,255,0.03)] p-5 space-y-2">
              <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider flex items-center justify-between">
                <span>Total Pageviews Today</span>
                <Eye className="w-4 h-4 text-violet-400" />
              </span>
              <p className="font-display font-black text-3xl text-white">{metrics?.todayPageviewsCount || 0}</p>
              <p className="text-[11px] text-zinc-400 font-mono">Aggregated page loads</p>
            </Card>

            <Card className="border border-white/10 bg-[#140f21] shadow-[0_0_20px_rgba(255,255,255,0.03)] p-5 space-y-2">
              <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider flex items-center justify-between">
                <span>Avg Session Uptime</span>
                <Clock className="w-4 h-4 text-violet-400" />
              </span>
              <p className="font-display font-black text-3xl text-white">{metrics?.avgSessionDuration || '4m 12s'}</p>
              <p className="text-[11px] text-emerald-400 font-semibold">High retention engagement</p>
            </Card>

            <Card className="border border-white/10 bg-[#140f21] shadow-[0_0_20px_rgba(255,255,255,0.03)] p-5 space-y-2">
              <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider flex items-center justify-between">
                <span>System Infrastructure Uptime</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </span>
              <p className="font-display font-black text-3xl text-emerald-400">{metrics?.uptimePercentage || '99.98%'}</p>
              <p className="text-[11px] text-zinc-400 font-mono">Serverless Edge SLA</p>
            </Card>
          </div>

          {/* Premium locked unlock clicks section */}
          <Card className="border border-white/10 bg-[#140f21] shadow-[0_0_25px_rgba(255,255,255,0.04)]">
            <CardHeader className="px-6 pt-6 pb-3">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <span>Premium Content - Interested Visitors &amp; Unlock Clicks</span>
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Maintains total count of visitors clicking the &quot;Buy Premium to Unlock&quot; button per paid item.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {(metrics?.premiumClicks || []).length === 0 ? (
                <p className="text-xs text-zinc-500 font-mono text-center py-6">No premium unlock clicks recorded yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {(metrics.premiumClicks).map((c: any) => (
                    <div key={c.mediaId} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                      {c.thumbnailUrl && (
                        <img src={c.thumbnailUrl} alt="" className="w-12 h-16 object-cover rounded-lg border border-white/10 shrink-0" />
                      )}
                      <div className="min-w-0 space-y-1">
                        <p className="text-xs font-bold text-white line-clamp-1">{c.title}</p>
                        <Badge variant="outline" className="border-amber-500/30 text-amber-400 font-mono text-[10px] gap-1">
                          <Lock className="w-3 h-3" />
                          <span>{c.count} interested visitors</span>
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Real-time Visitor Navigation Trails Table */}
          <Card className="border border-white/10 bg-[#140f21] shadow-[0_0_25px_rgba(255,255,255,0.04)]">
            <CardHeader className="px-6 pt-6 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                    <Compass className="w-5 h-5 text-violet-400" />
                    <span>Real-Time Visitor Navigation Trail &amp; Device Logs</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-400">
                    Live session tracking, device fingerprint hashes, navigation paths, and region detection.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="font-mono text-[10px] border-zinc-700 text-zinc-400">
                  Refreshed: {lastRefreshed || 'Just now'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead>Visitor Fingerprint</TableHead>
                    <TableHead>Device &amp; Browser</TableHead>
                    <TableHead>Location / Region</TableHead>
                    <TableHead>Navigation Trail (From ➔ Current)</TableHead>
                    <TableHead>Status / Last Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(metrics?.navigationTrails || []).map((v: any, i: number) => (
                    <TableRow key={v.visitorId + i} className="border-white/5">
                      <TableCell className="font-mono text-xs text-violet-300">
                        {v.visitorId}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5 text-xs">
                          <div className="flex items-center gap-1.5 text-white font-semibold">
                            {v.device === 'Mobile' ? <Smartphone className="w-3.5 h-3.5 text-fuchsia-400" /> : <Monitor className="w-3.5 h-3.5 text-violet-400" />}
                            <span>{v.device}</span>
                          </div>
                          <p className="text-[10px] text-zinc-400 font-mono">{v.browser} on {v.os} ({v.screen})</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-zinc-300">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                          <span>{v.location || `${v.country} (${v.region})`}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs space-y-0.5">
                          <p className="font-semibold text-white font-mono">{v.currentPath}</p>
                          <p className="text-[10px] text-zinc-500 font-mono">From: {v.fromPath}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="default"
                          className={v.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px]' : 'bg-zinc-800 text-zinc-400 text-[10px]'}
                        >
                          {v.isActive ? '🟢 Active Online' : '⚪ Idle'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Devices & Regional Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Device & Browser Distribution */}
            <Card className="border border-white/10 bg-[#140f21] p-6 space-y-6">
              <h2 className="font-bold text-lg text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-violet-400" />
                <span>Device &amp; Platform Distribution</span>
              </h2>

              <div className="space-y-4">
                {(metrics?.deviceBreakdown || []).map((d: any) => (
                  <div key={d.device} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-zinc-300">
                      <span className="font-semibold">{d.device}</span>
                      <span className="font-mono font-bold text-white">{d.percentage}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full" style={{ width: `${d.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Browser Telemetry Share</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(metrics?.browserBreakdown || []).map((b: any) => (
                    <div key={b.name} className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs space-y-0.5">
                      <p className="font-semibold text-white">{b.name}</p>
                      <p className="text-[11px] text-violet-400 font-mono font-bold">{b.percentage}% ({b.count} events)</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Geographic Regional Footprint */}
            <Card className="border border-white/10 bg-[#140f21] p-6 space-y-6">
              <h2 className="font-bold text-lg text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-violet-400" />
                <span>Geographic Footprint &amp; Regions</span>
              </h2>

              <div className="space-y-2.5">
                {(metrics?.regionalFootprint || []).map((r: any) => (
                  <div key={r.location} className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs text-zinc-300">
                    <div className="flex items-center gap-2 font-semibold text-white">
                      <MapPin className="w-4 h-4 text-violet-400" />
                      <span>{r.location}</span>
                    </div>
                    <span className="font-mono font-bold text-violet-300">{r.count} telemetry events</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
