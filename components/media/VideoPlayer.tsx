'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, PictureInPicture, Subtitles, Wifi } from 'lucide-react';
import { MultiResolutions } from '@/lib/types';
import { sendAnalyticsEvent } from '@/lib/analytics/tracker';

interface VideoPlayerProps {
  url: string;
  thumbnailUrl: string;
  title: string;
  mediaId?: string;
  resolutions?: MultiResolutions;
  autoPlay?: boolean;
  onEnded?: () => void;
}

export default function VideoPlayer({
  url,
  thumbnailUrl,
  title,
  mediaId,
  resolutions,
  autoPlay = false,
  onEnded,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [selectedQuality, setSelectedQuality] = useState<string>('Auto');
  const [detectedSpeed, setDetectedSpeed] = useState<string>('Detecting...');
  const [currentSrc, setCurrentSrc] = useState(url);
  const [showSettings, setShowSettings] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);

  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);

  // Network Speed Connection Auto-Detection
  useEffect(() => {
    if (typeof window !== 'undefined' && 'connection' in navigator) {
      const conn = (navigator as unknown as { connection?: { downlink?: number; effectiveType?: string } }).connection;
      if (conn?.effectiveType) {
        if (conn.effectiveType === '4g' || (conn.downlink && conn.downlink > 5)) {
          setDetectedSpeed('Fast 4G/5G (1080p)');
          if (selectedQuality === 'Auto') setSelectedQuality('Auto');
        } else if (conn.effectiveType === '3g' || (conn.downlink && conn.downlink > 1.5)) {
          setDetectedSpeed('Moderate 3G (720p)');
        } else {
          setDetectedSpeed('Slow Connection (480p)');
        }
      }
    } else {
      setDetectedSpeed('High Speed');
    }
  }, [selectedQuality]);

  // Quality switching logic
  useEffect(() => {
    if (selectedQuality === 'Auto' || !resolutions) {
      setCurrentSrc(url);
    } else {
      const resKey = selectedQuality as keyof MultiResolutions;
      if (resolutions[resKey]) {
        setCurrentSrc(resolutions[resKey]);
      }
    }
  }, [selectedQuality, url, resolutions]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement) && document.activeElement?.tagName === 'INPUT') return;

      if (e.code === 'Space' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'm') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'p') {
        e.preventDefault();
        togglePiP();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        seekBy(5);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        seekBy(-5);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, duration]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const seekBy = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(Math.max(0, videoRef.current.currentTime + seconds), duration);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);

    if (duration > 0 && mediaId) {
      const pct = (videoRef.current.currentTime / duration) * 100;
      if (Math.abs(pct - 50) < 1 || Math.abs(pct - 90) < 1) {
        sendAnalyticsEvent({
          type: 'watch_progress',
          path: window.location.pathname,
          mediaId,
          duration: videoRef.current.currentTime,
        });
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const togglePiP = async () => {
    if (!videoRef.current) return;
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else if (document.pictureInPictureEnabled) {
      await videoRef.current.requestPictureInPicture();
    }
  };

  const changePlaybackSpeed = (speed: number) => {
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSettings(false);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
    hideControlsTimeout.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full aspect-video bg-[#120e1d] rounded-2xl overflow-hidden shadow-2xl group border border-white/10 select-none"
    >
      <video
        ref={videoRef}
        src={currentSrc}
        poster={thumbnailUrl}
        playsInline
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => videoRef.current && setDuration(videoRef.current.duration)}
        onEnded={() => {
          setIsPlaying(false);
          if (onEnded) onEnded();
        }}
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Captions Overlay Simulation */}
      {subtitlesEnabled && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-[#181326]/90 text-white text-xs sm:text-sm px-4 py-1.5 rounded-lg border border-white/10 pointer-events-none text-center shadow-lg">
          [Smriti Shah]: Paris Haute Couture runway live audio stream...
        </div>
      )}

      {/* Floating Center Play Button */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 m-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand-purple/85 hover:bg-brand-accent text-white flex items-center justify-center shadow-neon backdrop-blur-md transition-all transform hover:scale-110 z-20"
          aria-label="Play Video"
        >
          <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white translate-x-0.5" />
        </button>
      )}

      {/* Video Control Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-[#120e1d]/95 via-[#120e1d]/60 to-transparent transition-opacity duration-300 z-20 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress Bar */}
        <div className="relative mb-2.5 group/timeline cursor-pointer flex items-center">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-white/20 accent-brand-purple rounded-lg appearance-none cursor-pointer group-hover/timeline:h-2 transition-all"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button onClick={togglePlay} className="hover:text-brand-purple transition-colors p-1" aria-label="Play/Pause">
              {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />}
            </button>
            <div className="flex items-center gap-1.5 group/vol">
              <button onClick={toggleMute} className="hover:text-brand-purple transition-colors p-1" aria-label="Mute/Unmute">
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="hidden sm:inline-block w-14 sm:w-16 h-1 bg-white/20 accent-brand-purple rounded appearance-none cursor-pointer"
              />
            </div>
            <span className="text-gray-300 font-mono text-[10px] sm:text-[11px]">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 relative">
            {/* Network Speed Indicator */}
            <span className="hidden md:flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-white/10 px-2 py-0.5 rounded-full">
              <Wifi className="w-3 h-3" />
              <span>{detectedSpeed}</span>
            </span>

            {/* Subtitles Button */}
            <button
              onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
              className={`p-1 transition-colors ${subtitlesEnabled ? 'text-brand-purple' : 'text-gray-400 hover:text-white'}`}
              title="Captions / Subtitles"
            >
              <Subtitles className="w-4 h-4" />
            </button>

            {/* Picture in Picture */}
            <button onClick={togglePiP} className="p-1 text-gray-400 hover:text-white transition-colors" title="Picture in Picture">
              <PictureInPicture className="w-4 h-4" />
            </button>

            {/* Quality & Speed Settings Menu */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1 text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                title="Playback Settings"
              >
                <Settings className="w-4 h-4" />
                <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded font-mono font-bold text-white">{selectedQuality}</span>
              </button>

              {showSettings && (
                <div className="absolute bottom-8 right-0 w-48 glass-panel rounded-2xl p-2.5 border border-white/10 shadow-2xl z-50 text-xs text-gray-200">
                  <div className="font-bold text-brand-purple text-[9px] uppercase tracking-wider mb-1 px-2">Quality (Adaptive Stream)</div>
                  {['Auto', '1080p', '720p', '480p', '360p'].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setSelectedQuality(q);
                        setShowSettings(false);
                      }}
                      className={`w-full text-left px-2 py-1 rounded-lg hover:bg-white/10 flex items-center justify-between transition-colors ${
                        selectedQuality === q ? 'text-brand-purple font-bold bg-white/5' : ''
                      }`}
                    >
                      <span>{q}</span>
                      {selectedQuality === q && <span className="text-brand-purple text-xs">•</span>}
                    </button>
                  ))}
                  <div className="border-t border-white/10 my-1.5" />
                  <div className="font-bold text-brand-purple text-[9px] uppercase tracking-wider mb-1 px-2">Speed</div>
                  {[0.5, 1, 1.25, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => changePlaybackSpeed(s)}
                      className={`w-full text-left px-2 py-1 rounded-lg hover:bg-white/10 flex items-center justify-between transition-colors ${
                        playbackRate === s ? 'text-brand-purple font-bold bg-white/5' : ''
                      }`}
                    >
                      <span>{s}x</span>
                      {playbackRate === s && <span className="text-brand-purple text-xs">•</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen Toggle */}
            <button onClick={toggleFullscreen} className="p-1 text-gray-400 hover:text-white transition-colors" aria-label="Fullscreen">
              {isFullscreen ? <Minimize className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
