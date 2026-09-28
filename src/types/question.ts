export type QuestionCategory = 
  | 'Toán học'
  | 'Lịch sử'
  | 'Địa lý'
  | 'Tiếng Anh'
  | 'Tin học'
  | 'Khoa học'
  | 'Văn học'
  | 'Tổng hợp';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  question: string;
  options: [string, string, string, string]; // 4 choices A, B, C, D
  correctIndex: number; // 0, 1, 2, 3
  category: QuestionCategory | string;
  difficulty: QuestionDifficulty;
  explanation: string;
  source?: 'default' | 'user' | 'ai';
  timesAnswered?: number;
  timesCorrect?: number;
  createdAt?: string;
}

export interface AnswerLog {
  questionId: string;
  questionText: string;
  userChoice: number;
  correctIndex: number;
  isCorrect: boolean;
  explanation: string;
  category: string;
  timestamp: number;
}
