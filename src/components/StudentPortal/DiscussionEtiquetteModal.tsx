/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Heart,
  Scale,
  Sparkles,
  X,
  Compass,
  ArrowRight,
  BookOpen,
  MessageSquare,
} from 'lucide-react';

interface DiscussionEtiquetteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAcknowledge?: () => void;
}

export const ETIQUETTE_RULES = [
  {
    id: 'evidence',
    title: '1. มุ่งเน้นเหตุผลและหลักฐานเชิงประจักษ์ (Evidence-Based Reasoning)',
    desc: 'อ้างอิงข้อเท็จจริงทางภูมิศาสตร์กายภาพ ข้อมูลแผนที่ดาวเทียม GIS/Hotspots และสถิติค่าฝุ่น PM2.5 หลีกเลี่ยงการใช้อารมณ์หรือการคาดเดาที่ไร้ข้อมูลสนับสนุน',
    exampleGood: 'จากข้อมูลทิศทางลมมรสุมและแผนที่จุดความร้อน Hotspots พบว่ามลพิษข้ามพรมแดนมีสัดส่วนสูงในเดือนมีนาคม',
    exampleBad: 'พวกข้างบ้านเป็นคนเผาหมดแหละ รู้ๆ กันอยู่ ไม่ต้องดูหลักฐานหรอก',
    icon: Scale,
    color: 'emerald',
  },
  {
    id: 'argue_ideas',
    title: '2. วิพากษ์ที่แนวคิดและโครงสร้าง ไม่โจมตีตัวบุคคล (Argue Ideas, Not People)',
    desc: 'วิพากษ์ข้อเสนอนโยบายและผลกระทบเชิงระบบอย่างสร้างสรรค์ โดยเด็ดขาดไม่ใช้ถ้อยคำดูถูกหรือเหยียดหยามบุคคล เกษตรกร หรือเพื่อนร่วมชั้น (No Ad Hominem)',
    exampleGood: 'นโยบายห้ามเผาเด็ดขาดอาจสร้างภาระหนักแก่เกษตรกรรายย่อยบนพื้นที่สูงที่มีความลาดชัน',
    exampleBad: 'คนที่เห็นด้วยกับนโยบายนี้คงไม่มีสมอง คิดอะไรตื้นๆ',
    icon: Heart,
    color: 'sky',
  },
  {
    id: 'empathy',
    title: '3. ตระหนักรู้ความยุติธรรมทางสิ่งแวดล้อม (Environmental Justice & Empathy)',
    desc: 'มองเห็นความเชื่อมโยงระหว่างมลพิษทางอากาศกับความเหลื่อมล้ำทางเศรษฐกิจและสุขภาพ เปิดใจรับฟังเสียงของกลุ่มเปราะบาง เช่น แรงงานกลางแจ้งและคนจนเมือง',
    exampleGood: 'ห้องปลอดฝุ่นเป็นทางออกชั่วคราวที่ดี แต่รัฐต้องจัดหาพื้นที่ปลอดภัยสาธารณะแก่แรงงานที่ไม่สามารถทำงานที่บ้านได้',
    exampleBad: 'ใครไม่อยากสูดฝุ่นก็แค่ซื้อเครื่องฟอกอากาศตัวแพงๆ มาติดที่บ้านสิ ง่ายจะตาย',
    icon: Compass,
    color: 'teal',
  },
  {
    id: 'inquiry',
    title: '4. การตั้งคำถามเชิงวิพากษ์เพื่อต่อยอดความรู้ (Constructive Inquiry Questioning)',
    desc: 'ใช้คำถามปลายเปิดเพื่อชวนเพื่อนคิดลึกซึ้งขึ้น เช่น "หากเราทำแบบนั้น จะเกิดผลกระทบข้างเคียงอย่างไร?" ไม่ใช่ถามเพื่อจับผิดหรือเอาชนะ',
    exampleGood: 'ถ้าเราบังคับใช้มาตรการตรวจสอบย้อนกลับ (Traceability) ใครควรเป็นผู้รับผิดชอบต้นทุนค่าระบบดาวเทียม?',
    exampleBad: 'พูดแบบนี้ แสดงว่าไม่เคยอ่านข่าวเลยใช่ไหม?',
    icon: Sparkles,
    color: 'indigo',
  },
  {
    id: 'stewardship',
    title: '5. จิตสำนึกและความรับผิดชอบต่อส่วนรวม (Action-Oriented Environmental Stewardship)',
    desc: 'มุ่งแสวงหาข้อสรุปและแนวทางปฏิบัติที่สร้างสรรค์ เพื่อนำไปสู่การอนุรักษ์สิ่งแวดล้อมและคุณภาพชีวิตที่ดีของชุมชนอย่างยั่งยืน',
    exampleGood: 'พวกเราในฐานะนักเรียน ม.ปลาย สามารถรณรงค์เรื่องการตรวจเช็คสภาพรถและการปลูกต้นไม้ดักฝุ่นในโรงเรียนได้',
    exampleBad: 'ปัญหาใหญ่ขนาดนี้ เป็นเรื่องของผู้ใหญ่ นักเรียนอย่างเราทำอะไรไม่ได้หรอก ช่างมันเถอะ',
    icon: CheckCircle,
    color: 'emerald',
  },
];

export const DiscussionEtiquetteModal: React.FC<DiscussionEtiquetteModalProps> = ({
  isOpen,
  onClose,
  onAcknowledge,
}) => {
  const [hasAgreed, setHasAgreed] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('eco_etiquette_accepted');
    if (saved === 'true') {
      setHasAgreed(true);
      setIsSaved(true);
    }
  }, []);

  if (!isOpen) return null;

  const handleConfirm = () => {
    localStorage.setItem('eco_etiquette_accepted', 'true');
    setIsSaved(true);
    if (onAcknowledge) onAcknowledge();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl border border-emerald-100 shadow-2xl p-6 sm:p-8 space-y-6 my-8 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 text-emerald-800 flex items-center justify-center border border-emerald-200 shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                <span>แนวปฏิบัติห้องเรียน ม.ปลาย</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
                กฎกติกา มารยาท และแนวทางการสื่อสารอภิปรายเชิงวิพากษ์
              </h3>
              <p className="text-xs text-slate-500">
                เพื่อส่งเสริมการคิดเชิงวิพากษ์ ความเคารพซึ่งกันและกัน และความตระหนักรู้ด้านสิ่งแวดล้อม
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5 Core Principles List */}
        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
          {ETIQUETTE_RULES.map((rule) => {
            const Icon = rule.icon;
            return (
              <div
                key={rule.id}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2.5 hover:border-emerald-200 transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-xl bg-white text-emerald-700 border border-emerald-100 shadow-2xs mt-0.5 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                      {rule.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {rule.desc}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-950">
                    <span className="font-bold block text-emerald-800 mb-0.5">✓ ตัวอย่างที่ดี:</span>
                    <span>"{rule.exampleGood}"</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200 text-rose-950">
                    <span className="font-bold block text-rose-800 mb-0.5">✗ สิ่งที่ควรหลีกเลี่ยง:</span>
                    <span>"{rule.exampleBad}"</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Agreement Checkbox & Actions */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hasAgreed}
              onChange={(e) => setHasAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
            />
            <div className="text-xs text-emerald-950 leading-relaxed font-medium">
              ข้าพเจ้ารับทราบและยินดีปฏิบัติตาม <strong>กฎกติกา มารยาท และแนวทางการสื่อสารอภิปราย</strong> เพื่อร่วมสร้างพื้นที่การเรียนรู้และการคิดวิพากษ์ที่ปลอดภัยและสร้างสรรค์สำหรับทุกคน
            </div>
          </label>

          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400">
              * ต้องยอมรับข้อตกลงเพื่อเข้าร่วมเว็บบอร์ดและกิจกรรมอภิปรายสด
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                ปิดหน้าต่าง
              </button>
              <button
                type="button"
                disabled={!hasAgreed}
                onClick={handleConfirm}
                className="px-5 py-2.5 rounded-xl bg-[#14532d] hover:bg-[#166534] disabled:opacity-40 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>ยืนยันรับทราบและปฏิบัติตาม</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
