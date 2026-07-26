import React, { useState, useRef, useEffect } from 'react';
import { Mic, Upload, Volume2, Play, Pause, Square, Sparkles, AlertCircle, Music, CheckCircle2 } from 'lucide-react';
import { AudioState } from '../types';
import { generateArabicSpeechAudio } from '../utils/hadithUtils';
import { BRANDING } from '../data/themes';

interface AudioStudioProps {
  currentHadithText: string;
  audioState: AudioState;
  onAudioChange: (blob: Blob, url: string, duration: number) => void;
  onOutroAudioChange: (blob: Blob, url: string, duration: number) => void;
  onTimeUpdate: (time: number) => void;
}

export const AudioStudio: React.FC<AudioStudioProps> = ({
  currentHadithText,
  audioState,
  onAudioChange,
  onOutroAudioChange,
  onTimeUpdate,
}) => {
  const [isGeneratingTts, setIsGeneratingTts] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Synchronize audio HTML element
  useEffect(() => {
    if (audioRef.current && audioState.mainAudioUrl) {
      audioRef.current.src = audioState.mainAudioUrl;
    }
  }, [audioState.mainAudioUrl]);

  // Main Audio File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const tempAudio = new Audio(url);
    tempAudio.onloadedmetadata = () => {
      const duration = tempAudio.duration || 10;
      onAudioChange(file, url, duration);
    };
  };

  // Outro Audio File Upload Handler
  const handleOutroFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const tempAudio = new Audio(url);
    tempAudio.onloadedmetadata = () => {
      const duration = tempAudio.duration || BRANDING.outroDuration;
      onOutroAudioChange(file, url, duration);
    };
  };

  // Live Microphone Recording Handler
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        const url = URL.createObjectURL(audioBlob);
        const tempAudio = new Audio(url);
        tempAudio.onloadedmetadata = () => {
          const duration = tempAudio.duration || recordingSeconds;
          onAudioChange(audioBlob, url, duration);
        };
        // Stop track streams
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setRecordingSeconds(0);
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert('تعذر الوصول إلى الميكروفون. يُرجى التحقق من الصلاحيات.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  // Generate TTS Narration Audio
  const handleGenerateTts = async () => {
    if (!currentHadithText) return;
    setIsGeneratingTts(true);
    try {
      const res = await generateArabicSpeechAudio(currentHadithText);
      onAudioChange(res.blob, res.url, res.duration);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingTts(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-amber-500/20 rounded-2xl p-4 lg:p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-amber-400" />
          <h2 className="font-bold text-base text-slate-100 font-['Cairo']">
            استوديو تسجيل وترديد الصوت (Audio Studio)
          </h2>
        </div>

        {audioState.mainAudioUrl && (
          <span className="text-xs text-amber-300 font-mono bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
            مدة الصوت الرئيسي: {audioState.duration.toFixed(1)}s
          </span>
        )}
      </div>

      {/* 1. MAIN AUDIO INPUT OPTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Option 1: MP3 Upload */}
        <label className="flex flex-col items-center justify-center p-4 bg-slate-950 border border-dashed border-slate-800 hover:border-amber-500/50 rounded-xl cursor-pointer transition group text-center">
          <Upload className="w-6 h-6 text-amber-400 mb-2 group-hover:scale-110 transition" />
          <span className="text-xs font-bold text-slate-200">رفع صوت الحديث الرئيسي (MP3/WAV)</span>
          <span className="text-[10px] text-slate-500 mt-1">تسجيل مقروء بصوتك أو بصوت قاريء</span>
          <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
        </label>

        {/* Option 2: Live Recording */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-950 border border-slate-800 rounded-xl text-center">
          {audioState.isRecording ? (
            <div className="space-y-2 w-full">
              <div className="flex items-center justify-center gap-2 text-rose-500 font-bold text-xs animate-pulse">
                <span className="w-2.5 h-2.5 bg-rose-500 rounded-full"></span>
                <span>جاري التسجيل: {recordingSeconds} ثانية</span>
              </div>
              <button
                onClick={stopRecording}
                className="w-full py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>إيقاف التسجيل</span>
              </button>
            </div>
          ) : (
            <button
              onClick={startRecording}
              className="flex flex-col items-center justify-center group w-full h-full"
            >
              <Mic className="w-6 h-6 text-rose-400 mb-2 group-hover:scale-110 transition" />
              <span className="text-xs font-bold text-slate-200">تسجيل مباشر بالميكروفون</span>
              <span className="text-[10px] text-slate-500 mt-1">اقرأ الحديث وسجّله مباشرة</span>
            </button>
          )}
        </div>

        {/* Option 3: Auto Speech Synthesis */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-950 border border-slate-800 rounded-xl text-center">
          <button
            onClick={handleGenerateTts}
            disabled={isGeneratingTts}
            className="flex flex-col items-center justify-center group w-full h-full disabled:opacity-50"
          >
            <Sparkles className="w-6 h-6 text-amber-400 mb-2 group-hover:scale-110 transition" />
            <span className="text-xs font-bold text-slate-200">
              {isGeneratingTts ? 'جاري توليد القراءة...' : 'توليد قراءة آليّة (TTS)'}
            </span>
            <span className="text-[10px] text-slate-500 mt-1">توليد صوت ناطق عربي مع مقطع نبض</span>
          </button>
        </div>
      </div>

      {/* 2. DEDICATED OUTRO AUDIO UPLOAD SECTION (رفع صوت الخاتمة) */}
      <div className="pt-3 border-t border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-200 font-['Cairo']">
              رفع صوت الخاتمة (Outro Audio)
            </span>
          </div>
          {audioState.outroAudioUrl ? (
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              صوت الخاتمة مفعّل ({audioState.outroDuration.toFixed(1)}s)
            </span>
          ) : (
            <span className="text-[10px] text-slate-500">
              افتراضي: {BRANDING.outroDuration} ثوانٍ
            </span>
          )}
        </div>

        <label className="flex items-center justify-between p-3 bg-slate-950 border border-dashed border-slate-800 hover:border-amber-500/50 rounded-xl cursor-pointer transition group">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-105 transition">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">
                اختر ملف صوت الخاتمة (MP3 / WAV)
              </div>
              <div className="text-[10px] text-slate-400">
                سيتم تشغيله تلقائياً فور انتهاء صوت الحديث عند الانتقال لشاشة الخاتمة
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-slate-950 transition">
            رفع صوت الخاتمة
          </span>
          <input type="file" accept="audio/*" onChange={handleOutroFileUpload} className="hidden" />
        </label>
      </div>

      {/* Audio Status Banner */}
      {!audioState.mainAudioUrl && (
        <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>يرجى رفع أو تسجيل ملف الصوت الرئيسي لنقل مزامنة الجمل بدقة عالية.</span>
        </div>
      )}
    </div>
  );
};
