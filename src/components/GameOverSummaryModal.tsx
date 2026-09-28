import React from 'react';
import { AnswerLog } from '../types/question';
import { Trophy, RefreshCw, BookOpen, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface GameOverSummaryModalProps {
  isVictory: boolean;
  score: number;
  stage: number;
  selectedTopic?: string;
  answerLogs: AnswerLog[];
  onPlayAgain: () => void;
  onOpenQuestionManager: () => void;
  onBackToMenu: () => void;
}

export const GameOverSummaryModal: React.FC<GameOverSummaryModalProps> = ({
  isVictory,
  score,
  stage,
  selectedTopic,
  answerLogs,
  onPlayAgain,
  onOpenQuestionManager,
  onBackToMenu,
}) => {
  const correctCount = answerLogs.filter(log => log.isCorrect).length;
  const totalCount = answerLogs.length;
  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[90vh]">
        
        {/* Banner */}
        <div
          className={`px-6 py-5 flex items-center justify-between text-white border-b ${
            isVictory
              ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-750 border-emerald-500/40'
              : 'bg-gradient-to-r from-rose-700 via-red-800 to-rose-900 border-rose-600/40'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-black/30 border border-white/20 flex items-center justify-center text-2xl">
              {isVictory ? '🏆' : '💀'}
            </div>
            <div>
              <h2 className="font-retro text-base sm:text-lg tracking-wider">
                {isVictory ? 'STAGE CLEAR - CHIẾN THẮNG!' : 'GAME OVER - HẾT MẠNG!'}
              </h2>
              <p className="text-xs text-white/80 font-body">
                {isVictory
                  ? 'Xuất sắc! Bạn đã tiêu diệt Red Falcon Core và ôn tập kiến thức vững chắc!'
                  : 'Đừng nản lòng! Hãy ôn lại các câu hỏi đã trả lời và tiếp tục chiến đấu.'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 divide-x divide-slate-800 bg-slate-950/70 border-b border-slate-800 py-3.5 px-3 text-center">
          <div>
            <div className="text-[10px] sm:text-[11px] text-slate-400 font-retro">CHỦ ĐỀ</div>
            <div className="text-xs sm:text-sm font-bold font-retro text-amber-300 mt-1 truncate px-1">
              {selectedTopic || 'Tất cả'}
            </div>
          </div>

          <div>
            <div className="text-[10px] sm:text-[11px] text-slate-400 font-retro">ĐIỂM SỐ</div>
            <div className="text-sm sm:text-lg font-bold font-retro text-amber-400 mt-1">
              {score.toLocaleString()}
            </div>
          </div>

          <div>
            <div className="text-[10px] sm:text-[11px] text-slate-400 font-retro">KẾT QUẢ</div>
            <div className="text-sm sm:text-lg font-bold font-retro text-emerald-400 mt-1">
              {correctCount} / {totalCount}
            </div>
          </div>

          <div>
            <div className="text-[10px] sm:text-[11px] text-slate-400 font-retro">TỈ LỆ</div>
            <div className="text-sm sm:text-lg font-bold font-retro text-cyan-400 mt-1">
              {accuracy}%
            </div>
          </div>
        </div>

        {/* Review List of Encountered Questions */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          <h3 className="text-xs font-retro text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Ôn Tập Chi Tiết Các Câu Hỏi Đã Gặp:</span>
          </h3>

          {answerLogs.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4 text-center">
              Bạn chưa va chạm khối '?' kiến thức nào trong lượt chơi này.
            </p>
          ) : (
            answerLogs.map((log, index) => (
              <div
                key={index}
                className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  log.isCorrect
                    ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-200'
                    : 'bg-rose-950/20 border-rose-800/40 text-slate-200'
                }`}
              >
                <div className="flex items-start gap-2 mb-1.5">
                  {log.isCorrect ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-semibold text-white">
                      #{index + 1}. {log.questionText}
                    </span>
                    <span className="ml-2 text-[10px] text-slate-400">
                      ({log.category})
                    </span>
                  </div>
                </div>

                <div className="pl-6 text-slate-300">
                  <p>
                    <span className="font-semibold text-amber-300">💡 Giải thích:</span>{' '}
                    {log.explanation}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Actions Bottom Bar */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenQuestionManager}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Quản Lý Câu Hỏi / Cài Đặt Đề Thi</span>
            </button>
            <button
              onClick={onBackToMenu}
              className="px-3.5 py-2 text-slate-400 hover:text-white rounded-lg text-xs transition-colors"
            >
              Về Menu Chính
            </button>
          </div>

          <button
            onClick={onPlayAgain}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 font-retro text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>CHƠI LẠI NGAY</span>
          </button>
        </div>
      </div>
    </div>
  );
};
