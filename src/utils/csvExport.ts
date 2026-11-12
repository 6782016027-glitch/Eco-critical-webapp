/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  StudentQuizSubmission,
  StudentWorksheetSubmission,
  StudentJournalSubmission,
  ForumTopic,
} from '../types/portal';

/**
 * Escapes text according to RFC 4180 CSV specifications.
 * Replaces double quotes with paired double quotes and wraps in quotes.
 * Replaces newlines with space to maintain row consistency in spreadsheet viewers.
 */
export const escapeCSV = (value: any): string => {
  if (value === null || value === undefined) return '""';
  const str = String(value)
    .replace(/\r\n/g, ' ')
    .replace(/[\r\n]/g, ' ')
    .replace(/"/g, '""');
  return `"${str}"`;
};

/**
 * Downloads a string content as a CSV file with UTF-8 BOM (\uFEFF)
 * so Thai characters display correctly in Microsoft Excel, Google Sheets, and Apple Numbers.
 */
export const downloadCSV = (filename: string, csvContent: string): void => {
  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Format timestamp to Thai readable string for filenames and rows
 */
const getTimestampSuffix = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  return `${year}${month}${day}_${hour}${minute}`;
};

/**
 * 1. Export Quiz Submissions to CSV
 */
export const exportQuizSubmissionsToCSV = (
  submissions: StudentQuizSubmission[]
): void => {
  const headers = [
    'รหัสการส่ง (Submission ID)',
    'ชื่อ-นามสกุลนักเรียน',
    'ชื่อผู้ใช้ (Username)',
    'รหัสนักเรียน',
    'ระดับชั้น',
    'วันเวลาที่ส่ง',
    'หัวข้อบทเรียน',
    'คะแนนรวม',
    'คะแนนเต็ม',
    'ข้อที่',
    'หัวข้อคำถาม (Question Prompt)',
    'คำตอบที่นักเรียนเลือก (Selected Answer)',
    'คำตอบที่ถูกต้อง (Correct Option)',
    'ผลการตอบ',
    'คำอธิบายทางภูมิศาสตร์',
    'ข้อเสนอแนะจากครู',
  ];

  const rows: string[] = [];
  rows.push(headers.map(escapeCSV).join(','));

  submissions.forEach((quiz) => {
    const formattedDate = new Date(quiz.submittedAt).toLocaleString('th-TH');

    quiz.answers.forEach((ans, idx) => {
      const row = [
        quiz.id,
        quiz.studentName,
        quiz.username || '',
        quiz.studentId,
        quiz.gradeClass,
        formattedDate,
        quiz.lessonTitle,
        String(idx + 1),
        ans.questionText,
        ans.selectedOption,
        ans.correctOption,
        ans.isCorrect ? 'ถูกต้อง' : 'ไม่ถูกต้อง',
        String(quiz.score),
        String(quiz.total),
        ans.explanation || '',
        quiz.teacherFeedback || '',
      ];
      rows.push(row.map(escapeCSV).join(','));
    });
  });

  const filename = `student_quiz_submissions_${getTimestampSuffix()}.csv`;
  downloadCSV(filename, rows.join('\r\n'));
};

/**
 * 2. Export Worksheet Submissions to CSV
 */
export const exportWorksheetSubmissionsToCSV = (
  submissions: StudentWorksheetSubmission[]
): void => {
  const headers = [
    'รหัสการส่ง (Submission ID)',
    'ชื่อ-นามสกุลนักเรียน',
    'ชื่อผู้ใช้ (Username)',
    'รหัสนักเรียน',
    'ระดับชั้น',
    'วันเวลาที่ส่ง',
    'ใบงานที่',
    'ชื่อใบงาน (Worksheet Title)',
    'ข้อที่',
    'โจทย์คำถาม (Question Prompt)',
    'คำตอบที่นักเรียนส่ง (Student Submitted Answer)',
    'คะแนนที่ได้',
    'คะแนนเต็ม',
    'สถานะการตรวจ',
    'ข้อเสนอแนะจากครู',
  ];

  const rows: string[] = [];
  rows.push(headers.map(escapeCSV).join(','));

  submissions.forEach((sub) => {
    sub.answers.forEach((ans, idx) => {
      const row = [
        sub.id,
        sub.studentName,
        sub.username || '',
        sub.studentId,
        sub.gradeClass,
        sub.submittedAt,
        String(sub.worksheetNumber),
        sub.worksheetTitle,
        String(idx + 1),
        ans.prompt,
        ans.answer || '',
        sub.teacherScore !== undefined ? String(sub.teacherScore) : '-',
        String(sub.maxScore),
        sub.status === 'graded' ? 'ตรวจแล้ว' : 'รอตรวจ',
        sub.teacherFeedback || '',
      ];
      rows.push(row.map(escapeCSV).join(','));
    });
  });

  const filename = `student_worksheet_submissions_${getTimestampSuffix()}.csv`;
  downloadCSV(filename, rows.join('\r\n'));
};

/**
 * 3. Export Journal Submissions to CSV
 */
export const exportJournalSubmissionsToCSV = (
  submissions: StudentJournalSubmission[]
): void => {
  const headers = [
    'รหัสการส่ง (Submission ID)',
    'ชื่อ-นามสกุลนักเรียน',
    'ชื่อผู้ใช้ (Username)',
    'รหัสนักเรียน',
    'ระดับชั้น',
    'วันที่บันทึก (Date)',
    'กรณีศึกษา (Case Study)',
    'มิติที่ 1 ข้อเท็จจริงและภูมิศาสตร์กายภาพ (Facts & Geography)',
    'มิติที่ 2 การวิพากษ์เชิงโครงสร้างและความเป็นธรรม (Structural Critique)',
    'มิติที่ 3 ทางเลือกเชิงนโยบายและนวัตกรรม (Policy Alternatives)',
    'มิติที่ 4 การสะท้อนคิดของตนเอง (Personal Reflection)',
    'คะแนนที่ได้',
    'คะแนนเต็ม',
    'สถานะการตรวจ',
    'ข้อเสนอแนะเบื้องต้น Eco bot',
    'ข้อเสนอแนะจากครู',
  ];

  const rows: string[] = [];
  rows.push(headers.map(escapeCSV).join(','));

  submissions.forEach((jn) => {
    const row = [
      jn.id,
      jn.studentName,
      jn.username || '',
      jn.studentId,
      jn.gradeClass,
      jn.entryDate,
      jn.caseStudyTitle,
      jn.factsAndGeography,
      jn.structuralCritique,
      jn.policyAlternatives,
      jn.personalReflection,
      jn.teacherScore !== undefined ? String(jn.teacherScore) : '-',
      String(jn.maxScore),
      jn.status === 'graded' ? 'ตรวจแล้ว' : 'รอตรวจ',
      jn.aiFeedback || '',
      jn.teacherFeedback || '',
    ];
    rows.push(row.map(escapeCSV).join(','));
  });

  const filename = `student_journal_submissions_${getTimestampSuffix()}.csv`;
  downloadCSV(filename, rows.join('\r\n'));
};

/**
 * 4. Export Webboard Posts to CSV
 */
export const exportWebboardToCSV = (topics: ForumTopic[]): void => {
  const headers = [
    'รหัสกระทู้ (Topic ID)',
    'หัวข้อกระทู้/คำถาม (Topic Title)',
    'ชื่อผู้โพสต์/นักเรียน',
    'บทบาทผู้โพสต์',
    'วันเวลาที่ส่ง/ตั้งกระทู้',
    'หมวดหมู่',
    'แท็ก (Tags)',
    'เนื้อหาคำตอบ/กระทู้ที่นักเรียนส่ง (Student Response)',
    'จำนวนความคิดเห็นตอบกลับ',
    'สรุปความคิดเห็นตอบกลับในกระทู้ (Replies)',
  ];

  const rows: string[] = [];
  rows.push(headers.map(escapeCSV).join(','));

  topics.forEach((topic) => {
    const formattedDate = new Date(topic.createdAt).toLocaleString('th-TH');
    const repliesSummary = topic.replies
      .map(
        (r, i) =>
          `[${i + 1}] ${r.authorName} (${new Date(r.createdAt).toLocaleDateString('th-TH')}): ${r.content}`
      )
      .join(' | ');

    const row = [
      topic.id,
      topic.title,
      topic.authorName,
      topic.authorRole === 'student' ? 'นักเรียน' : topic.authorRole,
      formattedDate,
      topic.category,
      (topic.tags || []).join('; '),
      topic.content,
      String(topic.replies.length),
      repliesSummary,
    ];
    rows.push(row.map(escapeCSV).join(','));
  });

  const filename = `student_webboard_posts_${getTimestampSuffix()}.csv`;
  downloadCSV(filename, rows.join('\r\n'));
};

/**
 * 5. Master Export: All Submissions Combined into one Comprehensive CSV
 */
export const exportAllSubmissionsToCSV = (
  quizzes: StudentQuizSubmission[],
  worksheets: StudentWorksheetSubmission[],
  journals: StudentJournalSubmission[],
  topics: ForumTopic[]
): void => {
  const headers = [
    'หมวดหมู่งาน',
    'รหัสการส่ง (ID)',
    'ชื่อ-นามสกุลนักเรียน',
    'ชื่อผู้ใช้ (Username)',
    'รหัสนักเรียน',
    'ระดับชั้น',
    'วันเวลาที่ส่ง',
    'หัวข้อคำถาม / กรณีศึกษา / โจทย์',
    'คำตอบที่นักเรียนส่ง (Student Response)',
    'คะแนน / ผลการตอบ',
    'สถานะการตรวจ',
    'ข้อเสนอแนะครู / ผู้ตรวจ',
  ];

  const rows: string[] = [];
  rows.push(headers.map(escapeCSV).join(','));

  // 1. Quizzes
  quizzes.forEach((q) => {
    const formattedDate = new Date(q.submittedAt).toLocaleString('th-TH');
    const answersText = q.answers
      .map(
        (a, i) =>
          `[ข้อ ${i + 1}] คำถาม: ${a.questionText} -> ตอบ: ${a.selectedOption} (${a.isCorrect ? 'ถูก' : 'ผิด'})`
      )
      .join(' || ');

    rows.push(
      [
        'ควิซ (Quiz)',
        q.id,
        q.studentName,
        q.username || '',
        q.studentId,
        q.gradeClass,
        formattedDate,
        q.lessonTitle,
        answersText,
        `${q.score} / ${q.total}`,
        q.status === 'graded' ? 'ตรวจแล้ว' : 'รอตรวจ',
        q.teacherFeedback || '',
      ]
        .map(escapeCSV)
        .join(',')
    );
  });

  // 2. Worksheets
  worksheets.forEach((w) => {
    const answersText = w.answers
      .map((a, i) => `[ข้อ ${i + 1}] โจทย์: ${a.prompt} -> ตอบ: ${a.answer}`)
      .join(' || ');

    rows.push(
      [
        'ใบงาน (Worksheet)',
        w.id,
        w.studentName,
        w.username || '',
        w.studentId,
        w.gradeClass,
        w.submittedAt,
        w.worksheetTitle,
        answersText,
        w.teacherScore !== undefined ? `${w.teacherScore} / ${w.maxScore}` : '-',
        w.status === 'graded' ? 'ตรวจแล้ว' : 'รอตรวจ',
        w.teacherFeedback || '',
      ]
        .map(escapeCSV)
        .join(',')
    );
  });

  // 3. Journals
  journals.forEach((j) => {
    const combinedReflection = `[1. ภูมิศาสตร์กายภาพ] ${j.factsAndGeography} || [2. วิพากษ์เชิงโครงสร้าง] ${j.structuralCritique} || [3. นโยบาย] ${j.policyAlternatives} || [4. สะท้อนคิดตนเอง] ${j.personalReflection}`;

    rows.push(
      [
        'สมุดอนุทิน (Journal)',
        j.id,
        j.studentName,
        j.username || '',
        j.studentId,
        j.gradeClass,
        j.entryDate,
        j.caseStudyTitle,
        combinedReflection,
        j.teacherScore !== undefined ? `${j.teacherScore} / ${j.maxScore}` : '-',
        j.status === 'graded' ? 'ตรวจแล้ว' : 'รอตรวจ',
        j.teacherFeedback || '',
      ]
        .map(escapeCSV)
        .join(',')
    );
  });

  // 4. Webboard
  topics.forEach((t) => {
    const formattedDate = new Date(t.createdAt).toLocaleString('th-TH');
    rows.push(
      [
        'เว็บบอร์ด (Webboard)',
        t.id,
        t.authorName,
        '-',
        '-',
        '-',
        formattedDate,
        t.title,
        t.content,
        `${t.replies.length} คำตอบในกระทู้`,
        'เผยแพร่แล้ว',
        '-',
      ]
        .map(escapeCSV)
        .join(',')
    );
  });

  const filename = `all_student_submissions_master_${getTimestampSuffix()}.csv`;
  downloadCSV(filename, rows.join('\r\n'));
};
