import React from 'react';
import { BookOpen, Compass, Bot, MapPin, SlidersHorizontal, Award } from 'lucide-react';

export type ActiveTab = 'cases' | 'curriculum' | 'simulator' | 'ecobot' | 'journal';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenEcoBotWithTopic?: (topic: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner Notice - Soft calming green/sky */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 px-4 py-1.5 text-xs text-emerald-800 border-b border-emerald-100/80 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium">
            ห้องเรียนภูมิศาสตร์สิ่งแวดล้อมเพื่อการคิดวิพากษ์ (Eco-critical) • ศึกษามลพิษทางอากาศ & ภาวะฝุ่น PM2.5
          </span>
          <span className="hidden md:inline-block text-sky-700 ml-auto font-medium">
            รายวิชาภูมิศาสตร์ ม.ปลาย - อุดมศึกษา
          </span>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('cases')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500 p-0.5 shadow-sm group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Compass className="w-5 h-5 text-emerald-600 group-hover:rotate-45 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-700 via-teal-700 to-sky-700 bg-clip-text text-transparent">
                Eco-critical
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 border border-emerald-200">
                Geography Classroom
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1">
              มลพิษทางอากาศ PM2.5 • กรณีศึกษาอดีตสู่ปัจจุบัน • AI วิพากษ์ Eco bot
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1">
          <button
            onClick={() => setActiveTab('cases')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'cases'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-100/70'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>คลังกรณีศึกษา</span>
          </button>

          <button
            onClick={() => setActiveTab('curriculum')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'curriculum'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-100/70'
            }`}
          >
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span>บทเรียนภูมิศาสตร์</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'simulator'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-100/70'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-teal-600" />
            <span>แล็บจำลองกายภาพ</span>
          </button>

          <button
            onClick={() => setActiveTab('journal')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'journal'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-100/70'
            }`}
          >
            <Award className="w-4 h-4 text-sky-600" />
            <span>บันทึกคิดวิพากษ์</span>
          </button>

          <button
            onClick={() => setActiveTab('ecobot')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm ${
              activeTab === 'ecobot'
                ? 'bg-gradient-to-r from-emerald-600 to-sky-600 text-white shadow-emerald-600/20 ring-2 ring-emerald-400'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
          >
            <Bot className="w-4 h-4 text-emerald-600 group-hover:text-white" />
            <span>Eco bot (AI)</span>
            <span className="hidden lg:inline-flex text-[10px] bg-white/70 px-1.5 py-0.5 rounded text-emerald-800 font-bold">
              ถาม-วิพากษ์
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};
