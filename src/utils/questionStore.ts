import { Question } from '../types/question';
import { PRESET_QUESTIONS } from './presetQuestions';

const STORAGE_KEY = 'contra_mario_questions_v2';
const LEGACY_STORAGE_KEY = 'contra_mario_questions_v1';

export class QuestionStore {
  private static cachedQuestions: Question[] | null = null;

  public static getQuestions(): Question[] {
    if (this.cachedQuestions) {
      return this.cachedQuestions;
    }

    try {
      // Check current v2 storage key
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.cachedQuestions = parsed;
          return parsed;
        }
      }

      // Check legacy v1 and merge any user-created questions
      const legacyStored = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyStored) {
        const legacyParsed = JSON.parse(legacyStored);
        if (Array.isArray(legacyParsed) && legacyParsed.length > 0) {
          // Identify any user questions
          const userQuestions = legacyParsed.filter(
            (q: Question) => q.source === 'user' || q.source === 'ai' || q.id.startsWith('q-')
          );
          const combined = [...userQuestions, ...PRESET_QUESTIONS];
          this.cachedQuestions = combined;
          this.saveToStorage(combined);
          return combined;
        }
      }
    } catch (e) {
      console.error('Error loading questions from localStorage:', e);
    }

    this.cachedQuestions = [...PRESET_QUESTIONS];
    this.saveToStorage(this.cachedQuestions);
    return this.cachedQuestions;
  }

  private static saveToStorage(questions: Question[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
      this.cachedQuestions = questions;
    } catch (e) {
      console.error('Error saving questions to localStorage:', e);
    }
  }

  public static addQuestion(newQ: Omit<Question, 'id'>): Question {
    const questions = this.getQuestions();
    const id = 'q-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const created: Question = {
      ...newQ,
      id,
      timesAnswered: 0,
      timesCorrect: 0,
      createdAt: new Date().toISOString()
    };
    const updated = [created, ...questions];
    this.saveToStorage(updated);
    return created;
  }

  public static updateQuestion(id: string, updates: Partial<Question>): boolean {
    const questions = this.getQuestions();
    const index = questions.findIndex(q => q.id === id);
    if (index === -1) return false;

    questions[index] = {
      ...questions[index],
      ...updates
    };
    this.saveToStorage([...questions]);
    return true;
  }

  public static deleteQuestion(id: string): boolean {
    const questions = this.getQuestions();
    const filtered = questions.filter(q => q.id !== id);
    if (filtered.length === questions.length) return false;

    // Keep at least 1 question to avoid empty quiz crashes
    if (filtered.length === 0) {
      this.saveToStorage([...PRESET_QUESTIONS]);
    } else {
      this.saveToStorage(filtered);
    }
    return true;
  }

  public static recordAnswer(id: string, isCorrect: boolean): void {
    const questions = this.getQuestions();
    const q = questions.find(item => item.id === id);
    if (q) {
      q.timesAnswered = (q.timesAnswered || 0) + 1;
      if (isCorrect) {
        q.timesCorrect = (q.timesCorrect || 0) + 1;
      }
      this.saveToStorage([...questions]);
    }
  }

  public static resetToDefaults(): Question[] {
    this.cachedQuestions = [...PRESET_QUESTIONS];
    this.saveToStorage(this.cachedQuestions);
    return this.cachedQuestions;
  }

  public static exportJSON(): string {
    const questions = this.getQuestions();
    return JSON.stringify(questions, null, 2);
  }

  public static importJSON(jsonString: string): { success: boolean; count: number; error?: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) {
        return { success: false, count: 0, error: 'Dữ liệu không phải là danh sách câu hỏi hợp lệ.' };
      }

      const validList: Question[] = [];
      for (const item of parsed) {
        if (
          typeof item.question === 'string' &&
          Array.isArray(item.options) &&
          item.options.length === 4 &&
          typeof item.correctIndex === 'number' &&
          item.correctIndex >= 0 &&
          item.correctIndex <= 3
        ) {
          validList.push({
            id: item.id || ('q-import-' + Math.random().toString(36).substring(2, 8)),
            question: item.question.trim(),
            options: item.options.map((o: unknown) => String(o).trim()) as [string, string, string, string],
            correctIndex: item.correctIndex,
            category: item.category || 'Tổng hợp',
            difficulty: item.difficulty || 'medium',
            explanation: item.explanation || 'Không có giải thích chi tiết.',
            source: 'user',
            timesAnswered: item.timesAnswered || 0,
            timesCorrect: item.timesCorrect || 0
          });
        }
      }

      if (validList.length === 0) {
        return { success: false, count: 0, error: 'Không tìm thấy câu hỏi hợp lệ nào trong tệp.' };
      }

      this.saveToStorage(validList);
      return { success: true, count: validList.length };
    } catch {
      return { success: false, count: 0, error: 'Tệp JSON không hợp lệ hoặc bị lỗi định dạng.' };
    }
  }

  public static getRandomQuestion(excludeIds: string[] = [], category?: string): Question {
    const all = this.getQuestions();
    
    // If a specific category is requested, filter exclusively to questions in that category
    let pool = all;
    if (category && category !== 'all') {
      const catQuestions = all.filter(q => q.category === category);
      if (catQuestions.length > 0) {
        pool = catQuestions;
      }
    }

    // Exclude already answered questions in current session
    let candidates = pool.filter(q => !excludeIds.includes(q.id));

    // If all questions in this category have been encountered, recycle within the same category
    if (candidates.length === 0) {
      candidates = pool;
    }

    if (candidates.length === 0) {
      return all[0] || PRESET_QUESTIONS[0];
    }

    const randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex];
  }
}
