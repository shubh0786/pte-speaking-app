/**
 * Crack PTE - Spaced Repetition System
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
    if (score >= this.PASS_THRESHOLD) return; // only track weak results
    const data = this.getData();
    const now = Date.now();
    if (!data[questionId]) {
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

  getDueQuestions() {
    const data = this.getData();
    const now = Date.now();
    const due = [];
    for (const [qId, info] of Object.entries(data)) {
      if (info.learned) continue;
      if (info.nextReview <= now) {
        // Find the actual question object
        const bank = PTE.Questions[info.type] || [];
        const question = bank.find(q => q.id === qId);
        if (question) {
          const tc = Object.values(PTE.QUESTION_TYPES).find(t => t.id === info.type);
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
    <a href="#/review" class="block glass rounded-2xl p-5 border-amber-500/20 hover:border-amber-500/30 transition-all">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-xl shadow-lg animate-pulse">🧠</div>
        <div class="flex-1">
          <h3 class="font-bold text-white text-sm">Review Due</h3>
          <p class="text-xs text-gray-500">${count} weak question${count > 1 ? 's' : ''} to review</p>
        </div>
        <span class="text-xs font-bold text-rose-400 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20">Review</span>
      </div>
    </a>`;
  },

  renderPage() {
    const due = this.getDueQuestions();
    const rows = due.map((item, i) => `
      <div class="glass rounded-xl p-4 flex items-center gap-4 glass-hover cursor-pointer" onclick="PTE.Spaced.startReview(${i})">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center text-lg bg-rose-500/20">${item.typeConfig ? item.typeConfig.icon : '?'}</div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-white truncate">${item.typeConfig ? item.typeConfig.name : item.type}</p>
          <p class="text-xs text-gray-600">Last score: ${item.lastScore}/90 • ${item.scores.length} attempt${item.scores.length > 1 ? 's' : ''}</p>
        </div>
        <span class="text-xs font-bold text-rose-400">Review</span>
      </div>
    `).join('');

    return `
    ${PTE.UI.navbar('home')}
    <main class="min-h-screen py-10 px-4">
      <div class="max-w-2xl mx-auto">
        <div class="text-center mb-8">
          <span class="text-5xl mb-3 block">🧠</span>
          <h1 class="text-3xl font-bold text-white mb-2">Spaced Review</h1>
          <p class="text-gray-500">${due.length > 0 ? `${due.length} question${due.length > 1 ? 's' : ''} due for review. Score 70+ to advance.` : 'No reviews due! Keep practicing and weak questions will appear here.'}</p>
        </div>
        <div class="space-y-3">${rows || '<div class="glass rounded-2xl p-8 text-center"><span class="text-4xl mb-3 block">✅</span><p class="text-gray-500">All caught up! Come back later.</p></div>'}</div>
      </div>
    </main>`;
  },

  startReview(index) {
    const due = this.getDueQuestions();
    const item = due[index];
    if (!item) return;
    PTE.App.currentType = item.type;
    PTE.App.currentTypeConfig = item.typeConfig;
    PTE.App.currentQuestions = [item.question];
    PTE.App.currentQuestionIndex = 0;
    PTE.App.currentQuestion = item.question;
    const root = document.getElementById('app-root');
    root.innerHTML = PTE.Pages.practiceQuestion(item.type, false);
    PTE.App.loadQuestion(0);
  }
};
