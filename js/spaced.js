/**
 * PTEverse - Spaced Repetition System
 * Auto-resurfaces weak questions at optimal intervals
 */
window.PTE = window.PTE || {};

PTE.Spaced = {
  STORAGE_KEY: 'crackpte_spaced',
  INTERVALS: [1, 3, 7, 14, 30], // days
  PASS_THRESHOLD: 70,
  WEAK_THRESHOLD: 50,

  getData() { try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || {}; } catch(e) { return {}; } },
  save(data) { try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data)); } catch(e) {} },

  trackResult(questionId, type, score) {
    const data = this.getData();
    const now = Date.now();
    if (!data[questionId]) {
      // Don't start tracking questions the user already finds easy
      if (score >= this.PASS_THRESHOLD) return;
      data[questionId] = { type, scores: [score], nextReview: now + 86400000, intervalIndex: 0, learned: false };
    } else {
      data[questionId].scores.push(score);
      // If they scored well on review, advance interval
      if (score >= this.PASS_THRESHOLD) {
        data[questionId].intervalIndex = Math.min(data[questionId].intervalIndex + 1, this.INTERVALS.length - 1);
        if (data[questionId].intervalIndex >= this.INTERVALS.length - 1) data[questionId].learned = true;
      } else {
        data[questionId].intervalIndex = 0; // Reset on failure
      }
      const days = this.INTERVALS[data[questionId].intervalIndex];
      data[questionId].nextReview = now + days * 86400000;
    }
    this.save(data);
  },

  _allTypes() {
    return [PTE.QUESTION_TYPES, PTE.WRITING_TYPES, PTE.READING_TYPES, PTE.LISTENING_TYPES]
      .flatMap(map => map ? Object.values(map) : []);
  },

  _findType(id) { return this._allTypes().find(t => t.id === id); },

  _findQuestion(typeId, qId) {
    const banks = [PTE.Questions, PTE.WritingQuestions, PTE.ReadingQuestions, PTE.ListeningQuestions];
    for (const b of banks) {
      if (!b || !b[typeId]) continue;
      const q = b[typeId].find(x => x.id === qId);
      if (q) return q;
    }
    if (PTE.Predictions && PTE.Predictions[typeId]) {
      const q = PTE.Predictions[typeId].find(x => x.id === qId);
      if (q) return q;
    }
    return null;
  },

  _practiceUrl(type, qId) {
    const m = type.module || 'speaking';
    const q = qId ? `?qid=${qId}` : '';
    if (m === 'writing') return `#/writing/${type.id}${q}`;
    if (m === 'reading') return `#/reading/${type.id}${q}`;
    if (m === 'listening') return `#/listening/${type.id}${q}`;
    return `#/practice/${type.id}${q}`;
  },

  getDueQuestions() {
    const data = this.getData();
    const now = Date.now();
    const due = [];
    for (const [qId, info] of Object.entries(data)) {
      if (info.learned) continue;
      if (info.nextReview <= now) {
        const question = this._findQuestion(info.type, qId);
        const tc = this._findType(info.type);
        if (question && tc) {
          due.push({ ...info, questionId: qId, question, typeConfig: tc, lastScore: info.scores[info.scores.length - 1] });
        }
      }
    }
    return due;
  },

  getDueCount() { return this.getDueQuestions().length; },

  renderCard() {
    const count = this.getDueCount();
    if (count === 0) return '';
    return `
    <a href="#/review" class="block card rounded-xl p-5 border-amber-500/20 card-hover transition-all">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-xl shadow-lg animate-pulse">🧠</div>
        <div class="flex-1">
          <h3 class="font-semibold text-zinc-100 text-sm">Review Due</h3>
          <p class="text-xs text-zinc-500">${count} weak question${count > 1 ? 's' : ''} to review</p>
        </div>
        <span class="text-xs font-semibold text-rose-400 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20">Review</span>
      </div>
    </a>`;
  },

  renderPage() {
    const due = this.getDueQuestions();
    const rows = due.map((item, i) => `
      <div class="card rounded-xl p-4 flex items-center gap-4 card-hover cursor-pointer" onclick="PTE.Spaced.startReview(${i})">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center text-lg bg-rose-500/20">${item.typeConfig ? item.typeConfig.icon : '?'}</div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-zinc-100 truncate">${item.typeConfig ? item.typeConfig.name : item.type}</p>
          <p class="text-xs text-zinc-600">Last score: <span class="font-mono">${item.lastScore}/90</span> • ${item.scores.length} attempt${item.scores.length > 1 ? 's' : ''}</p>
        </div>
        <span class="text-xs font-semibold text-rose-400">Review</span>
      </div>
    `).join('');

    return `
    ${PTE.UI.navbar('home')}
    <main class="min-h-screen py-10 px-4">
      <div class="max-w-2xl mx-auto">
        <div class="text-center mb-8">
          <span class="text-5xl mb-3 block">🧠</span>
          <h1 class="text-3xl font-semibold text-zinc-100 mb-2">Spaced Review</h1>
          <p class="text-zinc-500">${due.length > 0 ? `${due.length} question${due.length > 1 ? 's' : ''} due for review. Score 70+ to advance.` : 'No reviews due! Keep practicing and weak questions will appear here.'}</p>
        </div>
        <div class="space-y-3">${rows || '<div class="card rounded-xl p-8 text-center"><span class="text-4xl mb-3 block">✅</span><p class="text-zinc-500">All caught up! Come back later.</p></div>'}</div>
      </div>
    </main>`;
  },

  startReview(index) {
    const due = this.getDueQuestions();
    const item = due[index];
    if (!item) return;
    // Routes to the correct module page (speaking via startPractice, W/R/L via module pages)
    PTE.App.startRetry(item.type, item.questionId);
  }
};
