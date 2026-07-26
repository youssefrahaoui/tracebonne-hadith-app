import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles, Film, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { BackgroundTheme, HadithSegment, TextCustomization } from '../types';
import { BRANDING } from '../data/themes';
import { ParticleStars } from './ParticleStars';

interface VideoCanvasPreviewProps {
  theme: BackgroundTheme;
  segments: HadithSegment[];
  textConfig: TextCustomization;
  currentTime: number;
  mainAudioDuration: number;
  outroAudioDuration?: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
}

const formatTime = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

// Generate a 360-degree multi-directional text-shadow for true OUTSIDE stroke
const generateOutsideStrokeShadow = (
  strokeWidth?: number,
  strokeColor?: string,
  shadowColor?: string
) => {
  const dropShadow = `0 4px 14px ${shadowColor || 'rgba(0,0,0,0.95)'}`;
  if (!strokeWidth || strokeWidth <= 0) {
    return dropShadow;
  }

  const r = Math.max(0.6, strokeWidth * 0.55); // scaled for preview
  const color = strokeColor || '#000000';
  const shadows: string[] = [];

  // 16 radial directions for smooth outer border
  const steps = 16;
  for (let i = 0; i < steps; i++) {
    const angle = (i * 2 * Math.PI) / steps;
    const x = (Math.cos(angle) * r).toFixed(2);
    const y = (Math.sin(angle) * r).toFixed(2);
    shadows.push(`${x}px ${y}px 0px ${color}`);
  }

  shadows.push(dropShadow);
  return shadows.join(', ');
};

export const VideoCanvasPreview: React.FC<VideoCanvasPreviewProps> = ({
  theme,
  segments,
  textConfig,
  currentTime,
  mainAudioDuration,
  outroAudioDuration,
  isPlaying,
  onTogglePlay,
  onSeek,
}) => {
  const [forceOutroPreview, setForceOutroPreview] = useState<boolean>(false);

  // Total duration = mainHadithDuration + Outro Duration
  const outroDur = outroAudioDuration || BRANDING.outroDuration;
  const totalDuration = Math.max(5, mainAudioDuration + outroDur);
  const isOutroActive = forceOutroPreview || currentTime >= mainAudioDuration;

  // Active Segment for current playback time
  const activeSegment = segments.find(
    (s) => currentTime >= s.startTime && currentTime <= s.endTime
  ) || segments[0];

  // Text Position from touchpad state (0 to 100 percentage)
  const textPos = textConfig.textPos || { x: 50, y: 50 };

  return (
    <div className="flex flex-col items-center gap-4 bg-slate-900/90 border border-amber-500/20 rounded-2xl p-4 lg:p-5 shadow-2xl w-full">
      {/* Top Banner & Mode Toggle */}
      <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Film className="w-5 h-5 text-amber-400" />
          <h2 className="font-bold text-base text-slate-100 font-['Cairo']">
            معاينة الفيديو 9:16 (Live Video Preview)
          </h2>
        </div>

        <button
          onClick={() => setForceOutroPreview(!forceOutroPreview)}
          className={`px-3 py-1 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
            isOutroActive
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-amber-300'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isOutroActive ? 'خاتمة الفيديو (مفعلة)' : 'معاينة شاشة الخاتمة'}</span>
        </button>
      </div>

      {/* 9:16 VERTICAL CANVAS CONTAINER CONTAINER */}
      <div className="relative w-full max-w-[340px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/40 bg-slate-950 group select-none">
        
        {/* 1. Cinematic Zooming & Blurred Background Image */}
        <motion.div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${theme.url})`,
            filter: textConfig.bgBlur ? `blur(${textConfig.bgBlur}px)` : 'none',
          }}
          animate={textConfig.cinematicZoom ? { scale: [1, 1.15, 1] } : { scale: 1.05 }}
          transition={
            textConfig.cinematicZoom
              ? { duration: 20, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.5 }
          }
        />

        {/* 2. Adjustable Background Darkness Overlay */}
        <div
          className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-300 z-0"
          style={{ opacity: textConfig.bgOverlayDarkness ?? 0.3 }}
        />

        {/* 3. Central Glow & Dark Radial Vignette Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-950/40 to-slate-950/90 pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(234,179,8,0.15)_0%,_transparent_70%)] pointer-events-none z-0" />

        {/* 4. Particle Stars Layer (Behind text, in front of background) */}
        {(textConfig.showStars ?? true) && <ParticleStars />}

        {/* 3. Watermark (Floating Logo + @TraceBonne Handle with Dynamic Positioning) */}
        {!isOutroActive && textConfig.showWatermark && (() => {
          const wmPos = textConfig.watermarkPos || { x: 82, y: 8 };
          return (
            <div
              className="absolute z-20 flex items-center gap-2 pointer-events-none transition-all duration-75 ease-out select-none"
              style={{
                left: `${wmPos.x}%`,
                top: `${wmPos.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <img
                src={BRANDING.logoUrl}
                alt="Channel Logo"
                className="w-6.5 h-6.5 rounded-full object-cover border border-amber-400/90"
                style={{
                  filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.85))',
                }}
              />
              <span
                dir="ltr"
                className="font-bold text-xs text-amber-400 font-mono tracking-wide whitespace-nowrap"
                style={{
                  textShadow: '0 2px 10px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.9)',
                }}
              >
                {BRANDING.handle}
              </span>
            </div>
          );
        })()}

        {/* MAIN CONTENT AREA */}
        <div className="relative z-10 w-full h-full p-4">
          
          {!isOutroActive ? (
            /* --- MAIN HADITH VIEW WITH ABSOLUTE TOUCHPAD POSITIONING --- */
            <div
              className="absolute transition-all duration-75 ease-out z-10 w-[88%] max-w-[88%] pointer-events-none"
              style={{
                left: `${textPos.x}%`,
                top: `${textPos.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div
                className={`w-full transition-all duration-300 ${
                  textConfig.showCardBackground
                    ? 'p-4 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-amber-500/35 shadow-2xl'
                    : ''
                }`}
              >
                <p
                  dir="rtl"
                  className="leading-relaxed transition-all text-center select-none"
                  style={{
                    fontFamily: textConfig.fontFamily || 'Cairo',
                    fontSize: `${textConfig.fontSize * 0.7}px`,
                    color: textConfig.textColor || '#ffffff',
                    textShadow: generateOutsideStrokeShadow(
                      textConfig.strokeWidth,
                      textConfig.strokeColor,
                      textConfig.shadowColor
                    ),
                  }}
                >
                  {activeSegment ? activeSegment.text : 'اضغط تشغيل للبدء...'}
                </p>
              </div>
            </div>
          ) : (
            /* --- OUTRO VIEW --- */
            <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-5 my-auto px-2">
              
              {/* Logo with Glowing Ring */}
              <div className="relative group">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full blur-md opacity-75 animate-pulse"></div>
                <img
                  src={BRANDING.logoUrl}
                  alt="Channel Logo"
                  className="relative w-20 h-20 rounded-full object-cover border-2 border-amber-300 shadow-2xl"
                />
              </div>

              {/* Handle @TraceBonne (LTR format) */}
              <div
                dir="ltr"
                className="font-bold text-base text-amber-400 font-mono tracking-wide bg-slate-950/85 px-3.5 py-1 rounded-full border border-amber-500/40 shadow-lg"
              >
                {BRANDING.handle}
              </div>

              {/* Outro Prayer Text Card */}
              <div className="w-full p-4.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-amber-500/40 shadow-2xl">
                <p
                  className="text-xs sm:text-sm leading-relaxed text-slate-100 font-semibold"
                  style={{
                    fontFamily: textConfig.fontFamily || 'Cairo',
                  }}
                >
                  "{BRANDING.outroPrayer}"
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Status Indicator Pill */}
        <div className="absolute bottom-3 start-3 z-20 text-[10px] bg-slate-950/80 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
          9:16 HD
        </div>
      </div>

      {/* PLAYER TIMELINE CONTROLS */}
      <div className="w-full space-y-2 pt-1">
        {/* Timeline Slider Scrubber */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-amber-400 min-w-[55px] text-center">
            {formatTime(currentTime)}
          </span>

          <input
            type="range"
            min="0"
            max={totalDuration}
            step="0.1"
            value={currentTime}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-1.5 rounded-lg bg-slate-800"
          />

          <span className="text-xs font-mono text-slate-400 min-w-[55px] text-center">
            {formatTime(totalDuration)}
          </span>
        </div>

        {/* Play / Pause Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onTogglePlay}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2 border border-amber-300/40"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-slate-950" />
                <span>إيقاف مؤقت</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>تشغيل المعاينة</span>
              </>
            )}
          </button>

          <button
            onClick={() => onSeek(0)}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700"
            title="إعادة للبداية"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
