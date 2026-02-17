/**
 * Crack PTE - Gamification Engine
 * XP, Levels, Streaks, Badges, Achievements
 */
window.PTE = window.PTE || {};

PTE.Gamify = {
  STORAGE_KEY: 'crackpte_gamify',

  LEVELS: [
    { level:1, title:'Beginner', xpNeeded:0, icon:'🌱' },
    { level:2, title:'Learner', xpNeeded:100, icon:'📖' },
    { level:3, title:'Practitioner', xpNeeded:300, icon:'🎯' },
    { level:4, title:'Skilled', xpNeeded:600, icon:'⚡' },
    { level:5, title:'Advanced', xpNeeded:1000, icon:'🔥' },
    { level:6, title:'Expert', xpNeeded:1500, icon:'💎' },
    { level:7, title:'Master', xpNeeded:2200, icon:'👑' },
    { level:8, title:'Champion', xpNeeded:3000, icon:'🏆' },
    { level:9, title:'Legend', xpNeeded:4000, icon:'🌟' },
    { level:10, title:'PTE Cracker', xpNeeded:5500, icon:'⚔️' },
  ],

  BADGES: [
    { id:'first_try', name:'First Step', desc:'Complete your first question', icon:'🎬', condition: d => d.totalAttempts >= 1 },
    { id:'ten_qs', name:'Getting Started', desc:'Complete 10 questions', icon:'🔟', condition: d => d.totalAttempts >= 10 },
    { id:'fifty_qs', name:'Dedicated', desc:'Complete 50 questions', icon:'5️⃣0️⃣', condition: d => d.totalAttempts >= 50 },
    { id:'hundred_qs', name:'Century', desc:'Complete 100 questions', icon:'💯', condition: d => d.totalAttempts >= 100 },
    { id:'streak_3', name:'On Fire', desc:'3-day practice streak', icon:'🔥', condition: d => d.streak >= 3 },
    { id:'streak_7', name:'Week Warrior', desc:'7-day practice streak', icon:'⚡', condition: d => d.streak >= 7 },
    { id:'streak_30', name:'Monthly Master', desc:'30-day practice streak', icon:'🗓️', condition: d => d.streak >= 30 },
    { id:'score_70', name:'High Scorer', desc:'Score 70+ on any question', icon:'🎯', condition: d => d.bestScore >= 70 },
    { id:'score_80', name:'Excellence', desc:'Score 80+ on any question', icon:'🌟', condition: d => d.bestScore >= 80 },
    { id:'score_90', name:'Perfect', desc:'Score 90 on any question', icon:'👑', condition: d => d.bestScore >= 90 },
    { id:'all_types', name:'All-Rounder', desc:'Practice all 7 question types', icon:'🎪', condition: d => d.typesPlayed >= 7 },
    { id:'mock_test', name:'Test Taker', desc:'Complete a mock test', icon:'📝', condition: d => d.mockTests >= 1 },
    { id:'mock_5', name:'Test Veteran', desc:'Complete 5 mock tests', icon:'🏅', condition: d => d.mockTests >= 5 },
    { id:'prediction', name:'Fortune Teller', desc:'Practice 20 prediction questions', icon:'🔮', condition: d => d.predictionsDone >= 20 },
    { id:'night_owl', name:'Night Owl', desc:'Practice after 10 PM', icon:'🦉', condition: d => d.nightOwl },
    { id:'early_bird', name:'Early Bird', desc:'Practice before 7 AM', icon:'🐦', condition: d => d.earlyBird },
  ],

  // XP rewards per action
  XP_REWARDS: {
    questionComplete: 10,
    scoreBonus50: 5,
    scoreBonus70: 10,
    scoreBonus80: 20,
    mockTestComplete: 50,
    dailyFirst: 25, // first question of the day
    streakBonus: 10, // per day in streak
  },

  getData() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : this._defaultData();
    } catch(e) { return this._defaultData(); }
  },

  save(data) {
    try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data)); } catch(e) {}
  },

  _defaultData() {
    return { xp:0, level:1, streak:0, lastPlayDate:null, totalAttempts:0, bestScore:0, typesPlayed:new Set(), mockTests:0, predictionsDone:0, badges:[], nightOwl:false, earlyBird:false, dailyXpClaimed:null };
  },

  /**
   * Award XP for completing a question. Returns {xpGained, leveledUp, newBadges, newLevel}
   */
  awardXP(score, type, isMock, isPrediction) {
    const data = this.getData();
    let xpGained = 0;
    const events = [];

    // Base XP
    xpGained += this.XP_REWARDS.questionComplete;

    // Score bonuses
    if (score >= 80) { xpGained += this.XP_REWARDS.scoreBonus80; events.push('+20 XP High Score!'); }
    else if (score >= 70) { xpGained += this.XP_REWARDS.scoreBonus70; events.push('+10 XP Great Score!'); }
    else if (score >= 50) { xpGained += this.XP_REWARDS.scoreBonus50; events.push('+5 XP Good Job!'); }

    // Daily first bonus
    const today = new Date().toDateString();
    if (data.dailyXpClaimed !== today) {
      xpGained += this.XP_REWARDS.dailyFirst;
      data.dailyXpClaimed = today;
      events.push('+25 XP Daily Bonus!');
    }

    // Mock test bonus
    if (isMock) {
      xpGained += this.XP_REWARDS.mockTestComplete;
      data.mockTests = (data.mockTests || 0) + 1;
      events.push('+50 XP Mock Test!');
    }

    // Update streak
    if (data.lastPlayDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      data.streak = (data.lastPlayDate === yesterday) ? (data.streak || 0) + 1 : 1;
      if (data.streak > 1) {
        const streakXP = Math.min(data.streak * this.XP_REWARDS.streakBonus, 100);
        xpGained += streakXP;
        events.push(`+${streakXP} XP ${data.streak}-day streak!`);
      }
      data.lastPlayDate = today;
    }

    // Track stats
    data.totalAttempts = (data.totalAttempts || 0) + 1;
    if (score > (data.bestScore || 0)) data.bestScore = score;
    if (isPrediction) data.predictionsDone = (data.predictionsDone || 0) + 1;

    // Track types (store as array for JSON)
    if (!Array.isArray(data.typesPlayed)) data.typesPlayed = [];
    if (type && !data.typesPlayed.includes(type)) data.typesPlayed.push(type);

    // Time-based badges
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 5) data.nightOwl = true;
    if (hour >= 4 && hour < 7) data.earlyBird = true;

    // Apply XP
    const oldLevel = this.getLevel(data.xp);
    data.xp = (data.xp || 0) + xpGained;
    const newLevel = this.getLevel(data.xp);
    const leveledUp = newLevel.level > oldLevel.level;
    if (leveledUp) data.level = newLevel.level;

    // Check new badges
    const newBadges = [];
    if (!Array.isArray(data.badges)) data.badges = [];
    const checkData = { ...data, typesPlayed: Array.isArray(data.typesPlayed) ? data.typesPlayed.length : 0 };
    this.BADGES.forEach(b => {
      if (!data.badges.includes(b.id) && b.condition(checkData)) {
        data.badges.push(b.id);
        newBadges.push(b);
        xpGained += 15;
        data.xp += 15;
      }
    });

    this.save(data);

    return { xpGained, leveledUp, newLevel, oldLevel, newBadges, events, totalXP: data.xp, streak: data.streak };
  },

  getLevel(xp) {
    let current = this.LEVELS[0];
    for (const lvl of this.LEVELS) {
      if (xp >= lvl.xpNeeded) current = lvl;
      else break;
    }
    return current;
  },

  getProgress() {
    const data = this.getData();
    const currentLevel = this.getLevel(data.xp || 0);
    const nextLevel = this.LEVELS.find(l => l.xpNeeded > (data.xp || 0)) || currentLevel;
    const xpInLevel = (data.xp || 0) - currentLevel.xpNeeded;
    const xpForNext = nextLevel.xpNeeded - currentLevel.xpNeeded || 1;
    const pct = Math.min(100, Math.round((xpInLevel / xpForNext) * 100));

    return {
      xp: data.xp || 0,
      level: currentLevel,
      nextLevel,
      progress: pct,
      streak: data.streak || 0,
      totalAttempts: data.totalAttempts || 0,
      badges: (data.badges || []).map(id => this.BADGES.find(b => b.id === id)).filter(Boolean),
      allBadges: this.BADGES,
      bestScore: data.bestScore || 0
    };
  },

  /** Render XP bar for navbar */
  renderXPBar() {
    const p = this.getProgress();
    return `<div class="flex items-center gap-2">
      <span class="badge badge-level">${p.level.icon} Lv${p.level.level}</span>
      <div class="xp-bar-bg w-16 sm:w-24"><div class="xp-bar-fill" style="width:${p.progress}%"></div></div>
      <span class="text-xs text-[var(--accent-light)] font-semibold font-mono tabular-nums hidden sm:inline">${p.xp} XP</span>
      ${p.streak > 0 ? `<span class="badge badge-streak">🔥${p.streak}</span>` : ''}
    </div>`;
  },

  /** Render XP gain toast */
  renderXPToast(result) {
    let html = `<div id="xp-toast" class="fixed top-20 right-4 z-[100] animate-slideDown" style="animation-duration:0.3s">
      <div class="card-elevated rounded-xl p-4 min-w-[220px] shadow-2xl">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-xl bg-[var(--accent-surface)] flex items-center justify-center text-lg" style="animation:xpPulse 0.5s ease-out">⚡</div>
          <div>
            <p class="text-sm font-semibold font-mono text-[var(--accent-light)]">+${result.xpGained} XP</p>
            <p class="text-xs font-mono text-zinc-500">${result.totalXP} total</p>
          </div>
        </div>`;
    result.events.forEach(e => {
      html += `<p class="text-xs text-green-400 ml-13">${e}</p>`;
    });
    if (result.leveledUp) {
      html += `<div class="mt-2 p-2 rounded-lg bg-[var(--violet)]/15 border border-[rgba(167,139,250,0.15)] text-center" style="animation:levelUp 0.6s ease-out">
        <p class="text-[var(--violet)] font-semibold text-sm">${result.newLevel.icon} LEVEL UP!</p>
        <p class="text-xs text-[var(--violet)]">${result.newLevel.title}</p>
      </div>`;
    }
    result.newBadges.forEach(b => {
      html += `<div class="mt-2 p-2 rounded-lg bg-amber-500/8 border border-amber-500/10 flex items-center gap-2">
        <span class="text-xl">${b.icon}</span>
        <div><p class="text-xs font-semibold text-amber-400">Badge: ${b.name}</p><p class="text-xs text-amber-400/60">${b.desc}</p></div>
      </div>`;
    });
    html += `</div></div>`;
    return html;
  },

  showToast(result) {
    const existing = document.getElementById('xp-toast');
    if (existing) existing.remove();
    document.body.insertAdjacentHTML('beforeend', this.renderXPToast(result));
    setTimeout(() => {
      const el = document.getElementById('xp-toast');
      if (el) { el.style.opacity = '0'; el.style.transition = 'opacity 0.5s'; setTimeout(() => el.remove(), 500); }
    }, 4000);
  }
};
