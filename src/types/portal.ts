/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'admin' | 'teacher' | 'student';
export type UserStatus = 'approved' | 'pending' | 'rejected';

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  email?: string;
  studentId?: string;
  gradeClass?: string;
  registeredAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface QuizResult {
  lessonId: string;
  score: number;
  total: number;
  completedAt: string;
  answers: number[];
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  coverUrl: string;
  contentMarkdown: string;
  author: string;
  updatedAt: string;
  isPublished: boolean;
  quizzes: QuizQuestion[];
}

export interface KnowledgePage {
  pageNumber: number;
  title?: string;
  content: string;
  keyTerms?: string[];
}

export type ProcessingStatus = 'completed' | 'processing' | 'failed';

export interface KnowledgeDoc {
  id: string;
  title: string;
  fileName: string;
  fileType: 'pdf' | 'image' | 'text';
  fileSize: string;
  pageCount: number;
  uploadedBy: string;
  uploadedAt: string;
  status: ProcessingStatus;
  errorMessage?: string;
  summary: string;
  pages: KnowledgePage[];
  tags: string[];
}

export interface Citation {
  id: string;
  docId: string;
  docTitle: string;
  fileName: string;
  pageNumber: number;
  quote: string;
  contextText?: string;
  relevanceExplanation?: string;
}

export interface ForumReply {
  id: string;
  topicId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  createdAt: string;
  likes: number;
}

export interface ForumTopic {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  createdAt: string;
  category: string;
  tags: string[];
  likes: number;
  replies: ForumReply[];
  isPinned?: boolean;
}

export type AiProvider = 'gemini' | 'openai';

export interface AiConfig {
  provider: AiProvider;
  geminiApiKey: string;
  openaiApiKey: string;
  geminiModel: string;
  openaiModel: string;
  temperature: number;
  systemInstruction?: string;
  lastTestedAt?: string;
  lastTestStatus?: 'idle' | 'success' | 'error' | 'testing';
  lastTestMessage?: string;
  lastLatencyMs?: number;
}

export interface WorksheetAnswerItem {
  questionId: string;
  prompt: string;
  answer: string;
}

export interface StudentWorksheetSubmission {
  id: string;
  worksheetId: string;
  worksheetNumber: number;
  worksheetTitle: string;
  studentId: string;
  studentName: string;
  gradeClass: string;
  submittedAt: string;
  answers: WorksheetAnswerItem[];
  teacherScore?: number;
  maxScore: number;
  teacherFeedback?: string;
  status: 'pending' | 'graded';
}

export interface StudentJournalSubmission {
  id: string;
  studentId: string;
  studentName: string;
  gradeClass: string;
  caseStudyTitle: string;
  entryDate: string;
  factsAndGeography: string;
  structuralCritique: string;
  policyAlternatives: string;
  personalReflection: string;
  aiFeedback?: string;
  teacherScore?: number;
  maxScore: number;
  teacherFeedback?: string;
  status: 'pending' | 'graded';
}

