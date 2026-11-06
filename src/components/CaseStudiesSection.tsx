import React, { useState, useMemo } from 'react';
import { CASE_STUDIES, CaseStudy } from '../data/caseStudies';
import { InteractiveMap } from './InteractiveMap';
import { Search, Filter, Calendar, MapPin, Bot, Sparkles } from 'lucide-react';

interface CaseStudiesSectionProps {
  onSelectCaseStudy: (caseStudy: CaseStudy) => void;
  onConsultEcoBot: (caseStudy: CaseStudy) => void;
}

export const CaseStudiesSection: React.FC<CaseStudiesSectionProps> = ({
  onSelectCaseStudy,
  onConsultEcoBot,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedEra, setSelectedEra] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'both' | 'cards' | 'map'>('both');

  const filteredCases = useMemo(() => {
    return CASE_STUDIES.filter((item) => {
      // Search keyword
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchTitle = item.titleTh.toLowerCase().includes(term) || item.titleEn.toLowerCase().includes(term);
        const matchLoc = item.location.toLowerCase().includes(term) || item.country.toLowerCase().includes(term);
        const matchSummary = item.summary.toLowerCase().includes(term);
        const matchPollutants = item.mainPollutants.some((p) => p.toLowerCase().includes(term));
        if (!matchTitle && !matchLoc && !matchSummary && !matchPollutants) return false;
      }

      // Region filter
      if (selectedRegion !== 'all') {
        if (selectedRegion === 'thailand' && item.region !== 'thailand') return false;
        if (selectedRegion === 'global' && item.region === 'thailand') return false;
        if (selectedRegion === 'asia' && item.region !== 'asia') return false;
        if (selectedRegion === 'west' && item.region !== 'europe' && item.region !== 'americas') return false;
      }

      // Era filter
      if (selectedEra === 'past' && item.isOngoing) return false;
      if (selectedEra === 'ongoing' && !item.isOngoing) return false;

      // Type filter
      if (selectedType !== 'all' && item.type !== selectedType) return false;

      return true;
    });
  }, [searchTerm, selectedRegion, selectedEra, selectedType]);

  return (
    <div className="space-y-8">
      {/* Hero Classroom Introduction - Soft Emerald & Sky Breeze */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-sky-600 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-semibold border border-white/30">
            <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
            <span>คลังกรณีศึกษาประวัติศาสตร์และร่วมสมัย (Case Studies Archive)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            บทเรียนมลพิษทางอากาศ & ฝุ่น PM2.5{' '}
            <span className="text-emerald-100 underline decoration-sky-300 decoration-wavy">
              จากอดีตสู่ปัจจุบัน
            </span>
          </h1>
          <p className="text-sm sm:text-base text-emerald-50 leading-relaxed font-normal">
            สำรวจบทเรียนวิกฤตสิ่งแวดล้อมจากทั่วโลกและประเทศไทย วิเคราะห์ผ่านเลนส์ภูมิศาสตร์กายภาพ (แอ่งกระทะ, อุณหภูมิผกผัน, ลมมรสุม) และภูมิศาสตร์มนุษย์ (ทุนเกษตรกรรม, ผังเมือง, ความเป็นธรรมทางสิ่งแวดล้อม) พร้อมฝึกทักษะการคิดวิพากษ์ร่วมกับ <strong>Eco bot</strong>
          </p>
        </div>

        {/* Decorative soft circles */}
        <div className="absolute -right-16 -bottom-16 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-40 -top-12 w-48 h-48 rounded-full bg-sky-300/20 blur-xl pointer-events-none" />
      </div>

      {/* Filter and Search Controls - Clean White & Soft Green/Sky */}
      <div className="bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl space-y-3 shadow-xs">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหากรณีศึกษา เช่น ลอนดอน, เชียงใหม่, แม่เมาะ, อุณหภูมิผกผัน, SO2..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs self-start md:self-auto">
            <button
              onClick={() => setViewMode('both')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'both' ? 'bg-white text-emerald-800 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              แผนที่ + การ์ด
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'map' ? 'bg-white text-emerald-800 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              เฉพาะแผนที่
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'cards' ? 'bg-white text-emerald-800 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              เฉพาะการ์ด
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-medium flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-emerald-600" /> ตัวกรอง:
          </span>

          {/* Region */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">ภูมิภาค: ทั้งหมด</option>
            <option value="thailand">🇹🇭 เฉพาะประเทศไทย</option>
            <option value="global">🌍 ต่างประเทศทั่วโลก</option>
            <option value="asia">🌏 ทวีปเอเชีย & อาเซียน</option>
            <option value="west">🌐 ยุโรป & อเมริกา</option>
          </select>

          {/* Era */}
          <select
            value={selectedEra}
            onChange={(e) => setSelectedEra(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">ช่วงเวลา: ทั้งหมด</option>
            <option value="past">📜 กรณีศึกษาในอดีต (แก้ไขแล้ว)</option>
            <option value="ongoing">🔥 วิกฤตต่อเนื่อง / ปัจจุบัน</option>
          </select>

          {/* Type */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">ประเภทมลพิษ: ทั้งหมด</option>
            <option value="agricultural">🌾 ไฟป่า & เกษตรชีวมวล</option>
            <option value="industrial">🏭 อุตสาหกรรม & โรงไฟฟ้า</option>
            <option value="urban">🚗 ไอเสียเมือง & ปฏิกิริยาแสงแดด</option>
            <option value="transboundary">💨 หมอกควันข้ามพรมแดน</option>
          </select>

          {(selectedRegion !== 'all' || selectedEra !== 'all' || selectedType !== 'all' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedRegion('all');
                setSelectedEra('all');
                setSelectedType('all');
                setSearchTerm('');
              }}
              className="text-xs text-rose-600 hover:underline ml-auto font-medium"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          )}
        </div>
      </div>

      {/* Map Section */}
      {(viewMode === 'both' || viewMode === 'map') && (
        <InteractiveMap onSelectCaseStudy={onSelectCaseStudy} />
      )}

      {/* Case Studies Grid */}
      {(viewMode === 'both' || viewMode === 'cards') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span>รายการกรณีศึกษา</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                {filteredCases.length} กรณีศึกษา
              </span>
            </h2>
            <span className="text-xs text-slate-500">
              คลิกที่การ์ดเพื่ออ่านรายละเอียดและปัจจัยทางภูมิศาสตร์
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCases.map((caseStudy) => (
              <div
                key={caseStudy.id}
                onClick={() => onSelectCaseStudy(caseStudy)}
                className="group relative bg-white hover:bg-emerald-50/20 border border-slate-200/90 hover:border-emerald-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between hover:-translate-y-0.5"
              >
                <div>
                  {/* Card Image Thumbnail */}
                  {caseStudy.imageUrl && (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-3 bg-slate-100 border border-slate-200/60 shadow-2xs">
                      <img
                        src={caseStudy.imageUrl}
                        alt={caseStudy.titleTh}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                      <span className="absolute bottom-2 left-2 text-[10px] text-white bg-slate-900/70 px-2 py-0.5 rounded backdrop-blur-xs font-medium">
                        {caseStudy.location}
                      </span>
                    </div>
                  )}

                  {/* Top tags */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {caseStudy.typeLabelTh}
                    </span>
                    {caseStudy.isOngoing ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                        วิกฤตปัจจุบัน
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        อดีต (บันทึกประวัติศาสตร์)
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors mb-1">
                    {caseStudy.titleTh}
                  </h3>
                  <p className="text-xs text-slate-400 italic mb-3">
                    {caseStudy.titleEn}
                  </p>

                  {/* Meta info */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      {caseStudy.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-sky-600" />
                      {caseStudy.period}
                    </span>
                  </div>

                  {/* Summary preview */}
                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {caseStudy.summary}
                  </p>

                  {/* Geographic insight badge - Calm soft sky */}
                  <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-100 mb-4">
                    <div className="text-[11px] font-semibold text-sky-800 mb-0.5">
                      ⛰️ ปัจจัยภูมิศาสตร์สำคัญ:
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2">
                      {caseStudy.geographyFactors.topography}
                    </p>
                  </div>
                </div>

                {/* Card footer actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-amber-700 font-mono truncate max-w-[160px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                    {caseStudy.peakAQIorLevel}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onConsultEcoBot(caseStudy);
                    }}
                    className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors font-medium"
                    title="ถาม Eco bot ในหัวข้อนี้"
                  >
                    <Bot className="w-3.5 h-3.5 text-emerald-600" />
                    <span>วิพากษ์กับ AI</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
