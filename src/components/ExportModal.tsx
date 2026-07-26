import React from 'react';
import { Sparkles, Download, X, Loader2, CheckCircle, Video } from 'lucide-react';
import { ExportProgress } from '../types';

interface ExportModalProps {
  progress: ExportProgress;
  onClose: () => void;
  onDownload: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  progress,
  onClose,
  onDownload,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-right relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 start-4 p-1.5 text-slate-400 hover:text-slate-100 bg-slate-800 rounded-lg transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-100 font-['Cairo']">
              تصدير فيديو الحديث النبوي
            </h3>
            <p className="text-xs text-slate-400">جودة فائقة HD (1080x1920) بصيغة MP4/WebM</p>
          </div>
        </div>

        {/* Progress Display */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-amber-400 font-mono">{progress.progress}%</span>
            <span className="text-slate-300">{progress.statusMessage}</span>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800 p-0.5">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-300 shadow-md shadow-amber-500/50"
              style={{ width: `${progress.progress}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-end gap-2">
          {progress.isExporting ? (
            <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>جاري المعالجة والإخراج... يُرجى الانتظار</span>
            </div>
          ) : progress.downloadUrl ? (
            <button
              onClick={onDownload}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>تحميل فيديو الحديث النبوي (MP4)</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
            >
              إلغاء
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
