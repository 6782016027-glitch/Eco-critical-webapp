/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  FileText,
  Sparkles,
  Save,
  CheckCircle,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  Layers,
  HelpCircle,
  MessageSquare,
  Bot,
  Compass,
  ArrowRight,
  Download,
  Share2,
  Printer,
  Award,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { CASE_STUDIES } from '../../data/caseStudies';

export interface LogbookEntry {
  id: string;
  studentId: string;
  studentName: string;
  caseStudyId: string;
  caseStudyTitle: string;
  entryDate: string;
  factsAndGeography: string;
  structuralCritique: string;
  policyAlternatives: string;
  personalReflection: string;
  aiFeedback?: string;
  teacherScore?: number;
}

export interface WorksheetAnswer {
  id: string;
  worksheetId: string;
  title: string;
  studentName: string;
  updatedAt: string;
  answers: Record<string, string>;
  isSubmitted: boolean;
}

const DEFAULT_LOGBOOKS: LogbookEntry[] = [
  {
    id: 'log_01',
    studentId: 'STD-6701',
    studentName: 'นายนภัทร กานต์กมล',
    caseStudyId: 'chiangmai-haze',
    caseStudyTitle: 'วิกฤตหมอกควันและฝุ่นข้ามแดนภาคเหนือ (เชียงใหม่ & อนุภูมิภาคลุ่มน้ำโขง)',
    entryDate: '2026-11-08',
    factsAndGeography: 'เชียงใหม่ตั้งอยู่ในแอ่งที่ราบระหว่างภูเขา (Intermontane Basin) แนวเทือกเขาทำหน้าที่เป็นแนวกั้นลมธรรมชาติ ร่วมกับเกิดปรากฏการณ์อุณหภูมิผกผัน (Thermal Inversion) ในช่วงฤดูหนาว ทำให้อากาศเย็นติดดินถูกกดทับด้วยชั้นอากาศอุ่นด้านบน มลพิษจึงสะสมตัวไม่ลอยขึ้น',
    structuralCritique: 'การมองว่าเกษตรกรรายย่อยเป็นผู้ร้ายฝ่ายเดียวเป็นการมองที่ไม่เป็นธรรม เพราะเกษตรกรบนดอยติดกับดักเกษตรพันธสัญญาของกลุ่มทุนอาหารสัตว์ และพื้นที่ลาดชันไม่สามารถนำเครื่องจักรไปไถกลบได้ การเผาจึงเป็นทางเลือกเดียวที่ต้นทุนต่ำที่สุด',
    policyAlternatives: 'รัฐควรจัดตั้งธนาคารเครื่องจักรชุมชนและอุดหนุนการแปรรูปซากข้าวโพดเป็นถ่านไบโอชาร์ (Biochar) พร้อมทั้งบังคับใช้กฎหมายตรวจสอบย้อนกลับ (Traceability) กับบริษัทรับซื้อผลผลิต หากพบว่าผลผลิตมาจากการเผา ต้องถูกตัดสิทธิประโยชน์ภาษี',
    personalReflection: 'ผมตระหนักว่าการแก้ปัญหาสิ่งแวดล้อมไม่สามารถใช้เพียงการออกคำสั่งลงโทษ แต่ต้องเข้าใจมิติทางภูมิศาสตร์มนุษย์และเศรษฐศาสตร์การเมืองควบคู่กัน',
    aiFeedback: 'การวิเคราะห์ของคุณมีความลึกซึ้งยอดเยี่ยมมาก! มีการเชื่อมโยงมิติภูมิศาสตร์กายภาพ (Inversion) เข้ากับโครงสร้างเศรษฐกิจ (Contract Farming) ได้อย่างมีหลักการ ชวนคิดต่อ: ในระยะเปลี่ยนผ่าน รัฐควรจัดงบประมาณชดเชยแก่ครอบครัวเกษตรกรจากแหล่งภาษีใด?',
  },
];

const WORKSHEET_TEMPLATES = [
  {
    id: 'ws_01',
    number: 1,
    title: 'ใบงานที่ 1: แผนผังวิเคราะห์สาเหตุและผลกระทบ PM2.5 ในมิติภูมิศาสตร์',
    subtitle: 'สำรวจปัจจัยปฐมภูมิ-ทุติยภูมิ ภูมิสัณฐาน และกลุ่มเปราะบาง',
    questions: [
      {
        id: 'q1',
        prompt: '1. เปรียบเทียบความแตกต่างระหว่าง "แหล่งกำเนิดฝุ่นปฐมภูมิ (Primary)" และ "มลพิษทุติยภูมิ (Secondary)" พร้อมยกตัวอย่างที่พบในประเทศไทย:',
        hint: 'พิจารณาการปล่อยตรงจากท่อไอเสีย/ไฟป่า เทียบกับปฏิกิริยาเคมีแสงแดดของ SO2 และ NOx',
      },
      {
        id: 'q2',
        prompt: '2. อธิบายว่าทำไมภูมิประเทศแบบ "แอ่งกระทะ" จึงทำให้ค่าฝุ่นควันสะสมตัวรุนแรงกว่าพื้นที่ราบชายฝั่งทะเล:',
        hint: 'พิจารณาทิศทางลม ความเร็วลมผิวพื้น และกำแพงภูเขาธรรมชาติ',
      },
      {
        id: 'q3',
        prompt: '3. ในชุมชนหรือโรงเรียนของคุณ ใครคือ "กลุ่มเปราะบางที่สุด" และควรมีมาตรการป้องกันเร่งด่วนอย่างไร?',
        hint: 'เด็กเล็ก, ผู้สูงอายุ, ผู้ป่วยทางเดินหายใจ, แรงงานกลางแจ้ง',
      },
    ],
  },
  {
    id: 'ws_02',
    number: 2,
    title: 'ใบงานที่ 2: การวิเคราะห์เปรียบเทียบ "แอ่งเชียงใหม่ vs มหาหมอกควันลอนดอน 1952"',
    subtitle: 'ถอดบทเรียนประวัติศาสตร์สู่การจัดการสิ่งแวดล้อมร่วมสมัย',
    questions: [
      {
        id: 'q1',
        prompt: '1. อะไรคือจุดเหมือนและจุดต่างทางอุตุนิยมวิทยาระหว่างวิกฤต The Great Smog 1952 กับหมอกควันภาคเหนือในปัจจุบัน?',
        hint: 'จุดเหมือน: ปรากฏการณ์อุณหภูมิผกผันและลมนิ่ง จุดต่าง: แหล่งกำเนิด (ถ่านหินในเมือง vs ชีวมวลการเกษตร)',
      },
      {
        id: 'q2',
        prompt: '2. ทำไมกฎหมาย Clean Air Act 1956 ของอังกฤษจึงประสบความสำเร็จในการแก้ปัญหาหมอกควันถ่านหิน?',
        hint: 'เน้นมาตรการอุดหนุนเงิน 70% ให้ประชาชนเปลี่ยนเตาผิง ควบคู่กับการประกาศเขตปลอดควัน',
      },
      {
        id: 'q3',
        prompt: '3. หากนำหลักการ "ผู้ก่อมลพิษเป็นผู้จ่าย (Polluter Pays Principle)" มาใช้ในร่าง พ.ร.บ. อากาศสะอาดของไทย ควรบังคับใช้กับใครเป็นลำดับแรก?',
        hint: 'พิจารณากลุ่มทุนเกษตรพันธสัญญา, อุตสาหกรรมพลังงาน, ยานยนต์ดีเซลขนาดใหญ่',
      },
    ],
  },
  {
    id: 'ws_03',
    number: 3,
    title: 'ใบงานที่ 3: การประเมินทางเลือกนโยบาย "ห้ามเผาเด็ดขาด vs กองทุนอากาศสะอาด"',
    subtitle: 'ฝึกทักษะการคิดวิพากษ์เชิงนโยบายสาธารณะและความเป็นธรรมทางสังคม',
    questions: [
      {
        id: 'q1',
        prompt: '1. วิเคราะห์ข้อดีและข้อจำกัดของมาตรการ "ประกาศห้ามเผาเด็ดขาด 60 วัน (Zero Burning)":',
        hint: 'ข้อดี: ตรวจจับง่าย ข้อจำกัด: การแอบเผากลางคืน และเกิดการเผาพร้อมกันเมื่อสิ้นสุดประกาศ',
      },
      {
        id: 'q2',
        prompt: '2. เสนอโมเดลธุรกิจหรือเทคโนโลยีที่สามารถเปลี่ยน "ฟางข้าวและตอซังข้าวโพด" ให้กลายเป็นมูลค่าแทนการเผา:',
        hint: 'เช่น ถ่านชีวภาพ (Biochar), อาหารสัตว์อัดแท่ง, พลังงานชีวมวลชุมชน',
      },
      {
        id: 'q3',
        prompt: '3. ในฐานะเยาวชนคนรุ่นใหม่ คุณมีข้อเสนอแนะ 1 ข้อต่อรัฐบาลในการแก้ปัญหาฝุ่น PM2.5 อย่างยั่งยืนอย่างไร?',
        hint: 'ข้อเสนอที่สมดุลระหว่างวิทยาศาสตร์ เศรษฐกิจ และสิทธิมนุษยชน',
      },
    ],
  },
];

export const WorksheetAndLogbook: React.FC = () => {
  const { currentUser } = usePortal();
  const [activeTab, setActiveTab] = useState<'logbook' | 'worksheets'>('logbook');

  // Logbook State
  const [logbooks, setLogbooks] = useState<LogbookEntry[]>(() => {
    const saved = localStorage.getItem('eco_student_logbooks');
    return saved ? JSON.parse(saved) : DEFAULT_LOGBOOKS;
  });

  const [selectedCaseId, setSelectedCaseId] = useState(CASE_STUDIES[0]?.id || '');
  const [factsText, setFactsText] = useState('');
  const [critiqueText, setCritiqueText] = useState('');
  const [policyText, setPolicyText] = useState('');
  const [reflectionText, setReflectionText] = useState('');
  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isAskingAi, setIsAskingAi] = useState(false);

  // Worksheet State
  const [selectedWsId, setSelectedWsId] = useState('ws_01');
  const [wsAnswers, setWsAnswers] = useState<Record<string, Record<string, string>>>(() => {
    const saved = localStorage.getItem('eco_worksheet_answers');
    return saved ? JSON.parse(saved) : {};
  });
  const [wsSavedNotice, setWsSavedNotice] = useState(false);

  useEffect(() => {
    localStorage.setItem('eco_student_logbooks', JSON.stringify(logbooks));
  }, [logbooks]);

  useEffect(() => {
    localStorage.setItem('eco_worksheet_answers', JSON.stringify(wsAnswers));
  }, [wsAnswers]);

  const handleSaveLogbook = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedCase = CASE_STUDIES.find((c) => c.id === selectedCaseId);
    const caseTitle = matchedCase ? `${matchedCase.titleTh} (${matchedCase.period})` : 'กรณีศึกษาภูมิศาสตร์สิ่งแวดล้อม';

    if (isEditingId) {
      setLogbooks((prev) =>
        prev.map((item) =>
          item.id === isEditingId
            ? {
                ...item,
                caseStudyId: selectedCaseId,
                caseStudyTitle: caseTitle,
                factsAndGeography: factsText,
                structuralCritique: critiqueText,
                policyAlternatives: policyText,
                personalReflection: reflectionText,
                entryDate: new Date().toISOString().split('T')[0],
              }
            : item
        )
      );
      setIsEditingId(null);
    } else {
      const newEntry: LogbookEntry = {
        id: `log_${Date.now()}`,
        studentId: currentUser?.studentId || 'STD-USER',
        studentName: currentUser?.name || 'นักเรียน ม.ปลาย',
        caseStudyId: selectedCaseId,
        caseStudyTitle: caseTitle,
        entryDate: new Date().toISOString().split('T')[0],
        factsAndGeography: factsText,
        structuralCritique: critiqueText,
        policyAlternatives: policyText,
        personalReflection: reflectionText,
        aiFeedback: 'Eco bot ได้บันทึกและประเมินอนุทินของคุณ: แสดงความคิดวิพากษ์ที่มีโครงสร้างชัดเจน ขอชื่นชมที่คุณมองเห็นทั้งมิติวิทยาศาสตร์กายภาพและความเป็นธรรมทางสังคม!',
      };
      setLogbooks((prev) => [newEntry, ...prev]);
    }

    setFactsText('');
    setCritiqueText('');
    setPolicyText('');
    setReflectionText('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleEditEntry = (entry: LogbookEntry) => {
    setIsEditingId(entry.id);
    setSelectedCaseId(entry.caseStudyId);
    setFactsText(entry.factsAndGeography);
    setCritiqueText(entry.structuralCritique);
    setPolicyText(entry.policyAlternatives);
    setReflectionText(entry.personalReflection);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm('ยืนยันที่จะลบบันทึกอนุทินฉบับนี้หรือไม่?')) {
      setLogbooks((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleUpdateWsAnswer = (wsId: string, qId: string, val: string) => {
    setWsAnswers((prev) => ({
      ...prev,
      [wsId]: {
        ...(prev[wsId] || {}),
        [qId]: val,
      },
    }));
  };

  const handleSaveWorksheet = (wsId: string) => {
    setWsSavedNotice(true);
    setTimeout(() => setWsSavedNotice(false), 2500);
  };

  const currentWorksheet = WORKSHEET_TEMPLATES.find((w) => w.id === selectedWsId) || WORKSHEET_TEMPLATES[0];
  const currentAnswers = wsAnswers[currentWorksheet.id] || {};

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner Header */}
      <div className="p-6 bg-gradient-to-r from-emerald-100/70 via-teal-50 to-sky-100/70 rounded-3xl border border-emerald-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/80 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2 shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span>การคิดเชิงวิพากษ์ ม.ปลาย (Critical Thinking & Reflection)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>ใบงาน & สมุดอนุทินสะท้อนคิดดิจิทัล</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            พื้นที่บันทึกการคิดวิพากษ์รายบุคคล วิเคราะห์กรณีศึกษามลพิษทางอากาศ และทำใบงานกิจกรรมตามระเบียบวิธีวิจัยภูมิศาสตร์สิ่งแวดล้อม
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-white/90 border border-emerald-200 rounded-2xl shadow-2xs text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('logbook')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'logbook'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-emerald-800'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>สมุดอนุทินสะท้อนคิด ({logbooks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('worksheets')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'worksheets'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-emerald-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>ใบงานกิจกรรม (3 ใบงาน)</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: DIGITAL LOGBOOK (สมุดอนุทินสะท้อนคิด) */}
      {/* ======================================================== */}
      {activeTab === 'logbook' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form to Write / Edit Entry (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-600" />
                <span>{isEditingId ? 'แก้ไขบันทึกอนุทินสะท้อนคิด' : 'เขียนบันทึกอนุทินสะท้อนคิดฉบับใหม่'}</span>
              </h2>

              {isEditingId && (
                <button
                  onClick={() => {
                    setIsEditingId(null);
                    setFactsText('');
                    setCritiqueText('');
                    setPolicyText('');
                    setReflectionText('');
                  }}
                  className="text-xs text-rose-600 hover:underline font-bold"
                >
                  ยกเลิกการแก้ไข
                </button>
              )}
            </div>

            {saveSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">บันทึกอนุทินสะท้อนคิดเรียบร้อยแล้ว!</span>
              </div>
            )}

            <form onSubmit={handleSaveLogbook} className="space-y-4 text-xs sm:text-sm">
              {/* Select Case Study */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  เลือกกรณีศึกษาที่ต้องการสะท้อนคิด (Case Study) *
                </label>
                <select
                  value={selectedCaseId}
                  onChange={(e) => setSelectedCaseId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium text-slate-800"
                >
                  {CASE_STUDIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.titleTh} ({c.period}, {c.location})
                    </option>
                  ))}
                </select>
              </div>

              {/* 4 Reflection Dimensions */}
              <div className="space-y-3">
                {/* 1. Facts & Geography */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center">1</span>
                    <span>ข้อเท็จจริงและปัจจัยทางภูมิศาสตร์กายภาพ (Geographical Facts)</span>
                  </label>
                  <p className="text-[11px] text-slate-500 mb-1">
                    ระบุลักษณะภูมิสัณฐาน อุตุนิยมวิทยา สภาพอากาศ หรือกลไกการเกิดมลพิษที่ค้นพบในกรณีศึกษานี้:
                  </p>
                  <textarea
                    rows={2}
                    required
                    value={factsText}
                    onChange={(e) => setFactsText(e.target.value)}
                    placeholder="เช่น ปรากฏการณ์อุณหภูมิผกผันในแอ่งกระทะเชียงใหม่ หรือ การสะสมตัวของก๊าซซัลเฟอร์ไดออกไซด์ในหุบเขาแม่เมาะ..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white text-xs sm:text-sm"
                  />
                </div>

                {/* 2. Structural & Environmental Justice Critique */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-bold flex items-center justify-center">2</span>
                    <span>การคิดวิพากษ์เชิงโครงสร้างและความยุติธรรมทางสิ่งแวดล้อม (Structural Critique)</span>
                  </label>
                  <p className="text-[11px] text-slate-500 mb-1">
                    ใครเป็นผู้ได้รับผลกระทบมากที่สุด? มีความเหลื่อมล้ำทางเศรษฐกิจหรือช่องว่างของนโยบายรัฐอย่างไร?
                  </p>
                  <textarea
                    rows={2}
                    required
                    value={critiqueText}
                    onChange={(e) => setCritiqueText(e.target.value)}
                    placeholder="เช่น เกษตรกรรายย่อยไม่มีทางเลือกทางเทคโนโลยี ขณะที่กลุ่มทุนอาหารสัตว์ไม่ต้องรับผิดชอบต้นทุน หรือแรงงานนอกระบบไม่มีห้องปลอดฝุ่น..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white text-xs sm:text-sm"
                  />
                </div>

                {/* 3. Policy & Technological Alternatives */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold flex items-center justify-center">3</span>
                    <span>ข้อเสนอแนะเชิงนโยบายและเทคโนโลยีที่เป็นธรรม (Alternatives & Solutions)</span>
                  </label>
                  <p className="text-[11px] text-slate-500 mb-1">
                    หากคุณมีอำนาจกำหนดนโยบาย คุณจะเสนอแนวทางแก้ไขหรือมาตรการเยียวยาอย่างไรที่ยุติธรรมต่อทุกฝ่าย?
                  </p>
                  <textarea
                    rows={2}
                    required
                    value={policyText}
                    onChange={(e) => setPolicyText(e.target.value)}
                    placeholder="เช่น จัดตั้งธนาคารเครื่องจักรการเกษตรชุมชน, บังคับใช้ระบบตรวจสอบย้อนกลับ (Traceability), หรือการสนับสนุนเงินอุดหนุนแบบอังกฤษ Clean Air Act..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white text-xs sm:text-sm"
                  />
                </div>

                {/* 4. Self-Reflection */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold flex items-center justify-center">4</span>
                    <span>การสะท้อนคิดต่อตนเองและการปฏิบัติจริง (Personal Reflection)</span>
                  </label>
                  <p className="text-[11px] text-slate-500 mb-1">
                    บทเรียนนี้เปลี่ยนมุมมองหรือวิธีคิดของคุณอย่างไร และคุณสามารถทำอะไรได้บ้างในชีวิตประจำวัน?
                  </p>
                  <textarea
                    rows={2}
                    required
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    placeholder="เช่น ทำให้ตระหนักว่าปัญหาฝุ่นไม่ใช่เรื่องไกลตัว หรือตั้งใจจะตรวจสอบค่า AQI สวมหน้ากาก และร่วมรณรงค์กับเพื่อนๆ ในโรงเรียน..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  * ข้อมูลจะถูกบันทึกและส่งให้ Teacher (ครู) ตรวจประเมิน
                </span>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#14532d] hover:bg-[#166534] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isEditingId ? 'บันทึกการแก้ไข' : 'บันทึกอนุทินสะท้อนคิด'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* List of Saved Entries (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>บันทึกอนุทินสะท้อนคิดของคุณ ({logbooks.length})</span>
              </h3>
            </div>

            {logbooks.length === 0 ? (
              <div className="p-8 bg-white rounded-3xl border border-dashed border-slate-300 text-center space-y-3">
                <Edit3 className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-700 text-sm">ยังไม่มีบันทึกอนุทินสะท้อนคิด</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  เลือกกรณีศึกษาที่สนใจและเริ่มเขียนบันทึกการคิดวิพากษ์ในแบบฟอร์มด้านซ้ายได้เลยครับ
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
                {logbooks.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-200 shadow-2xs space-y-3.5 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {entry.entryDate}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 leading-snug">
                          {entry.caseStudyTitle}
                        </h4>
                        <div className="text-[11px] text-slate-400">
                          บันทึกโดย: <strong className="text-slate-600">{entry.studentName}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleEditEntry(entry)}
                          className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="แก้ไข"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                          title="ลบ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Excerpt of Reflection */}
                    <div className="space-y-2 text-xs text-slate-700">
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                        <span className="text-[11px] font-bold text-emerald-800 block">
                          💭 การวิพากษ์เชิงโครงสร้าง:
                        </span>
                        <p className="line-clamp-2 leading-relaxed">{entry.structuralCritique}</p>
                      </div>

                      <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                        <span className="text-[11px] font-bold text-emerald-900 block">
                          💡 ข้อเสนอแนะเชิงนโยบาย:
                        </span>
                        <p className="line-clamp-2 leading-relaxed">{entry.policyAlternatives}</p>
                      </div>
                    </div>

                    {/* AI Pedagogical Feedback Box */}
                    {entry.aiFeedback && (
                      <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200 text-xs text-teal-950 space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-teal-800 text-[11px]">
                          <Bot className="w-3.5 h-3.5" />
                          <span>ข้อเสนอแนะส่งเสริมการคิดวิพากษ์ (Eco bot Coach):</span>
                        </div>
                        <p className="leading-relaxed text-[11px] text-slate-700">{entry.aiFeedback}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 2: DIGITAL WORKSHEETS (ใบงานการเรียนรู้ ม.ปลาย) */}
      {/* ======================================================== */}
      {activeTab === 'worksheets' && (
        <div className="space-y-6">
          {/* Worksheet Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {WORKSHEET_TEMPLATES.map((ws) => (
              <button
                key={ws.id}
                onClick={() => setSelectedWsId(ws.id)}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  selectedWsId === ws.id
                    ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/30 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-emerald-200'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                    selectedWsId === ws.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {ws.number}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h4 className="font-bold text-xs text-slate-900 truncate">
                    {ws.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{ws.subtitle}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Active Worksheet Paper View */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  กิจกรรมการเรียนรู้ระดับมัธยมศึกษาตอนปลาย
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                  {currentWorksheet.title}
                </h3>
                <p className="text-xs text-slate-500">{currentWorksheet.subtitle}</p>
              </div>

              <div className="flex items-center gap-2">
                {wsSavedNotice && (
                  <span className="text-xs font-bold text-emerald-700 animate-in fade-in flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    บันทึกคำตอบแล้ว
                  </span>
                )}
                <button
                  onClick={() => handleSaveWorksheet(currentWorksheet.id)}
                  className="px-4 py-2 bg-[#14532d] hover:bg-[#166534] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>บันทึกใบงาน</span>
                </button>
              </div>
            </div>

            {/* Questions Form */}
            <div className="space-y-6">
              {currentWorksheet.questions.map((q, idx) => {
                const answer = currentAnswers[q.id] || '';
                return (
                  <div key={q.id} className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2.5">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                      {q.prompt}
                    </h4>
                    <p className="text-[11px] text-emerald-800 bg-emerald-50/60 px-2.5 py-1 rounded-lg border border-emerald-100 inline-block font-medium">
                      💡 แนวทางตอบ: {q.hint}
                    </p>
                    <textarea
                      rows={3}
                      value={answer}
                      onChange={(e) => handleUpdateWsAnswer(currentWorksheet.id, q.id, e.target.value)}
                      placeholder="พิมพ์คำตอบของคุณที่นี่อย่างละเอียด พร้อมให้เหตุผลทางวิทยาศาสตร์และสังคม..."
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-xs sm:text-sm leading-relaxed"
                    />
                  </div>
                );
              })}
            </div>

            {/* Footer Summary */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-emerald-900 font-medium">
                นักเรียนสามารถพิมพ์บันทึกคำตอบไว้ได้ตลอดเวลา และระบบจะบันทึกลงเครื่องของคุณอัตโนมัติ
              </span>
              <button
                onClick={() => handleSaveWorksheet(currentWorksheet.id)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shrink-0 transition-colors"
              >
                ยืนยันและบันทึกใบงานนี้
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
