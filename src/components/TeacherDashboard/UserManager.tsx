/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { User, UserRole } from '../../types/portal';
import { ALL_CLASSROOMS } from '../../constants/classrooms';
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  Search,
  CheckCircle,
  Clock,
  Plus,
  Trash2,
  X,
  Key,
  Eye,
  EyeOff,
  Edit3,
  Check,
  RotateCcw,
} from 'lucide-react';

export const UserManager: React.FC = () => {
  const {
    users,
    approveUser,
    rejectUser,
    updateUserRole,
    addUser,
    deleteUser,
    resetStudentPassword,
    updateStudentCredentials,
  } = usePortal();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'teacher' | 'student'>('all');

  // Password Visibility State (user ID -> boolean)
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [revealAllPasswords, setRevealAllPasswords] = useState(false);

  // Add User Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('student');
  const [newStudentId, setNewStudentId] = useState('');
  const [newGradeClass, setNewGradeClass] = useState('ม.4/1');
  const [newSeatNumber, setNewSeatNumber] = useState('1');
  const [addError, setAddError] = useState('');

  // Edit / Reset Password Modal State
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editStudentId, setEditStudentId] = useState('');
  const [editGradeClass, setEditGradeClass] = useState('');
  const [editSeatNumber, setEditSeatNumber] = useState('1');
  const [editSuccessMsg, setEditSuccessMsg] = useState('');

  const togglePasswordVisibility = (userId: string) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    if (!newName.trim() || !newUsername.trim() || !newPassword.trim()) {
      setAddError('กรุณากรอกข้อมูลที่จำเป็น (ชื่อ, ชื่อผู้ใช้, รหัสผ่าน)');
      return;
    }
    const exists = users.some((u) => u.username.toLowerCase() === newUsername.trim().toLowerCase());
    if (exists) {
      setAddError('ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว');
      return;
    }

    addUser({
      name: newName.trim(),
      username: newUsername.trim(),
      password: newPassword.trim(),
      role: newRole,
      status: 'approved',
      studentId: newRole === 'student' ? newStudentId.trim() || undefined : undefined,
      gradeClass: newRole === 'student' ? newGradeClass.trim() || undefined : undefined,
      seatNumber: newRole === 'student' ? newSeatNumber : undefined,
    });

    setShowAddModal(false);
    setNewName('');
    setNewUsername('');
    setNewPassword('');
    setNewStudentId('');
    setNewSeatNumber('1');
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditUsername(user.username);
    setEditPassword(user.password || 'Student1234');
    setEditStudentId(user.studentId || '');
    setEditGradeClass(user.gradeClass || 'ม.4/1');
    setEditSeatNumber(user.seatNumber || '1');
    setEditSuccessMsg('');
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (!editUsername.trim() || !editPassword.trim()) {
      alert('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
      return;
    }

    // Check username conflict if changed
    if (editUsername.trim().toLowerCase() !== editingUser.username.toLowerCase()) {
      const exists = users.some(
        (u) => u.id !== editingUser.id && u.username.toLowerCase() === editUsername.trim().toLowerCase()
      );
      if (exists) {
        alert('ชื่อผู้ใช้งานนี้ถูกใช้โดยบัญชีอื่นแล้ว');
        return;
      }
    }

    updateStudentCredentials(editingUser.id, {
      name: editName.trim(),
      username: editUsername.trim(),
      password: editPassword.trim(),
      studentId: editStudentId.trim() || undefined,
      gradeClass: editGradeClass.trim() || undefined,
      seatNumber: editSeatNumber || undefined,
    });

    setEditSuccessMsg('อัปเดตข้อมูลและรหัสผ่านสำเร็จเรียบร้อย!');
    setTimeout(() => {
      setEditingUser(null);
      setEditSuccessMsg('');
    }, 900);
  };

  const handleQuickReset = (user: User) => {
    const defaultNewPass = 'Student1234';
    if (confirm(`ต้องการรีเซ็ตรหัสผ่านของ "${user.name}" (@${user.username}) เป็น "${defaultNewPass}" หรือไม่?`)) {
      resetStudentPassword(user.id, defaultNewPass);
      alert(`รีเซ็ตรหัสผ่านของ @${user.username} เป็น "${defaultNewPass}" สำเร็จ!`);
    }
  };

  const pendingUsers = users.filter((u) => u.status === 'pending');

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.studentId && u.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.gradeClass && u.gradeClass.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white border border-slate-200 rounded-3xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>จัดการข้อมูลนักเรียน & รหัสผ่านเข้าใช้งาน (Student Management & User Credentials)</span>
            </h2>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              Credentials
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            ตรวจสอบ Username และ Password ของนักเรียน รีเซ็ตรหัสผ่าน อนุมัติผู้สมัครใหม่ และจัดการสิทธิ์รายบุคคล
          </p>
        </div>

        {/* Action Controls & Add User */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setRevealAllPasswords(!revealAllPasswords)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl border border-slate-300 transition-all flex items-center gap-1.5 cursor-pointer"
            title="แสดงหรือซ่อนรหัสผ่านทั้งหมดในตาราง"
          >
            {revealAllPasswords ? <EyeOff className="w-4 h-4 text-slate-600" /> : <Eye className="w-4 h-4 text-slate-600" />}
            <span>{revealAllPasswords ? 'ซ่อนรหัสผ่านทั้งหมด' : 'แสดงรหัสผ่านทั้งหมด'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md shadow-emerald-700/20 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ เพิ่มผู้ใช้งานใหม่</span>
          </button>
        </div>
      </div>

      {/* Pending Approval Priority Alert Banner */}
      {pendingUsers.length > 0 && (
        <div className="p-4 rounded-3xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-200 rounded-2xl text-amber-800 shrink-0">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-amber-900">
                มีนักเรียนรอการอนุมัติบัญชีเข้าใช้งาน ({pendingUsers.length} คน)
              </h4>
              <p className="text-xs text-amber-800/80">
                นักเรียนเหล่านี้เพิ่งลงทะเบียนและไม่สามารถเข้าสู่ระบบได้จนกว่าคุณจะกด "อนุมัติบัญชี"
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setStatusFilter('pending');
            }}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-2xl shadow-2xs transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>แสดงเฉพาะรายการที่รออนุมัติ ({pendingUsers.length})</span>
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-3xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-2xs text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาชื่อผู้ใช้, ชื่อ-สกุล, รหัสนักเรียน หรือห้องเรียน..."
            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-hidden focus:bg-white focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Role & Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 font-semibold mr-1">บทบาท:</span>
          {(['all', 'student', 'teacher', 'admin'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs cursor-pointer ${
                roleFilter === r
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r === 'all' ? 'ทุกบทบาท' : r === 'student' ? 'นักเรียน' : r === 'teacher' ? 'ครู' : 'แอดมิน'}
            </button>
          ))}

          <span className="text-slate-400 font-semibold ml-2 mr-1">สถานะ:</span>
          {[
            { id: 'all', label: 'ทั้งหมด' },
            { id: 'pending', label: `รออนุมัติ (${pendingUsers.length})` },
            { id: 'approved', label: 'อนุมัติแล้ว' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users & Credentials Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
              <tr>
                <th className="p-4">ผู้ใช้งาน (ชื่อ-นามสกุล)</th>
                <th className="p-4">ชื่อผู้ใช้ (Username)</th>
                <th className="p-4 bg-emerald-50/50 text-emerald-900">
                  <div className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-emerald-700" />
                    <span>รหัสผ่าน (Password)</span>
                  </div>
                </th>
                <th className="p-4">รหัสนักเรียน / ชั้นเรียน</th>
                <th className="p-4">บทบาท (Role)</th>
                <th className="p-4">สถานะบัญชี</th>
                <th className="p-4 text-right">การจัดการ & รีเซ็ตรหัสผ่าน</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    ไม่พบผู้ใช้งานที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isPassRevealed = revealAllPasswords || !!revealedPasswords[user.id];
                  const displayPassword = user.password || 'Student1234';

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & Avatar */}
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              user.role === 'admin'
                                ? 'bg-teal-100 text-teal-800'
                                : user.role === 'teacher'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-sky-100 text-sky-700'
                            }`}
                          >
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{user.name}</div>
                            <div className="text-[10px] text-slate-400">
                              สมัครเมื่อ {new Date(user.registeredAt).toLocaleDateString('th-TH')}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Username */}
                      <td className="p-4 font-mono font-bold text-slate-800">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                          @{user.username}
                        </span>
                      </td>

                      {/* Password Column with Reveal Toggle */}
                      <td className="p-4 bg-emerald-50/30">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-950 shadow-2xs">
                            {isPassRevealed ? displayPassword : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(user.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                            title={isPassRevealed ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                          >
                            {isPassRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                      {/* Student ID & Grade Classroom */}
                      <td className="p-4 font-mono text-slate-600">
                        {user.studentId ? (
                          <div>
                            <span className="font-bold text-slate-800">{user.studentId}</span>
                            <div className="text-[11px] text-emerald-800 font-sans font-medium flex items-center gap-1.5 flex-wrap">
                              <span>{user.gradeClass || '-'}</span>
                              {user.seatNumber && (
                                <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                                  เลขที่ {user.seatNumber}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Role Selector */}
                      <td className="p-4">
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                          disabled={user.username === 'admin'}
                          className="px-2 py-1 rounded-lg border border-slate-200 bg-white font-semibold text-xs focus:outline-hidden focus:border-emerald-500 disabled:opacity-50"
                        >
                          <option value="student">🎓 นักเรียน (Student)</option>
                          <option value="teacher">👨‍🏫 Teacher (ครู)</option>
                          <option value="admin">👑 ผู้ดูแลระบบ (Admin)</option>
                        </select>
                      </td>

                      {/* Status Badge */}
                      <td className="p-4">
                        {user.status === 'approved' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>อนุมัติแล้ว</span>
                          </span>
                        )}

                        {user.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full animate-pulse">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>รอครูอนุมัติ</span>
                          </span>
                        )}

                        {user.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                            <UserX className="w-3 h-3 text-rose-600" />
                            <span>ระงับสิทธิ์</span>
                          </span>
                        )}
                      </td>

                      {/* Actions: Reset Password / Edit / Delete */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {user.status === 'pending' && (
                            <>
                              <button
                                onClick={() => approveUser(user.id)}
                                className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors shadow-2xs cursor-pointer"
                                title="อนุมัติให้นักเรียนเข้าสู่ระบบได้"
                              >
                                <UserCheck className="w-3 h-3" />
                                <span>อนุมัติ</span>
                              </button>

                              <button
                                onClick={() => rejectUser(user.id)}
                                className="flex items-center gap-1 px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-lg border border-rose-200 transition-colors cursor-pointer"
                                title="ปฏิเสธคำขอ"
                              >
                                <UserX className="w-3 h-3" />
                                <span>ปฏิเสธ</span>
                              </button>
                            </>
                          )}

                          {/* Edit Credentials / Reset Password Button */}
                          <button
                            onClick={() => openEditModal(user)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-xs rounded-lg border border-emerald-300 transition-colors shadow-2xs cursor-pointer"
                            title="แก้ไข Username, Password หรือข้อมูลนักเรียน"
                          >
                            <Key className="w-3 h-3 text-emerald-600" />
                            <span>แก้ไขรหัสผ่าน</span>
                          </button>

                          {/* Quick Reset to Default Button */}
                          {user.username !== 'admin' && (
                            <button
                              onClick={() => handleQuickReset(user)}
                              className="p-1 text-slate-400 hover:text-amber-700 rounded-lg hover:bg-amber-50 transition-colors cursor-pointer"
                              title="รีเซ็ตรหัสผ่านด่วนเป็น Student1234"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Delete user button for non-admin */}
                          {user.username !== 'admin' && (
                            <button
                              onClick={() => {
                                if (confirm(`คุณต้องการลบบัญชีผู้ใช้ "${user.name}" (@${user.username}) หรือไม่?`)) {
                                  deleteUser(user.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                              title="ลบบัญชีผู้ใช้"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Credentials & Reset Password Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-emerald-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Key className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    แก้ไขข้อมูล & รีเซ็ตรหัสผ่านนักเรียน
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    บัญชี: @{editingUser.username} ({editingUser.name})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{editSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveCredentials} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ชื่อผู้ใช้งาน (Username) *</label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    required
                    disabled={editingUser.username === 'admin'}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono focus:outline-hidden focus:border-emerald-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-emerald-800">
                    รหัสผ่านใหม่ (Password) *
                  </label>
                  <input
                    type="text"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    required
                    placeholder="พิมพ์รหัสผ่านใหม่"
                    className="w-full px-3 py-2 rounded-xl border border-emerald-400 bg-emerald-50/40 font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {editingUser.role === 'student' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">ระดับชั้น (39 ห้องเรียน)</label>
                      <select
                        value={editGradeClass}
                        onChange={(e) => setEditGradeClass(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
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
                      <label className="block font-bold text-slate-700 mb-1">เลขที่ (1-50)</label>
                      <select
                        value={editSeatNumber}
                        onChange={(e) => setEditSeatNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
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
                    <label className="block font-bold text-slate-700 mb-1">รหัสนักเรียน</label>
                    <input
                      type="text"
                      value={editStudentId}
                      onChange={(e) => setEditStudentId(e.target.value)}
                      placeholder="STD-6701"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono"
                    />
                  </div>
                </>
              )}

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="font-bold text-slate-800">💡 คำแนะนำผู้ดูแลระบบ:</div>
                <p>
                  เมื่อเปลี่ยนรหัสผ่านแล้ว นักเรียนจะสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้ทันที
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-md shadow-emerald-700/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  บันทึกข้อมูลและรหัสผ่านใหม่
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-emerald-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                <span>เพิ่มผู้ใช้งานใหม่ (Add User)</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {addError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ชื่อ-นามสกุล *</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="เช่น นายธนวัฒน์ พัฒนศิลป์"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ชื่อผู้ใช้ (Username) *</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="std_thanawat"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">รหัสผ่าน *</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">บทบาท (Role) *</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold"
                >
                  <option value="student">🎓 นักเรียน (Student)</option>
                  <option value="teacher">👨‍🏫 Teacher (ครู)</option>
                  <option value="admin">👑 ผู้ดูแลระบบ (Admin)</option>
                </select>
              </div>

              {newRole === 'student' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">ระดับชั้น (39 ห้องเรียน)</label>
                      <select
                        value={newGradeClass}
                        onChange={(e) => setNewGradeClass(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
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
                      <label className="block font-bold text-slate-700 mb-1">เลขที่ (1-50)</label>
                      <select
                        value={newSeatNumber}
                        onChange={(e) => setNewSeatNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
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
                    <label className="block font-bold text-slate-700 mb-1">รหัสนักเรียน</label>
                    <input
                      type="text"
                      value={newStudentId}
                      onChange={(e) => setNewStudentId(e.target.value)}
                      placeholder="STD-6710"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono"
                    />
                  </div>
                </>
              )}

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  บันทึกผู้ใช้ใหม่
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
