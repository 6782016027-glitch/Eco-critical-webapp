/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';
import { SYSTEM_INSTRUCTION_ECOBOT, generateSmartPedagogicalReply } from '../src/utils/ecoBotEngine';

export const config = {
  maxDuration: 30,
};

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
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
    const { message, history, mode, caseStudyContext } = req.body || {};

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    // Fallback if no Gemini API key configured on Vercel
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      const reply = generateSmartPedagogicalReply(message, mode, caseStudyContext);
      res.status(200).json({ reply });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });

    let contextualSystemPrompt = SYSTEM_INSTRUCTION_ECOBOT;

    if (mode === 'socratic') {
      contextualSystemPrompt += `\n\n[โหมดการคิดวิพากษ์ระดับลึก (Socratic Coach Mode)]: เน้นการตั้งคำถามเจาะลึก 3 ระดับ:
1. สาเหตุที่แท้จริง (Root Causes vs Symptoms)
2. ความเป็นธรรมทางสิ่งแวดล้อม (Environmental Justice)
3. การประเมินทางเลือกเชิงนโยบาย (Evaluating Trade-offs)`;
    } else if (mode === 'case_study' && caseStudyContext) {
      contextualSystemPrompt += `\n\n[โหมดวิเคราะห์กรณีศึกษาเฉพาะ]: ผู้เรียนกำลังศึกษาเรื่อง: ${caseStudyContext.title} (${caseStudyContext.period}, ${caseStudyContext.location})
ข้อมูลบริบท: ${caseStudyContext.summary}
ปัจจัยภูมิศาสตร์: ${caseStudyContext.geography}
ให้ตอบคำถามและวิพากษ์บทเรียนที่ได้รับ โดยเชื่อมโยงกับกรณีศึกษานี้และเปรียบเทียบกับปัญหาฝุ่นในปัจจุบัน`;
    } else if (mode === 'evaluate') {
      contextualSystemPrompt += `\n\n[โหมดตรวจประเมินการคิดวิพากษ์]: ผู้เรียนได้ส่งสมมติฐานหรือข้อเสนอแนะในการแก้ปัญหามา ให้คุณให้คะแนนและข้อเสนอแนะ 3 มิติ:
1. ความเข้าใจปัจจัยทางภูมิศาสตร์และวิทยาศาสตร์
2. ความลึกซึ้งของการมองปัญหาเชิงโครงสร้าง (เศรษฐกิจ/สังคม/กฎหมาย)
3. ความเป็นไปได้และความรอบด้านของข้อเสนอแนะเชิงนโยบาย
ปิดท้ายด้วยคำแนะนำเพื่อพัฒนาความคิดวิพากษ์ให้คมคายยิ่งขึ้น`;
    }

    // Call Gemini API with timeout protection
    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction: contextualSystemPrompt,
      },
    });

    const timeoutPromise = new Promise<{ text?: string }>((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT')), 8000)
    );

    const response = (await Promise.race([generatePromise, timeoutPromise])) as any;
    const reply = response.text || generateSmartPedagogicalReply(message, mode, caseStudyContext);

    res.status(200).json({ reply });
  } catch (err: unknown) {
    console.warn('Vercel serverless Gemini call fallback:', err);
    const { message, mode, caseStudyContext } = req.body || {};
    const reply = generateSmartPedagogicalReply(message || '', mode || 'socratic', caseStudyContext);
    res.status(200).json({ reply });
  }
}
