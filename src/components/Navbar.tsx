/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Compass,
  BookOpen,
  MapPin,
  MessageSquare,
  Bot,
  SlidersHorizontal,
  Shield,
  User as UserIcon,
  LogIn,
  LogOut,
  ChevronDown,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Home,
  FileText,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import ecoLogoImg from '../assets/images/ecocritical_logo_1794300369798.jpg';

export type ActiveTab =
  | 'home'
  | 'lessons'
  | 'worksheets'
  | 'schedule'
  | 'cases'
  | 'forum'
  | 'ecobot'
  | 'simulator'
  | 'teacher_dashboard';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAuthModal: () => void;
  onOpenEtiquetteModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAuthModal,
  onOpenEtiquetteModal,
}) => {
  const { currentUser, logout, quickSwitchUser, users } = usePortal();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const isTeacherOrAdmin = currentUser?.role === 'admin' || currentUser?.role === 'teacher';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top Banner Notice - Pastel Mint & Sky */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 px-4 py-1.5 text-xs text-emerald-900 border-b border-emerald-100/70 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-[11px] sm:text-xs">
            🌱 ห้องเรียนภูมิศาสตร์สิ่งแวดล้อมเพื่อการคิดวิพากษ์ (Eco-critical) • มลพิษทางอากาศ & PM2.5 • มัธยมศึกษาตอนปลาย
          </span>

          <div className="ml-auto flex items-center gap-2">
            {onOpenEtiquetteModal && (
              <button
                onClick={onOpenEtiquetteModal}
                className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/80 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 transition-colors cursor-pointer"
                title="คลิกเพื่ออ่านกฎกติกาและมารยาทการอภิปราย"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>กฎกติกามารยาท</span>
              </button>
            )}
            <span className="hidden md:inline-block text-sky-800 font-bold text-[11px] px-2 py-0.5 rounded-full bg-sky-100/60 border border-sky-200">
              มัธยมศึกษาตอนปลาย (ม.4 - ม.6)
            </span>
          </div>
        </div>
      </div>

      {/* Main Nav Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div
          onClick={() => setActiveTab('home')}
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
              <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                ม.ปลาย
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              เข้าห้องเรียน · บทเรียน & ควิซ · ใบงาน & สมุดบันทึก · นัดหมายอภิปราย · Eco bot
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Focused strictly on High School Students - No teacher dashboard in main nav) */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1">
          {/* 1. Home / Classroom Entry Tab */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'home'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/70'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>เข้าสู่ห้องเรียน</span>
          </button>

          {/* 2. Lessons & Quizzes */}
          <button
            onClick={() => setActiveTab('lessons')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'lessons'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/70'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>บทเรียน & ควิซ</span>
          </button>

          {/* 3. Worksheets & Logbook */}
          <button
            onClick={() => setActiveTab('worksheets')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'worksheets'
                ? 'bg-teal-100 text-teal-900 border border-teal-300 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-teal-800 hover:bg-teal-50/70'
            }`}
          >
            <FileText className="w-4 h-4 text-teal-600" />
            <span>ใบงาน & สมุดบันทึก</span>
          </button>

          {/* 4. Live Discussion Schedule */}
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'schedule'
                ? 'bg-sky-100 text-sky-900 border border-sky-300 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-sky-800 hover:bg-sky-50/70'
            }`}
          >
            <Calendar className="w-4 h-4 text-sky-600" />
            <span>นัดหมายอภิปรายสด</span>
          </button>

          {/* 5. Cases & Map */}
          <button
            onClick={() => setActiveTab('cases')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'cases'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/70'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>กรณีศึกษา & แผนที่</span>
          </button>

          {/* 6. Discussion Forum */}
          <button
            onClick={() => setActiveTab('forum')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'forum'
                ? 'bg-indigo-100 text-indigo-900 border border-indigo-300 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-indigo-800 hover:bg-indigo-50/70'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <span>เว็บบอร์ด ม.ปลาย</span>
          </button>

          {/* 7. Simulator Lab */}
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'simulator'
                ? 'bg-slate-100 text-slate-900 border border-slate-300 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-600" />
            <span>แล็บจำลอง</span>
          </button>

          {/* 8. Eco bot Chat */}
          <button
            onClick={() => setActiveTab('ecobot')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs ${
              activeTab === 'ecobot'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-600/20 ring-2 ring-emerald-300'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Eco bot สืบค้น</span>
          </button>
        </nav>

        {/* User Profile / Auth Area */}
        <div className="relative">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors shadow-2xs text-left"
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                    currentUser.role === 'admin'
                      ? 'bg-purple-600 text-white'
                      : currentUser.role === 'teacher'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-sky-600 text-white'
                  }`}
                >
                  {currentUser.name.charAt(0)}
                </div>

                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 line-clamp-1">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                    {currentUser.role === 'admin' && (
                      <span className="text-purple-700 font-bold">ผู้ดูแลระบบ (Admin)</span>
                    )}
                    {currentUser.role === 'teacher' && (
                      <span className="text-emerald-700 font-bold">Teacher (ครู)</span>
                    )}
                    {currentUser.role === 'student' && (
                      <span className="text-sky-700 font-bold">นักเรียน (Student)</span>
                    )}
                  </div>
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 text-xs space-y-3 animate-in fade-in zoom-in-95 duration-100">
                  <div className="pb-2 border-b border-slate-100">
                    <div className="font-bold text-slate-900">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">@{currentUser.username}</div>
                    <div className="mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      สิทธิ์: {currentUser.role.toUpperCase()} · สถานะ: {currentUser.status}
                    </div>
                  </div>

                  {/* Quick Switcher for testing all flows effortlessly */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                      สลับบัญชีทดสอบด่วน:
                    </span>
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          quickSwitchUser('usr_admin');
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left p-1.5 rounded-lg hover:bg-purple-50 text-purple-900 flex items-center justify-between"
                      >
                        <span>👑 แอดมิน (admin)</span>
                        {currentUser.username === 'admin' && <span className="text-[10px] font-bold text-purple-700">ใช้งานอยู่</span>}
                      </button>

                      <button
                        onClick={() => {
                          quickSwitchUser('usr_teacher');
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-900 flex items-center justify-between"
                      >
                        <span>👨‍🏫 Teacher (ครู)</span>
                        {currentUser.role === 'teacher' && <span className="text-[10px] font-bold text-emerald-700">ใช้งานอยู่</span>}
                      </button>

                      <button
                        onClick={() => {
                          quickSwitchUser('usr_std_naphat');
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left p-1.5 rounded-lg hover:bg-sky-50 text-sky-900 flex items-center justify-between"
                      >
                        <span>🎓 นักเรียนนภัทร (approved)</span>
                        {currentUser.username === 'std_naphat' && <span className="text-[10px] font-bold text-sky-700">ใช้งานอยู่</span>}
                      </button>
                    </div>
                  </div>

                  {/* Teacher / Admin Access Button (Only for authorized roles, discreetly located) */}
                  {isTeacherOrAdmin && (
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setActiveTab('teacher_dashboard');
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold flex items-center justify-between border border-purple-200 transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          <Shield className="w-4 h-4 text-purple-600" />
                          <span>แดชบอร์ดจัดการระบบ (ครู/แอดมิน)</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-purple-500" />
                      </button>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenAuthModal();
                      }}
                      className="text-emerald-700 font-bold hover:underline text-[11px]"
                    >
                      เปลี่ยนรหัส / บัญชีอื่น
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setShowUserDropdown(false);
                      }}
                      className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-bold text-[11px]"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>ออกจากระบบ</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-2xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>เข้าสู่ระบบ / สมัครสมาชิก</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
