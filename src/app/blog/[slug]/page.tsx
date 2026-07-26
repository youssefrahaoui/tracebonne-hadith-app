import React, { useEffect, useState } from 'react';
import { Article } from '../../../data/articles';
import { getStoredArticles } from '../../../utils/articleStore';
import { ArticlePage } from '../../../components/ArticlePage';

interface BlogPageProps {
  params?: {
    slug?: string;
  };
}

export default function SingleArticlePage({ params }: BlogPageProps) {
  const [currentSlug, setCurrentSlug] = useState<string>('');
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    // Read slug from props or location pathname /blog/[slug]
    const pathSlug = params?.slug || window.location.pathname.replace('/blog/', '').replace('/blog', '');
    setCurrentSlug(pathSlug);

    const articles = getStoredArticles();
    const found = articles.find((a) => a.id === pathSlug) || articles[0];
    setArticle(found);
  }, [params]);

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-['Cairo']">
        <p className="text-sm text-slate-400">جاري تحميل المقال...</p>
      </div>
    );
  }

  const handleBack = () => {
    window.history.pushState(null, '', '/');
    window.dispatchEvent(new Event('popstate'));
  };

  return <ArticlePage article={article} onBack={handleBack} />;
}
