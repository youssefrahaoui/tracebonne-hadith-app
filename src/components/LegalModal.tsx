import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Info, Mail, Send, CheckCircle2, Cookie, ExternalLink, Lock, HelpCircle } from 'lucide-react';

export type LegalModalType = 'privacy' | 'terms' | 'about' | 'contact' | null;

interface LegalModalProps {
  type: LegalModalType;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  if (!type) return null;

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;
    setContactSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-3xl max-h-[85vh] bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-['Cairo'] text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            {type === 'privacy' && <ShieldCheck className="w-6 h-6 text-amber-400" />}
            {type === 'terms' && <FileText className="w-6 h-6 text-amber-400" />}
            {type === 'about' && <Info className="w-6 h-6 text-amber-400" />}
            {type === 'contact' && <Mail className="w-6 h-6 text-amber-400" />}
            <h2 className="text-lg sm:text-xl font-bold text-amber-300">
              {type === 'privacy' && 'سياسة الخصوصية (Privacy Policy)'}
              {type === 'terms' && 'شروط واتفاقية الاستخدام (Terms of Service)'}
              {type === 'about' && 'من نحن (About Us)'}
              {type === 'contact' && 'اتصل بنا (Contact Us)'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm sm:text-base leading-relaxed text-slate-300 divide-y divide-slate-800/60">

          {/* 1. PRIVACY POLICY */}
          {type === 'privacy' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs sm:text-sm">
                <p className="font-semibold mb-1 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                  التزامنا بحماية خصوصيتك وامتثالنا لمعايير Google AdSense
                </p>
                تولِي منصة <strong>TraceBonne</strong> أهمية بالغَة لخصوصية زوارها ومستخدميها. توضح هذه الوثيقة أنواع المعلومات الشخصية التي نجمعها وكيفية استخدامها وحمايتها وفقاً لأعلى المعايير القانونية.
              </div>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  1. ملفات تعريف الارتباط (Cookies) وشبكات التتبع
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm">
                  نستخدم ملفات تعريف الارتباط (Cookies) لتخزين تفضيلات المستخدمين وتحديد الصفحات التي يزورونها لتسريع الأداء وتحسين تجربة التصفح.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Cookie className="w-4 h-4 text-amber-400 shrink-0" />
                  2. إعلانات Google AdSense وشبكات الإعلانات الخارجية
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm">
                  تستعين منصة <strong>TraceBonne</strong> بشركات إعلان كطرف ثالث (مثل Google AdSense) لعرض الإعلانات عند زيارتك للموقع.
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-slate-400 text-xs sm:text-sm pr-2">
                  <li>
                    تستخدم شركة <strong>Google</strong> بصفتها مورّداً خاريجاً ملفات تعريف الارتباط DART لعرض الإعلانات بناءً على زيارات المستخدم لموقعنا والمواقع الأخرى على شبكة الإنترنت.
                  </li>
                  <li>
                    يمكن للمستخدمين إلغاء استخدام ملفات تعريف الارتباط DART بزيارة <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline inline-flex items-center gap-1">سياسة الخصوصية الخاصة ببنود الإعلانات وشبكة المحتوى لدى Google <ExternalLink className="w-3 h-3 inline" /></a>.
                  </li>
                  <li>
                    قد تستخدم شبكات الإعلانات الأخرى ملفات تعريف الارتباط أو تقنيات الجافا سكربت وقياس فعالية إعلاناتهم، وليس لـ TraceBonne أي وصول أو سيطرة على هذه الملفات التي يستخدمها المعلنون.
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  3. ملفات السجل (Log Files)
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm">
                  مثل معظم الخوادم، يستخدم موقعنا ملفات السجل لأغراض الإدارة والتحليل. تشمل هذه البيانات: عناوين بروتوكول الإنترنت (IP)، نوع المتصفح، مزود خدمة الإنترنت (ISP)، طابع التاريخ والوقت، وعدد النقرات للتحليل الفني غير المعرّف للشخصية.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  4. موافقة المستخدم وتحديثات السياسة
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm">
                  باستخدامك لمنصتنا، فإنك توافق على سياسة الخصوصية الخاصة بنا وبنودها. ونحتفظ بالحق في تحديث هذه السياسة عند الحاجة وتظهر أي تغييرات فوراً على هذه الصفحة.
                </p>
              </section>
            </div>
          )}

          {/* 2. TERMS OF SERVICE */}
          {type === 'terms' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-xs sm:text-sm">
                مرحباً بك في منصة <strong>TraceBonne</strong>. يرجى قراءة اتفاقية الاستخدام التالية بعناية قبل استخدام أدوات صنع وتصميم فيديوهات الأحاديث النبوية.
              </div>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-100">1. قبول الشروط</h3>
                <p className="text-slate-300 text-xs sm:text-sm">
                  من خلال الوصول إلى منصة TraceBonne أو استخدامها، فإنك تقر بالالتزام بجميع القوانين واللوائح المعمول بها والمسؤولية الكاملة عن الامتثال لأي قوانين محلية ذات صلة.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-100">2. حقوق الملكية الفكرية والاستخدام المسموح</h3>
                <p className="text-slate-300 text-xs sm:text-sm">
                  جميع الفيديوهات والبطاقات النبوية المنتجة عبر أدواتنا مخصصة للاستخدام الشخصي والدعوي والنشر غير التجاري على منصات التواصل الاجتماعي (TikTok, Reels, Shorts). يُمنع استخدام المنصة لنشر معلومات مغلوطة أو أحاديث موضوعة مكذوبة على رسول الله ﷺ.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-100">3. دقة الأحاديث والمصادر</h3>
                <p className="text-slate-300 text-xs sm:text-sm">
                  نسعى جاهدين لتدقيق النصوص والكتب الواردة في المنصة من مصادرها المعترف بها (صحيح البخاري، صحيح مسلم، سنن أبي داود، إلخ). ويتحمل صانع المحتوى مسؤولية المراجعة النهائية قبل النشر العام.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-100">4. اخلاء المسؤولية</h3>
                <p className="text-slate-300 text-xs sm:text-sm">
                  يتم تقديم المنصة وأدواتها "كما هي" دون أي ضمانات صريحة أو ضمنية. لا نتحمل المسؤولية عن أي انقطاع مؤقت في الخدمة أو أي مشاكل فنية خارجة عن إرادتنا.
                </p>
              </section>
            </div>
          )}

          {/* 3. ABOUT US */}
          {type === 'about' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-slate-950 border border-amber-500/30">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shrink-0 shadow-lg">
                  <span className="font-['Amiri'] font-bold text-2xl text-slate-950">TB</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-amber-300 font-['Cairo']">TraceBonne | منصة صانع فيديوهات الأحاديث النبوية</h3>
                  <p className="text-xs sm:text-sm text-slate-400">
                    رؤيتنا المبتكرة لتمكين صناع المحتوى والباحثين من إنتاج بطاقات وفيديوهات دعوية بصرية بأعلى جودة عالمية.
                  </p>
                </div>
              </div>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-100">من نحن؟</h3>
                <p className="text-slate-300 text-xs sm:text-sm">
                  <strong>TraceBonne</strong> هي منصة عربية إسلامية مبتكرة تهدف إلى تسهيل وتطوير عملية نشر السنة النبوية الشريفة عبر أدوات رقمية ذكية. تتيح للمستخدمين تحويل الأحاديث الشريفة إلى مقاطع فيديو متناسقة بدقة 9:16 مع مزامنة الصوت والخلفيات السينمائية وتشكيل الخطوط العربية.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-100">قيمنا ورسالتنا</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <li className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
                    <strong className="text-amber-400 block mb-1">الدقة والأمانة العلمية:</strong>
                    الاعتماد على مصادر ومراجع معتمدة للأحاديث الشريفة.
                  </li>
                  <li className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
                    <strong className="text-amber-400 block mb-1">الجمالية والإتقان:</strong>
                    الاهتمام بأدق التفاصيل البصرية والنظرية والسمعية.
                  </li>
                  <li className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
                    <strong className="text-amber-400 block mb-1">السهولة والسرعة:</strong>
                    توفير أدوات تعمل بسلاسة وبدون خبرة سابقة في المونتاج.
                  </li>
                  <li className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
                    <strong className="text-amber-400 block mb-1">مجاني للجميع:</strong>
                    إتاحة الخدمة مجاناً لمساعدة كل راغب في نشر الخير.
                  </li>
                </ul>
              </section>
            </div>
          )}

          {/* 4. CONTACT US */}
          {type === 'contact' && (
            <div className="space-y-5">
              {contactSubmitted ? (
                <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-amber-400 mx-auto" />
                  <h3 className="text-lg font-bold text-amber-300">تم استلام رسالتك بنجاح!</h3>
                  <p className="text-xs sm:text-sm text-slate-300">
                    شكراً لتواصلك مع فريق TraceBonne. سنقوم بمراجعة استفسارك والرد عليك على البريد الإلكتروني في أقرب وقت (خلال 24 ساعة).
                  </p>
                  <button
                    onClick={() => setContactSubmitted(false)}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition"
                  >
                    إرسال رسالة أخرى
                  </button>
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm font-semibold text-slate-200">البريد الإلكتروني المباشر للدعم:</p>
                      <p className="text-xs font-mono text-amber-400">19rahaoui91@gmail.com</p>
                    </div>
                    <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                      رد خلال 24 ساعة
                    </span>
                  </div>

                  <form onSubmit={handleSubmitContact} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">الاسم الكامل *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="مثال: أحمد العبدالله"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 focus:border-amber-500 focus:outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">البريد الإلكتروني *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@example.com"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 focus:border-amber-500 focus:outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">موضوع الرسالة</label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="استفسار، اقتراح، أو طلب مساعدة..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 focus:border-amber-500 focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">الرسالة *</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="اكتب تفاصيل استفسارك هنا..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 focus:border-amber-500 focus:outline-none transition resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition"
                    >
                      <Send className="w-4 h-4" />
                      إرسال الرسالة الان
                    </button>
                  </form>
                </>
              )}
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 text-center text-xs text-slate-500 shrink-0">
          جميع الحقوق محفوظة لـ © TraceBonne 2024 - منصة صانع فيديوهات الأحاديث النبوية
        </div>
      </div>
    </div>
  );
};
