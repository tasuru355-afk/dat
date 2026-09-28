import { GoogleGenAI, Type } from '@google/genai';
import { Question } from '../types/question';

export async function generateAIQuestions(
  topic: string,
  count: number = 3,
  category: string = 'Tổng hợp'
): Promise<Question[]> {
  const apiKey = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GEMINI_API_KEY || 
                 (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('Chưa cấu hình API Key của Google Gemini. Bạn vẫn có thể thêm, sửa, xóa câu hỏi thủ công hoặc nhập tệp JSON!');
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Bạn là một chuyên gia giáo dục và biên soạn đề thi trắc nghiệm.
Hãy tạo ${count} câu hỏi trắc nghiệm tiếng Việt chất lượng cao cho học sinh/người học về chủ đề: "${topic}".
Phân loại chủ đề tương ứng: "${category}".

Yêu cầu định dạng:
- Mỗi câu hỏi phải có nội dung rõ ràng, hấp dẫn
- 4 đáp án lựa chọn (A, B, C, D)
- Chỉ số đáp án đúng (correctIndex từ 0 đến 3)
- Lời giải thích ngắn gọn, súc tích, cung cấp kiến thức bổ ích.
- Độ khó: "easy", "medium", hoặc "hard"`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            correctIndex: { type: Type.INTEGER },
            difficulty: { 
              type: Type.STRING,
              enum: ['easy', 'medium', 'hard']
            },
            explanation: { type: Type.STRING },
          },
          required: ['question', 'options', 'correctIndex', 'difficulty', 'explanation'],
        },
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('Không nhận được phản hồi từ AI.');
  }

  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed)) {
    throw new Error('Dữ liệu AI trả về không đúng cấu trúc.');
  }

  const questions: Question[] = parsed.map((item, index) => {
    const opts = Array.isArray(item.options) && item.options.length >= 4 
      ? [String(item.options[0]), String(item.options[1]), String(item.options[2]), String(item.options[3])] as [string, string, string, string]
      : ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'] as [string, string, string, string];

    return {
      id: `ai-${Date.now()}-${index}`,
      question: String(item.question),
      options: opts,
      correctIndex: Math.min(Math.max(Number(item.correctIndex) || 0, 0), 3),
      category: category || 'Tổng hợp',
      difficulty: item.difficulty || 'medium',
      explanation: String(item.explanation || 'Không có giải thích.'),
      source: 'ai',
      timesAnswered: 0,
      timesCorrect: 0,
      createdAt: new Date().toISOString(),
    };
  });

  return questions;
}
