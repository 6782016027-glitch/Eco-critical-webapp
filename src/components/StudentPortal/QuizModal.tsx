/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lesson, QuizQuestion } from '../../types/portal';
import { usePortal } from '../../context/PortalContext';
import confetti from 'canvas-confetti';
import {
  X,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Award,
  ArrowRight,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

interface QuizModalProps {
  lesson: Lesson;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ lesson, onClose }) => {
  const { recordQuizResult } = usePortal();

  const questions = lesson.quizzes || [];
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    new Array(questions.length).fill(-1)
  );
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div className="bg-white rounded-3xl p-6 max-w-md w-full text-center space-y-4">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-lg text-slate-800">ยังไม่มีแบบทดสอบสำหรับบทเรียนนี้</h3>
          <p className="text-xs text-slate-500">
            Teacher (ครู) ยังไม่ได้เพิ่มแบบทดสอบท้ายบทเรียน คุณสามารถศึกษาเนื้อหาต่อหรือสอบถาม Eco bot ได้
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    );
  }

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    const updated = [...selectedAnswers];
    updated[currentIdx] = optionIndex;
    setSelectedAnswers(updated);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    let calculatedScore = 0;
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctIndex) {
        calculatedScore += 1;
      }
    });

    recordQuizResult({
      lessonId: lesson.id,
      score: calculatedScore,
      total: questions.length,
      completedAt: new Date().toISOString(),
      answers: selectedAnswers,
    });

    if (calculatedScore / questions.length >= 0.7) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRetry = () => {
    setSelectedAnswers(new Array(questions.length).fill(-1));
    setCurrentIdx(0);
    setIsSubmitted(false);
  };

  // Compute final score
  let score = 0;
  questions.forEach((q, i) => {
    if (selectedAnswers[i] === q.correctIndex) {
      score += 1;
    }
  });

  const currentQ = questions[currentIdx];
  const allAnswered = selectedAnswers.every((ans) => ans !== -1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-b border-emerald-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              แบบทดสอบท้ายบทเรียน (POST-LESSON QUIZ)
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate mt-1">
              {lesson.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5">
          <div
            className="bg-emerald-600 h-full transition-all duration-200"
            style={{
              width: `${((currentIdx + 1) / questions.length) * 100}%`,
            }}
          />
        </div>

        {/* Quiz Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs sm:text-sm">
          {!isSubmitted ? (
            <div className="space-y-6">
              {/* Question count & text */}
              <div>
                <div className="text-xs font-bold text-emerald-700 mb-2">
                  คำถามข้อที่ {currentIdx + 1} จาก {questions.length} ข้อ
                </div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {currentQ.question}
                </h4>
              </div>

              {/* 4 Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, i) => {
                  const isSelected = selectedAnswers[currentIdx] === i;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectOption(i)}
                      className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-700'
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold font-mono text-xs shrink-0 ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="leading-relaxed flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={currentIdx === 0}
                  onClick={handlePrev}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold text-xs"
                >
                  ข้อย้อนหลัง
                </button>

                {currentIdx < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs"
                  >
                    <span>ข้อถัดไป</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!allAnswered}
                    onClick={handleSubmitQuiz}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white font-bold text-xs shadow-xs disabled:opacity-50"
                  >
                    ส่งคำตอบและดูผลคะแนน
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="space-y-6">
              {/* Score Header Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 text-center space-y-2">
                <Award className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-xl font-extrabold text-slate-900">
                  คุณทำได้ {score} จาก {questions.length} คะแนน
                </h4>
                <p className="text-xs text-slate-600 font-medium">
                  {score / questions.length >= 0.8
                    ? '🎉 ยอดเยี่ยมมาก! คุณมีความเข้าใจในบทเรียนและการคิดวิพากษ์ระดับดีเยี่ยม'
                    : score / questions.length >= 0.5
                    ? '👍 ทำได้ดีครับ! ลองทบทวนจุดที่ผิดและศึกษาเพิ่มเติมจากเอกสารอ้างอิง'
                    : '📖 ลองทบทวนบทเรียนอีกครั้ง แล้วสอบถาม Eco bot เพื่อทำความเข้าใจประเด็นที่สงสัยนะครับ'}
                </p>
              </div>

              {/* Review All Questions with Explanations */}
              <div className="space-y-4">
                <h5 className="font-bold text-sm text-slate-800">เฉลยและคำอธิบายโดยละเอียด:</h5>
                {questions.map((q, i) => {
                  const userAns = selectedAnswers[i];
                  const isCorrect = userAns === q.correctIndex;
                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border text-xs space-y-2 ${
                        isCorrect
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : 'bg-rose-50/40 border-rose-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-900">
                          ข้อ {i + 1}: {q.question}
                        </span>
                        {isCorrect ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" /> ถูกต้อง (+1)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full shrink-0">
                            <AlertCircle className="w-3.5 h-3.5" /> ไม่ถูกต้อง
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] space-y-1 pt-1 text-slate-600">
                        <div>
                          <strong>คำตอบของคุณ:</strong>{' '}
                          <span className={isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                            {userAns !== -1 ? q.options[userAns] : 'ไม่ได้ตอบ'}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div>
                            <strong>คำตอบที่ถูกต้อง:</strong>{' '}
                            <span className="text-emerald-800 font-bold">
                              {q.options[q.correctIndex]}
                            </span>
                          </div>
                        )}
                      </div>

                      {q.explanation && (
                        <div className="mt-2 p-2.5 rounded-xl bg-white/80 border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
                          <strong className="text-emerald-700">คำอธิบาย:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ทำแบบทดสอบใหม่อีกครั้ง</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs"
                >
                  เสร็จสิ้นและกลับสู่บทเรียน
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
