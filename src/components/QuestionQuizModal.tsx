import React, { useState, useEffect } from 'react';
import { Question } from '../types/question';
import { GameBlock } from '../types/game';
import { audio } from '../utils/audio';
import { CheckCircle2, XCircle, Clock, Zap, ArrowRight, ShieldAlert, Sparkles, HelpCircle, AlertTriangle } from 'lucide-react';

interface QuestionQuizModalProps {
  question: Question;
  block: GameBlock;
  onAnswer: (isCorrect: boolean) => void;
}

export const QuestionQuizModal: React.FC<QuestionQuizModalProps> = ({
  question,
  block,
  onAnswer,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [wrongIndices, setWrongIndices] = useState<number[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [shakeKey, setShakeKey] = useState<number>(0);

  const isGate = block.type === 'SEALED_GATE';

  // Countdown timer: provides urgency, but when expired, unlocks hint without kicking player out
  useEffect(() => {
    if (isCorrect) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setShowHint(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCorrect]);

  const handleSelect = (idx: number) => {
    // Cannot pick if already answered correctly or if this option was already tried and failed
    if (isCorrect || wrongIndices.includes(idx)) return;

    setSelectedIdx(idx);

    if (idx === question.correctIndex) {
      // Correct answer!
      setIsCorrect(true);
      setShowHint(true);
      audio.playCorrect();
    } else {
      // Wrong answer!
      audio.playWrong();
      setWrongIndices(prev => (prev.includes(idx) ? prev : [...prev, idx]));
      setShowHint(true);
      setAttempts(prev => prev + 1);
      setShakeKey(prev => prev + 1);
    }
  };

  // Keyboard shortcut support (keys 1, 2, 3, 4 or A, B, C, D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCorrect) {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          onAnswer(true);
        }
        return;
      }

      if (['Digit1', 'Numpad1', 'KeyA'].includes(e.code)) handleSelect(0);
      else if (['Digit2', 'Numpad2', 'KeyB'].includes(e.code)) handleSelect(1);
      else if (['Digit3', 'Numpad3', 'KeyC'].includes(e.code)) handleSelect(2);
      else if (['Digit4', 'Numpad4', 'KeyD'].includes(e.code)) handleSelect(3);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCorrect, wrongIndices, question.correctIndex]);

  const handleResumeGame = () => {
    if (!isCorrect) return;
    onAnswer(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div 
        key={shakeKey}
        className={`w-full max-w-xl bg-slate-900 border-2 ${
          isCorrect
            ? 'border-emerald-500 shadow-emerald-500/20'
            : isGate
            ? 'border-cyan-500/90 shadow-cyan-500/20'
            : 'border-amber-500/90 shadow-amber-500/20'
        } rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 transition-all ${
          wrongIndices.length > 0 && !isCorrect ? 'animate-shake' : ''
        }`}
      >
        
        {/* Header bar: Arcade Status */}
        <div className={`px-5 py-3.5 flex items-center justify-between text-white border-b ${
          isGate
            ? 'bg-gradient-to-r from-cyan-700 via-blue-800 to-indigo-900 border-cyan-400/40'
            : 'bg-gradient-to-r from-amber-600 via-red-600 to-amber-700 border-amber-400/40'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className="text-xl animate-pulse">
              {isGate ? '⚡' : '⭐'}
            </span>
            <div>
              <span className="font-retro text-xs sm:text-sm tracking-wider uppercase block text-white drop-shadow">
                {isGate ? (block.gateLabel || 'CỔNG PHONG ẤN NĂNG LƯỢNG') : "THỬ THÁCH KHỐI '?' KIẾN THỨC"}
              </span>
              <span className="text-[10px] text-cyan-200/90 font-mono block">
                ⏸ GAME TẠM DỪNG: Quái vật & đạn đã đóng băng hoàn toàn
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 font-retro text-xs bg-black/50 px-2.5 py-1 rounded-full border border-white/20 shrink-0">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span className={`${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-amber-200'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>

        {/* Category & Topic banner */}
        <div className="px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs bg-slate-950/60 border-b border-slate-800 text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Chủ đề:</span>
            <span className="font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              {question.category}
            </span>
            <span className="text-slate-600">·</span>
            <span className="capitalize text-slate-400">
              {question.difficulty === 'easy' ? 'Độ khó: Dễ' : question.difficulty === 'hard' ? 'Độ khó: Khó' : 'Độ khó: Trung bình'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Phím tắt: [1], [2], [3], [4]
          </span>
        </div>

        {/* Question prompt */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-retro text-slate-400 uppercase tracking-wider block mb-1">
              CÂU HỎI THỬ THÁCH:
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed font-body">
              {question.question}
            </h3>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-2.5">
            {question.options.map((option, idx) => {
              const letter = ['A', 'B', 'C', 'D'][idx];
              const isOptionWrong = wrongIndices.includes(idx);
              const isOptionCorrect = isCorrect && idx === question.correctIndex;

              let btnStyle = 'bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border-slate-700';

              if (isOptionCorrect) {
                btnStyle = 'bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-400/80 shadow-lg shadow-emerald-500/20';
              } else if (isOptionWrong) {
                btnStyle = 'bg-rose-950/60 text-rose-300 border-rose-800/80 line-through opacity-70 cursor-not-allowed';
              } else if (isCorrect) {
                btnStyle = 'bg-slate-800/30 text-slate-500 border-slate-800/50 cursor-default';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isCorrect || isOptionWrong}
                  className={`w-full text-left p-3.5 rounded-xl border flex items-center gap-3 transition-all duration-150 ${btnStyle} ${
                    !isCorrect && !isOptionWrong ? 'hover:scale-[1.01] active:scale-[0.99] cursor-pointer' : ''
                  }`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-retro text-xs font-bold shrink-0 border ${
                    isOptionCorrect
                      ? 'bg-emerald-700 text-white border-emerald-300'
                      : isOptionWrong
                      ? 'bg-rose-900 text-rose-300 border-rose-600'
                      : 'bg-black/50 text-amber-300 border-white/10'
                  }`}>
                    {letter}
                  </span>
                  <span className="font-body text-sm sm:text-base font-medium flex-1">
                    {option}
                  </span>
                  {isOptionCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-white shrink-0 animate-bounce" />
                  )}
                  {isOptionWrong && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Error Notice & Hint Section when answer is wrong */}
          {!isCorrect && wrongIndices.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-700/60 animate-in fade-in slide-in-from-top-2 text-rose-200">
              <div className="flex items-center gap-2 mb-2 font-retro text-xs text-rose-400 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>BÁO LỖI: TRẢ LỜI SAI! CỔNG PHONG ẤN VẪN BỊ KHÓA!</span>
              </div>
              <p className="text-xs text-rose-300 font-body mb-2 leading-relaxed">
                ⛔ Bạn chưa thể đi tiếp. Vui lòng đọc kỹ <strong>Gợi ý bên dưới</strong> và <strong>chọn lại đáp án đúng</strong> để giải mã phong ấn!
              </p>
              
              {showHint && (
                <div className="mt-2.5 p-3 rounded-lg bg-slate-950/80 border border-amber-500/40 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>GỢI Ý ÔN TẬP:</span>
                  </div>
                  <p className="text-slate-200 font-body leading-relaxed">
                    {question.explanation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Success Banner when answered correctly */}
          {isCorrect && (
            <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/80 animate-in fade-in slide-in-from-top-2 text-emerald-200">
              <div className="flex items-center gap-2 mb-2 font-bold font-retro text-xs text-emerald-300">
                <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {isGate ? 'CHÍNH XÁC! CỔNG PHONG ẤN ĐÃ BỊ PHÁ HỦY HOÀN TOÀN!' : 'CHÍNH XÁC! GIẢI MÃ THÀNH CÔNG!'}
                </span>
              </div>
              <p className="text-xs text-emerald-300 font-body mb-2">
                ✨ <strong>Phần thưởng:</strong> +1000 Điểm • Hồi phục +30 HP & +50 Mana • Tiếp tế Vũ khí Contra!
              </p>
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-emerald-500/30 text-xs text-slate-300 font-body">
                <strong className="text-amber-300">Kiến thức ghi nhớ:</strong> {question.explanation}
              </div>

              <button
                type="button"
                onClick={handleResumeGame}
                className="mt-3.5 w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-retro text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 font-bold cursor-pointer shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
              >
                <span>💥 {isGate ? 'PHÁ CỔNG & TIẾP TỤC CHIẾN ĐẤU' : 'TIẾP TỤC CHIẾN ĐẤU'} (Enter / Space)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
