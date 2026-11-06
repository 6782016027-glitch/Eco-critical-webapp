import React, { useState } from 'react';
import { CASE_STUDIES, CaseStudy } from '../data/caseStudies';
import { MapPin, Globe, ExternalLink, Mountain, Wind, Flame, AlertCircle } from 'lucide-react';

interface InteractiveMapProps {
  onSelectCaseStudy: (caseStudy: CaseStudy) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ onSelectCaseStudy }) => {
  const [selectedPin, setSelectedPin] = useState<CaseStudy | null>(CASE_STUDIES[1]); // Default Northern Thailand
  const [mapScope, setMapScope] = useState<'world' | 'thailand'>('thailand');

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
      {/* Map Control Bar - Soothing Green & Sky */}
      <div className="p-4 bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-sky-50/70 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-bold text-slate-800">
            แผนที่ภูมิศาสตร์กรณีศึกษามลพิษทางอากาศ (Geographical Hotspots)
          </h3>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-white text-emerald-800 border border-emerald-200 font-medium">
            พิกัดมลพิษในอดีตและปัจจุบัน
          </span>
        </div>

        {/* Scope Toggle */}
        <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 text-xs shadow-2xs">
          <button
            onClick={() => setMapScope('thailand')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              mapScope === 'thailand'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            🇹🇭 มุมมองประเทศไทย & อาเซียน
          </button>
          <button
            onClick={() => setMapScope('world')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              mapScope === 'world'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            🌍 มุมมองทั่วโลก (Global Cases)
          </button>
        </div>
      </div>

      {/* Map Viewport Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[480px]">
        {/* Visual Map Canvas - Clean cartography style */}
        <div className="lg:col-span-8 bg-gradient-to-b from-[#f0f9ff] via-[#f4fbf7] to-[#ecfdf5] p-6 relative flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-200 overflow-hidden">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="light-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0ea5e9" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#light-grid)" />
            </svg>
          </div>

          {mapScope === 'thailand' ? (
            /* Thailand & Southeast Asia Schematic Map - Clean Cartography */
            <div className="relative w-full max-w-[500px] h-[420px] flex items-center justify-center">
              <svg viewBox="0 0 400 500" className="w-full h-full drop-shadow-sm">
                {/* Neighboring regions */}
                <path
                  d="M 50,80 Q 150,50 250,90 T 350,140 L 370,300 L 250,280 L 100,240 Z"
                  fill="#e2e8f0"
                  fillOpacity="0.5"
                  stroke="#cbd5e1"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text x="70" y="60" fill="#64748b" fontSize="11" fontWeight="bold">เมียนมา (Myanmar)</text>
                <text x="280" y="110" fill="#64748b" fontSize="11" fontWeight="bold">สปป.ลาว (Laos)</text>
                <text x="270" y="270" fill="#64748b" fontSize="11" fontWeight="bold">กัมพูชา</text>

                {/* Mountain Ridge Lines */}
                <path
                  d="M 110,60 Q 130,120 120,180"
                  stroke="#059669"
                  strokeWidth="3"
                  strokeDasharray="2 3"
                  fill="none"
                  opacity="0.8"
                />
                <path
                  d="M 160,70 Q 180,130 170,190"
                  stroke="#059669"
                  strokeWidth="3"
                  strokeDasharray="2 3"
                  fill="none"
                  opacity="0.8"
                />
                <text x="60" y="140" fill="#047857" fontSize="9" fontWeight="bold">ทิวเขาถนนธงชัย</text>

                {/* Thailand Land Boundary - Soft Mint */}
                <path
                  d="M 120,70 Q 180,60 220,90 Q 230,140 210,180 Q 270,180 300,220 Q 280,260 220,260 Q 190,260 175,280 Q 160,330 165,400 Q 150,440 145,470 L 160,490 L 140,490 Q 130,440 140,380 Q 145,300 135,260 Q 110,240 100,180 Q 110,120 120,70 Z"
                  fill="#d1fae5"
                  stroke="#059669"
                  strokeWidth="2"
                />

                {/* Wind Vectors Overlay */}
                <g className="animate-pulse opacity-80">
                  <path d="M 60,190 Q 100,160 130,130" fill="none" stroke="#e11d48" strokeWidth="2.5" />
                  <text x="35" y="210" fill="#e11d48" fontSize="9" fontWeight="bold">ลมพัดพาควันข้ามแดน</text>
                </g>

                {/* Gulf of Thailand */}
                <text x="180" y="340" fill="#0284c7" fontSize="12" fontWeight="600" opacity="0.8">อ่าวไทย (Gulf of Thailand)</text>
              </svg>

              {/* Pin 1: Northern Thailand */}
              <button
                onClick={() => setSelectedPin(CASE_STUDIES[1])}
                className="absolute top-[18%] left-[34%] group cursor-pointer focus:outline-none"
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-8 h-8 rounded-full bg-rose-400/30 animate-ping" />
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-transform group-hover:scale-125 ${
                    selectedPin?.id === 'northern-thailand-haze'
                      ? 'bg-rose-500 border-white text-white shadow-md'
                      : 'bg-white border-rose-500 text-rose-600'
                  }`}>
                    <Flame className="w-4 h-4" />
                  </div>
                  <span className="absolute left-9 bg-white text-slate-800 font-bold text-[11px] px-2 py-0.5 rounded-lg border border-slate-200 whitespace-nowrap shadow-xs">
                    ภาคเหนือ (แอ่งเชียงใหม่)
                  </span>
                </div>
              </button>

              {/* Pin 2: Mae Moh Lampang */}
              <button
                onClick={() => setSelectedPin(CASE_STUDIES[3])}
                className="absolute top-[28%] left-[42%] group cursor-pointer focus:outline-none"
              >
                <div className="relative flex items-center justify-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-transform group-hover:scale-125 ${
                    selectedPin?.id === 'mae-moh-lampang-so2'
                      ? 'bg-emerald-600 border-white text-white shadow-md'
                      : 'bg-white border-emerald-600 text-emerald-700'
                  }`}>
                    <Mountain className="w-3.5 h-3.5" />
                  </div>
                  <span className="absolute left-8 bg-white text-slate-800 font-bold text-[10px] px-2 py-0.5 rounded-lg border border-slate-200 whitespace-nowrap shadow-xs">
                    แม่เมาะ จ.ลำปาง
                  </span>
                </div>
              </button>

              {/* Pin 3: Bangkok PM2.5 */}
              <button
                onClick={() => setSelectedPin(CASE_STUDIES[5])}
                className="absolute top-[52%] left-[41%] group cursor-pointer focus:outline-none"
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-7 h-7 rounded-full bg-amber-400/30 animate-ping" />
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-transform group-hover:scale-125 ${
                    selectedPin?.id === 'bangkok-urban-pm25'
                      ? 'bg-amber-500 border-white text-white shadow-md'
                      : 'bg-white border-amber-500 text-amber-700'
                  }`}>
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <span className="absolute left-8 bg-white text-slate-800 font-bold text-[10px] px-2 py-0.5 rounded-lg border border-slate-200 whitespace-nowrap shadow-xs">
                    กรุงเทพมหานคร & ปริมณฑล
                  </span>
                </div>
              </button>

              {/* Pin 4: ASEAN Transboundary (Sumatra / Borneo) */}
              <button
                onClick={() => setSelectedPin(CASE_STUDIES[6])}
                className="absolute bottom-[4%] right-[10%] group cursor-pointer focus:outline-none"
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-7 h-7 rounded-full bg-red-500/30 animate-ping" />
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-transform group-hover:scale-125 ${
                    selectedPin?.id === 'asean-peatland-haze'
                      ? 'bg-red-500 border-white text-white shadow-md'
                      : 'bg-white border-red-500 text-red-600'
                  }`}>
                    <Wind className="w-3.5 h-3.5" />
                  </div>
                  <span className="absolute right-8 bg-white text-slate-800 font-bold text-[10px] px-2 py-0.5 rounded-lg border border-slate-200 whitespace-nowrap shadow-xs">
                    ไฟป่าพรุอาเซียน (สุมาตรา-กาลีมันตัน)
                  </span>
                </div>
              </button>
            </div>
          ) : (
            /* World Overview Schematic Map - Calm Cartography */
            <div className="relative w-full max-w-[620px] h-[400px] flex items-center justify-center">
              <svg viewBox="0 0 800 450" className="w-full h-full opacity-70">
                <path d="M 120,80 Q 200,60 220,120 Q 180,180 120,150 Z" fill="#d1fae5" stroke="#94a3b8" />
                <text x="140" y="110" fill="#475569" fontSize="13" fontWeight="600">อเมริกาเหนือ</text>

                <path d="M 180,220 Q 240,240 220,340 Q 170,300 180,220 Z" fill="#d1fae5" stroke="#94a3b8" />
                <text x="180" y="270" fill="#475569" fontSize="13" fontWeight="600">อเมริกาใต้</text>

                <path d="M 370,70 Q 430,70 420,130 Q 360,140 370,70 Z" fill="#d1fae5" stroke="#94a3b8" />
                <text x="375" y="100" fill="#475569" fontSize="13" fontWeight="600">ยุโรป</text>

                <path d="M 370,160 Q 470,170 450,290 Q 360,260 370,160 Z" fill="#d1fae5" stroke="#94a3b8" />
                <text x="390" y="220" fill="#475569" fontSize="13" fontWeight="600">แอฟริกา</text>

                <path d="M 460,70 Q 720,60 700,200 Q 550,220 460,140 Z" fill="#d1fae5" stroke="#94a3b8" />
                <text x="560" y="120" fill="#475569" fontSize="15" fontWeight="600">เอเชีย</text>

                <path d="M 640,280 Q 740,270 710,360 Q 630,340 640,280 Z" fill="#d1fae5" stroke="#94a3b8" />
                <text x="650" y="320" fill="#475569" fontSize="13" fontWeight="600">ออสเตรเลีย</text>
              </svg>

              {/* Pins for global cases */}
              <button
                onClick={() => setSelectedPin(CASE_STUDIES[0])}
                className="absolute top-[22%] left-[47%] group cursor-pointer"
                title="The Great Smog of London 1952"
              >
                <div className={`p-1.5 rounded-full border-2 transition-transform group-hover:scale-125 ${
                  selectedPin?.id === 'london-smog-1952' ? 'bg-amber-500 text-white border-white ring-2 ring-amber-400' : 'bg-white text-amber-600 border-amber-400'
                }`}>
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800 block mt-1 shadow-2xs font-medium">ลอนดอน 1952</span>
              </button>

              <button
                onClick={() => setSelectedPin(CASE_STUDIES[2])}
                className="absolute top-[26%] left-[16%] group cursor-pointer"
                title="Los Angeles Smog"
              >
                <div className={`p-1.5 rounded-full border-2 transition-transform group-hover:scale-125 ${
                  selectedPin?.id === 'la-photochemical-smog' ? 'bg-sky-500 text-white border-white ring-2 ring-sky-400' : 'bg-white text-sky-600 border-sky-400'
                }`}>
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800 block mt-1 shadow-2xs font-medium">ลอสแอนเจลิส</span>
              </button>

              <button
                onClick={() => setSelectedPin(CASE_STUDIES[7])}
                className="absolute top-[24%] left-[24%] group cursor-pointer"
                title="Donora Smog 1948"
              >
                <div className={`p-1.5 rounded-full border-2 transition-transform group-hover:scale-125 ${
                  selectedPin?.id === 'donora-smog-1948' ? 'bg-slate-700 text-white border-white' : 'bg-white text-slate-700 border-slate-400'
                }`}>
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800 block mt-1 shadow-2xs font-medium">โดโนรา 1948</span>
              </button>

              <button
                onClick={() => setSelectedPin(CASE_STUDIES[4])}
                className="absolute top-[27%] right-[24%] group cursor-pointer"
                title="Beijing Airpocalypse"
              >
                <div className={`p-1.5 rounded-full border-2 transition-transform group-hover:scale-125 ${
                  selectedPin?.id === 'beijing-airpocalypse' ? 'bg-purple-600 text-white border-white ring-2 ring-purple-400' : 'bg-white text-purple-700 border-purple-400'
                }`}>
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800 block mt-1 shadow-2xs font-medium">ปักกิ่ง</span>
              </button>

              <button
                onClick={() => setSelectedPin(CASE_STUDIES[8])}
                className="absolute top-[31%] right-[16%] group cursor-pointer"
                title="Yokkaichi Asthma"
              >
                <div className={`p-1.5 rounded-full border-2 transition-transform group-hover:scale-125 ${
                  selectedPin?.id === 'yokkaichi-asthma-japan' ? 'bg-teal-600 text-white border-white' : 'bg-white text-teal-700 border-teal-400'
                }`}>
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800 block mt-1 shadow-2xs font-medium">โยกไกจิ ญี่ปุ่น</span>
              </button>

              <button
                onClick={() => setSelectedPin(CASE_STUDIES[1])}
                className="absolute top-[48%] right-[28%] group cursor-pointer"
                title="Northern Thailand & Bangkok"
              >
                <div className={`p-1.5 rounded-full border-2 transition-transform group-hover:scale-125 ${
                  selectedPin?.id === 'northern-thailand-haze' ? 'bg-rose-500 text-white border-white ring-2 ring-rose-400' : 'bg-white text-rose-600 border-rose-500'
                }`}>
                  <Flame className="w-4 h-4" />
                </div>
                <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 text-rose-700 block mt-1 font-bold shadow-2xs">ไทย (ภาคเหนือ & กทม.)</span>
              </button>
            </div>
          )}

          {/* Map bottom legend */}
          <div className="w-full flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-200 gap-2 mt-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> มลพิษชีวมวล/ไฟป่า
              </span>
              <span className="flex items-center gap-1 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> อุตสาหกรรม/โรงไฟฟ้า
              </span>
              <span className="flex items-center gap-1 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> ไอเสียเมือง/โอโซน
              </span>
            </div>
            <span className="text-slate-400 italic">
              คลิกที่หมุดบนแผนที่เพื่อดูข้อมูลทางภูมิศาสตร์
            </span>
          </div>
        </div>

        {/* Selected Pin Detail Sidebar Panel */}
        <div className="lg:col-span-4 bg-white p-5 flex flex-col justify-between space-y-4">
          {selectedPin ? (
            <div className="space-y-4">
              {/* Selected Pin Image Thumbnail */}
              {selectedPin.imageUrl && (
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-2xs bg-slate-100">
                  <img
                    src={selectedPin.imageUrl}
                    alt={selectedPin.titleTh}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-2 left-2 text-[10px] text-white bg-slate-900/70 px-2 py-0.5 rounded backdrop-blur-xs font-medium">
                    {selectedPin.location}
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {selectedPin.typeLabelTh}
                  </span>
                  <span className="text-xs text-slate-500">
                    {selectedPin.period}
                  </span>
                </div>
                <h4 className="text-lg font-extrabold text-slate-900 leading-tight">
                  {selectedPin.titleTh}
                </h4>
                <p className="text-xs text-slate-500">
                  {selectedPin.location}, {selectedPin.country}
                </p>
              </div>

              {/* Geography highlight badge */}
              <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-100 space-y-2">
                <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                  <Mountain className="w-3.5 h-3.5 text-sky-600" />
                  ปัจจัยภูมิประเทศและอุตุนิยมวิทยา
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedPin.geographyFactors.topography}
                </p>
                <div className="pt-1 text-[11px] text-sky-800 font-mono">
                  {selectedPin.geographyFactors.meteorology}
                </div>
              </div>

              {/* Critical prompt snippet */}
              <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100">
                <span className="text-[11px] font-bold text-emerald-900 block mb-1">
                  คำถามชวนคิดวิพากษ์:
                </span>
                <p className="text-xs text-slate-700 italic line-clamp-3">
                  "{selectedPin.criticalQuestions[0]}"
                </p>
              </div>

              <div className="text-xs text-slate-500">
                <span className="text-slate-700 font-semibold">ระดับมลพิษสูงสุด: </span>
                <span className="text-rose-700 font-medium">{selectedPin.peakAQIorLevel}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50 text-slate-400" />
              <p className="text-xs">เลือกหมุดบนแผนที่เพื่อดูรายละเอียด</p>
            </div>
          )}

          {selectedPin && (
            <button
              onClick={() => onSelectCaseStudy(selectedPin)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white font-semibold text-xs shadow-sm transition-all"
            >
              <span>อ่านกรณีศึกษาแบบเจาะลึก & คำถามวิพากษ์</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
