/**
 * Crack PTE - Smart Practice Mode
 * Automatically generates a personalized practice session
 * targeting the user's weakest areas and least-practiced types
 */
window.PTE = window.PTE || {};

PTE.SmartPractice = {
  SESSION_SIZE: 10,
  currentPlan: null,
  currentIndex: 0,
  active: false,

  generatePlan() {
    const sessions = PTE.Store.getAll().sessions || [];
    const stats = PTE.Store.getStats();
    const types = Object.values(PTE.QUESTION_TYPES);
    const plan = [];

    // Score each type by weakness (lower = more needed)
    const typeAnalysis = types.map(type => {
      const typeSessions = sessions.filter(s => s.type === type.id);
      const avgScore = typeSessions.length > 0
        ? typeSessions.slice(0, 10).reduce((a, b) => a + b.overallScore, 0) / Math.min(typeSessions.length, 10)
        : 0;
      const completionMap = PTE.Store.getCompletionMap(type.id);
      const allQuestions = [...(PTE.Questions[type.id] || []), ...(PTE.Predictions && PTE.Predictions[type.id] || [])];
      const unattempted = allQuestions.filter(q => !completionMap[q.id]);
      const lowScoring = allQuestions.filter(q => completionMap[q.id] && completionMap[q.id].bestScore < 55);

      // Priority formula: unpracticed types > low scoring > less practiced
      let priority = 100 - avgScore;
      if (typeSessions.length === 0) priority += 50;
      else if (typeSessions.length < 5) priority += 20;
      if (lowScoring.length > 3) priority += 15;

      return {
        type,
        avgScore: Math.round(avgScore),
        totalSessions: typeSessions.length,
        unattempted,
        lowScoring,
        allQuestions,
        completionMap,
        priority
      };
    }).sort((a, b) => b.priority - a.priority);

    let remaining = this.SESSION_SIZE;

    // Phase 1: Pick from weakest types first (at least 1 from top 3)
    const topWeakTypes = typeAnalysis.slice(0, 3);
    for (const ta of topWeakTypes) {
      if (remaining <= 0) break;
      const count = Math.min(remaining, Math.max(1, Math.ceil(this.SESSION_SIZE * 0.25)));
      const picked = this._pickQuestions(ta, count);
      picked.forEach(q => {
        plan.push({ type: ta.type, question: q, reason: this._getReason(ta, q) });
      });
      remaining -= picked.length;
    }

    // Phase 2: Fill remaining from other types
    for (const ta of typeAnalysis.slice(3)) {
      if (remaining <= 0) break;
      const picked = this._pickQuestions(ta, Math.min(remaining, 2));
      picked.forEach(q => {
        plan.push({ type: ta.type, question: q, reason: this._getReason(ta, q) });
      });
      remaining -= picked.length;
    }

    // Phase 3: If still not full, add more from weakest
    if (remaining > 0) {
      for (const ta of typeAnalysis) {
        if (remaining <= 0) break;
        const alreadyPicked = new Set(plan.filter(p => p.type.id === ta.type.id).map(p => p.question.id));
        const extra = this._pickQuestions(ta, remaining, alreadyPicked);
        extra.forEach(q => {
          plan.push({ type: ta.type, question: q, reason: 'Additional practice' });
        });
        remaining -= extra.length;
      }
    }

    // Shuffle slightly to avoid monotony (but keep weakest first tendency)
    for (let i = plan.length - 1; i > 1; i--) {
      const j = Math.max(1, Math.floor(Math.random() * i));
      [plan[i], plan[j]] = [plan[j], plan[i]];
    }

    return { plan, analysis: typeAnalysis };
  },

  _pickQuestions(typeAnalysis, count, exclude) {
    const picked = [];
    const excludeSet = exclude || new Set();

    // Priority: unattempted first, then low-scoring, then random
    const candidates = [
      ...typeAnalysis.unattempted.filter(q => !excludeSet.has(q.id)),
      ...typeAnalysis.lowScoring.filter(q => !excludeSet.has(q.id)),
      ...typeAnalysis.allQuestions.filter(q => !excludeSet.has(q.id))
    ];

    const seen = new Set();
    for (const q of candidates) {
      if (picked.length >= count) break;
      if (seen.has(q.id)) continue;
      seen.add(q.id);
      picked.push(q);
    }

    return picked;
  },

  _getReason(typeAnalysis, question) {
    if (typeAnalysis.totalSessions === 0) return 'Never practiced this type';
    const completion = typeAnalysis.completionMap[question.id];
    if (!completion) return 'New question';
    if (completion.bestScore < 55) return `Low score: ${completion.bestScore}/90`;
    if (completion.bestScore < 70) return `Room to improve: ${completion.bestScore}/90`;
    return 'Practice for mastery';
  },

  renderPage() {
    const { plan, analysis } = this.generatePlan();

    if (plan.length === 0) {
      return `
      ${PTE.UI.navbar('smart-practice')}
      <main class="min-h-screen py-10 px-4">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-2xl font-semibold text-zinc-100 mb-2">Smart Practice</h1>
          ${PTE.UI.emptyState('🧠', 'No Questions Available', 'Your question bank appears empty.', 'Go Home', '#/')}
        </div>
      </main>`;
    }

    // Analysis summary
    const weakest = analysis.filter(a => a.totalSessions > 0).sort((a, b) => a.avgScore - b.avgScore).slice(0, 3);
    const unpracticed = analysis.filter(a => a.totalSessions === 0);

    let insightHtml = '';
    if (unpracticed.length > 0) {
      insightHtml += `<div class="flex items-center gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10 mb-2">
        <span class="text-amber-400 text-sm">⚠️</span>
        <p class="text-xs text-amber-400">You haven't practiced: <span class="font-semibold">${unpracticed.map(a => a.type.shortName).join(', ')}</span></p>
      </div>`;
    }
    if (weakest.length > 0 && weakest[0].avgScore < 55) {
      insightHtml += `<div class="flex items-center gap-2 p-3 rounded-lg bg-rose-500/5 border border-rose-500/10 mb-2">
        <span class="text-rose-400 text-sm">🎯</span>
        <p class="text-xs text-rose-400">Weakest area: <span class="font-semibold">${weakest[0].type.name}</span> (avg ${weakest[0].avgScore}/90)</p>
      </div>`;
    }

    const planCards = plan.map((item, i) => {
      const q = item.question;
      const preview = q.text ? q.text.slice(0, 80) + (q.text.length > 80 ? '...' : '')
        : q.scenario ? q.scenario.slice(0, 80) + (q.scenario.length > 80 ? '...' : '')
        : q.speakers ? q.speakers[0].text.slice(0, 80) + '...'
        : q.answer || 'Question';

      return `
      <div class="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-[var(--border)] hover:border-[rgba(109,92,255,0.2)] transition-colors">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 font-semibold font-mono" style="background:${item.type.color}11;color:${item.type.color}">${i + 1}</div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-0.5">
            <span class="text-sm">${item.type.icon}</span>
            <p class="text-xs font-medium text-zinc-200 truncate">${item.type.name}</p>
          </div>
          <p class="text-[10px] text-zinc-500 truncate">${preview}</p>
        </div>
        <span class="text-[9px] px-2 py-0.5 rounded-full bg-white/[0.03] text-zinc-500 border border-[var(--border)] flex-shrink-0">${item.reason}</span>
      </div>`;
    }).join('');

    return `
    ${PTE.UI.navbar('smart-practice')}
    <main class="min-h-screen py-10 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="mb-6">
          <h1 class="text-2xl font-semibold text-zinc-100 mb-1">Smart Practice</h1>
          <p class="text-sm text-zinc-500">Personalized session targeting your weakest areas.</p>
        </div>

        ${insightHtml}

        <!-- Session Plan -->
        <div class="card-elevated rounded-xl overflow-hidden mb-6">
          <div class="bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-white font-semibold text-sm">Your Personalized Session</h3>
                <p class="text-white/50 text-xs mt-0.5">${plan.length} questions across ${new Set(plan.map(p => p.type.id)).size} question types</p>
              </div>
              <button onclick="PTE.SmartPractice.startSession()" class="px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white font-semibold text-sm rounded-xl transition-colors">
                Start Session
              </button>
            </div>
          </div>
          <div class="p-4 space-y-2">${planCards}</div>
        </div>

        <!-- Type Coverage -->
        <div class="card rounded-xl p-5">
          <h3 class="text-sm font-semibold text-zinc-200 mb-3">Your Type Coverage</h3>
          <div class="space-y-2">
            ${analysis.map(a => `
            <div class="flex items-center gap-3">
              <span class="text-base w-7 text-center">${a.type.icon}</span>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-0.5">
                  <span class="text-xs text-zinc-300">${a.type.shortName}</span>
                  <span class="text-[10px] text-zinc-500 font-mono">${a.totalSessions === 0 ? 'Not started' : a.avgScore + '/90 avg'}</span>
                </div>
                <div class="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                  <div class="h-full rounded-full" style="width:${a.totalSessions === 0 ? 0 : (a.avgScore / 90) * 100}%;background:${a.type.color}"></div>
                </div>
              </div>
              <span class="text-[10px] font-mono text-zinc-600 w-8 text-right">${a.totalSessions}</span>
            </div>`).join('')}
          </div>
        </div>

        <div class="mt-6 text-center">
          <button onclick="location.reload()" class="text-xs text-zinc-500 hover:text-[var(--accent-light)] transition-colors">Regenerate Plan</button>
        </div>
      </div>
    </main>`;
  },

  startSession() {
    const { plan } = this.generatePlan();
    if (plan.length === 0) return;

    this.currentPlan = plan;
    this.currentIndex = 0;
    this.active = true;

    this._launchQuestion();
  },

  _launchQuestion() {
    if (!this.currentPlan || this.currentIndex >= this.currentPlan.length) {
      this.active = false;
      this._showComplete();
      return;
    }

    const item = this.currentPlan[this.currentIndex];
    const typeId = item.type.id;
    const questionId = item.question.id;

    // Check which bank has the question
    const inRegular = (PTE.Questions[typeId] || []).some(q => String(q.id) === String(questionId));
    const inPred = ((PTE.Predictions && PTE.Predictions[typeId]) || []).some(q => String(q.id) === String(questionId));

    // Store the smart practice state so we can show "Next (Smart)" after scoring
    PTE.App._smartPracticeActive = true;
    PTE.App._smartPracticeNext = () => {
      this.currentIndex++;
      this._launchQuestion();
    };

    if (inRegular) {
      PTE.App.startPractice(typeId, false, questionId);
    } else if (inPred) {
      PTE.App.startPractice(typeId, true, questionId);
    } else {
      this.currentIndex++;
      this._launchQuestion();
    }
  },

  _showComplete() {
    PTE.App._smartPracticeActive = false;
    PTE.App._smartPracticeNext = null;

    const root = document.getElementById('app-root');
    const sessions = PTE.Store.getRecentSessions(this.currentPlan ? this.currentPlan.length : 10);
    const avgScore = sessions.length > 0
      ? Math.round(sessions.reduce((a, b) => a + b.overallScore, 0) / sessions.length)
      : 0;

    root.innerHTML = `
    ${PTE.UI.navbar('smart-practice')}
    <main class="min-h-screen py-10 px-4">
      <div class="max-w-lg mx-auto text-center py-12">
        <div class="text-5xl mb-4">🎉</div>
        <h2 class="text-2xl font-semibold text-zinc-100 mb-2">Smart Session Complete!</h2>
        <p class="text-sm text-zinc-500 mb-8">You completed ${this.currentPlan ? this.currentPlan.length : 0} targeted questions.</p>
        <div class="card rounded-xl p-6 mb-6">
          <p class="text-3xl font-bold font-mono text-[var(--accent-light)]">${avgScore}</p>
          <p class="text-xs text-zinc-500 mt-1">Average Score</p>
        </div>
        <div class="flex justify-center gap-3">
          <a href="#/smart-practice" class="btn-primary px-5 py-2.5 text-sm">New Session</a>
          <a href="#/progress" class="btn-secondary px-5 py-2.5 text-sm">View Progress</a>
          <a href="#/" class="btn-secondary px-5 py-2.5 text-sm">Home</a>
        </div>
      </div>
    </main>`;

    this.currentPlan = null;
    this.currentIndex = 0;
  },

  renderCard() {
    const stats = PTE.Store.getStats();
    const types = Object.values(PTE.QUESTION_TYPES);
    const weak = types.filter(t => stats[t.id] && stats[t.id].averageScore < 55);
    const unpracticed = types.filter(t => !stats[t.id]);
    const focusCount = weak.length + unpracticed.length;

    return `
    <a href="#/smart-practice" class="block group">
      <div class="card card-hover rounded-xl p-4">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center"><span class="text-lg">🧠</span></div>
          <div>
            <h3 class="text-sm font-semibold text-zinc-200 group-hover:text-cyan-400 transition-colors">Smart Practice</h3>
            <p class="text-[10px] text-zinc-500">${focusCount > 0 ? focusCount + ' areas need attention' : 'Personalized session'}</p>
          </div>
        </div>
      </div>
    </a>`;
  }
};
