import React, { useState } from 'react';
import { CRITICAL_DILEMMAS } from '../data/curriculum';
import { Award, CheckCircle2, Copy, Send, Sparkles, Printer, Bot, AlertTriangle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CriticalJournalProps {
  onOpenEcoBotWithText?: (text: string) => void;
}

export const CriticalJournal: React.FC<CriticalJournalProps> = () => {
  // Dilemma state
  const [selectedDilemmaId, setSelectedDilemmaId] = useState<string>(CRITICAL_DILEMMAS[0].id);
  const [chosenOptionId, setChosenOptionId] = useState<string | null>(null);

  // Journal form state
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [journalTopic, setJournalTopic] = useState('สิทธิในการหายใจอากาศสะอาด vs ปากท้องของเกษตรกรรายย่อย');
  const [hypothesis, setHypothesis] = useState('');
  const [geoFactors, setGeoFactors] = useState('');
  const [proposedSolution, setProposedSolution] = useState('');

  // Evaluation state
  const [evaluationResult, setEvaluationResult] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const activeDilemma = CRITICAL_DILEMMAS.find((d) => d.id === selectedDilemmaId) || CRITICAL_DILEMMAS[0];
  const chosenOption = activeDilemma.options.find((o) => o.id === chosenOptionId);

  const predefinedTopics = [
    'สิทธิในการหายใจอากาศสะอาด vs ปากท้องของเกษตรกรรายย่อย',
    'วิกฤตแม่เมาะ จ.ลำปาง: เมื่อคนชนบทต้องแบกรับต้นทุนสุขภาพเพื่อไฟฟ้าราคาถูกของคนเมือง',
    'ทำไมการแจกหน้ากาก N95 และห้องปลอดฝุ่นจึงเป็นเพียงการแก้ปัญหาที่ปลายเหตุ?',
    'ควันไม่มีพรมแดน: ทางออกของมลพิษข้ามชาติในลุ่มน้ำโขงควรใช้เครื่องมือใด?',
    'Urban Canyon Effect: การออกแบบผังเมืองกรุงเทพฯ ซ้ำเติมวิกฤตฝุ่นได้อย่างไร?',
  ];

  const handleEvaluateWithEcoBot = async () => {
    if (!hypothesis.trim() && !proposedSolution.trim()) {
      alert('กรุณากรอกข้อสมมติฐานหรือข้อเสนอแนะของคุณก่อนส่งตรวจประเมิน');
      return;
    }

    setIsEvaluating(true);
    setEvaluationResult(null);

    const fullSubmission = `[บันทึกการคิดวิพากษ์ของนักเรียน: ${studentName || 'ไม่ระบุนาม'}]
หัวข้อ: ${journalTopic}
1. ข้อคิดเห็นและสมมติฐาน: ${hypothesis}
2. ปัจจัยทางภูมิศาสตร์ที่นำมาอธิบาย: ${geoFactors}
3. ข้อเสนอแนะเชิงโครงสร้าง/นโยบาย: ${proposedSolution}`;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: fullSubmission,
          mode: 'evaluate',
        }),
      });

      if (!response.ok) throw new Error('Evaluation failed');
      const data = await response.json();
      setEvaluationResult(data.reply);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการประเมิน กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleCopyJournal = () => {
    const fullText = `=== ใบงานบันทึกการคิดวิพากษ์: Eco-critical ===
ชื่อ-สกุล: ${studentName || '-'} รหัสนักเรียน: ${studentId || '-'}
หัวข้อ: ${journalTopic}

[ข้อคิดเห็นและสมมติฐาน]
${hypothesis}

[ปัจจัยทางภูมิศาสตร์]
${geoFactors}

[ข้อเสนอแนะเชิงโครงสร้างและทางออก]
${proposedSolution}

[ผลการประเมินจาก Eco bot]
${evaluationResult || 'ยังไม่ได้ทำการประเมิน'}`;

    navigator.clipboard.writeText(fullText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  return (
    <div className="space-y-10">
      {/* Header - Soothing Green & Sky */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-semibold border border-white/30">
            <Award className="w-3.5 h-3.5 text-yellow-200" />
            <span>ใบงาน & สมุดบันทึกการคิดวิพากษ์ (Critical Reflection Journal)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            ทดสอบการตัดสินใจ & ประเมินข้อคิดเห็นเชิงภูมิศาสตร์
          </h2>
          <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed font-normal">
            สวมบทบาทผู้กำหนดนโยบายในสถานการณ์กลืนไม่เข้าคายไม่ออก (Critical Dilemmas) และบันทึกข้อเสนอเพื่อส่งให้ Eco bot ช่วยประเมินและให้ข้อเสนอแนะในการพัฒนาความคิดเชิงวิพากษ์
          </p>
        </div>
      </div>

      {/* Part 1: Policy Dilemmas Simulation */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-mono text-emerald-700 font-bold block uppercase">
              ส่วนที่ 1: สถานการณ์จำลองทางสองแพร่ง (Policy Dilemma)
            </span>
            <h3 className="text-xl font-extrabold text-slate-900">
              {activeDilemma.titleTh}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {CRITICAL_DILEMMAS.map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  setSelectedDilemmaId(d.id);
                  setChosenOptionId(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedDilemmaId === d.id
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                กรณี: {d.roleTh}
              </button>
            ))}
          </div>
        </div>

        {/* Scenario description */}
        <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>สถานการณ์จำลอง (คุณรับบทบาท: {activeDilemma.roleTh})</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {activeDilemma.scenarioTh}
          </p>
        </div>

        {/* Option selection */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-700 block">
            คุณจะตัดสินใจเลือกแนวทางใด? (คลิกเลือกเพื่อดูผลลัพธ์และการวิพากษ์):
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeDilemma.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setChosenOptionId(opt.id)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                  chosenOptionId === opt.id
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {opt.id.toUpperCase()}
                  </span>
                  <p className="text-xs font-bold text-slate-800 leading-snug">
                    {opt.labelTh}
                  </p>
                </div>
                <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 self-end">
                  คลิกดูผลกระทบ <ArrowRight className="w-3 h-3" />
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Analysis of chosen option */}
        {chosenOption && (
          <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200 space-y-4">
            <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              การวิพากษ์ผลลัพธ์ของทางเลือก: {chosenOption.labelTh}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="font-bold text-rose-800 block mb-1">ผลกระทบที่อาจเกิดขึ้น:</span>
                <p className="text-slate-600 leading-relaxed">{chosenOption.consequenceTh}</p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="font-bold text-amber-800 block mb-1">มุมมองการคิดวิพากษ์:</span>
                <p className="text-slate-600 leading-relaxed">{chosenOption.criticalCritiqueTh}</p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="font-bold text-sky-800 block mb-1">ข้อมูลเชิงภูมิศาสตร์:</span>
                <p className="text-slate-600 leading-relaxed">{chosenOption.geographicalInsightTh}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Part 2: Critical Thinking Reflection Journal */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono text-sky-700 font-bold block uppercase">
              ส่วนที่ 2: แบบบันทึกการคิดวิพากษ์สำหรับส่งครูผู้สอน
            </span>
            <h3 className="text-xl font-extrabold text-slate-900">
              สมุดบันทึกการสืบเสาะทางภูมิศาสตร์ (Inquiry Journal)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs border border-slate-200 transition-colors font-medium"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>พิมพ์ใบงาน</span>
            </button>
            <button
              onClick={handleCopyJournal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs border border-slate-200 transition-colors font-medium"
            >
              <Copy className="w-3.5 h-3.5 text-slate-600" />
              <span>{copySuccess ? 'คัดลอกแล้ว!' : 'คัดลอกข้อความ'}</span>
            </button>
          </div>
        </div>

        {/* Student metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">ชื่อ - นามสกุล นักเรียน:</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="เช่น นายชลชาติ สิทธิรักษ์"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">เลขประจำตัว / ชั้นเรียน:</label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="เช่น ม.5/1 เลขที่ 12"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Topic selection */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1.5">
            เลือกโจทย์ปัญหาหรือหัวข้อคิดวิพากษ์:
          </label>
          <select
            value={journalTopic}
            onChange={(e) => setJournalTopic(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-emerald-800 font-semibold focus:outline-none focus:bg-white focus:border-emerald-500"
          >
            {predefinedTopics.map((top, idx) => (
              <option key={idx} value={top}>
                {top}
              </option>
            ))}
          </select>
        </div>

        {/* Question 1: Hypothesis */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[11px]">1</span>
            <span>ข้อคิดเห็น ข้อสมมติฐาน หรือมุมมองของคุณต่อปัญหานี้ (Thesis Statement):</span>
          </label>
          <textarea
            rows={3}
            value={hypothesis}
            onChange={(e) => setHypothesis(e.target.value)}
            placeholder="อธิบายว่าคุณมองปัญหานี้อย่างไร ใครเป็นผู้ได้ประโยชน์ ใครเสียประโยชน์ หรือทำไมปัญหาจึงยังไม่ได้รับการแก้ไข..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500"
          />
        </div>

        {/* Question 2: Geography factors */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center text-[11px]">2</span>
            <span>หลักฐานหรือปัจจัยทางภูมิศาสตร์ที่นำมาสนับสนุน (แอ่งกระทะ, ลมมรสุม, อุณหภูมิผกผัน ฯลฯ):</span>
          </label>
          <textarea
            rows={2}
            value={geoFactors}
            onChange={(e) => setGeoFactors(e.target.value)}
            placeholder="เชื่อมโยงลักษณะภูมิประเทศ สภาพอากาศ หรือการเคลื่อนย้ายมลพิษข้ามแดน..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500"
          />
        </div>

        {/* Question 3: Proposed solutions */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[11px]">3</span>
            <span>ข้อเสนอแนะเชิงโครงสร้างหรือทางออกที่คำนึงถึงความเป็นธรรมทางสังคม:</span>
          </label>
          <textarea
            rows={3}
            value={proposedSolution}
            onChange={(e) => setProposedSolution(e.target.value)}
            placeholder="เสนอทางออกที่แก้ที่ต้นตอ เช่น การตรวจสอบย้อนกลับห่วงโซ่อาหารสัตว์ กฎหมายอากาศสะอาด หรือการขนส่งสาธารณะ..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500"
          />
        </div>

        {/* Action Button: Evaluate with Eco bot */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            เมื่อกรอกเสร็จสิ้น กดปุ่มส่งเพื่อให้ <strong>Eco bot</strong> วิเคราะห์และให้ฟีดแบ็กทันที
          </p>

          <button
            onClick={handleEvaluateWithEcoBot}
            disabled={isEvaluating}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all"
          >
            {isEvaluating ? (
              <>
                <Bot className="w-4 h-4 animate-spin" />
                <span>Eco bot กำลังประเมินการคิดวิพากษ์...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>ส่งให้ Eco bot ตรวจประเมิน & ให้ฟีดแบ็ก</span>
              </>
            )}
          </button>
        </div>

        {/* Evaluation Output Card */}
        {evaluationResult && (
          <div className="bg-emerald-50/60 p-6 rounded-2xl border border-emerald-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>ผลการตรวจประเมินและข้อเสนอแนะจาก Eco bot</span>
            </div>
            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap bg-white p-4 rounded-xl border border-emerald-100 shadow-2xs">
              {evaluationResult}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
