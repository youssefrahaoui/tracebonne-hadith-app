import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HadithSelector } from './components/HadithSelector';
import { AudioStudio } from './components/AudioStudio';
import { SyncStudio } from './components/SyncStudio';
import { VideoCanvasPreview } from './components/VideoCanvasPreview';
import { VideoControls } from './components/VideoControls';
import { ExportModal } from './components/ExportModal';
import { HelpModal } from './components/HelpModal';
import { ArticlesSection } from './components/ArticlesSection';
import { ArticlePage } from './components/ArticlePage';
import { getStoredArticles } from './utils/articleStore';
import { Footer } from './components/Footer';
import { LegalModal, LegalModalType } from './components/LegalModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';

import { BackgroundTheme, HadithSegment, TextCustomization, AudioState, ExportProgress, BrandingConfig } from './types';
import { BACKGROUND_THEMES, DEFAULT_HADITHS, BRANDING } from './data/themes';
import { splitTextIntoSegments } from './utils/hadithUtils';
import { exportVideoMP4 } from './utils/videoExporter';

export default function App() {
  // 1. BRANDING STATE (Default TraceBonne, session-only)
  const [branding, setBranding] = useState<BrandingConfig>({
    handle: BRANDING.handle,   // '@TraceBonne'
    logoUrl: BRANDING.logoUrl, // 'https://i.imgur.com/BifuQtj.jpg'
  });

  // 2. BACKGROUND THEME STATE (Default Theme #1)
  const [selectedTheme, setSelectedTheme] = useState<BackgroundTheme>(BACKGROUND_THEMES[0]);

  // 2. HADITH TEXT STATE (Default Hadith #1)
  const [currentHadithText, setCurrentHadithText] = useState<string>(DEFAULT_HADITHS[0].cleanedText);

  // 3. HADITH SEGMENTS & SYNC STATE
  const [segments, setSegments] = useState<HadithSegment[]>(() =>
    splitTextIntoSegments(DEFAULT_HADITHS[0].cleanedText, 10)
  );
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number>(0);

  // 4. AUDIO STATE
  const [audioState, setAudioState] = useState<AudioState>({
    mainAudioUrl: null,
    mainAudioBlob: null,
    duration: 12.0,
    outroAudioUrl: null,
    outroAudioBlob: null,
    outroDuration: BRANDING.outroDuration,
    isPlaying: false,
    currentTime: 0,
    isRecording: false,
    recordingTime: 0,
  });

  // 5. TEXT & VIDEO CUSTOMIZATION CONFIG
  const [textConfig, setTextConfig] = useState<TextCustomization>({
    fontFamily: 'Cairo',
    fontSize: 32,
    textColor: '#ffffff',
    highlightColor: '#f59e0b',
    shadowColor: 'rgba(0, 0, 0, 0.9)',
    strokeWidth: 0,
    strokeColor: '#000000',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    verticalPosition: 'middle',
    horizontalPosition: 'center',
    textPos: { x: 50, y: 50 },
    showCardBackground: true,
    showWatermark: true,
    watermarkPos: { x: 82, y: 8 },
    showStars: true,
    bgBlur: 2,
    bgOverlayDarkness: 0.3,
    cinematicZoom: true,
  });

  // 6. EXPORT & MODAL STATES
  const [exportProgress, setExportProgress] = useState<ExportProgress>({
    isExporting: false,
    progress: 0,
    statusMessage: '',
    downloadUrl: null,
  });
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [legalModalType, setLegalModalType] = useState<LegalModalType>(null);
  const [showAdminLogin, setShowAdminLogin] = useState<boolean>(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);

  // Sync route on popstate or pushstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Detect secret URL parameter (?access=admin) to open Admin Login automatically
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('access') === 'admin') {
      setShowAdminLogin(true);
    }
  }, []);

  // Audio HTML Elements references
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const outroAudioRef = useRef<HTMLAudioElement | null>(null);

  // Sync Main Audio Time with State
  useEffect(() => {
    if (!audioRef.current && audioState.mainAudioUrl) {
      audioRef.current = new Audio(audioState.mainAudioUrl);
    } else if (audioRef.current && audioState.mainAudioUrl) {
      audioRef.current.src = audioState.mainAudioUrl;
    }
  }, [audioState.mainAudioUrl]);

  // Sync Outro Audio Time with State
  useEffect(() => {
    if (!outroAudioRef.current && audioState.outroAudioUrl) {
      outroAudioRef.current = new Audio(audioState.outroAudioUrl);
    } else if (outroAudioRef.current && audioState.outroAudioUrl) {
      outroAudioRef.current.src = audioState.outroAudioUrl;
    }
  }, [audioState.outroAudioUrl]);

  // Main Audio Event Listeners
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const handleTimeUpdate = () => {
      setAudioState((prev) => ({
        ...prev,
        currentTime: audioEl.currentTime,
      }));
    };

    const handleEnded = () => {
      // Transition to outro phase
      if (outroAudioRef.current) {
        outroAudioRef.current.currentTime = 0;
        outroAudioRef.current.play().catch(() => {});
      }
    };

    audioEl.addEventListener('timeupdate', handleTimeUpdate);
    audioEl.addEventListener('ended', handleEnded);

    return () => {
      audioEl.removeEventListener('timeupdate', handleTimeUpdate);
      audioEl.removeEventListener('ended', handleEnded);
    };
  }, [audioState.mainAudioUrl]);

  // Toggle Play / Pause
  const handleTogglePlay = () => {
    const mainDur = audioState.duration;
    const isMainPhase = audioState.currentTime < mainDur;

    if (!audioState.isPlaying) {
      if (isMainPhase) {
        if (!audioRef.current && audioState.mainAudioUrl) {
          audioRef.current = new Audio(audioState.mainAudioUrl);
        }
        if (audioRef.current) {
          audioRef.current.currentTime = audioState.currentTime;
          audioRef.current.play().catch((e) => console.warn('Main audio play error:', e));
        }
      } else {
        if (!outroAudioRef.current && audioState.outroAudioUrl) {
          outroAudioRef.current = new Audio(audioState.outroAudioUrl);
        }
        if (outroAudioRef.current) {
          outroAudioRef.current.currentTime = audioState.currentTime - mainDur;
          outroAudioRef.current.play().catch((e) => console.warn('Outro audio play error:', e));
        }
      }
      setAudioState((prev) => ({ ...prev, isPlaying: true }));
    } else {
      if (audioRef.current) audioRef.current.pause();
      if (outroAudioRef.current) outroAudioRef.current.pause();
      setAudioState((prev) => ({ ...prev, isPlaying: false }));
    }
  };

  // Playback timer & transition handling
  useEffect(() => {
    let interval: number | null = null;
    if (audioState.isPlaying) {
      interval = window.setInterval(() => {
        setAudioState((prev) => {
          const mainDur = prev.duration;
          const outroDur = prev.outroDuration || BRANDING.outroDuration;
          const totalDur = mainDur + outroDur;

          let nextTime = prev.currentTime + 0.1;

          if (audioRef.current && prev.currentTime < mainDur) {
            nextTime = audioRef.current.currentTime;
          } else if (outroAudioRef.current && prev.currentTime >= mainDur) {
            nextTime = mainDur + outroAudioRef.current.currentTime;
          }

          if (nextTime >= totalDur) {
            if (audioRef.current) audioRef.current.pause();
            if (outroAudioRef.current) outroAudioRef.current.pause();
            return { ...prev, currentTime: 0, isPlaying: false };
          }

          // Switch from main audio to outro audio if main just finished
          if (prev.currentTime < mainDur && nextTime >= mainDur) {
            if (audioRef.current) audioRef.current.pause();
            if (outroAudioRef.current) {
              outroAudioRef.current.currentTime = 0;
              outroAudioRef.current.play().catch(() => {});
            }
          }

          return { ...prev, currentTime: nextTime };
        });
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [audioState.isPlaying]);

  // Seek Handler
  const handleSeek = (time: number) => {
    const mainDur = audioState.duration;

    if (time < mainDur) {
      if (outroAudioRef.current) outroAudioRef.current.pause();
      if (audioRef.current) {
        audioRef.current.currentTime = time;
        if (audioState.isPlaying) audioRef.current.play().catch(() => {});
      }
    } else {
      if (audioRef.current) audioRef.current.pause();
      if (outroAudioRef.current) {
        outroAudioRef.current.currentTime = time - mainDur;
        if (audioState.isPlaying) outroAudioRef.current.play().catch(() => {});
      }
    }

    setAudioState((prev) => ({ ...prev, currentTime: time }));
  };

  // Handle Main Audio Loaded
  const handleAudioChange = (blob: Blob, url: string, duration: number) => {
    setAudioState((prev) => ({
      ...prev,
      mainAudioBlob: blob,
      mainAudioUrl: url,
      duration,
      isPlaying: false,
      currentTime: 0,
      isRecording: false,
      recordingTime: 0,
    }));

    // Re-split segments with updated duration
    const newSegs = splitTextIntoSegments(currentHadithText, duration);
    setSegments(newSegs);
    setActiveSegmentIndex(0);
  };

  // Handle Outro Audio Loaded
  const handleOutroAudioChange = (blob: Blob, url: string, duration: number) => {
    setAudioState((prev) => ({
      ...prev,
      outroAudioBlob: blob,
      outroAudioUrl: url,
      outroDuration: duration,
    }));
  };

  // Apply Hadith Text
  const handleApplyHadithText = (newText: string, isCleaned: boolean) => {
    setCurrentHadithText(newText);
    const newSegs = splitTextIntoSegments(newText, audioState.duration);
    setSegments(newSegs);
    setActiveSegmentIndex(0);
    handleSeek(0);
  };

  // SYNC LOGIC: Sync Next Segment with -0.5s reaction offset
  const handleSyncNextSegment = () => {
    if (activeSegmentIndex >= segments.length) return;

    // Reaction offset: -0.5s
    const realTime = audioState.currentTime;
    const syncTime = Math.max(0, Number((realTime - 0.5).toFixed(2)));

    const updated = [...segments];

    // Current segment start time
    if (updated[activeSegmentIndex]) {
      updated[activeSegmentIndex].startTime = syncTime;
    }

    // Previous segment end time
    if (activeSegmentIndex > 0 && updated[activeSegmentIndex - 1]) {
      updated[activeSegmentIndex - 1].endTime = syncTime;
    }

    setSegments(updated);

    // Move to next segment
    if (activeSegmentIndex < segments.length - 1) {
      setActiveSegmentIndex((prev) => prev + 1);
    }
  };

  // Auto Reset Segments to Equal duration
  const handleResetSegmentsToEqual = () => {
    const newSegs = splitTextIntoSegments(currentHadithText, audioState.duration);
    setSegments(newSegs);
    setActiveSegmentIndex(0);
  };

  // EXPORT VIDEO MP4 HANDLER
  const handleExportVideo = async () => {
    setShowExportModal(true);
    setExportProgress({
      isExporting: true,
      progress: 0,
      statusMessage: 'جاري بدء معالج التصدير...',
      downloadUrl: null,
    });

    try {
      const finalBlob = await exportVideoMP4({
        theme: selectedTheme,
        segments,
        mainAudioBlob: audioState.mainAudioBlob,
        mainAudioDuration: audioState.duration,
        outroAudioBlob: audioState.outroAudioBlob,
        outroDuration: audioState.outroDuration,
        textConfig,
        branding,
        onProgress: (progress, statusMessage) => {
          setExportProgress((prev) => ({
            ...prev,
            progress,
            statusMessage,
          }));
        },
      });

      const downloadUrl = URL.createObjectURL(finalBlob);
      setExportProgress({
        isExporting: false,
        progress: 100,
        statusMessage: 'اكتمل تصدير الفيديو بنجاح!',
        downloadUrl,
      });
    } catch (err) {
      console.error(err);
      setExportProgress({
        isExporting: false,
        progress: 0,
        statusMessage: 'حدث خطأ أثناء التصدير. يُرجى محاولة التصدير مرة أخرى.',
        downloadUrl: null,
      });
    }
  };

  const handleDownloadFile = () => {
    if (!exportProgress.downloadUrl) return;
    const a = document.createElement('a');
    a.href = exportProgress.downloadUrl;
    a.download = `hadith_video_tracebonne_${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Route check for single article page (/blog/[slug])
  if (currentPath.startsWith('/blog/') || currentPath === '/blog') {
    const slug = currentPath.replace('/blog/', '').replace('/blog', '');
    const articles = getStoredArticles();
    const foundArticle = articles.find((a) => a.id === slug) || articles[0];

    return (
      <ArticlePage
        article={foundArticle}
        onBack={() => {
          window.history.pushState(null, '', '/');
          window.dispatchEvent(new Event('popstate'));
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-['Cairo'] flex flex-col selection:bg-amber-500 selection:text-black">
      {/* NAVBAR */}
      <Navbar
        branding={branding}
        onExportClick={handleExportVideo}
        onHelpClick={() => setShowHelpModal(true)}
      />

      {/* MAIN DASHBOARD CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 flex flex-col lg:flex-row gap-6 lg:gap-8 xl:gap-10 items-start">
        
        {/* LEFT / STICKY COLUMN: Live 9:16 Video Preview & Outro (Top on mobile, Left/Sticky on desktop) */}
        <div className="w-full lg:w-[380px] lg:shrink-0 lg:sticky lg:top-16 lg:self-start order-1 lg:order-2">
          <VideoCanvasPreview
            theme={selectedTheme}
            segments={segments}
            textConfig={textConfig}
            currentTime={audioState.currentTime}
            mainAudioDuration={audioState.duration}
            outroAudioDuration={audioState.outroDuration}
            isPlaying={audioState.isPlaying}
            branding={branding}
            onTogglePlay={handleTogglePlay}
            onSeek={handleSeek}
          />
        </div>

        {/* RIGHT / MAIN COLUMN: Hadith Selector, Audio, Sync, Controls */}
        <div className="flex-1 min-w-0 w-full space-y-6 order-2 lg:order-1">
          
          {/* 1. Hadith Selector & Paste Mode */}
          <HadithSelector
            currentHadithText={currentHadithText}
            onApplyHadithText={handleApplyHadithText}
          />

          {/* 2. Audio Studio */}
          <AudioStudio
            currentHadithText={currentHadithText}
            audioState={audioState}
            onAudioChange={handleAudioChange}
            onOutroAudioChange={handleOutroAudioChange}
            onTimeUpdate={(time) => setAudioState((prev) => ({ ...prev, currentTime: time }))}
          />

          {/* 3. Sync Studio */}
          <SyncStudio
            segments={segments}
            currentAudioTime={audioState.currentTime}
            mainAudioDuration={audioState.duration}
            activeSegmentIndex={activeSegmentIndex}
            isPlaying={audioState.isPlaying}
            onUpdateSegments={setSegments}
            onSyncNextSegment={handleSyncNextSegment}
            onSeekToTime={handleSeek}
            onResetSegmentsToEqual={handleResetSegmentsToEqual}
          />

          {/* 4. Background Themes & Styling Controls */}
          <VideoControls
            selectedTheme={selectedTheme}
            onSelectTheme={setSelectedTheme}
            textConfig={textConfig}
            onChangeTextConfig={setTextConfig}
            branding={branding}
            onChangeBranding={setBranding}
          />

        </div>

      </main>

      {/* ARTICLES & INSIGHTS SECTION */}
      <ArticlesSection />

      {/* FOOTER */}
      <Footer
        onOpenLegalModal={setLegalModalType}
        channelHandle={branding.handle}
      />

      {/* MODALS */}
      {showExportModal && (
        <ExportModal
          progress={exportProgress}
          onClose={() => setShowExportModal(false)}
          onDownload={handleDownloadFile}
        />
      )}

      {showHelpModal && (
        <HelpModal onClose={() => setShowHelpModal(false)} />
      )}

      {legalModalType && (
        <LegalModal
          type={legalModalType}
          onClose={() => setLegalModalType(null)}
        />
      )}

      <AdminLoginModal
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onSuccess={() => setShowAdminDashboard(true)}
      />

      <AdminDashboard
        isOpen={showAdminDashboard}
        onClose={() => setShowAdminDashboard(false)}
      />
    </div>
  );
}
