/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  LogIn,
  UserPlus,
  ArrowRight,
  BookOpen,
  Bot,
  HelpCircle,
  MessageSquare,
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
  Compass,
  GraduationCap,
  AlertCircle,
  LogOut,
  ChevronRight,
  Shield,
  FileText,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import classroomBgImg from '../../assets/images/classroom_bg_1794300175352.jpg';
import ecoLogoImg from '../../assets/images/ecocritical_logo_1794300369798.jpg';

interface ClassroomHomeProps {
  onNavigateTab: (tab: 'home' | 'lessons' | 'cases' | 'forum' | 'simulator' | 'ecobot' | 'teacher_dashboard' | 'worksheets' | 'schedule') => void;
  onOpenLesson: (lessonId: string) => void;
}

export const ClassroomHome: React.FC<ClassroomHomeProps> = ({
  onNavigateTab,
  onOpenLesson,
}) => {
  const {
    currentUser,
    login,
    register,
    logout,
    lessons,
    quizResults,
    forumTopics,
    knowledgeDocs,
    quickSwitchUser,
  } = usePortal();

  // Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regGrade, setRegGrade] = useState('มัธยมศึกษาปีที่ 5');
  const [regRoom, setRegRoom] = useState('ม.5/1');
  const [regStudentId, setRegStudentId] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSuccess(null);

    if (!username.trim() || !password) {
      setLoginError('กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบถ้วน');
      return;
    }

    const res = login(username, password);
    if (res.success) {
      setLoginSuccess(res.message);
      setUsername('');
      setPassword('');
    } else {
      setLoginError(res.message);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(null);

    if (!regName.trim() || !regUsername.trim() || !regPassword) {
      setRegError('กรุณากรอกข้อมูลที่จำเป็น (*) ให้ครบถ้วน');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }

    const res = register({
      name: regName.trim(),
      username: regUsername.trim(),
      password: regPassword,
      studentId: regStudentId.trim() || `STD-${Math.floor(1000 + Math.random() * 9000)}`,
      gradeClass: `${regGrade} (${regRoom})`,
    });

    if (res.success) {
      setRegSuccess(res.message);
      setRegName('');
      setRegUsername('');
      setRegPassword('');
      setRegStudentId('');
    } else {
      setRegError(res.message);
    }
  };

  // If student is logged in, show their student classroom hub
  if (currentUser) {
    const totalLessons = lessons.length;
    const completedQuizzesCount = Object.keys(quizResults).length;
    const averageScore = completedQuizzesCount > 0
      ? Math.round(
          Object.values(quizResults).reduce(
            (acc, curr) => acc + (curr.total > 0 ? (curr.score / curr.total) * 100 : 0),
            0
          ) / completedQuizzesCount
        )
      : 0;

    return (
      <div className="space-y-8 animate-in fade-in duration-200">
        {/* Welcome Banner - Pastel Mint & Sky */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-100/70 via-teal-50 to-sky-100/70 border border-emerald-200/60 p-6 sm:p-8 shadow-xs">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-20 -mb-16 w-48 h-48 bg-sky-200/40 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-xs border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>ห้องเรียนภูมิศาสตร์สิ่งแวดล้อม ม.ปลาย (ม.4 - ม.6)</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                ยินดีต้อนรับสู่ห้องเรียน, <span className="bg-gradient-to-r from-emerald-700 to-sky-700 bg-clip-text text-transparent">{currentUser.name}</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                เข้าสู่ระบบในฐานะ <strong className="text-slate-800">{currentUser.role === 'student' ? 'นักเรียน' : currentUser.role === 'teacher' ? 'Teacher (ครู)' : 'ผู้ดูแลระบบ'}</strong> 
                {currentUser.gradeClass && ` · ${currentUser.gradeClass}`} 
                {currentUser.studentId && ` · รหัสประจำตัว: ${currentUser.studentId}`}
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => onNavigateTab('lessons')}
                className="px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:shadow-md flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>เข้าสู่บทเรียน ม.ปลาย</span>
              </button>
              <button
                onClick={logout}
                className="p-3 rounded-2xl bg-white/90 hover:bg-white text-slate-600 hover:text-rose-600 border border-slate-200/80 transition-colors shadow-2xs"
                title="ออกจากระบบ"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress & Stat Cards - Pastel Palette */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Lessons */}
          <div className="p-5 rounded-2xl bg-white border border-emerald-100 shadow-2xs hover:border-emerald-200 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500">บทเรียน ม.ปลาย</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{totalLessons} บทเรียน</div>
            <p className="text-[11px] text-emerald-700 mt-1 font-medium">ครอบคลุมวิทยาศาสตร์ & นิเวศวิทยา</p>
          </div>

          {/* Card 2: Quizzes */}
          <div className="p-5 rounded-2xl bg-white border border-sky-100 shadow-2xs hover:border-sky-200 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500">แบบทดสอบท้ายบท</span>
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {completedQuizzesCount} / {totalLessons}
            </div>
            <p className="text-[11px] text-sky-700 mt-1 font-medium">
              {completedQuizzesCount > 0 ? `คะแนนเฉลี่ย ${averageScore}%` : 'พร้อมให้ทดสอบเก็บคะแนน'}
            </p>
          </div>

          {/* Card 3: Digital Logbook & Worksheets */}
          <div
            onClick={() => onNavigateTab('worksheets')}
            className="p-5 rounded-2xl bg-white border border-teal-100 shadow-2xs hover:border-teal-200 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500">ใบงาน & สมุดอนุทิน</span>
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">3 ใบงาน & อนุทิน</div>
            <p className="text-[11px] text-teal-700 mt-1 font-medium">บันทึกคิดวิพากษ์ 4 มิติ</p>
          </div>

          {/* Card 4: Forum */}
          <div
            onClick={() => onNavigateTab('forum')}
            className="p-5 rounded-2xl bg-white border border-indigo-100 shadow-2xs hover:border-indigo-200 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500">กระทู้ร่วมอภิปราย</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{forumTopics.length} ประเด็น</div>
            <p className="text-[11px] text-indigo-700 mt-1 font-medium">แลกเปลี่ยนความคิดเห็นกับเพื่อนๆ</p>
          </div>
        </div>

        {/* Learning Hub Action Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>เมนูเข้าเรียนสำหรับนักเรียน ม.ปลาย</span>
            </h2>
            <span className="text-xs text-slate-500">เลือกหัวข้อเพื่อเริ่มเรียนหรือทำกิจกรรม</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Action 1: Lessons */}
            <div
              onClick={() => onNavigateTab('lessons')}
              className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50/80 to-teal-50/50 border border-emerald-200/80 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-800 transition-colors">
                  เนื้อหาบทเรียน ม.ปลาย
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  ศึกษาธรรมชาติของฝุ่น PM2.5, ภูมิประเทศแอ่งกระทะ, เกษตรพันธสัญญา และ พ.ร.บ. อากาศสะอาด
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                <span>เปิดคลังบทเรียน</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Action 2: Worksheets & Logbook */}
            <div
              onClick={() => onNavigateTab('worksheets')}
              className="p-5 rounded-3xl bg-gradient-to-br from-teal-50/80 to-emerald-50/50 border border-teal-200/80 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-teal-800 transition-colors">
                  ใบงาน & สมุดอนุทินสะท้อนคิด
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  บันทึกการคิดวิพากษ์ 4 มิติเกี่ยวกับกรณีศึกษา และทำใบงานกิจกรรมภูมิศาสตร์สิ่งแวดล้อม
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-teal-700 group-hover:translate-x-1 transition-transform">
                <span>เปิดสมุดอนุทิน & ใบงาน</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Action 3: Live Discussion Schedule */}
            <div
              onClick={() => onNavigateTab('schedule')}
              className="p-5 rounded-3xl bg-gradient-to-br from-sky-50/80 to-indigo-50/50 border border-sky-200/80 hover:border-sky-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-sky-800 transition-colors">
                  นัดหมายการอภิปรายสด
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  ปฏิทินตารางเวลาสัมมนาสด Socratic Dialogue ร่วมกับ Teacher (ครู) และเพื่อนร่วมชั้น
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-sky-700 group-hover:translate-x-1 transition-transform">
                <span>ดูตารางนัดหมาย</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Action 4: Eco bot Consultation */}
            <div
              onClick={() => onNavigateTab('ecobot')}
              className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50/80 to-cyan-50/50 border border-emerald-200/80 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-900 transition-colors">
                  ปรึกษา Eco bot คิดวิพากษ์
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  ถาม-ตอบ ชวนคิดวิเคราะห์สาเหตุ กลไกภูมิศาสตร์ และนโยบายแก้ไขปัญหามลพิษอย่างสร้างสรรค์
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-800 group-hover:translate-x-1 transition-transform">
                <span>เริ่มสนทนากับ Eco bot</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Action 5: Cases & Map */}
            <div
              onClick={() => onNavigateTab('cases')}
              className="p-5 rounded-3xl bg-gradient-to-br from-teal-50/80 to-emerald-50/50 border border-teal-200/80 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-teal-800 transition-colors">
                  กรณีศึกษา & แผนที่
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  วิเคราะห์กรณีศึกษาประวัติศาสตร์และปัจจุบัน เช่น มหาหมอกควันลอนดอน 1952, หมอกควัน LA, วิกฤตแม่เมาะ
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-teal-700 group-hover:translate-x-1 transition-transform">
                <span>เปิดแผนที่กรณีศึกษา</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Action 6: Discussion Forum */}
            <div
              onClick={() => onNavigateTab('forum')}
              className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50/80 to-purple-50/50 border border-indigo-200/80 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-800 transition-colors">
                  เว็บบอร์ดอภิปราย ม.ปลาย
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  ตั้งกระทู้ถาม-ตอบ ถกเถียงข้อเสนอนโยบายแก้ปัญหาฝุ่น และแลกเปลี่ยนความคิดเห็นกับเพื่อนๆ
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-indigo-700 group-hover:translate-x-1 transition-transform">
                <span>เข้าสู่เว็บบอร์ด</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Featured Lesson Highlight for High School */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>บทเรียนแนะนำสำหรับชั้นมัธยมศึกษาตอนปลาย</span>
              </h3>
              <p className="text-xs text-slate-500">เลือกบทเรียนที่ต้องการศึกษาเพื่อเปิดเนื้อหาและทำแบบทดสอบ</p>
            </div>
            <button
              onClick={() => onNavigateTab('lessons')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              ดูทั้งหมด ({lessons.length} บท)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lessons.slice(0, 2).map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => {
                  onNavigateTab('lessons');
                  onOpenLesson(lesson.id);
                }}
                className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all cursor-pointer flex gap-4 group"
              >
                <img
                  src={lesson.coverUrl}
                  alt={lesson.title}
                  className="w-24 h-24 object-cover rounded-xl shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {lesson.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{lesson.duration}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {lesson.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {lesson.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // GUEST / NOT LOGGED IN: CLASSROOM ENTRY PAGE
  // Exactly matching user uploaded image:
  // "Eco-Critical AI Chatbot"
  // "เข้าสู่ห้องเรียน"
  // "ใช้บัญชีที่สมัครไว้เพื่อเรียนต่อและติดตามความก้าวหน้า"
  // ==========================================
  return (
    <div
      className="relative min-h-[82vh] -mx-4 -my-6 sm:-mx-6 sm:-my-8 px-4 py-10 sm:py-14 flex items-center justify-center bg-cover bg-center rounded-3xl overflow-hidden shadow-sm"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.48), rgba(6, 78, 59, 0.55)), url(${classroomBgImg})`,
      }}
    >
      {/* Soft ambient glass tint */}
      <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-[2px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Main Classroom Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-white/70 shadow-2xl shadow-slate-900/20 p-6 sm:p-10 space-y-6">
          {/* Logo & Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={ecoLogoImg}
                alt="Eco-critical Logo"
                className="w-12 h-12 rounded-2xl object-cover shadow-sm border border-emerald-200"
              />
              <div>
                <div className="text-[#155e3b] font-extrabold text-xs sm:text-sm tracking-wide">
                  Eco-Critical Eco bot
                </div>
                <div className="text-[11px] text-slate-500 font-semibold">
                  ห้องเรียนภูมิศาสตร์สิ่งแวดล้อมเพื่อการคิดวิพากษ์ (ม.ปลาย)
                </div>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {authMode === 'login' ? 'เข้าสู่ห้องเรียน' : 'สมัครเข้าเรียน (ม.ปลาย)'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {authMode === 'login'
                ? 'ใช้บัญชีที่สมัครไว้เพื่อเรียนต่อและติดตามความก้าวหน้า'
                : 'กรอกข้อมูลนักเรียนเพื่อสร้างบัญชีเรียนต่อ (รอครูอนุมัติสิทธิ์)'}
            </p>
          </div>

          {/* Feedback Alerts */}
          {loginError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          {loginSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{loginSuccess}</span>
            </div>
          )}

          {regError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{regError}</span>
            </div>
          )}

          {regSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">สมัครสำเร็จ!</div>
                <div>{regSuccess}</div>
              </div>
            </div>
          )}

          {authMode === 'login' ? (
            /* ================= LOGIN FORM (EXACT MATCH) ================= */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Field: Username */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-slate-800">
                  ชื่อผู้ใช้
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="กรอกชื่อผู้ใช้ของคุณ"
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 transition-all font-sans text-slate-800"
                />
              </div>

              {/* Field: Password */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-slate-800">
                  รหัสผ่าน
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่าน"
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 transition-all font-sans text-slate-800"
                />
              </div>

              {/* Submit Button (Matching deep green with arrow) */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-[#14532d] hover:bg-[#166534] active:bg-[#0f3d21] text-white font-bold text-sm sm:text-base shadow-sm transition-all hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                <span>เข้าสู่ระบบ</span>
              </button>

              {/* Registration and Help Links */}
              <div className="pt-2 space-y-3 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <span>ยังไม่มีบัญชี?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setLoginError(null);
                      setRegSuccess(null);
                    }}
                    className="text-[#14532d] font-bold hover:underline cursor-pointer"
                  >
                    สมัครเข้าเรียน
                  </button>
                </div>

                <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                  ลืมรหัสผ่าน? ติดต่อครูหรือผู้ดูแลเพื่อรับรหัสชั่วคราว หรือเปลี่ยนรหัสผ่านได้ในระบบเมื่อเข้าใช้งานทั่วไป
                </p>
              </div>
            </form>
          ) : (
            /* ================= HIGH SCHOOL REGISTRATION FORM ================= */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-slate-800">
                  ชื่อ-นามสกุล นักเรียน *
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="เช่น นายธนกร กาญจนะ"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-slate-800">
                    ระดับชั้น (ม.ปลาย) *
                  </label>
                  <select
                    value={regGrade}
                    onChange={(e) => setRegGrade(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 bg-white text-slate-800 font-medium"
                  >
                    <option value="มัธยมศึกษาปีที่ 4">มัธยมศึกษาปีที่ 4 (ม.4)</option>
                    <option value="มัธยมศึกษาปีที่ 5">มัธยมศึกษาปีที่ 5 (ม.5)</option>
                    <option value="มัธยมศึกษาปีที่ 6">มัธยมศึกษาปีที่ 6 (ม.6)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-slate-800">
                    ห้องเรียน
                  </label>
                  <input
                    type="text"
                    value={regRoom}
                    onChange={(e) => setRegRoom(e.target.value)}
                    placeholder="เช่น ม.5/2"
                    className="w-full px-3 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-slate-800">
                  รหัสประจำตัวนักเรียน
                </label>
                <input
                  type="text"
                  value={regStudentId}
                  onChange={(e) => setRegStudentId(e.target.value)}
                  placeholder="เช่น STD-6735"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 font-mono text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-slate-800">
                  ตั้งชื่อผู้ใช้ (Username) *
                </label>
                <input
                  type="text"
                  required
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="เช่น thanakorn_std"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 font-mono text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-slate-800">
                  ตั้งรหัสผ่าน (Password) *
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 text-slate-800"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed">
                <strong>ระบบคัดกรอง:</strong> หลังลงทะเบียน บัญชีจะอยู่ในสถานะ "รออนุมัติ" โดย Teacher (ครู) จะเป็นผู้อนุมัติเพื่อความปลอดภัยของห้องเรียน
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-[#14532d] hover:bg-[#166534] text-white font-bold text-sm shadow-sm transition-all hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>ยืนยันการสมัครเข้าเรียน</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setRegError(null);
                  }}
                  className="text-xs font-bold text-[#14532d] hover:underline"
                >
                  มีบัญชีอยู่แล้ว? กลับไปเข้าสู่ระบบ
                </button>
              </div>
            </form>
          )}

          {/* Quick Demo Switcher Strip for Evaluators (Without showing password) */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2 tracking-wider">
              บัญชีทดสอบด่วนในระบบ:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => quickSwitchUser('usr_std_naphat')}
                className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 font-bold text-left transition-colors flex items-center gap-1.5"
              >
                <span>🎓 นภัทร (นักเรียน ม.5/1)</span>
              </button>

              <button
                type="button"
                onClick={() => quickSwitchUser('usr_teacher')}
                className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold text-left transition-colors flex items-center gap-1.5"
              >
                <span>👨‍🏫 Teacher (ครู)</span>
              </button>

              <button
                type="button"
                onClick={() => quickSwitchUser('usr_admin')}
                className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-bold text-left transition-colors flex items-center gap-1.5"
              >
                <span>👑 ผู้ดูแลระบบ (admin)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUsername('std_wichai');
                  setPassword('Student1234');
                  setLoginError('บัญชีนี้อยู่ในสถานะ "รออนุมัติ (Pending)" กรุณาให้ Teacher หรือ Admin อนุมัติก่อนเข้าใช้งาน');
                }}
                className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-left transition-colors flex items-center gap-1.5"
              >
                <span>⏳ วิชัย (รออนุมัติ)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
