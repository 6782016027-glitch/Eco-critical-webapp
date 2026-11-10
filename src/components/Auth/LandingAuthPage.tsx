/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import ecoLogoImg from '../../assets/images/ecocritical_logo_1794300369798.jpg';
import thaiStudentsPm25HeroImg from '../../assets/images/thai_students_pm25_hero_1794307880360.jpg';
import thaiStudentsBikeImg from '../../assets/images/thai_students_clean_air_bike_1794307914087.jpg';
import {
  GraduationCap,
  Shield,
  LogIn,
  UserPlus,
  UserCheck,
  Sparkles,
  BookOpen,
  Wind,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const LandingAuthPage: React.FC = () => {
  const { login, register } = usePortal();

  // Primary Role Selector: Student vs Admin
  const [selectedRole, setSelectedRole] = useState<'student' | 'admin'>('student');

  // Student sub-mode: Login vs Register
  const [studentMode, setStudentMode] = useState<'login' | 'register'>('login');

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [gradeClass, setGradeClass] = useState('มัธยมศึกษาปีที่ 5/1');

  // Feedback states
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle Login submission with strict role validation
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanUser = username.trim();
    const cleanPass = password;

    if (!cleanUser || !cleanPass) {
      setErrorMessage('กรุณากรอกชื่อผู้ใช้งานและรหัสผ่านให้ครบถ้วน');
      return;
    }

    // Role-specific strict validation
    if (selectedRole === 'admin') {
      if (cleanUser === 'admin' && cleanPass === 'admin123456789') {
        const res = login('admin', 'admin123456789');
        if (!res.success) {
          setErrorMessage(res.message);
        }
      } else {
        setErrorMessage('ชื่อผู้ใช้งานหรือรหัสผ่านผู้ดูแลระบบไม่ถูกต้อง');
      }
      return;
    }

    // Student Login
    const res = login(cleanUser, cleanPass);
    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  // Handle Student Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim() || !username.trim() || !password.trim()) {
      setErrorMessage('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    const res = register({
      name: name.trim(),
      username: username.trim(),
      password: password.trim(),
      studentId: studentId.trim() || undefined,
      gradeClass: gradeClass.trim() || undefined,
    });

    if (res.success) {
      setSuccessMessage(res.message);
      setStudentMode('login');
      setUsername('');
      setPassword('');
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/50 to-sky-100/60 text-slate-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Header Bar */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-emerald-100/80 px-4 sm:px-8 py-3 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={ecoLogoImg}
              alt="Eco-critical Logo"
              className="w-10 h-10 rounded-2xl object-cover shadow-2xs border border-emerald-200"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-700 via-teal-700 to-sky-700 bg-clip-text text-transparent">
                  Eco-critical
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ห้องเรียนภูมิศาสตร์ ม.ปลาย
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                ระบบการเรียนรู้ภูมิศาสตร์สิ่งแวดล้อมเพื่อการคิดวิพากษ์ & Eco bot สืบค้น
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>ระบบพร้อมใช้งาน (Online)</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Hero & Auth Split Layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        {/* Left Column: Visual Eco-Friendly Cartoon & Atmosphere Guide */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-xs border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>ยินดีต้อนรับสู่นวัตกรรมห้องเรียนภูมิศาสตร์สิ่งแวดล้อม</span>
            </div>

            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 bg-clip-text text-transparent">
                  ECO-CRITICAL
                </span>
              </h1>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-800">
                ห้องเรียนภูมิศาสตร์สิ่งแวดล้อม & คุณภาพอากาศ
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              สำรวจวิกฤตฝุ่น PM2.5, ปรากฏการณ์ผกผันอุณหภูมิ, ภูมิศาสตร์กายภาพ และความยุติธรรมทางสิ่งแวดล้อม ผ่านการเรียนรู้เชิงรุก และเพื่อนร่วมคิด Eco bot
            </p>
          </div>

          {/* Interactive Hero Cartoon Card with Thai High School Students */}
          <div className="relative rounded-3xl overflow-hidden border border-emerald-200 shadow-md bg-white group">
            <img
              src={selectedRole === 'student' ? thaiStudentsPm25HeroImg : thaiStudentsBikeImg}
              alt="นักเรียนมัธยมไทยร่วมใจรักษ์สิ่งแวดล้อมและคุณภาพอากาศ"
              className="w-full h-56 sm:h-72 object-cover object-center transition-transform duration-500 group-hover:scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent flex flex-col justify-end p-5 text-white">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/90 backdrop-blur-xs text-[11px] font-bold w-fit mb-1 shadow-2xs">
                <Wind className="w-3.5 h-3.5" />
                <span>{selectedRole === 'student' ? 'นักเรียนมัธยมไทยร่วมใจสู้ฝุ่น PM2.5' : 'ระบบจัดการศูนย์การเรียนรู้'}</span>
              </div>
              <h2 className="text-lg font-bold">
                {selectedRole === 'student'
                  ? 'สูดอากาศสะอาด ร่วมพิทักษ์โลกกับเยาวชนไทย'
                  : 'ศูนย์ควบคุมและบริหารจัดการการเรียนรู้ภูมิศาสตร์'}
              </h2>
              <p className="text-xs text-slate-200 line-clamp-1">
                {selectedRole === 'student'
                  ? 'มัธยมศึกษาตอนปลาย • ภูมิศาสตร์กายภาพ • GIS & Hotspots • กิจกรรมคิดวิพากษ์'
                  : 'จัดการบทเรียน คลังความรู้ AI ตั้งค่าระบบ และอนุมัติสิทธิ์นักเรียน'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Authentication Card with Role Tab Selector */}
        <div className="w-full lg:w-1/2 max-w-md">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-emerald-200/80 p-6 sm:p-8 shadow-xl shadow-emerald-950/5 space-y-6">
            {/* 1. ROLE TAB SELECTOR (STUDENT vs ADMIN) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block">
                เลือกบทบาทการเข้าใช้งานระบบ (Select Your Role):
              </label>
              <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-3xl border border-slate-200/90 gap-1.5 shadow-inner">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('student');
                    setUsername('');
                    setPassword('');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className={`py-3 px-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                    selectedRole === 'student'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-700/25 scale-[1.01]'
                      : 'text-slate-600 hover:text-emerald-950 hover:bg-white/70 hover:scale-[1.01]'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>นักเรียน (Student)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('admin');
                    setUsername('');
                    setPassword('');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className={`py-3 px-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                    selectedRole === 'admin'
                      ? 'bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white shadow-md shadow-slate-950/25 scale-[1.01]'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-white/70 hover:scale-[1.01]'
                  }`}
                >
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>ผู้ดูแลระบบ (Admin)</span>
                </button>
              </div>
            </div>

            {/* Error & Success Messages */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-start gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* ======================================================== */}
            {/* VIEW A: STUDENT VIEW AUTH (LOGIN / REGISTER)             */}
            {/* ======================================================== */}
            {selectedRole === 'student' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Student Mode Switcher */}
                <div className="flex border-b border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setStudentMode('login');
                      setErrorMessage('');
                    }}
                    className={`flex-1 py-2 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                      studentMode === 'login'
                        ? 'border-emerald-600 text-emerald-800'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    เข้าสู่ระบบห้องเรียน (Login)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStudentMode('register');
                      setErrorMessage('');
                    }}
                    className={`flex-1 py-2 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                      studentMode === 'register'
                        ? 'border-emerald-600 text-emerald-800'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    สมัครสมาชิกใหม่ (Register)
                  </button>
                </div>

                {studentMode === 'login' ? (
                  /* Student Login Form */
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        ชื่อผู้ใช้งานนักเรียน (Username)
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="เช่น std_naphat"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        รหัสผ่าน (Password)
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-md shadow-emerald-700/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>เข้าสู่ห้องเรียนนักเรียน (Student View)</span>
                    </button>
                  </form>
                ) : (
                  /* Student Register Form */
                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ชื่อ-นามสกุลนักเรียน *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="เช่น นายพงศกร ใจดี"
                        required
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          รหัสนักเรียน
                        </label>
                        <input
                          type="text"
                          value={studentId}
                          onChange={(e) => setStudentId(e.target.value)}
                          placeholder="STD-6709"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          ระดับชั้น
                        </label>
                        <select
                          value={gradeClass}
                          onChange={(e) => setGradeClass(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white"
                        >
                          <option value="มัธยมศึกษาปีที่ 4/1">ม.4/1</option>
                          <option value="มัธยมศึกษาปีที่ 4/2">ม.4/2</option>
                          <option value="มัธยมศึกษาปีที่ 5/1">ม.5/1</option>
                          <option value="มัธยมศึกษาปีที่ 5/2">ม.5/2</option>
                          <option value="มัธยมศึกษาปีที่ 6/1">ม.6/1</option>
                          <option value="มัธยมศึกษาปีที่ 6/2">ม.6/2</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ตั้งชื่อผู้ใช้งาน (Username) *
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="เช่น std_pongsakorn"
                        required
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        รหัสผ่าน (Password) *
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="อย่างน้อย 6 ตัวอักษร"
                        required
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-sm shadow-md shadow-teal-700/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>ลงทะเบียนและส่งคำขอเข้าเรียน</span>
                    </button>
                  </form>
                )}

                {/* End of student mode */}
              </div>
            )}

            {/* ======================================================== */}
            {/* VIEW B: ADMIN VIEW AUTH (MANUAL LOGIN ONLY)              */}
            {/* ======================================================== */}
            {selectedRole === 'admin' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Manual Admin Login Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      ชื่อผู้ใช้งานผู้ดูแลระบบ (Admin Username)
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="กรอกชื่อผู้ใช้งานผู้ดูแลระบบ"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-sm bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      รหัสผ่านผู้ดูแลระบบ (Admin Password)
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="กรอกรหัสผ่านผู้ดูแลระบบ"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-sm bg-white font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 hover:from-slate-800 hover:to-slate-800 text-white font-black text-sm shadow-md shadow-slate-950/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer border border-slate-700/50"
                  >
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>เข้าสู่หน้าแดชบอร์ดจัดการระบบ (Admin Login)</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-100 bg-white/70 py-4 px-4 text-center text-xs text-slate-500">
        <p>
          นวัตกรรมห้องเรียนภูมิศาสตร์สิ่งแวดล้อมเพื่อการคิดวิพากษ์ (Eco-critical Learning Portal) • มัธยมศึกษาตอนปลาย
        </p>
      </footer>
    </div>
  );
};
