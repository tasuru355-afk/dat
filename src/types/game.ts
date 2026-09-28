export type WeaponType = 'NORMAL' | 'SPREAD' | 'MACHINE' | 'LASER' | 'FIRE';

export type ManaSkillType = 'SHIELD' | 'MEGA_BOMB';

export interface WeaponInfo {
  type: WeaponType;
  name: string;
  code: string;
  color: string;
  fireRate: number; // ms between shots
  damage: number;
  bulletSpeed: number;
}

export type GameState = 'TITLE' | 'PLAYING' | 'QUIZ_PAUSED' | 'STAGE_CLEAR' | 'GAME_OVER' | 'VICTORY';

export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  isGrounded: boolean;
  facing: 'left' | 'right';
  aimAngle: 'straight' | 'up' | 'diag_up' | 'crouch';
  weapon: WeaponType;
  lives: number;
  hp: number; // 0 - 100
  maxHp: number; // 100
  mana: number; // 0 - 100
  maxMana: number; // 100
  activeManaSkill: ManaSkillType;
  score: number;
  invulnerableTimer: number; // frames
  barrierTimer: number; // frames of barrier shield 'B'
  isShooting: boolean;
  isCrouching: boolean;
  walkFrame: number;
}

export interface Bullet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  color: string;
  isPlayer: boolean;
  isLaser?: boolean;
  isMegaBomb?: boolean;
  explosionRadius?: number;
  pierceCount?: number;
  lifetime: number;
}

export type BlockType = 'GROUND' | 'BRICK' | 'QUESTION' | 'PIPE_TOP' | 'PIPE_BODY' | 'METAL' | 'FLAGPOLE' | 'SEALED_GATE';

export interface GameBlock {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: BlockType;
  hitState?: 'idle' | 'bumped' | 'empty' | 'broken';
  bumpOffsetY?: number;
  questionId?: string;
  containsItem?: 'COIN' | 'WEAPON' | '1UP' | 'BARRIER';
  gateLabel?: string;
  gateNumber?: number;
}

export type EnemyType = 
  | 'SOLDIER' // runs towards player
  | 'SNIPER' // stands on ledge, shoots
  | 'PIRANHA_TURRET' // pops out of pipe
  | 'FLYING_POD' // Contra item pod floating across screen
  | 'BOSS_CORE'; // Stage end boss

export interface Enemy {
  id: number;
  type: EnemyType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  facing: 'left' | 'right';
  shootCooldown: number;
  stateTimer: number;
  isGrounded?: boolean;
  isActive: boolean;
  scoreValue: number;
  bossPhase?: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  lifetime: number;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  vy: number;
}

export interface DropItem {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  itemType: WeaponType | 'BARRIER' | '1UP' | 'COIN';
  bounce: number;
}

export interface LevelConfig {
  stageNumber: number;
  title: string;
  theme: 'jungle' | 'base' | 'alien';
  worldWidth: number;
  description: string;
}
