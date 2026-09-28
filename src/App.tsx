import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { GameEngine } from './game/GameEngine';
import { GameCanvas } from './game/GameCanvas';
import { TopNav } from './components/TopNav';
import { QuestionQuizModal } from './components/QuestionQuizModal';
import { QuestionManagerModal } from './components/QuestionManagerModal';
import { GameOverSummaryModal } from './components/GameOverSummaryModal';
import { InstructionsModal } from './components/InstructionsModal';
import { GameBlock, WeaponType, ManaSkillType } from './types/game';
import { Question, AnswerLog } from './types/question';
import { QuestionStore } from './utils/questionStore';
import { audio } from './utils/audio';
import { Play, BookOpen, HelpCircle, Trophy, Volume2, VolumeX, Shield, Zap, Sparkles, Heart } from 'lucide-react';

// Retro Title Banner generated
import titleBannerImg from './assets/images/contra_mario_banner_1790562714261.jpg';

export default function App() {
  const [gameState, setGameState] = useState<'TITLE' | 'PLAYING' | 'STAGE_CLEAR' | 'GAME_OVER'>('TITLE');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return Number(localStorage.getItem('contra_mario_highscore') || '5000');
  });
  const [lives, setLives] = useState<number>(3);
  const [hp, setHp] = useState<number>(100);
  const [mana, setMana] = useState<number>(100);
  const [activeSkill, setActiveSkill] = useState<ManaSkillType>('SHIELD');
  const [weapon, setWeapon] = useState<WeaponType>('NORMAL');
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [questionsList, setQuestionsList] = useState<Question[]>(() => QuestionStore.getQuestions());

  // Dynamic categories with live question counts
  const categoriesData = useMemo(() => {
    const defaultCats = ['all', 'Tin học', 'Toán học', 'Tiếng Anh', 'Lịch sử', 'Địa lý', 'Khoa học', 'Tổng hợp'];
    const catsSet = new Set<string>(defaultCats);
    questionsList.forEach(q => {
      if (q.category) catsSet.add(q.category);
    });
    const cats = Array.from(catsSet);
    const counts: Record<string, number> = { all: questionsList.length };
    cats.forEach(c => {
      if (c !== 'all') {
        counts[c] = questionsList.filter(q => q.category === c).length;
      }
    });
    return { cats, counts };
  }, [questionsList]);

  // Modals
  const [activeQuizQuestion, setActiveQuizQuestion] = useState<Question | null>(null);
  const [activeQuizBlock, setActiveQuizBlock] = useState<GameBlock | null>(null);
  const [isQuestionManagerOpen, setIsQuestionManagerOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Filter category for the run - default to specific topic
  const [focusCategory, setFocusCategory] = useState<string>('Tin học');

  // Logs for review at end of game
  const [answerLogs, setAnswerLogs] = useState<AnswerLog[]>([]);

  // Engine ref
  const engineRef = useRef<GameEngine | null>(null);

  const handleScoreChange = useCallback((newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('contra_mario_highscore', String(newScore));
    }
  }, [highScore]);

  const handleLivesChange = useCallback((newLives: number) => {
    setLives(newLives);
  }, []);

  const handleHpChange = useCallback((newHp: number) => {
    setHp(newHp);
  }, []);

  const handleManaChange = useCallback((newMana: number) => {
    setMana(newMana);
  }, []);

  const handleSkillChange = useCallback((newSkill: ManaSkillType) => {
    setActiveSkill(newSkill);
  }, []);

  const handleWeaponChange = useCallback((newWeapon: WeaponType) => {
    setWeapon(newWeapon);
  }, []);

  const handleTriggerQuiz = useCallback((block: GameBlock) => {
    if (!engineRef.current) return;
    engineRef.current.isPaused = true;

    // Pick a question strictly from the chosen category
    const seenIds = answerLogs.map(l => l.questionId);
    const question = QuestionStore.getRandomQuestion(seenIds, focusCategory);
    setActiveQuizQuestion(question);
    setActiveQuizBlock(block);
  }, [answerLogs, focusCategory]);

  const handleStageClear = useCallback((stageNum: number) => {
    if (engineRef.current) engineRef.current.isPaused = true;
    setGameState('STAGE_CLEAR');
  }, []);

  const handleGameOver = useCallback((finalScore: number) => {
    if (engineRef.current) engineRef.current.isPaused = true;
    setGameState('GAME_OVER');
  }, []);

  // Keep engine callbacks in sync
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.updateCallbacks({
        onTriggerQuiz: handleTriggerQuiz,
        onScoreChange: handleScoreChange,
        onLivesChange: handleLivesChange,
        onHpChange: handleHpChange,
        onManaChange: handleManaChange,
        onSkillChange: handleSkillChange,
        onWeaponChange: handleWeaponChange,
        onStageClear: handleStageClear,
        onGameOver: handleGameOver,
      });
    } else {
      const engine = new GameEngine({
        onTriggerQuiz: handleTriggerQuiz,
        onScoreChange: handleScoreChange,
        onLivesChange: handleLivesChange,
        onHpChange: handleHpChange,
        onManaChange: handleManaChange,
        onSkillChange: handleSkillChange,
        onWeaponChange: handleWeaponChange,
        onStageClear: handleStageClear,
        onGameOver: handleGameOver,
      });
      engineRef.current = engine;
    }
  }, [handleTriggerQuiz, handleScoreChange, handleLivesChange, handleHpChange, handleManaChange, handleSkillChange, handleWeaponChange, handleStageClear, handleGameOver]);

  const startGame = () => {
    if (!engineRef.current) return;
    setScore(0);
    setLives(3);
    setHp(100);
    setMana(100);
    setActiveSkill('SHIELD');
    setWeapon('NORMAL');
    setAnswerLogs([]);
    setCurrentStage(1);
    engineRef.current.initStage(1);
    engineRef.current.isPaused = false;
    setGameState('PLAYING');
    audio.playPowerUp();
  };

  const handleQuizAnswer = (isCorrect: boolean) => {
    if (!activeQuizQuestion || !activeQuizBlock || !engineRef.current) return;

    // Record question stats
    QuestionStore.recordAnswer(activeQuizQuestion.id, isCorrect);

    // Record log
    setAnswerLogs(prev => [
      ...prev,
      {
        questionId: activeQuizQuestion.id,
        questionText: activeQuizQuestion.question,
        userChoice: isCorrect ? activeQuizQuestion.correctIndex : -1,
        correctIndex: activeQuizQuestion.correctIndex,
        isCorrect,
        explanation: activeQuizQuestion.explanation,
        category: activeQuizQuestion.category,
        timestamp: Date.now(),
      },
    ]);

    // Handle game resolution
    engineRef.current.handleQuizResolved(activeQuizBlock, isCorrect, activeQuizQuestion);

    // Unpause game
    setActiveQuizQuestion(null);
    setActiveQuizBlock(null);
    engineRef.current.isPaused = false;
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audio.setMuted(nextMuted);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* Top Bar following Top Bar Contract */}
      <TopNav
        onOpenQuestionManager={() => setIsQuestionManagerOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onStartGame={startGame}
        isPlaying={gameState === 'PLAYING'}
      />

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 w-full max-w-6xl mx-auto">
        {gameState === 'TITLE' ? (
          /* TITLE / MENU SCREEN */
          <div className="w-full max-w-3xl flex flex-col items-center text-center space-y-6 animate-in fade-in duration-200">
            {/* Retro Artwork Banner */}
            <div className="relative w-full aspect-[16/9] max-h-[360px] rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-slate-900 group">
              <img
                src={titleBannerImg}
                alt="Contra Mario: Ôn Tập Kiến Thức"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <div className="absolute bottom-4 left-6 right-6 text-left">
                <div className="flex items-center gap-2 text-xs text-amber-400 font-retro mb-1">
                  <span>NES EDITION</span>
                  <span aria-hidden="true">·</span>
                  <span>MARIO BROS X CONTRA</span>
                </div>
                <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight font-retro drop-shadow-md">
                  CONTRA: ÔN TẬP KIẾN THỨC
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 font-body mt-1">
                  Bắn súng diệt quái, nhảy khối hỏi chấm '?' để ôn tập kiến thức và thu thập vũ khí tối thượng!
                </p>
              </div>
            </div>

            {/* Subject / Category Filter selector */}
            <div className="w-full max-w-2xl bg-slate-900/90 border-2 border-amber-500/40 rounded-2xl p-4 flex flex-col items-center shadow-xl">
              <div className="flex flex-col sm:flex-row items-center justify-between w-full mb-3 px-1 gap-1">
                <span className="text-xs sm:text-sm text-amber-300 font-bold flex items-center gap-1.5">
                  <span className="text-base">🎯</span> BƯỚC 1: CHỌN 1 CHỦ ĐỀ ĐỂ ÔN TẬP
                </span>
                <span className="text-xs text-slate-400">
                  Đang chọn: <strong className="text-amber-400 font-retro text-xs">{focusCategory === 'all' ? 'TẤT CẢ CÁC MÔN' : focusCategory.toUpperCase()}</strong>
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mb-3 self-start font-body">
                💡 Trò chơi sẽ <strong>chỉ lấy các câu hỏi thuộc chủ đề bạn chọn</strong> dưới đây để tạo thành thử thách trong khối vàng '?' suốt màn chơi!
              </p>
              <div className="flex flex-wrap justify-center gap-2 w-full">
                {categoriesData.cats.map(cat => {
                  const count = categoriesData.counts[cat] || 0;
                  const isSelected = focusCategory === cat;
                  const label = cat === 'all' ? 'Tất cả các môn' : cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setFocusCategory(cat)}
                      className={`px-3.5 py-2 text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-lg scale-105 ring-2 ring-amber-300'
                          : 'bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/60'
                      }`}
                    >
                      <span>{label}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                        isSelected ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'
                      }`}>
                        {count} câu
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-2xl">
              <button
                onClick={startGame}
                className="flex-1 min-w-[200px] py-4 px-6 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 hover:from-red-500 hover:to-amber-400 text-slate-950 font-retro text-xs sm:text-sm font-bold rounded-2xl shadow-xl hover:shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-slate-950 shrink-0" />
                <span>BẮT ĐẦU CHIẾN ĐẤU</span>
              </button>

              <button
                onClick={() => setIsQuestionManagerOpen(true)}
                className="flex-1 min-w-[240px] py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-amber-300 border-2 border-amber-500/50 hover:border-amber-400 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-lg hover:shadow-amber-500/10 active:scale-95 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="font-retro text-xs font-bold text-amber-300">
                    QUẢN LÝ CÂU HỎI / CÀI ĐẶT ĐỀ THI
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-body">
                  Thêm, Sửa, Xóa • Lọc chủ đề • Tự lưu F5 ({questionsList.length} câu)
                </span>
              </button>
            </div>

            <div className="flex items-center justify-center">
              <button
                onClick={() => setIsHelpOpen(true)}
                className="px-4 py-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 font-retro text-[11px] rounded-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-sky-400" />
                <span>HƯỚNG DẪN CÁCH CHƠI & ÔN TẬP</span>
              </button>
            </div>

            {/* Highscore & Game Info */}
            <div className="flex items-center gap-4 text-xs font-retro text-slate-400">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Trophy className="w-3.5 h-3.5" />
                <span>KỶ LỤC: {highScore.toLocaleString()}</span>
              </div>
              <span aria-hidden="true">·</span>
              <span>STAGE: 1-1 JUNGLE BASE</span>
            </div>
          </div>
        ) : (
          /* ACTIVE PLAYING SCREEN WITH RETRO HUD */
          <div className="w-full flex flex-col items-center">
            {/* Retro 8-bit NES Arcade HUD Bar */}
            <div className="w-full max-w-[880px] bg-slate-950 border-t-2 border-x-2 border-slate-800 rounded-t-lg px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-y-2 text-xs font-retro tracking-wider text-slate-200 shadow-xl">
              {/* Score & Rest (Lives) */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col text-left">
                  <div className="text-[9px] text-slate-400">SCORE</div>
                  <div className="text-amber-400 font-bold text-xs">{String(score).padStart(6, '0')}</div>
                </div>

                <div className="flex flex-col text-center">
                  <div className="text-[9px] text-slate-400">REST</div>
                  <div className="flex items-center gap-1 text-red-400 font-bold text-xs">
                    <span>❤️</span>
                    <span>x{lives}</span>
                  </div>
                </div>
              </div>

              {/* Health (HP) Gauge */}
              <div className="flex flex-col min-w-[120px] sm:min-w-[140px]">
                <div className="flex items-center justify-between text-[9px] text-slate-300 mb-0.5">
                  <span className="flex items-center gap-1 text-rose-400 font-bold">
                    <Heart className="w-3 h-3 fill-rose-500 text-rose-500 inline" /> HP
                  </span>
                  <span className="font-mono font-bold text-[10px] text-rose-300">{hp}/100</span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded border border-rose-900/60 overflow-hidden relative">
                  <div
                    className={`h-full transition-all duration-200 ${
                      hp > 50
                        ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                        : hp > 25
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                        : 'bg-gradient-to-r from-red-600 to-rose-500 animate-pulse'
                    }`}
                    style={{ width: `${Math.max(0, Math.min(100, hp))}%` }}
                  />
                </div>
              </div>

              {/* Mana Gauge */}
              <div className="flex flex-col min-w-[120px] sm:min-w-[140px]">
                <div className="flex items-center justify-between text-[9px] text-slate-300 mb-0.5">
                  <span className="flex items-center gap-1 text-sky-400 font-bold">
                    <Zap className="w-3 h-3 fill-sky-400 text-sky-400 inline" /> MANA
                  </span>
                  <span className="font-mono font-bold text-[10px] text-sky-300">{Math.round(mana)}/100</span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded border border-sky-900/60 overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 transition-all duration-200"
                    style={{ width: `${Math.max(0, Math.min(100, mana))}%` }}
                  />
                </div>
              </div>

              {/* Mana Skill Button / Badge */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => engineRef.current?.triggerManaSkill()}
                  className={`px-2 py-1 rounded text-[10px] font-bold border transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
                    mana >= 35
                      ? activeSkill === 'SHIELD'
                        ? 'bg-sky-950 border-sky-400 text-sky-300 shadow-sm shadow-sky-500/30'
                        : 'bg-amber-950 border-amber-400 text-amber-300 shadow-sm shadow-amber-500/30'
                      : 'bg-slate-900 border-slate-700 text-slate-500 opacity-60'
                  }`}
                  title="Bấm hoặc nhấn phím K để dùng kỹ năng (Tốn 35 Mana)"
                >
                  <span>{activeSkill === 'SHIELD' ? '🛡️' : '💥'}</span>
                  <span className="hidden sm:inline">{activeSkill === 'SHIELD' ? 'KHIÊN' : 'BOM NỔ'}</span>
                  <span className="text-[9px] text-slate-400">[K]</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    engineRef.current?.toggleManaSkill();
                    if (engineRef.current) setActiveSkill(engineRef.current.player.activeManaSkill);
                  }}
                  className="px-1.5 py-1 rounded bg-slate-900 border border-slate-700 hover:border-slate-500 text-[9px] text-slate-300 hover:text-white cursor-pointer"
                  title="Đổi loại kỹ năng (Phím L)"
                >
                  ĐỔI (L)
                </button>
              </div>

              {/* Weapon & Topic & Stage */}
              <div className="flex items-center gap-2">
                {/* Weapon Badge */}
                <div className="flex flex-col text-center">
                  <div className="text-[8px] text-slate-400">WEAPON</div>
                  <div className="px-1.5 py-0.5 rounded bg-red-950 border border-red-500/50 text-red-300 font-bold text-[9px]">
                    {weapon === 'NORMAL' ? 'NORMAL' : `${weapon[0]}`}
                  </div>
                </div>

                {/* Topic */}
                <div className="hidden sm:flex flex-col text-center">
                  <div className="text-[8px] text-slate-400">CHỦ ĐỀ</div>
                  <div className="px-1.5 py-0.5 rounded bg-amber-950 border border-amber-500/50 text-amber-300 font-bold text-[9px] truncate max-w-[80px]">
                    {focusCategory === 'all' ? 'TẤT CẢ' : focusCategory}
                  </div>
                </div>

                {/* Quiz Status */}
                <div className="flex flex-col text-right">
                  <div className="text-[8px] text-slate-400">QUIZ</div>
                  <div className="text-emerald-400 font-bold text-[10px]">
                    {answerLogs.filter(a => a.isCorrect).length}/{answerLogs.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Game Canvas */}
            {engineRef.current && (
              <GameCanvas
                engine={engineRef.current}
                onTriggerQuiz={handleTriggerQuiz}
                isPaused={activeQuizQuestion !== null}
              />
            )}
          </div>
        )}
      </main>

      {/* Quiz Modal: Shows when hitting '?' Block */}
      {activeQuizQuestion && activeQuizBlock && (
        <QuestionQuizModal
          question={activeQuizQuestion}
          block={activeQuizBlock}
          onAnswer={handleQuizAnswer}
        />
      )}

      {/* CRUD Question Manager Modal */}
      <QuestionManagerModal
        isOpen={isQuestionManagerOpen}
        onClose={() => setIsQuestionManagerOpen(false)}
        onQuestionsUpdated={() => {
          setQuestionsList([...QuestionStore.getQuestions()]);
        }}
      />

      {/* Game Over & Stage Clear Summary Modal */}
      {(gameState === 'STAGE_CLEAR' || gameState === 'GAME_OVER') && (
        <GameOverSummaryModal
          isVictory={gameState === 'STAGE_CLEAR'}
          score={score}
          stage={currentStage}
          selectedTopic={focusCategory}
          answerLogs={answerLogs}
          onPlayAgain={startGame}
          onOpenQuestionManager={() => {
            setIsQuestionManagerOpen(true);
          }}
          onBackToMenu={() => setGameState('TITLE')}
        />
      )}

      {/* Instructions Modal */}
      <InstructionsModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
