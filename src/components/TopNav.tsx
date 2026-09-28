import React from 'react';
import { Volume2, VolumeX, BookOpen, HelpCircle } from 'lucide-react';
import { audio } from '../utils/audio';

interface TopNavProps {
  onOpenQuestionManager: () => void;
  onOpenHelp: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onStartGame: () => void;
  isPlaying: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenQuestionManager,
  onOpenHelp,
  isMuted,
  onToggleMute,
  onStartGame,
  isPlaying,
}) => {
  return (
    <header className="w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
        }}
        className="font-retro text-sm sm:text-base text-amber-400 tracking-wider hover:text-amber-300 transition-colors whitespace-nowrap"
      >
        CONTRA MARIO
      </a>

      {/* Zone 2: Clean navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
        <button
          onClick={onOpenQuestionManager}
          className="hover:text-amber-400 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Quản lý câu hỏi / Cài đặt đề thi</span>
        </button>

        <button
          onClick={onOpenHelp}
          className="hover:text-amber-400 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
          <span>Hướng dẫn</span>
        </button>

        <button
          onClick={onToggleMute}
          className="hover:text-amber-400 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              <span>Bật âm thanh</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Âm thanh 8-bit</span>
            </>
          )}
        </button>
      </nav>

      {/* Zone 3: Primary Action */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenQuestionManager}
          className="md:hidden p-2 rounded-lg bg-slate-800 text-amber-400 border border-slate-700 hover:bg-slate-700"
          title="Quản lý câu hỏi"
        >
          <BookOpen className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleMute}
          className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
          title="Âm thanh"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>

        {!isPlaying ? (
          <button
            onClick={onStartGame}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-slate-950 font-retro text-xs font-bold rounded-lg shadow-md active:scale-95 transition-all whitespace-nowrap"
          >
            BẮT ĐẦU CHƠI
          </button>
        ) : (
          <button
            onClick={onOpenQuestionManager}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-retro text-[10px] rounded-lg transition-colors whitespace-nowrap"
          >
            QUẢN LÝ CÂU HỎI
          </button>
        )}
      </div>
    </header>
  );
};
