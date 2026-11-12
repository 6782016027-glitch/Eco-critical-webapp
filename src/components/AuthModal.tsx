/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import {
  X,
  LogIn,
  UserPlus,
  Shield,
  Key,
  GraduationCap,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  UserCheck,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login',
}) => {
  const { login, register, users, quickSwitchUser } = usePortal();

  const [mode, setMode] = useState<'login' | 'register'>(defaultTab);

  // Login state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regStudentId, setRegStudentId] = useState('');
  const [regGradeClass, setRegGradeClass] = useState('ม.4/1');
  const [regSeatNumber, setRegSeatNumber] = useState('1');
  const [regSuccess, setRegSuccess] = useState<string | null>(null);
  const [regError, setRegError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const res = login(loginUsername, loginPassword);
    if (res.success) {
      onClose();
    } else {
      setLoginError(res.message);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(null);

    if (!regName.trim() || !regUsername.trim() || !regPassword.trim()) {
      setRegError('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    const res = register({
      name: regName,
      username: regUsername,
      password: regPassword,
      studentId: regStudentId,
      gradeClass: regGradeClass,
      seatNumber: regSeatNumber,
    });

    if (res.success) {
      setRegSuccess(res.message);
      setRegName('');
      setRegUsername('');
      setRegPassword('');
      setRegStudentId('');
    } else {
      setRegError(res.message);
    }
  };

  const handleQuickFillAdmin = () => {
    setLoginUsername('admin');
    setLoginPassword('Admin12345678');
    setLoginError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 text-slate-800 space-y-5 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              {mode === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                {mode === 'login' ? 'เข้าสู่ระบบ Eco-critical' : 'สมัครสมาชิกนักเรียนใหม่'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {mode === 'login' ? 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' : 'กรอกข้อมูลเพื่อลงทะเบียน (รอครูอนุมัติ)'}
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

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setLoginError(null);
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-white text-emerald-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            เข้าสู่ระบบ
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setRegError(null);
              setRegSuccess(null);
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-white text-emerald-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            สมัครสมาชิกใหม่
          </button>
        </div>

        {mode === 'login' ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            {/* Admin Quick Fill Banner (No password displayed) */}
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2">
              <div className="text-[11px] text-emerald-900">
                <span className="font-bold flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-700" />
                  บัญชีผู้ดูแลระบบ:
                </span>
                <span className="font-mono text-slate-600">username: admin</span>
              </div>
              <button
                type="button"
                onClick={handleQuickFillAdmin}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg shrink-0 shadow-2xs"
              >
                กรอกผู้ดูแลทันที
              </button>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{loginError}</span>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">ชื่อผู้ใช้งาน (Username) *</label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="เช่น admin หรือ std_naphat"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-700">รหัสผ่าน (Password) *</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่าน..."
                  className="w-full px-3.5 py-2.5 pr-10 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
            >
              เข้าสู่ระบบ
            </button>

            {/* Quick Demo Switcher */}
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-2">
              <span className="font-semibold block text-slate-600">หรือคลิกเลือกบัญชีทดสอบด่วน:</span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    quickSwitchUser('usr_admin');
                    onClose();
                  }}
                  className="p-1.5 text-left rounded-lg bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-900 border border-slate-200"
                >
                  👑 <strong>แอดมิน (admin)</strong>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    quickSwitchUser('usr_teacher');
                    onClose();
                  }}
                  className="p-1.5 text-left rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200"
                >
                  👨‍🏫 <strong>Teacher (ครู)</strong>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    quickSwitchUser('usr_std_naphat');
                    onClose();
                  }}
                  className="p-1.5 text-left rounded-lg bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-900 border border-slate-200"
                >
                  🎓 <strong>นภัทร (อนุมัติแล้ว)</strong>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginUsername('std_wichai');
                    setLoginPassword('Student1234');
                    setLoginError('บัญชีของคุณอยู่ในสถานะ "รออนุมัติ (Pending Approval)" กรุณาแจ้ง Teacher (ครู) เพื่ออนุมัติเข้าใช้งานครับ');
                  }}
                  className="p-1.5 text-left rounded-lg bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200"
                >
                  ⏳ <strong>วิชัย (รออนุมัติ)</strong>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
            {regSuccess && (
              <div className="p-3.5 bg-emerald-50 border-2 border-emerald-300 text-emerald-950 rounded-2xl text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>สมัครสมาชิกสำเร็จเรียบร้อย!</span>
                </div>
                <p className="leading-relaxed text-[11px]">{regSuccess}</p>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="mt-2 text-emerald-800 font-bold underline block"
                >
                  กลับไปหน้าเข้าสู่ระบบ
                </button>
              </div>
            )}

            {regError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{regError}</span>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">ชื่อ - นามสกุลจริง *</label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="เช่น นายธนากร รักษ์สิ่งแวดล้อม"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ระดับชั้น (39 ห้องเรียน) *</label>
                  <select
                    value={regGradeClass}
                    onChange={(e) => setRegGradeClass(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    {[4, 5, 6].map((grade) => (
                      <optgroup
                        key={grade}
                        label={`ม.${grade}/1 ถึง ม.${grade}/13`}
                      >
                        {Array.from({ length: 13 }, (_, i) => {
                          const room = i + 1;
                          const roomCode = `ม.${grade}/${room}`;
                          return (
                            <option key={`${grade}-${room}`} value={roomCode}>
                              {roomCode}
                            </option>
                          );
                        })}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">เลขที่ (1-50) *</label>
                  <select
                    value={regSeatNumber}
                    onChange={(e) => setRegSeatNumber(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={String(num)}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">รหัสนักเรียน (ถ้ามี)</label>
                <input
                  type="text"
                  value={regStudentId}
                  onChange={(e) => setRegStudentId(e.target.value)}
                  placeholder="STD-6720"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">กำหนดชื่อผู้ใช้ (Username) *</label>
              <input
                type="text"
                required
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                placeholder="เช่น std_thanakorn"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">รหัสผ่าน (Password) *</label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="อย่างน้อย 6 ตัวอักษร"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed">
              <strong>หมายเหตุ:</strong> หลังสมัครสมาชิก บัญชีจะถูกตั้งเป็น <strong>"รออนุมัติ"</strong> Teacher (ครู) จะตรวจสอบและอนุมัติในหน้าผู้ดูแลระบบก่อน จึงจะสามารถล็อกอินได้
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
            >
              ยืนยันการสมัครสมาชิก
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
