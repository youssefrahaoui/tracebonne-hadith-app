import React, { useState } from 'react';
import { BookOpen, Search, Edit3, CheckCircle2, RefreshCw, Wand2, Filter } from 'lucide-react';
import { HadithItem } from '../types';
import { DEFAULT_HADITHS } from '../data/themes';
import { cleanNarratorAttributions, fetchHadithsFromApi } from '../utils/hadithUtils';

interface HadithSelectorProps {
  currentHadithText: string;
  onApplyHadithText: (newText: string, isCleaned: boolean) => void;
}

export const HadithSelector: React.FC<HadithSelectorProps> = ({
  currentHadithText,
  onApplyHadithText,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'api' | 'custom'>('presets');
  const [autoClean, setAutoClean] = useState<boolean>(true);
  const [customText, setCustomText] = useState<string>(currentHadithText);

  // API Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBook, setSelectedBook] = useState<string>('sahih-bukhari');
  const [apiHadiths, setApiHadiths] = useState<HadithItem[]>([]);
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSelectPreset = (hadith: (typeof DEFAULT_HADITHS)[0]) => {
    const textToUse = autoClean ? hadith.cleanedText : hadith.rawText;
    setCustomText(textToUse);
    onApplyHadithText(textToUse, autoClean);
  };

  const handleSearchApi = async () => {
    setIsLoadingApi(true);
    setApiError(null);
    try {
      const results = await fetchHadithsFromApi(searchQuery, selectedBook);
      if (results.length === 0) {
        setApiError('لم يتم العثور على نتائج للحديث المطابق، يمكنك استخدام البحث أو الأحاديث الجاهزة.');
      } else {
        setApiHadiths(results);
      }
    } catch (err) {
      setApiError('حدث خطأ أثناء الاتصال بالـ API. تم تفعيل الأحاديث المخزنة تلقائياً.');
    } finally {
      setIsLoadingApi(false);
    }
  };

  const handleConfirmCustomText = () => {
    if (!customText.trim()) return;
    const finalProcessedText = autoClean ? cleanNarratorAttributions(customText) : customText;
    // CRITICAL: Resets segments, timestamps, and active index to 0 instantly!
    onApplyHadithText(finalProcessedText, autoClean);
  };

  const handleCleanTextClick = () => {
    const cleaned = cleanNarratorAttributions(customText);
    setCustomText(cleaned);
  };

  return (
    <div className="bg-slate-900/90 border border-amber-500/20 rounded-2xl p-4 lg:p-5 shadow-xl space-y-4">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <h2 className="font-bold text-base text-slate-100 font-['Cairo']">
            اختيار ومصادر الحديث النبوي
          </h2>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'presets'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>حديث شهير</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'api'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>مكتبة API</span>
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'custom'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>لصق مخصص</span>
          </button>
        </div>
      </div>

      {/* Auto-Clean Narrator Attribution Toggle */}
      <div className="flex items-center justify-between bg-slate-950/80 px-3.5 py-2.5 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Wand2 className="w-4 h-4 text-amber-400" />
          <span>تنظيف سند الحديث تلقائياً (إزالة "عن أبي هريرة رضي الله عنه قال")</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={autoClean}
            onChange={(e) => setAutoClean(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
        </label>
      </div>

      {/* TAB 1: PRESETS */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {DEFAULT_HADITHS.map((h) => {
            const display = autoClean ? h.cleanedText : h.rawText;
            const isSelected = currentHadithText.trim() === display.trim();

            return (
              <div
                key={h.id}
                onClick={() => handleSelectPreset(h)}
                className={`p-3.5 rounded-xl border cursor-pointer transition text-right relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500 text-amber-200 shadow-md ring-1 ring-amber-500/30'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-amber-500/40 hover:bg-slate-800/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-amber-400 font-semibold mb-1.5">
                    <span>{h.bookName} - حديث #{h.hadithNumber}</span>
                    <span className="text-[10px] text-slate-400">{h.chapterArabic}</span>
                  </div>
                  <p className="text-xs leading-relaxed line-clamp-3 font-['Cairo'] text-slate-200">
                    "{display}"
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-end text-[11px] text-amber-400/80 font-medium">
                  {isSelected ? '✓ محدد حالياً' : 'انقر للاختيار'}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: API SEARCH */}
      {activeTab === 'api' && (
        <div className="space-y-3 pt-1">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute start-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث بكلمة من الحديث (مثال: النيات، العلم، الجنة)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchApi()}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl ps-9 pe-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <select
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="sahih-bukhari">صحيح البخاري</option>
              <option value="sahih-muslim">صحيح مسلم</option>
              <option value="al-tirmidhi">جامع الترمذي</option>
              <option value="sunan-an-nasai">سنن النسائي</option>
              <option value="sunan-abi-dawud">سنن أبي داود</option>
              <option value="sunan-ibn-majah">سنن ابن ماجه</option>
            </select>

            <button
              onClick={handleSearchApi}
              disabled={isLoadingApi}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
            >
              {isLoadingApi ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>جلب الأحاديث</span>
            </button>
          </div>

          {apiError && (
            <p className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl">
              {apiError}
            </p>
          )}

          {apiHadiths.length > 0 && (
            <div className="max-h-60 overflow-y-auto space-y-2 pe-1">
              {apiHadiths.map((item) => {
                const textToUse = autoClean ? item.cleanedText : item.rawText;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setCustomText(textToUse);
                      onApplyHadithText(textToUse, autoClean);
                    }}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-right hover:border-amber-500 cursor-pointer transition"
                  >
                    <div className="text-[11px] text-amber-400 font-bold mb-1">
                      {item.bookName} {item.hadithNumber && `#${item.hadithNumber}`}
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-['Cairo']">
                      "{textToUse}"
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CUSTOM PASTE */}
      {activeTab === 'custom' && (
        <div className="space-y-3 pt-1">
          <div className="relative">
            <textarea
              rows={4}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="قم بلصق الحديث الشريف هنا..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-['Cairo'] leading-relaxed resize-none"
            />
            <button
              onClick={handleCleanTextClick}
              className="absolute end-2 bottom-3 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-[11px] border border-slate-700 flex items-center gap-1 transition"
              title="إزالة صيغ الإسناد والعنعنة تلقائياً"
            >
              <Wand2 className="w-3 h-3" />
              <span>تنظيف السند</span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-400">
              * تنبيه: عند تأكيد النص الجديد يتم إعادة ضبط الأجزاء والتوقيتات فوراً للبداية 0.00s.
            </span>

            <button
              onClick={handleConfirmCustomText}
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>تأكيد واستخدام النص</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
