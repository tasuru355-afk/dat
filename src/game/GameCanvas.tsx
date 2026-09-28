import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from './GameEngine';
import { CanvasRenderer } from './canvasRenderer';
import { GameBlock, ManaSkillType } from '../types/game';
import { Shield, Zap, Sparkles } from 'lucide-react';

interface GameCanvasProps {
  engine: GameEngine;
  onTriggerQuiz: (block: GameBlock) => void;
  isPaused: boolean;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ engine, isPaused }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isMouseDownRef = useRef<boolean>(false);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeSkill, setActiveSkill] = useState<ManaSkillType>(engine.player.activeManaSkill);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Turn off smoothing for authentic retro pixel aesthetic
    ctx.imageSmoothingEnabled = false;

    // Keyboard event listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling on arrow keys and space
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
      engine.keys[e.code] = true;
      if (e.code === 'KeyL') {
        setActiveSkill(engine.player.activeManaSkill);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      engine.keys[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Main render and physics loop
    const loop = () => {
      if (!isPaused) {
        // Continuous shooting when mouse held down
        if (isMouseDownRef.current) {
          engine.triggerShootAt(mousePosRef.current.x, mousePosRef.current.y);
        }
        engine.update();
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Parallax Background
      CanvasRenderer.drawBackground(
        ctx,
        engine.cameraX,
        canvas.width,
        canvas.height,
        engine.currentStage === 1 ? 'jungle' : 'base'
      );

      // Draw Level Blocks & Pipes
      engine.blocks.forEach(block => {
        CanvasRenderer.drawBlock(ctx, block, engine.cameraX);
      });

      // Draw Drop Items (Power-ups & Coins)
      CanvasRenderer.drawDropItems(ctx, engine.dropItems, engine.cameraX);

      // Draw Enemies
      CanvasRenderer.drawEnemies(ctx, engine.enemies, engine.cameraX);

      // Draw Player
      CanvasRenderer.drawPlayer(ctx, engine.player, engine.cameraX);

      // Draw Bullets
      CanvasRenderer.drawBullets(ctx, engine.bullets, engine.cameraX);

      // Draw Particles
      CanvasRenderer.drawParticles(ctx, engine.particles, engine.cameraX);

      // Draw Floating Text
      CanvasRenderer.drawFloatingTexts(ctx, engine.floatingTexts, engine.cameraX);

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [engine, isPaused]);

  // Mouse / Pointer shooting on canvas
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    isMouseDownRef.current = true;
    mousePosRef.current = coords;
    engine.triggerShootAt(coords.x, coords.y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isMouseDownRef.current) {
      mousePosRef.current = getCanvasCoords(e);
    }
  };

  const handlePointerUp = () => {
    isMouseDownRef.current = false;
  };

  // Touch control helper handlers
  const handleVirtualKey = (code: string, isDown: boolean) => {
    engine.keys[code] = isDown;
  };

  const handleTriggerSkill = () => {
    engine.triggerManaSkill();
  };

  const handleToggleSkill = () => {
    engine.toggleManaSkill();
    setActiveSkill(engine.player.activeManaSkill);
  };

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      {/* Canvas container with retro border & scanline effect */}
      <div className="relative w-full max-w-[880px] aspect-[16/10] bg-slate-950 rounded-lg overflow-hidden border-4 border-slate-700 shadow-2xl">
        <canvas
          ref={canvasRef}
          width={800}
          height={480}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="w-full h-full block pixelated cursor-crosshair"
        />

        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 crt-scanlines pointer-events-none" />

        {/* Click-to-shoot hint on first load */}
        <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/60 backdrop-blur border border-slate-700 text-[10px] font-retro text-amber-300 pointer-events-none hidden sm:block">
          🖱️ Click chuột để nhắm bắn góc tùy ý!
        </div>
      </div>

      {/* Control bar & Mobile Touch Controller */}
      <div className="w-full max-w-[880px] mt-2.5 flex flex-wrap items-center justify-between gap-3 px-3 sm:px-6 py-2 bg-slate-900/90 backdrop-blur rounded-xl border border-slate-800 shadow-lg">
        {/* D-Pad Controller */}
        <div className="grid grid-cols-3 gap-1 w-28 sm:w-32 h-26 sm:h-28 p-1">
          <div />
          <button
            type="button"
            onPointerDown={() => handleVirtualKey('ArrowUp', true)}
            onPointerUp={() => handleVirtualKey('ArrowUp', false)}
            onPointerLeave={() => handleVirtualKey('ArrowUp', false)}
            className="bg-slate-800 hover:bg-slate-700 active:bg-amber-500 rounded text-slate-200 font-retro text-xs flex items-center justify-center border border-slate-600 active:scale-95 transition-transform"
            aria-label="Up / Jump"
          >
            ▲
          </button>
          <div />

          <button
            type="button"
            onPointerDown={() => handleVirtualKey('ArrowLeft', true)}
            onPointerUp={() => handleVirtualKey('ArrowLeft', false)}
            onPointerLeave={() => handleVirtualKey('ArrowLeft', false)}
            className="bg-slate-800 hover:bg-slate-700 active:bg-amber-500 rounded text-slate-200 font-retro text-xs flex items-center justify-center border border-slate-600 active:scale-95 transition-transform"
            aria-label="Left"
          >
            ◀
          </button>

          <button
            type="button"
            onPointerDown={() => handleVirtualKey('ArrowDown', true)}
            onPointerUp={() => handleVirtualKey('ArrowDown', false)}
            onPointerLeave={() => handleVirtualKey('ArrowDown', false)}
            className="bg-slate-800 hover:bg-slate-700 active:bg-amber-500 rounded text-slate-200 font-retro text-xs flex items-center justify-center border border-slate-600 active:scale-95 transition-transform"
            aria-label="Down / Crouch"
          >
            ▼
          </button>

          <button
            type="button"
            onPointerDown={() => handleVirtualKey('ArrowRight', true)}
            onPointerUp={() => handleVirtualKey('ArrowRight', false)}
            onPointerLeave={() => handleVirtualKey('ArrowRight', false)}
            className="bg-slate-800 hover:bg-slate-700 active:bg-amber-500 rounded text-slate-200 font-retro text-xs flex items-center justify-center border border-slate-600 active:scale-95 transition-transform"
            aria-label="Right"
          >
            ▶
          </button>

          <div />
          <div />
          <div />
        </div>

        {/* Keyboard instructions badge */}
        <div className="hidden md:flex flex-col text-[10px] text-slate-400 font-retro space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-amber-400">A / D / ← →</span>
            <span>Chạy</span>
            <span className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-amber-400">W / Space / ↑</span>
            <span>Nhảy bậc</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-amber-400">S / ↓</span>
            <span>Cúi né đạn</span>
            <span className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-amber-400">J / Click chuột</span>
            <span>Bắn thẳng/chéo</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 bg-slate-800 rounded border border-cyan-500/50 text-cyan-300">Phím K</span>
            <span>Kỹ năng Mana (Khiên / Bom)</span>
            <span className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">Phím L</span>
            <span>Đổi chiêu</span>
          </div>
        </div>

        {/* Action Buttons (Skill, Shoot, Jump) */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Skill Button (K) */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={handleTriggerSkill}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex flex-col items-center justify-center shadow-lg border-2 active:scale-90 transition-transform ${
                engine.player.activeManaSkill === 'SHIELD'
                  ? 'bg-sky-600 active:bg-sky-700 border-sky-300 text-white'
                  : 'bg-amber-600 active:bg-amber-700 border-amber-300 text-slate-950 font-bold'
              }`}
              title="Kích hoạt kỹ năng Mana (Phím K)"
            >
              <span className="text-sm sm:text-base">
                {engine.player.activeManaSkill === 'SHIELD' ? '🛡️' : '💥'}
              </span>
              <span className="text-[9px] font-retro mt-0.5">K</span>
            </button>
            <button
              type="button"
              onClick={handleToggleSkill}
              className="text-[9px] font-retro text-sky-400 hover:text-sky-300 mt-1 underline cursor-pointer"
            >
              Đổi (L)
            </button>
          </div>

          {/* Shoot Button (J / X) */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              onPointerDown={() => handleVirtualKey('KeyJ', true)}
              onPointerUp={() => handleVirtualKey('KeyJ', false)}
              onPointerLeave={() => handleVirtualKey('KeyJ', false)}
              className="w-13 h-13 sm:w-15 sm:h-15 rounded-full bg-red-600 active:bg-red-700 text-white font-retro text-xs sm:text-sm flex items-center justify-center shadow-lg border-2 border-red-400 active:scale-90 transition-transform"
            >
              J
            </button>
            <span className="text-[10px] font-retro text-slate-400 mt-1">BẮN (J)</span>
          </div>

          {/* Jump Button (W / Space / Z) */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              onPointerDown={() => handleVirtualKey('Space', true)}
              onPointerUp={() => handleVirtualKey('Space', false)}
              onPointerLeave={() => handleVirtualKey('Space', false)}
              className="w-13 h-13 sm:w-15 sm:h-15 rounded-full bg-amber-500 active:bg-amber-600 text-slate-950 font-retro text-xs sm:text-sm font-bold flex items-center justify-center shadow-lg border-2 border-amber-300 active:scale-90 transition-transform"
            >
              W
            </button>
            <span className="text-[10px] font-retro text-slate-400 mt-1">NHẢY (W)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
