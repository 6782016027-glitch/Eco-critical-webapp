/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { ClassroomHome } from './ClassroomHome';
import { LessonCatalog } from './LessonCatalog';
import { LessonDetailView } from './LessonDetailView';
import { WorksheetAndLogbook } from './WorksheetAndLogbook';
import { LiveDiscussionSchedule } from './LiveDiscussionSchedule';
import { DiscussionEtiquetteModal } from './DiscussionEtiquetteModal';
import { DiscussionBoard } from './DiscussionBoard';
import { CaseStudiesSection } from '../CaseStudiesSection';
import { CaseStudyModal } from '../CaseStudyModal';
import { InversionSimulator } from '../InversionSimulator';
import { EcoBotChat } from '../EcoBotChat';
import { CriticalJournal } from '../CriticalJournal';
import { Lesson } from '../../types/portal';
import { CaseStudy } from '../../data/caseStudies';
import ecoLogoImg from '../../assets/images/ecocritical_logo_1794300369798.jpg';
import {
  GraduationCap,
  BookOpen,
  FileText,
  Calendar,
  MapPin,
  MessageSquare,
  Bot,
  SlidersHorizontal,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Compass,
  ChevronRight,
} from 'lucide-react';

export type StudentTab =
  | 'home'
  | 'lessons'
  | 'worksheets'
  | 'schedule'
  | 'cases'
  | 'forum'
  | 'ecobot'
  | 'simulator';

export const StudentPortalLayout: React.FC = () => {
  const { currentUser, logout, lessons } = usePortal();

  const [activeTab, setActiveTab] = useState<StudentTab>('home');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedCaseModal, setSelectedCaseModal] = useState<CaseStudy | null>(null);
  const [showEtiquetteModal, setShowEtiquetteModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // States to pass context when transitioning to Eco bot
  const [botInitialPrompt, setBotInitialPrompt] = useState<string>('');
  const [botInitialCaseStudy, setBotInitialCaseStudy] = useState<CaseStudy | null>(null);

  const handleConsultEcoBotFromCase = (caseStudy: CaseStudy) => {
    setBotInitialCaseStudy(caseStudy);
    setBotInitialPrompt(
      `ช่วยชวนผมคิดวิพากษ์กรณีศึกษา "${caseStudy.titleTh}" หน่อยครับ โดยเฉพาะประเด็น: "${caseStudy.criticalQuestions[0]}"`
    );
    setActiveTab('ecobot');
  };

  const navMenuItems = [
    {
      id: 'home',
      label: 'หน้าหลักห้องเรียน',
      icon: GraduationCap,
      badge: 'Hub',
    },
    {
      id: 'lessons',
      label: 'บทเรียน & ควิซ',
      icon: BookOpen,
      badge: `${lessons.length} บท`,
    },
    {
      id: 'worksheets',
      label: 'ใบงาน & สมุดอนุทิน',
      icon: FileText,
      badge: '4 มิติ',
    },
    {
      id: 'schedule',
      label: 'นัดหมายอภิปรายสด',
      icon: Calendar,
      badge: 'สด',
    },
    {
      id: 'cases',
      label: 'กรณีศึกษา & แผนที่',
      icon: MapPin,
      badge: 'ทั่วโลก',
    },
    {
      id: 'forum',
      label: 'เว็บบอร์ดร่วมอภิปราย',
      icon: MessageSquare,
      badge: 'แลกเปลี่ยน',
    },
    {
      id: 'ecobot',
      label: 'Eco bot สืบค้นอัจฉริยะ',
      icon: Bot,
      badge: 'AI',
    },
    {
      id: 'simulator',
      label: 'แล็บผกผันอุณหภูมิ',
      icon: SlidersHorizontal,
      badge: 'แล็บเสมือน',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-teal-50/30 to-sky-50/40 text-slate-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* ======================================================== */}
      {/* 1. TOP NAVBAR (STUDENT VIEW ONLY)                        */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          {/* Brand & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
              aria-label="Toggle Sidebar Menu"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div
              onClick={() => {
                setActiveTab('home');
                setSelectedLesson(null);
              }}
              className="flex items-center gap-2.5 cursor-pointer group shrink-0"
            >
              <img
                src={ecoLogoImg}
                alt="Eco-critical Logo"
                className="w-10 h-10 rounded-2xl object-cover shadow-2xs group-hover:scale-105 transition-transform border border-emerald-200"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-700 via-teal-700 to-sky-700 bg-clip-text text-transparent">
                    Eco-critical
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    นักเรียน ม.ปลาย
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  ห้องเรียนภูมิศาสตร์สิ่งแวดล้อมเพื่อการคิดวิพากษ์ (Student Portal)
                </p>
              </div>
            </div>
          </div>

          {/* Right Area: Student Etiquette Modal Button, Student Profile & Logout */}
          <div className="flex items-center gap-2.5">
            {/* กฎกติกามารยาท: Moved strictly to Student View */}
            <button
              onClick={() => setShowEtiquetteModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/90 text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-2xs hover:shadow-xs"
              title="อ่านกฎกติกาและมารยาทการอภิปราย"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">กฎกติกามารยาท</span>
            </button>

            {/* Student Info Pill */}
            {currentUser && (
              <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-white border border-emerald-100 text-xs shadow-2xs">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-xs shadow-2xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="font-extrabold text-slate-900 leading-none">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {currentUser.gradeClass || 'มัธยมศึกษาตอนปลาย'}
                    {currentUser.studentId && ` · ${currentUser.studentId}`}
                  </div>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200/90 hover:border-rose-200 text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xs hover:shadow-xs cursor-pointer"
              title="ออกจากระบบ"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. BODY LAYOUT: SIDEBAR + MAIN CONTENT AREA              */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex px-4 sm:px-6 py-6 gap-6 relative">
        {/* SIDEBAR NAVIGATION (Desktop & Mobile Drawer) */}
        <aside
          className={`fixed lg:sticky top-16 lg:top-20 z-30 lg:z-10 w-68 shrink-0 transition-transform duration-300 lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-emerald-200/80 p-3.5 shadow-sm space-y-2">
            <div className="px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>เมนูห้องเรียนนักเรียน</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <nav className="space-y-1.5">
              {navMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as StudentTab);
                      if (item.id !== 'lessons') {
                        setSelectedLesson(null);
                      }
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer group ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-700/25 ring-2 ring-emerald-500/30 scale-[1.01]'
                        : 'text-slate-600 hover:text-emerald-950 hover:bg-gradient-to-r hover:from-emerald-50/90 hover:to-teal-50/70 hover:scale-[1.02] active:scale-[0.98] border border-transparent hover:border-emerald-200/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-2xs ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100 group-hover:text-emerald-900'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-1">
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse shrink-0" />
                      )}
                      {item.badge && (
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full transition-colors ${
                            isActive
                              ? 'bg-white/25 text-white backdrop-blur-xs shadow-2xs'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 group-hover:bg-emerald-100'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}

              {/* กฎกติกามารยาท in Sidebar: Exclusively for Students */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setShowEtiquetteModal(true);
                    setIsSidebarOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold text-teal-800 bg-teal-50/80 hover:bg-teal-100 hover:scale-[1.02] active:scale-[0.98] border border-teal-200/80 transition-all duration-200 cursor-pointer shadow-2xs group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 group-hover:bg-teal-200">
                      <ShieldCheck className="w-4 h-4 text-teal-700" />
                    </div>
                    <span>กฎกติกามารยาท</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-teal-600 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Backdrop for Mobile Sidebar */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs z-20 lg:hidden"
          />
        )}

        {/* MAIN CONTENT VIEW AREA */}
        <main className="flex-1 min-w-0">
          {/* 1. Classroom Homepage & Dashboard */}
          {activeTab === 'home' && (
            <ClassroomHome
              onNavigateTab={(tab) => {
                setActiveTab(tab as StudentTab);
                if (tab !== 'lessons') {
                  setSelectedLesson(null);
                }
              }}
              onOpenLesson={(lessonId) => {
                const found = lessons.find((l) => l.id === lessonId);
                if (found) {
                  setSelectedLesson(found);
                  setActiveTab('lessons');
                }
              }}
            />
          )}

          {/* 2. Lessons & Quizzes */}
          {activeTab === 'lessons' && (
            selectedLesson ? (
              <LessonDetailView
                lesson={selectedLesson}
                onBack={() => setSelectedLesson(null)}
                onConsultEcoAi={(prompt) => {
                  setBotInitialPrompt(prompt);
                  setActiveTab('ecobot');
                }}
              />
            ) : (
              <LessonCatalog
                onSelectLesson={(lesson) => setSelectedLesson(lesson)}
              />
            )
          )}

          {/* 3. Worksheets & Digital Logbook */}
          {activeTab === 'worksheets' && <WorksheetAndLogbook />}

          {/* 4. Live Discussion Schedule */}
          {activeTab === 'schedule' && (
            <LiveDiscussionSchedule
              onOpenEtiquetteModal={() => setShowEtiquetteModal(true)}
            />
          )}

          {/* 5. Case Studies & Map */}
          {activeTab === 'cases' && (
            <CaseStudiesSection
              onSelectCaseStudy={(caseStudy) => setSelectedCaseModal(caseStudy)}
              onConsultEcoBot={handleConsultEcoBotFromCase}
            />
          )}

          {/* 6. Discussion Forum */}
          {activeTab === 'forum' && <DiscussionBoard />}

          {/* 7. Eco bot AI Chat */}
          {activeTab === 'ecobot' && (
            <EcoBotChat
              initialPrompt={botInitialPrompt}
              initialCaseStudy={botInitialCaseStudy}
            />
          )}

          {/* 8. Simulator Lab */}
          {activeTab === 'simulator' && (
            <div className="space-y-8">
              <InversionSimulator />
              <CriticalJournal />
            </div>
          )}
        </main>
      </div>

      {/* Case Study Detail Modal */}
      <CaseStudyModal
        caseStudy={selectedCaseModal}
        onClose={() => setSelectedCaseModal(null)}
        onConsultEcoBot={handleConsultEcoBotFromCase}
      />

      {/* Discussion Etiquette Modal (Exclusively rendered in Student View) */}
      <DiscussionEtiquetteModal
        isOpen={showEtiquetteModal}
        onClose={() => setShowEtiquetteModal(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white/90 py-5 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span className="font-extrabold text-slate-800">Eco-critical</span>
            <span className="text-[11px] text-slate-500">
              • นวัตกรรมห้องเรียนภูมิศาสตร์สิ่งแวดล้อมเพื่อการคิดวิพากษ์ (ม.ปลาย)
            </span>
          </div>
          <p className="text-slate-400 text-xs">
            ศึกษาและตรวจสอบข้อเท็จจริงด้านมลพิษทางอากาศ PM2.5 ด้วยภูมิสารสนเทศและกระบวนการคิดวิพากษ์ทางภูมิศาสตร์
          </p>
        </div>
      </footer>
    </div>
  );
};
