/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Lesson } from '../../types/portal';
import thaiStudentsPlantingImg from '../../assets/images/thai_students_planting_trees_1794307897081.jpg';
import {
  BookOpen,
  Search,
  Clock,
  HelpCircle,
  Award,
  Layers,
  ArrowRight,
  Filter,
  GraduationCap,
} from 'lucide-react';

interface LessonCatalogProps {
  onSelectLesson: (lesson: Lesson) => void;
}

export const LessonCatalog: React.FC<LessonCatalogProps> = ({ onSelectLesson }) => {
  const { lessons, quizResults } = usePortal();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'ทุกกลุ่มสาระภูมิศาสตร์' },
    { id: 'ภูมิสารสนเทศและเครื่องมือทางภูมิศาสตร์', label: 'ภูมิสารสนเทศ & GIS (ส 5.1)' },
    { id: 'ภูมิศาสตร์กายภาพ', label: 'ภูมิศาสตร์กายภาพ (ส 5.1)' },
    { id: 'ภูมิศาสตร์มนุษย์และสิ่งแวดล้อม', label: 'มนุษย์กับสิ่งแวดล้อม (ส 5.2)' },
    { id: 'การจัดการภัยพิบัติและการพัฒนาที่ยั่งยืน', label: 'การจัดการสิ่งแวดล้อม (ส 5.2)' },
  ];

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.subtitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || lesson.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={thaiStudentsPlantingImg}
              alt="นักเรียนมัธยมไทยร่วมใจรักษ์สิ่งแวดล้อม"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-200 shadow-2xs shrink-0"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 text-[11px] font-bold mb-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                <span>ระดับชั้นมัธยมศึกษาตอนปลาย (ม.4 - ม.6)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-emerald-600" />
                <span>คลังบทเรียนภูมิศาสตร์สิ่งแวดล้อม ม.ปลาย</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                ศึกษาบทเรียนสาระภูมิศาสตร์ ม.ปลาย (ส 5.1 & ส 5.2) ทำแบบทดสอบวัดผล และฝึกคิดวิพากษ์กับ Eco bot
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อบทเรียนหรือเนื้อหา..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            หมวดหมู่:
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lesson Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredLessons.map((lesson) => {
          const quizResult = quizResults[lesson.id];
          return (
            <div
              key={lesson.id}
              onClick={() => onSelectLesson(lesson)}
              className="group bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Cover Image */}
                <div className="relative h-52 bg-slate-100 overflow-hidden">
                  <img
                    src={lesson.coverUrl}
                    alt={lesson.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 flex items-center gap-1 text-xs font-semibold bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-emerald-900 border border-slate-200 shadow-2xs">
                    <Layers className="w-3 h-3 text-emerald-600" />
                    <span>{lesson.category}</span>
                  </div>

                  <div className="absolute bottom-3 right-3 flex items-center gap-1 text-xs font-semibold bg-slate-900/80 text-white px-2.5 py-1 rounded-lg backdrop-blur-xs">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{lesson.duration}</span>
                  </div>

                  {/* If user completed quiz, show score badge */}
                  {quizResult && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs font-bold bg-emerald-600 text-white px-2.5 py-1 rounded-lg shadow-xs">
                      <Award className="w-3.5 h-3.5" />
                      <span>คะแนนควิซ: {quizResult.score}/{quizResult.total}</span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-2">
                  <div className="text-[11px] text-slate-400 font-medium">
                    {lesson.level} · โดย {lesson.author}
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1 italic font-medium">
                    {lesson.subtitle}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
                    {lesson.description}
                  </p>
                </div>
              </div>

              {/* Bottom footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                <span className="flex items-center gap-1 text-slate-500 font-normal">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>แบบทดสอบท้ายบท {lesson.quizzes.length} ข้อ</span>
                </span>

                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>เข้าเรียนบทนี้</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
