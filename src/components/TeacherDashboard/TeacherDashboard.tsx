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
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ initialTab = 'lessons' }) => {
  const { currentUser, quickSwitchUser } = usePortal();
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

  return (
    <div className="space-y-6">
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
