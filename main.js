import * as THREE from 'three';

/* ============================================================
   常量
============================================================ */
const COIN_PER_KILL = 75;
const START_COINS = 500;
const SAVE_KEY = 'arena_save_v1';

const ADS_FOV_BY_CLASS = {
  rifle: 52, carbine: 55, smg: 58, sniper: 22,
  pistol: 62, shotgun: 65, lmg: 50,
};
const ADS_SENS_MULT = 0.45;
const ADS_SPREAD_MULT = 0.35;
const ADS_MOVE_MULT = 0.65;

const CROUCH_EYE_DROP = 0.55;
const CROUCH_MOVE_MUL = 0.5;
const CROUCH_SPREAD_MUL = 0.65;
const CROUCH_SPEED_LERP = 10;

const RECOIL_DECAY = 11;
const HEADSHOT_BONUS = 1.4;

/* 机器人名字池 */
const BOT_NAME_POOL = [
  '影子', '闪电', '幽灵', '猎鹰', '夜狼', '火龙', '狂风', '铁血',
  '修罗', '烈阳', '赤瞳', '疾风', '冷月', '幻影', '银翼', '黑鸦',
  '狂刀', '死神', '雷霆', '风暴', '破军', '孤狼', '寒霜', '流星',
];

/* ============================================================
   武器分类
============================================================ */
const WEAPON_CLASSES = [
  { id: 'rifle',   name: '步枪',   accent: '#7ff0d0' },
  { id: 'carbine', name: '卡宾枪', accent: '#aa88ff' },
  { id: 'smg',     name: '冲锋枪', accent: '#ff88cc' },
  { id: 'sniper',  name: '狙击枪', accent: '#66aaff' },
  { id: 'pistol',  name: '手枪',   accent: '#ffcc55' },
  { id: 'shotgun', name: '霰弹枪', accent: '#ff7744' },
  { id: 'lmg',     name: '机枪',   accent: '#ff5555' },
];

/* ============================================================
   武器数据
============================================================ */
const WEAPONS = {
  ak47: { class: 'rifle', name: 'AK-47', desc: '高伤害高后坐力的经典突击步枪',
    damage: 33, fireRate: 0.10, magSize: 30, reloadTime: 2.4,
    headMult: 2.5, auto: true, pellets: 1, spread: 0.011, recoil: 0.009 },
  m4a1: { class: 'rifle', name: 'M4A1', desc: '精准稳定的美制突击步枪',
    damage: 27, fireRate: 0.088, magSize: 30, reloadTime: 2.1,
    headMult: 2.2, auto: true, pellets: 1, spread: 0.007, recoil: 0.005 },
  scar: { class: 'rifle', name: 'SCAR-H', desc: '重型战斗步枪，慢而致命',
    damage: 38, fireRate: 0.13, magSize: 20, reloadTime: 2.6,
    headMult: 2.3, auto: true, pellets: 1, spread: 0.006, recoil: 0.011 },

  m4: { class: 'carbine', name: 'M4卡宾', desc: '轻量高射速，走位利索',
    damage: 18, fireRate: 0.062, magSize: 30, reloadTime: 1.6,
    headMult: 2.0, auto: true, pellets: 1, spread: 0.013, recoil: 0.0035 },
  aug: { class: 'carbine', name: 'AUG', desc: '带倍镜的紧凑步枪',
    damage: 22, fireRate: 0.075, magSize: 30, reloadTime: 1.9,
    headMult: 2.2, auto: true, pellets: 1, spread: 0.008, recoil: 0.005 },
  sg553: { class: 'carbine', name: 'SG553', desc: '瑞士精准卡宾枪',
    damage: 25, fireRate: 0.085, magSize: 25, reloadTime: 1.8,
    headMult: 2.4, auto: true, pellets: 1, spread: 0.006, recoil: 0.007 },

  mp5: { class: 'smg', name: 'MP5', desc: '经典冲锋枪，稳定精准',
    damage: 15, fireRate: 0.062, magSize: 30, reloadTime: 1.7,
    headMult: 2.0, auto: true, pellets: 1, spread: 0.014, recoil: 0.004 },
  p90: { class: 'smg', name: 'P90', desc: '高容量高射速，泼水利器',
    damage: 12, fireRate: 0.055, magSize: 50, reloadTime: 2.3,
    headMult: 1.8, auto: true, pellets: 1, spread: 0.018, recoil: 0.003 },
  uzi: { class: 'smg', name: 'UZI', desc: '超快射速，近距离压制',
    damage: 11, fireRate: 0.045, magSize: 25, reloadTime: 1.6,
    headMult: 1.9, auto: true, pellets: 1, spread: 0.020, recoil: 0.0045 },

  awp: { class: 'sniper', name: 'AWP', desc: '一击必杀，栓动慢速',
    damage: 120, fireRate: 1.45, magSize: 5, reloadTime: 3.0,
    headMult: 1.8, auto: false, pellets: 1, spread: 0.0002, recoil: 0.06 },
  m24: { class: 'sniper', name: 'M24', desc: '轻量狙击枪，机动性稍好',
    damage: 95, fireRate: 1.15, magSize: 5, reloadTime: 2.6,
    headMult: 2.0, auto: false, pellets: 1, spread: 0.0004, recoil: 0.05 },
  barrett: { class: 'sniper', name: '巴雷特', desc: '重型反器材，震撼后坐',
    damage: 180, fireRate: 2.0, magSize: 5, reloadTime: 3.4,
    headMult: 1.5, auto: false, pellets: 1, spread: 0.0003, recoil: 0.09 },

  glock: { class: 'pistol', name: '格洛克', desc: '轻便可靠，17 发半自动',
    damage: 20, fireRate: 0.14, magSize: 17, reloadTime: 1.1,
    headMult: 2.2, auto: false, pellets: 1, spread: 0.005, recoil: 0.012 },
  deagle: { class: 'pistol', name: '沙漠之鹰', desc: '一枪爆头的手炮',
    damage: 55, fireRate: 0.32, magSize: 7, reloadTime: 1.6,
    headMult: 3.0, auto: false, pellets: 1, spread: 0.004, recoil: 0.032 },
  usp: { class: 'pistol', name: 'USP', desc: '精准消音手枪',
    damage: 24, fireRate: 0.16, magSize: 12, reloadTime: 1.2,
    headMult: 2.6, auto: false, pellets: 1, spread: 0.003, recoil: 0.014 },

  m870: { class: 'shotgun', name: 'M870', desc: '经典泵动霰弹枪',
    damage: 12, fireRate: 0.85, magSize: 6, reloadTime: 2.4,
    headMult: 1.6, auto: false, pellets: 9, spread: 0.09, recoil: 0.045 },
  spas12: { class: 'shotgun', name: 'SPAS-12', desc: '半自动战斗霰弹枪',
    damage: 9, fireRate: 0.5, magSize: 8, reloadTime: 2.8,
    headMult: 1.5, auto: false, pellets: 9, spread: 0.10, recoil: 0.04 },
  doubleBarrel: { class: 'shotgun', name: '双管猎枪', desc: '两发，近距离几乎无解',
    damage: 18, fireRate: 0.25, magSize: 2, reloadTime: 2.0,
    headMult: 1.6, auto: false, pellets: 12, spread: 0.11, recoil: 0.06 },
  aa12: { class: 'shotgun', name: 'AA12', desc: '全自动霰弹枪，弹雨压制',
    damage: 8, fireRate: 0.22, magSize: 8, reloadTime: 2.8,
    headMult: 1.5, auto: true, pellets: 8, spread: 0.095, recoil: 0.038 },

  m249: { class: 'lmg', name: 'M249', desc: '弹链供弹，100 发泼水',
    damage: 28, fireRate: 0.08, magSize: 100, reloadTime: 5.5,
    headMult: 1.9, auto: true, pellets: 1, spread: 0.016, recoil: 0.008 },
  pkm: { class: 'lmg', name: 'PKM', desc: '重型通用机枪，火力压制',
    damage: 36, fireRate: 0.095, magSize: 100, reloadTime: 6.2,
    headMult: 1.9, auto: true, pellets: 1, spread: 0.014, recoil: 0.010 },
  negev: { class: 'lmg', name: 'Negev', desc: '超高射速机枪，前期精准度极差',
    damage: 22, fireRate: 0.06, magSize: 150, reloadTime: 7.0,
    headMult: 1.8, auto: true, pellets: 1, spread: 0.028, recoil: 0.011 },
};

/* ============================================================
   改装配件
============================================================ */
const ATTACHMENTS = {
  optic: {
    name: '瞄准镜',
    items: {
      none:   { name: '机瞄',  desc: '默认',                price: 0,   mods: {} },
      reddot: { name: '红点',  desc: '散布 -45%',           price: 400, mods: { spread: 0.55 } },
      holo:   { name: '全息',  desc: '散布 -50% 后坐 -15%', price: 900, mods: { spread: 0.50, recoil: 0.85 } },
    },
  },
  laser: {
    name: '激光',
    items: {
      none:  { name: '无',        desc: '',                   price: 0,   mods: {} },
      red:   { name: '红色镭射',  desc: '散布 -22%',          price: 500, mods: { spread: 0.78 }, color: 0xff3344, cssColor: '#ff3344' },
      green: { name: '绿色镭射',  desc: '散布 -28% 后坐 -7%', price: 700, mods: { spread: 0.72, recoil: 0.93 }, color: 0x44ff66, cssColor: '#44ff66' },
    },
  },
  muzzle: {
    name: '枪口',
    items: {
      none:         { name: '无',       desc: '',                    price: 0,   mods: {} },
      flashhider:   { name: '消焰器',   desc: '后坐 -10%',            price: 350, mods: { recoil: 0.90 } },
      compensator:  { name: '补偿器',   desc: '后坐 -22% 散布 +10%',  price: 700, mods: { recoil: 0.78, spread: 1.10 } },
      suppressor:   { name: '消音器',   desc: '散布 -12% 伤害 -6%',   price: 850, mods: { spread: 0.88, damageMul: 0.94 } },
    },
  },
  grip: {
    name: '握把',
    items: {
      none:     { name: '无',       desc: '',                    price: 0,   mods: {} },
      vertical: { name: '垂直握把', desc: '后坐 -15%',            price: 400, mods: { recoil: 0.85 } },
      angled:   { name: '角度握把', desc: '后坐 -10% 换弹 -12%', price: 450, mods: { recoil: 0.90, reloadMul: 0.88 } },
    },
  },
  magazine: {
    name: '弹匣',
    items: {
      none:     { name: '标准弹匣', desc: '',                       price: 0,    mods: {} },
      extended: { name: '扩容弹匣', desc: '容量 +50% 换弹 +15%',     price: 600,  mods: { magMul: 1.5, reloadMul: 1.15 } },
      fast:     { name: '快速弹匣', desc: '换弹 -25%',               price: 650,  mods: { reloadMul: 0.75 } },
      drum:     { name: '弹鼓',     desc: '容量 +120% 换弹 +40%',   price: 1200, mods: { magMul: 2.2, reloadMul: 1.4 } },
    },
  },
  stock: {
    name: '枪托',
    items: {
      none:  { name: '无',       desc: '',                  price: 0,   mods: {} },
      heavy: { name: '重型枪托', desc: '后坐 -28% 移速 -8%', price: 600, mods: { recoil: 0.72, moveMul: 0.92 } },
      light: { name: '轻型枪托', desc: '移速 +7% 后坐 +12%', price: 500, mods: { recoil: 1.12, moveMul: 1.07 } },
    },
  },
};

/* ============================================================
   地图数据
============================================================ */
const MAP_DEFS = {
  arena: {
    name: '竞技场', desc: '对称开阔 · 中远距离', accent: '#7ff0d0',
    sky: 0x0a0d13, fog: 0x0a0d13, fogNear: 42, fogFar: 92,
    floor: 0x171d28, gridA: 0x2c3a52, gridB: 0x1b2433,
    wall: 0x212a3a, box: 0x2a3448,
    ambient: { sky: 0x88bbff, ground: 0x1a2030, intensity: 0.75 },
    sun: { color: 0xffffff, intensity: 1.1 },
    decor: [
      { type: 'pillar', x: -28, z: -28, r: 0.5, h: 8, color: 0x2c3a52, emissive: 0x2cffd0 },
      { type: 'pillar', x:  28, z: -28, r: 0.5, h: 8, color: 0x2c3a52, emissive: 0x2cffd0 },
      { type: 'pillar', x: -28, z:  28, r: 0.5, h: 8, color: 0x2c3a52, emissive: 0x2cffd0 },
      { type: 'pillar', x:  28, z:  28, r: 0.5, h: 8, color: 0x2c3a52, emissive: 0x2cffd0 },
      { type: 'orb', x: 0, y: 9, z: 0, r: 0.6, color: 0x2cffd0, emissive: 0x2cffd0 },
    ],
    boxes: [
      { x: 0, z: 0, w: 6, h: 2.5, d: 6 },
      { x: 13, z: -9, w: 4, h: 3.2, d: 4 },
      { x: -15, z: 11, w: 5, h: 2.0, d: 5 },
      { x: 18, z: 15, w: 4, h: 3.6, d: 4 },
      { x: -19, z: -17, w: 6, h: 2.6, d: 6 },
      { x: 9, z: 21, w: 3, h: 4.2, d: 3 },
      { x: -9, z: -23, w: 7, h: 2.0, d: 3 },
      { x: 23, z: -3, w: 3, h: 5.0, d: 8 },
      { x: -25, z: 5, w: 3, h: 5.0, d: 8 },
      { x: 6, z: -14, w: 4, h: 1.6, d: 4 },
      { x: -12, z: -4, w: 4, h: 1.6, d: 4 },
    ],
  },

  dock: {
    name: '集装箱码头', desc: '集装箱群 · 近距离遭遇', accent: '#ff9944',
    sky: 0x2a1810, fog: 0x2a1810, fogNear: 38, fogFar: 85,
    floor: 0x2a2722, gridA: 0x453d33, gridB: 0x2f2921,
    wall: 0x3a332a, box: 0x2e2a24,
    ambient: { sky: 0xffaa66, ground: 0x2a1810, intensity: 0.85 },
    sun: { color: 0xffcc88, intensity: 1.25 },
    decor: [
      { type: 'pillar', x: -28, z: 0, r: 0.8, h: 12, color: 0x3a332a, emissive: 0xff6622 },
      { type: 'pillar', x:  28, z: 0, r: 0.8, h: 12, color: 0x3a332a, emissive: 0xff6622 },
      { type: 'orb', x: -28, y: 13, z: 0, r: 0.5, color: 0xff8833, emissive: 0xff8833 },
      { type: 'orb', x:  28, y: 13, z: 0, r: 0.5, color: 0xff8833, emissive: 0xff8833 },
    ],
    boxes: [
      { x: -18, z: -12, w: 10, h: 2.8, d: 3.2, c: 0xc4572a },
      { x: 18, z: 12, w: 10, h: 2.8, d: 3.2, c: 0x2a7a8c },
      { x: -18, z: 12, w: 10, h: 2.8, d: 3.2, c: 0x8c6b2a },
      { x: 18, z: -12, w: 10, h: 2.8, d: 3.2, c: 0x8c2a3a },
      { x: -10, z: 0, w: 3.2, h: 2.8, d: 14, c: 0xc4572a },
      { x: 10, z: 0, w: 3.2, h: 2.8, d: 14, c: 0x2a7a8c },
      { x: 0, z: -8, w: 8, h: 5.6, d: 3.2, c: 0x2a7a8c },
      { x: 0, z: 8, w: 8, h: 5.6, d: 3.2, c: 0x8c6b2a },
      { x: -23, z: -22, w: 4, h: 2.8, d: 4, c: 0x8c2a3a },
      { x: 23, z: 22, w: 4, h: 2.8, d: 4, c: 0xc4572a },
      { x: 23, z: -22, w: 4, h: 2.8, d: 4, c: 0x2a7a8c },
      { x: -23, z: 22, w: 4, h: 2.8, d: 4, c: 0x8c6b2a },
    ],
  },

  town: {
    name: '沙漠小镇', desc: '房屋街道 · 巷战', accent: '#e8a866',
    sky: 0x2a1e10, fog: 0x3a2818, fogNear: 32, fogFar: 80,
    floor: 0x3a2e20, gridA: 0x554630, gridB: 0x3d3222,
    wall: 0x5c4a32, box: 0x6b563a,
    ambient: { sky: 0xffddaa, ground: 0x2a1e10, intensity: 0.85 },
    sun: { color: 0xffe0a0, intensity: 1.35 },
    decor: [
      { type: 'pillar', x: -28, z: -28, r: 0.4, h: 10, color: 0x4a3820, emissive: 0xffaa44 },
      { type: 'pillar', x:  28, z: -28, r: 0.4, h: 10, color: 0x4a3820, emissive: 0xffaa44 },
      { type: 'pillar', x: -28, z:  28, r: 0.4, h: 10, color: 0x4a3820, emissive: 0xffaa44 },
      { type: 'pillar', x:  28, z:  28, r: 0.4, h: 10, color: 0x4a3820, emissive: 0xffaa44 },
    ],
    boxes: [
      { x: 0, z: 0, w: 4, h: 4.5, d: 4, c: 0x5c4a32 },
      { x: -20, z: -20, w: 8, h: 4, d: 8, c: 0x7a5f3d },
      { x: -14, z: -20, w: 2, h: 3, d: 4, c: 0x6b563a },
      { x: 20, z: -20, w: 8, h: 4, d: 8, c: 0x7a5f3d },
      { x: 14, z: -20, w: 2, h: 3, d: 4, c: 0x6b563a },
      { x: -20, z: 20, w: 8, h: 4, d: 8, c: 0x7a5f3d },
      { x: -20, z: 14, w: 4, h: 3, d: 2, c: 0x6b563a },
      { x: 20, z: 20, w: 8, h: 4, d: 8, c: 0x7a5f3d },
      { x: 20, z: 14, w: 4, h: 3, d: 2, c: 0x6b563a },
      { x: -8, z: 0, w: 3, h: 1.5, d: 6, c: 0x6b563a },
      { x: 8, z: 0, w: 3, h: 1.5, d: 6, c: 0x6b563a },
      { x: 0, z: -8, w: 6, h: 1.5, d: 3, c: 0x6b563a },
      { x: 0, z: 8, w: 6, h: 1.5, d: 3, c: 0x6b563a },
      { x: -12, z: 9, w: 2, h: 1.2, d: 2, c: 0x8a6f4d },
      { x: 12, z: -9, w: 2, h: 1.2, d: 2, c: 0x8a6f4d },
      { x: -12, z: -9, w: 2, h: 1.2, d: 2, c: 0x8a6f4d },
      { x: 12, z: 9, w: 2, h: 1.2, d: 2, c: 0x8a6f4d },
    ],
  },

  base: {
    name: '雪地基地', desc: '工业建筑 · 高低差', accent: '#88ddff',
    sky: 0x18222c, fog: 0x9ab0c4, fogNear: 30, fogFar: 75,
    floor: 0xc8d4dc, gridA: 0x8a9aae, gridB: 0x7a8a9e,
    wall: 0x3a4654, box: 0x4a5666,
    ambient: { sky: 0xbbddff, ground: 0x8a9aa8, intensity: 1.0 },
    sun: { color: 0xddeeff, intensity: 1.15 },
    decor: [
      { type: 'pillar', x: -28, z: 0, r: 0.5, h: 12, color: 0x3a4654, emissive: 0x4488ff },
      { type: 'pillar', x:  28, z: 0, r: 0.5, h: 12, color: 0x3a4654, emissive: 0x4488ff },
      { type: 'orb', x: -28, y: 13, z: 0, r: 0.4, color: 0x66aaff, emissive: 0x66aaff },
      { type: 'orb', x:  28, y: 13, z: 0, r: 0.4, color: 0x66aaff, emissive: 0x66aaff },
    ],
    boxes: [
      { x: 0, z: -22, w: 22, h: 6, d: 6, c: 0x3a4654 },
      { x: 0, z: -17, w: 26, h: 0.8, d: 4, c: 0x4a5666 },
      { x: -22, z: 4, w: 6, h: 5, d: 18, c: 0x3a4654 },
      { x: 22, z: 4, w: 6, h: 5, d: 18, c: 0x3a4654 },
      { x: 0, z: 4, w: 6, h: 2.5, d: 6, c: 0x4a5666 },
      { x: -12, z: 18, w: 8, h: 3, d: 4, c: 0x4a5666 },
      { x: 12, z: 18, w: 8, h: 3, d: 4, c: 0x4a5666 },
      { x: 10, z: -8, w: 3, h: 1.5, d: 3, c: 0xccd8e0 },
      { x: -10, z: -8, w: 3, h: 1.5, d: 3, c: 0xccd8e0 },
      { x: -16, z: -12, w: 12, h: 1.2, d: 1.4, c: 0x5a6878 },
      { x: 16, z: -12, w: 12, h: 1.2, d: 1.4, c: 0x5a6878 },
    ],
  },
};

/* ============================================================
   通用配置
============================================================ */
const CFG = {
  arena: 30,
  moveSpeed: 8,
  sprintMul: 1.55,
  jumpSpeed: 7.5,
  gravity: 22,
  eyeHeight: 1.55,
  radius: 0.45,
  sensitivity: 0.0022,
  botCount: 5,
  botHealth: 100,
  botSpeed: 4.2,
  botDamage: 7,
  botRespawn: 3,
  losInterval: 8,
};

const isLowEnd = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

/* ============================================================
   DOM
============================================================ */
const canvas       = document.getElementById('game');
const hud          = document.getElementById('hud');
const overlay      = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlaySub   = document.getElementById('overlaySub');
const startBtn     = document.getElementById('startBtn');
const mapGrid      = document.getElementById('mapGrid');
const classTabs    = document.getElementById('classTabs');
const weaponGrid   = document.getElementById('weaponGrid');
const attachmentsPanel = document.getElementById('attachmentsPanel');
const attachBadges = document.getElementById('attachBadges');
const healthFill   = document.getElementById('healthFill');
const healthNum    = document.getElementById('healthNum');
const ammoNum      = document.getElementById('ammoNum');
const ammoMaxEl    = document.getElementById('ammoMax');
const weaponNameEl = document.getElementById('weaponName');
const killsEl      = document.getElementById('kills');
const deathsEl     = document.getElementById('deaths');
const killFeed     = document.getElementById('killFeed');
const hitmarker    = document.getElementById('hitmarker');
const reloadHint   = document.getElementById('reloadHint');
const vignette     = document.getElementById('damageVignette');
const coinsDisplay = document.getElementById('coinsDisplay');
const coinsHud     = document.getElementById('coinsHud');
const crosshairEl  = document.getElementById('crosshair');
const adsHint      = document.getElementById('adsHint');
const playerNameInput = document.getElementById('playerNameInput');

/* 更新大厅底部按键提示 */
(function updateHint() {
  const el = document.querySelector('.hint');
  if (!el) return;
  el.innerHTML = [
    '<kbd>WASD</kbd> 移动',
    '<kbd>Shift</kbd> 冲刺',
    '<kbd>Ctrl</kbd> 蹲下',
    '<kbd>Space</kbd> 跳跃',
    '<kbd>左键</kbd> 射击',
    '<kbd>右键</kbd> 开镜',
    '<kbd>滚轮</kbd>/<kbd>Q</kbd> 切枪',
    '<kbd>R</kbd> 换弹',
    '<kbd>Esc</kbd> 大厅'
  ].join(' · ');
})();

/* ============================================================
   渲染器
============================================================ */
const renderer = new THREE.WebGLRenderer({
  canvas, antialias: false, powerPreference: 'high-performance',
  stencil: false, alpha: false,
});
renderer.setPixelRatio(1);
renderer.setSize(innerWidth, innerHeight, false);
renderer.shadowMap.enabled = !isLowEnd;
renderer.shadowMap.type = THREE.PCFShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0d13);
scene.fog = new THREE.Fog(0x0a0d13, 48, 98);

const camera = new THREE.PerspectiveCamera(78, innerWidth / innerHeight, 0.1, 300);
camera.rotation.order = 'YXZ';

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight, false);
});

/* ============================================================
   灯光
============================================================ */
let hemiLight = null;
let sunLight = null;

function setupLighting(def) {
  if (hemiLight) scene.remove(hemiLight);
  if (sunLight) scene.remove(sunLight);

  hemiLight = new THREE.HemisphereLight(
    def.ambient.sky, def.ambient.ground, def.ambient.intensity
  );
  scene.add(hemiLight);

  sunLight = new THREE.DirectionalLight(def.sun.color, def.sun.intensity);
  sunLight.position.set(22, 42, 16);
  sunLight.castShadow = !isLowEnd;
  sunLight.shadow.mapSize.set(1024, 1024);
  sunLight.shadow.camera.left = -40;
  sunLight.shadow.camera.right = 40;
  sunLight.shadow.camera.top = 40;
  sunLight.shadow.camera.bottom = -40;
  sunLight.shadow.camera.near = 1;
  sunLight.shadow.camera.far = 110;
  sunLight.shadow.bias = -0.001;
  scene.add(sunLight);
}

/* ============================================================
   世界管理
============================================================ */
const worldMeshes = [];
const extraMeshes = [];
const obstacles = [];

function disposeObj(m) {
  scene.remove(m);
  if (m.geometry) m.geometry.dispose();
  if (m.material) {
    if (Array.isArray(m.material)) m.material.forEach((x) => x.dispose());
    else m.material.dispose();
  }
}

function clearWorld() {
  worldMeshes.forEach(disposeObj);
  extraMeshes.forEach(disposeObj);
  worldMeshes.length = 0;
  extraMeshes.length = 0;
  obstacles.length = 0;
}

function buildMap(mapId) {
  clearWorld();
  const def = MAP_DEFS[mapId];
  if (!def) return;

  const S = CFG.arena;

  scene.background = new THREE.Color(def.sky);
  scene.fog = new THREE.Fog(def.fog, def.fogNear, def.fogFar);

  setupLighting(def);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(S * 2, S * 2),
    new THREE.MeshStandardMaterial({ color: def.floor, roughness: 0.95, metalness: 0.05 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = !isLowEnd;
  scene.add(floor);
  worldMeshes.push(floor);

  const grid = new THREE.GridHelper(S * 2, 40, def.gridA, def.gridB);
  grid.position.y = 0.012;
  scene.add(grid);
  extraMeshes.push(grid);

  const H = 6, T = 1;
  const wallMat = new THREE.MeshStandardMaterial({ color: def.wall, roughness: 0.85, metalness: 0.1 });
  const wallDefs = [
    { x: 0,  z: -S, w: S * 2 + T * 2, d: T },
    { x: 0,  z:  S, w: S * 2 + T * 2, d: T },
    { x: -S, z: 0,  w: T, d: S * 2 + T * 2 },
    { x:  S, z: 0,  w: T, d: S * 2 + T * 2 },
  ];
  for (const w of wallDefs) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w.w, H, w.d), wallMat);
    m.position.set(w.x, H / 2, w.z);
    m.castShadow = !isLowEnd;
    m.receiveShadow = !isLowEnd;
    scene.add(m);
    worldMeshes.push(m);
  }

  for (const b of def.boxes) {
    const color = b.c !== undefined ? b.c : def.box;
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0.2 });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d), mat);
    mesh.position.set(b.x, b.h / 2, b.z);
    mesh.castShadow = !isLowEnd;
    mesh.receiveShadow = !isLowEnd;
    scene.add(mesh);
    worldMeshes.push(mesh);

    obstacles.push({
      minX: b.x - b.w / 2, maxX: b.x + b.w / 2,
      minZ: b.z - b.d / 2, maxZ: b.z + b.d / 2,
      height: b.h,
    });
  }

  for (const d of def.decor) {
    if (d.type === 'pillar') {
      const mat = new THREE.MeshStandardMaterial({
        color: d.color, roughness: 0.7, metalness: 0.4,
        emissive: d.emissive, emissiveIntensity: 0.6,
      });
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(d.r, d.r, d.h, 8), mat);
      mesh.position.set(d.x, d.h / 2, d.z);
      mesh.castShadow = !isLowEnd;
      scene.add(mesh);
      worldMeshes.push(mesh);
      obstacles.push({
        minX: d.x - d.r, maxX: d.x + d.r,
        minZ: d.z - d.r, maxZ: d.z + d.r,
        height: d.h,
      });
    } else if (d.type === 'orb') {
      const mat = new THREE.MeshStandardMaterial({
        color: d.color, emissive: d.emissive, emissiveIntensity: 1.3,
        roughness: 0.3, metalness: 0.3,
      });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(d.r, 12, 10), mat);
      mesh.position.set(d.x, d.y, d.z);
      scene.add(mesh);
      extraMeshes.push(mesh);
    }
  }
}

/* ============================================================
   头顶名字（Sprite）
============================================================ */
function makeNameSprite(text, colorCss) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.font = 'bold 56px "Microsoft YaHei", "PingFang SC", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // 描边
  ctx.lineWidth = 10;
  ctx.strokeStyle = 'rgba(0,0,0,0.85)';
  ctx.strokeText(text, 256, 64);

  // 填充
  ctx.fillStyle = colorCss || '#ffffff';
  ctx.fillText(text, 256, 64);

  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 1;

  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(2.2, 0.55, 1);
  sprite.position.set(0, 2.15, 0);
  sprite.renderOrder = 999;
  return sprite;
}

function setSpriteText(sprite, text, colorCss) {
  const canvas = sprite.material.map.image;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 56px "Microsoft YaHei", "PingFang SC", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 10;
  ctx.strokeStyle = 'rgba(0,0,0,0.85)';
  ctx.strokeText(text, 256, 64);
  ctx.fillStyle = colorCss || '#ffffff';
  ctx.fillText(text, 256, 64);
  sprite.material.map.needsUpdate = true;
}

/* ============================================================
   存档
============================================================ */
const unlockedAttachments = new Set();

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (typeof data.coins === 'number') player.coins = data.coins;
    if (Array.isArray(data.unlocked)) {
      unlockedAttachments.clear();
      for (const k of data.unlocked) unlockedAttachments.add(k);
    }
  } catch (e) {}
}

function persistSave() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      coins: player.coins,
      unlocked: Array.from(unlockedAttachments),
    }));
  } catch (e) {}
}

function isUnlocked(slotId, itemId) {
  if (itemId === 'none') return true;
  return unlockedAttachments.has(slotId + ':' + itemId);
}

/* ============================================================
   状态
============================================================ */
const player = {
  name: '玩家001',
  pos: new THREE.Vector3(0, 0, 18),
  vel: new THREE.Vector3(),
  yaw: 0, pitch: 0, onGround: true,
  health: 100, maxHealth: 100,
  weaponId: 'ak47',
  lastWeaponId: null,
  ammo: 30,
  reloading: false, reloadTimer: 0, lastShot: -999,
  kills: 0, deaths: 0,
  dead: false, respawnTimer: 0,
  coins: START_COINS,
  adsHeld: false,
  crouching: false,
  crouchAmount: 0,
  visRecoilPitch: 0,
  visRecoilYaw: 0,
};

let currentMapId = 'arena';
let selectedMapId = 'arena';
let selectedClassId = 'rifle';
let currentWeaponStats = null;

const attachmentsByWeapon = {};
function getAttachState(weaponId) {
  if (!attachmentsByWeapon[weaponId]) {
    const state = {};
    for (const slot of Object.keys(ATTACHMENTS)) state[slot] = 'none';
    attachmentsByWeapon[weaponId] = state;
  }
  return attachmentsByWeapon[weaponId];
}

function getWeaponWithAttachments(weaponId) {
  const base = WEAPONS[weaponId];
  const att = getAttachState(weaponId);

  let spread = base.spread, recoil = base.recoil;
  let reloadTime = base.reloadTime, moveMul = 1;
  let magSize = base.magSize, damage = base.damage;

  for (const slot of Object.keys(ATTACHMENTS)) {
    const item = ATTACHMENTS[slot].items[att[slot] || 'none'];
    if (!item || !item.mods) continue;
    const m = item.mods;
    if (m.spread)    spread *= m.spread;
    if (m.recoil)    recoil *= m.recoil;
    if (m.reloadMul) reloadTime *= m.reloadMul;
    if (m.moveMul)   moveMul *= m.moveMul;
    if (m.magMul)    magSize = Math.round(magSize * m.magMul);
    if (m.damageMul) damage *= m.damageMul;
  }

  return Object.assign({}, base, {
    spread, recoil, reloadTime, moveMul, magSize, damage,
  });
}

function refreshWeaponStats() {
  currentWeaponStats = getWeaponWithAttachments(player.weaponId);
}

loadSave();

/* 加载名字（存在 localStorage 里方便） */
(function loadName() {
  try {
    const saved = localStorage.getItem('arena_player_name');
    if (saved) player.name = saved;
  } catch (e) {}
  if (playerNameInput) playerNameInput.value = player.name;
})();

/* ============================================================
   激光
============================================================ */
const laserGeom = new THREE.BufferGeometry();
laserGeom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
const laserMat = new THREE.LineBasicMaterial({ color: 0xff3344, transparent: true, opacity: 0.85 });
const laserLine = new THREE.Line(laserGeom, laserMat);
laserLine.frustumCulled = false;
laserLine.visible = false;
scene.add(laserLine);

const _laserDir = new THREE.Vector3();
const _muzzleWorld = new THREE.Vector3();
const _muzzleLocalHip = new THREE.Vector3(0.28, -0.22, 0.55);
const _muzzleLocalAds = new THREE.Vector3(0.06, -0.05, 0.5);

function updateLaser() {
  const state = getAttachState(player.weaponId);
  const item = ATTACHMENTS.laser.items[state.laser];

  if (!running || !item.color) {
    laserLine.visible = false;
    return;
  }
  laserLine.visible = true;
  laserMat.color.setHex(item.color);

  camera.getWorldDirection(_laserDir);
  raycaster.set(camera.position, _laserDir);
  raycaster.far = 120;

  const targets = [];
  for (const b of bots) if (b.alive) { targets.push(b.head); targets.push(b.body); }
  for (const m of worldMeshes) targets.push(m);

  const hits = raycaster.intersectObjects(targets, false);
  let end;
  if (hits.length > 0) end = hits[0].point;
  else end = _laserDir.clone().multiplyScalar(120).add(camera.position);

  const localOffset = player.adsHeld ? _muzzleLocalAds : _muzzleLocalHip;
  _muzzleWorld.copy(localOffset).applyMatrix4(camera.matrixWorld);

  const pos = laserGeom.attributes.position.array;
  pos[0] = _muzzleWorld.x; pos[1] = _muzzleWorld.y; pos[2] = _muzzleWorld.z;
  pos[3] = end.x; pos[4] = end.y; pos[5] = end.z;
  laserGeom.attributes.position.needsUpdate = true;
  laserGeom.computeBoundingSphere();
}

/* ============================================================
   输入
============================================================ */
const keys = {};
let mouseDown = false;
let mouseWasDown = false;
let running = false;
let elapsed = 0;

addEventListener('keydown', (e) => {
  keys[e.code] = true;

  if (e.code === 'KeyR') startReload();
  if (e.code === 'KeyQ' && running && player.lastWeaponId) {
    switchWeapon(player.lastWeaponId);
  }
  if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
    player.crouching = true;
  }
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
    e.preventDefault();
  }
});
addEventListener('keyup', (e) => {
  keys[e.code] = false;
  if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
    player.crouching = false;
  }
});

addEventListener('mousedown', (e) => {
  if (!running) return;
  if (document.pointerLockElement !== canvas) return;
  if (e.button === 0) mouseDown = true;
  if (e.button === 2) player.adsHeld = true;
});
addEventListener('mouseup', (e) => {
  if (e.button === 0) mouseDown = false;
  if (e.button === 2) player.adsHeld = false;
});
addEventListener('contextmenu', (e) => e.preventDefault());

addEventListener('wheel', (e) => {
  if (!running) return;
  if (document.pointerLockElement !== canvas) return;
  cycleWeaponInClass(e.deltaY > 0 ? 1 : -1);
}, { passive: true });

canvas.addEventListener('mousemove', (e) => {
  if (document.pointerLockElement !== canvas) return;
  const sensMult = player.adsHeld ? ADS_SENS_MULT : 1;
  player.yaw   -= e.movementX * CFG.sensitivity * sensMult;
  player.pitch -= e.movementY * CFG.sensitivity * sensMult;
  player.pitch = THREE.MathUtils.clamp(player.pitch, -1.52, 1.52);
});

/* 滚轮 / Q 切枪 */
function cycleWeaponInClass(dir) {
  const curClass = WEAPONS[player.weaponId].class;
  const list = Object.keys(WEAPONS).filter((id) => WEAPONS[id].class === curClass);
  if (list.length < 2) return;
  const i = list.indexOf(player.weaponId);
  const next = list[(i + dir + list.length) % list.length];
  switchWeapon(next);
}

function switchWeapon(id) {
  if (!WEAPONS[id] || id === player.weaponId) return;
  player.lastWeaponId = player.weaponId;
  player.weaponId = id;

  getAttachState(id);
  refreshWeaponStats();

  player.ammo = currentWeaponStats.magSize;
  player.reloading = false;
  player.reloadTimer = 0;

  updateCrosshairColor();
  updateHUD();

  const w = WEAPONS[id];
  if (w.class !== selectedClassId) selectClass(w.class);
  weaponGrid.querySelectorAll('.weapon-card').forEach((c) => {
    c.classList.toggle('selected', c.dataset.id === id);
  });
  buildAttachmentsPanel();
}

/* ============================================================
   大厅 UI
============================================================ */
function updateCoinsUI() {
  coinsDisplay.textContent = player.coins;
  coinsHud.textContent = player.coins;
}

function buildMapCards() {
  mapGrid.innerHTML = '';
  for (const id of Object.keys(MAP_DEFS)) {
    const def = MAP_DEFS[id];
    const card = document.createElement('div');
    card.className = 'map-card';
    card.dataset.id = id;
    card.style.setProperty('--m-accent', def.accent);
    card.innerHTML = '<div class="m-name">' + def.name + '</div><div class="m-desc">' + def.desc + '</div>';
    card.addEventListener('click', () => selectMap(id));
    mapGrid.appendChild(card);
  }
}

function selectMap(id) {
  if (!MAP_DEFS[id]) return;
  selectedMapId = id;
  mapGrid.querySelectorAll('.map-card').forEach((c) => {
    c.classList.toggle('selected', c.dataset.id === id);
  });
}

function buildClassTabs() {
  classTabs.innerHTML = '';
  for (const cls of WEAPON_CLASSES) {
    const tab = document.createElement('div');
    tab.className = 'class-tab';
    tab.dataset.id = cls.id;
    tab.textContent = cls.name;
    tab.addEventListener('click', () => selectClass(cls.id));
    classTabs.appendChild(tab);
  }
}

function selectClass(classId) {
  selectedClassId = classId;
  classTabs.querySelectorAll('.class-tab').forEach((t) => {
    t.classList.toggle('active', t.dataset.id === classId);
  });
  buildWeaponCards();
}

function buildWeaponCards() {
  weaponGrid.innerHTML = '';
  const cls = WEAPON_CLASSES.find((c) => c.id === selectedClassId);
  const accent = cls ? cls.accent : '#7ff0d0';

  for (const id of Object.keys(WEAPONS)) {
    if (WEAPONS[id].class !== selectedClassId) continue;
    const base = WEAPONS[id];
    const eff = getWeaponWithAttachments(id);
    const card = document.createElement('div');
    card.className = 'weapon-card';
    card.dataset.id = id;
    card.style.setProperty('--w-accent', accent);

    const dmgLabel = eff.pellets > 1
      ? eff.damage.toFixed(0) + '×' + eff.pellets
      : eff.damage.toFixed(0);

    const spreadBuff = eff.spread < base.spread - 1e-6;
    const recoilBuff = eff.recoil < base.recoil - 1e-6;
    const magBuff = eff.magSize > base.magSize;
    const magNerf = eff.magSize < base.magSize;

    let magCls = '';
    if (magBuff) magCls = 'buffed';
    if (magNerf) magCls = 'nerfed';

    card.innerHTML =
      '<div class="w-name">' + eff.name + '</div>' +
      '<div class="w-desc">' + eff.desc + '</div>' +
      '<div class="w-stats">' +
        '<span><i>伤害</i><b>' + dmgLabel + '</b></span>' +
        '<span><i>弹匣</i><b class="' + magCls + '">' + eff.magSize + '</b></span>' +
        '<span><i>射速</i><b>' + Math.round(60 / eff.fireRate) + '</b></span>' +
        '<span><i>散布</i><b class="' + (spreadBuff ? 'buffed' : '') + '">' + (eff.spread * 1000).toFixed(1) + '</b></span>' +
        '<span><i>后坐</i><b class="' + (recoilBuff ? 'buffed' : '') + '">' + (eff.recoil * 1000).toFixed(1) + '</b></span>' +
      '</div>';

    card.addEventListener('click', () => selectWeapon(id));
    weaponGrid.appendChild(card);
  }

  weaponGrid.querySelectorAll('.weapon-card').forEach((c) => {
    c.classList.toggle('selected', c.dataset.id === player.weaponId);
  });
}

function selectWeapon(id) {
  if (!WEAPONS[id]) return;
  player.weaponId = id;
  getAttachState(id);
  refreshWeaponStats();
  player.ammo = currentWeaponStats.magSize;
  player.reloading = false;
  player.reloadTimer = 0;
  updateCrosshairColor();

  const w = WEAPONS[id];
  if (w.class !== selectedClassId) selectClass(w.class);
  weaponGrid.querySelectorAll('.weapon-card').forEach((c) => {
    c.classList.toggle('selected', c.dataset.id === id);
  });
  buildAttachmentsPanel();
  updateHUD();
}

function buildAttachmentsPanel() {
  const state = getAttachState(player.weaponId);
  attachmentsPanel.innerHTML = '';

  for (const slotId of Object.keys(ATTACHMENTS)) {
    const slotDef = ATTACHMENTS[slotId];
    const row = document.createElement('div');
    row.className = 'attach-row';

    const label = document.createElement('div');
    label.className = 'attach-row-label';
    label.textContent = slotDef.name;
    row.appendChild(label);

    const opts = document.createElement('div');
    opts.className = 'attach-opts';

    for (const itemId of Object.keys(slotDef.items)) {
      const item = slotDef.items[itemId];
      const unlocked = isUnlocked(slotId, itemId);
      const affordable = !unlocked && player.coins >= item.price;

      const chip = document.createElement('div');
      chip.className = 'attach-chip';
      if (state[slotId] === itemId) chip.classList.add('active');
      if (!unlocked) chip.classList.add('locked');
      if (affordable) chip.classList.add('affordable');

      let priceLine = '';
      if (!unlocked) {
        priceLine = '<span class="price-tag">' + item.price + ' 金币</span>';
      } else if (item.price > 0) {
        priceLine = '<span class="price-tag" style="color:#7ff0d0">已解锁</span>';
      }

      chip.innerHTML =
        '<b>' + item.name + '</b>' +
        '<span>' + (item.desc || '—') + '</span>' +
        priceLine;

      chip.addEventListener('click', () => {
        const nowUnlocked = isUnlocked(slotId, itemId);
        if (!nowUnlocked) {
          if (player.coins >= item.price) {
            player.coins -= item.price;
            unlockedAttachments.add(slotId + ':' + itemId);
            persistSave();
            updateCoinsUI();
            buildAttachmentsPanel();
          }
          return;
        }
        state[slotId] = itemId;
        refreshWeaponStats();
        updateCrosshairColor();
        buildAttachmentsPanel();
        buildWeaponCards();
        updateHUD();
      });

      opts.appendChild(chip);
    }

    row.appendChild(opts);
    attachmentsPanel.appendChild(row);
  }
}

function updateCrosshairColor() {
  const state = getAttachState(player.weaponId);
  const item = ATTACHMENTS.laser.items[state.laser];
  const color = (item && item.cssColor) || '#7ff0d0';
  document.documentElement.style.setProperty('--crosshair-color', color);
}

/* 大厅初始化 */
buildMapCards();
selectMap('arena');
buildClassTabs();
selectClass('rifle');
selectWeapon('ak47');
updateCoinsUI();

/* ============================================================
   开始 / 暂停
============================================================ */
let matchStarted = false;

startBtn.addEventListener('click', () => {
  /* 读取昵称 */
  if (playerNameInput) {
    const v = playerNameInput.value.trim();
    if (v.length > 0) {
      player.name = v.slice(0, 10);
      try { localStorage.setItem('arena_player_name', player.name); } catch (e) {}
    }
  }

  if (!matchStarted) {
    startNewMatch();
    matchStarted = true;
  } else if (selectedMapId !== currentMapId) {
    buildMap(selectedMapId);
    currentMapId = selectedMapId;
    repositionEntities();
  }
  canvas.requestPointerLock();
});

function startNewMatch() {
  if (selectedMapId !== currentMapId) {
    buildMap(selectedMapId);
    currentMapId = selectedMapId;
  }
  player.health = player.maxHealth;
  player.dead = false;
  player.respawnTimer = 0;
  player.vel.set(0, 0, 0);
  player.yaw = 0;
  player.pitch = 0;
  player.kills = 0;
  player.deaths = 0;
  player.lastShot = -999;
  player.reloading = false;
  player.adsHeld = false;
  player.crouching = false;
  player.crouchAmount = 0;
  player.visRecoilPitch = 0;
  player.visRecoilYaw = 0;
  killsEl.textContent = '0';
  deathsEl.textContent = '0';
  refreshWeaponStats();
  player.ammo = currentWeaponStats.magSize;
  repositionEntities();

  /* 刷新机器人名字 */
  shuffleBotNames();
  for (const bot of bots) {
    setSpriteText(bot.nameSprite, bot.name, '#ff8a94');
  }

  updateHUD();

  /* 上线播报 */
  addKillFeed('你以「' + player.name + '」身份进入战场', 'coin');
}

function repositionEntities() {
  player.pos.copy(randomSpawnPoint(0));
  player.pos.y = 0;
  player.vel.set(0, 0, 0);
  for (const bot of bots) {
    bot.pos.copy(randomSpawnPoint(20));
    bot.pos.y = 0;
    bot.group.position.copy(bot.pos);
    bot.wander = randomSpawnPoint(0);
  }
}

document.addEventListener('pointerlockchange', () => {
  const locked = document.pointerLockElement === canvas;
  if (locked) {
    running = true;
    overlay.classList.add('hidden');
    hud.classList.remove('hidden');
    mouseDown = false;
    mouseWasDown = false;
    player.adsHeld = false;
    player.lastShot = elapsed;
  } else {
    running = false;
    mouseDown = false;
    mouseWasDown = false;
    player.adsHeld = false;
    player.crouching = false;
    overlay.classList.remove('hidden');
    hud.classList.add('hidden');
    overlayTitle.textContent = '已暂停';
    overlaySub.textContent = '更换地图 · 更换武器 · 继续战斗';
    startBtn.textContent = '继续战斗';
  }
});

/* ============================================================
   机器人
============================================================ */
const bots = [];

function pickBotNames(count) {
  const pool = BOT_NAME_POOL.slice();
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

function shuffleBotNames() {
  const names = pickBotNames(bots.length);
  for (let i = 0; i < bots.length; i++) {
    bots[i].name = names[i] || ('Bot' + (i + 1));
  }
}

function createBot() {
  const group = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xe8435a, roughness: 0.45, metalness: 0.3, emissive: 0x2a0509 });
  const headMat = new THREE.MeshStandardMaterial({ color: 0xffcc55, roughness: 0.35, metalness: 0.3, emissive: 0x2a1e00 });
  const legMat = new THREE.MeshStandardMaterial({ color: 0x2a3242, roughness: 0.9 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.72, 1.2, 0.46), bodyMat);
  body.position.y = 0.75;
  body.castShadow = !isLowEnd;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 8), headMat);
  head.position.y = 1.55;
  head.castShadow = !isLowEnd;
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.5, 0.26), legMat);
  legL.position.set(-0.2, 0.25, 0);
  const legR = legL.clone();
  legR.position.x = 0.2;

  /* 头顶名字 */
  const nameSprite = makeNameSprite('BOT', '#ff8a94');

  group.add(body, head, legL, legR, nameSprite);
  scene.add(group);

  const bot = {
    group, body, head, nameSprite,
    name: 'BOT',
    pos: new THREE.Vector3(),
    health: CFG.botHealth,
    alive: true,
    fireTimer: 1 + Math.random() * 1.5,
    respawnTimer: 0,
    wander: new THREE.Vector3(),
    strafeDir: Math.random() < 0.5 ? 1 : -1,
    cachedCanSee: false,
    cachedDist: 999,
  };
  group.userData.__bot = bot;
  bots.push(bot);
  return bot;
}

/* ============================================================
   工具
============================================================ */
function randomSpawnPoint(minDistFromPlayer) {
  const lim = CFG.arena - 4;
  for (let i = 0; i < 60; i++) {
    const x = (Math.random() * 2 - 1) * lim;
    const z = (Math.random() * 2 - 1) * lim;
    if (Math.hypot(x - player.pos.x, z - player.pos.z) < minDistFromPlayer) continue;
    let blocked = false;
    for (const b of obstacles) {
      if (x > b.minX - 1.5 && x < b.maxX + 1.5 && z > b.minZ - 1.5 && z < b.maxZ + 1.5) {
        blocked = true; break;
      }
    }
    if (blocked) continue;
    return new THREE.Vector3(x, 0, z);
  }
  return new THREE.Vector3(0, 0, 0);
}

function resolveCollisions(pos, radius) {
  for (const b of obstacles) {
    if (pos.y >= b.height) continue;
    const minX = b.minX - radius, maxX = b.maxX + radius;
    const minZ = b.minZ - radius, maxZ = b.maxZ + radius;
    if (pos.x > minX && pos.x < maxX && pos.z > minZ && pos.z < maxZ) {
      const dl = pos.x - minX, dr = maxX - pos.x;
      const db = pos.z - minZ, df = maxZ - pos.z;
      const m = Math.min(dl, dr, db, df);
      if (m === dl) pos.x = minX;
      else if (m === dr) pos.x = maxX;
      else if (m === db) pos.z = minZ;
      else pos.z = maxZ;
    }
  }
}

function clampToArena(pos) {
  const lim = CFG.arena - 1;
  pos.x = THREE.MathUtils.clamp(pos.x, -lim, lim);
  pos.z = THREE.MathUtils.clamp(pos.z, -lim, lim);
}

function findOwnerBot(obj) {
  let o = obj;
  while (o) {
    if (o.userData.__bot) return o.userData.__bot;
    o = o.parent;
  }
  return null;
}

/* ============================================================
   射线检测
============================================================ */
const raycaster = new THREE.Raycaster();
raycaster.far = 260;
const losRay = new THREE.Raycaster();
const _tmpDir = new THREE.Vector3();

function hasLOS(from, to) {
  _tmpDir.subVectors(to, from);
  const dist = _tmpDir.length();
  if (dist < 0.001) return true;
  _tmpDir.divideScalar(dist);
  losRay.set(from, _tmpDir);
  losRay.far = dist - 0.2;
  return losRay.intersectObjects(worldMeshes, false).length === 0;
}

/* ============================================================
   特效
============================================================ */
const effects = [];
function spawnImpact(point) {
  const m = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xffdd66, transparent: true })
  );
  m.position.copy(point);
  scene.add(m);
  effects.push({ mesh: m, life: 0.16, max: 0.16 });
}
function updateEffects(dt) {
  for (let i = effects.length - 1; i >= 0; i--) {
    const fx = effects[i];
    fx.life -= dt;
    if (fx.life <= 0) {
      scene.remove(fx.mesh);
      fx.mesh.geometry.dispose();
      fx.mesh.material.dispose();
      effects.splice(i, 1);
    } else {
      fx.mesh.material.opacity = fx.life / fx.max;
      fx.mesh.scale.setScalar(1 + (1 - fx.life / fx.max) * 2.2);
    }
  }
}

/* ============================================================
   HUD
============================================================ */
function updateHUD() {
  if (!currentWeaponStats) refreshWeaponStats();
  const w = currentWeaponStats;
  const hp = Math.max(0, player.health);

  healthFill.style.width = hp + '%';
  healthFill.style.background =
    hp > 60 ? 'linear-gradient(90deg,#3ee08f,#7dfcc0)' :
    hp > 30 ? 'linear-gradient(90deg,#ffc857,#ffe08a)' :
              'linear-gradient(90deg,#ff4d5e,#ff8a94)';
  healthNum.textContent = Math.ceil(hp);

  weaponNameEl.textContent = w.name;
  ammoNum.textContent = player.ammo;
  ammoMaxEl.textContent = ' / ' + w.magSize;

  const state = getAttachState(player.weaponId);
  attachBadges.innerHTML = '';
  for (const slotId of Object.keys(ATTACHMENTS)) {
    const itemId = state[slotId];
    if (itemId === 'none') continue;
    const item = ATTACHMENTS[slotId].items[itemId];
    const badge = document.createElement('span');
    badge.className = 'badge on';
    badge.textContent = item.name;
    attachBadges.appendChild(badge);
  }

  if (player.reloading) {
    reloadHint.textContent = '换弹中…';
    reloadHint.classList.add('reloading');
  } else if (player.ammo === 0) {
    reloadHint.textContent = '按 R 换弹';
    reloadHint.classList.add('reloading');
  } else {
    reloadHint.textContent = '弹药';
    reloadHint.classList.remove('reloading');
  }
}

let hitmarkerTimer = null;
function showHitmarker(headshot) {
  hitmarker.classList.add('show');
  if (headshot) {
    hitmarker.style.filter = 'drop-shadow(0 0 10px #ff4d5e) brightness(1.8)';
    hitmarker.style.transform = 'translate(-50%, -50%) rotate(45deg) scale(1.35)';
  } else {
    hitmarker.style.filter = 'none';
    hitmarker.style.transform = 'translate(-50%, -50%) rotate(45deg) scale(1)';
  }
  clearTimeout(hitmarkerTimer);
  hitmarkerTimer = setTimeout(() => hitmarker.classList.remove('show'), 90);
}

/* 淘汰播报：带双方名字 */
function addKillFeed(html, type) {
  const el = document.createElement('div');
  el.className = 'feed-item ' + (type || '');
  el.innerHTML = html;
  killFeed.appendChild(el);
  setTimeout(() => el.classList.add('out'), 1500);
  setTimeout(() => el.remove(), 2100);
}

let vignetteTimer = null;
function flashVignette() {
  vignette.classList.add('flash');
  clearTimeout(vignetteTimer);
  vignetteTimer = setTimeout(() => vignette.classList.remove('flash'), 60);
}

/* FPS */
const fpsEl = document.createElement('div');
fpsEl.style.cssText = 'position:fixed;left:12px;top:12px;z-index:20;font:11px monospace;color:#7ff0d0;background:rgba(0,0,0,.4);padding:3px 8px;border-radius:3px;pointer-events:none;';
fpsEl.textContent = 'FPS --';
document.body.appendChild(fpsEl);
let fpsAccum = 0, fpsFrames = 0;

/* ============================================================
   玩家逻辑
============================================================ */
const _forward = new THREE.Vector3();
const _right = new THREE.Vector3();
const _move = new THREE.Vector3();

function updatePlayer(dt) {
  const targetCrouch = player.crouching && player.onGround ? 1 : 0;
  player.crouchAmount += (targetCrouch - player.crouchAmount) * Math.min(1, dt * CROUCH_SPEED_LERP);
  if (player.crouchAmount < 0.001) player.crouchAmount = 0;

  if (player.dead) return;

  _forward.set(-Math.sin(player.yaw), 0, -Math.cos(player.yaw));
  _right.set(Math.cos(player.yaw), 0, -Math.sin(player.yaw));
  _move.set(0, 0, 0);

  if (keys['KeyW'] || keys['ArrowUp'])    _move.add(_forward);
  if (keys['KeyS'] || keys['ArrowDown'])  _move.sub(_forward);
  if (keys['KeyD'] || keys['ArrowRight']) _move.add(_right);
  if (keys['KeyA'] || keys['ArrowLeft'])  _move.sub(_right);

  if (_move.lengthSq() > 0) {
    _move.normalize();
    const w = currentWeaponStats || WEAPONS[player.weaponId];
    const moveMul = w.moveMul || 1;
    const adsMul = player.adsHeld ? ADS_MOVE_MULT : 1;
    const crouchMul = 1 - player.crouchAmount * (1 - CROUCH_MOVE_MUL);
    const spd = CFG.moveSpeed * moveMul * adsMul * crouchMul *
      ((keys['ShiftLeft'] || keys['ShiftRight']) && !player.adsHeld && player.crouchAmount < 0.1 ? CFG.sprintMul : 1);
    player.pos.addScaledVector(_move, spd * dt);
  }

  if (keys['Space'] && player.onGround && player.crouchAmount < 0.5) {
    player.vel.y = CFG.jumpSpeed;
    player.onGround = false;
  }

  player.vel.y -= CFG.gravity * dt;
  player.pos.y += player.vel.y * dt;

  if (player.pos.y <= 0) {
    player.pos.y = 0;
    player.vel.y = 0;
    player.onGround = true;
  }

  resolveCollisions(player.pos, CFG.radius);
  clampToArena(player.pos);
}

let currentFov = 78;

function updateCamera(dt) {
  const eyeHeight = CFG.eyeHeight - player.crouchAmount * CROUCH_EYE_DROP;
  camera.position.set(player.pos.x, player.pos.y + eyeHeight, player.pos.z);

  camera.rotation.y = player.yaw + player.visRecoilYaw;
  camera.rotation.x = THREE.MathUtils.clamp(
    player.pitch + player.visRecoilPitch, -1.52, 1.52
  );

  const w = currentWeaponStats || WEAPONS[player.weaponId];
  const adsFov = ADS_FOV_BY_CLASS[w.class] || 55;
  const targetFov = (player.adsHeld && !player.reloading) ? adsFov : 78;

  currentFov += (targetFov - currentFov) * Math.min(1, dt * 14);

  if (Math.abs(camera.fov - currentFov) > 0.01) {
    camera.fov = currentFov;
    camera.updateProjectionMatrix();
  }

  if (player.adsHeld) crosshairEl.classList.add('ads');
  else crosshairEl.classList.remove('ads');

  if (running) adsHint.classList.toggle('hidden', player.adsHeld);
  else adsHint.classList.add('hidden');

  const decay = Math.exp(-dt * RECOIL_DECAY);
  player.visRecoilPitch *= decay;
  player.visRecoilYaw *= decay;
}

function startReload() {
  if (player.dead || player.reloading) return;
  const w = currentWeaponStats || WEAPONS[player.weaponId];
  if (player.ammo >= w.magSize) return;
  player.reloading = true;
  player.reloadTimer = w.reloadTime;
  updateHUD();
}

function updateTimers(dt) {
  if (player.reloading) {
    player.reloadTimer -= dt;
    if (player.reloadTimer <= 0) {
      player.reloading = false;
      player.ammo = (currentWeaponStats || WEAPONS[player.weaponId]).magSize;
      updateHUD();
    }
  }
  if (player.dead) {
    player.respawnTimer -= dt;
    if (player.respawnTimer <= 0) respawnPlayer();
  }
}

function respawnPlayer() {
  player.dead = false;
  player.health = player.maxHealth;
  player.reloading = false;
  player.vel.set(0, 0, 0);
  player.pitch = 0;
  player.crouching = false;
  player.crouchAmount = 0;
  player.visRecoilPitch = 0;
  player.visRecoilYaw = 0;
  player.pos.copy(randomSpawnPoint(20));
  player.ammo = (currentWeaponStats || WEAPONS[player.weaponId]).magSize;
  updateHUD();
}

/* 被谁杀的，记录一下用于播报 */
function damagePlayer(amount, killerName) {
  if (player.dead) return;
  player.health -= amount;
  flashVignette();
  if (player.health <= 0) {
    player.health = 0;
    player.dead = true;
    player.deaths++;
    player.respawnTimer = 1.8;
    deathsEl.textContent = player.deaths;
    const kn = killerName || '敌人';
    addKillFeed('<b style="color:#ff8a94">' + kn + '</b> 淘汰了 <b style="color:#7ff0d0">' + player.name + '</b>', 'bad');
  }
  updateHUD();
}

/* ============================================================
   射击
============================================================ */
const shootTargets = [];
const _baseDir = new THREE.Vector3();
const _rightV = new THREE.Vector3();
const _upV = new THREE.Vector3();
const _pelletDir = new THREE.Vector3();
const WORLD_UP = new THREE.Vector3(0, 1, 0);

function handleShooting() {
  const w = currentWeaponStats || WEAPONS[player.weaponId];
  if (!w || !running) { mouseWasDown = mouseDown; return; }
  const shouldTry = w.auto ? mouseDown : (mouseDown && !mouseWasDown);
  mouseWasDown = mouseDown;
  if (shouldTry) tryShoot();
}

function tryShoot() {
  const w = currentWeaponStats || WEAPONS[player.weaponId];
  if (player.dead || player.reloading) return;
  if (elapsed - player.lastShot < w.fireRate) return;
  if (player.ammo <= 0) { startReload(); return; }

  player.lastShot = elapsed;
  player.ammo--;

  shootTargets.length = 0;
  for (let i = 0; i < bots.length; i++) {
    const b = bots[i];
    if (b.alive) { shootTargets.push(b.head); shootTargets.push(b.body); }
  }
  for (let i = 0; i < worldMeshes.length; i++) shootTargets.push(worldMeshes[i]);

  camera.getWorldDirection(_baseDir);

  let spreadMul = 1;
  if (player.adsHeld) spreadMul *= ADS_SPREAD_MULT;
  spreadMul *= (1 - player.crouchAmount * (1 - CROUCH_SPREAD_MUL));

  const effectiveSpread = w.spread * spreadMul;

  let anyHit = false, anyHeadshot = false;

  for (let p = 0; p < w.pellets; p++) {
    _pelletDir.copy(_baseDir);
    if (effectiveSpread > 0) {
      _rightV.crossVectors(_baseDir, WORLD_UP).normalize();
      if (_rightV.lengthSq() < 1e-6) _rightV.set(1, 0, 0);
      _upV.crossVectors(_rightV, _baseDir).normalize();
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random()) * effectiveSpread;
      _pelletDir.addScaledVector(_rightV, Math.cos(angle) * radius);
      _pelletDir.addScaledVector(_upV, Math.sin(angle) * radius);
      _pelletDir.normalize();
    }

    raycaster.set(camera.position, _pelletDir);
    raycaster.far = 260;

    const hits = raycaster.intersectObjects(shootTargets, false);
    if (hits.length > 0) {
      const h = hits[0];
      const bot = findOwnerBot(h.object);
      if (bot) {
        const headshot = h.object === bot.head;
        const hsMult = w.headMult * HEADSHOT_BONUS;
        damageBot(bot, w.damage * (headshot ? hsMult : 1), headshot);
        anyHit = true;
        if (headshot) anyHeadshot = true;
      } else {
        spawnImpact(h.point);
      }
    }
  }

  if (anyHit) showHitmarker(anyHeadshot);

  const recoilScale = player.adsHeld ? 0.7 : 1;
  player.visRecoilPitch += w.recoil * recoilScale * (0.7 + Math.random() * 0.6);
  player.visRecoilYaw   += (Math.random() - 0.5) * w.recoil * recoilScale * 0.9;

  updateHUD();
}

function damageBot(bot, dmg, headshot) {
  if (!bot.alive) return;
  bot.health -= dmg;
  if (bot.health <= 0) {
    bot.alive = false;
    bot.health = 0;
    bot.group.visible = false;
    bot.respawnTimer = CFG.botRespawn;

    player.kills++;
    player.coins += COIN_PER_KILL;
    killsEl.textContent = player.kills;
    updateCoinsUI();
    persistSave();

    const hsText = headshot ? ' <span style="color:#ff4d5e">[爆头]</span>' : '';
    addKillFeed(
      '<b style="color:#7ff0d0">' + player.name + '</b> 淘汰了 <b style="color:#ff8a94">' + bot.name + '</b>' + hsText + ' <span style="color:#ffc857">+' + COIN_PER_KILL + '</span>',
      'good'
    );
  }
}

function respawnBot(bot) {
  bot.alive = true;
  bot.health = CFG.botHealth;
  bot.group.visible = true;
  bot.pos.copy(randomSpawnPoint(18));
  bot.group.position.copy(bot.pos);
  bot.fireTimer = 0.8 + Math.random() * 1.2;
  bot.wander = randomSpawnPoint(0);
}

/* ============================================================
   机器人 AI
============================================================ */
const _playerEye = new THREE.Vector3();
const _botEye = new THREE.Vector3();
const _aiDir = new THREE.Vector3();
const _aiMove = new THREE.Vector3();
let frameCounter = 0;

function updateBots(dt) {
  frameCounter++;
  _playerEye.set(player.pos.x, player.pos.y + CFG.eyeHeight, player.pos.z);
  const doLos = (frameCounter % CFG.losInterval) === 0;

  for (const bot of bots) {
    if (!bot.alive) {
      bot.respawnTimer -= dt;
      if (bot.respawnTimer <= 0) respawnBot(bot);
      continue;
    }

    _botEye.set(bot.pos.x, bot.pos.y + 1.45, bot.pos.z);
    const distToPlayer = _botEye.distanceTo(_playerEye);

    if (doLos) {
      bot.cachedDist = distToPlayer;
      bot.cachedCanSee = !player.dead && distToPlayer < 55 && hasLOS(_botEye, _playerEye);
    }

    const canSee = bot.cachedCanSee &&
      Math.abs(distToPlayer - bot.cachedDist) < 12 && distToPlayer < 60;

    _aiMove.set(0, 0, 0);

    if (canSee) {
      _aiDir.subVectors(_playerEye, _botEye);
      _aiDir.y = 0;
      _aiDir.normalize();
      if (distToPlayer > 14)      _aiMove.copy(_aiDir);
      else if (distToPlayer < 6)  _aiMove.copy(_aiDir).negate();
      else                        _aiMove.set(-_aiDir.z, 0, _aiDir.x).multiplyScalar(bot.strafeDir);
      if (Math.random() < 0.012) bot.strafeDir *= -1;

      bot.fireTimer -= dt;
      if (bot.fireTimer <= 0 && distToPlayer < 45) {
        bot.fireTimer = 0.75 + Math.random() * 0.95;
        botShoot(distToPlayer, bot.name);
      }
      bot.group.rotation.y = Math.atan2(_aiDir.x, _aiDir.z);
    } else {
      if (!bot.wander || bot.pos.distanceTo(bot.wander) < 2.5) {
        bot.wander = randomSpawnPoint(0);
      }
      _aiMove.subVectors(bot.wander, bot.pos);
      _aiMove.y = 0;
      if (_aiMove.lengthSq() > 0.01) {
        _aiMove.normalize();
        bot.group.rotation.y = Math.atan2(_aiMove.x, _aiMove.z);
      }
    }

    if (_aiMove.lengthSq() > 0.001) {
      _aiMove.normalize();
      bot.pos.addScaledVector(_aiMove, CFG.botSpeed * dt);
      resolveCollisions(bot.pos, CFG.radius);
      clampToArena(bot.pos);
    }
    bot.group.position.copy(bot.pos);

    /* 名字朝相机方向 */
    bot.nameSprite.quaternion.copy(camera.quaternion);
  }
}

function botShoot(dist, botName) {
  if (player.dead) return;
  const chance = THREE.MathUtils.clamp(0.62 - dist * 0.009, 0.08, 0.62);
  if (Math.random() < chance) damagePlayer(CFG.botDamage, botName);
}

/* ============================================================
   初始化
============================================================ */
buildMap(currentMapId);
for (let i = 0; i < CFG.botCount; i++) createBot();
shuffleBotNames();
for (const bot of bots) setSpriteText(bot.nameSprite, bot.name, '#ff8a94');

player.pos.copy(randomSpawnPoint(0));
updateCamera(0);
updateHUD();
for (const bot of bots) {
  bot.pos.copy(randomSpawnPoint(22));
  bot.group.position.copy(bot.pos);
  bot.wander = randomSpawnPoint(0);
}

/* ============================================================
   主循环
============================================================ */
let lastTime = performance.now();

function loop(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  fpsAccum += dt;
  fpsFrames++;
  if (fpsAccum >= 0.5) {
    fpsEl.textContent = 'FPS ' + Math.round(fpsFrames / fpsAccum);
    fpsAccum = 0;
    fpsFrames = 0;
  }

  if (running) {
    elapsed += dt;
    updatePlayer(dt);
    updateCamera(dt);
    handleShooting();
    updateBots(dt);
    updateTimers(dt);
    updateEffects(dt);
    updateLaser();
  } else {
    laserLine.visible = false;
  }

  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);