import React from 'react';
import { X, BookOpen, Volume2, Clock, Film, Download, Sparkles } from 'lucide-react';
import { BRANDING } from '../data/themes';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 text-right relative max-h-[85vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 start-4 p-1.5 text-slate-400 hover:text-slate-100 bg-slate-800 rounded-lg transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <Sparkles className="w-6 h-6 text-amber-400" />
          <div>
            <h3 className="font-bold text-lg text-slate-100 font-['Cairo']">
              دليل استخدام صانع فيديوهات الأحاديث النبوية
            </h3>
            <p className="text-xs text-amber-400 font-mono">القناة الرسمية: {BRANDING.handle}</p>
          </div>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>1. اختيار أو لصق الحديث النبوي</span>
            </h4>
            <p>
              يمكنك الاختيار من بين الأحاديث الشهيرة أو البحث المباشر في قاعدة بيانات API باستخدام المفتاح المرفق، أو اختيار "لصق نص مخصص". عند تأكيد النص الجديد، سيتم إعادة ضبط الأجزاء والتوقيتات فوراً للبداية.
            </p>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4" />
              <span>2. تسجيل أو رفع الصوت</span>
            </h4>
            <p>
              يمكنك رفع ملف صوتی MP3/WAV أو التسجيل المباشر بميكروفون الجهاز أو توليد صوت ناطق آلياً.
            </p>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>3. آلية المزامنة اللحظية (-0.5s)</span>
            </h4>
            <p>
              أثناء تشغيل الصوت، اضغط على زر "مزامنة الجملة التالية" أو زر المسافة (Spacebar) في الكيبورد عند سماع بداية الجملة التالية. يتم تطبيق إزاحة رد الفعل تلقائياً (-0.5 ثانية) لضمان الدقة العالية.
            </p>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
              <Film className="w-4 h-4" />
              <span>4. الخاتمة التلقائية (Outro View)</span>
            </h4>
            <p>
              عند انتهاء الصوت الرئيسي، ينتقل الفيديو تلقائياً إلى شاشة الخاتمة لعرض شعار القناة {BRANDING.handle} ودعاء الخاتمة المخصص، مع تشغيل الصوت التتابعي.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition"
          >
            فهمت، ابدأ العمل الآن
          </button>
        </div>

      </div>
    </div>
  );
};
