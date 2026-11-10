/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lesson } from '../../types/portal';
import { usePortal } from '../../context/PortalContext';
import { QuizModal } from './QuizModal';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Layers,
  HelpCircle,
  Award,
  Bot,
  Share2,
  CheckCircle,
} from 'lucide-react';

interface LessonDetailViewProps {
  lesson: Lesson;
  onBack: () => void;
  onConsultEcoAi?: (prompt: string, context?: any) => void;
}

export const LessonDetailView: React.FC<LessonDetailViewProps> = ({
  lesson,
  onBack,
  onConsultEcoAi,
}) => {
  const { quizResults } = usePortal();
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);

  const quizResult = quizResults[lesson.id];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button & Action */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับสู่รายการบทเรียนทั้งหมด</span>
        </button>

        {onConsultEcoAi && (
          <button
            onClick={() =>
              onConsultEcoAi(
                `ผมเพิ่งศึกษาบทเรียน "${lesson.title}" อยากให้ Eco bot ช่วยตั้งคำถามชวนคิดวิพากษ์และวิเคราะห์เพิ่มเติมครับ`
              )
            }
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors"
          >
            <Bot className="w-4 h-4 text-emerald-600" />
            <span>ถาม Eco bot เกี่ยวกับบทเรียนนี้</span>
          </button>
        )}
      </div>

      {/* Main Content Article Card */}
      <article className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        {/* Cover Image Banner */}
        <div className="relative h-64 sm:h-80 bg-slate-100 overflow-hidden">
          <img
            src={lesson.coverUrl}
            alt={lesson.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />

          {/* Banner Badges & Title */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/90 font-bold backdrop-blur-xs">
                {lesson.category}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-xs font-medium">
                {lesson.level}
              </span>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-xs font-mono">
                <Clock className="w-3.5 h-3.5" />
                {lesson.duration}
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold text-white leading-tight">
              {lesson.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 italic font-medium">
              {lesson.subtitle}
            </p>
          </div>
        </div>

        {/* Lesson Body Content */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* Metadata bar */}
          <div className="flex items-center justify-between py-3 border-y border-slate-100 text-xs text-slate-500">
            <span>ผู้สอน: {lesson.author}</span>
            <span>ปรับปรุงล่าสุด: {lesson.updatedAt}</span>
          </div>

          {/* Markdown-style content */}
          <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-6">
            {lesson.contentMarkdown.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3
                    key={idx}
                    className="text-lg sm:text-xl font-extrabold text-slate-900 border-l-4 border-emerald-500 pl-3 pt-2"
                  >
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n- ');
                return (
                  <ul key={idx} className="list-disc list-inside space-y-2 pl-2">
                    {items.map((item, i) => (
                      <li key={i}>{item.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={idx}>{paragraph}</p>;
            })}
          </div>

          {/* Quiz Callout Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-2 border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                  กิจกรรมท้ายบทเรียน
                </span>
                {quizResult && (
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    คะแนนล่าสุด: {quizResult.score}/{quizResult.total}
                  </span>
                )}
              </div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900">
                แบบทดสอบท้ายบทเรียน ({lesson.quizzes.length} ข้อ)
              </h4>
              <p className="text-xs text-slate-600">
                ทดสอบความเข้าใจและทักษะการคิดวิพากษ์เพื่อประเมินผลสัมฤทธิ์ทางการเรียน
              </p>
            </div>

            <button
              onClick={() => setShowQuizModal(true)}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-xs shrink-0 flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{quizResult ? 'ทำแบบทดสอบอีกครั้ง' : 'เริ่มทำแบบทดสอบ'}</span>
            </button>
          </div>
        </div>
      </article>

      {/* Quiz Modal */}
      {showQuizModal && (
        <QuizModal lesson={lesson} onClose={() => setShowQuizModal(false)} />
      )}
    </div>
  );
};
