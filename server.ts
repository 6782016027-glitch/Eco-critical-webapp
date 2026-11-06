import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  SYSTEM_INSTRUCTION_ECOBOT,
  generateSmartPedagogicalReply,
  generateCriticalPrompts,
} from './src/utils/ecoBotEngine.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API: Chat with Eco bot
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history, mode, caseStudyContext } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // If API key is not configured or in development preview, use smart pedagogical responder
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
      const pedagogicalReply = generateSmartPedagogicalReply(message, mode, caseStudyContext);
      res.json({ reply: pedagogicalReply });
      return;
    }

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
3. ความเป็นไปได้และความรอบด้านของข้อเสนอ พร้อมคำถามท้าทายความคิดเพิ่มเติม`;
    }

    // Build contents for Gemini
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history) && history.length > 0) {
      for (const item of history.slice(-6)) {
        if (item.role === 'user' || item.role === 'model') {
          contents.push({
            role: item.role,
            parts: [{ text: item.content || item.text || '' }],
          });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    // Timeout protection for reliable responses
    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: contextualSystemPrompt,
      },
    });

    const timeoutPromise = new Promise<{ text: string }>((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT')), 8000)
    );

    const response = await Promise.race([generatePromise, timeoutPromise]);
    const reply = response.text || generateSmartPedagogicalReply(message, mode, caseStudyContext);
    res.json({ reply });
  } catch (err: unknown) {
    console.warn('Gemini API call fell back to pedagogical responder:', err);
    // Graceful fallback ensuring student experience is never interrupted
    const { message, mode, caseStudyContext } = req.body;
    const reply = generateSmartPedagogicalReply(message || '', mode || 'socratic', caseStudyContext);
    res.json({ reply });
  }
});

// API: Generate critical thinking questions for a case or topic
app.post('/api/critical-prompt', async (req: Request, res: Response) => {
  try {
    const { topic } = req.body;

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
      res.json({ questions: generateCriticalPrompts(topic) });
      return;
    }

    const prompt = `ในฐานะครูผู้สอนวิชาภูมิศาสตร์สิ่งแวดล้อม ช่วยสร้าง "ชุดคำถามชวนคิดวิพากษ์ (Critical Thinking Prompts)" จำนวน 3 ข้อ สำหรับหัวข้อ: "${topic || 'มลพิษทางอากาศและฝุ่น PM2.5'}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_ECOBOT,
      },
    });

    res.json({ questions: response.text || generateCriticalPrompts(topic) });
  } catch (err: unknown) {
    const { topic } = req.body;
    res.json({ questions: generateCriticalPrompts(topic) });
  }
});

// Vite Middleware for Development / Static file serving for Production
async function setupServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Eco-critical server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Server failed to start:', err);
});
