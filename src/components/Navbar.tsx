import React from 'react';
import { Video, Sparkles, Share2, Info, BookOpen } from 'lucide-react';
import { BRANDING } from '../data/themes';

interface NavbarProps {
  onExportClick: () => void;
  onHelpClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onExportClick, onHelpClick }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0f172a]/90 backdrop-blur-md border-b border-amber-500/20 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full blur opacity-50 group-hover:opacity-80 transition duration-300"></div>
            <img
              src={BRANDING.logoUrl}
              alt="Channel Logo"
              className="relative w-11 h-11 rounded-full object-cover border-2 border-amber-400 shadow-md"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg lg:text-xl text-amber-400 tracking-tight font-['Cairo']">
                صانع فيديوهات الأحاديث
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full">
                نسخة احترافية 9:16
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>القناة الرسمية:</span>
              <span dir="ltr" className="font-mono text-amber-300 font-bold bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700">
                {BRANDING.handle}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onHelpClick}
            className="p-2 sm:px-3 sm:py-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800/80 rounded-xl text-xs sm:text-sm font-medium transition flex items-center gap-1.5 border border-slate-800"
            title="طريقة المزامنة والتصميم"
          >
            <Info className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">دليل الاستخدام</span>
          </button>

          <button
            onClick={onExportClick}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition transform hover:-translate-y-0.5 flex items-center gap-2 border border-amber-300/40"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>تصدير فيديو MP4</span>
          </button>
        </div>

      </div>
    </header>
  );
};
