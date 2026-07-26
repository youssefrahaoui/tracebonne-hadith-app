import React, { useEffect, useState } from 'react';
import { Article } from '../data/articles';
import { Clock, ArrowRight, Sparkles, Share2, Check, BookOpen, ShieldCheck, Home } from 'lucide-react';
import { Footer } from './Footer';
import { LegalModal, LegalModalType } from './LegalModal';

interface ArticlePageProps {
  article: Article;
  onBack: () => void;
}

export const ArticlePage: React.FC<ArticlePageProps> = ({ article, onBack }) => {
  const [copied, setCopied] = useState(false);
  const [legalModalType, setLegalModalType] = useState<LegalModalType>(null);

  // Dynamic SEO Metadata Update
  useEffect(() => {
    // Save previous title and description
    const previousTitle = document.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    const previousDesc = metaDesc ? metaDesc.getAttribute('content') : '';

    // Set article specific SEO title & meta description
    document.title = `${article.title} | TraceBonne`;
    if (metaDesc) {
      metaDesc.setAttribute('content', article.summary || article.content.intro);
    }

    // Scroll to top
    window.scrollTo(0, 0);

    return () => {
      // Restore previous on unmount
      document.title = previousTitle;
      if (metaDesc && previousDesc) {
        metaDesc.setAttribute('content', previousDesc);
      }
    };
  }, [article]);

  const handleShare = () => {
    const fullUrl = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${article.title}\n${fullUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Cairo'] flex flex-col selection:bg-amber-500 selection:text-slate-950">
      
      {/* HEADER NAV */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/90 px-4 sm:px-6 py-3.5 shadow-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-amber-500/20 group"
          >
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            <span>العودة إلى صانع الفيديوهات</span>
          </button>

          {/* Logo Brand link */}
          <div 
            onClick={onBack}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-extrabold font-['Amiri'] text-lg shadow-md group-hover:scale-105 transition-transform">
              TB
            </div>
            <span className="font-bold text-sm text-slate-200 hidden sm:inline group-hover:text-amber-400 transition">
              TraceBonne
            </span>
          </div>

        </div>
      </header>

      {/* ARTICLE BODY */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Top Navigation & Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="hover:text-amber-400 flex items-center gap-1 transition">
              <Home className="w-3.5 h-3.5" />
              <span>الرئيسية</span>
            </button>
            <span>/</span>
            <span className="text-amber-400 font-semibold">{article.category}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>وقت القراءة: {article.readTime}</span>
          </div>
        </div>

        {/* Article Featured Hero Banner */}
        <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <div className="absolute bottom-6 right-6 left-6 space-y-2">
            <span className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs inline-block shadow-md">
              {article.category}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-['Cairo'] leading-tight drop-shadow-md">
              {article.title}
            </h1>
          </div>
        </div>

        {/* ADSENSE PLACEHOLDER #1 (Below Title / Hero) */}
        <div className="w-full p-4 sm:p-6 rounded-2xl bg-slate-900/60 border border-dashed border-amber-500/30 text-center space-y-2 shadow-inner">
          <div className="text-[11px] font-mono uppercase tracking-widest text-amber-400/80 font-bold">
            — مساحة إعلانية متوافقة مع Google AdSense —
          </div>
          <div className="text-xs text-slate-500">
            [AdSense Banner Slot 1 - Top Article Unit]
          </div>
          {/* Real Google AdSense code script tag can be placed here */}
          {/* <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" data-ad-slot="1234567890" data-ad-format="auto" data-full-width-responsive="true"></ins> */}
        </div>

        {/* Intro Highlight Box */}
        {article.content.intro && (
          <div className="p-5 sm:p-6 rounded-2xl bg-amber-500/10 border-r-4 border-amber-400 border-y border-l border-amber-500/20 text-slate-200 text-base sm:text-lg font-['Amiri'] leading-loose shadow-lg">
            {article.content.intro}
          </div>
        )}

        {/* Article Sections (H2 + Body) */}
        <article className="space-y-8 text-slate-300 leading-relaxed text-base sm:text-lg">
          {article.content.sections.map((section, idx) => (
            <section key={idx} className="space-y-3 bg-slate-900/40 p-5 sm:p-6 rounded-2xl border border-slate-800/80">
              <h2 className="text-xl sm:text-2xl font-bold text-amber-300 font-['Cairo'] flex items-center gap-2 border-b border-slate-800 pb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                {section.title}
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed pr-2 font-['Cairo']">
                {section.body}
              </p>
            </section>
          ))}
        </article>

        {/* Conclusion Box */}
        {article.content.conclusion && (
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-amber-500/30 text-amber-200 text-sm sm:text-base font-['Amiri'] leading-loose shadow-xl">
            <strong className="text-amber-400 font-['Cairo'] block text-sm mb-1.5 font-bold">
              الخلاصة والغاية الدعوية:
            </strong>
            {article.content.conclusion}
          </div>
        )}

        {/* ADSENSE PLACEHOLDER #2 (End of Content) */}
        <div className="w-full p-4 sm:p-6 rounded-2xl bg-slate-900/60 border border-dashed border-amber-500/30 text-center space-y-2 shadow-inner">
          <div className="text-[11px] font-mono uppercase tracking-widest text-amber-400/80 font-bold">
            — مساحة إعلانية متوافقة مع Google AdSense —
          </div>
          <div className="text-xs text-slate-500">
            [AdSense Banner Slot 2 - Bottom Article Unit]
          </div>
          {/* <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" data-ad-slot="0987654321" data-ad-format="auto" data-full-width-responsive="true"></ins> */}
        </div>

        {/* Article Footer & Navigation Buttons */}
        <div className="pt-6 border-t border-slate-800/90 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={handleShare}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs sm:text-sm font-bold border border-slate-800 transition flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>تم نسخ رابط المقال!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>مشاركة المقال</span>
              </>
            )}
          </button>

          <button
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 group"
          >
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            <span>العودة إلى صانع الفيديوهات</span>
          </button>
        </div>

      </main>

      {/* FOOTER */}
      <Footer onOpenLegalModal={setLegalModalType} />

      {/* LEGAL MODAL */}
      {legalModalType && (
        <LegalModal
          type={legalModalType}
          onClose={() => setLegalModalType(null)}
        />
      )}

    </div>
  );
};
