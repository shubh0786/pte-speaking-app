/**
 * Crack PTE - Study Planner
 * Set target score, exam date, get daily practice plan
 */
window.PTE = window.PTE || {};

PTE.Planner = {
  STORAGE_KEY: 'crackpte_planner',

  TARGETS: {
    50: { label:'PTE 50 (B1)', daily:{ 'read-aloud':2,'repeat-sentence':3,'describe-image':1,'retell-lecture':1,'answer-short-question':3,'summarize-group-discussion':0,'respond-to-situation':0 }},
    65: { label:'PTE 65 (B2)', daily:{ 'read-aloud':3,'repeat-sentence':5,'describe-image':2,'retell-lecture':1,'answer-short-question':4,'summarize-group-discussion':1,'respond-to-situation':1 }},
    79: { label:'PTE 79+ (C1)', daily:{ 'read-aloud':4,'repeat-sentence':6,'describe-image':2,'retell-lecture':2,'answer-short-question':5,'summarize-group-discussion':1,'respond-to-situation':1 }},
  },

  getData() { try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || null; } catch(e) { return null; } },
  save(data) { try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data)); } catch(e) {} },

  getDaysLeft() {
    const data = this.getData();
    if (!data || !data.examDate) return null;
    const diff = new Date(data.examDate) - new Date();
    return Math.max(0, Math.ceil(diff / 86400000));
  },

  getTodayPlan() {
    const data = this.getData();
    if (!data) return null;
    const target = this.TARGETS[data.targetScore];
    if (!target) return null;

    // Check today's completion
    const today = new Date().toISOString().split('T')[0];
    const sessions = PTE.Store.getAll().sessions.filter(s => {
      if (!s.timestamp) return false;
      return new Date(s.timestamp).toISOString().split('T')[0] === today;
    });

    const plan = {};
    let totalTodo = 0, totalDone = 0;
    for (const [type, count] of Object.entries(target.daily)) {
      if (count === 0) continue;
      const done = sessions.filter(s => s.type === type).length;
      plan[type] = { needed: count, done: Math.min(done, count), remaining: Math.max(0, count - done) };
      totalTodo += count;
      totalDone += Math.min(done, count);
    }

    return { plan, totalTodo, totalDone, pct: totalTodo > 0 ? Math.round((totalDone / totalTodo) * 100) : 0 };
  },

  renderCard() {
    const data = this.getData();
    if (!data) return `
    <a href="#/planner" class="block card rounded-xl p-5 border-[rgba(109,92,255,0.12)] card-hover transition-all">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-xl shadow-lg">📋</div>
        <div class="flex-1">
          <h3 class="font-semibold text-zinc-100 text-sm">Study Planner</h3>
          <p class="text-xs text-zinc-500">Set your target score and exam date</p>
        </div>
        <span class="text-xs font-semibold text-[var(--accent-light)] px-3 py-1.5 rounded-lg bg-[var(--accent-surface)] border border-[rgba(109,92,255,0.12)]">Setup</span>
      </div>
    </a>`;

    const daysLeft = this.getDaysLeft();
    const tp = this.getTodayPlan();
    const pct = tp ? tp.pct : 0;

    return `
    <a href="#/planner" class="block card rounded-xl p-5 ${pct >= 100 ? 'border-emerald-500/30' : 'border-[rgba(109,92,255,0.12)]'} card-hover transition-all">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl bg-gradient-to-br ${pct >= 100 ? 'from-emerald-500 to-teal-600' : 'from-purple-500 to-pink-600'} flex items-center justify-center text-xl shadow-lg">${pct >= 100 ? '✅' : '📋'}</div>
          <div>
            <h3 class="font-semibold text-zinc-100 text-sm">Today's Plan</h3>
            <p class="text-xs text-zinc-500">Target: ${data.targetScore}+ ${daysLeft !== null ? `• ${daysLeft} days left` : ''}</p>
          </div>
        </div>
        <span class="text-sm font-extrabold font-mono ${pct >= 100 ? 'text-emerald-400' : 'text-purple-400'}">${pct}%</span>
      </div>
      <div class="xp-bar-bg"><div class="xp-bar-fill" style="width:${pct}%;${pct >= 100 ? 'background:linear-gradient(90deg,#10b981,#34d399)' : ''}"></div></div>
    </a>`;
  },

  renderPage() {
    const data = this.getData();

    if (!data) {
      return `
      ${PTE.UI.navbar('planner')}
      <main class="min-h-screen py-10 px-4">
        <div class="max-w-md mx-auto">
          <div class="text-center mb-8">
            <span class="text-5xl mb-3 block">📋</span>
            <h1 class="text-3xl font-semibold text-zinc-100 mb-2">Study Planner</h1>
            <p class="text-zinc-500">Set your target and I'll create a daily practice plan for you.</p>
          </div>
          <div class="card-elevated rounded-xl p-6 space-y-5">
            <div>
              <label class="text-sm font-semibold text-zinc-300 mb-2 block">Target Score</label>
              <div class="grid grid-cols-3 gap-3">
                ${Object.entries(this.TARGETS).map(([score, cfg]) => `
                  <button onclick="document.querySelectorAll('.target-btn').forEach(b=>b.classList.remove('border-[var(--accent)]','text-[var(--accent-light)]'));this.classList.add('border-[var(--accent)]','text-[var(--accent-light)]');document.getElementById('target-score').value=${score}" class="target-btn py-3 rounded-xl card border border-[var(--border)] text-center text-sm font-semibold text-zinc-400 hover:border-[rgba(109,92,255,0.3)] transition-all">
                    ${score}+<br><span class="text-xs font-normal text-zinc-600">${cfg.label.split('(')[1]?.replace(')','') || ''}</span>
                  </button>
                `).join('')}
              </div>
              <input type="hidden" id="target-score" value="65">
            </div>
            <div>
              <label class="text-sm font-semibold text-zinc-300 mb-2 block">Exam Date</label>
              <input type="date" id="exam-date" class="w-full bg-white/[0.02] border border-[var(--border)] rounded-xl px-4 py-3 text-zinc-100 focus:border-[var(--accent)] outline-none">
            </div>
            <button onclick="PTE.Planner.savePlan()" class="w-full py-3.5 rounded-xl bg-gradient-to-r from-[var(--accent)] to-purple-600 text-zinc-100 font-semibold hover:opacity-90 transition-all">Create My Plan</button>
          </div>
        </div>
      </main>`;
    }

    // Show plan
    const daysLeft = this.getDaysLeft();
    const tp = this.getTodayPlan();
    const types = Object.values(PTE.QUESTION_TYPES);

    let planRows = '';
    if (tp) {
      for (const [typeId, info] of Object.entries(tp.plan)) {
        const tc = types.find(t => t.id === typeId);
        if (!tc) continue;
        const done = info.done >= info.needed;
        planRows += `
        <div class="flex items-center gap-3 py-3 border-b border-[var(--border)]">
          <span class="text-lg">${tc.icon}</span>
          <div class="flex-1">
            <p class="text-sm font-medium ${done ? 'text-zinc-500 line-through' : 'text-zinc-100'}">${tc.name}</p>
            <p class="text-xs text-zinc-600">${info.done}/${info.needed} done</p>
          </div>
          ${done ? '<span class="text-emerald-400 text-sm">✅</span>' : `<a href="#/practice/${typeId}" class="text-xs font-semibold text-[var(--accent-light)] px-3 py-1.5 rounded-lg bg-[var(--accent-surface)] border border-[rgba(109,92,255,0.12)] hover:bg-[var(--accent-surface)] transition-all">Practice</a>`}
        </div>`;
      }
    }

    return `
    ${PTE.UI.navbar('planner')}
    <main class="min-h-screen py-10 px-4">
      <div class="max-w-2xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-semibold text-zinc-100 mb-2">Study Planner</h1>
          <div class="flex items-center justify-center gap-4 text-sm">
            <span class="badge badge-level">Target: ${data.targetScore}+</span>
            ${daysLeft !== null ? `<span class="badge badge-streak">${daysLeft} days left</span>` : ''}
          </div>
        </div>

        ${tp ? `
        <div class="card-elevated rounded-xl p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-zinc-100">Today's Plan</h3>
            <span class="text-lg font-extrabold font-mono ${tp.pct >= 100 ? 'text-emerald-400' : 'text-[var(--accent-light)]'}">${tp.pct}%</span>
          </div>
          <div class="xp-bar-bg mb-4"><div class="xp-bar-fill" style="width:${tp.pct}%"></div></div>
          ${planRows}
        </div>` : ''}

        <div class="text-center">
          <button onclick="localStorage.removeItem('crackpte_planner');PTE.App.renderPage('planner')" class="text-xs text-zinc-600 hover:text-rose-400 transition-colors">Reset Plan</button>
        </div>
      </div>
    </main>`;
  },

  savePlan() {
    const score = parseInt(document.getElementById('target-score').value) || 65;
    const date = document.getElementById('exam-date').value;
    this.save({ targetScore: score, examDate: date || null, created: Date.now() });
    PTE.App.renderPage('planner');
  }
};
