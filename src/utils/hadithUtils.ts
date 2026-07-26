import { HadithItem, HadithSegment } from '../types';

/**
 * Clean text from narrator attributions (Regex for "عن ... رضي الله عنه")
 */
export function cleanNarratorAttributions(text: string): string {
  if (!text) return '';

  let cleaned = text;

  // Pattern matching Arabic narrator introductions:
  // e.g., "عَنْ أَمِيرِ الْمُؤْمِنِينَ أَبِي حَفْصٍ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُ قَالَ:"
  // e.g., "عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم:"
  // e.g., "عن ابن عمر رضي الله عنهما أن رسول الله..."

  // 1. Match "عن/عَنْ" followed by any narrator names up to "رضي الله عنه/عنها/عنهما/عنهم" + optional "قال/قالت/سمعت/عن" + ":"
  cleaned = cleaned.replace(
    /^(?:عَنْ|عن)\s+[\s\S]*?(?:رَضِيَ|رضي)\s+(?:اللَّهُ|الله)\s+(?:عَنْهُ|عنه|عَنْهَا|عنها|عَنْهُمَا|عنهما|عَنْهُمْ|عنهم)(?:[\s\S]*?(?:قَالَ|قال|قَالَتْ|قالت|سَمِعْتُ|سمعت))?\s*:\s*/gi,
    ''
  );

  // 2. Remove remaining inline "عن فلان رضي الله عنه قال:"
  cleaned = cleaned.replace(
    /(?:عَنْ|عن)\s+[\s\S]{3,50}?(?:رَضِيَ|رضي)\s+(?:اللَّهُ|الله)\s+(?:عَنْهُ|عنه|عَنْهَا|عنها|عَنْهُمَا|عنهما|عَنْهُمْ|عنهم)(?:\s+(?:قَالَ|قال|قَالَتْ|قالت))?\s*:\s*/gi,
    ''
  );

  // 3. Remove "قال رسول الله صلى الله عليه وسلم:" prefix if at the beginning of the text
  cleaned = cleaned.replace(
    /^(?:فَقَالَ|قَالَ|عَنِ|عن)?\s*(?:النَّبِيُّ|النبي|رَسُولُ|رسول)\s*(?:اللَّهِ|الله)\s*(?:صَلَّى|صلى)\s*(?:اللَّهُ|الله)\s*(?:عَلَيْهِ|عليه)\s*(?:وَسَلَّمَ|وسلم)\s*:\s*/gi,
    ''
  );

  // Clean trailing or leading spaces and quotes
  cleaned = cleaned.trim().replace(/^["'«»“]/, '').replace(/["'«»”]$/, '');

  return cleaned;
}

/**
 * Split Hadith text into logical segments (by punctuation or max 12 words)
 */
export function splitTextIntoSegments(text: string, duration: number = 0): HadithSegment[] {
  if (!text || !text.trim()) return [];

  const cleaned = text.trim();
  
  // Split by major punctuation first: . ! ؟ ؛ \n
  const rawParts = cleaned.split(/(?<=[.!\n؟؛،,])\s+/);
  const finalSentences: string[] = [];

  for (const rawPart of rawParts) {
    const trimmed = rawPart.trim();
    if (!trimmed) continue;

    // If a sentence is very long (> 12 words), split it further into chunks of ~8-10 words
    const words = trimmed.split(/\s+/);
    if (words.length > 12) {
      let currentChunk: string[] = [];
      for (const word of words) {
        currentChunk.push(word);
        if (currentChunk.length >= 8) {
          finalSentences.push(currentChunk.join(' '));
          currentChunk = [];
        }
      }
      if (currentChunk.length > 0) {
        finalSentences.push(currentChunk.join(' '));
      }
    } else {
      finalSentences.push(trimmed);
    }
  }

  if (finalSentences.length === 0) {
    finalSentences.push(cleaned);
  }

  const count = finalSentences.length;
  const approxDurationPerSegment = duration > 0 ? duration / count : 4.0;

  return finalSentences.map((sentence, idx) => {
    const startTime = idx === 0 ? 0 : Number((idx * approxDurationPerSegment).toFixed(2));
    const endTime = Number(((idx + 1) * approxDurationPerSegment).toFixed(2));
    return {
      id: `seg_${idx}_${Date.now()}`,
      text: sentence,
      startTime,
      endTime,
    };
  });
}

/**
 * Fetch Hadiths from Hadith API using provided key or search queries
 */
export async function fetchHadithsFromApi(query?: string, book: string = 'sahih-bukhari'): Promise<HadithItem[]> {
  const API_KEY = '$2y$10$KvSWqzS2rHvvqTkI80ux0r2Najh0zDkdNwAfZdG4vKN4s69A8K';
  
  try {
    let url = `https://www.hadithapi.com/api/hadiths?apiKey=${encodeURIComponent(API_KEY)}&limit=10`;
    if (query && query.trim()) {
      url += `&hadithArabic=${encodeURIComponent(query)}`;
    } else if (book) {
      url += `&book=${encodeURIComponent(book)}`;
    }

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`API response status: ${res.status}`);
    }

    const data = await res.json();
    if (data && data.hadiths && Array.isArray(data.hadiths.data)) {
      return data.hadiths.data.map((h: any, idx: number) => {
        const raw = h.hadithArabic || h.hadithEnglish || '';
        return {
          id: String(h.id || idx),
          bookName: h.book?.bookName || h.bookSlug || 'حديث شريف',
          hadithNumber: String(h.hadithNumber || idx + 1),
          chapterArabic: h.chapter?.chapterArabic || 'باب الفضل والموعظة',
          narrator: h.englishNarrator || 'حديث شريف',
          rawText: raw,
          cleanedText: cleanNarratorAttributions(raw),
        };
      });
    }
  } catch (err) {
    console.warn('Hadith API fetch failed, fallback mode available:', err);
  }

  return [];
}

/**
 * Generate speech audio using Browser Web Speech API or AudioSynthesizer
 */
export function generateArabicSpeechAudio(text: string): Promise<{ blob: Blob; url: string; duration: number }> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech Synthesis is not supported in this browser'));
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85; // Natural measured pace for Quran/Hadith
    utterance.pitch = 1.0;

    // Estimate duration: ~3 words per second for ar-SA at 0.85 speed
    const wordCount = text.trim().split(/\s+/).length;
    const estimatedDuration = Math.max(3, Number((wordCount / 2.5).toFixed(1)));

    // Create a synthesized audio tone buffer for playback sync
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = 44100;
    const numSamples = Math.ceil(sampleRate * estimatedDuration);
    const buffer = audioCtx.createBuffer(1, numSamples, sampleRate);
    const data = buffer.getChannelData(0);

    // Fill buffer with a very quiet, warm ambient tone so MediaRecorder has continuous audio
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      // Gentle sine harmonics (A2 + E3)
      data[i] = (Math.sin(2 * Math.PI * 110 * t) * 0.05 + Math.sin(2 * Math.PI * 164.81 * t) * 0.03) * Math.exp(-t * 0.1);
    }

    // Convert AudioBuffer to WAV Blob
    const wavBlob = audioBufferToWav(buffer);
    const url = URL.createObjectURL(wavBlob);

    // Speak aloud for live user feedback
    window.speechSynthesis.speak(utterance);

    resolve({
      blob: wavBlob,
      url,
      duration: estimatedDuration,
    });
  });
}

/**
 * Generate Outro Ambient Audio Buffer (Serene Islamic Bell/Chime + Voice Echo Tone)
 */
export function createOutroAudioBlob(duration: number = 8): Blob {
  const sampleRate = 44100;
  const numSamples = Math.ceil(sampleRate * duration);
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const buffer = audioCtx.createBuffer(2, numSamples, sampleRate);

  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  // Harmonics for a meditative, soothing soundscape (D major chord D3, A3, F#4)
  const freqs = [146.83, 220.00, 369.99, 440.00];

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;

    // Fade in over 1s, fade out over last 2s
    let env = 1;
    if (t < 1.0) env = t;
    else if (t > duration - 2.0) env = (duration - t) / 2.0;

    freqs.forEach((freq, idx) => {
      const amp = 0.08 / (idx + 1);
      sample += Math.sin(2 * Math.PI * freq * t) * amp * env;
    });

    left[i] = sample;
    right[i] = sample * 0.95; // Slight spatial width
  }

  return audioBufferToWav(buffer);
}

/**
 * Helper to convert AudioBuffer into WAV Blob format
 */
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  
  let result: Uint8Array;
  if (numChannels === 2) {
    result = interleave(buffer.getChannelData(0), buffer.getChannelData(1));
  } else {
    result = floatTo16BitPCM(buffer.getChannelData(0));
  }

  const dataLength = result.length;
  const bufferHeader = new ArrayBuffer(44 + dataLength);
  const view = new DataView(bufferHeader);

  /* RIFF identifier */
  writeString(view, 0, 'RIFF');
  /* RIFF chunk length */
  view.setUint32(4, 36 + dataLength, true);
  /* RIFF type */
  writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, format, true);
  /* channel count */
  view.setUint16(22, numChannels, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, numChannels * (bitDepth / 8), true);
  /* bits per sample */
  view.setUint16(34, bitDepth, true);
  /* data chunk identifier */
  writeString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, dataLength, true);

  // Write PCM samples
  const pcmView = new Uint8Array(bufferHeader, 44);
  pcmView.set(result);

  return new Blob([bufferHeader], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function interleave(inputL: Float32Array, inputR: Float32Array): Uint8Array {
  const length = inputL.length + inputR.length;
  const result = new Int16Array(length);
  let index = 0;
  let inputIndex = 0;

  while (index < length) {
    let sL = Math.max(-1, Math.min(1, inputL[inputIndex]));
    let sR = Math.max(-1, Math.min(1, inputR[inputIndex]));
    result[index++] = sL < 0 ? sL * 0x8000 : sL * 0x7fff;
    result[index++] = sR < 0 ? sR * 0x8000 : sR * 0x7fff;
    inputIndex++;
  }

  return new Uint8Array(result.buffer);
}

function floatTo16BitPCM(input: Float32Array): Uint8Array {
  const output = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return new Uint8Array(output.buffer);
}
