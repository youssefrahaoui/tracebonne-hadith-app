import React, { useEffect } from 'react';
import { PlayCircle, Clock, Plus, Minus, Trash2, Sliders, ChevronDown, ChevronUp, Sparkles, RefreshCcw, Wand2 } from 'lucide-react';
import { HadithSegment } from '../types';

interface SyncStudioProps {
  segments: HadithSegment[];
  currentAudioTime: number;
  mainAudioDuration: number;
  activeSegmentIndex: number;
  isPlaying: boolean;
  onUpdateSegments: (newSegments: HadithSegment[]) => void;
  onSyncNextSegment: () => void;
  onSeekToTime: (time: number) => void;
  onResetSegmentsToEqual: () => void;
}

export const SyncStudio: React.FC<SyncStudioProps> = ({
  segments,
  currentAudioTime,
  mainAudioDuration,
  activeSegmentIndex,
  isPlaying,
  onUpdateSegments,
  onSyncNextSegment,
  onSeekToTime,
  onResetSegmentsToEqual,
}) => {

  // Spacebar hotkey listener for sync next segment
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid hotkey if typing in input/textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        onSyncNextSegment();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSyncNextSegment]);

  // SMART AUTO SYNC CALCULATION
  const handleSmartAutoSync = () => {
    if (!segments || segments.length === 0) return;

    const audioDur = mainAudioDuration > 0 ? mainAudioDuration : 12.0;

    // 1. Calculate total character count across all segments
    const totalChars = segments.reduce((acc, seg) => {
      const len = seg.text.replace(/\s+/g, '').length;
      return acc + (len > 0 ? len : 1);
    }, 0);

    // 2. Sentence #1 starts at 0.00. Every following sentence starts where the previous ends
    let currentStart = 0;
    const updated = segments.map((seg, idx) => {
      const charLen = seg.text.replace(/\s+/g, '').length || 1;
      const duration = totalChars > 0 ? (charLen / totalChars) * audioDur : audioDur / segments.length;
      const startTime = idx === 0 ? 0.0 : currentStart;
      const endTime = Number((startTime + duration).toFixed(2));
      currentStart = endTime;

      return {
        ...seg,
        startTime: Number(startTime.toFixed(2)),
        endTime,
      };
    });

    onUpdateSegments(updated);
  };

  const handleTimeChange = (id: string, field: 'startTime' | 'endTime', value: number) => {
    const updated = segments.map((seg) => {
      if (seg.id === id) {
        return { ...seg, [field]: Math.max(0, Number(value.toFixed(2))) };
      }
      return seg;
    });
    onUpdateSegments(updated);
  };

  const handleAdjustTimeDelta = (id: string, field: 'startTime' | 'endTime', delta: number) => {
    const updated = segments.map((seg) => {
      if (seg.id === id) {
        const newVal = Math.max(0, Number((seg[field] + delta).toFixed(2)));
        return { ...seg, [field]: newVal };
      }
      return seg;
    });
    onUpdateSegments(updated);
  };

  const handleTextChange = (id: string, text: string) => {
    const updated = segments.map((seg) => {
      if (seg.id === id) {
        return { ...seg, text };
      }
      return seg;
    });
    onUpdateSegments(updated);
  };

  const handleDeleteSegment = (id: string) => {
    if (segments.length <= 1) return;
    const updated = segments.filter((seg) => seg.id !== id);
    onUpdateSegments(updated);
  };

  return (
    <div className="bg-slate-900/90 border border-amber-500/20 rounded-2xl p-4 lg:p-5 shadow-xl space-y-4">
      {/* Header & Sync Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="font-bold text-base text-slate-100 font-['Cairo']">
              مزامنة نصوص ودقائق الحديث (Sync Studio)
            </h2>
            <p className="text-[11px] text-slate-400">
              الجملة الأولى تبدأ عند 0.00s تلقائياً. يمكنك الاستعانة بالمزامنة التلقائية أو التعديل اليدوي (+/-).
            </p>
          </div>
        </div>

        <button
          onClick={onResetSegmentsToEqual}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition shrink-0"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>توزيع زمني متساوي</span>
        </button>
      </div>

      {/* DUAL SYNC BUTTONS: SMART AUTO-SYNC + MANUAL INTERACTIVE SYNC */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-amber-500/10 border border-amber-500/30 p-3.5 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping"></span>
            <span className="text-xs font-bold text-amber-300">أدوات المزامنة الذكية والتفاعلية</span>
          </div>
          <span className="text-xs text-slate-300 font-mono">
            النشطة: #{activeSegmentIndex + 1} من {segments.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* 1. Smart Auto-Sync Button */}
          <button
            onClick={handleSmartAutoSync}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition flex items-center justify-center gap-2 border border-emerald-300/40"
          >
            <Wand2 className="w-4 h-4 text-emerald-100" />
            <span>مزامنة تلقائية ذكية ✨</span>
          </button>

          {/* 2. Manual Reaction Sync Button */}
          <button
            onClick={onSyncNextSegment}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition flex items-center justify-center gap-2 border border-amber-300/50"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>مزامنة يدوية تفاعلية (-0.5s)</span>
          </button>
        </div>
      </div>

      {/* Segments List with Fine-Tuning controls */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pe-1">
        {segments.map((seg, idx) => {
          const isActive = idx === activeSegmentIndex;
          const isCurrentInPlayback =
            currentAudioTime >= seg.startTime && currentAudioTime <= seg.endTime;

          return (
            <div
              key={seg.id}
              className={`p-3 rounded-xl border transition text-right ${
                isCurrentInPlayback
                  ? 'bg-amber-500/15 border-amber-500 shadow-md ring-1 ring-amber-500/40'
                  : isActive
                  ? 'bg-slate-800/80 border-amber-500/50'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    isCurrentInPlayback ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="text-amber-400">جملة الحديث #{idx + 1}</span>
                </div>

                {/* Timestamps & Fine-Tuning (+/- Buttons) */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {/* Start Time Control */}
                  <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1">
                    <span className="text-[10px] text-slate-400">بدء:</span>
                    <button
                      onClick={() => handleAdjustTimeDelta(seg.id, 'startTime', -0.1)}
                      className="w-4 h-4 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-amber-400 rounded text-[10px] font-bold"
                      title="-0.1s"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={seg.startTime}
                      onChange={(e) => handleTimeChange(seg.id, 'startTime', parseFloat(e.target.value) || 0)}
                      className="w-12 text-center bg-transparent text-amber-300 font-mono text-xs focus:outline-none"
                    />
                    <button
                      onClick={() => handleAdjustTimeDelta(seg.id, 'startTime', 0.1)}
                      className="w-4 h-4 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-amber-400 rounded text-[10px] font-bold"
                      title="+0.1s"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="text-slate-600">←</span>

                  {/* End Time Control */}
                  <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1">
                    <span className="text-[10px] text-slate-400">انتهاء:</span>
                    <button
                      onClick={() => handleAdjustTimeDelta(seg.id, 'endTime', -0.1)}
                      className="w-4 h-4 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-amber-400 rounded text-[10px] font-bold"
                      title="-0.1s"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={seg.endTime}
                      onChange={(e) => handleTimeChange(seg.id, 'endTime', parseFloat(e.target.value) || 0)}
                      className="w-12 text-center bg-amber-300 font-mono text-xs bg-transparent focus:outline-none"
                    />
                    <button
                      onClick={() => handleAdjustTimeDelta(seg.id, 'endTime', 0.1)}
                      className="w-4 h-4 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-amber-400 rounded text-[10px] font-bold"
                      title="+0.1s"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Play snippet / seek */}
                  <button
                    onClick={() => onSeekToTime(seg.startTime)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg transition"
                    title="استماع للجملة من البداية"
                  >
                    <PlayCircle className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteSegment(seg.id)}
                    className="p-1.5 bg-slate-800 hover:bg-rose-900/50 text-rose-400 rounded-lg transition"
                    title="حذف الجملة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Text Input */}
              <input
                type="text"
                value={seg.text}
                onChange={(e) => handleTextChange(seg.id, e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 focus:border-amber-500 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-slate-100 font-['Cairo'] focus:outline-none"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
