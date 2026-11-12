/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserRole, UserStatus } from '../types/portal';
import { downloadCSV } from './csvExport';

export interface ParsedStudentRow {
  rowIndex: number;
  name: string;
  username: string;
  password?: string;
  studentId?: string;
  gradeClass?: string;
  seatNumber?: string;
  role: UserRole;
  status: UserStatus;
  isValid: boolean;
  errors: string[];
  isDuplicateInFile?: boolean;
  isDuplicateInDB?: boolean;
}

/**
 * Splits a CSV line into columns respecting double-quoted values.
 */
export const parseCSVLine = (line: string, delimiter: string = ','): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
};

/**
 * Downloads a sample CSV import template for students with UTF-8 BOM
 */
export const downloadStudentImportTemplate = (): void => {
  const headers = ['ชื่อ-นามสกุล', 'ชื่อผู้ใช้ (Username)', 'รหัสผ่าน', 'รหัสนักเรียน', 'ระดับชั้น', 'เลขที่'];
  const sampleData = [
    ['นายชานนท์ วงศ์สว่าง', 'std_chanon', 'Student1234', 'STD-6704', 'ม.4/1', '1'],
    ['น.ส.กานต์พิชชา รัตนเรือง', 'std_kanpitcha', 'Student1234', 'STD-6705', 'ม.4/1', '2'],
    ['นายธนดล ประเสริฐวิทย์', 'std_thanadol', 'Student1234', 'STD-6706', 'ม.5/2', '15'],
    ['น.ส.วรัญญา บุญยรัตน์', 'std_waranya', 'Student1234', 'STD-6707', 'ม.6/3', '8'],
  ];

  const rows = [
    headers.map((h) => `"${h}"`).join(','),
    ...sampleData.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ];

  downloadCSV('student_import_template.csv', rows.join('\r\n'));
};

/**
 * Parses raw CSV text into validated student objects
 */
export const parseStudentCSV = (
  rawText: string,
  existingUsernames: Set<string>,
  defaultStatus: UserStatus = 'approved'
): {
  students: ParsedStudentRow[];
  totalRows: number;
  validCount: number;
  invalidCount: number;
  duplicateCount: number;
} => {
  // Strip UTF-8 BOM if present
  let cleanText = rawText;
  if (cleanText.charCodeAt(0) === 0xfeff) {
    cleanText = cleanText.slice(1);
  }

  // Split lines
  const rawLines = cleanText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (rawLines.length === 0) {
    return { students: [], totalRows: 0, validCount: 0, invalidCount: 0, duplicateCount: 0 };
  }

  // Detect delimiter (, or ;)
  const headerLine = rawLines[0];
  const commaCount = (headerLine.match(/,/g) || []).length;
  const semicolonCount = (headerLine.match(/;/g) || []).length;
  const delimiter = semicolonCount > commaCount ? ';' : ',';

  // Parse header and map column indices
  const headers = parseCSVLine(headerLine, delimiter).map((h) => h.toLowerCase().replace(/[\s\-_()]/g, ''));

  let nameCol = -1;
  let usernameCol = -1;
  let passwordCol = -1;
  let studentIdCol = -1;
  let gradeClassCol = -1;
  let seatNumberCol = -1;

  headers.forEach((h, idx) => {
    if (h.includes('ชื่อนามสกุล') || h.includes('ชื่อนักเรียน') || h === 'name' || h === 'fullname' || h.includes('ชื่อ')) {
      if (nameCol === -1) nameCol = idx;
    }
    if (h.includes('ชื่อผู้ใช้') || h.includes('username') || h === 'user') {
      usernameCol = idx;
    }
    if (h.includes('รหัสผ่าน') || h.includes('password') || h === 'pass') {
      passwordCol = idx;
    }
    if (h.includes('รหัสนักเรียน') || h.includes('studentid') || h === 'stdid' || h === 'id') {
      studentIdCol = idx;
    }
    if (h.includes('ระดับชั้น') || h.includes('ชั้น') || h.includes('ห้อง') || h === 'gradeclass' || h === 'class' || h === 'grade') {
      gradeClassCol = idx;
    }
    if (h.includes('เลขที่') || h.includes('seatnumber') || h === 'seat' || h === 'no') {
      seatNumberCol = idx;
    }
  });

  // Fallbacks if headers didn't match standard names
  if (nameCol === -1 && headers.length > 0) nameCol = 0;
  if (usernameCol === -1 && headers.length > 1) usernameCol = 1;
  if (passwordCol === -1 && headers.length > 2) passwordCol = 2;
  if (studentIdCol === -1 && headers.length > 3) studentIdCol = 3;
  if (gradeClassCol === -1 && headers.length > 4) gradeClassCol = 4;
  if (seatNumberCol === -1 && headers.length > 5) seatNumberCol = 5;

  const seenInFile = new Set<string>();
  const parsedRows: ParsedStudentRow[] = [];

  for (let i = 1; i < rawLines.length; i++) {
    const line = rawLines[i];
    const cols = parseCSVLine(line, delimiter);
    if (cols.every((c) => !c || c.trim() === '')) continue; // Skip completely empty line

    const name = nameCol >= 0 && cols[nameCol] ? cols[nameCol].trim() : '';
    let username = usernameCol >= 0 && cols[usernameCol] ? cols[usernameCol].trim() : '';
    const password = passwordCol >= 0 && cols[passwordCol] ? cols[passwordCol].trim() : 'Student1234';
    const studentId = studentIdCol >= 0 && cols[studentIdCol] ? cols[studentIdCol].trim() : '';
    const gradeClass = gradeClassCol >= 0 && cols[gradeClassCol] ? cols[gradeClassCol].trim() : 'ม.4/1';
    const seatNumber = seatNumberCol >= 0 && cols[seatNumberCol] ? cols[seatNumberCol].trim() : undefined;

    // Auto-generate username from studentId or name if blank
    if (!username && studentId) {
      username = `std_${studentId.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    }

    const errors: string[] = [];
    if (!name) {
      errors.push('ไม่ระบุชื่อ-นามสกุล');
    }
    if (!username) {
      errors.push('ไม่ระบุชื่อผู้ใช้ (Username)');
    }

    const lowerUser = username.toLowerCase();
    const isDuplicateInFile = seenInFile.has(lowerUser);
    const isDuplicateInDB = existingUsernames.has(lowerUser);

    if (isDuplicateInFile) {
      errors.push('Username ซ้ำกับแถวอื่นในไฟล์');
    }
    if (isDuplicateInDB) {
      errors.push('Username ซ้ำกับผู้ใช้ที่มีอยู่แล้วในระบบ');
    }

    if (username) {
      seenInFile.add(lowerUser);
    }

    const isValid = errors.length === 0;

    parsedRows.push({
      rowIndex: i + 1,
      name,
      username,
      password: password || 'Student1234',
      studentId: studentId || `STD-${Math.floor(1000 + Math.random() * 9000)}`,
      gradeClass: gradeClass || 'ม.4/1',
      seatNumber: seatNumber || undefined,
      role: 'student',
      status: defaultStatus,
      isValid,
      errors,
      isDuplicateInFile,
      isDuplicateInDB,
    });
  }

  const validCount = parsedRows.filter((r) => r.isValid).length;
  const invalidCount = parsedRows.filter((r) => !r.isValid && !r.isDuplicateInDB && !r.isDuplicateInFile).length;
  const duplicateCount = parsedRows.filter((r) => r.isDuplicateInDB || r.isDuplicateInFile).length;

  return {
    students: parsedRows,
    totalRows: parsedRows.length,
    validCount,
    invalidCount,
    duplicateCount,
  };
};
