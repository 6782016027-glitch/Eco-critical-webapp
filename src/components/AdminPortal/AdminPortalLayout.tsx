/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { LessonManager } from '../TeacherDashboard/LessonManager';
import { KnowledgeBaseManager } from '../TeacherDashboard/KnowledgeBaseManager';
import { AiSettingsManager } from '../TeacherDashboard/AiSettingsManager';
import { UserManager } from '../TeacherDashboard/UserManager';
import ecoLogoImg from '../../assets/images/ecocritical_logo_1794300369798.jpg';
import {
  Shield,
  LayoutDashboard,
  BookOpen,
  FileText,
  Cpu,
  Users,
  MessageSquare,
  LogOut,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Menu,
  X,
  Plus,
  Trash2,
} from 'lucide-react';

export type AdminTab =
  | 'overview'
  | 'lessons'
  | 'knowledge'
  | 'ai_settings'
  | 'users'
  | 'forum';

export const AdminPortalLayout: React.FC = () => {
  const {
    currentUser,
    logout,
    users,
    lessons,
    knowledgeDocs,
    aiConfig,
    forumTopics,
    deleteTopic,
  } = usePortal();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Forum topic moderation state
  const [forumSearch, setForumSearch] = useState('');

  const pendingStudentsCount = users.filter((u) => u.status === 'pending').length;
  const totalStudentsCount = users.filter((u) => u.role === 'student').length;

  const adminNavItems = [
    {
      id: 'overview',
      label: 'ภาพรวมระบบ (Overview)',
      icon: LayoutDashboard,
      badge: 'สรุปผล',
    },
    {
      id: 'lessons',
      label: 'จัดการบทเรียน & ควิซ',
      icon: BookOpen,
      badge: `${lessons.length} บท`,
    },
    {
      id: 'knowledge',
      label: 'คลังเอกสาร AI Knowledge',
      icon: FileText,
      badge: `${knowledgeDocs.length} ฉบับ`,
    },
    {
      id: 'ai_settings',
      label: 'ตั้งค่าระบบและโมเดล AI',
      icon: Cpu,
      badge: aiConfig.provider === 'gemini' ? 'Gemini' : 'OpenAI',
    },
    {
      id: 'users',
      label: 'จัดการผู้ใช้ & สิทธิ์',
      icon: Users,
      badge: pendingStudentsCount > 0 ? `รออนุมัติ ${pendingStudentsCount}` : `${users.length} คน`,
      badgeAlert: pendingStudentsCount > 0,
    },
    {
      id: 'forum',
      label: 'จัดการกระทู้เว็บบอร์ด',
      icon: MessageSquare,
      badge: `${forumTopics.length} กระทู้`,
    },
  ];

  const filteredTopics = forumTopics.filter(
    (t) =>
      t.title.toLowerCase().includes(forumSearch.toLowerCase()) ||
      t.authorName.toLowerCase().includes(forumSearch.toLowerCase()) ||
      t.content.toLowerCase().includes(forumSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/60 via-teal-50/40 to-sky-50/60 text-slate-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* ======================================================== */}
      {/* 1. TOP NAVBAR (ADMIN VIEW ONLY)                          */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          {/* Brand & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
              aria-label="Toggle Admin Sidebar"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-2.5 cursor-pointer group shrink-0"
            >
              <img
                src={ecoLogoImg}
                alt="Eco-critical Admin Logo"
                className="w-10 h-10 rounded-2xl object-cover shadow-2xs group-hover:scale-105 transition-transform border border-emerald-200"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-700 via-teal-700 to-sky-700 bg-clip-text text-transparent">
                    Eco-critical
                  </span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-900 text-emerald-400 border border-slate-700 shadow-2xs">
                    ADMIN VIEW
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  ระบบบริหารจัดการห้องเรียน & ฐานข้อมูลส่วนกลาง (Admin Control Center)
                </p>
              </div>
            </div>
          </div>

          {/* Right Status Badges & Logout */}
          <div className="flex items-center gap-3">
            {/* System Online Badge */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>ระบบพร้อมปฏิบัติการ (Active)</span>
            </div>

            {/* Admin Profile Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs shadow-xs">
              <div className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xs">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="font-extrabold text-white text-[11px] sm:text-xs leading-none">
                  {currentUser?.name || 'ผู้ดูแลระบบส่วนกลาง'}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                  @{currentUser?.username || 'admin'} • ผู้ดูแลระบบ
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200/90 hover:border-rose-200 text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xs hover:shadow-xs cursor-pointer"
              title="ออกจากระบบแดชบอร์ด"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. BODY LAYOUT: SIDEBAR + MAIN ADMIN MANAGEMENT AREA     */}
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
              <span>เมนูจัดการระบบ</span>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-extrabold border border-emerald-200">
                CRUD
              </span>
            </div>

            <nav className="space-y-1.5">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as AdminTab);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer group ${
                      isActive
                        ? 'bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 text-white shadow-md shadow-slate-950/25 ring-2 ring-emerald-400/30 scale-[1.01]'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-gradient-to-r hover:from-emerald-50/90 hover:to-teal-50/70 hover:scale-[1.02] active:scale-[0.98] border border-transparent hover:border-emerald-200/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-2xs ${
                          isActive
                            ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/30'
                            : 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100 group-hover:text-emerald-900'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-1">
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      )}
                      {item.badge && (
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full transition-colors ${
                            isActive
                              ? 'bg-emerald-400 text-slate-950 font-black shadow-2xs'
                              : item.badgeAlert
                              ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200 group-hover:bg-emerald-100'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Quick System Info in Sidebar */}
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1 px-2">
              <div className="flex justify-between">
                <span>ฐานข้อมูล:</span>
                <span className="font-bold text-slate-700">LocalStorage Active</span>
              </div>
              <div className="flex justify-between">
                <span>โมเดล AI:</span>
                <span className="font-bold text-emerald-700">{aiConfig.geminiModel}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Backdrop for Mobile Sidebar */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs z-20 lg:hidden"
          />
        )}

        {/* MAIN ADMIN MANAGEMENT CONTENT AREA */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* TAB 1: SYSTEM OVERVIEW (PASTEL GREEN / SKY BLUE THEME) */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Executive Hero Banner */}
              <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-100/90 via-teal-50 to-sky-100/90 text-slate-800 rounded-3xl border border-emerald-200/80 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-32 -mb-12 w-48 h-48 bg-sky-200/40 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>แผงควบคุมระบบการจัดการส่วนกลาง (Admin Overview)</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    ยินดีต้อนรับสู่แดชบอร์ดจัดการระบบ Eco-critical
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                    คุณมีสิทธิ์ในการเข้าถึงและจัดการข้อมูลอย่างสมบูรณ์ (CRUD Operations: เพิ่ม ลบ แก้ไข ดูข้อมูล)
                    ในทุกโมดูล ทั้งบทเรียน แบบทดสอบ คลังเอกสาร AI สิทธิ์ผู้ใช้งาน และกระทู้การอภิปราย
                  </p>
                </div>

                {/* 4 Pastel Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-5 border-t border-emerald-200/70 text-xs">
                  <div
                    onClick={() => setActiveTab('users')}
                    className="p-4 rounded-2xl bg-white/95 backdrop-blur-xs border border-emerald-200/80 hover:bg-white transition-all cursor-pointer shadow-2xs group"
                  >
                    <span className="text-slate-500 block text-[11px] font-semibold">
                      นักเรียนทั้งหมด
                    </span>
                    <div className="text-2xl font-black mt-1 text-slate-900 group-hover:text-emerald-700">
                      {totalStudentsCount} คน
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      {users.length} บัญชีรวมทั้งระบบ
                    </span>
                  </div>

                  <div
                    onClick={() => setActiveTab('users')}
                    className={`p-4 rounded-2xl backdrop-blur-xs border transition-all cursor-pointer shadow-2xs group ${
                      pendingStudentsCount > 0
                        ? 'bg-amber-50/95 border-amber-300 hover:bg-amber-100/90'
                        : 'bg-white/95 border-emerald-200/80 hover:bg-white'
                    }`}
                  >
                    <span className="text-slate-500 block text-[11px] font-semibold">
                      รออนุมัติเข้าเรียน
                    </span>
                    <div className="text-2xl font-black mt-1 text-slate-900 flex items-center gap-1.5">
                      <span className={pendingStudentsCount > 0 ? 'text-amber-800' : 'text-slate-900'}>
                        {pendingStudentsCount} คน
                      </span>
                      {pendingStudentsCount > 0 && (
                        <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded-full font-bold">
                          ต้องตรวจ
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-amber-700 font-medium">คลิกเพื่อจัดการผู้ใช้</span>
                  </div>

                  <div
                    onClick={() => setActiveTab('lessons')}
                    className="p-4 rounded-2xl bg-white/95 backdrop-blur-xs border border-teal-200/80 hover:bg-white transition-all cursor-pointer shadow-2xs group"
                  >
                    <span className="text-slate-500 block text-[11px] font-semibold">
                      บทเรียนในระบบ
                    </span>
                    <div className="text-2xl font-black mt-1 text-slate-900 group-hover:text-teal-700">
                      {lessons.length} บท
                    </div>
                    <span className="text-[10px] text-teal-700 font-medium">
                      พร้อมแบบทดสอบและควิซ
                    </span>
                  </div>

                  <div
                    onClick={() => setActiveTab('knowledge')}
                    className="p-4 rounded-2xl bg-white/95 backdrop-blur-xs border border-sky-200/80 hover:bg-white transition-all cursor-pointer shadow-2xs group"
                  >
                    <span className="text-slate-500 block text-[11px] font-semibold">
                      เอกสาร AI Knowledge
                    </span>
                    <div className="text-2xl font-black mt-1 text-slate-900 group-hover:text-sky-700">
                      {knowledgeDocs.length} ฉบับ
                    </div>
                    <span className="text-[10px] text-sky-700 font-medium truncate block">
                      โมเดล: {aiConfig.geminiModel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  onClick={() => setActiveTab('lessons')}
                  className="p-5 rounded-3xl bg-white border border-emerald-100 hover:border-emerald-300 transition-all cursor-pointer shadow-xs hover:shadow-md space-y-2"
                >
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    จัดการเนื้อหาบทเรียน (Lessons CRUD)
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    เพิ่มบทเรียนใหม่ แก้ไขคำถามกระตุ้นความคิด จัดการวิดีโอ YouTube และแบบทดสอบก่อน-หลังเรียน
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab('users')}
                  className="p-5 rounded-3xl bg-white border border-sky-100 hover:border-sky-300 transition-all cursor-pointer shadow-xs hover:shadow-md space-y-2"
                >
                  <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    จัดการผู้ใช้งาน & สิทธิ์ (Users CRUD)
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    เพิ่มบัญชีนักเรียน/ครู อนุมัติผู้สมัครใหม่ ปรับเปลี่ยนบทบาท หรือลบบัญชีผู้ใช้
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab('forum')}
                  className="p-5 rounded-3xl bg-white border border-teal-100 hover:border-teal-300 transition-all cursor-pointer shadow-xs hover:shadow-md space-y-2"
                >
                  <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    ตรวจสอบกระทู้เว็บบอร์ด (Forum Moderation)
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    ดูแลการอภิปราย ตรวจสอบเนื้อหาตามหลักคิดวิพากษ์ และลบกระทู้ที่ไม่เหมาะสมได้ทันที
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LESSONS & QUIZZES CRUD */}
          {activeTab === 'lessons' && <LessonManager />}

          {/* TAB 3: AI KNOWLEDGE BASE CRUD */}
          {activeTab === 'knowledge' && <KnowledgeBaseManager />}

          {/* TAB 4: AI SETTINGS CRUD */}
          {activeTab === 'ai_settings' && <AiSettingsManager />}

          {/* TAB 5: USERS & ROLES CRUD */}
          {activeTab === 'users' && <UserManager />}

          {/* TAB 6: FORUM MODERATION CRUD */}
          {activeTab === 'forum' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white border border-slate-200 rounded-3xl shadow-xs">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-emerald-600" />
                    <span>จัดการกระทู้เว็บบอร์ด (Forum Moderation CRUD)</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    ตรวจสอบการตั้งกระทู้และคำตอบของนักเรียน ลบกระทู้ที่ไม่เหมาะสมได้ทันที
                  </p>
                </div>
                <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                  ทั้งหมด {forumTopics.length} กระทู้
                </div>
              </div>

              {/* Search */}
              <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-2xs">
                <input
                  type="text"
                  value={forumSearch}
                  onChange={(e) => setForumSearch(e.target.value)}
                  placeholder="ค้นหาชื่อกระทู้, ชื่อผู้โพสต์ หรือเนื้อหา..."
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:bg-white focus:border-emerald-500"
                />
              </div>

              {/* Topics List with Delete Action */}
              <div className="space-y-3">
                {filteredTopics.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-sm">
                    ไม่พบกระทู้ที่ตรงกับเงื่อนไขการค้นหา
                  </div>
                ) : (
                  filteredTopics.map((topic) => (
                    <div
                      key={topic.id}
                      className="p-4 sm:p-5 bg-white border border-slate-200 rounded-3xl shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-emerald-300 transition-all"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {topic.tags?.[0] || 'การอภิปราย'}
                          </span>
                          <span className="text-xs text-slate-400">
                            โพสต์โดย{' '}
                            <strong className="text-slate-700">{topic.authorName}</strong> (
                            {topic.authorRole})
                          </span>
                          <span className="text-xs text-slate-400">
                            • {new Date(topic.createdAt).toLocaleDateString('th-TH')}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm sm:text-base text-slate-900">
                          {topic.title}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2">{topic.content}</p>
                        <div className="text-[11px] text-slate-400 font-semibold pt-1">
                          💬 {topic.replies.length} ความคิดเห็น
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`คุณต้องการลบกระทู้ "${topic.title}" หรือไม่?`)) {
                            deleteTopic(topic.id);
                          }
                        }}
                        className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
                        title="ลบกระทู้นี้ออกจากระบบ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>ลบกระทู้</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Admin Footer */}
      <footer className="mt-auto border-t border-emerald-100 bg-white/90 py-5 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span className="font-extrabold text-slate-800">Eco-critical Admin Console</span>
            <span className="text-[11px] text-slate-500">
              • ศูนย์บริหารจัดการระบบการเรียนการสอน (Admin View)
            </span>
          </div>
          <p className="text-slate-400 text-xs">
            สิทธิ์การจัดการข้อมูลระดับผู้ดูแลระบบ (admin)
          </p>
        </div>
      </footer>
    </div>
  );
};
