import React from 'react';
import { LegalModalType } from './LegalModal';
import { ShieldCheck, FileText, Info, Mail, Heart, Sparkles, Film } from 'lucide-react';

interface FooterProps {
  onOpenLegalModal: (type: LegalModalType) => void;
  onOpenAdminLogin?: () => void;
  channelHandle?: string;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegalModal, channelHandle = '@TraceBonne' }) => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/90 font-['Cairo'] text-slate-400 mt-16 pt-10 pb-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Grid: Brand info & Quick Legal Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-b border-slate-800/80 pb-8">
          
          {/* Column 1: Brand details */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold font-['Amiri'] text-xl shadow-lg shadow-amber-500/20">
                TB
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-100 font-['Cairo'] leading-tight">
                  TraceBonne | صانع فيديوهات الأحاديث النبوية
                </h3>
                <p className="text-xs text-amber-400 font-semibold">منصة احترافية موثوقة لإنتاج المحتوى الدعوي البصري</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              أفضل أداة مجانية لتصميم بطاقات وفيديوهات الأحاديث النبوية بحجم 9:16 متوافقة مع منصات Reels, TikTok, و Shorts مع مزامنة الصوت والخلفيات السينمائية.
            </p>
          </div>

          {/* Column 2: Essential Legal Links (For AdSense & Trust) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>الروابط القانونية والمعلومات (Legal Framework)</span>
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-xs sm:text-sm font-semibold">
              <li>
                <button
                  onClick={() => onOpenLegalModal('privacy')}
                  className="w-full text-right py-1.5 px-2.5 rounded-lg text-slate-300 hover:text-amber-300 hover:bg-slate-900 transition flex items-center gap-2 border border-transparent hover:border-amber-500/20"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>سياسة الخصوصية</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegalModal('terms')}
                  className="w-full text-right py-1.5 px-2.5 rounded-lg text-slate-300 hover:text-amber-300 hover:bg-slate-900 transition flex items-center gap-2 border border-transparent hover:border-amber-500/20"
                >
                  <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>اتفاقية الاستخدام</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegalModal('about')}
                  className="w-full text-right py-1.5 px-2.5 rounded-lg text-slate-300 hover:text-amber-300 hover:bg-slate-900 transition flex items-center gap-2 border border-transparent hover:border-amber-500/20"
                >
                  <Info className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>من نحن</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegalModal('contact')}
                  className="w-full text-right py-1.5 px-2.5 rounded-lg text-slate-300 hover:text-amber-300 hover:bg-slate-900 transition flex items-center gap-2 border border-transparent hover:border-amber-500/20"
                >
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>اتصل بنا</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform info & Channel */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5" />
              <span>هوية القناة والمنصة</span>
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">القناة الافتراضية:</span>
                <span dir="ltr" className="font-mono font-bold text-amber-400">{channelHandle}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                تصميم عالي الدقة (Full HD / 9:16) جاهز للنشر المباشر.
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Compliance Note */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 pt-2">
          <p className="text-center sm:text-right">
            جميع الحقوق محفوظة © 2024 <strong className="text-slate-300 font-bold">TraceBonne</strong> - صانع فيديوهات الأحاديث النبوية.
          </p>

          <div className="flex items-center gap-1.5 text-slate-400">
            <span>تم تطوير المنصة بنية نشر السنة النبوية الشريفة</span>
            <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500 inline" />
          </div>
        </div>

      </div>
    </footer>
  );
};
