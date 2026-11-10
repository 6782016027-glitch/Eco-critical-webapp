/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  BookOpen,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  Layers,
  GraduationCap,
  FileText,
  Compass,
} from 'lucide-react';
import thaiStudentsBikeImg from '../../assets/images/thai_students_clean_air_bike_1794307914087.jpg';

export interface DiscussionAgendaItem {
  time: string;
  activity: string;
}

export interface DiscussionTopicSession {
  id: string;
  day: number; // Day of the month (e.g. 14, 18, 21)
  dateStr: string;
  timeStr: string;
  title: string;
  category: string;
  curriculumStandard: string;
  moderator: string;
  status: 'upcoming' | 'scheduled';
  keyQuestion: string;
  objective: string;
  readingPreparation: string;
  agendaItems: DiscussionAgendaItem[];
}

const DISCUSSION_SESSIONS: DiscussionTopicSession[] = [
  {
    id: 'session-1',
    day: 14,
    dateStr: '14 พฤศจิกายน 2569 (วันเสาร์)',
    timeStr: '14:00 - 15:30 น.',
    title: 'ร่าง พ.ร.บ. อากาศสะอาด และการกระจายต้นทุนมลพิษทางภูมิศาสตร์',
    category: 'นโยบายสาธารณะ & การจัดการสิ่งแวดล้อม',
    curriculumStandard: 'มาตรฐาน ส 5.2 (การจัดการสิ่งแวดล้อมเพื่อการพัฒนาที่ยั่งยืน)',
    moderator: 'ครูผู้สอนกลุ่มสาระภูมิศาสตร์',
    status: 'upcoming',
    keyQuestion:
      'หลักการผู้ก่อมลพิษเป็นผู้จ่าย (Polluter Pays Principle) ใน พ.ร.บ. อากาศสะอาด ควรจัดสรรภาษีมลพิษคืนสู่ชุมชนในพื้นที่แอ่งกระทะอย่างไรให้เป็นธรรม?',
    objective:
      'เข้าใจกลไกกฎหมายอากาศสะอาด วิเคราะห์ผลกระทบเชิงพื้นที่ และเสนอแนะแนวทางชดเชยแก่ชุมชนกลุ่มเปราะบาง',
    readingPreparation: 'เอกสารสรุปสาระสำคัญร่าง พ.ร.บ. อากาศสะอาด ฉบับประชาชน และข้อมูลดัชนี AQI ภาคเหนือ',
    agendaItems: [
      { time: '14:00 - 14:15 น.', activity: 'เปิดประเด็น: สรุปสถานการณ์มลพิษฝุ่น PM2.5 และสาระสำคัญร่างกฎหมาย' },
      { time: '14:15 - 14:45 น.', activity: 'อภิปรายกลุ่ม: การประเมินต้นทุนมลพิษข้ามเขตแดนและบทบาทกลุ่มทุนการเกษตร' },
      { time: '14:45 - 15:15 น.', activity: 'แลกเปลี่ยนข้อเสนอแนะเชิงนโยบายเพื่อนำไปจัดทำข้อเสนอของเยาวชน' },
      { time: '15:15 - 15:30 น.', activity: 'สรุปองค์ความรู้และบันทึกประเด็นสำคัญลงในสมุดอนุทิน' },
    ],
  },
  {
    id: 'session-2',
    day: 18,
    dateStr: '18 พฤศจิกายน 2569 (วันพุธ)',
    timeStr: '16:30 - 17:45 น.',
    title: 'สิทธิในอากาศสะอาด กับข้อจำกัดการใช้ที่ดินและวิถีเกษตรกรรมบนพื้นที่สูง',
    category: 'ปฏิสัมพันธ์มนุษย์กับสิ่งแวดล้อม',
    curriculumStandard: 'มาตรฐาน ส 5.2 (ปฏิสัมพันธ์ระหว่างมนุษย์กับสิ่งแวดล้อมทางกายภาพ)',
    moderator: 'ครูผู้สอนกลุ่มสาระภูมิศาสตร์',
    status: 'scheduled',
    keyQuestion:
      'นโยบายห้ามเผาเด็ดขาด 60 วัน ส่งผลกระทบต่อเศรษฐกิจชุมชนบนดอยอย่างไร และเครื่องมือภูมิสารสนเทศ (GIS/Hotspots) สามารถช่วยจัดการการเผาแบบควบคุมได้อย่างไร?',
    objective:
      'วิเคราะห์ความสัมพันธ์ระหว่างการใช้ที่ดินบนพื้นที่สูงกับปัญหามลพิษหมอกควัน พร้อมเสนอแนะเทคโนโลยีทางเลือกที่เป็นมิตรต่อสิ่งแวดล้อม',
    readingPreparation: 'แผนที่การใช้ที่ดิน (Land Use Map) และสถิติจุดความร้อนดาวเทียม VIIRS ย้อนหลัง 5 ปี',
    agendaItems: [
      { time: '16:30 - 16:40 น.', activity: 'ชี้แจงหัวข้อและกติกาการแลกเปลี่ยนทางวิชาการ' },
      { time: '16:40 - 17:15 น.', activity: 'อภิปรายเปรียบเทียบ: ข้อจำกัดเชิงภูมิศาสตร์ของเกษตรกร vs สิทธิในการหายใจของคนเมือง' },
      { time: '17:15 - 17:45 น.', activity: 'ตกผลึกแนวทางจัดการร่วม (Co-management) ระหว่างภาครัฐ ชุมชน และเอกชน' },
    ],
  },
  {
    id: 'session-3',
    day: 21,
    dateStr: '21 พฤศจิกายน 2569 (วันเสาร์)',
    timeStr: '10:00 - 11:30 น.',
    title: 'ธรณีสัณฐานแอ่งที่ราบ อุณหภูมิผกผัน และบทเรียนหมอกควันข้ามแดนในอาเซียน',
    category: 'ภูมิศาสตร์กายภาพและบรรยากาศ',
    curriculumStandard: 'มาตรฐาน ส 5.1 (ธรณีสัณฐานและสภาพบรรยากาศภาค)',
    moderator: 'ครูผู้สอนกลุ่มสาระภูมิศาสตร์',
    status: 'scheduled',
    keyQuestion:
      'ทำไมภูมิประเทศแบบแอ่งกระทะจึงเกิดปรากฏการณ์อุณหภูมิผกผัน (Inversion) ได้ง่าย และข้อตกลงอาเซียนว่าด้วยมลพิษจากหมอกควันข้ามแดน (AATHP) มีจุดแข็งจุดอ่อนอย่างไร?',
    objective:
      'อธิบายกลไกทางอุตุนิยมวิทยาของชั้นผกผันอุณหภูมิ และประเมินความร่วมมือระหว่างประเทศในภูมิภาคอาเซียน',
    readingPreparation: 'แบบจำลองภาพตัดขวางชั้นบรรยากาศแอ่งเชียงใหม่-ลำพูน และข้อตกลง AATHP',
    agendaItems: [
      { time: '10:00 - 10:25 น.', activity: 'ศึกษาแบบจำลองภูมิประเทศแอ่งที่ราบระหว่างภูเขาและการสะสมตัวของฝุ่น' },
      { time: '10:25 - 11:00 น.', activity: 'วิเคราะห์ข้อมูลทิศทางลมมรสุมและจุดความร้อนข้ามพรมแดนในภูมิภาคอาเซียน' },
      { time: '11:00 - 11:30 น.', activity: 'สรุปการวิเคราะห์เชิงวิพากษ์และประเมินประสิทธิผลของข้อตกลงระดับภูมิภาค' },
    ],
  },
];

// Days in November 2026 (Starts on Sunday = day 0)
const CALENDAR_DAYS_NOV_2026 = Array.from({ length: 30 }, (_, i) => i + 1);

interface LiveDiscussionScheduleProps {
  onOpenEtiquetteModal?: () => void;
}

export const LiveDiscussionSchedule: React.FC<LiveDiscussionScheduleProps> = ({
  onOpenEtiquetteModal,
}) => {
  const [selectedSessionId, setSelectedSessionId] = useState<string>('session-1');

  const selectedSession =
    DISCUSSION_SESSIONS.find((s) => s.id === selectedSessionId) || DISCUSSION_SESSIONS[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* ======================================================== */}
      {/* TOP HEADER: Clean Eco Banner with Thai Student Graphic   */}
      {/* ======================================================== */}
      <div className="p-6 sm:p-7 bg-white rounded-3xl border border-emerald-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4">
          <img
            src={thaiStudentsBikeImg}
            alt="นักเรียนมัธยมไทยร่วมกิจกรรมสิ่งแวดล้อม"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-300 shadow-xs shrink-0"
          />
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <Compass className="w-3.5 h-3.5 text-emerald-700" />
              <span>สาระภูมิศาสตร์ ม.ปลาย • มาตรฐาน ส 5.1 & ส 5.2</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              ปฏิทินและตารางนัดหมายการอภิปรายสด
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              กำหนดการเสวนาแลกเปลี่ยนความคิดเห็นด้านมลพิษทางอากาศ ภูมิศาสตร์กายภาพ และนโยบายสิ่งแวดล้อม
            </p>
          </div>
        </div>

        {onOpenEtiquetteModal && (
          <button
            onClick={onOpenEtiquetteModal}
            className="px-4 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold text-xs shadow-2xs transition-all flex items-center gap-2 shrink-0 cursor-pointer hover:scale-102"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>แนวปฏิบัติการอภิปราย</span>
          </button>
        )}
      </div>

      {/* ======================================================== */}
      {/* ส่วนที่ 1: ปฏิทิน (CALENDAR)                               */}
      {/* ======================================================== */}
      <section className="bg-white rounded-3xl border border-emerald-200/80 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <CalendarIcon className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>1) ปฏิทินนัดหมาย (Calendar)</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  พฤศจิกายน 2569
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                คลิกเลือกวันที่ไฮไลต์เพื่อดูรายละเอียดรอบการอภิปราย
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600 ring-2 ring-emerald-200" />
              <span>มีรอบนัดหมายอภิปราย</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-200" />
              <span>วันทั่วไป</span>
            </span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="w-full">
          {/* Day of Week Headers (Nov 1, 2026 starts on Sunday) */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 pb-2">
            <span className="text-rose-500">อา. (Sun)</span>
            <span>จ. (Mon)</span>
            <span>อ. (Tue)</span>
            <span>พ. (Wed)</span>
            <span>พฤ. (Thu)</span>
            <span>ศ. (Fri)</span>
            <span className="text-sky-600">ส. (Sat)</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {CALENDAR_DAYS_NOV_2026.map((day) => {
              const sessionOnThisDay = DISCUSSION_SESSIONS.find((s) => s.day === day);
              const isSelected = selectedSession?.day === day;

              if (sessionOnThisDay) {
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedSessionId(sessionOnThisDay.id)}
                    className={`h-16 sm:h-20 p-2 rounded-2xl flex flex-col justify-between items-start transition-all cursor-pointer border text-left ${
                      isSelected
                        ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-emerald-700 shadow-md scale-102 ring-2 ring-emerald-300'
                        : 'bg-emerald-50/90 text-emerald-950 border-emerald-300 hover:bg-emerald-100 hover:scale-101'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm sm:text-base font-black">{day}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-emerald-200 text-emerald-900'
                        }`}
                      >
                        เสวนา
                      </span>
                    </div>
                    <p
                      className={`text-[10px] sm:text-[11px] font-semibold line-clamp-1 ${
                        isSelected ? 'text-emerald-100' : 'text-emerald-800'
                      }`}
                    >
                      {sessionOnThisDay.timeStr.split(' - ')[0]}
                    </p>
                  </button>
                );
              }

              return (
                <div
                  key={day}
                  className="h-16 sm:h-20 p-2 rounded-2xl bg-slate-50/70 border border-slate-200/60 flex flex-col justify-between items-start text-slate-400"
                >
                  <span className="text-xs sm:text-sm font-semibold">{day}</span>
                  <span className="text-[10px] text-slate-300">-</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* ส่วนที่ 2: ตารางวันเวลานัดหมาย (SCHEDULE TABLE / AGENDA)   */}
      {/* ======================================================== */}
      <section className="bg-white rounded-3xl border border-emerald-200/80 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5 text-sky-700" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">
              2) ตารางวันเวลานัดหมาย (Schedule Table / Agenda List)
            </h2>
            <p className="text-xs text-slate-500">
              กำหนดการจัดสัมมนาสดทางวิชาการและลำดับกิจกรรมการอภิปราย
            </p>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">วัน / เดือน / ปี</th>
                <th className="py-3 px-4">เวลา</th>
                <th className="py-3 px-4">หัวข้อการอภิปราย</th>
                <th className="py-3 px-4">กลุ่มสาระภูมิศาสตร์</th>
                <th className="py-3 px-4">ผู้ดำเนินการ</th>
                <th className="py-3 px-4 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DISCUSSION_SESSIONS.map((session) => {
                const isSelected = session.id === selectedSession.id;
                return (
                  <tr
                    key={session.id}
                    onClick={() => setSelectedSessionId(session.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-50/80 font-semibold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {session.dateStr}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-800 whitespace-nowrap">
                      {session.timeStr}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs">
                      {session.title}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs">
                        {session.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {session.moderator}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                        {session.status === 'upcoming' ? 'รอบถัดไป' : 'ตามกำหนดการ'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Detailed Time-by-Time Agenda of the Selected Session */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-800">
              กำหนดการลำดับเวลา (Agenda Breakdown): <span className="text-emerald-800">{selectedSession.title}</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {selectedSession.agendaItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs"
              >
                <span className="font-mono text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">
                  {item.time}
                </span>
                <span className="text-xs text-slate-700 leading-relaxed font-medium">
                  {item.activity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* ส่วนที่ 3: หัวข้อการอภิปราย (DISCUSSION TOPICS)           */}
      {/* ======================================================== */}
      <section className="bg-white rounded-3xl border border-emerald-200/80 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5 text-teal-700" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">
              3) หัวข้อการอภิปราย (Discussion Topics / Agenda Subjects)
            </h2>
            <p className="text-xs text-slate-500">
              สาระสำคัญ ประเด็นคำถามเชิงวิพากษ์ และเอกสารเตรียมตัวก่อนเข้าฟังการเสวนา
            </p>
          </div>
        </div>

        {/* Topic Detail Grid for Selected Subject */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Key Question & Standard */}
          <div className="md:col-span-2 p-5 rounded-2xl bg-gradient-to-br from-emerald-50/60 via-teal-50/40 to-sky-50/60 border border-emerald-200/80 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-bold text-emerald-900">{selectedSession.curriculumStandard}</span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
              {selectedSession.title}
            </h3>

            {/* Key Critical Question */}
            <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span>คำถามสำคัญเชิงวิพากษ์ (Key Inquiry Question):</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold">
                "{selectedSession.keyQuestion}"
              </p>
            </div>

            {/* Learning Objective */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-600">เป้าหมายการเรียนรู้:</span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {selectedSession.objective}
              </p>
            </div>
          </div>

          {/* Card 2: Preparation Materials */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-2xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <FileText className="w-4 h-4 text-slate-500" />
                <span>เอกสารและสื่อเตรียมตัวล่วงหน้า</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {selectedSession.readingPreparation}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
              <p>ผู้ดำเนินการ: <strong>{selectedSession.moderator}</strong></p>
              <p>วันเวลา: <strong>{selectedSession.dateStr} ({selectedSession.timeStr})</strong></p>
            </div>
          </div>
        </div>

        {/* List of All 3 Discussion Topics Cards */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            รายการหัวข้อการอภิปรายทั้งหมด (3 หัวข้อหลัก):
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {DISCUSSION_SESSIONS.map((session, index) => (
              <div
                key={session.id}
                onClick={() => setSelectedSessionId(session.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  session.id === selectedSession.id
                    ? 'bg-emerald-50 border-emerald-300 shadow-2xs ring-2 ring-emerald-300'
                    : 'bg-white border-slate-200 hover:border-emerald-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-800">หัวข้อที่ {index + 1}</span>
                  <span className="text-[11px] text-slate-500 font-mono">{session.dateStr.split(' ')[0]} พ.ย.</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2">
                  {session.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {session.keyQuestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
