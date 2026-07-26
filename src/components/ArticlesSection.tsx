import React, { useState, useEffect } from 'react';
import { Article } from '../data/articles';
import { getStoredArticles } from '../utils/articleStore';
import { BookOpen, Clock, ArrowLeft, X, Sparkles, Share2, Check } from 'lucide-react';

export const ArticlesSection: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [copied, setCopied] = useState(false);

  const loadArticles = () => {
    const list = getStoredArticles();
    setArticles(list);
  };

  useEffect(() => {
    loadArticles();
    const handleStorageUpdate = () => loadArticles();
    window.addEventListener('tracebonne_articles_updated', handleStorageUpdate);
    return () => {
      window.removeEventListener('tracebonne_articles_updated', handleStorageUpdate);
    };
  }, []);

  const handleShare = (article: Article) => {
    const shareUrl = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${article.title}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="w-full mt-12 mb-8 pt-8 border-t border-slate-800/80 font-['Cairo']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Title & Header Badge */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>المعرفة والدعوة الرقمية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-['Cairo'] tracking-tight">
            مقالات وفوائد نبوية (Articles & Insights)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            دليلك الشامل لتعلم أفضل الممارسات التقنية والدعوية لصناعة مقاطع فيديو إسلامية قصيرة وعالية الجودة تنشر السنة النبوية الشريفة.
          </p>
        </div>

        {/* 6 Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {articles.map((article) => (
            <article
              key={article.id}
              className="group bg-slate-900/80 border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-300 flex flex-col"
            >
              {/* Image Container with Zoom hover */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-950 shrink-0">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-amber-500/30 text-[11px] font-bold text-amber-300">
                  {article.category}
                </div>

                {/* Read Time */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900/90 px-2.5 py-1 rounded-md backdrop-blur-sm border border-slate-800">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{article.readTime}</span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-amber-300 transition line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                {/* Action Button */}
                <div className="pt-2 border-t border-slate-800/60">
                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-xs sm:text-sm font-bold border border-slate-700 hover:border-amber-400 transition flex items-center justify-center gap-2 group/btn shadow-md"
                  >
                    <span>اقرأ المقال الكامل</span>
                    <ArrowLeft className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* ARTICLE READER MODAL */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div 
            className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-['Cairo'] text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative h-48 sm:h-64 w-full shrink-0 overflow-hidden">
              <img
                src={selectedArticle.imageUrl}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/30" />
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 left-4 p-2.5 rounded-full bg-slate-950/80 text-slate-300 hover:text-white hover:bg-slate-900 transition border border-slate-700/80 z-10"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title & Metadata Over Banner */}
              <div className="absolute bottom-4 right-4 left-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-500/90 text-slate-950 font-bold text-xs">
                    {selectedArticle.category}
                  </span>
                  <span className="text-xs text-slate-300 flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {selectedArticle.readTime}
                  </span>
                </div>
                <h2 className="text-lg sm:text-2xl font-black text-white leading-tight font-['Cairo']">
                  {selectedArticle.title}
                </h2>
              </div>
            </div>

            {/* Modal Content Scroll Area */}
            <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed">
              
              {/* Introduction */}
              <p className="text-slate-200 text-base sm:text-lg font-semibold bg-amber-500/10 p-4 rounded-xl border-r-4 border-amber-400 font-['Amiri'] leading-loose">
                {selectedArticle.content.intro}
              </p>

              {/* Article Sections */}
              <div className="space-y-6">
                {selectedArticle.content.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-amber-300 flex items-center gap-2 border-b border-slate-800 pb-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                      {sec.title}
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed pr-3">
                      {sec.body}
                    </p>
                  </div>
                ))}
              </div>

              {/* Conclusion */}
              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/20 text-xs sm:text-sm text-amber-200/90 font-['Amiri'] leading-loose">
                <strong className="text-amber-400 block font-['Cairo'] text-xs mb-1">الخلاصة والغاية:</strong>
                {selectedArticle.content.conclusion}
              </div>

            </div>

            {/* Modal Footer Controls */}
            <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-4 shrink-0">
              <button
                onClick={() => handleShare(selectedArticle)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-amber-400" />
                    <span>مشاركة المقال</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition shadow-lg shadow-amber-500/20"
              >
                إغلاق المقال
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
