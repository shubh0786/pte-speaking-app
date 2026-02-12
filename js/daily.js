/**
 * Crack PTE - Daily Challenge Mode
 * 5 questions per day, seeded by date, bonus XP for completion
 */
window.PTE = window.PTE || {};

PTE.Daily = {
  STORAGE_KEY: 'crackpte_daily',
  QUESTIONS_PER_DAY: 5,
  COMPLETION_XP: 50,

  _seed(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) { h = ((h << 5) - h) + str.charCodeAt(i); h |= 0; }
    return function() { h = (h * 16807 + 0) % 2147483647; return (h - 1) / 2147483646; };
  },

  getTodayKey() { return new Date().toISOString().split('T')[0]; },

  getData() {
    try { const d = localStorage.getItem(this.STORAGE_KEY); return d ? JSON.parse(d) : {}; } catch(e) { return {}; }
  },

  save(data) { try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data)); } catch(e) {} },

  getTodayChallenge() {
    const key = this.getTodayKey();
    const data = this.getData();
    if (data.date === key && data.questions) return data;

    // Generate today's questions using date-seeded random
    const rng = this._seed(key);
    const types = ['read-aloud','repeat-sentence','describe-image','answer-short-question'];
    const allTypes = Object.keys(PTE.Questions);
    const randomType = allTypes[Math.floor(rng() * allTypes.length)];
    const picks = [...types, randomType];

    const questions = [];
    const usedIds = new Set();
    picks.forEach(type => {
      const bank = PTE.Questions[type] || [];
      if (bank.length === 0) return;
      let idx = Math.floor(rng() * bank.length);
      let attempts = 0;
      while (usedIds.has(bank[idx].id) && attempts < bank.length) { idx = (idx + 1) % bank.length; attempts++; }
      usedIds.add(bank[idx].id);
      const tc = Object.values(PTE.QUESTION_TYPES).find(t => t.id === type);
      questions.push({ type, typeConfig: tc, question: bank[idx], completed: false, score: 0 });
    });

    const challenge = { date: key, questions, completedCount: 0, totalXP: 0, finished: false };
    this.save(challenge);
    return challenge;
  },

  markCompleted(index, score) {
    const data = this.getData();
    if (!data.questions || !data.questions[index]) return;
    if (!data.questions[index].completed) {
      data.questions[index].completed = true;
      data.questions[index].score = score;
      data.completedCount = data.questions.filter(q => q.completed).length;
      if (data.completedCount >= data.questions.length && !data.finished) {
        data.finished = true;
        data.totalXP = this.COMPLETION_XP;
        if (PTE.Gamify) {
          const r = PTE.Gamify.awardXP(0, 'daily-challenge', false, false);
          r.events.push('+50 XP Daily Challenge Complete!');
          r.xpGained += 50;
          PTE.Gamify.showToast(r);
        }
      }
      this.save(data);
    }
  },

  renderCard() {
    const ch = this.getTodayChallenge();
    const done = ch.completedCount || 0;
    const total = ch.questions ? ch.questions.length : 5;
    const pct = Math.round((done / total) * 100);
    const finished = ch.finished;

    return `
    <div class="glass neon-border rounded-2xl p-5 ${finished ? 'border-emerald-500/30' : ''}">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xl shadow-lg">
            ${finished ? '✅' : '⚡'}
          </div>
          <div>
            <h3 class="font-bold text-white text-sm">Daily Challenge</h3>
            <p class="text-xs text-gray-500">${finished ? 'Completed! +50 XP' : `${done}/${total} questions`}</p>
          </div>
        </div>
        ${!finished ? `<a href="#/daily" class="text-xs font-bold text-amber-400 hover:text-amber-300 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 transition-all hover:bg-amber-500/20">Play</a>` : `<span class="badge badge-xp">+${ch.totalXP} XP</span>`}
      </div>
      <div class="xp-bar-bg"><div class="xp-bar-fill" style="width:${pct}%;${finished ? 'background:linear-gradient(90deg,#10b981,#34d399)' : ''}"></div></div>
    </div>`;
  },

  renderPage() {
    const ch = this.getTodayChallenge();
    const qs = ch.questions || [];
    let rows = qs.map((q, i) => {
      const icon = q.typeConfig ? q.typeConfig.icon : '?';
      const name = q.typeConfig ? q.typeConfig.name : q.type;
      const done = q.completed;
      return `
      <div class="glass rounded-xl p-4 flex items-center gap-4 ${done ? 'opacity-60' : 'glass-hover cursor-pointer'}" ${!done ? `onclick="PTE.Daily.startQuestion(${i})"` : ''}>
        <div class="w-10 h-10 rounded-lg flex items-center justify-center text-xl ${done ? 'bg-emerald-500/20' : 'bg-indigo-500/20'}">${done ? '✅' : icon}</div>
        <div class="flex-1">
          <p class="text-sm font-medium ${done ? 'text-gray-500' : 'text-white'}">${name}</p>
          <p class="text-xs text-gray-600">${done ? `Score: ${q.score}/90` : 'Tap to start'}</p>
        </div>
        <span class="text-xs font-bold ${done ? 'text-emerald-400' : 'text-gray-500'}">${i + 1}/${qs.length}</span>
      </div>`;
    }).join('');

    return `
    ${PTE.UI.navbar('home')}
    <main class="min-h-screen py-10 px-4">
      <div class="max-w-2xl mx-auto">
        <div class="mb-8 text-center">
          <span class="text-5xl mb-3 block animate-float">${ch.finished ? '🎉' : '⚡'}</span>
          <h1 class="text-3xl font-bold text-white mb-2">Daily Challenge</h1>
          <p class="text-gray-500">${ch.finished ? 'All done for today! Come back tomorrow.' : 'Complete all 5 questions to earn bonus XP'}</p>
        </div>
        <div class="space-y-3">${rows}</div>
        ${ch.finished ? `<div class="mt-6 text-center"><a href="#/" class="text-indigo-400 text-sm font-medium hover:text-indigo-300">Back to Home</a></div>` : ''}
      </div>
    </main>`;
  },

  startQuestion(index) {
    this._activeIndex = index;
    const ch = this.getTodayChallenge();
    const q = ch.questions[index];
    if (!q || q.completed) return;
    PTE.App.currentType = q.type;
    PTE.App.currentTypeConfig = q.typeConfig;
    PTE.App.currentQuestions = [q.question];
    PTE.App.currentQuestionIndex = 0;
    PTE.App.currentQuestion = q.question;
    PTE.App._dailyMode = true;
    PTE.App._dailyIndex = index;
    const root = document.getElementById('app-root');
    root.innerHTML = PTE.Pages.practiceQuestion(q.type, false);
    PTE.App.loadQuestion(0);
  }
};
