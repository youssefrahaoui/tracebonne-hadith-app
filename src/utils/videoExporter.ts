import { BackgroundTheme, HadithSegment, TextCustomization } from '../types';
import { BRANDING } from '../data/themes';
import { createOutroAudioBlob } from './hadithUtils';

interface ExportParams {
  theme: BackgroundTheme;
  segments: HadithSegment[];
  mainAudioBlob: Blob | null;
  mainAudioDuration: number;
  outroAudioBlob?: Blob | null;
  outroDuration?: number;
  textConfig: TextCustomization;
  onProgress: (progress: number, status: string) => void;
}

export async function exportVideoMP4({
  theme,
  segments,
  mainAudioBlob,
  mainAudioDuration,
  outroAudioBlob,
  outroDuration,
  textConfig,
  onProgress,
}: ExportParams): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    try {
      onProgress(5, 'جاري تحضير القالب والصوتيات...');

      const width = 1080;
      const height = 1920;
      const fps = 30;

      // Create offscreen canvas for rendering
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas 2D context creation failed');
      }

      // Preload Background Image
      const bgImg = new Image();
      bgImg.crossOrigin = 'anonymous';
      await new Promise<void>((res) => {
        bgImg.onload = () => res();
        bgImg.onerror = () => res(); // fallback gracefully
        bgImg.src = theme.url;
      });

      // Preload Logo Image
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      await new Promise<void>((res) => {
        logoImg.onload = () => res();
        logoImg.onerror = () => res();
        logoImg.src = BRANDING.logoUrl;
      });

      onProgress(15, 'جاري إعداد محرك الصوت المدمج...');

      // Prepare Audio Pipeline
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const dest = audioCtx.createMediaStreamDestination();

      const finalOutroDuration = outroDuration || BRANDING.outroDuration;
      const totalVideoDuration = Math.max(5, mainAudioDuration + finalOutroDuration);

      // Load main audio source if available
      let mainAudioBuffer: AudioBuffer | null = null;
      if (mainAudioBlob) {
        const arrayBuf = await mainAudioBlob.arrayBuffer();
        mainAudioBuffer = await audioCtx.decodeAudioData(arrayBuf);
        const source = audioCtx.createBufferSource();
        source.buffer = mainAudioBuffer;
        source.connect(dest);
        source.start(0);
      }

      // Load/Generate outro audio source
      let outroArrayBuf: ArrayBuffer;
      if (outroAudioBlob) {
        outroArrayBuf = await outroAudioBlob.arrayBuffer();
      } else {
        const outroBlob = createOutroAudioBlob(finalOutroDuration);
        outroArrayBuf = await outroBlob.arrayBuffer();
      }
      const outroAudioBuffer = await audioCtx.decodeAudioData(outroArrayBuf);
      const outroSource = audioCtx.createBufferSource();
      outroSource.buffer = outroAudioBuffer;
      outroSource.connect(dest);
      outroSource.start(mainAudioDuration);

      // Create Canvas Stream and combine with Audio Stream
      const canvasStream = canvas.captureStream(fps);
      const combinedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...dest.stream.getAudioTracks(),
      ]);

      // Determine supported mimeType
      let mimeType = 'video/mp4;codecs=h264';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp9,opus';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/webm';
        }
      }

      const recorder = new MediaRecorder(combinedStream, {
        mimeType,
        videoBitsPerSecond: 6000000, // 6 Mbps for sharp 1080p
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const finalBlob = new Blob(chunks, { type: mimeType });
        onProgress(100, 'تم التصدير بنجاح!');
        resolve(finalBlob);
      };

      recorder.start();

      let currentFrame = 0;
      const totalFrames = Math.ceil(totalVideoDuration * fps);

      onProgress(25, 'جاري معالجة وإخراج الفيديو...');

      function renderFrame() {
        if (currentFrame >= totalFrames) {
          recorder.stop();
          return;
        }

        const currentTime = currentFrame / fps;
        const progressPct = Math.min(95, Math.floor(25 + (currentFrame / totalFrames) * 70));
        onProgress(progressPct, `جاري كتابة الإطارات: ${Math.floor(currentTime)}s / ${Math.floor(totalVideoDuration)}s`);

        // Clear canvas
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, width, height);

        // 1. Draw Background with Cinematic Zoom & Blur Effect
        if (bgImg.complete && bgImg.naturalWidth > 0) {
          ctx.save();
          if (textConfig.bgBlur && textConfig.bgBlur > 0) {
            ctx.filter = `blur(${textConfig.bgBlur * 2.5}px)`;
          }

          // Zoom calculation
          const isZoomActive = textConfig.cinematicZoom ?? true;
          const scale = isZoomActive
            ? 1.0 + Math.sin((currentTime / 20) * Math.PI * 2) * 0.075 + 0.075
            : 1.05;

          // Object-fit: Cover calculation for any source image dimensions onto target (width x height) canvas
          const imgW = bgImg.naturalWidth;
          const imgH = bgImg.naturalHeight;
          const canvasRatio = width / height; // 1080 / 1920 = 0.5625
          const imgRatio = imgW / imgH;

          let sw: number;
          let sh: number;

          if (imgRatio > canvasRatio) {
            // Source is wider than canvas 9:16 ratio -> crop horizontal sides
            sh = imgH / scale;
            sw = sh * canvasRatio;
          } else {
            // Source is taller or equal -> crop vertical sides
            sw = imgW / scale;
            sh = sw / canvasRatio;
          }

          const sx = (imgW - sw) / 2;
          const sy = (imgH - sh) / 2;

          ctx.drawImage(bgImg, sx, sy, sw, sh, 0, 0, width, height);
          ctx.restore();
        }

        // 2. Overlay Background Darkness Filter
        if (textConfig.bgOverlayDarkness && textConfig.bgOverlayDarkness > 0) {
          ctx.save();
          ctx.fillStyle = `rgba(0, 0, 0, ${textConfig.bgOverlayDarkness})`;
          ctx.fillRect(0, 0, width, height);
          ctx.restore();
        }

        // 3. Central Dark Radial Vignette & Golden Glow Overlay
        const gradient = ctx.createRadialGradient(width / 2, height / 2, 100, width / 2, height / 2, height * 0.7);
        gradient.addColorStop(0, 'rgba(15, 23, 42, 0.15)');
        gradient.addColorStop(0.7, 'rgba(15, 23, 42, 0.55)');
        gradient.addColorStop(1, 'rgba(15, 23, 42, 0.9)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Central Golden Light Glow
        const goldGlow = ctx.createRadialGradient(width / 2, height / 2, 5, width / 2, height / 2, 450);
        goldGlow.addColorStop(0, 'rgba(234, 179, 8, 0.15)');
        goldGlow.addColorStop(0.5, 'rgba(234, 179, 8, 0.04)');
        goldGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = goldGlow;
        ctx.fillRect(0, 0, width, height);

        // 4. Render Particle Stars Effect
        if (textConfig.showStars ?? true) {
          ctx.save();
          for (let i = 0; i < 50; i++) {
            const x = (((Math.sin(i * 123.45) * 10000) % 1 + 1) % 1) * width;
            const initialY = (((Math.cos(i * 678.9) * 10000) % 1 + 1) % 1) * height;
            const size = 2 + (i % 4); // 2px - 5px
            const period = 2.5 + (i % 3);
            const floatY = Math.sin(((currentTime + i) / period) * Math.PI * 2) * 12;
            const starY = (initialY + floatY + height) % height;
            const alpha = 0.2 + 0.6 * (0.5 + 0.5 * Math.sin(((currentTime * 2 + i) / period)));

            ctx.save();
            ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
            ctx.shadowBlur = 6;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(2)})`;
            ctx.beginPath();
            ctx.arc(x, starY, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
          ctx.restore();
        }

        // 3. Check if in Main Hadith View or Outro View
        const isOutro = currentTime >= mainAudioDuration;

        if (!isOutro) {
          // --- MAIN HADITH VIEW ---

          // Draw Watermark if enabled
          if (textConfig.showWatermark && logoImg.complete && logoImg.naturalWidth > 0) {
            ctx.save();

            const wmPos = textConfig.watermarkPos || { x: 82, y: 8 };
            const centerX = (wmPos.x / 100) * width;
            const centerY = (wmPos.y / 100) * height;

            const wmSize = 64;
            const gap = 16;

            // Measure handle text
            ctx.font = 'bold 32px monospace, Cairo, sans-serif';
            ctx.direction = 'ltr';
            const handleText = BRANDING.handle;
            const textMetrics = ctx.measureText(handleText);
            const textWidth = textMetrics.width;

            const totalWidth = wmSize + gap + textWidth;
            const startX = centerX - totalWidth / 2;
            const startY = centerY - wmSize / 2;

            // 1. Draw Floating Logo with Drop Shadow
            ctx.save();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
            ctx.shadowBlur = 12;
            ctx.shadowOffsetY = 3;

            ctx.beginPath();
            ctx.arc(startX + wmSize / 2, startY + wmSize / 2, wmSize / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(logoImg, startX, startY, wmSize, wmSize);
            ctx.restore();

            // 2. Draw Handle Text with Strong Drop Shadow
            ctx.save();
            ctx.font = 'bold 32px monospace, Cairo, sans-serif';
            ctx.fillStyle = '#f59e0b'; // amber-400
            ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
            ctx.shadowBlur = 14;
            ctx.shadowOffsetY = 3;
            ctx.direction = 'ltr';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(handleText, startX + wmSize + gap, centerY);
            ctx.restore();

            ctx.restore();
          }

          // Find active sentence segment
          const activeSegment = segments.find(
            (s) => currentTime >= s.startTime && currentTime <= s.endTime
          ) || segments[0];

          if (activeSegment && activeSegment.text) {
            ctx.save();

            // Font configuration
            const fontPx = Math.round(textConfig.fontSize * 1.8); // Scaled for 1080p
            ctx.font = `700 ${fontPx}px "${textConfig.fontFamily}", "Cairo", sans-serif`;
            ctx.textAlign = 'center';
            ctx.direction = 'rtl';

            // Exact Touchpad Percentage Position (Default: x:50%, y:50%)
            const textPos = textConfig.textPos || { x: 50, y: 50 };
            const posX = Math.round((width * textPos.x) / 100);
            const posY = Math.round((height * textPos.y) / 100);

            // Wrap Text into lines
            const cardW = width - 200;
            const padX = 45;
            const padY = 35;
            const lines = wrapText(ctx, activeSegment.text, cardW - padX * 2);
            const lineHeight = fontPx * 1.4;
            const totalTextHeight = lines.length * lineHeight;
            const cardH = totalTextHeight + padY * 2;

            // Draw Card Background if enabled
            if (textConfig.showCardBackground) {
              const cardX = posX - cardW / 2;
              const cardY = posY - cardH / 2;

              ctx.save();
              ctx.fillStyle = textConfig.backgroundColor || 'rgba(15, 23, 42, 0.8)';
              ctx.strokeStyle = 'rgba(234, 179, 8, 0.35)';
              ctx.lineWidth = 3;

              roundRect(ctx, cardX, cardY, cardW, cardH, 24);
              ctx.fill();
              ctx.stroke();
              ctx.restore();
            }

            // Draw Text Lines centered around (posX, posY)
            ctx.shadowColor = textConfig.shadowColor || 'rgba(0,0,0,0.9)';
            ctx.shadowBlur = 18;

            const startTextY = posY - totalTextHeight / 2;

            // Draw Stroke/Trait outline if configured
            if (textConfig.strokeWidth && textConfig.strokeWidth > 0) {
              ctx.save();
              ctx.strokeStyle = textConfig.strokeColor || '#000000';
              ctx.lineWidth = textConfig.strokeWidth * 2; // Scaled for 1080p canvas
              ctx.lineJoin = 'round';
              ctx.lineCap = 'round';
              lines.forEach((line, lIdx) => {
                const lineY = startTextY + lIdx * lineHeight + lineHeight * 0.7;
                ctx.strokeText(line, posX, lineY);
              });
              ctx.restore();
            }

            ctx.fillStyle = textConfig.textColor || '#ffffff';
            lines.forEach((line, lIdx) => {
              const lineY = startTextY + lIdx * lineHeight + lineHeight * 0.7;
              ctx.fillText(line, posX, lineY);
            });

            ctx.restore();
          }
        } else {
          // --- OUTRO VIEW ---
          ctx.save();

          // Outro Logo
          if (logoImg.complete && logoImg.naturalWidth > 0) {
            const logoSize = 180;
            const logoX = (width - logoSize) / 2;
            const logoY = height * 0.22;

            ctx.save();
            ctx.shadowColor = 'rgba(234, 179, 8, 0.6)';
            ctx.shadowBlur = 30;

            ctx.beginPath();
            ctx.arc(width / 2, logoY + logoSize / 2, logoSize / 2 + 6, 0, Math.PI * 2);
            ctx.fillStyle = '#eab308';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(width / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
            ctx.restore();
          }

          // Handle @TraceBonne
          ctx.font = 'bold 52px Cairo, sans-serif';
          ctx.fillStyle = '#f59e0b';
          ctx.textAlign = 'center';
          ctx.direction = 'ltr';
          ctx.fillText(BRANDING.handle, width / 2, height * 0.38);

          // Outro Card Box
          const cardW = width - 180;
          const cardX = (width - cardW) / 2;
          const cardY = height * 0.44;

          ctx.font = `600 40px "${textConfig.fontFamily}", "Cairo", sans-serif`;
          ctx.direction = 'rtl';
          ctx.textAlign = 'center';

          const outroLines = wrapText(ctx, BRANDING.outroPrayer, cardW - 80);
          const lineHeight = 65;
          const cardH = outroLines.length * lineHeight + 80;

          ctx.save();
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.strokeStyle = 'rgba(234, 179, 8, 0.5)';
          ctx.lineWidth = 4;
          roundRect(ctx, cardX, cardY, cardW, cardH, 28);
          ctx.fill();
          ctx.stroke();
          ctx.restore();

          // Render Prayer Lines
          ctx.shadowColor = 'rgba(0,0,0,0.9)';
          ctx.shadowBlur = 12;
          ctx.fillStyle = '#f8fafc';

          outroLines.forEach((line, idx) => {
            ctx.fillText(line, width / 2, cardY + 70 + idx * lineHeight);
          });

          ctx.restore();
        }

        currentFrame++;
        setTimeout(renderFrame, 1000 / fps);
      }

      renderFrame();
    } catch (error) {
      console.error('Video Export Error:', error);
      reject(error);
    }
  });
}

/**
 * Helper to wrap text into canvas lines
 */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

/**
 * Helper for rounded rectangle on Canvas
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
