import { Player, GameBlock, Bullet, Enemy, Particle, FloatingText, DropItem } from '../types/game';

export class CanvasRenderer {
  public static drawBackground(
    ctx: CanvasRenderingContext2D,
    cameraX: number,
    canvasWidth: number,
    canvasHeight: number,
    theme: 'jungle' | 'base' | 'alien'
  ) {
    // Sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    if (theme === 'jungle') {
      skyGradient.addColorStop(0, '#1e3a8a'); // Deep sky blue
      skyGradient.addColorStop(0.55, '#3b82f6');
      skyGradient.addColorStop(0.85, '#93c5fd');
    } else if (theme === 'base') {
      skyGradient.addColorStop(0, '#0f172a');
      skyGradient.addColorStop(0.6, '#1e1b4b');
      skyGradient.addColorStop(0.9, '#312e81');
    } else {
      skyGradient.addColorStop(0, '#1c052e');
      skyGradient.addColorStop(0.6, '#3b0764');
      skyGradient.addColorStop(0.9, '#581c87');
    }
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Parallax Layer 1: Retro Pixel Clouds / Alien Moons
    const cloudOffset = (cameraX * 0.15) % 800;
    ctx.fillStyle = theme === 'jungle' ? 'rgba(255, 255, 255, 0.75)' : 'rgba(244, 114, 182, 0.3)';
    for (let i = -1; i < 3; i++) {
      const cx = i * 400 - cloudOffset;
      this.drawPixelCloud(ctx, cx, 60);
      this.drawPixelCloud(ctx, cx + 220, 110);
    }

    // Parallax Layer 2: Distant Mario Hills / Contra Jungle Silhouettes
    const hillOffset = (cameraX * 0.35) % 600;
    for (let i = -1; i < 3; i++) {
      const hx = i * 350 - hillOffset;
      if (theme === 'jungle') {
        // Mario green hills
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.arc(hx + 120, canvasHeight - 80, 140, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = '#166534';
        ctx.beginPath();
        ctx.arc(hx + 260, canvasHeight - 70, 90, Math.PI, 0);
        ctx.fill();
      } else {
        // High-tech silhouette base
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(hx, canvasHeight - 200, 120, 160);
        ctx.fillRect(hx + 150, canvasHeight - 260, 90, 220);
      }
    }
  }

  private static drawPixelCloud(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.arc(x + 20, y - 8, 26, 0, Math.PI * 2);
    ctx.arc(x + 45, y - 4, 20, 0, Math.PI * 2);
    ctx.arc(x + 65, y, 16, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw Mario/Contra Ground & Blocks
  public static drawBlock(ctx: CanvasRenderingContext2D, block: GameBlock, cameraX: number) {
    const rx = block.x - cameraX;
    const ry = block.y + (block.bumpOffsetY || 0);

    if (rx + block.width < -50 || rx > ctx.canvas.width + 50) return;

    if (block.type === 'GROUND') {
      // Grass top + Dirt body
      ctx.fillStyle = '#16a34a'; // Grass top
      ctx.fillRect(rx, ry, block.width, 8);

      ctx.fillStyle = '#854d0e'; // Brown dirt
      ctx.fillRect(rx, ry + 8, block.width, block.height - 8);

      // Dirt pixel details
      ctx.fillStyle = '#713f12';
      for (let px = 4; px < block.width; px += 16) {
        ctx.fillRect(rx + px, ry + 12, 6, 6);
        ctx.fillRect(rx + px + 8, ry + 22, 5, 5);
      }
    } else if (block.type === 'BRICK') {
      // Mario Brick
      ctx.fillStyle = '#b45309';
      ctx.fillRect(rx, ry, block.width, block.height);

      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 2;
      ctx.strokeRect(rx, ry, block.width, block.height);

      // Brick horizontal mortar line
      ctx.beginPath();
      ctx.moveTo(rx, ry + block.height / 2);
      ctx.lineTo(rx + block.width, ry + block.height / 2);
      // Vertical seams
      ctx.moveTo(rx + block.width / 2, ry);
      ctx.lineTo(rx + block.width / 2, ry + block.height / 2);
      ctx.moveTo(rx + block.width / 4, ry + block.height / 2);
      ctx.lineTo(rx + block.width / 4, ry + block.height);
      ctx.moveTo(rx + (block.width * 3) / 4, ry + block.height / 2);
      ctx.lineTo(rx + (block.width * 3) / 4, ry + block.height);
      ctx.stroke();
    } else if (block.type === 'QUESTION') {
      if (block.hitState === 'empty') {
        // Used block (Dark brown/bronze with rivet dots)
        ctx.fillStyle = '#78350f';
        ctx.fillRect(rx, ry, block.width, block.height);
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 2;
        ctx.strokeRect(rx, ry, block.width, block.height);
        // Rivets
        ctx.fillStyle = '#451a03';
        ctx.fillRect(rx + 4, ry + 4, 3, 3);
        ctx.fillRect(rx + block.width - 7, ry + 4, 3, 3);
        ctx.fillRect(rx + 4, ry + block.height - 7, 3, 3);
        ctx.fillRect(rx + block.width - 7, ry + block.height - 7, 3, 3);
      } else {
        // Glowing Golden Question Mark Block
        const pulse = Math.sin(Date.now() / 150) * 15;
        ctx.fillStyle = `rgb(${245 + pulse}, ${180 + pulse}, 0)`;
        ctx.fillRect(rx, ry, block.width, block.height);

        // Highlight & Shadow
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(rx, ry, block.width, 3);
        ctx.fillRect(rx, ry, 3, block.height);

        ctx.fillStyle = '#b45309';
        ctx.fillRect(rx + block.width - 3, ry, 3, block.height);
        ctx.fillRect(rx, ry + block.height - 3, block.width, 3);

        // '?' text
        ctx.fillStyle = '#78350f';
        ctx.font = 'bold 16px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', rx + block.width / 2, ry + block.height / 2 + 1);

        // Mini corner rivets
        ctx.fillStyle = '#451a03';
        ctx.fillRect(rx + 3, ry + 3, 2, 2);
        ctx.fillRect(rx + block.width - 5, ry + 3, 2, 2);
        ctx.fillRect(rx + 3, ry + block.height - 5, 2, 2);
        ctx.fillRect(rx + block.width - 5, ry + block.height - 5, 2, 2);
      }
    } else if (block.type === 'PIPE_TOP') {
      // Mario Warp Pipe Top Rim
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(rx - 3, ry, block.width + 6, block.height);

      // Pipe Highlights & Shadow
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(rx + 4, ry, 6, block.height);

      ctx.fillStyle = '#14532d';
      ctx.fillRect(rx + block.width - 8, ry, 6, block.height);

      ctx.strokeStyle = '#052e16';
      ctx.lineWidth = 2;
      ctx.strokeRect(rx - 3, ry, block.width + 6, block.height);
    } else if (block.type === 'PIPE_BODY') {
      // Mario Warp Pipe Stem
      ctx.fillStyle = '#15803d';
      ctx.fillRect(rx, ry, block.width, block.height);

      ctx.fillStyle = '#4ade80';
      ctx.fillRect(rx + 5, ry, 6, block.height);

      ctx.fillStyle = '#14532d';
      ctx.fillRect(rx + block.width - 7, ry, 6, block.height);

      ctx.strokeStyle = '#052e16';
      ctx.lineWidth = 2;
      ctx.strokeRect(rx, ry, block.width, block.height);
    } else if (block.type === 'FLAGPOLE') {
      // Flagpole base
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(rx, ry + block.height - 16, block.width, 16);

      // Pole
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(rx + block.width / 2 - 3, ry, 6, block.height - 16);

      // Gold Ball Top
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(rx + block.width / 2, ry, 8, 0, Math.PI * 2);
      ctx.fill();

      // Flag banner
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(rx + block.width / 2 + 3, ry + 10);
      ctx.lineTo(rx + block.width / 2 + 35, ry + 25);
      ctx.lineTo(rx + block.width / 2 + 3, ry + 40);
      ctx.fill();
    } else if (block.type === 'SEALED_GATE') {
      // If gate was blown up, it disappears!
      if (block.hitState === 'broken') return;

      const time = Date.now();
      const pulse = 0.5 + 0.45 * Math.sin(time / 160);
      const beamShift = Math.sin(time / 180) * 3;

      // 1. Top and Bottom Pylon Emitters
      const pylonH = 22;

      // Top Pylon
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(rx - 4, ry, block.width + 8, pylonH);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(rx - 4, ry, block.width + 8, pylonH);

      // Warning stripes on top pylon
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(rx, ry + 4, 6, pylonH - 8);
      ctx.fillRect(rx + 14, ry + 4, 6, pylonH - 8);
      ctx.fillRect(rx + 28, ry + 4, 6, pylonH - 8);

      // Bottom Pylon
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(rx - 4, ry + block.height - pylonH, block.width + 8, pylonH);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(rx - 4, ry + block.height - pylonH, block.width + 8, pylonH);

      // Warning stripes on bottom pylon
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(rx, ry + block.height - pylonH + 4, 6, pylonH - 8);
      ctx.fillRect(rx + 14, ry + block.height - pylonH + 4, 6, pylonH - 8);
      ctx.fillRect(rx + 28, ry + block.height - pylonH + 4, 6, pylonH - 8);

      // 2. High-energy Laser Barrier Forcefield
      const barrierH = block.height - pylonH * 2;
      const barrierY = ry + pylonH;

      ctx.save();
      // Outer glow field
      const barrierGrad = ctx.createLinearGradient(rx, barrierY, rx + block.width, barrierY);
      barrierGrad.addColorStop(0, `rgba(56, 189, 248, ${0.45 * pulse})`);
      barrierGrad.addColorStop(0.5, `rgba(239, 68, 68, ${0.65 * pulse})`);
      barrierGrad.addColorStop(1, `rgba(56, 189, 248, ${0.45 * pulse})`);
      ctx.fillStyle = barrierGrad;
      ctx.fillRect(rx + 2, barrierY, block.width - 4, barrierH);

      // Electric grid vertical laser lines
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.85 * pulse})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(rx + 8 + beamShift, barrierY);
      ctx.lineTo(rx + 8 - beamShift, barrierY + barrierH);
      ctx.moveTo(rx + block.width / 2, barrierY);
      ctx.lineTo(rx + block.width / 2, barrierY + barrierH);
      ctx.moveTo(rx + block.width - 8 - beamShift, barrierY);
      ctx.lineTo(rx + block.width - 8 + beamShift, barrierY + barrierH);
      ctx.stroke();

      // Horizontal plasma waves
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
      ctx.lineWidth = 1.5;
      for (let yOff = 16; yOff < barrierH; yOff += 24) {
        const waveOffset = Math.sin(time / 100 + yOff) * 3;
        ctx.beginPath();
        ctx.moveTo(rx + 4, barrierY + yOff + waveOffset);
        ctx.lineTo(rx + block.width - 4, barrierY + yOff - waveOffset);
        ctx.stroke();
      }

      // 3. Central Padlock / Seal Medallion
      const midY = barrierY + barrierH / 2;
      const midX = rx + block.width / 2;

      // Glow circle
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.arc(midX, midY, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Padlock emblem
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🔒', midX, midY);

      // 4. Floating Header Tag
      ctx.font = 'bold 9px "Press Start 2P", monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.textAlign = 'center';
      ctx.fillText('⚡ PHONG ẤN ⚡', midX, ry - 14);

      ctx.font = '8px "Press Start 2P", monospace';
      ctx.fillStyle = '#fde047';
      ctx.fillText('CHẠM ĐỂ MỞ', midX, ry - 4);

      ctx.restore();
    }
  }

  // Draw Player: Commando Bill Rizer style with Mario platformer capabilities
  public static drawPlayer(ctx: CanvasRenderingContext2D, player: Player, cameraX: number) {
    const rx = player.x - cameraX;
    const ry = player.y;

    // Invulnerability flashing
    if (player.invulnerableTimer > 0 && Math.floor(player.invulnerableTimer / 4) % 2 === 0) {
      return;
    }

    ctx.save();
    const isFacingLeft = player.facing === 'left';

    // Flip context if facing left
    if (isFacingLeft) {
      ctx.translate(rx + player.width / 2, ry + player.height / 2);
      ctx.scale(-1, 1);
      ctx.translate(-(rx + player.width / 2), -(ry + player.height / 2));
    }

    // Barrier shield ('B') effect
    if (player.barrierTimer > 0) {
      ctx.save();
      const time = Date.now() / 100;
      for (let i = 0; i < 4; i++) {
        const angle = time + (i * Math.PI) / 2;
        const orbX = rx + player.width / 2 + Math.cos(angle) * 26;
        const orbY = ry + player.height / 2 + Math.sin(angle) * 26;

        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#0284c7';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(orbX, orbY, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Body parts
    const cx = rx + player.width / 2;
    const cy = ry + player.height / 2;

    if (player.isCrouching) {
      // Contra Classic Prone / Ducking Stance (hitbox is lowered to floor)
      const floorY = ry + player.height;

      // Prone body & legs lying flat
      ctx.fillStyle = '#1e3a8a'; // Blue pants flat
      ctx.fillRect(cx - 14, floorY - 8, 14, 8);

      // Boots
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(cx - 16, floorY - 7, 4, 7);

      // Torso prone
      ctx.fillStyle = '#ea580c'; // Tank top
      ctx.fillRect(cx - 2, floorY - 14, 14, 12);

      // Head lowered
      ctx.fillStyle = '#fed7aa'; // Skin
      ctx.fillRect(cx + 6, floorY - 18, 9, 8);

      // Hair & Bandana
      ctx.fillStyle = '#b45309';
      ctx.fillRect(cx + 5, floorY - 20, 11, 4);
      ctx.fillStyle = '#dc2626'; // Red headband
      ctx.fillRect(cx + 5, floorY - 18, 11, 3);
      const wave = Math.sin(Date.now() / 90) * 2;
      ctx.fillRect(cx - 4, floorY - 17 + wave, 9, 2);

      // Low rifle along floor
      const gunY = floorY - 8;
      ctx.beginPath();
      ctx.moveTo(cx + 8, gunY);
      ctx.lineTo(cx + 22, gunY);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#334155';
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(cx + 20, gunY - 2, 4, 4);

      if (player.isShooting) {
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(cx + 26, gunY, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Standing / Running / Jumping Stance
      // Legs / Pants (Blue / Camo)
      ctx.fillStyle = '#2563eb';
      if (!player.isGrounded) {
        // Jumping: tucked legs
        ctx.fillRect(cx - 8, cy + 6, 7, 10);
        ctx.fillRect(cx + 1, cy + 8, 7, 8);
      } else if (Math.abs(player.vx) > 0.5) {
        // Running walk frame
        const frame = Math.floor(player.walkFrame) % 4;
        if (frame === 0 || frame === 2) {
          ctx.fillRect(cx - 8, cy + 6, 6, 14);
          ctx.fillRect(cx + 2, cy + 6, 6, 14);
        } else {
          ctx.fillRect(cx - 11, cy + 8, 6, 12);
          ctx.fillRect(cx + 5, cy + 4, 6, 14);
        }
      } else {
        // Idle stance
        ctx.fillRect(cx - 8, cy + 6, 6, 14);
        ctx.fillRect(cx + 2, cy + 6, 6, 14);
      }

      // Boots (Dark brown / black)
      ctx.fillStyle = '#1c1917';
      if (player.isGrounded) {
        ctx.fillRect(cx - 9, ry + player.height - 4, 7, 4);
        ctx.fillRect(cx + 2, ry + player.height - 4, 7, 4);
      }

      // Torso / Commando vest / muscles
      ctx.fillStyle = '#ea580c'; // Contra muscle tank / holster strap
      const torsoY = cy - 8;
      ctx.fillRect(cx - 7, torsoY, 14, 14);

      // Bandolier strap across chest
      ctx.fillStyle = '#451a03';
      ctx.fillRect(cx - 5, torsoY + 2, 10, 3);

      // Head / Face
      const headY = cy - 20;
      ctx.fillStyle = '#fed7aa'; // Skin tone
      ctx.fillRect(cx - 5, headY + 3, 10, 9);

      // Commando Hair & Red Headband (Iconic Contra)
      ctx.fillStyle = '#b45309'; // Brown hair
      ctx.fillRect(cx - 6, headY, 12, 4);

      ctx.fillStyle = '#dc2626'; // Red headband
      ctx.fillRect(cx - 6, headY + 3, 12, 3);
      const ribbonWave = Math.sin(Date.now() / 100) * 2;
      ctx.fillRect(cx - 12, headY + 4 + ribbonWave, 6, 2);
      ctx.fillRect(cx - 15, headY + 5 + ribbonWave, 4, 2);

      // Gun / Rifle (Contra Blaster)
      let gunStartX = cx + 2;
      let gunStartY = torsoY + 4;
      let gunEndX = cx + 18;
      let gunEndY = torsoY + 4;

      if (player.aimAngle === 'up') {
        gunEndX = cx + 4;
        gunEndY = headY - 10;
      } else if (player.aimAngle === 'diag_up') {
        gunEndX = cx + 16;
        gunEndY = headY - 6;
      }

      ctx.beginPath();
      ctx.moveTo(gunStartX, gunStartY);
      ctx.lineTo(gunEndX, gunEndY);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#334155';
      ctx.stroke();

      // Gun barrel highlight
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(gunEndX - 2, gunEndY - 2, 4, 4);

      // Muzzle flash if shooting
      if (player.isShooting) {
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(gunEndX + 3, gunEndY, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Mini Overhead Status Indicator (HP & Mana)
    ctx.restore(); // restore facing transform before drawing overhead bars

    ctx.save();
    const barWidth = 32;
    const barX = rx + player.width / 2 - barWidth / 2;
    const barY = ry - 14;

    // HP background & fill
    const hpRatio = Math.max(0, Math.min(1, player.hp / player.maxHp));
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(barX - 1, barY - 1, barWidth + 2, 5);
    ctx.fillStyle = hpRatio > 0.4 ? '#22c55e' : '#ef4444';
    ctx.fillRect(barX, barY, barWidth * hpRatio, 3);

    // Mana fill
    const manaRatio = Math.max(0, Math.min(1, player.mana / player.maxMana));
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(barX - 1, barY + 4, barWidth + 2, 4);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(barX, barY + 5, barWidth * manaRatio, 2);
    ctx.restore();
    return;
  }

  // Draw Projectiles
  public static drawBullets(ctx: CanvasRenderingContext2D, bullets: Bullet[], cameraX: number) {
    bullets.forEach(b => {
      const rx = b.x - cameraX;
      const ry = b.y;

      if (b.isMegaBomb) {
        // Massive fiery plasma bomb
        ctx.save();
        const pulse = Math.sin(Date.now() / 45) * 3;
        ctx.fillStyle = '#ea580c';
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(rx, ry, b.radius + pulse, 0, Math.PI * 2);
        ctx.fill();

        // Fiery golden shell
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Pure white nuclear core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(rx, ry, (b.radius + pulse) * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (b.isLaser) {
        // Laser beam pulse
        ctx.save();
        ctx.strokeStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 8;
        ctx.lineWidth = b.radius * 2;
        ctx.beginPath();
        ctx.moveTo(rx - b.vx * 0.4, ry - b.vy * 0.4);
        ctx.lineTo(rx + b.vx * 0.4, ry + b.vy * 0.4);
        ctx.stroke();
        ctx.restore();
      } else {
        // Glowing energy bullet
        ctx.save();
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(rx, ry, b.radius, 0, Math.PI * 2);
        ctx.fill();

        // Inner bright core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(rx, ry, b.radius * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });
  }

  // Draw Enemies
  public static drawEnemies(ctx: CanvasRenderingContext2D, enemies: Enemy[], cameraX: number) {
    enemies.forEach(e => {
      const rx = e.x - cameraX;
      const ry = e.y;

      if (rx + e.width < -100 || rx > ctx.canvas.width + 100) return;

      if (e.type === 'SOLDIER') {
        // Red Falcon Foot Soldier (Alien Infantry)
        ctx.save();
        if (e.facing === 'right') {
          ctx.translate(rx + e.width / 2, ry + e.height / 2);
          ctx.scale(-1, 1);
          ctx.translate(-(rx + e.width / 2), -(ry + e.height / 2));
        }

        // Body
        ctx.fillStyle = '#ef4444'; // Red soldier uniform
        ctx.fillRect(rx + 6, ry + 12, 16, 16);

        // Alien helmet / goggles
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(rx + 6, ry, 14, 12);
        ctx.fillStyle = '#06b6d4'; // Glowing blue visor
        ctx.fillRect(rx + 4, ry + 4, 6, 4);

        // Running legs
        const walk = Math.sin(Date.now() / 90);
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(rx + 6, ry + 28, 6, 8 + walk * 3);
        ctx.fillRect(rx + 15, ry + 28, 6, 8 - walk * 3);

        ctx.restore();
      } else if (e.type === 'SNIPER') {
        // Red Sniper on Ledge
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(rx + 4, ry + 8, 18, 20);

        // Helmet
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(rx + 6, ry, 14, 10);
        ctx.fillStyle = '#fbbf24'; // Yellow visor
        ctx.fillRect(rx + 2, ry + 3, 5, 3);

        // Long Sniper Rifle
        ctx.strokeStyle = '#020617';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(rx + 10, ry + 16);
        ctx.lineTo(rx - 12, ry + 16);
        ctx.stroke();
      } else if (e.type === 'PIRANHA_TURRET') {
        // Pipe Alien Turret (Mario Piranha + Contra Tech Turret)
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(rx + e.width / 2, ry + e.height / 2, e.width / 2 - 2, 0, Math.PI * 2);
        ctx.fill();

        // White spots (Mario piranha spots)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(rx + 8, ry + 10, 3, 0, Math.PI * 2);
        ctx.arc(rx + 22, ry + 14, 4, 0, Math.PI * 2);
        ctx.fill();

        // Mechanical canon eye
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(rx + e.width / 2, ry + e.height / 2, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(rx + e.width / 2, ry + e.height / 2, 3, 0, Math.PI * 2);
        ctx.fill();
      } else if (e.type === 'FLYING_POD') {
        // Contra Flying Item Pod
        const hover = Math.sin(Date.now() / 120) * 3;
        ctx.save();
        ctx.fillStyle = '#e2e8f0';
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2;

        // Pod body (capsule)
        ctx.beginPath();
        ctx.ellipse(rx + e.width / 2, ry + e.height / 2 + hover, 18, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Wing thrusters
        ctx.fillStyle = '#f97316';
        ctx.fillRect(rx - 2, ry + e.height / 2 - 2 + hover, 4, 4);
        ctx.fillRect(rx + e.width - 2, ry + e.height / 2 - 2 + hover, 4, 4);

        // Core insignia
        ctx.fillStyle = '#dc2626';
        ctx.font = 'bold 9px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚡', rx + e.width / 2, ry + e.height / 2 + hover + 1);
        ctx.restore();
      } else if (e.type === 'BOSS_CORE') {
        // Stage Boss: "Red Falcon Alien Defense Core"
        // Outer mechanical fortress frame
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(rx, ry, e.width, e.height);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 4;
        ctx.strokeRect(rx, ry, e.width, e.height);

        // Rivets & conduits
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(rx + 10, ry + 10, e.width - 20, 10);
        ctx.fillRect(rx + 10, ry + e.height - 20, e.width - 20, 10);

        // Laser cannons on top and bottom
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(rx - 15, ry + 25, 20, 12);
        ctx.fillRect(rx - 15, ry + e.height - 37, 20, 12);

        // Central Alien Heart / Glowing Power Core (Vulnerable point)
        const coreGlow = Math.sin(Date.now() / 100) * 10;
        ctx.save();
        ctx.fillStyle = `rgb(${220 + coreGlow}, 38, 38)`;
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(rx + e.width / 2 + 10, ry + e.height / 2, 28, 0, Math.PI * 2);
        ctx.fill();

        // Core eye
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.ellipse(rx + e.width / 2 + 10, ry + e.height / 2, 14, 22, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.ellipse(rx + e.width / 2 + 8, ry + e.height / 2, 4, 16, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Boss Health Bar above
        const barW = e.width + 40;
        const hpPercent = Math.max(e.hp / e.maxHp, 0);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(rx - 20, ry - 22, barW, 10);
        ctx.fillStyle = hpPercent > 0.3 ? '#ef4444' : '#f59e0b';
        ctx.fillRect(rx - 18, ry - 20, (barW - 4) * hpPercent, 6);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(rx - 20, ry - 22, barW, 10);
      }
    });
  }

  // Draw Pickups & Items (Spread 'S', Machine 'M', Laser 'L', Barrier 'B', Coin)
  public static drawDropItems(ctx: CanvasRenderingContext2D, items: DropItem[], cameraX: number) {
    items.forEach(item => {
      const rx = item.x - cameraX;
      const ry = item.y;

      if (item.itemType === 'COIN') {
        // Spinning Mario Gold Coin
        const spin = Math.abs(Math.sin(Date.now() / 120));
        ctx.save();
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.ellipse(rx + 10, ry + 10, 9 * spin + 2, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#713f12';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      } else {
        // Contra Falcon Power-Up Pod Badge
        ctx.save();
        ctx.fillStyle = '#dc2626';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(rx + 12, ry + 12, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Letter inside (S, M, L, F, B, 1UP)
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        let code = 'S';
        if (item.itemType === 'SPREAD') code = 'S';
        else if (item.itemType === 'MACHINE') code = 'M';
        else if (item.itemType === 'LASER') code = 'L';
        else if (item.itemType === 'FIRE') code = 'F';
        else if (item.itemType === 'BARRIER') code = 'B';
        else if (item.itemType === '1UP') code = '1P';

        ctx.fillText(code, rx + 12, ry + 13);
        ctx.restore();
      }
    });
  }

  // Draw Particles
  public static drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[], cameraX: number) {
    particles.forEach(p => {
      const rx = p.x - cameraX;
      ctx.save();
      ctx.globalAlpha = Math.max(p.alpha, 0);
      ctx.fillStyle = p.color;
      ctx.fillRect(rx, p.y, p.size, p.size);
      ctx.restore();
    });
  }

  // Draw Floating Text (+1000 PTS, 1UP, SPREAD GUN!)
  public static drawFloatingTexts(ctx: CanvasRenderingContext2D, texts: FloatingText[], cameraX: number) {
    texts.forEach(t => {
      const rx = t.x - cameraX;
      ctx.save();
      ctx.globalAlpha = Math.max(t.alpha, 0);
      ctx.fillStyle = t.color;
      ctx.font = 'bold 11px "Press Start 2P"';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 4;
      ctx.fillText(t.text, rx, t.y);
      ctx.restore();
    });
  }
}
