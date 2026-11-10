/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';
import { SYSTEM_INSTRUCTION_ECOBOT, generateSmartPedagogicalReply, generateCriticalPrompts } from '../utils/ecoBotEngine';

export interface ChatRequestOptions {
  message: string;
  history?: Array<{ role: 'user' | 'model'; content: string }>;
  mode?: 'inquiry' | 'case_study' | 'general' | 'evaluate';
  caseStudyContext?: {
    title?: string;
    period?: string;
    location?: string;
    summary?: string;
    geography?: string;
  } | null;
}

/**
 * Send chat message to Eco bot.
 * Gracefully tries `/api/chat` first (works with Express or Vercel serverless functions).
 * If unavailable (e.g. static Vite hosting on Vercel without backend, 404, or network error),
 * it seamlessly uses direct Gemini client (if VITE_GEMINI_API_KEY or stored key exists)
 * or the pedagogical reasoning engine.
 */
export async function sendEcoBotMessage(options: ChatRequestOptions): Promise<string> {
  const { message, mode = 'inquiry', caseStudyContext } = options;

  // 1. First attempt: call /api/chat backend endpoint
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // If endpoint exists and answered properly with JSON
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data && data.reply) {
        return data.reply;
      }
    }
  } catch (apiErr) {
    console.warn('API /api/chat unreachable or timed out, switching to client fallback:', apiErr);
  }

  // 2. Client-side Gemini fallback if user provided client key (via Vercel env or localStorage)
  const clientKey =
    (typeof window !== 'undefined' ? localStorage.getItem('ECO_GEMINI_API_KEY') : null) ||
    (import.meta.env.VITE_GEMINI_API_KEY as string | undefined);

  if (clientKey && clientKey.trim() && clientKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({
        apiKey: clientKey,
      });

      let systemPrompt = SYSTEM_INSTRUCTION_ECOBOT;
      if (mode === 'inquiry') {
        systemPrompt += '\n\n[โหมดการคิดวิพากษ์ระดับลึก (Inquiry Coach Mode)]: ชวนคิด 3 ระดับ: สาเหตุรากเหง้า, ความยุติธรรมสิ่งแวดล้อม, และทางเลือกนโยบาย';
      } else if (mode === 'case_study' && caseStudyContext) {
        systemPrompt += `\n\n[โหมดวิเคราะห์กรณีศึกษา]: ${caseStudyContext.title} (${caseStudyContext.period}, ${caseStudyContext.location}). ปัจจัยภูมิศาสตร์: ${caseStudyContext.geography}`;
      } else if (mode === 'evaluate') {
        systemPrompt += '\n\n[โหมดตรวจประเมิน]: ตรวจประเมินข้อสมมติฐานของนักเรียนใน 3 มิติ: กายภาพ, โครงสร้าง, และข้อเสนอแนะ';
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: message,
        config: {
          systemInstruction: systemPrompt,
        },
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (clientGeminiErr) {
      console.warn('Client-side Gemini call failed, falling back to pedagogical engine:', clientGeminiErr);
    }
  }

  // 3. Built-in intelligent pedagogical engine (Guaranteed response, works offline and without server)
  return generateSmartPedagogicalReply(message, mode, caseStudyContext);
}

/**
 * Generate critical thinking prompts for a topic
 */
export async function getCriticalThinkingPrompts(topic: string): Promise<string> {
  try {
    const res = await fetch('/api/critical-prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
    });

    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data && data.questions) {
        return data.questions;
      }
    }
  } catch (err) {
    console.warn('API /api/critical-prompt unavailable, using local generator:', err);
  }

  return generateCriticalPrompts(topic);
}
