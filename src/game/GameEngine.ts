import { Player, GameBlock, Bullet, Enemy, Particle, FloatingText, DropItem, WeaponType, ManaSkillType } from '../types/game';
import { Question } from '../types/question';
import { audio } from '../utils/audio';

export interface GameEngineCallbacks {
  onTriggerQuiz: (block: GameBlock) => void;
  onScoreChange: (score: number) => void;
  onLivesChange: (lives: number) => void;
  onHpChange?: (hp: number, maxHp: number) => void;
  onManaChange?: (mana: number, maxMana: number) => void;
  onWeaponChange: (weapon: WeaponType) => void;
  onSkillChange?: (skill: ManaSkillType) => void;
  onStageClear: (stageNumber: number) => void;
  onGameOver: (finalScore: number) => void;
}

export class GameEngine {
  public player: Player;
  public blocks: GameBlock[] = [];
  public bullets: Bullet[] = [];
  public enemies: Enemy[] = [];
  public particles: Particle[] = [];
  public floatingTexts: FloatingText[] = [];
  public dropItems: DropItem[] = [];
  
  public cameraX: number = 0;
  public canvasWidth: number = 800;
  public canvasHeight: number = 480;
  public worldWidth: number = 3800;
  public currentStage: number = 1;
  public isPaused: boolean = false;
  
  private bulletIdCounter: number = 1;
  private enemyIdCounter: number = 1;
  private textIdCounter: number = 1;
  private dropItemIdCounter: number = 1;
  private lastShootTime: number = 0;
  private callbacks: GameEngineCallbacks;

  // Active keys and edge triggers
  public keys: { [key: string]: boolean } = {};
  private prevKeyK: boolean = false;
  private prevKeyL: boolean = false;

  public updateCallbacks(callbacks: GameEngineCallbacks) {
    this.callbacks = callbacks;
  }

  constructor(callbacks: GameEngineCallbacks, initialStage: number = 1) {
    this.callbacks = callbacks;
    this.currentStage = initialStage;

    this.player = {
      x: 60,
      y: 300,
      vx: 0,
      vy: 0,
      width: 24,
      height: 38,
      isGrounded: false,
      facing: 'right',
      aimAngle: 'straight',
      weapon: 'NORMAL',
      lives: 3,
      hp: 100,
      maxHp: 100,
      mana: 100,
      maxMana: 100,
      activeManaSkill: 'SHIELD',
      score: 0,
      invulnerableTimer: 60,
      barrierTimer: 0,
      isShooting: false,
      isCrouching: false,
      walkFrame: 0,
    };

    this.initStage(this.currentStage);
  }

  public initStage(stageNum: number) {
    this.currentStage = stageNum;
    this.blocks = [];
    this.bullets = [];
    this.enemies = [];
    this.particles = [];
    this.floatingTexts = [];
    this.dropItems = [];
    this.cameraX = 0;

    // Reset player position and stats
    this.player.x = 60;
    this.player.y = 300;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.hp = 100;
    this.player.mana = 100;
    this.player.invulnerableTimer = 60;
    this.player.barrierTimer = 0;
    if (this.callbacks.onHpChange) this.callbacks.onHpChange(100, 100);
    if (this.callbacks.onManaChange) this.callbacks.onManaChange(100, 100);

    this.generateLevel(stageNum);
  }

  public generateLevel(stage: number) {
    const groundY = 400;
    this.worldWidth = stage === 1 ? 3800 : 4200;

    // Section 1: Initial ground
    this.blocks.push({
      id: 1,
      x: 0,
      y: groundY,
      width: 900,
      height: 80,
      type: 'GROUND',
    });

    // Mystery Question Blocks in Section 1
    this.blocks.push(
      { id: 10, x: 240, y: groundY - 110, width: 32, height: 32, type: 'QUESTION', containsItem: 'WEAPON' },
      { id: 11, x: 272, y: groundY - 110, width: 32, height: 32, type: 'BRICK' },
      { id: 12, x: 304, y: groundY - 110, width: 32, height: 32, type: 'QUESTION', containsItem: 'COIN' },
      { id: 13, x: 336, y: groundY - 110, width: 32, height: 32, type: 'BRICK' },
      { id: 14, x: 368, y: groundY - 110, width: 32, height: 32, type: 'QUESTION', containsItem: 'WEAPON' }
    );

    // Warp Pipe 1 with Piranha Turret
    this.blocks.push(
      { id: 20, x: 500, y: groundY - 50, width: 44, height: 20, type: 'PIPE_TOP' },
      { id: 21, x: 502, y: groundY - 30, width: 40, height: 30, type: 'PIPE_BODY' }
    );
    this.spawnEnemy('PIRANHA_TURRET', 506, groundY - 76);

    // Warp Pipe 2
    this.blocks.push(
      { id: 22, x: 740, y: groundY - 70, width: 44, height: 20, type: 'PIPE_TOP' },
      { id: 23, x: 742, y: groundY - 50, width: 40, height: 50, type: 'PIPE_BODY' }
    );

    // SEALED GATE #1: Rào chắn phong ấn canh giữ cuối Khu vực 1
    this.blocks.push({
      id: 101,
      x: 840,
      y: groundY - 170,
      width: 44,
      height: 170,
      type: 'SEALED_GATE',
      gateLabel: 'CỔNG PHONG ẤN #1',
      gateNumber: 1,
      containsItem: 'WEAPON',
    });

    // Section 2: Gap & elevated platforms (x: 1000 - 1800)
    this.blocks.push({
      id: 2,
      x: 1020,
      y: groundY,
      width: 800,
      height: 80,
      type: 'GROUND',
    });

    // Elevated brick staircase & Question blocks
    for (let i = 0; i < 4; i++) {
      this.blocks.push({
        id: 30 + i,
        x: 1120 + i * 32,
        y: groundY - 32 * (i + 1),
        width: 32,
        height: 32,
        type: 'BRICK',
      });
    }

    this.blocks.push(
      { id: 40, x: 1320, y: groundY - 130, width: 32, height: 32, type: 'QUESTION', containsItem: 'WEAPON' },
      { id: 41, x: 1352, y: groundY - 130, width: 32, height: 32, type: 'QUESTION', containsItem: 'BARRIER' },
      { id: 42, x: 1384, y: groundY - 130, width: 32, height: 32, type: 'QUESTION', containsItem: '1UP' },
      { id: 43, x: 1416, y: groundY - 130, width: 32, height: 32, type: 'BRICK' }
    );

    // Pipe 3
    this.blocks.push(
      { id: 45, x: 1580, y: groundY - 80, width: 44, height: 20, type: 'PIPE_TOP' },
      { id: 46, x: 1582, y: groundY - 60, width: 40, height: 60, type: 'PIPE_BODY' }
    );
    this.spawnEnemy('PIRANHA_TURRET', 1586, groundY - 106);

    // SEALED GATE #2: Rào chắn phong ấn canh giữ lối vào Căn cứ Công nghệ
    this.blocks.push({
      id: 102,
      x: 1760,
      y: groundY - 170,
      width: 44,
      height: 170,
      type: 'SEALED_GATE',
      gateLabel: 'CỔNG PHONG ẤN #2',
      gateNumber: 2,
      containsItem: 'BARRIER',
    });

    // Section 3: Tech Fortress Wall approach (x: 1950 - 2900)
    this.blocks.push({
      id: 3,
      x: 1950,
      y: groundY,
      width: 1000,
      height: 80,
      type: 'GROUND',
    });

    // High ledges with Snipers
    this.blocks.push(
      { id: 50, x: 2100, y: groundY - 100, width: 120, height: 20, type: 'BRICK' },
      { id: 51, x: 2320, y: groundY - 120, width: 100, height: 20, type: 'BRICK' },
      { id: 52, x: 2520, y: groundY - 100, width: 120, height: 20, type: 'BRICK' }
    );

    this.spawnEnemy('SNIPER', 2140, groundY - 136);
    this.spawnEnemy('SNIPER', 2360, groundY - 156);
    this.spawnEnemy('SNIPER', 2560, groundY - 136);

    this.blocks.push(
      { id: 60, x: 2200, y: groundY - 180, width: 32, height: 32, type: 'QUESTION', containsItem: 'WEAPON' },
      { id: 61, x: 2420, y: groundY - 200, width: 32, height: 32, type: 'QUESTION', containsItem: 'WEAPON' }
    );

    // SEALED GATE #3: Cổng phong ấn tối thượng bảo vệ Đại doanh Trùm Cuối Red Falcon
    this.blocks.push({
      id: 103,
      x: 2880,
      y: groundY - 170,
      width: 44,
      height: 170,
      type: 'SEALED_GATE',
      gateLabel: 'CỔNG PHONG ẤN #3: ĐẠI DOANH TRÙM CUỐI',
      gateNumber: 3,
      containsItem: '1UP',
    });

    // Section 4: Boss Arena (x: 3050 - 3800)
    this.blocks.push({
      id: 4,
      x: 3050,
      y: groundY,
      width: 800,
      height: 80,
      type: 'GROUND',
    });

    // Pre-boss question block for readying weapons
    this.blocks.push(
      { id: 70, x: 3120, y: groundY - 110, width: 32, height: 32, type: 'QUESTION', containsItem: 'WEAPON' },
      { id: 71, x: 3152, y: groundY - 110, width: 32, height: 32, type: 'QUESTION', containsItem: 'BARRIER' }
    );

    // Spawn Boss: Red Falcon Defense Core at x = 3550
    this.spawnEnemy('BOSS_CORE', 3520, groundY - 220);

    // Spawn some initial ground soldiers
    this.spawnEnemy('SOLDIER', 650, groundY - 40);
    this.spawnEnemy('SOLDIER', 1250, groundY - 40);
    this.spawnEnemy('SOLDIER', 1450, groundY - 40);
    this.spawnEnemy('SOLDIER', 2280, groundY - 40);
  }

  public spawnEnemy(type: Enemy['type'], x: number, y: number) {
    const id = this.enemyIdCounter++;
    let width = 24;
    let height = 36;
    let hp = 1;
    let maxHp = 1;
    let scoreValue = 100;

    if (type === 'SNIPER') {
      width = 24;
      height = 36;
      hp = 2;
      maxHp = 2;
      scoreValue = 200;
    } else if (type === 'PIRANHA_TURRET') {
      width = 30;
      height = 30;
      hp = 3;
      maxHp = 3;
      scoreValue = 300;
    } else if (type === 'FLYING_POD') {
      width = 36;
      height = 20;
      hp = 1;
      maxHp = 1;
      scoreValue = 250;
    } else if (type === 'BOSS_CORE') {
      width = 120;
      height = 220;
      hp = 45;
      maxHp = 45;
      scoreValue = 5000;
    }

    this.enemies.push({
      id,
      type,
      x,
      y,
      vx: type === 'SOLDIER' ? -1.8 : 0,
      vy: 0,
      width,
      height,
      hp,
      maxHp,
      facing: 'left',
      shootCooldown: Math.floor(Math.random() * 60) + 40,
      stateTimer: 0,
      isActive: true,
      scoreValue,
    });
  }

  public update() {
    if (this.isPaused) return;

    // Passive mana regeneration (~2.5 mana/sec at 60fps)
    if (this.player.mana < this.player.maxMana) {
      this.player.mana = Math.min(this.player.maxMana, this.player.mana + 0.04);
      if (this.callbacks.onManaChange && Math.floor(this.player.mana * 10) % 20 === 0) {
        this.callbacks.onManaChange(Math.round(this.player.mana), this.player.maxMana);
      }
    }

    this.handleInput();
    this.updatePlayer();
    this.updateBullets();
    this.updateEnemies();
    this.updateDropItems();
    this.updateParticles();
    this.updateFloatingTexts();
    this.updateCamera();

    // Random Flying Item Pod spawn (Contra style)
    if (Math.random() < 0.003 && this.enemies.filter(e => e.type === 'FLYING_POD').length < 2) {
      this.spawnEnemy('FLYING_POD', this.cameraX + this.canvasWidth + 20, 80 + Math.random() * 80);
    }
  }

  private handleInput() {
    const p = this.player;

    // Left / Right Movement: A / D or ArrowLeft / ArrowRight
    const left = this.keys['ArrowLeft'] || this.keys['KeyA'];
    const right = this.keys['ArrowRight'] || this.keys['KeyD'];

    // Jump onto platforms: W / Space / ArrowUp / KeyZ
    const up = this.keys['ArrowUp'] || this.keys['KeyW'];
    const jump = this.keys['Space'] || this.keys['KeyW'] || this.keys['ArrowUp'] || this.keys['KeyZ'];

    // Crouch / Duck under enemy bullets: S / ArrowDown
    const down = this.keys['ArrowDown'] || this.keys['KeyS'];

    // Shoot: KeyJ or KeyX
    const shoot = this.keys['KeyJ'] || this.keys['KeyX'];

    // Mana Skill: Key K activates barrier or mega bomb
    const keyK = !!this.keys['KeyK'];
    if (keyK && !this.prevKeyK) {
      this.triggerManaSkill();
    }
    this.prevKeyK = keyK;

    // Toggle Mana Skill: Key L switches between Barrier Shield and Mega Bomb
    const keyL = !!this.keys['KeyL'];
    if (keyL && !this.prevKeyL) {
      this.toggleManaSkill();
    }
    this.prevKeyL = keyL;

    // Aiming & Crouch state
    p.isCrouching = false;
    if (down && p.isGrounded && !left && !right) {
      p.isCrouching = true;
      p.aimAngle = 'crouch';
    } else if (up && (left || right)) {
      p.aimAngle = 'diag_up';
    } else if (up && !p.isGrounded) {
      p.aimAngle = 'up';
    } else {
      p.aimAngle = 'straight';
    }

    // Horizontal acceleration
    const speed = p.isCrouching ? 0 : 3.6;
    if (left && !right) {
      p.vx = -speed;
      p.facing = 'left';
      p.walkFrame += 0.2;
    } else if (right && !left) {
      p.vx = speed;
      p.facing = 'right';
      p.walkFrame += 0.2;
    } else {
      p.vx *= 0.7;
      if (Math.abs(p.vx) < 0.1) p.vx = 0;
    }

    // Mario Variable Jump onto platforms
    if (jump && p.isGrounded) {
      p.vy = -12.5; // Upward impulse
      p.isGrounded = false;
      audio.playJump();
    }

    // Shooting
    p.isShooting = shoot;
    if (shoot) {
      this.triggerShoot();
    }
  }

  public triggerShootAt(targetScreenX?: number, targetScreenY?: number) {
    if (targetScreenX !== undefined && targetScreenY !== undefined) {
      const p = this.player;
      const targetWorldX = targetScreenX + this.cameraX;
      const targetWorldY = targetScreenY;
      const spawnX = p.facing === 'left' ? p.x - 4 : p.x + p.width + 4;
      const spawnY = p.isCrouching ? p.y + p.height - 10 : p.y + 12;
      const angleRad = Math.atan2(targetWorldY - spawnY, targetWorldX - spawnX);
      p.facing = targetWorldX < p.x ? 'left' : 'right';
      this.triggerShoot(angleRad);
    } else {
      this.triggerShoot();
    }
  }

  public triggerShoot(customAngle?: number) {
    const now = performance.now();
    const p = this.player;

    let fireInterval = 220; // ms
    if (p.weapon === 'MACHINE') fireInterval = 90;
    else if (p.weapon === 'SPREAD') fireInterval = 280;
    else if (p.weapon === 'LASER') fireInterval = 320;
    else if (p.weapon === 'FIRE') fireInterval = 200;

    if (now - this.lastShootTime < fireInterval) return;
    this.lastShootTime = now;

    audio.playShoot(p.weapon);

    // Calculate bullet trajectory
    const isFacingLeft = p.facing === 'left';
    const spawnX = isFacingLeft ? p.x - 4 : p.x + p.width + 4;
    const spawnY = p.isCrouching ? p.y + p.height - 12 : p.y + 12;
    const baseSpeed = 10;

    if (customAngle !== undefined) {
      // Aim precisely at mouse click direction
      if (p.weapon === 'SPREAD') {
        const spreadOffsets = [-0.35, -0.18, 0, 0.18, 0.35];
        spreadOffsets.forEach(offset => {
          const rad = customAngle + offset;
          this.bullets.push({
            id: this.bulletIdCounter++,
            x: spawnX,
            y: spawnY,
            vx: Math.cos(rad) * baseSpeed,
            vy: Math.sin(rad) * baseSpeed,
            radius: 5,
            damage: 1.2,
            color: '#ef4444',
            isPlayer: true,
            lifetime: 80,
          });
        });
      } else if (p.weapon === 'LASER') {
        this.bullets.push({
          id: this.bulletIdCounter++,
          x: spawnX,
          y: spawnY,
          vx: Math.cos(customAngle) * 16,
          vy: Math.sin(customAngle) * 16,
          radius: 4,
          damage: 3.5,
          color: '#38bdf8',
          isPlayer: true,
          isLaser: true,
          pierceCount: 4,
          lifetime: 60,
        });
      } else if (p.weapon === 'FIRE') {
        this.bullets.push({
          id: this.bulletIdCounter++,
          x: spawnX,
          y: spawnY,
          vx: Math.cos(customAngle) * 9,
          vy: Math.sin(customAngle) * 9,
          radius: 7,
          damage: 2.2,
          color: '#f97316',
          isPlayer: true,
          lifetime: 75,
        });
      } else {
        this.bullets.push({
          id: this.bulletIdCounter++,
          x: spawnX,
          y: spawnY,
          vx: Math.cos(customAngle) * 12,
          vy: Math.sin(customAngle) * 12,
          radius: p.weapon === 'MACHINE' ? 3.5 : 4,
          damage: 1,
          color: p.weapon === 'MACHINE' ? '#f59e0b' : '#facc15',
          isPlayer: true,
          lifetime: 70,
        });
      }
      return;
    }

    if (p.weapon === 'SPREAD') {
      // Contra 5-way spread gun!
      const angles = [-25, -12, 0, 12, 25];
      angles.forEach(deg => {
        let rad = (deg * Math.PI) / 180;
        if (p.aimAngle === 'up') rad -= Math.PI / 2;
        else if (p.aimAngle === 'diag_up') rad -= isFacingLeft ? -Math.PI / 4 : Math.PI / 4;
        else if (isFacingLeft) rad = Math.PI - rad;

        this.bullets.push({
          id: this.bulletIdCounter++,
          x: spawnX,
          y: spawnY,
          vx: Math.cos(rad) * baseSpeed,
          vy: Math.sin(rad) * baseSpeed,
          radius: 5,
          damage: 1.2,
          color: '#ef4444',
          isPlayer: true,
          lifetime: 80,
        });
      });
    } else if (p.weapon === 'LASER') {
      // Piercing beam
      let vx = isFacingLeft ? -16 : 16;
      let vy = 0;
      if (p.aimAngle === 'up') { vx = 0; vy = -16; }
      else if (p.aimAngle === 'diag_up') { vx = isFacingLeft ? -11 : 11; vy = -11; }

      this.bullets.push({
        id: this.bulletIdCounter++,
        x: spawnX,
        y: spawnY,
        vx,
        vy,
        radius: 4,
        damage: 3.5,
        color: '#38bdf8',
        isPlayer: true,
        isLaser: true,
        pierceCount: 4,
        lifetime: 60,
      });
    } else if (p.weapon === 'FIRE') {
      // Fireballs
      let vx = isFacingLeft ? -9 : 9;
      let vy = 0;
      if (p.aimAngle === 'up') { vx = 0; vy = -9; }
      else if (p.aimAngle === 'diag_up') { vx = isFacingLeft ? -6.5 : 6.5; vy = -6.5; }

      this.bullets.push({
        id: this.bulletIdCounter++,
        x: spawnX,
        y: spawnY,
        vx,
        vy,
        radius: 7,
        damage: 2.2,
        color: '#f97316',
        isPlayer: true,
        lifetime: 75,
      });
    } else {
      // Normal or Machine Gun
      let vx = isFacingLeft ? -12 : 12;
      let vy = 0;
      if (p.aimAngle === 'up') { vx = 0; vy = -12; }
      else if (p.aimAngle === 'diag_up') { vx = isFacingLeft ? -8.5 : 8.5; vy = -8.5; }

      this.bullets.push({
        id: this.bulletIdCounter++,
        x: spawnX,
        y: spawnY,
        vx,
        vy,
        radius: p.weapon === 'MACHINE' ? 3.5 : 4,
        damage: 1,
        color: p.weapon === 'MACHINE' ? '#f59e0b' : '#facc15',
        isPlayer: true,
        lifetime: 70,
      });
    }
  }

  public toggleManaSkill() {
    const p = this.player;
    p.activeManaSkill = p.activeManaSkill === 'SHIELD' ? 'MEGA_BOMB' : 'SHIELD';
    audio.playCoin();
    this.floatingTexts.push({
      id: this.textIdCounter++,
      x: p.x,
      y: p.y - 20,
      text: p.activeManaSkill === 'SHIELD' ? 'KỸ NĂNG: 🛡️ KHIÊN HỘ THỂ' : 'KỸ NĂNG: 💥 ĐẠN NỔ LỚN',
      color: p.activeManaSkill === 'SHIELD' ? '#38bdf8' : '#fbbf24',
      alpha: 1,
      vy: -1.2,
    });
    if (this.callbacks.onSkillChange) {
      this.callbacks.onSkillChange(p.activeManaSkill);
    }
  }

  public triggerManaSkill(forcedSkill?: ManaSkillType) {
    const p = this.player;
    const skill = forcedSkill || p.activeManaSkill;
    const cost = 35;

    if (p.mana < cost) {
      audio.playSkillFail();
      this.floatingTexts.push({
        id: this.textIdCounter++,
        x: p.x - 10,
        y: p.y - 20,
        text: 'CẦN 35 MANA!',
        color: '#f87171',
        alpha: 1,
        vy: -1.2,
      });
      return;
    }

    p.mana = Math.max(0, p.mana - cost);
    if (this.callbacks.onManaChange) {
      this.callbacks.onManaChange(Math.round(p.mana), p.maxMana);
    }

    if (skill === 'SHIELD') {
      audio.playShield();
      p.barrierTimer = 360; // 6 seconds of barrier shield
      p.invulnerableTimer = 60;
      this.spawnParticles(p.x + p.width / 2, p.y + p.height / 2, '#38bdf8', 24);

      // Deflect and clear all enemy bullets within 180px
      for (let i = this.bullets.length - 1; i >= 0; i--) {
        const b = this.bullets[i];
        if (!b.isPlayer) {
          const dist = Math.hypot(b.x - (p.x + p.width / 2), b.y - (p.y + p.height / 2));
          if (dist < 180) {
            this.spawnParticles(b.x, b.y, '#38bdf8', 6);
            this.bullets.splice(i, 1);
          }
        }
      }

      this.floatingTexts.push({
        id: this.textIdCounter++,
        x: p.x - 25,
        y: p.y - 25,
        text: '🛡️ KHIÊN HỘ THỂ BẬT!',
        color: '#38bdf8',
        alpha: 1,
        vy: -1.4,
      });
    } else {
      // MEGA_BOMB
      audio.playMegaBomb();
      const isFacingLeft = p.facing === 'left';
      const spawnX = isFacingLeft ? p.x - 10 : p.x + p.width + 10;
      const spawnY = p.isCrouching ? p.y + p.height - 12 : p.y + 12;

      let vx = isFacingLeft ? -13 : 13;
      let vy = 0;
      if (p.aimAngle === 'up') { vx = 0; vy = -13; }
      else if (p.aimAngle === 'diag_up') { vx = isFacingLeft ? -9.5 : 9.5; vy = -9.5; }

      this.bullets.push({
        id: this.bulletIdCounter++,
        x: spawnX,
        y: spawnY,
        vx,
        vy,
        radius: 12,
        damage: 20,
        color: '#f97316',
        isPlayer: true,
        isMegaBomb: true,
        explosionRadius: 140,
        lifetime: 90,
      });

      this.spawnParticles(spawnX, spawnY, '#fbbf24', 16);
      this.floatingTexts.push({
        id: this.textIdCounter++,
        x: p.x - 20,
        y: p.y - 25,
        text: '💥 ĐẠN NỔ LỚN BẮN RA!',
        color: '#fbbf24',
        alpha: 1,
        vy: -1.4,
      });
    }
  }

  public detonateMegaBomb(bx: number, by: number, radius: number = 140, damage: number = 20) {
    audio.playMegaBomb();
    this.spawnParticles(bx, by, '#ef4444', 28);
    this.spawnParticles(bx, by, '#f97316', 24);
    this.spawnParticles(bx, by, '#facc15', 20);

    // Damage all enemies in blast radius
    for (let j = this.enemies.length - 1; j >= 0; j--) {
      const e = this.enemies[j];
      if (!e.isActive) continue;
      const dist = Math.hypot(e.x + e.width / 2 - bx, e.y + e.height / 2 - by);
      if (dist <= radius) {
        e.hp -= damage;
        this.spawnParticles(e.x + e.width / 2, e.y + e.height / 2, '#ef4444', 10);
        if (e.hp <= 0) {
          this.destroyEnemy(e, j);
        }
      }
    }

    // Destroy all enemy bullets in radius
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      if (!b.isPlayer) {
        const dist = Math.hypot(b.x - bx, b.y - by);
        if (dist <= radius) {
          this.spawnParticles(b.x, b.y, '#fbbf24', 4);
          this.bullets.splice(i, 1);
        }
      }
    }

    // Trigger question blocks in radius
    for (const block of this.blocks) {
      if (block.type === 'QUESTION' && block.hitState !== 'empty') {
        const dist = Math.hypot(block.x + 16 - bx, block.y + 16 - by);
        if (dist <= radius) {
          audio.playQuestionBlock();
          block.bumpOffsetY = -10;
          this.callbacks.onTriggerQuiz(block);
        }
      }
    }
  }

  public triggerSealedGate(gate: GameBlock) {
    if (gate.hitState === 'broken' || this.isPaused) return;

    // Immediately stop player movement and pause physics
    this.player.vx = 0;
    if (this.player.x < gate.x) {
      this.player.x = gate.x - this.player.width - 2;
    } else {
      this.player.x = gate.x + gate.width + 2;
    }
    this.isPaused = true;

    // Audio cue
    audio.playQuestionBlock();

    // Floating alert text
    this.floatingTexts.push({
      id: this.textIdCounter++,
      x: gate.x - 20,
      y: gate.y - 20,
      text: '⚡ KÍCH HOẠT CỔNG PHONG ẤN!',
      color: '#38bdf8',
      alpha: 1,
      vy: -1.2,
    });

    // Spawn sparks
    this.spawnParticles(gate.x + gate.width / 2, gate.y + gate.height / 2, '#38bdf8', 16);

    // Trigger quiz UI
    this.callbacks.onTriggerQuiz(gate);
  }

  private updatePlayer() {
    const p = this.player;

    // Timers
    if (p.invulnerableTimer > 0) p.invulnerableTimer--;
    if (p.barrierTimer > 0) p.barrierTimer--;

    // Gravity
    p.vy += 0.65;
    if (p.vy > 14) p.vy = 14;

    // Move horizontally
    p.x += p.vx;
    // World boundary
    if (p.x < 0) p.x = 0;
    if (p.x > this.worldWidth - p.width) p.x = this.worldWidth - p.width;

    // Check horizontal collisions with solid blocks
    this.blocks.forEach(block => {
      if (block.hitState === 'broken') return;
      if (block.type === 'PIPE_BODY' || block.type === 'PIPE_TOP' || block.type === 'BRICK' || block.type === 'QUESTION' || block.type === 'SEALED_GATE') {
        if (this.checkCollision(p, block)) {
          if (block.type === 'SEALED_GATE') {
            if (!this.isPaused) {
              this.triggerSealedGate(block);
              return;
            }
          }
          if (p.vx > 0) {
            p.x = block.x - p.width;
          } else if (p.vx < 0) {
            p.x = block.x + block.width;
          }
        }
      }
    });

    // Move vertically
    p.y += p.vy;
    p.isGrounded = false;

    // Check vertical collisions
    this.blocks.forEach(block => {
      if (block.hitState === 'broken') return;
      // Vertical bump restitution
      if (block.bumpOffsetY && block.bumpOffsetY < 0) {
        block.bumpOffsetY += 1.5;
        if (block.bumpOffsetY > 0) block.bumpOffsetY = 0;
      }

      if (this.checkCollision(p, block)) {
        if (block.type === 'SEALED_GATE') {
          if (!this.isPaused) {
            this.triggerSealedGate(block);
            return;
          }
        }
        if (p.vy > 0 && p.y + p.height - p.vy <= block.y + 4) {
          // Landing on top of block
          p.y = block.y - p.height;
          p.vy = 0;
          p.isGrounded = true;
        } else if (p.vy < 0 && p.y - p.vy >= block.y + block.height - 8) {
          // Hitting block from below (Mario Headbump!)
          p.y = block.y + block.height;
          p.vy = 1;

          if (block.type === 'QUESTION' && block.hitState !== 'empty') {
            // Trigger Quiz question!
            audio.playQuestionBlock();
            block.bumpOffsetY = -10;
            this.callbacks.onTriggerQuiz(block);
          } else if (block.type === 'BRICK') {
            audio.playBump();
            block.bumpOffsetY = -6;
            this.spawnParticles(block.x + 16, block.y + 16, '#b45309', 4);
          }
        }
      }
    });

    // Falling into pits
    if (p.y > this.canvasHeight + 100) {
      this.handlePlayerDeath();
    }
  }

  private updateBullets() {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.x += b.vx;
      b.y += b.vy;
      b.lifetime--;

      // Remove offscreen or expired bullets
      if (
        b.lifetime <= 0 ||
        b.x < this.cameraX - 50 ||
        b.x > this.cameraX + this.canvasWidth + 50 ||
        b.y < -50 ||
        b.y > this.canvasHeight + 50
      ) {
        this.bullets.splice(i, 1);
        continue;
      }

      // Player bullet collisions with Enemies
      if (b.isPlayer) {
        let bulletDestroyed = false;

        for (let j = this.enemies.length - 1; j >= 0; j--) {
          const e = this.enemies[j];
          if (!e.isActive) continue;

          if (
            b.x >= e.x &&
            b.x <= e.x + e.width &&
            b.y >= e.y &&
            b.y <= e.y + e.height
          ) {
            if (b.isMegaBomb) {
              this.detonateMegaBomb(b.x, b.y, b.explosionRadius || 140, b.damage);
              bulletDestroyed = true;
              break;
            }

            e.hp -= b.damage;
            this.spawnParticles(b.x, b.y, b.color, 4);

            if (e.hp <= 0) {
              this.destroyEnemy(e, j);
            } else {
              audio.playBump();
            }

            if (!b.isLaser) {
              bulletDestroyed = true;
              break;
            } else {
              b.pierceCount = (b.pierceCount || 1) - 1;
              if (b.pierceCount <= 0) {
                bulletDestroyed = true;
                break;
              }
            }
          }
        }

        // Bullets hitting Question blocks can also trigger them!
        for (const block of this.blocks) {
          if (
            block.type === 'QUESTION' &&
            block.hitState !== 'empty' &&
            b.x >= block.x &&
            b.x <= block.x + block.width &&
            b.y >= block.y &&
            b.y <= block.y + block.height
          ) {
            audio.playQuestionBlock();
            block.bumpOffsetY = -8;
            this.callbacks.onTriggerQuiz(block);
            if (b.isMegaBomb) {
              this.detonateMegaBomb(b.x, b.y, b.explosionRadius || 140, b.damage);
            }
            bulletDestroyed = true;
            break;
          }

          // Bullets hitting Sealed Gates trigger or deflect
          if (
            block.type === 'SEALED_GATE' &&
            block.hitState !== 'broken' &&
            b.x >= block.x &&
            b.x <= block.x + block.width &&
            b.y >= block.y &&
            b.y <= block.y + block.height
          ) {
            this.spawnParticles(b.x, b.y, '#38bdf8', 8);
            audio.playBump();
            if (!this.isPaused) {
              this.triggerSealedGate(block);
            }
            bulletDestroyed = true;
            break;
          }
        }

        if (bulletDestroyed) {
          this.bullets.splice(i, 1);
          continue;
        }
      } else {
        // Enemy bullet hitting Player - crouch hitbox lowers player so bullets fly over head!
        const p = this.player;
        const playerHitboxY = p.isCrouching ? p.y + 20 : p.y;
        const playerHitboxH = p.isCrouching ? 18 : p.height;

        if (
          p.invulnerableTimer === 0 &&
          b.x >= p.x &&
          b.x <= p.x + p.width &&
          b.y >= playerHitboxY &&
          b.y <= playerHitboxY + playerHitboxH
        ) {
          if (p.barrierTimer > 0) {
            // Barrier reflects/absorbs bullet
            audio.playBump();
            this.spawnParticles(b.x, b.y, '#38bdf8', 6);
          } else {
            this.damagePlayer(20, 'BULLET');
          }
          this.bullets.splice(i, 1);
          continue;
        }
      }
    }
  }

  private updateEnemies() {
    const p = this.player;

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      if (!e.isActive) continue;

      e.stateTimer++;

      if (e.type === 'SOLDIER') {
        // Soldiers run and reverse when hitting obstacles
        e.x += e.vx;
        // Gravity for soldier
        e.vy += 0.5;
        e.y += e.vy;

        // Ground collision
        this.blocks.forEach(b => {
          if (this.checkCollision(e, b)) {
            if (e.vy > 0) {
              e.y = b.y - e.height;
              e.vy = 0;
            }
          }
        });

        // Face player direction or patrol
        e.facing = e.vx > 0 ? 'right' : 'left';
      } else if (e.type === 'SNIPER') {
        // Shoot at player periodically
        e.shootCooldown--;
        if (e.shootCooldown <= 0 && Math.abs(e.x - p.x) < 450) {
          e.shootCooldown = 90 + Math.floor(Math.random() * 40);
          const dir = p.x < e.x ? -1 : 1;
          this.bullets.push({
            id: this.bulletIdCounter++,
            x: e.x + (dir === -1 ? -6 : e.width + 6),
            y: e.y + 14,
            vx: dir * 5.5,
            vy: 0,
            radius: 4,
            damage: 1,
            color: '#ef4444',
            isPlayer: false,
            lifetime: 100,
          });
        }
      } else if (e.type === 'PIRANHA_TURRET') {
        // Periodic fire
        e.shootCooldown--;
        if (e.shootCooldown <= 0 && Math.abs(e.x - p.x) < 380) {
          e.shootCooldown = 110;
          const angle = Math.atan2(p.y - e.y, p.x - e.x);
          this.bullets.push({
            id: this.bulletIdCounter++,
            x: e.x + e.width / 2,
            y: e.y + e.height / 2,
            vx: Math.cos(angle) * 4.5,
            vy: Math.sin(angle) * 4.5,
            radius: 5,
            damage: 1,
            color: '#f97316',
            isPlayer: false,
            lifetime: 90,
          });
        }
      } else if (e.type === 'FLYING_POD') {
        e.x -= 2.2;
        if (e.x < this.cameraX - 100) {
          this.enemies.splice(i, 1);
          continue;
        }
      } else if (e.type === 'BOSS_CORE') {
        // Boss Cannon firing
        e.shootCooldown--;
        if (e.shootCooldown <= 0 && Math.abs(e.x - p.x) < 700) {
          e.shootCooldown = 65;
          // Dual laser cannons
          this.bullets.push(
            {
              id: this.bulletIdCounter++,
              x: e.x - 10,
              y: e.y + 30,
              vx: -6,
              vy: Math.sin(e.stateTimer / 10) * 1.5,
              radius: 5,
              damage: 1,
              color: '#dc2626',
              isPlayer: false,
              lifetime: 120,
            },
            {
              id: this.bulletIdCounter++,
              x: e.x - 10,
              y: e.y + e.height - 35,
              vx: -6,
              vy: -Math.sin(e.stateTimer / 10) * 1.5,
              radius: 5,
              damage: 1,
              color: '#dc2626',
              isPlayer: false,
              lifetime: 120,
            }
          );
        }
      }

      // Check player collision with enemy body
      const playerHitboxY = p.isCrouching ? p.y + 20 : p.y;
      const playerHitboxH = p.isCrouching ? 18 : p.height;
      const pBox = { x: p.x, y: playerHitboxY, width: p.width, height: playerHitboxH };

      if (this.checkCollision(pBox, e)) {
        if (p.barrierTimer > 0) {
          // Vaporize enemy
          this.destroyEnemy(e, i);
        } else if (p.invulnerableTimer === 0) {
          this.damagePlayer(25, 'ENEMY');
        }
      }
    }
  }

  private destroyEnemy(e: Enemy, index: number) {
    audio.playExplosion();
    this.spawnParticles(e.x + e.width / 2, e.y + e.height / 2, '#ef4444', 16);
    this.addScore(e.scoreValue);

    // Enemy defeat grants +10 Mana!
    this.player.mana = Math.min(this.player.maxMana, this.player.mana + 10);
    if (this.callbacks.onManaChange) {
      this.callbacks.onManaChange(Math.round(this.player.mana), this.player.maxMana);
    }

    this.floatingTexts.push({
      id: this.textIdCounter++,
      x: e.x,
      y: e.y - 10,
      text: `+${e.scoreValue}`,
      color: '#fbbf24',
      alpha: 1,
      vy: -1,
    });

    // Boss defeated
    if (e.type === 'BOSS_CORE') {
      audio.playStageClear();
      this.enemies.splice(index, 1);
      setTimeout(() => {
        this.callbacks.onStageClear(this.currentStage);
      }, 1200);
      return;
    }

    // Flying Pod drops Contra Weapon
    if (e.type === 'FLYING_POD') {
      const weapons: WeaponType[] = ['SPREAD', 'MACHINE', 'LASER', 'FIRE'];
      const chosen = weapons[Math.floor(Math.random() * weapons.length)];
      this.dropItems.push({
        id: this.dropItemIdCounter++,
        x: e.x,
        y: e.y,
        vx: 0,
        vy: -2,
        itemType: chosen,
        bounce: 0,
      });
    }

    this.enemies.splice(index, 1);
  }

  private updateDropItems() {
    const p = this.player;

    for (let i = this.dropItems.length - 1; i >= 0; i--) {
      const item = this.dropItems[i];
      item.vy += 0.4;
      item.y += item.vy;

      // Ground collision
      this.blocks.forEach(b => {
        if (this.checkCollision({ x: item.x, y: item.y, width: 24, height: 24 }, b)) {
          if (item.vy > 0) {
            item.y = b.y - 24;
            item.vy = -3; // slight bounce
            item.bounce++;
            if (item.bounce > 2) item.vy = 0;
          }
        }
      });

      // Player collects item
      if (this.checkCollision(p, { x: item.x, y: item.y, width: 24, height: 24 })) {
        if (item.itemType === 'COIN') {
          audio.playCoin();
          this.addScore(200);
          p.hp = Math.min(p.maxHp, p.hp + 15);
          p.mana = Math.min(p.maxMana, p.mana + 15);
          if (this.callbacks.onHpChange) this.callbacks.onHpChange(p.hp, p.maxHp);
          if (this.callbacks.onManaChange) this.callbacks.onManaChange(Math.round(p.mana), p.maxMana);

          this.floatingTexts.push({
            id: this.textIdCounter++,
            x: item.x,
            y: item.y - 10,
            text: '+200 COIN (+15 HP & MP)',
            color: '#fbbf24',
            alpha: 1,
            vy: -1.2,
          });
        } else if (item.itemType === '1UP') {
          audio.playPowerUp();
          p.lives++;
          p.hp = 100;
          p.mana = 100;
          if (this.callbacks.onHpChange) this.callbacks.onHpChange(100, 100);
          if (this.callbacks.onManaChange) this.callbacks.onManaChange(100, 100);
          this.callbacks.onLivesChange(p.lives);
          this.floatingTexts.push({
            id: this.textIdCounter++,
            x: item.x,
            y: item.y - 10,
            text: '+1 UP! (FULL HP/MP)',
            color: '#22c55e',
            alpha: 1,
            vy: -1.5,
          });
        } else if (item.itemType === 'BARRIER') {
          audio.playPowerUp();
          p.barrierTimer = 600; // 10 seconds of barrier
          p.mana = 100;
          if (this.callbacks.onManaChange) this.callbacks.onManaChange(100, 100);
          this.floatingTexts.push({
            id: this.textIdCounter++,
            x: item.x,
            y: item.y - 10,
            text: 'BARRIER SHIELD!',
            color: '#38bdf8',
            alpha: 1,
            vy: -1.5,
          });
        } else {
          // Contra Weapon (SPREAD, MACHINE, LASER, FIRE)
          audio.playPowerUp();
          p.weapon = item.itemType as WeaponType;
          p.mana = Math.min(p.maxMana, p.mana + 25);
          if (this.callbacks.onManaChange) this.callbacks.onManaChange(Math.round(p.mana), p.maxMana);
          this.callbacks.onWeaponChange(p.weapon);
          this.floatingTexts.push({
            id: this.textIdCounter++,
            x: item.x,
            y: item.y - 10,
            text: `${item.itemType} GUN!`,
            color: '#ef4444',
            alpha: 1,
            vy: -1.5,
          });
        }

        this.dropItems.splice(i, 1);
      }
    }
  }

  // Quiz result handler
  public handleQuizResolved(block: GameBlock, isCorrect: boolean, question: Question) {
    if (block.type === 'SEALED_GATE') {
      block.hitState = 'broken';
      audio.playMegaBomb();
      audio.playExplosion();

      // Huge multi-color explosion at the gate location
      this.spawnParticles(block.x + block.width / 2, block.y + block.height / 2, '#38bdf8', 35);
      this.spawnParticles(block.x + block.width / 2, block.y + block.height / 2, '#ef4444', 35);
      this.spawnParticles(block.x + block.width / 2, block.y + block.height / 2, '#f59e0b', 30);
      this.spawnParticles(block.x + block.width / 2, block.y + block.height / 2, '#ffffff', 20);

      this.addScore(1500);

      // Restore HP (+35) & Mana (+50) bonus
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + 35);
      this.player.mana = Math.min(this.player.maxMana, this.player.mana + 50);
      if (this.callbacks.onHpChange) this.callbacks.onHpChange(this.player.hp, this.player.maxHp);
      if (this.callbacks.onManaChange) this.callbacks.onManaChange(Math.round(this.player.mana), this.player.maxMana);

      this.floatingTexts.push({
        id: this.textIdCounter++,
        x: block.x - 20,
        y: block.y - 20,
        text: '💥 CỔNG PHONG ẤN ĐÃ NỔ TUNG! (+1500 ĐIỂM)',
        color: '#38bdf8',
        alpha: 1,
        vy: -1.6,
      });

      // Spawn drop item reward right where the gate was
      const rewards: (WeaponType | 'BARRIER' | '1UP' | 'COIN')[] = [
        'SPREAD',
        'MACHINE',
        'LASER',
        'BARRIER',
        '1UP',
      ];
      const chosen = rewards[Math.floor(Math.random() * rewards.length)];
      this.dropItems.push({
        id: this.dropItemIdCounter++,
        x: block.x + 4,
        y: block.y + block.height / 2,
        vx: 2,
        vy: -4,
        itemType: chosen,
        bounce: 0,
      });

      // Resume game
      this.isPaused = false;
      return;
    }

    // Question block resolution
    block.hitState = 'empty';

    if (isCorrect) {
      audio.playCorrect();
      this.addScore(1000);
      
      // Bonus HP (+30) and Mana (+50)
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + 30);
      this.player.mana = Math.min(this.player.maxMana, this.player.mana + 50);
      if (this.callbacks.onHpChange) this.callbacks.onHpChange(this.player.hp, this.player.maxHp);
      if (this.callbacks.onManaChange) this.callbacks.onManaChange(Math.round(this.player.mana), this.player.maxMana);

      this.floatingTexts.push({
        id: this.textIdCounter++,
        x: block.x - 10,
        y: block.y - 25,
        text: '+1000 ĐÚNG! (+30 HP, +50 MP)',
        color: '#22c55e',
        alpha: 1,
        vy: -1.5,
      });

      // Spawn awesome reward!
      const rewards: (WeaponType | 'BARRIER' | '1UP' | 'COIN')[] = [
        'SPREAD',
        'MACHINE',
        'LASER',
        'BARRIER',
        '1UP',
        'COIN',
      ];
      const chosen = rewards[Math.floor(Math.random() * rewards.length)];
      this.dropItems.push({
        id: this.dropItemIdCounter++,
        x: block.x + 4,
        y: block.y - 30,
        vx: 0,
        vy: -4,
        itemType: chosen,
        bounce: 0,
      });
      this.spawnParticles(block.x + 16, block.y, '#facc15', 12);
    } else {
      audio.playWrong();
      this.floatingTexts.push({
        id: this.textIdCounter++,
        x: block.x - 10,
        y: block.y - 25,
        text: 'SAI RỒI! CỐ LÊN!',
        color: '#f87171',
        alpha: 1,
        vy: -1.2,
      });
      // Spawn small soldier minion to test skill
      this.spawnEnemy('SOLDIER', block.x + 40, block.y);
    }

    // Resume game
    this.isPaused = false;
  }

  public damagePlayer(amount: number = 20, reason: string = 'HIT') {
    const p = this.player;
    if (p.invulnerableTimer > 0 || p.barrierTimer > 0) return;

    p.hp = Math.max(0, p.hp - amount);
    p.invulnerableTimer = 65; // ~1.1s invulnerability frames

    audio.playBump();
    this.spawnParticles(p.x + p.width / 2, p.y + p.height / 2, '#ef4444', 14);

    this.floatingTexts.push({
      id: this.textIdCounter++,
      x: p.x,
      y: p.y - 15,
      text: `-${amount} HP`,
      color: '#ef4444',
      alpha: 1,
      vy: -1.2,
    });

    if (this.callbacks.onHpChange) {
      this.callbacks.onHpChange(p.hp, p.maxHp);
    }

    if (p.hp <= 0) {
      this.handlePlayerDeath();
    }
  }

  public handlePlayerDeath() {
    audio.playExplosion();
    this.spawnParticles(this.player.x + 12, this.player.y + 16, '#dc2626', 20);
    this.player.lives--;
    this.callbacks.onLivesChange(this.player.lives);

    if (this.player.lives <= 0) {
      this.player.hp = 0;
      if (this.callbacks.onHpChange) this.callbacks.onHpChange(0, 100);
      audio.playGameOver();
      this.callbacks.onGameOver(this.player.score);
    } else {
      // Respawn player with full HP (100) and at least 50 Mana
      this.player.hp = 100;
      this.player.mana = Math.max(this.player.mana, 50);
      if (this.callbacks.onHpChange) this.callbacks.onHpChange(100, 100);
      if (this.callbacks.onManaChange) this.callbacks.onManaChange(this.player.mana, 100);
      this.player.x = Math.max(this.cameraX + 40, 60);
      this.player.y = 200;
      this.player.vx = 0;
      this.player.vy = 0;
      this.player.weapon = 'NORMAL';
      this.player.invulnerableTimer = 140; // ~2.3 seconds flash
      this.player.barrierTimer = 0;
      this.callbacks.onWeaponChange('NORMAL');
    }
  }

  private updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.03;
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  private updateFloatingTexts() {
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const t = this.floatingTexts[i];
      t.y += t.vy;
      t.alpha -= 0.02;
      if (t.alpha <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  private updateCamera() {
    // Mario-style rightward camera tracking
    const targetCameraX = this.player.x - this.canvasWidth * 0.35;
    if (targetCameraX > this.cameraX) {
      this.cameraX = Math.min(targetCameraX, this.worldWidth - this.canvasWidth);
    }
  }

  private checkCollision(
    rectA: { x: number; y: number; width: number; height: number },
    rectB: { x: number; y: number; width: number; height: number }
  ): boolean {
    return (
      rectA.x < rectB.x + rectB.width &&
      rectA.x + rectA.width > rectB.x &&
      rectA.y < rectB.y + rectB.height &&
      rectA.y + rectA.height > rectB.y
    );
  }

  public spawnParticles(x: number, y: number, color: string, count: number = 8) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3.5 + 1;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: Math.random() * 4 + 2,
        alpha: 1,
        lifetime: 30,
      });
    }
  }

  public addScore(pts: number) {
    this.player.score += pts;
    this.callbacks.onScoreChange(this.player.score);
  }
}
