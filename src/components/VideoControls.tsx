import React, { useState, useRef, useEffect } from 'react';
import { Palette, Type, Layout, ImageIcon, Eye, Check, Move, Target, RotateCcw, Sparkles, Sliders, ZoomIn, Moon, Star } from 'lucide-react';
import { BackgroundTheme, TextCustomization, VerticalPosition, HorizontalPosition, BrandingConfig } from '../types';
import { BACKGROUND_THEMES, BRANDING } from '../data/themes';

interface VideoControlsProps {
  selectedTheme: BackgroundTheme;
  onSelectTheme: (theme: BackgroundTheme) => void;
  textConfig: TextCustomization;
  onChangeTextConfig: (newConfig: TextCustomization) => void;
  branding?: BrandingConfig;
  onChangeBranding?: (newBranding: BrandingConfig) => void;
}

export const VideoControls: React.FC<VideoControlsProps> = ({
  selectedTheme,
  onSelectTheme,
  textConfig,
  onChangeTextConfig,
  branding,
  onChangeBranding,
}) => {
  const touchpadRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const wmTouchpadRef = useRef<HTMLDivElement | null>(null);
  const [isWmDragging, setIsWmDragging] = useState(false);

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result && onChangeBranding) {
          onChangeBranding({
            handle: branding?.handle || BRANDING.handle,
            logoUrl: ev.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Safe fallbacks for textPos and watermarkPos
  const currentPos = textConfig.textPos || { x: 50, y: 50 };
  const currentWmPos = textConfig.watermarkPos || { x: 82, y: 8 };

  const updateConfig = (key: keyof TextCustomization, value: any) => {
    onChangeTextConfig({
      ...textConfig,
      [key]: value,
    });
  };

  const updatePos = (x: number, y: number) => {
    const clampedX = Math.min(100, Math.max(0, Math.round(x)));
    const clampedY = Math.min(100, Math.max(0, Math.round(y)));
    onChangeTextConfig({
      ...textConfig,
      textPos: { x: clampedX, y: clampedY },
    });
  };

  const updateWmPos = (x: number, y: number) => {
    const clampedX = Math.min(100, Math.max(0, Math.round(x)));
    const clampedY = Math.min(100, Math.max(0, Math.round(y)));
    onChangeTextConfig({
      ...textConfig,
      watermarkPos: { x: clampedX, y: clampedY },
    });
  };

  // Watermark Touchpad Position Handler
  const handleWmTouchpadMove = (clientX: number, clientY: number) => {
    if (!wmTouchpadRef.current) return;
    const rect = wmTouchpadRef.current.getBoundingClientRect();
    const rawX = ((clientX - rect.left) / rect.width) * 100;
    const rawY = ((clientY - rect.top) / rect.height) * 100;
    updateWmPos(rawX, rawY);
  };

  const handleWmMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsWmDragging(true);
    handleWmTouchpadMove(e.clientX, e.clientY);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isWmDragging) {
        handleWmTouchpadMove(e.clientX, e.clientY);
      }
    };
    const handleMouseUp = () => {
      if (isWmDragging) {
        setIsWmDragging(false);
      }
    };

    if (isWmDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isWmDragging]);

  const handleWmTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      setIsWmDragging(true);
      handleWmTouchpadMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleWmTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      handleWmTouchpadMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleWmTouchEnd = () => {
    setIsWmDragging(false);
  };

  // Touchpad Mouse/Touch Position Handler
  const handleTouchpadMove = (clientX: number, clientY: number) => {
    if (!touchpadRef.current) return;
    const rect = touchpadRef.current.getBoundingClientRect();
    const rawX = ((clientX - rect.left) / rect.width) * 100;
    const rawY = ((clientY - rect.top) / rect.height) * 100;
    updatePos(rawX, rawY);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    handleTouchpadMove(e.clientX, e.clientY);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleTouchpadMove(e.clientX, e.clientY);
      }
    };
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      setIsDragging(true);
      handleTouchpadMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      handleTouchpadMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="bg-slate-900/90 border border-amber-500/20 rounded-2xl p-4 lg:p-5 shadow-xl space-y-5">
      {/* SECTION 1: 19 BACKGROUND THEMES GALLERY */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-base text-slate-100 font-['Cairo']">
              19 خلفية فاخرة (19 Premium Themes)
            </h2>
          </div>
          <span className="text-xs text-amber-300 font-medium">
            مُحدّدة: {selectedTheme.name}
          </span>
        </div>

        {/* 19 Themes Horizontal / Grid Selector */}
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-7 gap-2 max-h-48 overflow-y-auto p-1">
          {BACKGROUND_THEMES.map((theme) => {
            const isSelected = selectedTheme.id === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => onSelectTheme(theme)}
                className={`relative group aspect-[9/16] rounded-xl overflow-hidden cursor-pointer border-2 transition transform hover:scale-105 ${
                  isSelected
                    ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105 shadow-lg'
                    : 'border-slate-800 hover:border-amber-500/50'
                }`}
              >
                <img
                  src={theme.url}
                  alt={theme.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                {isSelected && (
                  <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                    <Check className="w-5 h-5 text-amber-300 drop-shadow-md stroke-[3]" />
                  </div>
                )}
                <span className="absolute bottom-1 start-1 text-[9px] text-white font-bold px-1 bg-black/60 rounded">
                  #{theme.id}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: TEXT & TYPOGRAPHY STYLING */}
      <div className="space-y-3 pt-2 border-t border-slate-800">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <Type className="w-5 h-5 text-amber-400" />
          <h2 className="font-bold text-base text-slate-100 font-['Cairo']">
            تخصيص الخط والنمط (Typography & Colors)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Font Family */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              اختر خط الزينة (Font Family)
            </label>
            <select
              value={textConfig.fontFamily}
              onChange={(e) => updateConfig('fontFamily', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-300 focus:outline-none focus:border-amber-500 font-semibold cursor-pointer"
            >
              <option value="Amiri" style={{ fontFamily: 'Amiri, serif' }}>
                أميري (Amiri) - نسخ كلاسيكي وأدبي
              </option>
              <option value="Aref Ruqaa" style={{ fontFamily: '"Aref Ruqaa", serif' }}>
                عارف رقعة (Aref Ruqaa) - خط رقعة أصيل
              </option>
              <option value="Reem Kufi" style={{ fontFamily: '"Reem Kufi", sans-serif' }}>
                ريم كوفي (Reem Kufi) - كوفي هندسي فاخر
              </option>
              <option value="Cairo" style={{ fontFamily: 'Cairo, sans-serif' }}>
                كايرو (Cairo) - عصري أنيق ومقروء
              </option>
              <option value="Tajawal" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                تجوال (Tajawal) - هندسي متوازن
              </option>
              <option value="Lalezar" style={{ fontFamily: 'Lalezar, cursive' }}>
                لاليزار (Lalezar) - عريض ومميز
              </option>
              <option value="Marhey" style={{ fontFamily: 'Marhey, cursive' }}>
                مرحي (Marhey) - زخرفي انسيابي
              </option>
              <option value="Changa" style={{ fontFamily: 'Changa, sans-serif' }}>
                تشانغا (Changa) - حديث وقوي
              </option>
            </select>
          </div>

          {/* Font Size */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                حجم الخط (Size)
              </label>
              <span className="text-xs font-mono text-amber-400">{textConfig.fontSize}px</span>
            </div>
            <input
              type="range"
              min="20"
              max="60"
              value={textConfig.fontSize}
              onChange={(e) => updateConfig('fontSize', parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Text Color */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              لون النص الأساسي
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={textConfig.textColor}
                onChange={(e) => updateConfig('textColor', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-slate-700"
              />
              <input
                type="text"
                value={textConfig.textColor}
                onChange={(e) => updateConfig('textColor', e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 font-mono"
              />
            </div>
          </div>

          {/* Highlight Color */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              لون التوهج والتأكيد الذهبي
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={textConfig.highlightColor}
                onChange={(e) => updateConfig('highlightColor', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-slate-700"
              />
              <input
                type="text"
                value={textConfig.highlightColor}
                onChange={(e) => updateConfig('highlightColor', e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 font-mono"
              />
            </div>
          </div>

          {/* Text Stroke Width (الحد الخارجي / Trait) */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                حجم الحد الخارجي للنص (Stroke / Trait)
              </label>
              <span className="text-xs font-mono text-amber-400">
                {textConfig.strokeWidth ?? 0}px
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={textConfig.strokeWidth ?? 0}
              onChange={(e) => updateConfig('strokeWidth', parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Text Stroke Color */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              لون الحد الخارجي (Stroke Color)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={textConfig.strokeColor || '#000000'}
                onChange={(e) => updateConfig('strokeColor', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-slate-700"
              />
              <input
                type="text"
                value={textConfig.strokeColor || '#000000'}
                onChange={(e) => updateConfig('strokeColor', e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: POSITIONING & VISUAL TOUCHPAD */}
      <div className="space-y-4 pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Move className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-base text-slate-100 font-['Cairo']">
              لوحة اللمس البصرية للموضع (Visual Touchpad)
            </h2>
          </div>
          <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
            X: {currentPos.x}% | Y: {currentPos.y}%
          </span>
        </div>

        {/* TOUCHPAD AND SLIDERS FLEX LAYOUT */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          
          {/* 1. VISUAL TOUCHPAD CONTAINER (130x130px) */}
          <div className="sm:col-span-5 flex flex-col items-center justify-center">
            <div
              ref={touchpadRef}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative w-[130px] h-[130px] bg-slate-950 rounded-2xl border-2 border-amber-500/40 hover:border-amber-400 transition-colors shadow-2xl cursor-crosshair overflow-hidden select-none group"
            >
              {/* Subtle Grid & Crosshairs */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-[1px] bg-slate-800/80 border-t border-dashed border-slate-700/60" />
                <div className="h-full w-[1px] bg-slate-800/80 border-s border-dashed border-slate-700/60 absolute" />
              </div>

              {/* 9:16 Aspect Inner Guide Box */}
              <div className="absolute inset-3 rounded-lg border border-slate-800/60 pointer-events-none flex items-center justify-center">
                <span className="text-[9px] font-mono text-slate-700/60 select-none">9:16</span>
              </div>

              {/* Position Dot Indicator */}
              <div
                className={`absolute w-4 h-4 rounded-full bg-amber-400 border-2 border-white shadow-[0_0_12px_rgba(245,158,11,0.9)] -translate-x-1/2 -translate-y-1/2 transition-transform ${
                  isDragging ? 'scale-125 bg-amber-300' : 'group-hover:scale-110'
                }`}
                style={{
                  left: `${currentPos.x}%`,
                  top: `${currentPos.y}%`,
                }}
              />
            </div>

            <span className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1 font-medium">
              <Target className="w-3 h-3 text-amber-400" />
              انقر أو اسحب النقطة للتحكم في الموضع
            </span>
          </div>

          {/* 2. FINE TUNING SLIDERS & PRESETS */}
          <div className="sm:col-span-7 space-y-3">
            {/* Slider X */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  الأفقي (X Axis)
                </label>
                <span className="text-xs font-mono text-amber-400">{currentPos.x}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={currentPos.x}
                onChange={(e) => updatePos(parseInt(e.target.value), currentPos.y)}
                className="w-full accent-amber-500 cursor-pointer h-1.5 rounded bg-slate-950 border border-slate-800"
              />
            </div>

            {/* Slider Y */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  الرأسي (Y Axis)
                </label>
                <span className="text-xs font-mono text-amber-400">{currentPos.y}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={currentPos.y}
                onChange={(e) => updatePos(currentPos.x, parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-1.5 rounded bg-slate-950 border border-slate-800"
              />
            </div>

            {/* Reset Button */}
            <button
              onClick={() => updatePos(50, 50)}
              className="w-full py-1.5 px-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 rounded-xl text-xs text-slate-300 hover:text-amber-300 transition flex items-center justify-center gap-1.5 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>إعادة للتمركز (Center 50%, 50%)</span>
            </button>
          </div>

        </div>

        {/* Quick Position Alignment Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Vertical Alignment */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              محاذاة رأسية سريعة
            </label>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              {(['top', 'middle', 'bottom'] as VerticalPosition[]).map((pos) => {
                const labels = { top: 'أعلى', middle: 'وسط', bottom: 'أسفل' };
                const targetY = pos === 'top' ? 25 : pos === 'bottom' ? 75 : 50;
                return (
                  <button
                    key={pos}
                    onClick={() => {
                      updateConfig('verticalPosition', pos);
                      updatePos(currentPos.x, targetY);
                    }}
                    className={`flex-1 py-1.5 rounded-lg transition font-semibold ${
                      textConfig.verticalPosition === pos
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {labels[pos]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Horizontal Alignment */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              محاذاة أفقية سريعة
            </label>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              {(['right', 'center', 'left'] as HorizontalPosition[]).map((pos) => {
                const labels = { right: 'يمين', center: 'وسط', left: 'يسار' };
                const targetX = pos === 'left' ? 25 : pos === 'right' ? 75 : 50;
                return (
                  <button
                    key={pos}
                    onClick={() => {
                      updateConfig('horizontalPosition', pos);
                      updatePos(targetX, currentPos.y);
                    }}
                    className={`flex-1 py-1.5 rounded-lg transition font-semibold ${
                      textConfig.horizontalPosition === pos
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {labels[pos]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card Background Toggle */}
        <div className="pt-1">
          <div className="flex items-center justify-between bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-300 font-semibold">خلفية بطاقة النص الشفافة</span>
            <input
              type="checkbox"
              checked={textConfig.showCardBackground}
              onChange={(e) => updateConfig('showCardBackground', e.target.checked)}
              className="accent-amber-500 w-4 h-4 cursor-pointer"
            />
          </div>
        </div>

        {/* WATERMARK CONTROLS & VISUAL TOUCHPAD */}
        <div className="space-y-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-slate-200 font-['Cairo']">
                شعار وعلامة القناة المائية ({branding?.handle || BRANDING.handle})
              </span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-300 font-medium">إظهار العلامة</span>
              <input
                type="checkbox"
                checked={textConfig.showWatermark}
                onChange={(e) => updateConfig('showWatermark', e.target.checked)}
                className="accent-amber-500 w-4 h-4 cursor-pointer"
              />
            </label>
          </div>

          {/* TEMPORARY BRANDING CUSTOMIZATION UI */}
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">هوية القناة (Channel Branding)</span>
              <button
                type="button"
                onClick={() => onChangeBranding?.({ handle: BRANDING.handle, logoUrl: BRANDING.logoUrl })}
                className="text-[11px] text-amber-400 hover:text-amber-300 underline font-medium flex items-center gap-1 transition"
                title="إعادة الهوية الافتراضية إلى @TraceBonne"
              >
                <RotateCcw className="w-3 h-3" />
                <span>إعادة ضبط الهوية الافتراضية</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Channel Handle Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 block">اسم / معرف القناة (Channel Handle):</label>
                <input
                  type="text"
                  value={branding?.handle || BRANDING.handle}
                  onChange={(e) =>
                    onChangeBranding?.({
                      handle: e.target.value,
                      logoUrl: branding?.logoUrl || BRANDING.logoUrl,
                    })
                  }
                  placeholder="@TraceBonne"
                  dir="ltr"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-amber-400 font-mono font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Upload Logo / Logo Preview */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 block">شعار القناة (Upload Logo):</label>
                <div className="flex items-center gap-2">
                  <img
                    src={branding?.logoUrl || BRANDING.logoUrl}
                    alt="Channel Logo Preview"
                    className="w-8 h-8 rounded-full object-cover border border-amber-400 shrink-0"
                  />
                  <label className="flex-1 cursor-pointer bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 rounded-xl px-3 py-1.5 text-xs text-slate-300 text-center font-medium transition flex items-center justify-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>تغيير الشعار</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Required Prompt Note */}
            <p className="text-[11px] text-amber-400/90 font-medium flex items-center gap-1.5 pt-1.5 border-t border-slate-900">
              <span>ملاحظة: سيتم إعادة تعيين الهوية إلى @TraceBonne عند تحديث الصفحة.</span>
            </p>
          </div>

          {textConfig.showWatermark && (
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/90 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-300">
                  لوحة التموضع للعلامة المائية (Watermark Touchpad)
                </span>
                <button
                  onClick={() => updateWmPos(82, 8)}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/40 rounded-lg text-[11px] text-amber-300 hover:text-amber-200 transition flex items-center gap-1 font-medium"
                  title="إعادة ضبط الموضع إلى الأعلى واليمين"
                >
                  <RotateCcw className="w-3 h-3 text-amber-400" />
                  <span>إعادة ضبط الموضع (Reset)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                {/* 120x120px TOUCHPAD BOX */}
                <div className="sm:col-span-5 flex flex-col items-center justify-center">
                  <div
                    ref={wmTouchpadRef}
                    onMouseDown={handleWmMouseDown}
                    onTouchStart={handleWmTouchStart}
                    onTouchMove={handleWmTouchMove}
                    onTouchEnd={handleWmTouchEnd}
                    className="relative w-[120px] h-[120px] bg-slate-900 rounded-xl border-2 border-amber-500/40 hover:border-amber-400 transition-colors shadow-xl cursor-crosshair overflow-hidden select-none group"
                  >
                    {/* Grid Crosshairs */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-full h-[1px] bg-slate-800/80 border-t border-dashed border-slate-700/60" />
                      <div className="h-full w-[1px] bg-slate-800/80 border-s border-dashed border-slate-700/60 absolute" />
                    </div>

                    {/* Dot Indicator */}
                    <div
                      className={`absolute w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white shadow-[0_0_10px_rgba(245,158,11,0.9)] -translate-x-1/2 -translate-y-1/2 transition-transform ${
                        isWmDragging ? 'scale-125 bg-amber-300' : 'group-hover:scale-110'
                      }`}
                      style={{
                        left: `${currentWmPos.x}%`,
                        top: `${currentWmPos.y}%`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 font-mono">
                    X: {currentWmPos.x}% | Y: {currentWmPos.y}%
                  </span>
                </div>

                {/* X and Y Sliders */}
                <div className="sm:col-span-7 space-y-2">
                  <div>
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[11px] text-slate-300 font-medium">أفقي (X):</span>
                      <span className="text-[11px] font-mono text-amber-400">{currentWmPos.x}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={currentWmPos.x}
                      onChange={(e) => updateWmPos(parseInt(e.target.value), currentWmPos.y)}
                      className="w-full accent-amber-500 cursor-pointer h-1.5 rounded bg-slate-900"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[11px] text-slate-300 font-medium">رأسي (Y):</span>
                      <span className="text-[11px] font-mono text-amber-400">{currentWmPos.y}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={currentWmPos.y}
                      onChange={(e) => updateWmPos(currentWmPos.x, parseInt(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer h-1.5 rounded bg-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 4: VISUAL EFFECTS & BACKGROUND FILTERS */}
      <div className="space-y-4 pt-2 border-t border-slate-800">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="font-bold text-base text-slate-100 font-['Cairo']">
            تأثيرات الخلفية البصرية (Visual Effects & Filters)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 1. Stars Toggle */}
          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              <span className="text-slate-200 font-semibold">إظهار النجوم المتحركة</span>
            </div>
            <input
              type="checkbox"
              checked={textConfig.showStars ?? true}
              onChange={(e) => updateConfig('showStars', e.target.checked)}
              className="accent-amber-500 w-4 h-4 cursor-pointer"
            />
          </div>

          {/* 4. Cinematic Zoom Toggle */}
          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <ZoomIn className="w-4 h-4 text-amber-400" />
              <span className="text-slate-200 font-semibold">تفعيل الزوم السينمائي</span>
            </div>
            <input
              type="checkbox"
              checked={textConfig.cinematicZoom ?? true}
              onChange={(e) => updateConfig('cinematicZoom', e.target.checked)}
              className="accent-amber-500 w-4 h-4 cursor-pointer"
            />
          </div>

          {/* 2. Background Blur Slider */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-200 font-semibold">تمويه الخلفية (Blur)</span>
              </div>
              <span className="font-mono text-amber-400">{textConfig.bgBlur ?? 0}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={textConfig.bgBlur ?? 0}
              onChange={(e) => updateConfig('bgBlur', parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 rounded bg-slate-900"
            />
          </div>

          {/* 3. Background Darkness Slider */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-200 font-semibold">درجة التعتيم</span>
              </div>
              <span className="font-mono text-amber-400">
                {Math.round((textConfig.bgOverlayDarkness ?? 0.3) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="0.9"
              step="0.05"
              value={textConfig.bgOverlayDarkness ?? 0.3}
              onChange={(e) => updateConfig('bgOverlayDarkness', parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 rounded bg-slate-900"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
