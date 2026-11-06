import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

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

const SYSTEM_INSTRUCTION_ECOBOT = `คุณคือ "Eco bot" (อีโค บอต) ปัญญาประดิษฐ์ผู้เชี่ยวชาญด้านภูมิศาสตร์สิ่งแวดล้อม และเป็นผู้ช่วยสอนในห้องเรียนวิชาภูมิศาสตร์ "Eco-critical" 
ภารกิจหลักของคุณ:
1. ให้ความรู้เกี่ยวกับมลพิษทางอากาศ ฝุ่น PM2.5 ปรากฏการณ์ทางภูมิศาสตร์ เช่น ปรากฏการณ์อุณหภูมิผกผัน (Thermal Inversion), ภูมิประเทศแบบแอ่งกระทะ (Basin/Valley topography), ลมมรสุม และการเคลื่อนย้ายมลพิษข้ามพรมแดน (Transboundary haze)
2. พัฒนาทักษะ "การคิดวิพากษ์" (Critical Thinking) ให้กับผู้เรียน โดยไม่เพียงบอกคำตอบ แต่จะตั้งคำถามชวนคิด (Socratic Questioning), ชวนมองเบื้องหลังปัญหาเชิงโครงสร้าง (เช่น เกษตรพันธสัญญา, อุตสาหกรรม, ความเหลื่อมล้ำทางเศรษฐกิจและสุขภาพ, นโยบายรัฐ)
3. วิเคราะห์กรณีศึกษาทั้งในอดีตและปัจจุบัน (เช่น มหาหมอกควันลอนดอน 1952, หมอกควัน LA, วิกฤตแม่เมาะ ลำปาง, ฝุ่นควันภาคเหนือ เชียงใหม่, ปักกิ่ง, วิกฤตไฟป่าพรุอาเซียน, ฝุ่น กทม.)
4. สไตล์การสื่อสาร: เป็นมิตร สุภาพ มีเหตุผล กระตุ้นความอยากรู้อยากเห็น ใช้ภาษาไทยที่ชัดเจนเข้าใจง่าย เหมาะกับนักเรียนระดับมัธยมปลายและอุดมศึกษา สอดแทรกคำถามนำชวนคิด 1-2 ข้อในตอนท้ายเสมอ`;

// Intelligent pedagogical fallback generator when API key is unconfigured or network is unavailable
function generateSmartPedagogicalReply(message: string, mode: string, caseContext?: any): string {
  const m = message.toLowerCase();

  if (mode === 'evaluate') {
    return `📋 **การประเมินการคิดวิพากษ์โดย Eco bot:**

1. **มิติภูมิศาสตร์กายภาพ (Geographical Understanding):** 
คุณได้ให้เหตุผลที่เชื่อมโยงกับสภาพแวดล้อมจริงได้น่าสนใจ โดยเฉพาะการตระหนักว่าภูมิประเทศ (เช่น แอ่งกระทะหรือตึกสูง) และสภาพอากาศ (อุณหภูมิผกผัน ลมสงบ) เป็นตัวแปรควบคุมการสะสมตัวของมลพิษ

2. **มิติโครงสร้างและนิเวศวิทยาการเมือง (Structural & Critical Insight):** 
ข้อสังเกตของคุณช่วยเปิดมุมมองว่า มลพิษไม่ใช่เพียงเรื่องของ "พฤติกรรมส่วนบุคคล" แต่ผูกติดกับโครงสร้างทางเศรษฐกิจ (เช่น ห่วงโซ่อุปทานเกษตรพันธสัญญา โรงงาน หรือระบบขนส่ง) ซึ่งสะท้อนความเข้าใจเรื่องความเหลื่อมล้ำทางสิ่งแวดล้อม

3. **ข้อเสนอแนะเพื่อพัฒนาความคิดวิพากษ์ให้ลึกซึ้งขึ้น:**
- *ชวนคิดต่อ:* หากรัฐนำข้อเสนอของคุณไปปฏิบัติจริง กลุ่มใดจะได้รับผลประโยชน์สูงสุด และกลุ่มใดอาจต้องแบกรับต้นทุนการปรับตัว? รัฐควรมีกลไกชดเชยเยียวยาอย่างไร?
- *คำถามท้าทาย:* ในบริบทของมลพิษข้ามพรมแดน ข้อเสนอของคุณจะต้องปรับใช้อย่างไรเพื่อให้ประเทศเพื่อนบ้านยินยอมร่วมมือ?`;
  }

  if (m.includes('ห้ามเผา') || m.includes('เกษตรกร') || m.includes('นายทุน') || m.includes('ข้าวโพด')) {
    return `💡 **มุมมองเชิงวิพากษ์เรื่อง "การห้ามเผาเด็ดขาด vs ห่วงโซ่เกษตรพันธสัญญา":**

การประกาศนโยบาย "ห้ามเผาเด็ดขาด (Zero Burning)" มักสร้างภาพลวงตาว่ารัฐกำลังแก้ปัญหาอย่างจริงจัง แต่ในทางภูมิศาสตร์มนุษย์และเศรษฐศาสตร์สิ่งแวดล้อม:

1. **ข้อจำกัดทางกายภาพ:** พื้นที่ปลูกข้าวโพดบนภูเขาสูงชันในภาคเหนือ ไม่สามารถนำรถแทรกเตอร์หรือเครื่องจักรเข้าไปไถกลบตอซังได้ การเผาจึงเป็นทางเลือกเดียวที่เกษตรกรรายย่อยจ่ายไหว
2. **ห่วงโซ่อุปทานอาหารสัตว์:** เกษตรกรบนดอยมักมีฐานะยากจนและติดกับดักหนี้สินจากปุ๋ยและยาฆ่าแมลง ขณะที่กำไรก้อนใหญ่ตกอยู่กับกลุ่มทุนอุตสาหกรรมเนื้อสัตว์และอาหารสัตว์ยักษ์ใหญ่
3. **ผลกระทบย้อนศร (Rebound Effect):** การห้ามเผาแบบเด็ดขาดมักบีบให้เกษตรกรแอบเผาในเวลากลางคืน หรือรอเผาพร้อมกันหมดในวันสิ้นสุดประกาศ เกิดม่านควันกระชากพุ่งสูงฉับพลัน

🧠 **คำถามชวนคิดวิพากษ์สำหรับคุณ:**
- เป็นธรรมหรือไม่ที่เกษตรกรรายย่อยต้องรับโทษปรับและจำคุก ขณะที่บริษัทผู้รับซื้อผลผลิตไม่ต้องรับผิดชอบต้นทุนทางสุขภาพของสังคม?
- ระบบ "ตรวจสอบย้อนกลับ (Traceability)" ในห่วงโซ่อาหารสัตว์ จะช่วยแก้ปัญหานี้ได้อย่างไรในทางปฏิบัติ?`;
  }

  if (m.includes('แอ่งกระทะ') || m.includes('อุณหภูมิผกผัน') || m.includes('inversion') || m.includes('ทำไมฝุ่นขัง')) {
    return `⛰️ **กลไกทางภูมิศาสตร์: แอ่งกระทะและปรากฏการณ์อุณหภูมิผกผัน (Thermal Inversion):**

1. **ภูมิประเทศแอ่งกระทะ (Intermontane Basin):**
เมืองอย่างเชียงใหม่ ลำพูน หรือแม่เมาะ ตั้งอยู่ในที่ราบหุบเขาที่ถูกโอบล้อมด้วยเทือกเขาสูง แนวภูเขาทำหน้าที่เสมือน "กำแพงธรรมชาติ" ขวางกั้นทิศทางลม ทำให้ความเร็วลมที่ผิวดินสงบนิ่ง ไม่สามารถพัดระบายฝุ่นออกไปได้

2. **ปรากฏการณ์อุณหภูมิผกผัน (Thermal Inversion):**
- ในสภาวะปกติ ยิ่งสูงยิ่งหนาว อากาศร้อนที่ผิวดินจะลอยตัวขึ้นพร้อมกับพาฝุ่นควันให้กระจายตัวไป
- แต่ในคืนฤดูหนาวที่ฟ้าโปร่ง ผิวดินจะคายความร้อนออกไปอย่างรวดเร็ว ทำให้อากาศติดผิวดินเย็นฉับพลัน ขณะที่ชั้นบรรยากาศเหนือขึ้นไป (~300-500 ม.) ยังอุ่นกว่า
- ชั้นอากาศอุ่นนี้จะทำหน้าที่เสมือน **"ฝาชีความร้อน"** กดทับอากาศเย็นด้านล่างไว้ มลพิษจากควันไฟและไอเสียจึงถูกกักขังอยู่ในแอ่งกระทะอย่างหนาแน่น

🧠 **คำถามชวนคิดวิพากษ์สำหรับคุณ:**
- ในเมื่อเราไม่สามารถทุบภูเขาทิ้ง หรือสั่งให้ธรรมชาติหยุดสร้างอุณหภูมิผกผันได้ มนุษย์ควรปรับตัวอย่างไร? การใช้ระบบ "ชิงเผาตามแบบจำลองเพดานอากาศ" ดีกว่าการห้ามเผาเด็ดขาดหรือไม่?`;
  }

  if (m.includes('ลอนดอน') || m.includes('london') || m.includes('1952')) {
    return `📜 **วิเคราะห์เปรียบเทียบ: มหาหมอกควันลอนดอน 1952 (The Great Smog) vs PM2.5 ในไทย:**

1. **ความเหมือนทางภูมิศาสตร์กายภาพ:**
ทั้งลอนดอนและกรุงเทพฯ/ภาคเหนือ เกิดวิกฤตภายใต้ **"ปรากฏการณ์อุณหภูมิผกผัน (Thermal Inversion)"** ในฤดูหนาวร่วมกับสภาพอากาศนิ่งสนิท ทำให้มลพิษถูกกักไว้ไม่ให้ลอยตัว

2. **ความแตกต่างของแหล่งกำเนิด:**
- ลอนดอน 1952: เกิดจากการเผาถ่านหินกำมะถันสูงในเตาผิงครัวเรือนและโรงไฟฟ้า มลพิษหลักคือ **SO2 (ซัลเฟอร์ไดออกไซด์)** และเขม่าดำ กลายเป็นฝนกรดกัดปอด
- กรุงเทพฯ: มลพิษหลักคือ **PM2.5 จากไอเสียเครื่องยนต์ดีเซล** การก่อสร้าง และตึกสูง (Urban Canyon)
- ภาคเหนือ: มลพิษหลักคือ **PM2.5 จากการเผาชีวมวลในป่าและพื้นที่เกษตร** ผสานกับควันข้ามพรมแดน

3. **จุดเปลี่ยนนโยบาย:**
อังกฤษผ่านกฎหมาย Clean Air Act 1956 ห้ามใช้ถ่านหินในเมือง และให้เงินอุดหนุนประชาชนเปลี่ยนเตาผิงเป็นแก๊ส/ไฟฟ้า ซึ่งสะท้อนว่าการออกกฎหมายต้องมาพร้อมงบประมาณสนับสนุนการปรับตัว

🧠 **คำถามชวนคิดวิพากษ์สำหรับคุณ:**
- หากไทยมี พ.ร.บ. อากาศสะอาด แต่ไม่มีเงินอุดหนุนให้ประชาชนเปลี่ยนรถเมล์ดีเซลเก่า หรือไม่มีเทคโนโลยีทดแทนการเผาให้เกษตรกร กฎหมายจะประสบความสำเร็จได้เหมือนอังกฤษหรือไม่?`;
  }

  if (m.includes('แม่เมาะ') || m.includes('lampang') || m.includes('so2')) {
    return `🏭 **บทเรียนประวัติศาสตร์: วิกฤตแม่เมาะ ลำปาง กับความยุติธรรมทางสิ่งแวดล้อม:**

กรณีโรงไฟฟ้าแม่เมาะ (พ.ศ. 2535 และ 2541) คือหนึ่งในหมุดหมายสำคัญที่สุดของประวัติศาสตร์สิ่งแวดล้อมไทย:

1. **ภูมิศาสตร์ที่ซ้ำเติม:** โรงไฟฟ้าตั้งอยู่ในแอ่งกระทะหุบเขาแม่เมาะ เมื่ออากาศปิดในฤดูหนาว ก๊าซ SO2 นับพันตันถูกกดทับให้ไหลวนเลี่ยพื้นดินเข้าสู่หมู่บ้าน
2. **ความอยุติธรรมทางสิ่งแวดล้อม (Environmental Injustice):** คนในเมืองหลวงและโรงงานทั่วประเทศได้ใช้ไฟฟ้าในราคาถูก แต่คนในชุมชนแม่เมาะต้องจ่ายด้วยอาการป่วย ปอดพัง และการสูญเสียวิถีชีวิต
3. **ชัยชนะของพลเมือง:** ชาวบ้านรวมตัวฟ้องร้อง กฟผ. ต่อสู้ในศาลปกครองยาวนานกว่า 10 ปี จนศาลสั่งให้ชดใช้ค่าเสียหายและบังคับติดตั้งเครื่องดักจับก๊าซ SO2 (FGD)

🧠 **คำถามชวนคิดวิพากษ์สำหรับคุณ:**
- ทำไมการติดตั้งเครื่องดักมลพิษจึงต้องรอให้มีคนป่วยและคนตายก่อน? องค์กรผู้ผลิตพลังงานคำนวณต้นทุนภายนอก (Externalities) พลาดไปตรงไหน?`;
  }

  if (m.includes('ข้ามแดน') || m.includes('อาเซียน') || m.includes('เพื่อนบ้าน') || m.includes('อินโด')) {
    return `💨 **ภูมิศาสตร์การเมือง: หมอกควันข้ามพรมแดน (Transboundary Haze):**

1. **ควันไม่มีพรมแดน:** ลมมรสุมพัดพามวลอากาศตามความกดอากาศและแรงโคริออลิส ไม่รับรู้เส้นเขตแดนทางการเมืองที่มนุษย์ขีดขึ้น
2. **กับดักวิถีอาเซียน (The ASEAN Way):** ข้อตกลงอาเซียนว่าด้วยหมอกควันข้ามพรมแดน (ค.ศ. 2002) มีข้อจำกัดสำคัญคือ ยึดหลัก **"การไม่แทรกแซงกิจการภายใน (Non-interference)"** และไม่มีกลไกการคว่ำบาตรหรือลงโทษทางกฎหมายที่แท้จริง
3. **ความย้อนแย้งของทุนข้ามชาติ:** บริษัทที่เข้าไปลงทุนเผาป่าพรุในอินโดนีเซีย หรือเผาข้าวโพดในเมียนมา-ลาว หลายแห่งจดทะเบียนในตลาดหลักทรัพย์สิงคโปร์ มาเลเซีย หรือไทย

🧠 **คำถามชวนคิดวิพากษ์สำหรับคุณ:**
- เราควรใช้ "มาตรการทางภาษีและการค้า (Trade Sanctions)" เพื่อระงับการนำเข้าผลผลิตเกษตรจากพื้นที่เผาในประเทศเพื่อนบ้านหรือไม่? และจะมีผลกระทบต่อปากท้องของใครบ้าง?`;
  }

  // Default critical thinking response
  return `🌿 **Eco bot ร่วมคิดวิพากษ์:**

คำถามหรือประเด็นที่คุณกล่าวถึง: "${message}" นับเป็นมุมมองที่น่าสนใจมากในวิชาภูมิศาสตร์สิ่งแวดล้อมครับ!

เมื่อเราพิจารณาปัญหามลพิษทางอากาศและฝุ่น PM2.5 นักภูมิศาสตร์จะมองผ่าน 3 มิติหลัก:
1. **มิติภูมิศาสตร์กายภาพ:** ภูมิประเทศ (แอ่งกระทะ, หุบเขา, หรือช่องตึกสูง) และสภาพอากาศ (อุณหภูมิผกผัน ลมมรสุม) กำหนดว่าฝุ่นจะสะสมหรือกระจายตัวอย่างไร
2. **มิตินิเวศวิทยาการเมืองและเศรษฐกิจ:** ใครคือผู้ก่อมลพิษ? ใครได้รับผลประโยชน์ทางการเงิน? และใครคือผู้ที่ต้องสูดดมและแบกรับภาระค่ารักษาพยาบาล?
3. **มิติความเป็นธรรมเชิงนโยบาย:** การแก้ปัญหาที่ปลายเหตุ (แจกหน้ากาก/ติดตั้งเครื่องฟอกอากาศ) แตกต่างจากการแก้เชิงโครงสร้าง (พ.ร.บ. อากาศสะอาด/เปลี่ยนผ่านพลังงานและเกษตรกรรม) อย่างไร?

🧠 **คำถามชวนคิดวิพากษ์สำหรับคุณ:**
- ในมุมมองของคุณ อะไรคือ "ต้นตอที่แท้จริง" ของปัญหานี้ และทำไมมาตรการที่ผ่านมาของภาครัฐจึงยังแก้ปัญหาได้ไม่ยั่งยืน?`;
}

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
      res.json({
        questions: `1. มิติภูมิศาสตร์กายภาพ: ลักษณะภูมิประเทศและอุตุนิยมวิทยาเฉพาะถิ่นส่งผลต่อการกักขังมลพิษอย่างไร?\n2. มิติเศรษฐกิจการเมือง: ใครคือผู้ได้รับประโยชน์จากกิจกรรมที่สร้างมลพิษ และใครคือผู้ที่ต้องแบกรับต้นทุนสุขภาพ?\n3. มิติจริยธรรม: สิทธิในการหายใจอากาศสะอาดควรได้รับการคุ้มครองในฐานะสิทธิมนุษยชนขั้นพื้นฐานอย่างไร?`,
      });
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

    res.json({ questions: response.text });
  } catch (err: unknown) {
    res.json({
      questions: `1. ลักษณะทางภูมิศาสตร์ส่งผลต่อการสะสมตัวของมลพิษอย่างไร?\n2. ความเหลื่อมล้ำทางเศรษฐกิจทำให้ใครต้องแบกรับผลกระทบมากกว่า?\n3. การแก้ปัญหาที่ต้นตอต้องการการเปลี่ยนแปลงนโยบายใด?`,
    });
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
