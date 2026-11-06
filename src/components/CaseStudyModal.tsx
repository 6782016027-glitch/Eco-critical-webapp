import React, { useState, useRef, useEffect } from 'react';
import { CaseStudy } from '../data/caseStudies';
import { X, Calendar, MapPin, Wind, Mountain, AlertTriangle, Scale, Bot, Lightbulb, CheckCircle2, ChevronRight, Compass, BookOpenCheck } from 'lucide-react';

interface CaseStudyModalProps {
  caseStudy: CaseStudy | null;
  onClose: () => void;
  onConsultEcoBot: (caseStudy: CaseStudy) => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  caseStudy,
  onClose,
  onConsultEcoBot,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'geography' | 'causes' | 'critical' | 'lessons'>('overview');
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Reset scroll and recalculate reading progress when changing tab or case study
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
      const { scrollHeight, clientHeight } = contentRef.current;
      if (scrollHeight <= clientHeight + 10) {
        setReadingProgress(100);
      } else {
        setReadingProgress(0);
      }
    }
  }, [activeTab, caseStudy]);

  const handleContentScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll > 0) {
      const percentage = Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
      setReadingProgress(percentage);
    } else {
      setReadingProgress(100);
    }
  };

  if (!caseStudy) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pinned Reading Progress Bar at the very top of the modal */}
        <div 
          className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100 z-30 overflow-hidden"
          title={`ความคืบหน้าการอ่าน: ${Math.round(readingProgress)}%`}
        >
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 transition-all duration-150 ease-out"
            style={{ width: `${readingProgress}%` }}
          />
        </div>
        {/* Header Banner - Soft emerald & sky breeze */}
        <div className="relative bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 p-6 border-b border-emerald-100">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {caseStudy.typeLabelTh}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-600 bg-white/80 px-2.5 py-0.5 rounded-full border border-slate-200">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  {caseStudy.location}, {caseStudy.country}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-600 bg-white/80 px-2.5 py-0.5 rounded-full border border-slate-200">
                  <Calendar className="w-3 h-3 text-sky-600" />
                  {caseStudy.period}
                </span>
                {caseStudy.isOngoing && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                    วิกฤตต่อเนื่อง / ประจำปี
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {caseStudy.titleTh}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 italic">
                {caseStudy.titleEn}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl bg-white/80 hover:bg-white border border-slate-200 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Pollutants strip */}
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-emerald-200/60">
            <span className="text-xs text-slate-600 font-medium">มลพิษสำคัญ:</span>
            {caseStudy.mainPollutants.map((pollutant, idx) => (
              <span key={idx} className="text-xs px-2.5 py-0.5 bg-white text-slate-700 rounded-md border border-slate-200 shadow-2xs">
                {pollutant}
              </span>
            ))}
            <span className="ml-auto text-xs text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200 font-mono">
              ระดับ: {caseStudy.peakAQIorLevel}
            </span>
          </div>
        </div>

        {/* Modal Navigation Tabs & Reading Progress Indicator */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 px-4 overflow-x-auto gap-3">
          <div className="flex">
            {[
              { id: 'overview', label: 'ภาพรวมเหตุการณ์' },
              { id: 'geography', label: 'ปัจจัยทางภูมิศาสตร์' },
              { id: 'causes', label: 'สาเหตุ & ผลกระทบ' },
              { id: 'critical', label: 'คำถามคิดวิพากษ์' },
              { id: 'lessons', label: 'บทเรียน & การแก้ไข' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Reading Progress Pill Badge */}
          <div 
            className="hidden sm:flex items-center gap-2 shrink-0 py-1 px-3 rounded-full bg-white border border-slate-200 text-xs shadow-2xs font-medium"
            title={`ความคืบหน้าในการอ่านเนื้อหา: ${Math.round(readingProgress)}%`}
          >
            <BookOpenCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-slate-500">อ่านแล้ว:</span>
            <span className="font-bold text-emerald-700 font-mono">
              {Math.round(readingProgress)}%
            </span>
            {readingProgress >= 95 && (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                <span>ครบถ้วน</span>
              </span>
            )}
          </div>
        </div>

        {/* Modal Body with Scroll Tracker */}
        <div 
          ref={contentRef}
          onScroll={handleContentScroll}
          className="p-6 overflow-y-auto space-y-5 text-slate-700 text-sm leading-relaxed flex-1 scroll-smooth"
        >
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Featured Case Study Image */}
              {caseStudy.imageUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs">
                  <div className="relative aspect-video sm:aspect-[21/9] max-h-[320px] w-full overflow-hidden">
                    <img
                      src={caseStudy.imageUrl}
                      alt={caseStudy.titleTh}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {caseStudy.imageCaption && (
                    <div className="p-3 bg-slate-50/80 border-t border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                      <span className="font-bold text-emerald-800 shrink-0">📷 ภาพประกอบกรณีศึกษา:</span>
                      <span className="leading-relaxed">{caseStudy.imageCaption}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100">
                <h4 className="text-base font-bold text-emerald-800 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-emerald-600" />
                  สรุปบริบทและสาระสำคัญ
                </h4>
                <p className="text-slate-700 leading-relaxed">
                  {caseStudy.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-sky-50/40 p-4 rounded-2xl border border-sky-100">
                  <h5 className="font-bold text-sky-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-sky-600" />
                    การตอบสนองเชิงนโยบาย
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {caseStudy.policyResponse}
                  </p>
                </div>

                <div className="bg-teal-50/40 p-4 rounded-2xl border border-teal-100">
                  <h5 className="font-bold text-teal-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-teal-600" />
                    เปรียบเทียบกับบริบทไทย
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {caseStudy.comparativeAnalysis}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'geography' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                💡 <strong>มุมมองนักภูมิศาสตร์:</strong> มลพิษทางอากาศไม่ได้เกิดขึ้นในสุญญากาศ แต่ถูกกำหนดด้วยธรณีสัณฐาน อุณหพลศาสตร์บรรยากาศ และกระแสลมประจำถิ่น
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold mb-2">
                    <Mountain className="w-4 h-4 text-emerald-600" />
                    <span>ลักษณะภูมิประเทศ (Topography)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {caseStudy.geographyFactors.topography}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2 text-sky-700 font-bold mb-2">
                    <Wind className="w-4 h-4 text-sky-600" />
                    <span>สภาพอุตุนิยมวิทยา & อุณหภูมิผกผัน</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {caseStudy.geographyFactors.meteorology}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2 text-teal-700 font-bold mb-2">
                    <Wind className="w-4 h-4 text-teal-600" />
                    <span>กระแสลม & การเคลื่อนย้ายข้ามแดน</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {caseStudy.geographyFactors.windAndTransboundary}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2 text-cyan-700 font-bold mb-2">
                    <Calendar className="w-4 h-4 text-cyan-600" />
                    <span>แบบแผนความเป็นฤดูกาล (Seasonality)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {caseStudy.geographyFactors.seasonalPattern}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'causes' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  สาเหตุที่แท้จริงเชิงโครงสร้าง (Root Causes)
                </h4>
                <ul className="space-y-2">
                  {caseStudy.rootCauses.map((cause, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
                        {idx + 1}
                      </span>
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-rose-50/60 p-3.5 rounded-2xl border border-rose-100">
                  <span className="text-xs font-bold text-rose-800 block mb-1">ผลกระทบต่อสุขภาพ</span>
                  <p className="text-xs text-slate-600 leading-relaxed">{caseStudy.impacts.health}</p>
                </div>

                <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-100">
                  <span className="text-xs font-bold text-amber-800 block mb-1">ผลกระทบต่อสังคม & ความเหลื่อมล้ำ</span>
                  <p className="text-xs text-slate-600 leading-relaxed">{caseStudy.impacts.society}</p>
                </div>

                <div className="bg-sky-50/60 p-3.5 rounded-2xl border border-sky-100">
                  <span className="text-xs font-bold text-sky-800 block mb-1">ผลกระทบต่อเศรษฐกิจ</span>
                  <p className="text-xs text-slate-600 leading-relaxed">{caseStudy.impacts.economy}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'critical' && (
            <div className="space-y-4">
              <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-800">
                🧠 <strong>ชุดคำถามชวนคิดวิพากษ์ (Critical Thinking Questions):</strong> 
                ใช้สำหรับการอภิปรายในชั้นเรียน หรือทดลองตอบแล้วส่งให้ Eco bot ช่วยประเมินความคิดของคุณ
              </div>

              <div className="space-y-3">
                {caseStudy.criticalQuestions.map((q, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-emerald-50/60 to-sky-50/60 p-4 rounded-2xl border border-emerald-200/80">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-2xs">
                        {idx + 1}
                      </div>
                      <div className="space-y-2 flex-1">
                        <p className="text-slate-800 font-semibold text-sm">
                          {q}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'lessons' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-emerald-800 text-sm mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  บทเรียนสำคัญที่โลกและประเทศไทยต้องเรียนรู้
                </h4>
                <ul className="space-y-2.5">
                  {caseStudy.keyLessons.map((lesson, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <ChevronRight className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{lesson}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 text-xs">
                <span className="font-bold text-emerald-900 block mb-1">การนำไปใช้ในการเรียนการสอน:</span>
                <p className="text-slate-600">
                  ครูและนักเรียนสามารถนำกรณีศึกษานี้ไปเทียบเคียงกับปรากฏการณ์ฝุ่น PM2.5 ที่เกิดขึ้นในท้องถิ่นของตนเอง โดยสังเกตว่ามีปัจจัย "แอ่งกระทะ" หรือ "อุณหภูมิผกผัน" ร่วมด้วยหรือไม่
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 transition-colors font-medium"
          >
            ปิดหน้าต่าง
          </button>

          <button
            onClick={() => {
              onConsultEcoBot(caseStudy);
              onClose();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all"
          >
            <Bot className="w-4 h-4" />
            <span>เปิดห้องวิพากษ์กับ Eco bot ในกรณีนี้</span>
          </button>
        </div>
      </div>
    </div>
  );
};
