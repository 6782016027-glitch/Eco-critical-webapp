import React, { useState } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { CaseStudiesSection } from './components/CaseStudiesSection';
import { CaseStudyModal } from './components/CaseStudyModal';
import { CurriculumView } from './components/CurriculumView';
import { InversionSimulator } from './components/InversionSimulator';
import { EcoBotChat } from './components/EcoBotChat';
import { CriticalJournal } from './components/CriticalJournal';
import { CaseStudy } from './data/caseStudies';
import { Compass } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('cases');
  const [selectedCaseModal, setSelectedCaseModal] = useState<CaseStudy | null>(null);

  // States to pass context when transitioning to Eco bot
  const [botInitialPrompt, setBotInitialPrompt] = useState<string>('');
  const [botInitialCaseStudy, setBotInitialCaseStudy] = useState<CaseStudy | null>(null);

  const handleConsultEcoBotFromCase = (caseStudy: CaseStudy) => {
    setBotInitialCaseStudy(caseStudy);
    setBotInitialPrompt(`ช่วยชวนผมคิดวิพากษ์กรณีศึกษา "${caseStudy.titleTh}" หน่อยครับ โดยเฉพาะประเด็น: "${caseStudy.criticalQuestions[0]}"`);
    setActiveTab('ecobot');
  };

  const handleDiscussTopicFromCurriculum = (topicTitle: string, question: string) => {
    setBotInitialPrompt(`ในวิชาภูมิศาสตร์สิ่งแวดล้อม เรื่อง "${topicTitle}" ผมอยากคิดวิพากษ์คำถามนี้ครับ: "${question}"`);
    setActiveTab('ecobot');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-emerald-50/30 to-sky-50/40 text-slate-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'cases' && (
          <CaseStudiesSection
            onSelectCaseStudy={(caseStudy) => setSelectedCaseModal(caseStudy)}
            onConsultEcoBot={handleConsultEcoBotFromCase}
          />
        )}

        {activeTab === 'curriculum' && (
          <CurriculumView
            onDiscussWithEcoBot={handleDiscussTopicFromCurriculum}
          />
        )}

        {activeTab === 'simulator' && (
          <InversionSimulator />
        )}

        {activeTab === 'ecobot' && (
          <EcoBotChat
            initialPrompt={botInitialPrompt}
            initialCaseStudy={botInitialCaseStudy}
          />
        )}

        {activeTab === 'journal' && (
          <CriticalJournal />
        )}
      </main>

      {/* Case Study Detail Modal */}
      <CaseStudyModal
        caseStudy={selectedCaseModal}
        onClose={() => setSelectedCaseModal(null)}
        onConsultEcoBot={handleConsultEcoBotFromCase}
      />

      {/* Educational Footer - Clean & soothing */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white/80 py-8 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span className="font-extrabold text-slate-800 text-sm">
                Eco-critical
              </span>
              <span className="text-[11px] text-slate-500">
                • ห้องเรียนภูมิศาสตร์สิ่งแวดล้อมเพื่อการคิดวิพากษ์ & AI ส่องวิพากษ์ Eco bot
              </span>
            </div>
            <p className="text-slate-400">
              แหล่งรวบรวมสื่อกรณีศึกษามลพิษทางอากาศ PM2.5 ในอดีตและปัจจุบันเพื่อการเรียนรู้
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-600">
            <button
              onClick={() => setActiveTab('cases')}
              className="hover:text-emerald-700 transition-colors"
            >
              คลังกรณีศึกษา
            </button>
            <button
              onClick={() => setActiveTab('curriculum')}
              className="hover:text-emerald-700 transition-colors"
            >
              บทเรียนภูมิศาสตร์
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className="hover:text-emerald-700 transition-colors"
            >
              แล็บจำลองกายภาพ
            </button>
            <button
              onClick={() => setActiveTab('ecobot')}
              className="hover:text-emerald-700 transition-colors"
            >
              สนทนากับ Eco bot
            </button>
            <button
              onClick={() => setActiveTab('journal')}
              className="hover:text-emerald-700 transition-colors"
            >
              ใบงานคิดวิพากษ์
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
