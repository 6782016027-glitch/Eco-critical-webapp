/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Citation, KnowledgeDoc } from '../types/portal';
import {
  X,
  FileText,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  BookOpen,
  Bookmark,
  Share2,
  CheckCircle,
} from 'lucide-react';

interface CitationPreviewModalProps {
  citation: Citation | null;
  knowledgeDocs: KnowledgeDoc[];
  onClose: () => void;
  onAskFurther?: (text: string) => void;
}

export const CitationPreviewModal: React.FC<CitationPreviewModalProps> = ({
  citation,
  knowledgeDocs,
  onClose,
  onAskFurther,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [copied, setCopied] = useState<boolean>(false);

  // Match document from knowledgeDocs
  const matchedDoc = knowledgeDocs.find(
    (d) => d.id === citation?.docId || d.title === citation?.docTitle
  );

  useEffect(() => {
    if (citation) {
      setCurrentPage(citation.pageNumber || 1);
      setZoomLevel(100);
      setCopied(false);
    }
  }, [citation]);

  if (!citation) return null;

  const totalPages = matchedDoc?.pages.length || matchedDoc?.pageCount || 5;
  const currentPageData = matchedDoc?.pages.find((p) => p.pageNumber === currentPage);

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(
      `"${citation.quote}" — อ้างอิงจาก: ${citation.docTitle} (หน้า ${citation.pageNumber})`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-b border-emerald-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-200">
                  {matchedDoc?.fileType?.toUpperCase() || 'PDF DOCUMENT'}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {citation.fileName || matchedDoc?.fileName || 'Reference_Document.pdf'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate mt-0.5">
                {citation.docTitle || matchedDoc?.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyQuote}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs"
              title="คัดลอกข้อความอ้างอิงพร้อมแหล่งที่มา"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">คัดลอกแล้ว</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>คัดลอกข้อความอ้างอิง</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl bg-white/80 hover:bg-white border border-slate-200 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Split view of PDF Preview + Citation Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden min-h-[500px]">
          {/* Left: Document PDF Page Viewer (7 cols) */}
          <div className="lg:col-span-7 bg-slate-100/80 border-r border-slate-200 flex flex-col overflow-hidden">
            {/* Viewer Controls Toolbar */}
            <div className="px-4 py-2 bg-white border-b border-slate-200 flex items-center justify-between gap-3 text-xs text-slate-600">
              {/* Page Selector */}
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors"
                  title="หน้าก่อนหน้า"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-semibold text-slate-800 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-md font-mono">
                  หน้า {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors"
                  title="หน้าถัดไป"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Jump to Citation Page Button */}
              {currentPage !== citation.pageNumber && (
                <button
                  onClick={() => setCurrentPage(citation.pageNumber)}
                  className="text-[11px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-semibold px-2 py-1 rounded-md border border-emerald-200 flex items-center gap-1"
                >
                  <Bookmark className="w-3 h-3 text-emerald-600" />
                  <span>กลับไปยังหน้าที่อ้างอิง ({citation.pageNumber})</span>
                </button>
              )}

              {/* Zoom Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
                  className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  title="ย่อขนาด"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[11px] text-slate-500 w-10 text-center">
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
                  className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  title="ขยายขนาด"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Scrollable PDF Canvas Container */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex justify-center">
              <div
                className="w-full max-w-xl bg-white rounded-lg shadow-lg border border-slate-300 p-8 text-slate-800 transition-transform duration-150 origin-top flex flex-col justify-between"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  minHeight: '620px',
                }}
              >
                {/* Simulated PDF Header */}
                <div className="pb-4 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{citation.fileName || 'ECO_KNOWLEDGE_DOCUMENT.PDF'}</span>
                  <span>หน้า {currentPage}</span>
                </div>

                {/* Page Content */}
                <div className="py-6 space-y-4 text-xs sm:text-sm leading-relaxed text-slate-700">
                  {currentPageData?.title && (
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 border-l-4 border-emerald-500 pl-3">
                      {currentPageData.title}
                    </h4>
                  )}

                  {/* Render content: If on the cited page, highlight the exact citation quote! */}
                  {currentPage === citation.pageNumber ? (
                    <div className="space-y-4">
                      {/* Highlighted Citation Box */}
                      <div className="relative p-4 rounded-xl bg-amber-50/90 border-2 border-amber-300 text-amber-950 shadow-xs">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800 mb-1.5">
                          <Bookmark className="w-3.5 h-3.5 text-amber-700" />
                          <span>ข้อความอ้างอิงต้นฉบับที่นำมาตอบ (Cited Source Passage):</span>
                        </div>
                        <p className="font-medium text-xs sm:text-sm leading-relaxed italic">
                          "{citation.quote}"
                        </p>
                      </div>

                      {/* Surrounding Context Content */}
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                        {currentPageData?.content || citation.contextText || 'ข้อความแวดล้อมเพิ่มเติมในหน้าเอกสารฉบับนี้ เพื่อแสดงความสมบูรณ์ของบริบทการวิเคราะห์ทางภูมิศาสตร์สิ่งแวดล้อม'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-slate-700">
                        {currentPageData?.content ||
                          `เนื้อหาเอกสารหน้า ${currentPage} ซึ่งประกอบด้วยข้อมูลวิชาการ แผนภูมิ และการอ้างอิงประกอบการศึกษามลพิษทางอากาศ`}
                      </p>
                    </div>
                  )}

                  {/* Key terms if any */}
                  {currentPageData?.keyTerms && (
                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-semibold">คำสำคัญ:</span>
                      {currentPageData.keyTerms.map((term, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                        >
                          {term}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Simulated PDF Footer */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>กระทรวงทรัพยากรธรรมชาติและสิ่งแวดล้อม / ศูนย์วิจัยมลพิษ</span>
                  <span>หน้า {currentPage} จาก {totalPages}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Citation Inspector & Metadata Panel (5 cols) */}
          <div className="lg:col-span-5 p-6 bg-white overflow-y-auto flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-1">
                  <Bookmark className="w-4 h-4 text-emerald-600" />
                  <span>รายละเอียดการอ้างอิงทางวิชาการ (Citation Details)</span>
                </div>
                <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                  {citation.docTitle}
                </h4>
              </div>

              {/* Exact Quote Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  ข้อความต้นฉบับที่อ้างอิง:
                </span>
                <blockquote className="text-xs sm:text-sm text-slate-800 font-medium italic border-l-3 border-emerald-500 pl-3 leading-relaxed">
                  "{citation.quote}"
                </blockquote>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] font-semibold">หน้าที่อ้างอิง</span>
                  <span className="text-slate-900 font-bold text-sm font-mono">
                    หน้า {citation.pageNumber} จาก {totalPages}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] font-semibold">ประเภทเอกสาร</span>
                  <span className="text-emerald-700 font-bold text-sm">
                    {matchedDoc?.fileType?.toUpperCase() || 'PDF Document'} ({matchedDoc?.fileSize || '3.5 MB'})
                  </span>
                </div>
              </div>

              {/* Document Summary Context */}
              {matchedDoc?.summary && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                    บริบทของเอกสารอ้างอิง:
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed bg-sky-50/50 p-3 rounded-xl border border-sky-100">
                    {matchedDoc.summary}
                  </p>
                </div>
              )}

              {/* Relevance explanation */}
              {citation.relevanceExplanation && (
                <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                  <span className="font-bold block mb-1">ความเชื่อมโยงกับคำถามของคุณ:</span>
                  {citation.relevanceExplanation}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              {onAskFurther && (
                <button
                  onClick={() => {
                    onAskFurther(
                      `ช่วยอธิบายขยายความประเด็นในเอกสาร "${citation.docTitle}" หน้า ${citation.pageNumber} ที่ระบุว่า "${citation.quote}" เพิ่มเติมในมิติการคิดวิพากษ์ครับ`
                    );
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>ถาม Eco bot ขยายความต่อจากหน้านี้</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="w-full py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
              >
                ปิดหน้าต่างพรีวิว
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
