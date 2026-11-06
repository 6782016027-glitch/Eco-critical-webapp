import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Volume2, VolumeX, Trash2, BookOpen, Scale, Lightbulb, AlertCircle } from 'lucide-react';
import { CASE_STUDIES, CaseStudy } from '../data/caseStudies';

interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

interface EcoBotChatProps {
  initialPrompt?: string;
  initialCaseStudy?: CaseStudy | null;
}

export const EcoBotChat: React.FC<EcoBotChatProps> = ({
  initialPrompt,
  initialCaseStudy,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: `สวัสดีครับ! ผมคือ **Eco bot** ผู้ช่วยสอนปัญญาประดิษฐ์ในห้องเรียนภูมิศาสตร์ "Eco-critical" 🌿\n\nผมพร้อมชวนทุกคนสืบเสาะและคิดวิพากษ์เรื่อง **มลพิษทางอากาศและฝุ่น PM2.5** ทั้งมิติวิทยาศาสตร์บรรยากาศ ภูมิประเทศแอ่งกระทะ อุณหภูมิผกผัน ไปจนถึงโครงสร้างเศรษฐกิจการเมือง เกษตรพันธสัญญา และความยุติธรรมทางสิ่งแวดล้อม\n\nคุณสามารถเลือกถามคำถาม เลือกหัวข้อชวนคิด หรือลองตอบคำถามนำด้านล่างนี้ได้เลยครับ!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<'socratic' | 'case_study' | 'general' | 'evaluate'>('socratic');
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(initialCaseStudy || null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    if (initialCaseStudy) {
      setSelectedCase(initialCaseStudy);
      setChatMode('case_study');
    }
  }, [initialCaseStudy]);

  const quickPrompts = [
    {
      title: '🌾 ทางออกเกษตรกร & นายทุน',
      prompt: 'ถ้าสั่งห้ามเกษตรกรบนดอยเผาเศษวัสดุ แต่ไม่ควบคุมกลุ่มทุนเกษตรพันธสัญญาที่รับซื้อผลผลิต จะเกิดผลกระทบอย่างไร?',
    },
    {
      title: '⛰️ ภูมิศาสตร์แอ่งกระทะ & อุณหภูมิผกผัน',
      prompt: 'อธิบายว่าทำไมภูมิประเทศแบบแอ่งกระทะในภาคเหนือจึงทำให้ฝุ่น PM2.5 ขังตัว และปรากฏการณ์อุณหภูมิผกผัน (Thermal Inversion) เกิดขึ้นได้อย่างไร?',
    },
    {
      title: '💨 มลพิษข้ามพรมแดนอาเซียน',
      prompt: 'ทำไมหลักการไม่แทรกแซงกิจการภายในของอาเซียน จึงเป็นอุปสรรคสำคัญในการแก้ปัญหาหมอกควันข้ามพรมแดน?',
    },
    {
      title: '⚖️ ความเหลื่อมล้ำในการเข้าถึงอากาศสะอาด',
      prompt: 'ทำไมปัญหาฝุ่น PM2.5 จึงไม่ใช่แค่ปัญหาสุขภาพ แต่เป็นปัญหาความเหลื่อมล้ำทางชนชั้นและสิทธิมนุษยชน?',
    },
    {
      title: '📜 บทเรียนมหาหมอกควันลอนดอน 1952',
      prompt: 'เปรียบเทียบมหาหมอกควันลอนดอน 1952 กับวิกฤต PM2.5 ในกรุงเทพมหานคร มีความเหมือนและแตกต่างกันอย่างไรในเชิงภูมิศาสตร์และนโยบาย?',
    },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages,
          mode: chatMode,
          caseStudyContext: selectedCase
            ? {
                title: selectedCase.titleTh,
                period: selectedCase.period,
                location: selectedCase.location,
                summary: selectedCase.summary,
                geography: selectedCase.geographyFactors.topography,
              }
            : null,
        }),
      });

      if (!response.ok) {
        throw new Error('ระบบเซิร์ฟเวอร์ขัดข้อง ไม่สามารถประมวลผลคำตอบได้');
      }

      const data = await response.json();
      const botMsg: Message = {
        role: 'model',
        content: data.reply || 'ขออภัยครับ ไม่สามารถสร้างคำตอบได้ในขณะนี้',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: unknown) {
      console.error('Chat error:', err);
      setErrorMsg('เกิดข้อผิดพลาดในการติดต่อ Eco bot กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('เบราว์เซอร์ของคุณไม่รองรับฟังก์ชัน Text-to-Speech');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'th-TH';
    utterance.rate = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleClearChat = () => {
    if (window.confirm('คุณต้องการล้างประวัติการสนทนาทั้งหมดใช่หรือไม่?')) {
      if (isSpeaking) window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setMessages([
        {
          role: 'model',
          content: 'ล้างประวัติการสนทนาเรียบร้อยครับ ยินดีต้อนรับสู่การคิดวิพากษ์รอบใหม่ มีคำถามหรือประเด็นใดอยากให้ Eco bot ชวนคิดวิพากษ์ไหมครับ?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Bot Header Card - Calm Green & Sky */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-500 p-0.5 shadow-sm shrink-0">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Bot className="w-7 h-7 text-emerald-600 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Eco bot
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                AI ผู้ช่วยคิดวิพากษ์สิ่งแวดล้อม
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              กระตุ้นการคิดวิพากษ์ (Socratic Inquiry) • วิเคราะห์ปัจจัยภูมิศาสตร์และนโยบาย • ตั้งคำถามท้าทายสมมติฐาน
            </p>
          </div>
        </div>

        {/* Clear chat button */}
        <button
          onClick={handleClearChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs border border-slate-200 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>ล้างการสนทนา</span>
        </button>
      </div>

      {/* Mode Selector and Context Strip */}
      <div className="bg-white border border-slate-200/90 p-4 rounded-2xl space-y-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-emerald-600" />
            เลือกโหมดการสนทนากับ Eco bot:
          </span>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setChatMode('socratic')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                chatMode === 'socratic'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
              <span>ชวนคิดวิพากษ์ (Socratic)</span>
            </button>

            <button
              onClick={() => setChatMode('case_study')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                chatMode === 'case_study'
                  ? 'bg-sky-600 text-white font-bold shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-200" />
              <span>เจาะลึกกรณีศึกษา</span>
            </button>

            <button
              onClick={() => setChatMode('evaluate')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                chatMode === 'evaluate'
                  ? 'bg-teal-600 text-white font-bold shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-teal-200" />
              <span>ตรวจข้อเสนอ & ให้ฟีดแบ็ก</span>
            </button>
          </div>
        </div>

        {chatMode === 'case_study' && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">เลือกกรณีศึกษาที่กำลังสนทนา:</span>
            <select
              value={selectedCase?.id || ''}
              onChange={(e) => {
                const found = CASE_STUDIES.find((c) => c.id === e.target.value);
                setSelectedCase(found || null);
              }}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500 font-semibold"
            >
              <option value="">-- เลือกกรณีศึกษา --</option>
              {CASE_STUDIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.titleTh} ({c.country})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Chat Window - Clean, airy, serene */}
      <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs flex flex-col h-[560px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center shrink-0 shadow-2xs mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-2xs text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap space-y-2">
                    {msg.content}
                  </div>

                  <div className={`flex items-center justify-between gap-3 mt-2 pt-1 border-t text-[10px] ${
                    isUser ? 'border-white/20 text-emerald-100' : 'border-slate-100 text-slate-400'
                  }`}>
                    <span>{msg.timestamp}</span>

                    {!isUser && (
                      <button
                        onClick={() => handleToggleSpeech(msg.content)}
                        className="hover:text-emerald-700 transition-colors flex items-center gap-1 font-medium"
                        title="ฟังเสียงบรรยายภาษาไทย"
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                            <span className="text-rose-600">หยุดเสียง</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                            <span>อ่านออกเสียง</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-emerald-600 animate-spin" />
              </div>
              <div className="bg-white p-3.5 rounded-2xl text-xs text-slate-600 border border-slate-200 flex items-center gap-2 shadow-2xs">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                </div>
                <span>Eco bot กำลังวิเคราะห์และเรียบเรียงคำถามวิพากษ์...</span>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Preset Prompt Buttons - Soft Green/Sky */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-500 font-semibold shrink-0">คำถามนำ:</span>
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(item.prompt)}
              className="px-3 py-1 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 whitespace-nowrap transition-colors"
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="พิมพ์คำถาม ปัญหา หรือสมมติฐานของคุณที่นี่ เช่น ชุมชนควรจัดการฝุ่นอย่างไร?..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="p-3 rounded-xl bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 disabled:opacity-40 text-white font-semibold transition-all shadow-xs"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
