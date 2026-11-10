/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Video,
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  Plus,
  Send,
  AlertCircle,
  BookOpen,
  Sparkles,
  ChevronRight,
  UserCheck,
  Bell,
  Heart,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

export interface DiscussionSession {
  id: string;
  title: string;
  topicCategory: string;
  dateStr: string;
  timeStr: string;
  moderator: string;
  status: 'upcoming' | 'live' | 'completed';
  attendeesCount: number;
  isRegistered: boolean;
  agenda: string[];
  keyQuestion: string;
  meetLink?: string;
}

const INITIAL_SESSIONS: DiscussionSession[] = [
  {
    id: 'live_01',
    title: 'สัมมนาสด: ร่าง พ.ร.บ. อากาศสะอาด ใครควรเป็นผู้รับผิดชอบต้นทุนมลพิษ?',
    topicCategory: 'นโยบายสาธารณะ & เศรษฐศาสตร์สิ่งแวดล้อม',
    dateStr: '2026-11-14 (วันเสาร์)',
    timeStr: '14:00 - 15:30 น.',
    moderator: 'Teacher (ครูภูมิศาสตร์)',
    status: 'upcoming',
    attendeesCount: 28,
    isRegistered: true,
    agenda: [
      '14:00 - 14:15: บรรยายสรุปสาระสำคัญของร่าง พ.ร.บ. อากาศสะอาด',
      '14:15 - 14:45: แบ่งกลุ่มย่อยวิเคราะห์หลักการ Polluter Pays Principle',
      '14:45 - 15:20: อภิปรายสดเปิดไมค์ ชวนคิดวิพากษ์มาตรการลงโทษกลุ่มทุนข้ามพรมแดน',
      '15:20 - 15:30: สรุปประเด็นสะท้อนคิดลงในสมุดอนุทินดิจิทัล',
    ],
    keyQuestion: 'หากเก็บภาษีคาร์บอนและภาษีมลพิษสูงขึ้น จะส่งผลกระทบต่อราคาสินค้าอุปโภคบริโภคของประชาชนทั่วไปหรือไม่ และรัฐควรมีตาข่ายรองรับอย่างไร?',
    meetLink: 'https://meet.google.com/eco-critical-hs',
  },
  {
    id: 'live_02',
    title: 'ห้องถกเถียง: สิทธิในอากาศสะอาด vs ข้อจำกัดการทำกินของเกษตรกรบนพื้นที่สูง',
    topicCategory: 'ความยุติธรรมทางสิ่งแวดล้อม (Environmental Justice)',
    dateStr: '2026-11-18 (วันพุธ)',
    timeStr: '16:30 - 17:45 น.',
    moderator: 'Teacher (ครู)',
    status: 'upcoming',
    attendeesCount: 19,
    isRegistered: false,
    agenda: [
      '16:30 - 16:40: ตรวจสอบความพร้อมและทบทวนกฎกติกาการสื่อสารอภิปราย',
      '16:40 - 17:15: ตัวแทนนักเรียนนำเสนอมุมมองฝ่ายคนเมือง vs ฝ่ายชุมชนเกษตรบนดอย',
      '17:15 - 17:45: แสวงหาจุดร่วม: เทคโนโลยีทางเลือกและการสนับสนุนงบประมาณที่เป็นธรรม',
    ],
    keyQuestion: 'ทำไมนโยบายห้ามเผาเด็ดขาด 60 วันจึงถูกวิพากษ์ว่าผลักภาระให้คนจน และเราสามารถออกแบบมาตรการจูงใจที่เป็นบวกแทนการลงโทษได้อย่างไร?',
  },
  {
    id: 'live_03',
    title: 'Socratic Dialogue: ถอดบทเรียนมหาหมอกควันลอนดอน 1952 สู่แอ่งเชียงใหม่ 2026',
    topicCategory: 'ภูมิศาสตร์ประวัติศาสตร์ & อุตุนิยมวิทยา',
    dateStr: '2026-11-21 (วันเสาร์)',
    timeStr: '10:00 - 11:30 น.',
    moderator: 'Teacher (ครู)',
    status: 'upcoming',
    attendeesCount: 34,
    isRegistered: false,
    agenda: [
      '10:00 - 10:20: เปรียบเทียบปรากฏการณ์ Anticyclone และ Inversion ในลอนดอนกับภาคเหนือ',
      '10:20 - 10:55: วิเคราะห์ว่าทำไมอังกฤษต้องใช้เวลาถึง 4 ปีกว่าจะออก Clean Air Act 1956',
      '10:55 - 11:30: บทบาทของเยาวชนในการผลักดันให้เกิดการเปลี่ยนแปลงเชิงโครงสร้าง',
    ],
    keyQuestion: 'อะไรคืออุปสรรคสำคัญทางการเมืองและเศรษฐกิจที่ทำให้การแก้ปัญหามลพิษในปัจจุบันล่าช้ากว่าที่ควรจะเป็น?',
  },
];

interface LiveDiscussionScheduleProps {
  onOpenEtiquetteModal: () => void;
}

export const LiveDiscussionSchedule: React.FC<LiveDiscussionScheduleProps> = ({
  onOpenEtiquetteModal,
}) => {
  const { currentUser } = usePortal();
  const [sessions, setSessions] = useState<DiscussionSession[]>(INITIAL_SESSIONS);
  const [filter, setFilter] = useState<'all' | 'registered'>('all');
  const [selectedSessionId, setSelectedSessionId] = useState<string>(INITIAL_SESSIONS[0].id);
  const [inLiveRoom, setInLiveRoom] = useState(false);

  // Live Room Chat Mock
  const [liveChatMessages, setLiveChatMessages] = useState<
    Array<{ id: string; sender: string; role: string; text: string; time: string }>
  >([
    {
      id: 'm1',
      sender: 'Teacher (ครู)',
      role: 'teacher',
      text: 'ยินดีต้อนรับนักเรียน ม.ปลาย ทุกคนเข้าสู่ห้องอภิปรายสด ขอความร่วมมือปฏิบัติตามกฎกติกามารยาทการอภิปรายที่ตกลงกันไว้นะครับ',
      time: '14:02',
    },
    {
      id: 'm2',
      sender: 'นายนภัทร (ม.5/1)',
      role: 'student',
      text: 'ผมคิดว่าหากจะเก็บภาษีคาร์บอน ต้องแยกแยะระหว่างเกษตรกรรายย่อยกับกลุ่มทุนเกษตรพันธสัญญาครับ เพราะเกษตรกรต้นทุนชีวิตต่ำกว่ามาก',
      time: '14:05',
    },
    {
      id: 'm3',
      sender: 'Teacher (ครู)',
      role: 'teacher',
      text: 'ดีมากครับนภัทร ตรงกับหลักความยุติธรรมทางสิ่งแวดล้อม (Environmental Justice) แล้วเพื่อนๆ คนอื่นคิดว่าเราจะตรวจสอบย้อนกลับ (Traceability) ได้อย่างไร?',
      time: '14:08',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const toggleRegister = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextState = !s.isRegistered;
          return {
            ...s,
            isRegistered: nextState,
            attendeesCount: nextState ? s.attendeesCount + 1 : Math.max(0, s.attendeesCount - 1),
          };
        }
        return s;
      })
    );
  };

  const handleSendLiveMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg = {
      id: `m_${Date.now()}`,
      sender: currentUser ? `${currentUser.name} (${currentUser.gradeClass || 'ม.ปลาย'})` : 'นักเรียน ม.ปลาย',
      role: currentUser?.role || 'student',
      text: inputMsg.trim(),
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    };

    setLiveChatMessages((prev) => [...prev, newMsg]);
    setInputMsg('');
  };

  const displayedSessions = sessions.filter((s) => {
    if (filter === 'registered') return s.isRegistered;
    return true;
  });

  const activeSession = sessions.find((s) => s.id === selectedSessionId) || sessions[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner Header */}
      <div className="p-6 bg-gradient-to-r from-emerald-100/70 via-teal-50 to-sky-100/70 rounded-3xl border border-emerald-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/80 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2 shadow-2xs">
            <CalendarIcon className="w-3.5 h-3.5 text-emerald-700" />
            <span>ตารางเวลานัดหมายการอภิปรายสด (Live Critical Seminars)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>ปฏิทินนัดหมายการอภิปรายสด ม.ปลาย</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            พื้นที่นัดหมายการสัมมนาสดแบบ Socratic Dialogue ร่วมกับ Teacher (ครู) และเพื่อนร่วมชั้น เพื่อถกเถียงข้อเสนอแนะเชิงนโยบายและมลพิษทางอากาศ
          </p>
        </div>

        {/* Action Button to Open Etiquette Modal */}
        <button
          onClick={onOpenEtiquetteModal}
          className="px-4 py-2.5 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold text-xs shadow-2xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>ทบทวนกฎกติกาและมารยาท</span>
        </button>
      </div>

      {/* Main Grid: Sessions List & Detailed Room / Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sessions List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>รอบการสัมมนาที่จะมาถึง</span>
            </h2>

            {/* Filter */}
            <div className="flex p-0.5 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  filter === 'all' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600'
                }`}
              >
                ทั้งหมด ({sessions.length})
              </button>
              <button
                onClick={() => setFilter('registered')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  filter === 'registered' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600'
                }`}
              >
                ที่ฉันลงชื่อไว้
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {displayedSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => {
                  setSelectedSessionId(session.id);
                  setInLiveRoom(false);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  selectedSessionId === session.id
                    ? 'bg-emerald-50/70 border-emerald-300 shadow-xs ring-2 ring-emerald-400/20'
                    : 'bg-white border-slate-200/90 hover:border-emerald-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {session.topicCategory}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{session.attendeesCount} คน</span>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-snug">
                  {session.title}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-1 font-medium text-emerald-800">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>{session.dateStr}</span>
                  </div>
                  <div className="flex items-center gap-1 font-medium text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{session.timeStr}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    ผู้ดำเนินการ: <strong className="text-slate-700">{session.moderator}</strong>
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRegister(session.id);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      session.isRegistered
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {session.isRegistered ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>ลงชื่อแล้ว</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>ลงชื่อเข้าร่วม</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Session Detail & Live Socratic Room (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
            {/* Header of Active Session */}
            <div className="space-y-2 pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  {activeSession.topicCategory}
                </span>
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>มีผู้ลงชื่อแล้ว {activeSession.attendeesCount} คน</span>
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                {activeSession.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                <span className="flex items-center gap-1 font-bold text-emerald-800">
                  <CalendarIcon className="w-4 h-4" />
                  {activeSession.dateStr}
                </span>
                <span className="flex items-center gap-1 font-bold text-sky-800">
                  <Clock className="w-4 h-4" />
                  {activeSession.timeStr}
                </span>
                <span className="flex items-center gap-1 text-slate-600">
                  <UserCheck className="w-4 h-4 text-slate-400" />
                  {activeSession.moderator}
                </span>
              </div>
            </div>

            {/* Core Critical Question */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-teal-50 to-sky-50/80 border border-emerald-200/80 space-y-1.5">
              <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>ประเด็นคำถามหลักสำหรับการอภิปราย (Core Critical Inquiry):</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                "{activeSession.keyQuestion}"
              </p>
            </div>

            {/* Agenda Schedule */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs sm:text-sm text-slate-800 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>กำหนดการและกิจกรรมในการสัมมนา:</span>
              </h4>
              <div className="space-y-1.5 text-xs text-slate-600">
                {activeSession.agenda.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                    <span className="font-bold text-emerald-700 shrink-0">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => toggleRegister(activeSession.id)}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 ${
                  activeSession.isRegistered
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-[#14532d] hover:bg-[#166534] text-white'
                }`}
              >
                {activeSession.isRegistered ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                    <span>ลงชื่อแล้ว (คลิกเพื่อยกเลิก)</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>ลงชื่อเข้าร่วมการสัมมนานี้</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setInLiveRoom(!inLiveRoom)}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 ${
                  inLiveRoom
                    ? 'bg-slate-100 text-slate-700'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>{inLiveRoom ? 'ซ่อนห้องอภิปรายสดจำลอง' : 'เปิดห้องอภิปรายสดจำลอง (Live Room)'}</span>
              </button>
            </div>

            {/* Simulated Live Room Box */}
            {inLiveRoom && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-xs text-slate-800">
                      ห้องอภิปรายสดจำลอง (Socratic Seminar Stream)
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    กำลังออนไลน์: 24 คน
                  </span>
                </div>

                {/* Messages Stream */}
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {liveChatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-2xl text-xs space-y-1 ${
                        msg.role === 'teacher'
                          ? 'bg-emerald-50/90 border border-emerald-200 text-emerald-950'
                          : 'bg-white border border-slate-200/80 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-slate-700">{msg.sender}</span>
                        <span className="text-slate-400">{msg.time}</span>
                      </div>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>

                {/* Input Form */}
                <form onSubmit={handleSendLiveMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    placeholder="พิมพ์ความคิดเห็นของคุณตามกฎกติกาการอภิปราย..."
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#14532d] hover:bg-[#166534] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>ส่ง</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
