import { Article, ARTICLES_DATA } from '../data/articles';

const STORAGE_KEY = 'tracebonne_custom_articles_v1';

export const getStoredArticles = (): Article[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with initial ARTICLES_DATA
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ARTICLES_DATA));
      return ARTICLES_DATA;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return ARTICLES_DATA;
  } catch (err) {
    console.error('Error reading articles from localStorage:', err);
    return ARTICLES_DATA;
  }
};

export const saveStoredArticle = (article: Article): Article[] => {
  const articles = getStoredArticles();
  const existingIdx = articles.findIndex((a) => a.id === article.id);

  let updated: Article[];
  if (existingIdx >= 0) {
    updated = [...articles];
    updated[existingIdx] = article;
  } else {
    updated = [article, ...articles];
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('tracebonne_articles_updated'));
  } catch (err) {
    console.error('Error saving article to localStorage:', err);
  }

  return updated;
};

export const deleteStoredArticle = (id: string): Article[] => {
  const articles = getStoredArticles();
  const updated = articles.filter((a) => a.id !== id);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('tracebonne_articles_updated'));
  } catch (err) {
    console.error('Error deleting article from localStorage:', err);
  }

  return updated;
};

export const resetStoredArticles = (): Article[] => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ARTICLES_DATA));
    window.dispatchEvent(new Event('tracebonne_articles_updated'));
  } catch (err) {
    console.error('Error resetting articles:', err);
  }
  return ARTICLES_DATA;
};

export const generateGitHubCode = (articles: Article[]): string => {
  return `import { Article } from './articles';\n\nexport const ARTICLES_DATA: Article[] = ${JSON.stringify(
    articles,
    null,
    2
  )};\n`;
};
