/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { LessonManager } from './LessonManager';
import { KnowledgeBaseManager } from './KnowledgeBaseManager';
import { AiSettingsManager } from './AiSettingsManager';
import { UserManager } from './UserManager';
import {
  BookOpen,
  FileText,
  Cpu,
  Users,
  ShieldAlert,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

interface TeacherDashboardProps {
  initialTab?: 'lessons' | 'knowledge' | 'ai_settings' | 'users';
  onNavigateToStudentView?: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  initialTab = 'lessons',
  onNavigateToStudentView,
}) => {
  const { currentUser, quickSwitchUser, users, lessons, knowledgeDocs, aiConfig } = usePortal();
  const [activeTab, setActiveTab] = useState<'lessons' | 'knowledge' | 'ai_settings' | 'users'>(
    initialTab
  );

  const isTeacherOrAdmin = currentUser?.role === 'admin' || currentUser?.role === 'teacher';

  if (!isTeacherOrAdmin) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white border border-slate-200 rounded-3xl text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl mx-auto flex items-center justify-center border border-amber-200">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">
          ต้องใช้สิทธิ์ Teacher (ครู) หรือผู้ดูแลระบบ (Teacher / Admin Access Required)
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          ปัจจุบันคุณกำลังเข้าสู่ระบบในฐานะ <strong>{currentUser?.name || 'นักเรียน'}</strong> ซึ่งไม่มีสิทธิ์เข้าถึงแดชบอร์ดบริหารจัดการเนื้อหาและระบบ AI
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => quickSwitchUser('usr_admin')}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            สลับเป็นบัญชีผู้ดูแลระบบ (admin)
          </button>
          <button
            onClick={() => quickSwitchUser('usr_teacher')}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            สลับเป็นบัญชี Teacher (ครู)
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: 'lessons',
      label: 'เนื้อหาบทเรียน',
      icon: BookOpen,
      desc: 'เพิ่ม/แก้ไขบทเรียน & แบบทดสอบ',
    },
    {
      id: 'knowledge',
      label: 'AI Knowledge Base',
      icon: FileText,
      desc: 'คลังเอกสาร PDF อ้างอิง AI',
    },
    {
      id: 'ai_settings',
      label: 'ตั้งค่า AI',
      icon: Cpu,
      desc: 'Gemini / OpenAI & ทดสอบการเชื่อมต่อ',
    },
    {
      id: 'users',
      label: 'จัดการผู้ใช้',
      icon: Users,
      desc: 'อนุมัตินักเรียน & กำหนดสิทธิ์',
    },
  ];

  const pendingStudentsCount = users.filter((u) => u.status === 'pending').length;
  const totalStudentsCount = users.filter((u) => u.role === 'student').length;

  return (
    <div className="space-y-6">
      {/* Admin Executive Header - Pastel Green, Sky Blue & Clean White */}
      <div className="p-6 bg-gradient-to-r from-emerald-100/90 via-teal-50 to-sky-100/90 text-slate-800 rounded-3xl border border-emerald-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-32 -mb-12 w-48 h-48 bg-sky-200/40 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>แผงควบคุมระบบ (Admin / Teacher Dashboard)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              ระบบบริหารจัดการห้องเรียน & คลังปัญญาประดิษฐ์
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              จัดการเนื้อหาบทเรียน ม.ปลาย, แบบทดสอบท้ายบท, อัปโหลดเอกสาร AI Knowledge Base, ตั้งค่าโมเดล AI และอนุมัติสิทธิ์นักเรียน
            </p>
          </div>

          {onNavigateToStudentView && (
            <button
              onClick={onNavigateToStudentView}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-2xs shrink-0 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>เข้าสู่ห้องเรียนนักเรียน (Student Classroom)</span>
            </button>
          )}
        </div>

        {/* 4 Quick Stat Pills - Pastel Card Style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-5 border-t border-emerald-200/70 text-xs">
          <div className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-xs border border-emerald-200/70 shadow-2xs">
            <span className="text-slate-500 block text-[11px] font-semibold">นักเรียนทั้งหมด</span>
            <div className="text-xl font-black mt-0.5 text-slate-900">{totalStudentsCount} คน</div>
            <span className="text-[10px] text-emerald-700 font-semibold">ระดับมัธยมศึกษาตอนปลาย</span>
          </div>

          <div
            onClick={() => setActiveTab('users')}
            className={`p-3.5 rounded-2xl backdrop-blur-xs border transition-colors cursor-pointer shadow-2xs ${
              pendingStudentsCount > 0
                ? 'bg-amber-50/95 border-amber-300 hover:bg-amber-100/90'
                : 'bg-white/90 border-emerald-200/70 hover:bg-white'
            }`}
          >
            <span className="text-slate-500 block text-[11px] font-semibold">รออนุมัติเข้าเรียน</span>
            <div className="text-xl font-black mt-0.5 text-slate-900 flex items-center gap-1.5">
              <span className={pendingStudentsCount > 0 ? 'text-amber-800' : 'text-slate-900'}>
                {pendingStudentsCount} บัญชี
              </span>
              {pendingStudentsCount > 0 && <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded-full font-bold">ต้องตรวจ</span>}
            </div>
            <span className="text-[10px] text-amber-700 font-medium">คลิกเพื่อจัดการผู้ใช้</span>
          </div>

          <div
            onClick={() => setActiveTab('lessons')}
            className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-xs border border-teal-200/70 hover:bg-white transition-colors cursor-pointer shadow-2xs"
          >
            <span className="text-slate-500 block text-[11px] font-semibold">บทเรียนในระบบ</span>
            <div className="text-xl font-black mt-0.5 text-slate-900">{lessons.length} บท</div>
            <span className="text-[10px] text-teal-700 font-medium">คลิกเพื่อจัดการบทเรียน</span>
          </div>

          <div
            onClick={() => setActiveTab('knowledge')}
            className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-xs border border-sky-200/70 hover:bg-white transition-colors cursor-pointer shadow-2xs"
          >
            <span className="text-slate-500 block text-[11px] font-semibold">เอกสารใน AI Base</span>
            <div className="text-xl font-black mt-0.5 text-slate-900">{knowledgeDocs.length} ฉบับ</div>
            <span className="text-[10px] text-sky-700 font-medium">{aiConfig.geminiModel}</span>
          </div>
        </div>
      </div>

      {/* Top Navigation Tabs Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-3 shadow-xs">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`p-3.5 rounded-2xl text-left transition-all flex items-start gap-3 border ${
                  isActive
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-2xs font-bold'
                    : 'bg-white border-transparent hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                }`}
              >
                <div
                  className={`p-2 rounded-xl shrink-0 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-extrabold truncate">
                    {tab.label}
                  </div>
                  <div className="text-[11px] text-slate-400 font-normal truncate mt-0.5">
                    {tab.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab Panel */}
      <div>
        {activeTab === 'lessons' && <LessonManager />}
        {activeTab === 'knowledge' && <KnowledgeBaseManager />}
        {activeTab === 'ai_settings' && <AiSettingsManager />}
        {activeTab === 'users' && <UserManager />}
      </div>
    </div>
  );
};
