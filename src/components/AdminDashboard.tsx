import React, { useState, useEffect } from 'react';
import { Article } from '../data/articles';
import {
  getStoredArticles,
  saveStoredArticle,
  deleteStoredArticle,
  resetStoredArticles,
  generateGitHubCode,
} from '../utils/articleStore';
import {
  X,
  Plus,
  Trash2,
  Save,
  Code,
  Copy,
  Check,
  Eye,
  Edit3,
  RotateCcw,
  Sparkles,
  BookOpen,
  Clock,
  ArrowLeft,
  Image as ImageIcon,
  Layers,
  CheckCircle2,
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_CATEGORIES = [
  'الدعوة الرقمية',
  'دليل الاستخدام',
  'تصميم ومونتاج',
  'الصوت والدبلجة',
  'نمو الحسابات',
  'تقنيات المونتاج',
  'علوم الحديث',
  'فوائد إيمانية',
];

const PRESET_IMAGES = [
  { label: 'كتاب ومصاحف', url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80' },
  { label: 'شاشة وتكنولوجيا', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80' },
  { label: 'تصميم تجريدي', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80' },
  { label: 'صوت وميكروفون', url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80' },
  { label: 'تسويق ونمو', url: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c1d9?auto=format&fit=crop&w=800&q=80' },
  { label: 'ميكسر ومونتاج', url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80' },
];

const EMPTY_ARTICLE: Article = {
  id: '',
  title: '',
  category: 'الدعوة الرقمية',
  readTime: '3 دقائق',
  imageUrl: PRESET_IMAGES[0].url,
  summary: '',
  content: {
    intro: '',
    sections: [{ title: '', body: '' }],
    conclusion: '',
  },
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentArticle, setCurrentArticle] = useState<Article>(EMPTY_ARTICLE);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const loaded = getStoredArticles();
      setArticles(loaded);
      if (loaded.length > 0) {
        setCurrentArticle(loaded[0]);
      } else {
        setCurrentArticle(EMPTY_ARTICLE);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleNewArticle = () => {
    const newId = `article-${Date.now()}`;
    setCurrentArticle({
      ...EMPTY_ARTICLE,
      id: newId,
    });
    setActiveTab('edit');
    showNotification('جاهز لكتابة مقال جديد');
  };

  const handleSelectArticle = (art: Article) => {
    setCurrentArticle({ ...art });
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentArticle.title.trim()) {
      alert('يرجى إدخال عنوان المقال');
      return;
    }

    const articleToSave = {
      ...currentArticle,
      id: currentArticle.id || `article-${Date.now()}`,
    };

    const updated = saveStoredArticle(articleToSave);
    setArticles(updated);
    setCurrentArticle(articleToSave);
    showNotification('تم حفظ المقال بنجاح وإعادة نشر الموقع تلقائياً!');
  };

  const handleDeleteArticle = (id: string) => {
    if (!id) return;
    if (window.confirm('هل أنت تأكد من رغبتك في حذف هذا المقال نهائياً؟')) {
      const updated = deleteStoredArticle(id);
      setArticles(updated);
      if (updated.length > 0) {
        setCurrentArticle(updated[0]);
      } else {
        handleNewArticle();
      }
      showNotification('تم حذف المقال بنجاح.');
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('هل تريد إعادة تعيين المقالات إلى البيانات الافتراضية؟')) {
      const reset = resetStoredArticles();
      setArticles(reset);
      if (reset.length > 0) setCurrentArticle(reset[0]);
      showNotification('تمت الاستعادة للافتراضي.');
    }
  };

  const handleCopyCode = () => {
    const code = generateGitHubCode(articles);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  // Section handling helpers
  const handleAddSection = () => {
    setCurrentArticle({
      ...currentArticle,
      content: {
        ...currentArticle.content,
        sections: [...currentArticle.content.sections, { title: '', body: '' }],
      },
    });
  };

  const handleRemoveSection = (idx: number) => {
    const secs = [...currentArticle.content.sections];
    secs.splice(idx, 1);
    setCurrentArticle({
      ...currentArticle,
      content: {
        ...currentArticle.content,
        sections: secs.length > 0 ? secs : [{ title: '', body: '' }],
      },
    });
  };

  const handleSectionChange = (idx: number, field: 'title' | 'body', val: string) => {
    const secs = [...currentArticle.content.sections];
    secs[idx] = { ...secs[idx], [field]: val };
    setCurrentArticle({
      ...currentArticle,
      content: {
        ...currentArticle.content,
        sections: secs,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in font-['Cairo']">
      <div 
        className="relative w-full max-w-6xl max-h-[92vh] bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-bold shadow-md">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-amber-300">
                لوحة تحكم إدارة المقالات (Private Admin Dashboard)
              </h2>
              <p className="text-xs text-slate-400">إضافة وتعديل وحذف المقالات والفوائد بسهولة</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCodeModal(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5 transition"
            >
              <Code className="w-4 h-4" />
              <span className="hidden sm:inline">نسخ كود GitHub</span>
            </button>

            <button
              onClick={handleNewArticle}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>مقال جديد</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Layout (Sidebar + Editor / Preview) */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-slate-800">
          
          {/* ARTICLE LIST SIDEBAR (3 cols on LG) */}
          <div className="lg:col-span-4 bg-slate-950/60 p-4 overflow-y-auto space-y-3 shrink-0 max-h-[200px] lg:max-h-none">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 pb-2 border-b border-slate-800">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-400" />
                قائمة المقالات ({articles.length})
              </span>
              <button
                onClick={handleResetDefaults}
                title="إعادة الاستعادة للافتراضي"
                className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3 h-3" />
                استعادة
              </button>
            </div>

            <div className="space-y-2">
              {articles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => handleSelectArticle(art)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                    currentArticle.id === art.id
                      ? 'bg-amber-500/10 border-amber-500/50 text-amber-300 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950 text-amber-400 border border-slate-800">
                      {art.category}
                    </span>
                    <h4 className="text-xs font-bold truncate">{art.title || 'مقال بدون عنوان'}</h4>
                  </div>
                  {currentArticle.id === art.id && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* EDITOR & LIVE PREVIEW PANEL (8 cols on LG) */}
          <div className="lg:col-span-8 flex flex-col h-full overflow-hidden bg-slate-900">
            
            {/* View Mode Tabs */}
            <div className="flex items-center justify-between px-5 py-2.5 bg-slate-950/40 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('edit')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                    activeTab === 'edit'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  محرر المقال
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                    activeTab === 'preview'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  معاينة مباشرة (Preview)
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {currentArticle.id && articles.some((a) => a.id === currentArticle.id) && (
                  <button
                    onClick={() => handleDeleteArticle(currentArticle.id)}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف</span>
                  </button>
                )}
                <button
                  onClick={handleSaveArticle}
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>حفظ المقال</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT: EDIT FORM */}
            {activeTab === 'edit' && (
              <form onSubmit={handleSaveArticle} className="p-5 overflow-y-auto space-y-5 flex-1">
                
                {/* Title & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="block text-xs font-semibold text-slate-300">عنوان المقال *</label>
                    <input
                      type="text"
                      required
                      value={currentArticle.title}
                      onChange={(e) => setCurrentArticle({ ...currentArticle, title: e.target.value })}
                      placeholder="أدخل عنوان المقال..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 focus:border-amber-500 focus:outline-none transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-300">التصنيف *</label>
                    <input
                      type="text"
                      list="categories-list"
                      value={currentArticle.category}
                      onChange={(e) => setCurrentArticle({ ...currentArticle, category: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 focus:border-amber-500 focus:outline-none transition"
                    />
                    <datalist id="categories-list">
                      {PRESET_CATEGORIES.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>
                </div>

                {/* Read time & Image URL */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-300">وقت القراءة</label>
                    <input
                      type="text"
                      value={currentArticle.readTime}
                      onChange={(e) => setCurrentArticle({ ...currentArticle, readTime: e.target.value })}
                      placeholder="مثال: 3 دقائق"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 focus:border-amber-500 focus:outline-none transition"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="block text-xs font-semibold text-slate-300">رابط صورة المقال (Unsplash / URL)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentArticle.imageUrl}
                        onChange={(e) => setCurrentArticle({ ...currentArticle, imageUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 focus:border-amber-500 focus:outline-none transition font-mono"
                      />
                    </div>
                    {/* Presets */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
                      <span className="text-[10px] text-slate-400 shrink-0">نماذج صور:</span>
                      {PRESET_IMAGES.map((p, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setCurrentArticle({ ...currentArticle, imageUrl: p.url })}
                          className="px-2 py-0.5 rounded text-[10px] bg-slate-950 hover:bg-amber-500/20 text-slate-300 border border-slate-800 shrink-0"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Short Summary */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">الملخص القصير (2-3 أسطر)</label>
                  <textarea
                    rows={2}
                    value={currentArticle.summary}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, summary: e.target.value })}
                    placeholder="ملخص يظهر في البطاقة الرئيسية..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 focus:border-amber-500 focus:outline-none transition resize-none"
                  />
                </div>

                {/* Content Intro */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">مقدمة المقال (Introduction)</label>
                  <textarea
                    rows={3}
                    value={currentArticle.content.intro}
                    onChange={(e) =>
                      setCurrentArticle({
                        ...currentArticle,
                        content: { ...currentArticle.content, intro: e.target.value },
                      })
                    }
                    placeholder="مقدمة مشوقة تشرح الهدف من المقال..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 focus:border-amber-500 focus:outline-none transition resize-none"
                  />
                </div>

                {/* Article Sections (Dynamic List) */}
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-amber-300">أقسام المقال التفصيلية (Sections)</label>
                    <button
                      type="button"
                      onClick={handleAddSection}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-400 text-xs font-bold flex items-center gap-1 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      إضافة قسم جديد
                    </button>
                  </div>

                  {currentArticle.content.sections.map((sec, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 relative">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-slate-400">قسم #{idx + 1}</span>
                        {currentArticle.content.sections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSection(idx)}
                            className="text-rose-400 hover:text-rose-300 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={sec.title}
                        onChange={(e) => handleSectionChange(idx, 'title', e.target.value)}
                        placeholder="عنوان الفرعي للقسم..."
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
                      />
                      <textarea
                        rows={3}
                        value={sec.body}
                        onChange={(e) => handleSectionChange(idx, 'body', e.target.value)}
                        placeholder="محتوى القسم والشرح..."
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-amber-500 focus:outline-none resize-none"
                      />
                    </div>
                  ))}
                </div>

                {/* Conclusion */}
                <div className="space-y-1 pt-2 border-t border-slate-800">
                  <label className="block text-xs font-semibold text-slate-300">الخلاصة والغاية (Conclusion)</label>
                  <textarea
                    rows={2}
                    value={currentArticle.content.conclusion}
                    onChange={(e) =>
                      setCurrentArticle({
                        ...currentArticle,
                        content: { ...currentArticle.content, conclusion: e.target.value },
                      })
                    }
                    placeholder="خاتمة أو حديث شريف يلخص الفكرة..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 focus:border-amber-500 focus:outline-none transition resize-none"
                  />
                </div>

              </form>
            )}

            {/* TAB CONTENT: LIVE PREVIEW */}
            {activeTab === 'preview' && (
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                  هذه المعاينة توضح كيف سيظهر المقال للزوار على الصفحة الرئيسية وعند فتح النافذة التفصيلية.
                </div>

                {/* Card preview */}
                <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="relative h-44 w-full bg-slate-950">
                    <img
                      src={currentArticle.imageUrl || PRESET_IMAGES[0].url}
                      alt={currentArticle.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-slate-950/80 text-amber-300 text-[11px] font-bold">
                      {currentArticle.category}
                    </div>
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 text-xs text-slate-300 bg-slate-900/90 px-2 py-0.5 rounded">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{currentArticle.readTime}</span>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-base text-slate-100">{currentArticle.title || 'عنوان المقال المعاين'}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{currentArticle.summary || 'ملخص المقال يظهر هنا...'}</p>
                  </div>
                </div>

                {/* Detailed Article reader preview */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 max-w-2xl mx-auto">
                  <h2 className="text-xl font-bold text-amber-300 font-['Cairo']">{currentArticle.title}</h2>
                  <p className="text-sm text-slate-300 font-['Amiri'] leading-relaxed bg-amber-500/5 p-3 rounded-xl border-r-2 border-amber-400">
                    {currentArticle.content.intro || 'المقدمة ستظهر هنا...'}
                  </p>
                  <div className="space-y-3">
                    {currentArticle.content.sections.map((sec, i) => (
                      <div key={i} className="space-y-1">
                        <h4 className="text-sm font-bold text-amber-400">{sec.title || `قسم #${i + 1}`}</h4>
                        <p className="text-xs text-slate-300">{sec.body || 'محتوى القسم...'}</p>
                      </div>
                    ))}
                  </div>
                  {currentArticle.content.conclusion && (
                    <div className="p-3 rounded-lg bg-slate-900 text-xs text-amber-200 font-['Amiri']">
                      <strong>الخلاصة:</strong> {currentArticle.content.conclusion}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* CODE EXPORT MODAL FOR GITHUB */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in font-['Cairo']">
          <div 
            className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl p-6 text-slate-100 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-amber-300">نسخ كود GitHub الدائم (JSON/TS)</h3>
              </div>
              <button
                onClick={() => setShowCodeModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              يمكنك نسخ هذا الكود البرمجي المحدث ولصقه مباشرة داخل الملف <code className="text-amber-400 font-mono">src/data/articles.ts</code> في مشروع GitHub لترسيخ المقالات نهائياً لجميع الزوار بكل أمان.
            </p>

            <div className="relative">
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-300/90 font-mono max-h-60 overflow-y-auto whitespace-pre-wrap dir-ltr text-left dir-ltr">
                {generateGitHubCode(articles)}
              </pre>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">عدد المقالات المضمنة: {articles.length}</span>
              <button
                onClick={handleCopyCode}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-950" />
                    <span>تم النسخ بنجاح!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>نسخ الكود إلى الحافظة</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
