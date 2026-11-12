/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import {
  StudentWorksheetSubmission,
  StudentJournalSubmission,
  StudentQuizSubmission,
  ForumTopic,
} from '../../types/portal';
import {
  HelpCircle,
  FileText,
  BookOpen,
  MessageSquare,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Award,
  Sparkles,
  User,
  GraduationCap,
  Save,
  Trash2,
  X,
  Eye,
  Calendar,
  Send,
  CornerDownRight,
  Check,
  AlertCircle,
  ExternalLink,
  Download,
  FileSpreadsheet,
  FileDown,
  Layers,
} from 'lucide-react';
import {
  exportQuizSubmissionsToCSV,
  exportWorksheetSubmissionsToCSV,
  exportJournalSubmissionsToCSV,
  exportWebboardToCSV,
  exportAllSubmissionsToCSV,
} from '../../utils/csvExport';

export const StudentSubmissionsDashboard: React.FC = () => {
  const {
    quizSubmissions,
    worksheetSubmissions,
    journalSubmissions,
    forumTopics,
    gradeQuiz,
    gradeWorksheet,
    gradeJournal,
    deleteQuizSubmission,
    deleteWorksheetSubmission,
    deleteJournalSubmission,
    deleteTopic,
  } = usePortal();

  // 4 Primary Category Tabs requested by user
  type SubmissionCategory = 'quiz' | 'worksheets' | 'journals' | 'webboard';
  const [activeTab, setActiveTab] = useState<SubmissionCategory>('quiz');

  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'graded'>('all');

  // Export CSV Modal & Toast Feedback states
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportToast, setExportToast] = useState<string | null>(null);

  // Modal inspection states
  const [selectedQuiz, setSelectedQuiz] = useState<StudentQuizSubmission | null>(null);
  const [selectedWorksheet, setSelectedWorksheet] = useState<StudentWorksheetSubmission | null>(null);
  const [selectedJournal, setSelectedJournal] = useState<StudentJournalSubmission | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);

  // Grading form state for Quiz
  const [quizFeedbackInput, setQuizFeedbackInput] = useState<string>('');
  const [quizSaveSuccess, setQuizSaveSuccess] = useState(false);

  // Grading form state for Worksheet
  const [wsScoreInput, setWsScoreInput] = useState<string>('');
  const [wsFeedbackInput, setWsFeedbackInput] = useState<string>('');
  const [wsSaveSuccess, setWsSaveSuccess] = useState(false);

  // Grading form state for Journal
  const [jnScoreInput, setJnScoreInput] = useState<string>('');
  const [jnFeedbackInput, setJnFeedbackInput] = useState<string>('');
  const [jnSaveSuccess, setJnSaveSuccess] = useState(false);

  // Trigger feedback toast
  const triggerExportToast = (message: string) => {
    setExportToast(message);
    setTimeout(() => {
      setExportToast(null);
    }, 3500);
  };

  // Open Quiz Modal
  const openQuizModal = (quiz: StudentQuizSubmission) => {
    setSelectedQuiz(quiz);
    setQuizFeedbackInput(quiz.teacherFeedback || '');
    setQuizSaveSuccess(false);
  };

  // Open Worksheet Modal
  const openWorksheetModal = (sub: StudentWorksheetSubmission) => {
    setSelectedWorksheet(sub);
    setWsScoreInput(sub.teacherScore !== undefined ? String(sub.teacherScore) : '');
    setWsFeedbackInput(sub.teacherFeedback || '');
    setWsSaveSuccess(false);
  };

  // Open Journal Modal
  const openJournalModal = (jn: StudentJournalSubmission) => {
    setSelectedJournal(jn);
    setJnScoreInput(jn.teacherScore !== undefined ? String(jn.teacherScore) : '');
    setJnFeedbackInput(jn.teacherFeedback || '');
    setJnSaveSuccess(false);
  };

  // Save Quiz Feedback
  const handleSaveQuizFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuiz) return;
    gradeQuiz(selectedQuiz.id, quizFeedbackInput.trim());
    setSelectedQuiz({
      ...selectedQuiz,
      teacherFeedback: quizFeedbackInput.trim(),
      status: 'graded',
    });
    setQuizSaveSuccess(true);
    setTimeout(() => setQuizSaveSuccess(false), 2500);
  };

  // Save Worksheet Grade
  const handleSaveWorksheetGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorksheet) return;
    const parsedScore = parseFloat(wsScoreInput);
    const validScore = isNaN(parsedScore) ? 0 : Math.min(selectedWorksheet.maxScore, Math.max(0, parsedScore));
    gradeWorksheet(selectedWorksheet.id, validScore, wsFeedbackInput.trim());
    setSelectedWorksheet({
      ...selectedWorksheet,
      teacherScore: validScore,
      teacherFeedback: wsFeedbackInput.trim(),
      status: 'graded',
    });
    setWsSaveSuccess(true);
    setTimeout(() => setWsSaveSuccess(false), 2500);
  };

  // Save Journal Grade
  const handleSaveJournalGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJournal) return;
    const parsedScore = parseFloat(jnScoreInput);
    const validScore = isNaN(parsedScore) ? 0 : Math.min(selectedJournal.maxScore, Math.max(0, parsedScore));
    gradeJournal(selectedJournal.id, validScore, jnFeedbackInput.trim());
    setSelectedJournal({
      ...selectedJournal,
      teacherScore: validScore,
      teacherFeedback: jnFeedbackInput.trim(),
      status: 'graded',
    });
    setJnSaveSuccess(true);
    setTimeout(() => setJnSaveSuccess(false), 2500);
  };

  // 1. Filtered Quiz Submissions
  const filteredQuizzes = (quizSubmissions || []).filter((q) => {
    const matchSearch =
      q.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.username && q.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      q.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.lessonTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answers.some(
        (a) =>
          a.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.selectedOption.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchStatus = statusFilter === 'all' || q.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // 2. Filtered Worksheet Submissions
  const filteredWorksheets = (worksheetSubmissions || []).filter((w) => {
    const matchSearch =
      w.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.username && w.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      w.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.worksheetTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.answers.some(
        (a) =>
          a.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchStatus = statusFilter === 'all' || w.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // 3. Filtered Journal Submissions
  const filteredJournals = (journalSubmissions || []).filter((j) => {
    const matchSearch =
      j.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (j.username && j.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      j.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.caseStudyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.factsAndGeography.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.structuralCritique.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.policyAlternatives.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.personalReflection.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // 4. Filtered Webboard Submissions (Topics & Replies by Students)
  const filteredForumTopics = (forumTopics || []).filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.replies.some(
        (r) =>
          r.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchSearch;
  });

  // Summary counts
  const totalQuizzes = quizSubmissions?.length || 0;
  const totalWorksheets = worksheetSubmissions?.length || 0;
  const totalJournals = journalSubmissions?.length || 0;
  const totalWebboard = forumTopics?.length || 0;
  const grandTotal = totalQuizzes + totalWorksheets + totalJournals + totalWebboard;

  const pendingCount =
    (worksheetSubmissions?.filter((w) => w.status === 'pending').length || 0) +
    (journalSubmissions?.filter((j) => j.status === 'pending').length || 0) +
    (quizSubmissions?.filter((q) => q.status === 'pending').length || 0);

  const gradedCount =
    (worksheetSubmissions?.filter((w) => w.status === 'graded').length || 0) +
    (journalSubmissions?.filter((j) => j.status === 'graded').length || 0) +
    (quizSubmissions?.filter((q) => q.status === 'graded').length || 0);

  // Export handlers
  const handleExportCurrentTab = () => {
    if (activeTab === 'quiz') {
      exportQuizSubmissionsToCSV(filteredQuizzes.length > 0 ? filteredQuizzes : quizSubmissions);
      triggerExportToast(`ส่งออกผลควิซ (${filteredQuizzes.length > 0 ? filteredQuizzes.length : quizSubmissions.length} ชุด) เป็น CSV สำเร็จ`);
    } else if (activeTab === 'worksheets') {
      exportWorksheetSubmissionsToCSV(filteredWorksheets.length > 0 ? filteredWorksheets : worksheetSubmissions);
      triggerExportToast(`ส่งออกคำตอบใบงาน (${filteredWorksheets.length > 0 ? filteredWorksheets.length : worksheetSubmissions.length} ชุด) เป็น CSV สำเร็จ`);
    } else if (activeTab === 'journals') {
      exportJournalSubmissionsToCSV(filteredJournals.length > 0 ? filteredJournals : journalSubmissions);
      triggerExportToast(`ส่งออกสมุดอนุทิน (${filteredJournals.length > 0 ? filteredJournals.length : journalSubmissions.length} บันทึก) เป็น CSV สำเร็จ`);
    } else if (activeTab === 'webboard') {
      exportWebboardToCSV(filteredForumTopics.length > 0 ? filteredForumTopics : forumTopics);
      triggerExportToast(`ส่งออกกระทู้เว็บบอร์ด (${filteredForumTopics.length > 0 ? filteredForumTopics.length : forumTopics.length} กระทู้) เป็น CSV สำเร็จ`);
    }
  };

  const handleExportQuizOnly = () => {
    exportQuizSubmissionsToCSV(quizSubmissions);
    triggerExportToast(`ส่งออกผลควิซ (${quizSubmissions.length} ชุด) เป็น CSV สำเร็จ`);
    setShowExportModal(false);
  };

  const handleExportWorksheetsOnly = () => {
    exportWorksheetSubmissionsToCSV(worksheetSubmissions);
    triggerExportToast(`ส่งออกใบงาน (${worksheetSubmissions.length} ชุด) เป็น CSV สำเร็จ`);
    setShowExportModal(false);
  };

  const handleExportJournalsOnly = () => {
    exportJournalSubmissionsToCSV(journalSubmissions);
    triggerExportToast(`ส่งออกสมุดอนุทิน (${journalSubmissions.length} บันทึก) เป็น CSV สำเร็จ`);
    setShowExportModal(false);
  };

  const handleExportWebboardOnly = () => {
    exportWebboardToCSV(forumTopics);
    triggerExportToast(`ส่งออกกระทู้เว็บบอร์ด (${forumTopics.length} กระทู้) เป็น CSV สำเร็จ`);
    setShowExportModal(false);
  };

  const handleExportMasterAll = () => {
    exportAllSubmissionsToCSV(quizSubmissions, worksheetSubmissions, journalSubmissions, forumTopics);
    triggerExportToast(`ส่งออกรวมทุกประเภท (${grandTotal} รายการ) เป็น CSV สำเร็จ`);
    setShowExportModal(false);
  };

  const getActiveTabTitle = () => {
    switch (activeTab) {
      case 'quiz':
        return 'ควิซ (Quiz)';
      case 'worksheets':
        return 'ใบงาน (Worksheets)';
      case 'journals':
        return 'สมุดอนุทิน (Journal/Diary)';
      case 'webboard':
        return 'เว็บบอร์ด (Webboard)';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 relative">
      {/* Toast Notification */}
      {exportToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500/40 animate-in slide-in-from-bottom-4 duration-200">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs sm:text-sm text-emerald-300">ดาวน์โหลดเสร็จสมบูรณ์</div>
            <div className="text-[11px] text-slate-300">{exportToast}</div>
          </div>
        </div>
      )}

      {/* 1. Header Hero Card */}
      <div className="p-6 sm:p-7 bg-white rounded-3xl border border-emerald-200/80 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>ศูนย์ตรวจสอบและประเมินผลการเรียนรู้ของนักเรียน (Admin Submissions Inspection)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-600" />
            <span>แดชบอร์ดคำตอบนักเรียน (Student Submissions Dashboard)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            รวบรวมคำตอบของนักเรียนครบทั้ง 4 ด้าน: <strong>1. ควิซ (Quiz)</strong>, <strong>2. ใบงาน (Worksheets)</strong>, <strong>3. สมุดอนุทิน (Journal/Diary)</strong>, และ <strong>4. เว็บบอร์ด (Webboard)</strong> พร้อมระบบบันทึกคะแนนและส่งออกไฟล์ CSV
          </p>
        </div>

        {/* Global Stats Badges & Export Trigger */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            title="เปิดเมนูส่งออกคำตอบนักเรียนเป็นไฟล์ CSV"
          >
            <Download className="w-4 h-4" />
            <span>ส่งออก CSV (Export CSV)</span>
          </button>

          <div className="px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>รอตรวจ {pendingCount}</span>
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>ตรวจแล้ว {gradedCount}</span>
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>รวม {grandTotal}</span>
          </div>
        </div>
      </div>

      {/* 2. Primary 4 Category Tabs (Tabs แยกตาม 4 หัวข้อหลักอย่างชัดเจน) */}
      <div className="bg-white p-3 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {/* Tab 1: Quiz */}
          <button
            onClick={() => setActiveTab('quiz')}
            className={`p-3.5 sm:p-4 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between cursor-pointer group ${
              activeTab === 'quiz'
                ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-900/20 ring-2 ring-emerald-400/40'
                : 'bg-slate-50/80 hover:bg-emerald-50/60 border border-slate-200/80 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                  activeTab === 'quiz'
                    ? 'bg-white/20 text-white'
                    : 'bg-emerald-100 text-emerald-800 group-hover:bg-emerald-200'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
              </span>
              <span
                className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                  activeTab === 'quiz'
                    ? 'bg-white text-emerald-900'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {totalQuizzes} ชุด
              </span>
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base leading-tight">1. ควิซ (Quiz)</div>
              <p
                className={`text-[11px] mt-0.5 ${
                  activeTab === 'quiz' ? 'text-emerald-100' : 'text-slate-500'
                }`}
              >
                คำตอบแบบทดสอบย่อยท้ายบท
              </p>
            </div>
          </button>

          {/* Tab 2: Worksheets */}
          <button
            onClick={() => setActiveTab('worksheets')}
            className={`p-3.5 sm:p-4 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between cursor-pointer group ${
              activeTab === 'worksheets'
                ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-900/20 ring-2 ring-emerald-400/40'
                : 'bg-slate-50/80 hover:bg-emerald-50/60 border border-slate-200/80 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                  activeTab === 'worksheets'
                    ? 'bg-white/20 text-white'
                    : 'bg-teal-100 text-teal-800 group-hover:bg-teal-200'
                }`}
              >
                <FileText className="w-4 h-4" />
              </span>
              <span
                className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                  activeTab === 'worksheets'
                    ? 'bg-white text-teal-900'
                    : 'bg-teal-100 text-teal-800'
                }`}
              >
                {totalWorksheets} ชุด
              </span>
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base leading-tight">2. ใบงาน (Worksheets)</div>
              <p
                className={`text-[11px] mt-0.5 ${
                  activeTab === 'worksheets' ? 'text-teal-100' : 'text-slate-500'
                }`}
              >
                ใบงานวิเคราะห์ภูมิศาสตร์ & ข้อเสนอแนะ
              </p>
            </div>
          </button>

          {/* Tab 3: Journal/Diary */}
          <button
            onClick={() => setActiveTab('journals')}
            className={`p-3.5 sm:p-4 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between cursor-pointer group ${
              activeTab === 'journals'
                ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-900/20 ring-2 ring-emerald-400/40'
                : 'bg-slate-50/80 hover:bg-emerald-50/60 border border-slate-200/80 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                  activeTab === 'journals'
                    ? 'bg-white/20 text-white'
                    : 'bg-sky-100 text-sky-800 group-hover:bg-sky-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
              </span>
              <span
                className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                  activeTab === 'journals'
                    ? 'bg-white text-sky-900'
                    : 'bg-sky-100 text-sky-800'
                }`}
              >
                {totalJournals} บันทึก
              </span>
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base leading-tight">3. สมุดอนุทิน (Journal/Diary)</div>
              <p
                className={`text-[11px] mt-0.5 ${
                  activeTab === 'journals' ? 'text-sky-100' : 'text-slate-500'
                }`}
              >
                การสะท้อนคิด 4 มิติทางสิ่งแวดล้อม
              </p>
            </div>
          </button>

          {/* Tab 4: Webboard */}
          <button
            onClick={() => setActiveTab('webboard')}
            className={`p-3.5 sm:p-4 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between cursor-pointer group ${
              activeTab === 'webboard'
                ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-900/20 ring-2 ring-emerald-400/40'
                : 'bg-slate-50/80 hover:bg-emerald-50/60 border border-slate-200/80 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                  activeTab === 'webboard'
                    ? 'bg-white/20 text-white'
                    : 'bg-indigo-100 text-indigo-800 group-hover:bg-indigo-200'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
              </span>
              <span
                className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                  activeTab === 'webboard'
                    ? 'bg-white text-indigo-900'
                    : 'bg-indigo-100 text-indigo-800'
                }`}
              >
                {totalWebboard} กระทู้
              </span>
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base leading-tight">4. เว็บบอร์ด (Webboard)</div>
              <p
                className={`text-[11px] mt-0.5 ${
                  activeTab === 'webboard' ? 'text-indigo-100' : 'text-slate-500'
                }`}
              >
                คำตอบและการอภิปรายในเว็บบอร์ด
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 3. Search, Status Filter & Quick Export Toolbar */}
      <div className="p-4 sm:p-5 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อนักเรียน, username, หัวข้อคำถาม หรือเนื้อหาคำตอบ..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Quick Actions: Status Filter & CSV Export buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter buttons (for Quiz, Worksheets, Journal) */}
            {activeTab !== 'webboard' && (
              <div className="flex items-center gap-1 shrink-0 bg-slate-100 p-1 rounded-xl text-xs">
                <span className="text-slate-500 font-bold px-2 hidden sm:inline flex items-center gap-1">
                  <Filter className="w-3 h-3" />
                  สถานะ:
                </span>
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    statusFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ทั้งหมด
                </button>
                <button
                  onClick={() => setStatusFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    statusFilter === 'pending'
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  รอตรวจ
                </button>
                <button
                  onClick={() => setStatusFilter('graded')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    statusFilter === 'graded'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ตรวจแล้ว
                </button>
              </div>
            )}

            {/* Quick 1-click Download for Current Tab */}
            <button
              onClick={handleExportCurrentTab}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title={`ดาวน์โหลดคำตอบ ${getActiveTabTitle()} ในหน้านี้เป็นไฟล์ CSV`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span>ดาวน์โหลด CSV {getActiveTabTitle()}</span>
            </button>

            {/* Open Export Modal */}
            <button
              onClick={() => setShowExportModal(true)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer border border-slate-200"
              title="ตัวเลือกส่งออก CSV เพิ่มเติม"
            >
              <Download className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ควิซ (QUIZ SUBMISSIONS)                                            */}
      {/* Shows: Student Name/Username, Timestamp, Question Topic, Submitted Answer */}
      {/* ========================================================================= */}
      {activeTab === 'quiz' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-1 gap-2">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-600" />
              <span>รายการส่งผลการทำ "ควิซ (Quiz)"</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {filteredQuizzes.length} รายการ
              </span>
            </h3>

            {/* Section CSV Export Button */}
            <button
              onClick={handleExportQuizOnly}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-emerald-600" />
              <span>ส่งออกควิซทั้งหมด ({totalQuizzes} ชุด) เป็น CSV</span>
            </button>
          </div>

          {filteredQuizzes.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-sm">
              ไม่พบรายการส่งควิซที่ตรงกับการค้นหา
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="p-5 bg-white border border-slate-200 hover:border-emerald-300 rounded-3xl shadow-xs transition-all space-y-4"
                >
                  {/* Item Header: Student Info, Username, Timestamp, Score */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-black text-sm shrink-0">
                        {quiz.studentName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-sm sm:text-base text-slate-900">
                            {quiz.studentName}
                          </span>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            @{quiz.username || 'student'}
                          </span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {quiz.gradeClass}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {quiz.studentId}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>วันเวลาที่ส่ง:</span>
                          <strong className="text-slate-700">
                            {new Date(quiz.submittedAt).toLocaleString('th-TH')}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Score Badge and Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-mono font-black text-xs sm:text-sm">
                        คะแนน: {quiz.score} / {quiz.total}
                      </div>
                      <button
                        onClick={() => openQuizModal(quiz)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>ดูรายละเอียด & ให้คำแนะนำ</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`คุณต้องการลบผลควิซของ ${quiz.studentName} ใช่หรือไม่?`)) {
                            deleteQuizSubmission(quiz.id);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="ลบรายการนี้"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Question Topic & Submitted Answers Display */}
                  <div className="space-y-2.5">
                    <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>หัวข้อบทเรียน: {quiz.lessonTitle}</span>
                    </div>

                    {/* Answers list cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      {quiz.answers.map((ans, idx) => (
                        <div
                          key={ans.questionId || idx}
                          className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200 text-xs space-y-1.5"
                        >
                          <div className="font-bold text-slate-800 flex items-start gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="line-clamp-2">{ans.questionText}</span>
                          </div>

                          {/* Student Submitted Answer Callout */}
                          <div className="p-2.5 rounded-xl bg-white border border-emerald-200/80 text-slate-800 text-[11px] leading-relaxed">
                            <span className="text-slate-400 font-bold block mb-0.5">คำตอบที่นักเรียนเลือก:</span>
                            <div className="flex items-start gap-1.5 font-semibold text-slate-900">
                              {ans.isCorrect ? (
                                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              ) : (
                                <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                              )}
                              <span>{ans.selectedOption}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Teacher feedback if present */}
                    {quiz.teacherFeedback && (
                      <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>ข้อเสนอแนะจากครู:</strong> {quiz.teacherFeedback}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ใบงาน (WORKSHEET SUBMISSIONS)                                       */}
      {/* Shows: Student Name/Username, Timestamp, Question Topic, Submitted Answer */}
      {/* ========================================================================= */}
      {activeTab === 'worksheets' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-1 gap-2">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600" />
              <span>รายการส่ง "ใบงาน (Worksheets)"</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                {filteredWorksheets.length} รายการ
              </span>
            </h3>

            {/* Section CSV Export Button */}
            <button
              onClick={handleExportWorksheetsOnly}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-teal-600" />
              <span>ส่งออกใบงานทั้งหมด ({totalWorksheets} ชุด) เป็น CSV</span>
            </button>
          </div>

          {filteredWorksheets.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-sm">
              ไม่พบรายการส่งใบงานที่ตรงกับการค้นหา
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredWorksheets.map((sub) => (
                <div
                  key={sub.id}
                  className="p-5 bg-white border border-slate-200 hover:border-teal-300 rounded-3xl shadow-xs transition-all space-y-4"
                >
                  {/* Item Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-900 flex items-center justify-center font-black text-sm shrink-0">
                        {sub.studentName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-sm sm:text-base text-slate-900">
                            {sub.studentName}
                          </span>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            @{sub.username || sub.studentId.toLowerCase().replace(/[^a-z0-9]/g, '')}
                          </span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                            {sub.gradeClass}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">{sub.studentId}</span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>วันเวลาที่ส่ง:</span>
                          <strong className="text-slate-700">{sub.submittedAt}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Grading Status & Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <span
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                          sub.status === 'graded'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}
                      >
                        {sub.status === 'graded'
                          ? `คะแนน ${sub.teacherScore} / ${sub.maxScore}`
                          : 'รอตรวจให้คะแนน'}
                      </span>
                      <button
                        onClick={() => openWorksheetModal(sub)}
                        className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>ตรวจคำตอบ & ให้คะแนน</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`คุณต้องการลบรายการส่งใบงานของ ${sub.studentName} หรือไม่?`)) {
                            deleteWorksheetSubmission(sub.id);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="ลบรายการนี้"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Question Topic Heading */}
                  <div>
                    <div className="text-xs font-extrabold text-teal-900 flex items-center gap-1.5 mb-2">
                      <FileText className="w-4 h-4 text-teal-600" />
                      <span>{sub.worksheetTitle}</span>
                    </div>

                    {/* Submitted Answers List */}
                    <div className="space-y-2.5">
                      {sub.answers.map((ans, idx) => (
                        <div
                          key={ans.questionId || idx}
                          className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                        >
                          <div className="font-bold text-slate-900 flex items-start gap-1.5">
                            <span className="text-teal-700 font-mono font-bold">ข้อที่ {idx + 1}:</span>
                            <span>{ans.prompt}</span>
                          </div>

                          {/* Student's submitted text */}
                          <div className="p-3 bg-white rounded-xl border border-teal-100 text-slate-800 text-xs leading-relaxed font-medium">
                            <span className="text-slate-400 font-bold block text-[10px] mb-1">
                              คำตอบที่นักเรียนส่ง (Submitted Answer):
                            </span>
                            {ans.answer || <span className="text-slate-400 italic">ไม่ได้ระบุคำตอบ</span>}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Feedback if graded */}
                    {sub.teacherFeedback && (
                      <div className="mt-3 p-3 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>ข้อเสนอแนะจากครู:</strong> {sub.teacherFeedback}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: สมุดอนุทิน (JOURNAL/DIARY SUBMISSIONS)                               */}
      {/* Shows: Student Name/Username, Timestamp, Question Topic, Submitted Answer */}
      {/* ========================================================================= */}
      {activeTab === 'journals' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-1 gap-2">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-600" />
              <span>รายการส่ง "สมุดอนุทินสะท้อนคิดดิจิทัล (Journal/Diary)"</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
                {filteredJournals.length} รายการ
              </span>
            </h3>

            {/* Section CSV Export Button */}
            <button
              onClick={handleExportJournalsOnly}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-sky-50 text-sky-800 border border-sky-200 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-sky-600" />
              <span>ส่งออกสมุดอนุทินทั้งหมด ({totalJournals} บันทึก) เป็น CSV</span>
            </button>
          </div>

          {filteredJournals.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-sm">
              ไม่พบรายการส่งสมุดอนุทินที่ตรงกับการค้นหา
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredJournals.map((jn) => (
                <div
                  key={jn.id}
                  className="p-5 bg-white border border-slate-200 hover:border-sky-300 rounded-3xl shadow-xs transition-all space-y-4"
                >
                  {/* Item Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-900 flex items-center justify-center font-black text-sm shrink-0">
                        {jn.studentName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-sm sm:text-base text-slate-900">
                            {jn.studentName}
                          </span>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            @{jn.username || jn.studentId.toLowerCase().replace(/[^a-z0-9]/g, '')}
                          </span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                            {jn.gradeClass}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">{jn.studentId}</span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>วันเวลาที่ส่ง:</span>
                          <strong className="text-slate-700">{jn.entryDate}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Grading Status & Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <span
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                          jn.status === 'graded'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}
                      >
                        {jn.status === 'graded'
                          ? `คะแนน ${jn.teacherScore} / ${jn.maxScore}`
                          : 'รอตรวจให้คะแนน'}
                      </span>
                      <button
                        onClick={() => openJournalModal(jn)}
                        className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>ตรวจอนุทิน & ให้คะแนน</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`คุณต้องการลบสมุดอนุทินของ ${jn.studentName} หรือไม่?`)) {
                            deleteJournalSubmission(jn.id);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="ลบรายการนี้"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Question Topic Heading */}
                  <div>
                    <div className="text-xs font-extrabold text-sky-900 flex items-center gap-1.5 mb-2">
                      <BookOpen className="w-4 h-4 text-sky-600" />
                      <span>กรณีศึกษา: {jn.caseStudyTitle}</span>
                    </div>

                    {/* 4-Dimensional Submitted Answers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Dim 1 */}
                      <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                        <span className="text-[11px] font-bold text-emerald-900 block">
                          1. มิติภูมิศาสตร์กายภาพ (Facts & Geography)
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed bg-white p-2.5 rounded-xl border border-emerald-100/80">
                          {jn.factsAndGeography}
                        </p>
                      </div>

                      {/* Dim 2 */}
                      <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1">
                        <span className="text-[11px] font-bold text-amber-900 block">
                          2. การวิพากษ์เชิงโครงสร้าง (Structural Critique)
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed bg-white p-2.5 rounded-xl border border-amber-100/80">
                          {jn.structuralCritique}
                        </p>
                      </div>

                      {/* Dim 3 */}
                      <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-1">
                        <span className="text-[11px] font-bold text-sky-900 block">
                          3. ทางเลือกเชิงนโยบาย (Policy Alternatives)
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed bg-white p-2.5 rounded-xl border border-sky-100/80">
                          {jn.policyAlternatives}
                        </p>
                      </div>

                      {/* Dim 4 */}
                      <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1">
                        <span className="text-[11px] font-bold text-purple-900 block">
                          4. การสะท้อนคิดของตนเอง (Personal Reflection)
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed bg-white p-2.5 rounded-xl border border-purple-100/80">
                          {jn.personalReflection}
                        </p>
                      </div>
                    </div>

                    {/* Feedback if graded */}
                    {jn.teacherFeedback && (
                      <div className="mt-3 p-3 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-900 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>ข้อเสนอแนะจากครู:</strong> {jn.teacherFeedback}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: เว็บบอร์ด (WEBBOARD SUBMISSIONS)                                     */}
      {/* Shows: Student Name/Username, Timestamp, Question Topic, Submitted Answer */}
      {/* ========================================================================= */}
      {activeTab === 'webboard' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-1 gap-2">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              <span>รายการกระทู้และคำตอบใน "เว็บบอร์ด (Webboard Discussions)"</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                {filteredForumTopics.length} กระทู้
              </span>
            </h3>

            {/* Section CSV Export Button */}
            <button
              onClick={handleExportWebboardOnly}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-indigo-600" />
              <span>ส่งออกกระทู้เว็บบอร์ดทั้งหมด ({totalWebboard} กระทู้) เป็น CSV</span>
            </button>
          </div>

          {filteredForumTopics.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-sm">
              ไม่พบกระทู้หรือความคิดเห็นที่ตรงกับการค้นหา
            </div>
          ) : (
            <div className="space-y-4">
              {filteredForumTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="p-5 bg-white border border-slate-200 hover:border-indigo-300 rounded-3xl shadow-xs transition-all space-y-4"
                >
                  {/* Topic Header: Student Author Info & Timestamp */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-900 flex items-center justify-center font-black text-sm shrink-0">
                        {topic.authorName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-sm sm:text-base text-slate-900">
                            {topic.authorName}
                          </span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                            บทบาท: {topic.authorRole === 'student' ? 'นักเรียน' : topic.authorRole}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>วันเวลาที่ส่ง/ตั้งกระทู้:</span>
                          <strong className="text-slate-700">
                            {new Date(topic.createdAt).toLocaleString('th-TH')}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1">
                        💬 {topic.replies.length} คำตอบในกระทู้
                      </span>
                      <button
                        onClick={() => setSelectedTopic(topic)}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>เปิดดูกระทู้ฉบับเต็ม</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`คุณต้องการลบกระทู้ "${topic.title}" ใช่หรือไม่?`)) {
                            deleteTopic(topic.id);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="ลบกระทู้นี้"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Question Topic / Prompt */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-indigo-800 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                      <span>หัวข้อคำถาม/ประเด็นการอภิปราย (Topic Prompt):</span>
                    </div>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                      {topic.title}
                    </h4>

                    {/* Submitted discussion content by student */}
                    <div className="p-3.5 rounded-2xl bg-indigo-50/40 border border-indigo-100 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                      <span className="text-indigo-900/60 font-bold block text-[10px] mb-1">
                        คำตอบ/ข้อคิดเห็นที่ส่ง (Student's Submission):
                      </span>
                      {topic.content}
                    </div>

                    {/* Student Replies Preview if any */}
                    {topic.replies.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <span className="text-[11px] font-bold text-slate-500 block">
                          คำตอบและความคิดเห็นของผู้เรียนในกระทู้นี้ ({topic.replies.length} รายการ):
                        </span>
                        <div className="space-y-2">
                          {topic.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-start gap-2.5"
                            >
                              <CornerDownRight className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <strong className="text-slate-900">{reply.authorName}</strong>
                                  <span className="text-[10px] font-mono text-slate-400">
                                    {new Date(reply.createdAt).toLocaleDateString('th-TH')}
                                  </span>
                                </div>
                                <p className="text-slate-700 leading-relaxed">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* EXPORT OPTIONS MODAL (ตัวเลือกการส่งออกไฟล์ CSV ทั้งหมด)                     */}
      {/* ========================================================================= */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div
            className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col text-slate-800 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-b border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-900/20">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">
                    ส่งออกคำตอบนักเรียนเป็นไฟล์ CSV (Export Submissions)
                  </h3>
                  <p className="text-xs text-slate-500">
                    ดาวน์โหลดคำตอบนักเรียนในรูปแบบไฟล์ CSV พร้อมรองรับภาษาไทยสำหรับ Excel สมบูรณ์
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowExportModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Options List */}
            <div className="p-6 space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  ไฟล์ CSV มีการแนบ <strong>UTF-8 BOM</strong> ทำให้เปิดด้วย <strong>Microsoft Excel, Google Sheets, และ Apple Numbers</strong> ภาษาไทยจะไม่เป็นภาษาต่างดาว
                </span>
              </div>

              {/* Master Combined Export */}
              <div
                onClick={handleExportMasterAll}
                className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-700 to-sky-700 hover:from-emerald-700 hover:to-sky-800 text-white shadow-md shadow-emerald-950/20 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-emerald-100 text-[11px] font-bold">
                    <Layers className="w-3.5 h-3.5" />
                    <span>รวมทุกประเภท (Master Combined CSV)</span>
                  </div>
                  <h4 className="font-extrabold text-base sm:text-lg">
                    ส่งออกคำตอบทุกด้านรวมในไฟล์เดียว (All Responses CSV)
                  </h4>
                  <p className="text-xs text-emerald-100/90 leading-relaxed">
                    รวมทั้ง ควิซ, ใบงาน, สมุดอนุทินสะท้อนคิด และเว็บบอร์ด ({grandTotal} รายการ)
                  </p>
                </div>

                <div className="w-10 h-10 rounded-xl bg-white/20 group-hover:bg-white text-white group-hover:text-emerald-800 flex items-center justify-center shrink-0 transition-colors">
                  <Download className="w-5 h-5" />
                </div>
              </div>

              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-2">
                เลือกส่งออกแยกตามหมวดหมู่ (Export by Category):
              </div>

              {/* 4 Individual Category Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Quiz Option */}
                <div
                  onClick={handleExportQuizOnly}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition-all cursor-pointer shadow-2xs group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-800">
                        1. ควิซ (Quiz CSV)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {totalQuizzes} ชุด • คำตอบและคะแนนรายข้อ
                      </div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-700" />
                </div>

                {/* 2. Worksheets Option */}
                <div
                  onClick={handleExportWorksheetsOnly}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/40 transition-all cursor-pointer shadow-2xs group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-slate-900 group-hover:text-teal-800">
                        2. ใบงาน (Worksheets CSV)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {totalWorksheets} ชุด • คำตอบและคะแนนครู
                      </div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-teal-700" />
                </div>

                {/* 3. Journals Option */}
                <div
                  onClick={handleExportJournalsOnly}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-sky-400 hover:bg-sky-50/40 transition-all cursor-pointer shadow-2xs group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-slate-900 group-hover:text-sky-800">
                        3. สมุดอนุทิน (Journals CSV)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {totalJournals} บันทึก • ครบ 4 มิติสะท้อนคิด
                      </div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-sky-700" />
                </div>

                {/* 4. Webboard Option */}
                <div
                  onClick={handleExportWebboardOnly}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition-all cursor-pointer shadow-2xs group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-800">
                        4. เว็บบอร์ด (Webboard CSV)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {totalWebboard} กระทู้ • เนื้อหาและความเห็น
                      </div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-700" />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                พร้อมใช้งานสำหรับบทเรียนสาระภูมิศาสตร์ ม.ปลาย
              </span>
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: DETAILED QUIZ INSPECTION & TEACHER FEEDBACK                      */}
      {/* ========================================================================= */}
      {selectedQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div
            className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-b border-emerald-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    ผลการทำควิซ (Quiz Results)
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(selectedQuiz.submittedAt).toLocaleString('th-TH')}
                  </span>
                </div>
                <h3 className="font-black text-lg text-slate-900 mt-1">
                  {selectedQuiz.lessonTitle}
                </h3>
                <p className="text-xs text-slate-600">
                  นักเรียน: <strong>{selectedQuiz.studentName}</strong> (@{selectedQuiz.username}) • ชั้น {selectedQuiz.gradeClass} • รหัส {selectedQuiz.studentId}
                </p>
              </div>

              <button
                onClick={() => setSelectedQuiz(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Quiz Questions & Answers */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-sm font-bold text-emerald-950">คะแนนที่ได้รวม:</span>
                <span className="text-xl font-black font-mono text-emerald-700">
                  {selectedQuiz.score} / {selectedQuiz.total} ข้อ
                </span>
              </div>

              <div className="space-y-4">
                {selectedQuiz.answers.map((item, idx) => (
                  <div
                    key={item.questionId || idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs sm:text-sm"
                  >
                    <div className="font-bold text-slate-900 flex items-start gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{item.questionText}</span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-500">คำตอบที่นักเรียนเลือก:</span>
                        {item.isCorrect ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> ถูกต้อง
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold flex items-center gap-1">
                            <X className="w-3 h-3" /> ไม่ถูกต้อง
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-slate-900">{item.selectedOption}</p>
                      {!item.isCorrect && (
                        <p className="text-[11px] text-emerald-700 font-semibold pt-1">
                          เฉลยที่ถูกต้อง: {item.correctOption}
                        </p>
                      )}
                      {item.explanation && (
                        <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                          คำอธิบายทางภูมิศาสตร์: {item.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Feedback Form */}
              <form onSubmit={handleSaveQuizFeedback} className="pt-4 border-t border-slate-200 space-y-4">
                <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>บันทึกข้อเสนอแนะของครู (Teacher Feedback):</span>
                </h4>

                <textarea
                  rows={2}
                  value={quizFeedbackInput}
                  onChange={(e) => setQuizFeedbackInput(e.target.value)}
                  placeholder="พิมพ์ข้อชี้แนะหรือคำชมเชยแก่นักเรียนสำหรับการทำควิซชุดนี้..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-emerald-500"
                />

                <div className="flex items-center justify-between pt-1">
                  {quizSaveSuccess ? (
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>บันทึกข้อเสนอแนะควิซสำเร็จ!</span>
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">สถานะ: บันทึกเข้าประวัตินักเรียน</span>
                  )}

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>บันทึกข้อเสนอแนะ</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: DETAILED WORKSHEET INSPECTION & GRADING                          */}
      {/* ========================================================================= */}
      {selectedWorksheet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div
            className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-teal-50 via-emerald-50 to-sky-50 border-b border-teal-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                    ใบงานที่ {selectedWorksheet.worksheetNumber}
                  </span>
                  <span className="text-xs text-slate-500">{selectedWorksheet.submittedAt}</span>
                </div>
                <h3 className="font-black text-lg text-slate-900 mt-1">
                  {selectedWorksheet.worksheetTitle}
                </h3>
                <p className="text-xs text-slate-600">
                  นักเรียน: <strong>{selectedWorksheet.studentName}</strong> (@{selectedWorksheet.username || selectedWorksheet.studentId}) • {selectedWorksheet.gradeClass}
                </p>
              </div>

              <button
                onClick={() => setSelectedWorksheet(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Student Answers List */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5 border-b pb-2">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>คำตอบของนักเรียนรายข้อ:</span>
              </h4>

              <div className="space-y-4">
                {selectedWorksheet.answers.map((item, index) => (
                  <div
                    key={item.questionId || index}
                    className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2"
                  >
                    <div className="text-xs font-bold text-slate-900">
                      {item.prompt}
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-teal-100 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                      {item.answer || <span className="text-slate-400 italic">ไม่ได้ระบุคำตอบ</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Grading Form */}
              <form onSubmit={handleSaveWorksheetGrade} className="pt-4 border-t border-slate-200 space-y-4">
                <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-teal-600" />
                  <span>การประเมินและให้ข้อเสนอแนะครู (Teacher Assessment):</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      คะแนนที่ได้ (เต็ม {selectedWorksheet.maxScore}) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max={selectedWorksheet.maxScore}
                      value={wsScoreInput}
                      onChange={(e) => setWsScoreInput(e.target.value)}
                      placeholder="เช่น 9.5"
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold font-mono focus:bg-white focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ข้อเสนอแนะจากคุณครู (Teacher Feedback)
                    </label>
                    <textarea
                      rows={2}
                      value={wsFeedbackInput}
                      onChange={(e) => setWsFeedbackInput(e.target.value)}
                      placeholder="พิมพ์คำชมเชยหรือข้อชี้แนะเพื่อพัฒนาต่อยอด..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {wsSaveSuccess ? (
                    <span className="text-xs text-teal-700 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      <span>บันทึกผลการตรวจเรียบร้อยแล้ว!</span>
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">
                      สถานะ: {selectedWorksheet.status === 'graded' ? 'ตรวจแล้ว' : 'รอการตรวจ'}
                    </span>
                  )}

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>บันทึกผลการตรวจใบงาน</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: DETAILED JOURNAL INSPECTION & GRADING                            */}
      {/* ========================================================================= */}
      {selectedJournal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div
            className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-sky-50 via-teal-50 to-emerald-50 border-b border-sky-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
                    สมุดอนุทินสะท้อนคิดดิจิทัล
                  </span>
                  <span className="text-xs text-slate-500 font-mono">{selectedJournal.entryDate}</span>
                </div>
                <h3 className="font-black text-lg text-slate-900 mt-1">
                  กรณีศึกษา: {selectedJournal.caseStudyTitle}
                </h3>
                <p className="text-xs text-slate-600">
                  นักเรียน: <strong>{selectedJournal.studentName}</strong> (@{selectedJournal.username || selectedJournal.studentId}) • {selectedJournal.gradeClass}
                </p>
              </div>

              <button
                onClick={() => setSelectedJournal(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: 4-Dimensional Reflections */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5 border-b pb-2">
                <BookOpen className="w-4 h-4 text-sky-600" />
                <span>การสะท้อนคิด 4 มิติทางภูมิศาสตร์สิ่งแวดล้อม:</span>
              </h4>

              {/* Dim 1: Facts & Geography */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1.5">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <span>1. ข้อเท็จจริงและมิติภูมิศาสตร์กายภาพ (Facts & Geography)</span>
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium bg-white p-3 rounded-xl border border-emerald-100/60">
                  {selectedJournal.factsAndGeography}
                </p>
              </div>

              {/* Dim 2: Structural Critique */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-1.5">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <span>2. การวิพากษ์เชิงโครงสร้างและความยุติธรรม (Structural Critique)</span>
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium bg-white p-3 rounded-xl border border-amber-100/60">
                  {selectedJournal.structuralCritique}
                </p>
              </div>

              {/* Dim 3: Policy Alternatives */}
              <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-1.5">
                <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                  <span>3. ทางเลือกเชิงนโยบายและนวัตกรรมชุมชน (Policy Alternatives)</span>
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium bg-white p-3 rounded-xl border border-sky-100/60">
                  {selectedJournal.policyAlternatives}
                </p>
              </div>

              {/* Dim 4: Personal Reflection */}
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1.5">
                <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                  <span>4. การสะท้อนคิดและการเรียนรู้ของตนเอง (Personal Reflection)</span>
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium bg-white p-3 rounded-xl border border-purple-100/60">
                  {selectedJournal.personalReflection}
                </p>
              </div>

              {/* AI Feedback if available */}
              {selectedJournal.aiFeedback && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block mb-0.5">ข้อเสนอแนะเบื้องต้นจาก Eco bot:</strong>
                    <span>{selectedJournal.aiFeedback}</span>
                  </div>
                </div>
              )}

              {/* Grading Form */}
              <form onSubmit={handleSaveJournalGrade} className="pt-4 border-t border-slate-200 space-y-4">
                <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-sky-600" />
                  <span>การประเมินและให้ข้อเสนอแนะครู (Teacher Assessment):</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      คะแนนที่ได้ (เต็ม {selectedJournal.maxScore}) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max={selectedJournal.maxScore}
                      value={jnScoreInput}
                      onChange={(e) => setJnScoreInput(e.target.value)}
                      placeholder="เช่น 10.0"
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold font-mono focus:bg-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ข้อเสนอแนะจากคุณครู (Teacher Feedback)
                    </label>
                    <textarea
                      rows={2}
                      value={jnFeedbackInput}
                      onChange={(e) => setJnFeedbackInput(e.target.value)}
                      placeholder="พิมพ์ข้อคิดเห็นหรือประเด็นชวนวิพากษ์เพิ่มเติมแก่นักเรียน..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {jnSaveSuccess ? (
                    <span className="text-xs text-sky-700 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-sky-600" />
                      <span>บันทึกผลการตรวจอนุทินเรียบร้อยแล้ว!</span>
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">
                      สถานะ: {selectedJournal.status === 'graded' ? 'ตรวจแล้ว' : 'รอการตรวจ'}
                    </span>
                  )}

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-700 hover:from-sky-700 hover:to-teal-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>บันทึกผลการตรวจสมุดอนุทิน</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: FULL WEBBOARD TOPIC & DISCUSSION VIEWER                          */}
      {/* ========================================================================= */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div
            className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 via-teal-50 to-emerald-50 border-b border-indigo-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                    เว็บบอร์ดการอภิปราย (Webboard Discussion)
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(selectedTopic.createdAt).toLocaleString('th-TH')}
                  </span>
                </div>
                <h3 className="font-black text-lg text-slate-900 mt-1">
                  {selectedTopic.title}
                </h3>
                <p className="text-xs text-slate-600">
                  ผู้โพสต์: <strong>{selectedTopic.authorName}</strong> ({selectedTopic.authorRole})
                </p>
              </div>

              <button
                onClick={() => setSelectedTopic(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* Topic Prompt & Content */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                <span className="text-xs font-bold text-indigo-900 block">
                  เนื้อหากระทู้ / คำตอบที่ตั้งโดยนักเรียน:
                </span>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium bg-white p-3.5 rounded-xl border border-indigo-100">
                  {selectedTopic.content}
                </p>
              </div>

              {/* Replies list */}
              <div className="space-y-3 pt-2">
                <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5 border-b pb-2">
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  <span>การตอบกลับและการอภิปราย ({selectedTopic.replies.length} ข้อความ):</span>
                </h4>

                {selectedTopic.replies.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    ยังไม่มีข้อความตอบกลับในกระทู้นี้
                  </div>
                ) : (
                  selectedTopic.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <strong className="text-slate-900">{reply.authorName}</strong>
                        <span>{new Date(reply.createdAt).toLocaleString('th-TH')}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed pt-1">{reply.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedTopic(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
