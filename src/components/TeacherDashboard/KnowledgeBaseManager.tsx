/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { KnowledgeDoc, KnowledgePage } from '../../types/portal';
import {
  FileText,
  UploadCloud,
  RefreshCw,
  Trash2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Plus,
  X,
  FileCode,
  Tag,
  BookOpen,
} from 'lucide-react';

export const KnowledgeBaseManager: React.FC = () => {
  const { knowledgeDocs, uploadKnowledgeDoc, retryKnowledgeDoc, deleteKnowledgeDoc, currentUser } =
    usePortal();

  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [inspectDoc, setInspectDoc] = useState<KnowledgeDoc | null>(null);

  // Form states
  const [docTitle, setDocTitle] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState<'pdf' | 'image'>('pdf');
  const [docSummary, setDocSummary] = useState('');
  const [tagsInput, setTagsInput] = useState('PM2.5, ภูมิศาสตร์, มาตรฐาน');
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !fileName.trim()) return;

    setIsSimulatingUpload(true);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    uploadKnowledgeDoc({
      title: docTitle.trim(),
      fileName: fileName.trim().endsWith('.pdf') ? fileName.trim() : `${fileName.trim()}.pdf`,
      fileType,
      fileSize: `${(Math.random() * 4 + 1.5).toFixed(1)} MB`,
      pageCount: fileType === 'pdf' ? 3 : 1,
      uploadedBy: currentUser?.name || 'Teacher (ครู)',
      summary: docSummary.trim() || 'เอกสารอ้างอิงทางวิชาการด้านสิ่งแวดล้อม',
      tags,
      pages: [
        {
          pageNumber: 1,
          title: 'หน้า 1: บทนำและสาระสำคัญของเอกสาร',
          content: docSummary || 'ข้อมูลเนื้อหาวิชาการที่ได้รับการแปลงจากไฟล์เอกสารเพื่อใช้เป็นฐานข้อมูลอ้างอิงให้แก่ระบบ Eco bot',
          keyTerms: tags,
        },
        {
          pageNumber: 2,
          title: 'หน้า 2: ปัจจัยทางภูมิศาสตร์และผลกระทบ',
          content: 'การสะสมตัวของมลพิษทางอากาศมีความสัมพันธ์เชิงพื้นที่กับสภาพภูมิประเทศ แอ่งกระทะ และสภาวะอุตุนิยมวิทยาเฉพาะถิ่น',
          keyTerms: ['มลพิษ', 'ภูมิศาสตร์', 'การสะสมตัว'],
        },
      ],
    });

    setTimeout(() => {
      setIsSimulatingUpload(false);
      setShowUploadModal(false);
      setDocTitle('');
      setFileName('');
      setDocSummary('');
    }, 600);
  };

  const handleFileDropSimulation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setDocTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      setFileType(file.name.toLowerCase().endsWith('.png') || file.name.toLowerCase().endsWith('.jpg') ? 'image' : 'pdf');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <span>AI Knowledge Base: คลังเอกสารอ้างอิงสำหรับ Eco bot</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            อัปโหลดไฟล์ PDF หรือ รูปภาพ เพื่อแปลงเป็นคลังความรู้สำหรับประมวลผลข้อความ พร้อมระบบตรวจสถานะการประมวลผล
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs shrink-0"
        >
          <UploadCloud className="w-4 h-4" />
          <span>อัปโหลดเอกสารเข้าสู่ระบบ</span>
        </button>
      </div>

      {/* Documents Table / Card List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            เอกสารในคลังความรู้ทั้งหมด ({knowledgeDocs.length} ฉบับ)
          </span>
          <span className="text-[11px] text-slate-500">
            * Eco bot จะดึงเนื้อหาจากเอกสารเหล่านี้ไปช่วยคิดวิพากษ์และตอบคำถาม
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {knowledgeDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
            >
              {/* Doc details */}
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <div
                  className={`p-3 rounded-2xl shrink-0 ${
                    doc.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-700'
                      : doc.status === 'processing'
                      ? 'bg-sky-100 text-sky-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 truncate">
                      {doc.title}
                    </h3>

                    {/* Status Badge */}
                    {doc.status === 'completed' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>ประมวลผลเสร็จสมบูรณ์</span>
                      </span>
                    )}

                    {doc.status === 'processing' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full animate-pulse">
                        <Loader2 className="w-3 h-3 text-sky-600 animate-spin" />
                        <span>กำลังอ่านและแยกหน้าเอกสาร...</span>
                      </span>
                    )}

                    {doc.status === 'failed' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        <span>การประมวลผลล้มเหลว</span>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono">
                    <span>ไฟล์: {doc.fileName}</span>
                    <span>•</span>
                    <span>ขนาด: {doc.fileSize}</span>
                    <span>•</span>
                    <span>จำนวน: {doc.pageCount} หน้า</span>
                    <span>•</span>
                    <span>อัปโหลดโดย: {doc.uploadedBy}</span>
                  </div>

                  {/* Summary / Error snippet */}
                  {doc.errorMessage ? (
                    <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200 font-medium">
                      ⚠️ สาเหตุที่ล้มเหลว: {doc.errorMessage}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-600 line-clamp-1">
                      {doc.summary}
                    </p>
                  )}

                  {/* Tags */}
                  {doc.tags && doc.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 pt-1">
                      {doc.tags.map((t, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                {/* Retry Button: Highlighted especially for failed documents! */}
                {doc.status === 'failed' ? (
                  <button
                    onClick={() => retryKnowledgeDoc(doc.id)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                    title="ลองประมวลผลไฟล์นี้ใหม่อีกครั้ง"
                  >
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>ลองใหม่ (Retry)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => retryKnowledgeDoc(doc.id)}
                    className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl border border-slate-200 transition-colors"
                    title="วิเคราะห์เอกสารซ้ำ (Re-index)"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Inspect Pages Button */}
                <button
                  disabled={doc.status !== 'completed'}
                  onClick={() => setInspectDoc(doc)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 disabled:opacity-40 transition-colors shadow-2xs"
                  title="ดูเนื้อหาที่แยกออกมาตามเลขหน้า"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>ดูหน้าเอกสาร</span>
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => {
                    if (confirm(`คุณต้องการลบเอกสาร "${doc.title}" ออกจากคลังความรู้ใช่หรือไม่?`)) {
                      deleteKnowledgeDoc(doc.id);
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="ลบเอกสารนี้"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div
            className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 text-slate-800 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  อัปโหลดเอกสารเข้าสู่ AI Knowledge Base
                </h3>
                <p className="text-xs text-slate-500">
                  รองรับเอกสาร PDF และรูปภาพข้อมูลสารสนเทศ (Infographic/Chart)
                </p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              {/* Dropzone Simulation */}
              <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center bg-slate-50/50 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileDropSimulation}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="font-bold text-slate-800">
                  {fileName ? `ไฟล์ที่เลือก: ${fileName}` : 'ลากไฟล์ PDF หรือคลิกเพื่อเลือกไฟล์'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  ขนาดไฟล์ไม่เกิน 25 MB (ระบบจะถอดรหัสข้อความและสร้างดัชนีอัตโนมัติ)
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ชื่อเอกสารอ้างอิง *</label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="เช่น รายงานคุณภาพอากาศและฝุ่นควันภาคเหนือ กรมควบคุมมลพิษ 2567"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ชื่อไฟล์จำลอง (File Name) *</label>
                  <input
                    type="text"
                    required
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="Air_Report_2024.pdf"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ประเภทเอกสาร</label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  >
                    <option value="pdf">PDF Document (.pdf)</option>
                    <option value="image">รูปภาพ / Infographic (.png, .jpg)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">คำสำคัญ (Tags คั่นด้วยจุลภาค)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="PM2.5, ภูมิศาสตร์, แอ่งกระทะ, กฎหมาย"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">บทสรุปสังเขปของเอกสาร</label>
                <textarea
                  rows={3}
                  value={docSummary}
                  onChange={(e) => setDocSummary(e.target.value)}
                  placeholder="สรุปสาระสำคัญของเอกสารฉบับนี้เพื่อช่วยให้ AI เข้าใจบริบท..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSimulatingUpload}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSimulatingUpload ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>กำลังส่งเข้าสู่ AI...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>เริ่มต้นแปลงไฟล์</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect Document Pages Modal */}
      {inspectDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div
            className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 text-slate-800 space-y-4 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {inspectDoc.title}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {inspectDoc.fileName} • แยกได้ทั้งหมด {inspectDoc.pages.length} หน้า
                </p>
              </div>
              <button
                onClick={() => setInspectDoc(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 p-1">
              {inspectDoc.pages.map((p) => (
                <div
                  key={p.pageNumber}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      หน้า {p.pageNumber}
                    </span>
                    {p.title && <span className="font-bold text-slate-800">{p.title}</span>}
                  </div>
                  <p className="text-slate-700 leading-relaxed font-sans">
                    {p.content}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectDoc(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
