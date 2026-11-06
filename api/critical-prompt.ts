/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';
import { SYSTEM_INSTRUCTION_ECOBOT, generateCriticalPrompts } from '../src/utils/ecoBotEngine';

export const config = {
  maxDuration: 30,
};

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { topic } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      res.status(200).json({ questions: generateCriticalPrompts(topic) });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });

    const prompt = `ในฐานะครูผู้สอนวิชาภูมิศาสตร์สิ่งแวดล้อม ช่วยสร้าง "ชุดคำถามชวนคิดวิพากษ์ (Critical Thinking Prompts)" จำนวน 3 ข้อ สำหรับหัวข้อ: "${topic || 'มลพิษทางอากาศและฝุ่น PM2.5'}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_ECOBOT,
      },
    });

    res.status(200).json({ questions: response.text || generateCriticalPrompts(topic) });
  } catch (err: unknown) {
    const { topic } = req.body || {};
    res.status(200).json({ questions: generateCriticalPrompts(topic) });
  }
}
