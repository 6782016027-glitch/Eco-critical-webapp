import React, { useState } from 'react';
import { CURRICULUM_UNITS } from '../data/curriculum';
import { BookOpen, ChevronDown, ChevronRight, HelpCircle, Bot, Lightbulb, Compass, Users, Globe, CloudSun } from 'lucide-react';

interface CurriculumViewProps {
  onDiscussWithEcoBot: (topicTitle: string, question: string) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({ onDiscussWithEcoBot }) => {
  const [activeUnitId, setActiveUnitId] = useState<string>(CURRICULUM_UNITS[0].id);
  const [expandedTopicId, setExpandedTopicId] = useState<string>(CURRICULUM_UNITS[0].topics[0].id);

  const activeUnit = CURRICULUM_UNITS.find((u) => u.id === activeUnitId) || CURRICULUM_UNITS[0];

  const getUnitIcon = (iconName: string) => {
    switch (iconName) {
      case 'CloudSun': return <CloudSun className="w-5 h-5 text-emerald-600" />;
      case 'Users': return <Users className="w-5 h-5 text-sky-600" />;
      case 'Globe': return <Globe className="w-5 h-5 text-teal-600" />;
      case 'Compass': return <Compass className="w-5 h-5 text-cyan-600" />;
      default: return <BookOpen className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Curriculum Banner - Soft Green & Sky */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-semibold border border-white/30">
            <BookOpen className="w-3.5 h-3.5 text-yellow-200" />
            <span>โครงสร้างรายวิชาภูมิศาสตร์สิ่งแวดล้อม (Geography Syllabus)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            บทเรียนการคิดวิพากษ์เรื่องมลพิษทางอากาศ & PM2.5
          </h2>
          <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed font-normal">
            ผสานการเรียนรู้ 4 มิติทางภูมิศาสตร์: กายภาพบรรยากาศ, นิเวศวิทยาการเมืองและเกษตรพันธสัญญา, ภูมิรัฐศาสตร์ข้ามพรมแดน, และเทคโนโลยีภูมิสารสนเทศ (GIS/Remote Sensing) เพื่อสร้างความเข้าใจรอบด้าน
          </p>
        </div>
      </div>

      {/* Unit Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {CURRICULUM_UNITS.map((unit) => (
          <button
            key={unit.id}
            onClick={() => {
              setActiveUnitId(unit.id);
              setExpandedTopicId(unit.topics[0]?.id || '');
            }}
            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
              activeUnitId === unit.id
                ? 'bg-emerald-50 border-emerald-400 shadow-xs ring-1 ring-emerald-400'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200">
                {getUnitIcon(unit.icon)}
              </span>
              <span className="text-[11px] font-mono text-emerald-700 font-bold">
                หน่วยที่ {unit.unitNumber}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-2">
                {unit.titleTh}
              </h3>
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                {unit.titleEn}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Active Unit Topics Container */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              หน่วยที่ {activeUnit.unitNumber}
            </span>
            <h3 className="text-xl font-extrabold text-slate-900">
              {activeUnit.titleTh}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            {activeUnit.descriptionTh}
          </p>
        </div>

        {/* Topics Accordion List */}
        <div className="space-y-4">
          {activeUnit.topics.map((topic, idx) => {
            const isExpanded = expandedTopicId === topic.id;
            return (
              <div
                key={topic.id}
                className="bg-slate-50/70 border border-slate-200 rounded-2xl overflow-hidden transition-all"
              >
                {/* Topic Header */}
                <div
                  onClick={() => setExpandedTopicId(isExpanded ? '' : topic.id)}
                  className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-100/70 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {activeUnit.unitNumber}.{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-800">
                        {topic.titleTh}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {topic.summaryTh}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:inline-block text-[11px] text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200">
                      {topic.concepts.length} มโนทัศน์
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Topic Details */}
                {isExpanded && (
                  <div className="p-5 pt-0 border-t border-slate-200 space-y-4 bg-white">
                    {/* Critical question prompt box */}
                    <div className="bg-gradient-to-r from-emerald-50/80 to-sky-50/80 p-4 rounded-2xl border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4">
                      <div className="flex items-start gap-2.5">
                        <HelpCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[11px] font-bold text-emerald-800 block uppercase">
                            คำถามนำการคิดวิพากษ์ (Critical Inquiry Question):
                          </span>
                          <p className="text-xs sm:text-sm font-semibold text-slate-800">
                            "{topic.keyQuestion}"
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => onDiscussWithEcoBot(topic.titleTh, topic.keyQuestion)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold whitespace-nowrap transition-colors shadow-2xs shrink-0"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>สนทนากับ Eco bot</span>
                      </button>
                    </div>

                    {/* Geography Core Insight */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
                      <span className="font-bold text-emerald-800 flex items-center gap-1.5 text-xs">
                        <Lightbulb className="w-4 h-4 text-emerald-600" />
                        แก่นความรู้ทางภูมิศาสตร์ (Core Geographic Mechanism):
                      </span>
                      <p className="leading-relaxed text-slate-600">
                        {topic.geographyCore}
                      </p>
                    </div>

                    {/* Concepts pills */}
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                        มโนทัศน์สำคัญ (Key Concepts):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {topic.concepts.map((concept, cIdx) => (
                          <span
                            key={cIdx}
                            className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bullet points */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-slate-500 block">
                        ประเด็นการเรียนรู้เจาะลึก:
                      </span>
                      <ul className="space-y-1.5">
                        {topic.detailedContent.map((point, pIdx) => (
                          <li key={pIdx} className="text-xs text-slate-600 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
