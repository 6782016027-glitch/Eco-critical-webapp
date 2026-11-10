/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { StudentWorksheetSubmission, StudentJournalSubmission } from '../../types/portal';
import {
  FileText,
  BookOpen,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Award,
  Sparkles,
  User,
  GraduationCap,
  ChevronRight,
  Save,
  Trash2,
  X,
  MessageSquare,
  HelpCircle,
  Eye,
  Send,
  Calendar,
} from 'lucide-react';

export const StudentSubmissionsDashboard: React.FC = () => {
  const {
    worksheetSubmissions,
    journalSubmissions,
    gradeWorksheet,
    gradeJournal,
    deleteWorksheetSubmission,
    deleteJournalSubmission,
  } = usePortal();

  // Filter and Search states
  const [activeTab, setActiveTab] = useState<'all' | 'worksheets' | 'journals'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'graded'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Submission for Detailed Inspection & Grading Modal
  const [selectedWorksheet, setSelectedWorksheet] = useState<StudentWorksheetSubmission | null>(null);
  const [selectedJournal, setSelectedJournal] = useState<StudentJournalSubmission | null>(null);

  // Grading form state for Worksheet
  const [wsScoreInput, setWsScoreInput] = useState<string>('');
  const [wsFeedbackInput, setWsFeedbackInput] = useState<string>('');
  const [wsSaveSuccess, setWsSaveSuccess] = useState(false);

  // Grading form state for Journal
  const [jnScoreInput, setJnScoreInput] = useState<string>('');
  const [jnFeedbackInput, setJnFeedbackInput] = useState<string>('');
  const [jnSaveSuccess, setJnSaveSuccess] = useState(false);

  // Open Worksheet Grading Modal
  const openWorksheetModal = (sub: StudentWorksheetSubmission) => {
    setSelectedWorksheet(sub);
    setWsScoreInput(sub.teacherScore !== undefined ? String(sub.teacherScore) : '');
    setWsFeedbackInput(sub.teacherFeedback || '');
    setWsSaveSuccess(false);
  };

  // Open Journal Grading Modal
  const openJournalModal = (jn: StudentJournalSubmission) => {
    setSelectedJournal(jn);
    setJnScoreInput(jn.teacherScore !== undefined ? String(jn.teacherScore) : '');
    setJnFeedbackInput(jn.teacherFeedback || '');
    setJnSaveSuccess(false);
  };

  // Handle Save Worksheet Grade
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

  // Handle Save Journal Grade
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

  // Filtered lists
  const filteredWorksheets = worksheetSubmissions.filter((sub) => {
    const matchSearch =
      sub.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.worksheetTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.gradeClass.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredJournals = journalSubmissions.filter((jn) => {
    const matchSearch =
      jn.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jn.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jn.caseStudyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jn.gradeClass.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'all' || jn.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Calculate stats
  const totalWsCount = worksheetSubmissions.length;
  const totalJnCount = journalSubmissions.length;
  const pendingWsCount = worksheetSubmissions.filter((s) => s.status === 'pending').length;
  const pendingJnCount = journalSubmissions.filter((j) => j.status === 'pending').length;
  const totalPending = pendingWsCount + pendingJnCount;
  const totalGraded = totalWsCount + totalJnCount - totalPending;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header Banner */}
      <div className="p-6 bg-white rounded-3xl border border-emerald-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>ศูนย์ตรวจประเมินผลการเรียนรู้ ม.ปลาย</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600" />
            <span>แดชบอร์ดคำตอบนักเรียน (Student Submissions Dashboard)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            รวบรวมคำตอบจาก "ใบงาน" และ "สมุดอนุทินสะท้อนคิดดิจิทัล" พร้อมระบบตรวจให้คะแนนและส่งข้อเสนอแนะรายบุคคล
          </p>
        </div>

        {/* Total Summary Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>รอตรวจ {totalPending} รายการ</span>
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>ตรวจแล้ว {totalGraded} รายการ</span>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-100 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">ใบงานที่ส่งแล้ว</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalWsCount} ชุด</div>
          <p className="text-[11px] text-emerald-700 mt-1 font-medium">รอตรวจ {pendingWsCount} ชุด</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-sky-100 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">สมุดอนุทินดิจิทัล</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalJnCount} บันทึก</div>
          <p className="text-[11px] text-sky-700 mt-1 font-medium">รอตรวจ {pendingJnCount} บันทึก</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-amber-100 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">สถานะรอตรวจให้คะแนน</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-700">{totalPending} รายการ</div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">ต้องการการประเมินจากครู</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-teal-100 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">ตรวจประเมินเสร็จสิ้น</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-teal-700">{totalGraded} รายการ</div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">ให้คะแนน & ข้อเสนอแนะแล้ว</p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 sm:p-5 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Main Category Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-2xl text-xs font-bold gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ทั้งหมด ({totalWsCount + totalJnCount})
            </button>
            <button
              onClick={() => setActiveTab('worksheets')}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'worksheets'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>คำตอบใบงาน ({totalWsCount})</span>
            </button>
            <button
              onClick={() => setActiveTab('journals')}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'journals'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>สมุดอนุทินสะท้อนคิด ({totalJnCount})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อนักเรียน, รหัส, ระดับชั้น..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Status Filter Badges */}
        <div className="flex items-center gap-2 text-xs pt-1">
          <span className="text-slate-400 font-bold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            สถานะการตรวจ:
          </span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ทั้งหมด
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              statusFilter === 'pending'
                ? 'bg-amber-600 text-white font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            รอการตรวจให้คะแนน ({totalPending})
          </button>
          <button
            onClick={() => setStatusFilter('graded')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              statusFilter === 'graded'
                ? 'bg-teal-600 text-white font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ตรวจแล้ว ({totalGraded})
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: WORKSHEET SUBMISSIONS TABLE                   */}
      {/* ======================================================== */}
      {(activeTab === 'all' || activeTab === 'worksheets') && (
        <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-base text-slate-900">
                รายการส่งคำตอบ "ใบงาน" (Worksheet Submissions)
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {filteredWorksheets.length} รายการ
              </span>
            </div>
          </div>

          {filteredWorksheets.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              ไม่พบรายการส่งใบงานที่ตรงกับเงื่อนไขการค้นหา
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">ชื่อนักเรียน / รหัส</th>
                    <th className="py-3 px-4">ระดับชั้น</th>
                    <th className="py-3 px-4">ชื่อใบงาน</th>
                    <th className="py-3 px-4">วันที่ส่ง</th>
                    <th className="py-3 px-4 text-center">สถานะ</th>
                    <th className="py-3 px-4 text-center">คะแนน</th>
                    <th className="py-3 px-4 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredWorksheets.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                            {sub.studentName.charAt(0)}
                          </div>
                          <div>
                            <div>{sub.studentName}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{sub.studentId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {sub.gradeClass}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800 max-w-xs truncate">
                        {sub.worksheetTitle}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-xs">
                        {sub.submittedAt}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            sub.status === 'graded'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {sub.status === 'graded' ? 'ตรวจแล้ว' : 'รอตรวจ'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap font-bold">
                        {sub.teacherScore !== undefined ? (
                          <span className="text-emerald-700 font-mono text-sm">
                            {sub.teacherScore} / {sub.maxScore}
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openWorksheetModal(sub)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                            <span>ตรวจคำตอบ</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`คุณต้องการลบรายการส่งใบงานของ ${sub.studentName} ใช่หรือไม่?`)) {
                                deleteWorksheetSubmission(sub.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="ลบรายการนี้"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* ======================================================== */}
      {/* SECTION 2: DIGITAL JOURNAL SUBMISSIONS TABLE             */}
      {/* ======================================================== */}
      {(activeTab === 'all' || activeTab === 'journals') && (
        <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-600" />
              <h3 className="font-extrabold text-base text-slate-900">
                รายการส่ง "สมุดอนุทินสะท้อนคิดดิจิทัล" (Digital Reflective Journals)
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                {filteredJournals.length} รายการ
              </span>
            </div>
          </div>

          {filteredJournals.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              ไม่พบรายการส่งสมุดอนุทินที่ตรงกับเงื่อนไขการค้นหา
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">ชื่อนักเรียน / รหัส</th>
                    <th className="py-3 px-4">ระดับชั้น</th>
                    <th className="py-3 px-4">กรณีศึกษาที่สะท้อนคิด</th>
                    <th className="py-3 px-4">วันที่บันทึก</th>
                    <th className="py-3 px-4 text-center">สถานะ</th>
                    <th className="py-3 px-4 text-center">คะแนน</th>
                    <th className="py-3 px-4 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredJournals.map((jn) => (
                    <tr key={jn.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs shrink-0">
                            {jn.studentName.charAt(0)}
                          </div>
                          <div>
                            <div>{jn.studentName}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{jn.studentId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {jn.gradeClass}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800 max-w-xs truncate">
                        {jn.caseStudyTitle}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-xs font-mono">
                        {jn.entryDate}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            jn.status === 'graded'
                              ? 'bg-teal-100 text-teal-800 border border-teal-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {jn.status === 'graded' ? 'ตรวจแล้ว' : 'รอตรวจ'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap font-bold">
                        {jn.teacherScore !== undefined ? (
                          <span className="text-teal-700 font-mono text-sm">
                            {jn.teacherScore} / {jn.maxScore}
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openJournalModal(jn)}
                            className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs border border-sky-200 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-sky-600" />
                            <span>ตรวจอนุทิน</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`คุณต้องการลบสมุดอนุทินของ ${jn.studentName} ใช่หรือไม่?`)) {
                                deleteJournalSubmission(jn.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="ลบรายการนี้"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: DETAILED WORKSHEET INSPECTION & GRADING         */}
      {/* ======================================================== */}
      {selectedWorksheet && (
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
                    ใบงานที่ {selectedWorksheet.worksheetNumber}
                  </span>
                  <span className="text-xs text-slate-500">{selectedWorksheet.submittedAt}</span>
                </div>
                <h3 className="font-black text-lg text-slate-900 mt-1">
                  {selectedWorksheet.worksheetTitle}
                </h3>
                <p className="text-xs text-slate-600">
                  นักเรียน: <strong>{selectedWorksheet.studentName}</strong> ({selectedWorksheet.gradeClass}) • รหัส: {selectedWorksheet.studentId}
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
                <HelpCircle className="w-4 h-4 text-emerald-600" />
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
                    <div className="p-3 bg-white rounded-xl border border-emerald-100 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                      {item.answer || <span className="text-slate-400 italic">ไม่ได้ระบุคำตอบ</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Grading Form */}
              <form onSubmit={handleSaveWorksheetGrade} className="pt-4 border-t border-slate-200 space-y-4">
                <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
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
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold font-mono focus:bg-white focus:outline-none focus:border-emerald-500"
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
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {wsSaveSuccess ? (
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>บันทึกผลการตรวจเรียบร้อยแล้ว!</span>
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">สถานะปัจจุบัน: {selectedWorksheet.status === 'graded' ? 'ตรวจแล้ว' : 'รอการตรวจ'}</span>
                  )}

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
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

      {/* ======================================================== */}
      {/* MODAL 2: DETAILED JOURNAL INSPECTION & GRADING           */}
      {/* ======================================================== */}
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
                  นักเรียน: <strong>{selectedJournal.studentName}</strong> ({selectedJournal.gradeClass}) • รหัส: {selectedJournal.studentId}
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
                    <span className="text-xs text-teal-700 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      <span>บันทึกผลการตรวจอนุทินเรียบร้อยแล้ว!</span>
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">สถานะปัจจุบัน: {selectedJournal.status === 'graded' ? 'ตรวจแล้ว' : 'รอการตรวจ'}</span>
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
    </div>
  );
};
