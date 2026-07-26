export interface BackgroundTheme {
  id: number;
  name: string;
  url: string;
}

export interface HadithSegment {
  id: string;
  text: string;
  startTime: number; // in seconds
  endTime: number;   // in seconds
}

export interface HadithItem {
  id: string;
  bookName?: string;
  hadithNumber?: string;
  chapterArabic?: string;
  narrator?: string;
  rawText: string;
  cleanedText: string;
}

export type VerticalPosition = 'top' | 'middle' | 'bottom';
export type HorizontalPosition = 'left' | 'center' | 'right';

export interface TextCustomization {
  fontFamily: string; // 'Cairo' | 'Amiri' | 'Tajawal' | 'Aref Ruqaa' | 'Reem Kufi' | 'Lalezar' | 'Marhey' | 'Changa'
  fontSize: number;   // e.g. 28 to 64
  textColor: string;  // e.g. '#ffffff'
  highlightColor: string; // e.g. '#f59e0b' (gold/amber)
  shadowColor: string; // e.g. '#000000'
  strokeWidth: number; // e.g. 0 to 10 (Text Stroke/Trait width)
  strokeColor: string; // e.g. '#000000' (Text Stroke/Trait color)
  backgroundColor: string; // e.g. 'rgba(15, 23, 42, 0.65)'
  verticalPosition: VerticalPosition;
  horizontalPosition: HorizontalPosition;
  textPos: { x: number; y: number }; // 0 to 100 percentage position (Default: { x: 50, y: 50 })
  showCardBackground: boolean;
  showWatermark: boolean;
  watermarkPos?: { x: number; y: number }; // 0 to 100 percentage position (Default: { x: 82, y: 8 })
  // Visual Effects
  showStars: boolean;
  bgBlur: number;            // Range: 0 to 10px
  bgOverlayDarkness: number; // Range: 0 to 0.9
  cinematicZoom: boolean;
}

export interface AudioState {
  mainAudioUrl: string | null;
  mainAudioBlob: Blob | null;
  duration: number; // main audio duration in seconds
  outroAudioUrl: string | null;
  outroAudioBlob: Blob | null;
  outroDuration: number; // outro audio duration in seconds
  isPlaying: boolean;
  currentTime: number;
  isRecording: boolean;
  recordingTime: number;
}

export interface ExportProgress {
  isExporting: boolean;
  progress: number; // 0 to 100
  statusMessage: string;
  downloadUrl: string | null;
}

export interface BrandingConfig {
  handle: string;
  logoUrl: string;
}
