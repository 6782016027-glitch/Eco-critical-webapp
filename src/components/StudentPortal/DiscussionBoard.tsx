/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { ForumTopic } from '../../types/portal';
import thaiStudentsBikeImg from '../../assets/images/thai_students_clean_air_bike_1794307914087.jpg';
import {
  MessageSquare,
  Plus,
  Heart,
  Send,
  User,
  Shield,
  GraduationCap,
  Sparkles,
  Pin,
  Clock,
  Search,
  Filter,
  X,
  ChevronRight,
} from 'lucide-react';

export const DiscussionBoard: React.FC = () => {
  const { forumTopics, addTopic, addReply, toggleLikeTopic, currentUser } = usePortal();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTopic, setActiveTopic] = useState<ForumTopic | null>(null);

  // New topic modal state
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('การคิดวิพากษ์เชิงนโยบาย');
  const [newTagsInput, setNewTagsInput] = useState('PM2.5, ปัญหาฝุ่น');

  // Reply form state
  const [replyContent, setReplyContent] = useState('');

  const categories = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'การคิดวิพากษ์เชิงนโยบาย', label: 'การคิดวิพากษ์เชิงนโยบาย' },
    { id: 'ความยุติธรรมทางสิ่งแวดล้อม', label: 'ความยุติธรรมทางสิ่งแวดล้อม' },
    { id: 'ภูมิสารสนเทศและภูมิศาสตร์กายภาพ', label: 'ภูมิสารสนเทศ & ภูมิศาสตร์กายภาพ' },
    { id: 'ถาม-ตอบข้อสงสัยการบ้าน', label: 'ถาม-ตอบข้อสงสัยการบ้าน' },
  ];

  const filteredTopics = forumTopics.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || t.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const tags = newTagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addTopic({
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      tags,
    });

    setNewTitle('');
    setNewContent('');
    setShowNewTopicModal(false);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTopic || !replyContent.trim()) return;

    addReply(activeTopic.id, replyContent.trim());
    setReplyContent('');

    // Update active topic view
    const updated = forumTopics.find((t) => t.id === activeTopic.id);
    if (updated) setActiveTopic(updated);
  };

  // Re-sync activeTopic when forumTopics changes
  const currentActiveTopic = activeTopic
    ? forumTopics.find((t) => t.id === activeTopic.id) || activeTopic
    : null;

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={thaiStudentsBikeImg}
            alt="นักเรียนมัธยมไทยร่วมอภิปรายแลกเปลี่ยนความรู้"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-200 shadow-2xs shrink-0"
          />
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-emerald-600" />
              <span>เว็บบอร์ดแลกเปลี่ยนเรียนรู้ (Environmental Geography Forum)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              พื้นที่อภิปราย ถกเถียงเชิงวิพากษ์ และถาม-ตอบระหว่างนักเรียน Teacher (ครู) และผู้ช่วยวิจัย
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowNewTopicModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>ตั้งกระทู้ชวนคุยใหม่</span>
        </button>
      </div>

      {/* Main Forum View: Master / Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Topics List (5 cols or full) */}
        <div className={`space-y-4 ${currentActiveTopic ? 'lg:col-span-5' : 'lg:col-span-12'}`}>
          {/* Search & Category Filter */}
          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-2xs space-y-3 text-xs">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาชื่อกระทู้ คำสำคัญ หรือเนื้อหา..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium transition-colors ${
                    selectedCategory === c.id
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Topics Card List */}
          <div className="space-y-3">
            {filteredTopics.map((topic) => {
              const isSelected = currentActiveTopic?.id === topic.id;
              return (
                <div
                  key={topic.id}
                  onClick={() => setActiveTopic(topic)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-400 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {topic.isPinned && (
                          <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                            <Pin className="w-3 h-3 text-amber-700" />
                            ปักหมุด
                          </span>
                        )}
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {topic.category}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-2 leading-snug">
                        {topic.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {topic.content}
                      </p>

                      {/* Author & Stats footer */}
                      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                        <span className="font-medium text-slate-600">
                          โดย {topic.authorName}
                        </span>

                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-rose-500 fill-rose-500/20" />
                            {topic.likes}
                          </span>
                          <span className="flex items-center gap-1 font-bold text-emerald-700">
                            <MessageSquare className="w-3 h-3 text-emerald-600" />
                            {topic.replies.length} คำตอบ
                          </span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-slate-300 shrink-0 self-center hidden sm:block" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Topic Detailed View & Replies (7 cols) */}
        {currentActiveTopic && (
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {currentActiveTopic.category}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {new Date(currentActiveTopic.createdAt).toLocaleDateString('th-TH')}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                    {currentActiveTopic.title}
                  </h2>
                </div>

                <button
                  onClick={() => setActiveTopic(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
                  title="ปิดมุมมองนี้"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Author & Main Content */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700">
                      {currentActiveTopic.authorName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">
                        {currentActiveTopic.authorName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {currentActiveTopic.authorRole === 'teacher'
                          ? '👨‍🏫 Teacher (ครู)'
                          : currentActiveTopic.authorRole === 'admin'
                          ? '👑 ผู้ดูแลระบบ'
                          : '🎓 นักเรียน'}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleLikeTopic(currentActiveTopic.id)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-full border border-rose-200 transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-500" />
                    <span>{currentActiveTopic.likes} ถูกใจ</span>
                  </button>
                </div>

                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  {currentActiveTopic.content}
                </div>

                {/* Tags */}
                {currentActiveTopic.tags && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {currentActiveTopic.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Replies Thread */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>ความคิดเห็นทั้งหมด ({currentActiveTopic.replies.length} คำตอบ)</span>
                </h4>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {currentActiveTopic.replies.map((reply) => {
                    const isTeacherReply =
                      reply.authorRole === 'teacher' || reply.authorRole === 'admin';
                    return (
                      <div
                        key={reply.id}
                        className={`p-4 rounded-2xl border text-xs space-y-2 ${
                          isTeacherReply
                            ? 'bg-emerald-50/60 border-emerald-200'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{reply.authorName}</span>
                            {isTeacherReply && (
                              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                                {reply.authorRole === 'admin' ? 'ผู้ดูแลระบบ' : 'Teacher (ครู)'}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(reply.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <p className="text-slate-700 leading-relaxed font-sans">{reply.content}</p>
                      </div>
                    );
                  })}

                  {currentActiveTopic.replies.length === 0 && (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      ยังไม่มีความคิดเห็นในกระทู้นี้ ร่วมแสดงความคิดเห็นเป็นคนแรกได้เลยครับ
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Post Reply Form */}
            <form onSubmit={handleSendReply} className="pt-4 border-t border-slate-100 space-y-2">
              <div className="text-xs font-bold text-slate-700">ร่วมแสดงความคิดเห็นหรือตอบคำถาม:</div>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="พิมพ์ความคิดเห็นของคุณที่นี่..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!replyContent.trim()}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-40 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ส่งคำตอบ</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* New Topic Modal */}
      {showNewTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div
            className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 text-slate-800 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900">ตั้งกระทู้ชวนคุยและคิดวิพากษ์ใหม่</h3>
                <p className="text-xs text-slate-500">
                  ชวนเพื่อนและ Teacher (ครู) ถกเถียงประเด็นมลพิษทางอากาศและภูมิศาสตร์
                </p>
              </div>
              <button
                onClick={() => setShowNewTopicModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">หัวข้อกระทู้ *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="เช่น ทำไมการแก้ปัญหาหมอกควันข้ามแดนในอาเซียนจึงติดขัด?"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">หมวดหมู่</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                >
                  <option value="การคิดวิพากษ์เชิงนโยบาย">การคิดวิพากษ์เชิงนโยบาย</option>
                  <option value="ความยุติธรรมทางสิ่งแวดล้อม">ความยุติธรรมทางสิ่งแวดล้อม</option>
                  <option value="ภูมิสารสนเทศและภูมิศาสตร์กายภาพ">ภูมิสารสนเทศและภูมิศาสตร์กายภาพ</option>
                  <option value="ถาม-ตอบข้อสงสัยการบ้าน">ถาม-ตอบข้อสงสัยการบ้าน</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">คำสำคัญ (Tags)</label>
                <input
                  type="text"
                  value={newTagsInput}
                  onChange={(e) => setNewTagsInput(e.target.value)}
                  placeholder="PM2.5, อาเซียน, หมอกควัน"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">เนื้อหากระทู้ / คำถามนำ *</label>
                <textarea
                  rows={5}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="อธิบายความคิดเห็น ข้อสังเกต หรือคำถามที่คุณอยากชวนทุกคนมาวิพากษ์ร่วมกัน..."
                  className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewTopicModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                >
                  เผยแพร่กระทู้
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
