/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PortalProvider, usePortal } from './context/PortalContext';
import { Navbar, ActiveTab } from './components/Navbar';
import { LessonCatalog } from './components/StudentPortal/LessonCatalog';
import { LessonDetailView } from './components/StudentPortal/LessonDetailView';
import { DiscussionBoard } from './components/StudentPortal/DiscussionBoard';
import { TeacherDashboard } from './components/TeacherDashboard/TeacherDashboard';
import { CaseStudiesSection } from './components/CaseStudiesSection';
import { CaseStudyModal } from './components/CaseStudyModal';
import { InversionSimulator } from './components/InversionSimulator';
import { EcoBotChat } from './components/EcoBotChat';
import { CriticalJournal } from './components/CriticalJournal';
import { AuthModal } from './components/AuthModal';
import { Lesson } from './types/portal';
import { CaseStudy } from './data/caseStudies';
import { Compass, Shield, UserCheck, BookOpen, Bot, Award, MessageSquare, GraduationCap } from 'lucide-react';
import { ClassroomHome } from './components/StudentPortal/ClassroomHome';
import { WorksheetAndLogbook } from './components/StudentPortal/WorksheetAndLogbook';
import { LiveDiscussionSchedule } from './components/StudentPortal/LiveDiscussionSchedule';
import { DiscussionEtiquetteModal } from './components/StudentPortal/DiscussionEtiquetteModal';

function AppContent() {
  const { currentUser, quickSwitchUser, lessons } = usePortal();

  // If user is admin/teacher, default to 'teacher_dashboard'
  // If user is student, default to 'home'
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    if (currentUser?.role === 'admin' || currentUser?.role === 'teacher') {
      return 'teacher_dashboard';
    }
    return 'home';
  });

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedCaseModal, setSelectedCaseModal] = useState<CaseStudy | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showEtiquetteModal, setShowEtiquetteModal] = useState(false);

  // States to pass context when transitioning to Eco bot
  const [botInitialPrompt, setBotInitialPrompt] = useState<string>('');
  const [botInitialCaseStudy, setBotInitialCaseStudy] = useState<CaseStudy | null>(null);

  // Sync tab with user role whenever currentUser changes
  React.useEffect(() => {
    if (!currentUser) {
      setActiveTab('home');
      setSelectedLesson(null);
    } else if (currentUser.role === 'admin' || currentUser.role === 'teacher') {
      // Direct Admin & Teacher to their dashboard upon login
      setActiveTab((prev) => (prev === 'home' ? 'teacher_dashboard' : prev));
    } else if (currentUser.role === 'student') {
      // Strictly prevent student from accessing teacher_dashboard
      setActiveTab((prev) => (prev === 'teacher_dashboard' ? 'home' : prev));
    }
  }, [currentUser]);

  const handleConsultEcoBotFromCase = (caseStudy: CaseStudy) => {
    setBotInitialCaseStudy(caseStudy);
    setBotInitialPrompt(
      `ช่วยชวนผมคิดวิพากษ์กรณีศึกษา "${caseStudy.titleTh}" หน่อยครับ โดยเฉพาะประเด็น: "${caseStudy.criticalQuestions[0]}"`
    );
    setActiveTab('ecobot');
  };

  const isTeacherOrAdmin = currentUser?.role === 'admin' || currentUser?.role === 'teacher';

  // ========================================================
  // 1. ACCESS CONTROL ENFORCEMENT:
  // If user is NOT logged in, lock all content and display
  // the Classroom Landing Page (Root Index /) for login/register!
  // ========================================================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-sky-50/40 to-white text-slate-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
        <Navbar
          activeTab="home"
          setActiveTab={() => {}}
          onOpenAuthModal={() => {}}
          onOpenEtiquetteModal={() => setShowEtiquetteModal(true)}
        />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex items-center justify-center">
          <ClassroomHome
            onNavigateTab={(tab) => {
              setActiveTab(tab);
            }}
            onOpenLesson={() => {}}
          />
        </main>

        <DiscussionEtiquetteModal
          isOpen={showEtiquetteModal}
          onClose={() => setShowEtiquetteModal(false)}
        />

        <footer className="mt-auto border-t border-slate-200/80 bg-white/90 py-6 px-4 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span className="font-extrabold text-slate-800">Eco-critical</span>
              <span className="text-[11px] text-slate-500">
                • นวัตกรรมห้องเรียนภูมิศาสตร์สิ่งแวดล้อมเพื่อการคิดวิพากษ์ (ม.ปลาย)
              </span>
            </div>
            <p className="text-slate-400 text-xs">
              กรุณาเข้าสู่ระบบด้วยบัญชีผู้ดูแลระบบหรือนักเรียนเพื่อเข้าถึงบทเรียนและกิจกรรม
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // ========================================================
  // 2. AUTHENTICATED USER ROUTING:
  // Separate display for Admin/Teacher vs Student
  // ========================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-sky-50/40 to-white text-slate-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navbar with Portal navigation & User auth */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          // Guard: students cannot access teacher_dashboard
          if (tab === 'teacher_dashboard' && currentUser.role === 'student') {
            return;
          }
          setActiveTab(tab);
          if (tab !== 'lessons') {
            setSelectedLesson(null);
          }
        }}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onOpenEtiquetteModal={() => setShowEtiquetteModal(true)}
      />

      {/* Admin Student-Preview Banner (When admin is browsing student views) */}
      {isTeacherOrAdmin && activeTab !== 'teacher_dashboard' && (
        <div className="bg-purple-900 text-purple-100 px-4 py-2 text-xs border-b border-purple-800 shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>👀 กำลังจำลองมุมมองห้องเรียนนักเรียน (Student View Preview): คุณกำลังดูเนื้อหาบทเรียนและกิจกรรมในมุมมองของนักเรียน</span>
            </span>
            <button
              onClick={() => setActiveTab('teacher_dashboard')}
              className="px-3 py-1 bg-white hover:bg-purple-50 text-purple-950 font-extrabold rounded-lg text-[11px] shadow-2xs transition-colors shrink-0 cursor-pointer"
            >
              กลับสู่แดชบอร์ดจัดการระบบ (Admin Dashboard)
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        {/* ================= ADMIN VIEW ================= */}
        {activeTab === 'teacher_dashboard' && isTeacherOrAdmin && (
          <TeacherDashboard
            onNavigateToStudentView={() => setActiveTab('home')}
          />
        )}

        {/* ================= STUDENT VIEWS ================= */}
        {/* 0. STUDENT CLASSROOM HUB */}
        {activeTab === 'home' && (
          <ClassroomHome
            onNavigateTab={(tab) => {
              if (tab === 'teacher_dashboard' && !isTeacherOrAdmin) return;
              setActiveTab(tab);
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

        {/* 1. LESSONS & QUIZZES */}
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

        {/* 2. WORKSHEETS & CRITICAL THINKING DIGITAL LOGBOOK */}
        {activeTab === 'worksheets' && <WorksheetAndLogbook />}

        {/* 3. LIVE DISCUSSION SCHEDULE & SOCRATIC SEMINAR */}
        {activeTab === 'schedule' && (
          <LiveDiscussionSchedule
            onOpenEtiquetteModal={() => setShowEtiquetteModal(true)}
          />
        )}

        {/* 4. HISTORICAL CASE STUDIES & CARTOGRAPHIC MAP */}
        {activeTab === 'cases' && (
          <CaseStudiesSection
            onSelectCaseStudy={(caseStudy) => setSelectedCaseModal(caseStudy)}
            onConsultEcoBot={handleConsultEcoBotFromCase}
          />
        )}

        {/* 5. DISCUSSION FORUM */}
        {activeTab === 'forum' && <DiscussionBoard />}

        {/* 6. ECO BOT CHAT (Socratic Dialogue & Critical Inquiry) */}
        {activeTab === 'ecobot' && (
          <EcoBotChat
            initialPrompt={botInitialPrompt}
            initialCaseStudy={botInitialCaseStudy}
          />
        )}

        {/* 7. INVERSION SIMULATOR & CRITICAL JOURNAL */}
        {activeTab === 'simulator' && (
          <div className="space-y-8">
            <InversionSimulator />
            <CriticalJournal />
          </div>
        )}
      </main>

      {/* Case Study Detail Modal */}
      <CaseStudyModal
        caseStudy={selectedCaseModal}
        onClose={() => setSelectedCaseModal(null)}
        onConsultEcoBot={handleConsultEcoBotFromCase}
      />

      {/* Discussion Etiquette & Code of Conduct Modal */}
      <DiscussionEtiquetteModal
        isOpen={showEtiquetteModal}
        onClose={() => setShowEtiquetteModal(false)}
      />

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Educational Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white/90 py-8 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span className="font-extrabold text-slate-800 text-sm">Eco-critical</span>
              <span className="text-[11px] text-slate-500">
                • นวัตกรรมห้องเรียนภูมิศาสตร์สิ่งแวดล้อมเพื่อการคิดวิพากษ์ & Eco bot สืบค้น
              </span>
            </div>
            <p className="text-slate-400">
              ระบบบทเรียน ควิซ ใบงาน สมุดอนุทิน เว็บบอร์ด และสัมมนาสดเพื่อการศึกษาด้านมลพิษทางอากาศ PM2.5 (ม.ปลาย)
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-600 text-xs">
            {isTeacherOrAdmin ? (
              <>
                <button
                  onClick={() => setActiveTab('teacher_dashboard')}
                  className="hover:text-purple-700 font-bold transition-colors flex items-center gap-1 text-purple-700"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>แดชบอร์ดจัดการระบบ (Admin Dashboard)</span>
                </button>
                <button
                  onClick={() => setActiveTab('home')}
                  className="hover:text-emerald-700 font-medium transition-colors"
                >
                  ดูตัวอย่างห้องเรียนนักเรียน (Student View)
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setActiveTab('home');
                    setSelectedLesson(null);
                  }}
                  className="hover:text-emerald-700 transition-colors"
                >
                  ห้องเรียนของฉัน
                </button>
                <button
                  onClick={() => {
                    setActiveTab('lessons');
                    setSelectedLesson(null);
                  }}
                  className="hover:text-emerald-700 transition-colors"
                >
                  บทเรียน & ควิซ
                </button>
                <button
                  onClick={() => setActiveTab('worksheets')}
                  className="hover:text-emerald-700 transition-colors"
                >
                  ใบงาน & สมุดบันทึก
                </button>
                <button
                  onClick={() => setActiveTab('schedule')}
                  className="hover:text-emerald-700 transition-colors"
                >
                  นัดหมายอภิปรายสด
                </button>
                <button
                  onClick={() => setActiveTab('cases')}
                  className="hover:text-emerald-700 transition-colors"
                >
                  กรณีศึกษา & แผนที่
                </button>
                <button
                  onClick={() => setActiveTab('forum')}
                  className="hover:text-emerald-700 transition-colors"
                >
                  เว็บบอร์ด ม.ปลาย
                </button>
                <button
                  onClick={() => setActiveTab('ecobot')}
                  className="hover:text-emerald-700 transition-colors"
                >
                  Eco bot สืบค้น
                </button>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <PortalProvider>
      <AppContent />
    </PortalProvider>
  );
}
