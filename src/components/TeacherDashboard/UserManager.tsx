/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { User, UserRole, UserStatus } from '../../types/portal';
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  GraduationCap,
  Briefcase,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Plus,
  Trash2,
  X,
} from 'lucide-react';

export const UserManager: React.FC = () => {
  const { users, approveUser, rejectUser, updateUserRole, currentUser, addUser, deleteUser } = usePortal();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'teacher' | 'student'>('all');

  // Add User Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('student');
  const [newStudentId, setNewStudentId] = useState('');
  const [newGradeClass, setNewGradeClass] = useState('มัธยมศึกษาปีที่ 5/1');
  const [addError, setAddError] = useState('');

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
    });

    setShowAddModal(false);
    setNewName('');
    setNewUsername('');
    setNewPassword('');
    setNewStudentId('');
  };

  const pendingUsers = users.filter((u) => u.status === 'pending');

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.studentId && u.studentId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <span>จัดการผู้ใช้และอนุมัติบัญชีนักเรียน (User & Role Management)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            อนุมัติบัญชีนักเรียนที่สมัครใหม่ กำหนดสิทธิ์บทบาท (Admin, Teacher, Student) และจัดการความปลอดภัย
          </p>
        </div>

        {/* Action Controls & Default Admin Notice */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md shadow-emerald-700/20 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ เพิ่มผู้ใช้งานใหม่</span>
          </button>

          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center gap-2 shrink-0">
            <Shield className="w-4 h-4 text-emerald-700" />
            <div>
              <div className="font-bold">บัญชีผู้ดูแลระบบ:</div>
              <div className="font-mono text-[11px] text-slate-600">
                username: <strong className="text-emerald-800">admin</strong>
              </div>
            </div>
          </div>
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
            placeholder="ค้นหาชื่อผู้ใช้, ชื่อ-สกุล หรือรหัสนักเรียน..."
            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 font-semibold mr-1">สถานะ:</span>
          {[
            { id: 'all', label: 'ทั้งหมด' },
            { id: 'pending', label: `รออนุมัติ (${pendingUsers.length})` },
            { id: 'approved', label: 'อนุมัติแล้ว' },
            { id: 'rejected', label: 'ระงับสิทธิ์' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3.5 py-2 rounded-2xl font-bold transition-all duration-200 cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-700/20 scale-105'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:scale-102 border border-slate-200/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
              <tr>
                <th className="p-4">ผู้ใช้งาน / บัญชี</th>
                <th className="p-4">รหัสนักเรียน / ชั้นเรียน</th>
                <th className="p-4">บทบาท (Role)</th>
                <th className="p-4">สถานะการอนุมัติ</th>
                <th className="p-4">วันที่สมัคร</th>
                <th className="p-4 text-right">การจัดการสิทธิ์ & CRUD</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Name & Username */}
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
                        <div className="text-[11px] text-slate-400 font-mono">@{user.username}</div>
                      </div>
                    </div>
                  </td>

                  {/* Student ID / Class */}
                  <td className="p-4 font-mono text-slate-600">
                    {user.studentId ? (
                      <div>
                        <span className="font-bold text-slate-800">{user.studentId}</span>
                        <div className="text-[11px] text-slate-400">{user.gradeClass || '-'}</div>
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
                      className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white font-semibold text-xs focus:outline-none focus:border-emerald-500 disabled:opacity-50"
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

                  {/* Registered Date */}
                  <td className="p-4 text-slate-500 font-mono text-[11px]">
                    {new Date(user.registeredAt).toLocaleDateString('th-TH')}
                  </td>

                  {/* Actions: Approve / Reject / Delete */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {user.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => approveUser(user.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors shadow-2xs"
                            title="อนุมัติให้นักเรียนเข้าสู่ระบบได้"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>อนุมัติ</span>
                          </button>

                          <button
                            onClick={() => rejectUser(user.id)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-lg border border-rose-200 transition-colors"
                            title="ปฏิเสธคำขอ"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            <span>ปฏิเสธ</span>
                          </button>
                        </>
                      ) : user.username !== 'admin' ? (
                        user.status === 'approved' ? (
                          <button
                            onClick={() => rejectUser(user.id)}
                            className="text-slate-400 hover:text-amber-600 font-medium text-[11px] hover:underline"
                          >
                            ระงับบัญชี
                          </button>
                        ) : (
                          <button
                            onClick={() => approveUser(user.id)}
                            className="text-emerald-600 hover:text-emerald-700 font-bold text-[11px] hover:underline"
                          >
                            คืนสิทธิ์
                          </button>
                        )
                      ) : (
                        <span className="text-[11px] text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          บัญชีหลัก
                        </span>
                      )}

                      {/* Delete user button for non-admin */}
                      {user.username !== 'admin' && (
                        <button
                          onClick={() => {
                            if (confirm(`คุณต้องการลบบัญชีผู้ใช้ "${user.name}" (@${user.username}) หรือไม่?`)) {
                              deleteUser(user.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="ลบบัญชีผู้ใช้"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-emerald-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                <span>เพิ่มผู้ใช้งานใหม่ (Add User)</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
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
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
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
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
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
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">รหัสนักเรียน</label>
                    <input
                      type="text"
                      value={newStudentId}
                      onChange={(e) => setNewStudentId(e.target.value)}
                      placeholder="STD-6710"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ระดับชั้น</label>
                    <select
                      value={newGradeClass}
                      onChange={(e) => setNewGradeClass(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
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
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
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
