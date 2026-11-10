/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Lesson, QuizQuestion } from '../../types/portal';
import {
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  HelpCircle,
  Save,
  X,
  CheckCircle,
  Image as ImageIcon,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const LessonManager: React.FC = () => {
  const { lessons, addLesson, updateLesson, deleteLesson, addQuizQuestion, deleteQuizQuestion } =
    usePortal();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'quizzes'>('content');

  // Form states for lesson
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('ภูมิสารสนเทศและเครื่องมือทางภูมิศาสตร์');
  const [level, setLevel] = useState('มัธยมศึกษาตอนปลาย');
  const [duration, setDuration] = useState('45 นาที');
  const [coverUrl, setCoverUrl] = useState('');
  const [contentMarkdown, setContentMarkdown] = useState('');

  // Form states for new quiz
  const [showAddQuiz, setShowAddQuiz] = useState(false);
  const [quizQuestion, setQuizQuestion] = useState('');
  const [quizOptions, setQuizOptions] = useState<[string, string, string, string]>([
    '',
    '',
    '',
    '',
  ]);
  const [quizCorrectIndex, setQuizCorrectIndex] = useState(0);
  const [quizExplanation, setQuizExplanation] = useState('');

  const openCreateModal = () => {
    setSelectedLesson(null);
    setTitle('');
    setSubtitle('');
    setDescription('');
    setCategory('ภูมิสารสนเทศและเครื่องมือทางภูมิศาสตร์');
    setLevel('มัธยมศึกษาตอนปลาย');
    setDuration('45 นาที');
    setCoverUrl('https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800');
    setContentMarkdown(`### วัตถุประสงค์การเรียนรู้
1. เข้าใจสาเหตุและผลกระทบของปัญหา
2. วิเคราะห์ตัวแปรทางภูมิศาสตร์และโครงสร้างเศรษฐกิจ

### เนื้อหาสำคัญ
อธิบายรายละเอียดและข้อเท็จจริง...`);
    setIsEditing(true);
    setActiveTab('content');
  };

  const openEditModal = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setTitle(lesson.title);
    setSubtitle(lesson.subtitle);
    setDescription(lesson.description);
    setCategory(lesson.category);
    setLevel(lesson.level);
    setDuration(lesson.duration);
    setCoverUrl(lesson.coverUrl);
    setContentMarkdown(lesson.contentMarkdown);
    setIsEditing(true);
    setActiveTab('content');
  };

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (selectedLesson) {
      updateLesson({
        ...selectedLesson,
        title,
        subtitle,
        description,
        category,
        level,
        duration,
        coverUrl,
        contentMarkdown,
      });
    } else {
      const newLes = addLesson({
        title,
        subtitle,
        description,
        category,
        level,
        duration,
        coverUrl,
        contentMarkdown,
        author: 'Teacher (ครู)',
        isPublished: true,
        quizzes: [],
      });
      setSelectedLesson(newLes);
    }
    setIsEditing(false);
  };

  const handleAddQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLesson || !quizQuestion.trim() || quizOptions.some((o) => !o.trim())) {
      alert('กรุณากรอกคำถามและตัวเลือกให้ครบทั้ง 4 ตัวเลือก');
      return;
    }

    addQuizQuestion(selectedLesson.id, {
      question: quizQuestion,
      options: quizOptions,
      correctIndex: quizCorrectIndex,
      explanation: quizExplanation,
    });

    // Refresh selected lesson
    const updated = lessons.find((l) => l.id === selectedLesson.id);
    if (updated) setSelectedLesson(updated);

    // Reset quiz form
    setQuizQuestion('');
    setQuizOptions(['', '', '', '']);
    setQuizCorrectIndex(0);
    setQuizExplanation('');
    setShowAddQuiz(false);
  };

  const handleDeleteQuiz = (questionId: string) => {
    if (!selectedLesson) return;
    deleteQuizQuestion(selectedLesson.id, questionId);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <span>จัดการเนื้อหาบทเรียนและแบบทดสอบ (Lesson & Quiz Management)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            เพิ่ม แก้ไข ลบบทเรียนวิชาภูมิศาสตร์สิ่งแวดล้อม จัดการรูปภาพหน้าปก และแบบทดสอบท้ายบท (Quizzes)
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>สร้างบทเรียนใหม่</span>
        </button>
      </div>

      {/* Lesson Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              {/* Cover Image */}
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <img
                  src={lesson.coverUrl}
                  alt={lesson.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1 text-[11px] font-semibold bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-emerald-900 border border-slate-200 shadow-2xs">
                  <Layers className="w-3 h-3 text-emerald-600" />
                  <span>{lesson.category}</span>
                </div>
                <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 text-[11px] font-semibold bg-slate-900/80 text-white px-2 py-0.5 rounded backdrop-blur-xs">
                  <Clock className="w-3 h-3" />
                  <span>{lesson.duration}</span>
                </div>
              </div>

              {/* Lesson Info */}
              <div className="p-4 space-y-2">
                <div className="text-[11px] text-slate-400 font-medium">
                  ปรับปรุงล่าสุด: {lesson.updatedAt} · {lesson.author}
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-1">
                  {lesson.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {lesson.description}
                </p>

                {/* Quizzes Count Badge */}
                <div className="pt-2 flex items-center gap-1 text-xs text-emerald-800 font-medium">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>แบบทดสอบท้ายบท: {lesson.quizzes.length} ข้อ</span>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => openEditModal(lesson)}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-semibold border border-slate-200 transition-colors shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>แก้ไขบทเรียน & ควิซ</span>
              </button>

              <button
                onClick={() => {
                  if (confirm(`คุณต้องการลบบทเรียน "${lesson.title}" ใช่หรือไม่?`)) {
                    deleteLesson(lesson.id);
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-colors"
                title="ลบบทเรียนนี้"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Lesson Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div
            className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-b border-emerald-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  {selectedLesson ? `แก้ไขบทเรียน: ${selectedLesson.title}` : 'สร้างบทเรียนใหม่'}
                </h3>
                <p className="text-xs text-slate-500">
                  จัดการรายละเอียดเนื้อหา ภาพประกอบ และแบบทดสอบท้ายบท
                </p>
              </div>

              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Navigation in Modal */}
            <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 gap-2">
              <button
                onClick={() => setActiveTab('content')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
                  activeTab === 'content'
                    ? 'border-emerald-600 text-emerald-800 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                1. ข้อมูลและเนื้อหาบทเรียน
              </button>
              <button
                onClick={() => setActiveTab('quizzes')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
                  activeTab === 'quizzes'
                    ? 'border-emerald-600 text-emerald-800 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                2. แบบทดสอบท้ายบท ({selectedLesson?.quizzes.length || 0} ข้อ)
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {activeTab === 'content' ? (
                <form onSubmit={handleSaveLesson} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">ชื่อบทเรียน *</label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="เช่น บทที่ 5: การพัดพามลพิษและลมมรสุม"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">ชื่อบทเรียนย่อย (Subtitle)</label>
                      <input
                        type="text"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        placeholder="เช่น วิเคราะห์ทิศทางลมกับการเคลื่อนที่ของฝุ่น"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">หมวดหมู่วิชา</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                      >
                        <option value="ภูมิสารสนเทศและเครื่องมือทางภูมิศาสตร์">ภูมิสารสนเทศและเครื่องมือทางภูมิศาสตร์ (ส 5.1)</option>
                        <option value="ภูมิศาสตร์กายภาพ">ภูมิศาสตร์กายภาพและบรรยากาศ (ส 5.1)</option>
                        <option value="ภูมิศาสตร์มนุษย์และสิ่งแวดล้อม">ภูมิศาสตร์มนุษย์และสิ่งแวดล้อม (ส 5.2)</option>
                        <option value="การจัดการภัยพิบัติและการพัฒนาที่ยั่งยืน">การจัดการภัยพิบัติและการพัฒนาที่ยั่งยืน (ส 5.2)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">ระดับผู้เรียน</label>
                      <input
                        type="text"
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        placeholder="มัธยมศึกษาตอนปลาย"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">ระยะเวลาเรียนโดยประมาณ</label>
                      <input
                        type="text"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="45 นาที"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">URL รูปภาพหน้าปกบทเรียน</label>
                    <input
                      type="url"
                      value={coverUrl}
                      onChange={(e) => setCoverUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">คำอธิบายสังเขป (Description)</label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="อธิบายสรุปสั้นๆ เกี่ยวกับบทเรียนนี้..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      เนื้อหาบทเรียน (รองรับ Markdown & หัวข้อย่อย)
                    </label>
                    <textarea
                      rows={10}
                      value={contentMarkdown}
                      onChange={(e) => setContentMarkdown(e.target.value)}
                      placeholder="เขียนเนื้อหาบทเรียน..."
                      className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-mono text-xs leading-relaxed"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>บันทึกบทเรียน</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Quizzes Tab */
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">
                        รายการแบบทดสอบท้ายบทเรียน ({selectedLesson?.quizzes.length || 0} ข้อ)
                      </h4>
                      <p className="text-xs text-slate-500">
                        นักเรียนจะทำแบบทดสอบนี้หลังเรียนจบบท เพื่อวัดความเข้าใจและการคิดวิพากษ์
                      </p>
                    </div>

                    {!showAddQuiz && (
                      <button
                        onClick={() => setShowAddQuiz(true)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>เพิ่มข้อสอบใหม่</span>
                      </button>
                    )}
                  </div>

                  {/* Add Quiz Form */}
                  {showAddQuiz && (
                    <form
                      onSubmit={handleAddQuiz}
                      className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-900">เพิ่มข้อสอบใหม่</span>
                        <button
                          type="button"
                          onClick={() => setShowAddQuiz(false)}
                          className="text-slate-400 hover:text-slate-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">โจทย์คำถาม *</label>
                        <input
                          type="text"
                          required
                          value={quizQuestion}
                          onChange={(e) => setQuizQuestion(e.target.value)}
                          placeholder="เช่น ข้อใดคือสาเหตุหลักที่ทำให้อุณหภูมิผกผันกักขังฝุ่น?"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      {/* 4 Options */}
                      <div className="space-y-2">
                        <label className="block font-bold text-slate-700">
                          ตัวเลือกทั้ง 4 ข้อ (เลือกวงกลมหน้ารายการที่ถูกต้อง):
                        </label>
                        {quizOptions.map((opt, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="correctOption"
                              checked={quizCorrectIndex === i}
                              onChange={() => setQuizCorrectIndex(i)}
                              className="w-4 h-4 text-emerald-600"
                              title="กำหนดเป็นคำตอบที่ถูกต้อง"
                            />
                            <span className="w-6 text-slate-500 font-bold font-mono">
                              {String.fromCharCode(65 + i)}.
                            </span>
                            <input
                              type="text"
                              required
                              value={opt}
                              onChange={(e) => {
                                const newOpts = [...quizOptions] as [string, string, string, string];
                                newOpts[i] = e.target.value;
                                setQuizOptions(newOpts);
                              }}
                              placeholder={`ตัวเลือก ${String.fromCharCode(65 + i)}`}
                              className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                            />
                            {quizCorrectIndex === i && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                                เฉลยข้อนี้
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">คำอธิบายเฉลย (Explanation)</label>
                        <textarea
                          rows={2}
                          value={quizExplanation}
                          onChange={(e) => setQuizExplanation(e.target.value)}
                          placeholder="อธิบายเหตุผลว่าทำไมคำตอบข้อนี้จึงถูกต้อง และมุมมองชวนคิดวิพากษ์..."
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddQuiz(false)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                        >
                          ยกเลิก
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-2xs"
                        >
                          บันทึกข้อสอบ
                        </button>
                      </div>
                    </form>
                  )}

                  {/* List of existing quizzes */}
                  <div className="space-y-3">
                    {selectedLesson?.quizzes.map((q, idx) => (
                      <div
                        key={q.id}
                        className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="font-bold text-slate-900 text-sm">
                            ข้อที่ {idx + 1}: {q.question}
                          </span>
                          <button
                            onClick={() => handleDeleteQuiz(q.id)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                            title="ลบข้อนี้"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                          {q.options.map((opt, i) => (
                            <div
                              key={i}
                              className={`p-2 rounded-lg border text-xs ${
                                i === q.correctIndex
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                                  : 'bg-white border-slate-200 text-slate-700'
                              }`}
                            >
                              <span className="font-bold mr-1.5">{String.fromCharCode(65 + i)}.</span>
                              {opt}
                            </div>
                          ))}
                        </div>

                        {q.explanation && (
                          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                            <span className="font-bold text-emerald-700">คำอธิบายเฉลย:</span>{' '}
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}

                    {(!selectedLesson?.quizzes || selectedLesson.quizzes.length === 0) && (
                      <div className="text-center py-8 text-slate-400 text-xs">
                        ยังไม่มีแบบทดสอบในบทเรียนนี้ คลิกปุ่ม "เพิ่มข้อสอบใหม่" ด้านบนเพื่อเริ่มสร้าง
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
