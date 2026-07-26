import React, { useState, useEffect } from 'react';
import { Article } from '../data/articles';
import { getStoredArticles } from '../utils/articleStore';
import { BookOpen, Clock, ArrowLeft, X, Sparkles, Share2, Check } from 'lucide-react';

interface ArticlesSectionProps {
  onNavigateArticle?: (slug: string) => void;
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({ onNavigateArticle }) => {
  const [articles, setArticles] = useState<Article[]>([]);

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

  const handleOpenArticle = (slug: string) => {
    if (onNavigateArticle) {
      onNavigateArticle(slug);
    } else {
      window.history.pushState(null, '', `/blog/${slug}`);
      window.dispatchEvent(new Event('popstate'));
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
                    onClick={() => handleOpenArticle(article.id)}
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

    </section>
  );
};
