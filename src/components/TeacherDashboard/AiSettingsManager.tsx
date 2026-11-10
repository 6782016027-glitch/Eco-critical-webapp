/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { AiProvider } from '../../types/portal';
import {
  Cpu,
  Key,
  Activity,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  Eye,
  EyeOff,
  Sliders,
  Sparkles,
  Zap,
} from 'lucide-react';

export const AiSettingsManager: React.FC = () => {
  const { aiConfig, updateAiConfig, testAiConnection } = usePortal();

  const [provider, setProvider] = useState<AiProvider>(aiConfig.provider);
  const [geminiApiKey, setGeminiApiKey] = useState(aiConfig.geminiApiKey || '');
  const [openaiApiKey, setOpenaiApiKey] = useState(aiConfig.openaiApiKey || '');
  const [geminiModel, setGeminiModel] = useState(aiConfig.geminiModel || 'gemini-3.8-flash');
  const [openaiModel, setOpenaiModel] = useState(aiConfig.openaiModel || 'gpt-4o-mini');
  const [temperature, setTemperature] = useState(aiConfig.temperature || 0.7);
  const [systemInstruction, setSystemInstruction] = useState(
    aiConfig.systemInstruction ||
      `คุณคือ "Eco bot" ปัญญาประดิษฐ์สืบค้นและผู้ช่วยสอนวิชาภูมิศาสตร์สิ่งแวดล้อม ประจำระบบ "Eco-critical" สำหรับนักเรียนระดับมัธยมศึกษาตอนปลาย (ม.4 - ม.6) ตามหลักสูตรแกนกลางการศึกษาขั้นพื้นฐาน พ.ศ. 2551 (ฉบับปรับปรุง พ.ศ. 2560)
ภารกิจหลักของคุณคือ:
1. ตอบคำถามนักเรียนด้วยข้อมูลที่ถูกต้องตามสาระภูมิศาสตร์ ม.ปลาย (มาตรฐาน ส 5.1: แผนที่ ภูมิสารสนเทศ ธรณีสัณฐาน และบรรยากาศภาค; มาตรฐาน ส 5.2: ปฏิสัมพันธ์มนุษย์กับการใช้ที่ดิน หมอกควันข้ามแดน และการจัดการสิ่งแวดล้อม)
2. กระตุ้นให้นักเรียนคิดวิพากษ์ (Critical Thinking) เชื่อมโยงมิติภูมิศาสตร์กายภาพ โครงสร้างเศรษฐกิจ การเปลี่ยนแปลงการใช้ที่ดิน และความยุติธรรมทางสิ่งแวดล้อมอย่างสร้างสรรค์`
  );

  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    latencyMs: number;
  } | null>(null);
  const [saveBanner, setSaveBanner] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAiConfig({
      provider,
      geminiApiKey: geminiApiKey.trim(),
      openaiApiKey: openaiApiKey.trim(),
      geminiModel,
      openaiModel,
      temperature,
      systemInstruction,
    });
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 2500);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    // Save current keys first
    updateAiConfig({
      provider,
      geminiApiKey: geminiApiKey.trim(),
      openaiApiKey: openaiApiKey.trim(),
      geminiModel,
      openaiModel,
    });

    const result = await testAiConnection();
    setTestResult(result);
    setIsTesting(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-600" />
            <span>ตั้งค่า AI และกุญแจเชื่อมต่อ (AI Provider & API Key Settings)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            เลือกผู้ให้บริการ AI ระหว่าง Google Gemini และ OpenAI กำหนดโมเดล และทดสอบการเชื่อมต่อแบบเรียลไทม์
          </p>
        </div>

        {/* Live Test Connection Button */}
        <button
          type="button"
          onClick={handleTestConnection}
          disabled={isTesting}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white text-xs font-bold rounded-xl transition-all shadow-2xs disabled:opacity-50 shrink-0"
        >
          {isTesting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>กำลังทดสอบการเชื่อมต่อ...</span>
            </>
          ) : (
            <>
              <Activity className="w-4 h-4" />
              <span>ทดสอบการเชื่อมต่อ (Test Connection)</span>
            </>
          )}
        </button>
      </div>

      {/* Test Result Alert Banner */}
      {testResult && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-start gap-3 transition-all animate-in fade-in ${
            testResult.success
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          {testResult.success ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <div className="font-bold">
              {testResult.success ? 'เชื่อมต่อสำเร็จเรียบร้อย!' : 'การเชื่อมต่อไม่สำเร็จ'}
            </div>
            <p className="leading-relaxed">{testResult.message}</p>
            <div className="text-[11px] opacity-75 font-mono">
              ความเร็วตอบสนอง (Latency): {testResult.latencyMs} ms · เวลาทดสอบ:{' '}
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}

      {saveBanner && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>บันทึกการตั้งค่า AI สำเร็จเรียบร้อยแล้ว</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-2xs text-xs">
        {/* Step 1: Select Provider */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
            1. เลือกผู้ให้บริการ AI (AI Provider)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Google Gemini Card */}
            <div
              onClick={() => setProvider('gemini')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                provider === 'gemini'
                  ? 'border-emerald-500 bg-emerald-50/60 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Google Gemini (แนะนำ)</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  ค่าเริ่มต้น
                </span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                โมเดล <code className="font-mono font-bold text-emerald-800">gemini-3.8-flash</code> ประมวลผลภาษาไทยได้อย่างรวดเร็ว แม่นยำ และรองรับ Context ข้อมูลวิชาการขนาดยาว
              </p>
            </div>

            {/* OpenAI Card */}
            <div
              onClick={() => setProvider('openai')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                provider === 'openai'
                  ? 'border-sky-500 bg-sky-50/60 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-sky-600" />
                  <span>OpenAI</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                  ทางเลือก
                </span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                โมเดล <code className="font-mono font-bold text-sky-800">gpt-4o-mini</code> หรือ <code className="font-mono font-bold text-sky-800">gpt-4o</code> สำหรับสถาบันที่ใช้ระบบ OpenAI API
              </p>
            </div>
          </div>
        </div>

        {/* Step 2: API Keys Inputs */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
            2. ข้อมูลการยืนยันตัวตน (API Keys)
          </label>

          {/* Gemini API Key */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-600" />
                <span>Google Gemini API Key</span>
              </label>
              <span className="text-[10px] text-slate-400">
                รับคีย์ฟรีได้จาก <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-emerald-600 underline">Google AI Studio</a>
              </span>
            </div>

            <div className="relative">
              <input
                type={showGeminiKey ? 'text' : 'password'}
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2.5 pr-10 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => setShowGeminiKey(!showGeminiKey)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              * หากไม่ได้กรอกคีย์ ระบบจะใช้ Smart Pedagogical Reasoning Engine ในตัวเพื่อตอบคำถามให้นักเรียนอัตโนมัติ
            </p>
          </div>

          {/* OpenAI API Key */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-sky-600" />
                <span>OpenAI API Key</span>
              </label>
              <span className="text-[10px] text-slate-400">
                สำหรับผู้ใช้บัญชี OpenAI Platform
              </span>
            </div>

            <div className="relative">
              <input
                type={showOpenaiKey ? 'text' : 'password'}
                value={openaiApiKey}
                onChange={(e) => setOpenaiApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-3 py-2.5 pr-10 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showOpenaiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Step 3: Models & Hyperparameters */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-emerald-600" />
            <span>3. ปรับแต่งโมเดลและพารามิเตอร์ (Model & Hyperparameters)</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                โมเดลสำหรับ {provider === 'gemini' ? 'Google Gemini' : 'OpenAI'}
              </label>
              {provider === 'gemini' ? (
                <select
                  value={geminiModel}
                  onChange={(e) => setGeminiModel(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="gemini-3.8-flash">gemini-3.8-flash (แนะนำความเร็วและเหตุผล)</option>
                  <option value="gemini-flash-latest">gemini-flash-latest</option>
                  <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (ประหยัดโควต้า)</option>
                </select>
              ) : (
                <select
                  value={openaiModel}
                  onChange={(e) => setOpenaiModel(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 font-mono"
                >
                  <option value="gpt-4o-mini">gpt-4o-mini (แนะนำ)</option>
                  <option value="gpt-4o">gpt-4o (โมเดลเรือธง)</option>
                  <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                </select>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-700">ระดับความคิดสร้างสรรค์ (Temperature): {temperature}</label>
                <span className="text-[10px] text-slate-400">0.0 (ตรงเป๊ะ) - 1.0 (สร้างสรรค์)</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              คำสั่งระบบชี้นำบทบาทติวเตอร์ (System Instruction):
            </label>
            <textarea
              rows={4}
              value={systemInstruction}
              onChange={(e) => setSystemInstruction(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-sans leading-relaxed text-xs"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            * การตั้งค่านี้จะถูกบันทึกและนำไปใช้ในการตอบคำถามของ Eco bot ตลอดทั้งระบบ
          </div>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>บันทึกการตั้งค่า AI</span>
          </button>
        </div>
      </form>
    </div>
  );
};
