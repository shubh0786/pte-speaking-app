/**
 * PTE Academic — Writing Module Pages
 * Practice selection + question pages for SWT and WE
 */

window.PTE = window.PTE || {};

PTE.WritingPages = {
  practice() {
    const types = Object.values(PTE.WRITING_TYPES);
    const typeCards = types.map(t => {
      const qCount = PTE.WritingQuestions[t.id] ? PTE.WritingQuestions[t.id].length : 0;
      return `
      <a href="#/writing/${t.id}" class="block group">
        <div class="card card-hover rounded-xl p-5 transition-all">
          <div class="flex items-start justify-between mb-3">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style="background:${t.color}11">${t.icon}</div>
            <span class="text-[10px] font-semibold font-mono px-2 py-0.5 rounded-full" style="background:${t.color}11;color:${t.color}">${t.shortName}</span>
          </div>
          <h3 class="font-semibold text-zinc-200 text-sm mb-1 group-hover:text-[var(--accent-light)] transition-colors">${t.name}</h3>
          <p class="text-xs text-zinc-500 mb-2 line-clamp-2">${t.description}</p>
          <div class="flex items-center gap-1.5 text-[10px] text-zinc-600">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Time: ${Math.round(t.answerTime/60)} min · ${t.minWords}-${t.maxWords} words
          </div>
          <div class="mt-2 text-[10px] text-zinc-600">${qCount} questions</div>
        </div>
      </a>`;
    }).join('');

    return `
    ${PTE.UI.navbar('writing')}
    <main class="min-h-screen py-10 px-4">
      <div class="max-w-5xl mx-auto">
        <div class="mb-8">
          <h1 class="text-xl font-semibold text-zinc-100 tracking-tight mb-1">Writing Practice</h1>
          <p class="text-sm text-zinc-500">Choose a writing task to begin practicing.</p>
        </div>
        <div class="grid sm:grid-cols-2 gap-3 stagger">${typeCards}</div>
      </div>
    </main>`;
  },

  practiceQuestion(typeId) {
    const typeConfig = Object.values(PTE.WRITING_TYPES).find(t => t.id === typeId);
    if (!typeConfig) {
      return `${PTE.UI.navbar('writing')}<main class="min-h-screen py-10 px-4"><div class="max-w-4xl mx-auto">${PTE.UI.emptyState('🔍', 'Not Found', 'Question type not found.', 'Back', '#/writing')}</div></main>`;
    }
    const questions = PTE.WritingQuestions[typeId] || [];
    if (questions.length === 0) {
      return `${PTE.UI.navbar('writing')}<main class="min-h-screen py-10 px-4"><div class="max-w-4xl mx-auto">${PTE.UI.emptyState('📝', 'No Questions', 'Coming soon.', 'Back', '#/writing')}</div></main>`;
    }

    if (!this._currentIndex) this._currentIndex = {};
    if (this._currentIndex[typeId] === undefined) this._currentIndex[typeId] = 0;
    const idx = this._currentIndex[typeId];
    const question = questions[idx % questions.length];

    return `
    ${PTE.UI.navbar('writing')}
    <main class="min-h-screen py-6 px-4">
      <div class="max-w-2xl mx-auto">
        <div class="flex items-center gap-3 mb-5">
          <a href="#/writing" class="text-zinc-500 hover:text-zinc-300 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </a>
          <div class="w-8 h-8 rounded-lg flex items-center justify-center text-base" style="background:${typeConfig.color}11">${typeConfig.icon}</div>
          <div>
            <h1 class="text-base font-semibold text-zinc-200">${typeConfig.name}</h1>
            <p class="text-[10px] text-zinc-500">Question ${idx + 1} of ${questions.length}</p>
          </div>
          <div class="ml-auto flex items-center gap-2">
            <button class="btn-secondary text-xs px-3 py-1.5" onclick="PTE.WritingPages.prevQuestion('${typeId}')">Prev</button>
            <button class="btn-secondary text-xs px-3 py-1.5" onclick="PTE.WritingPages.nextQuestion('${typeId}')">Next</button>
          </div>
        </div>

        <details class="mb-4">
          <summary class="text-xs text-zinc-500 cursor-pointer hover:text-zinc-400">Tips</summary>
          ${PTE.UI.tipsPanel(typeConfig.tips)}
        </details>

        <div id="writing-question-area"></div>
      </div>
    </main>`;
  },

  initQuestion(typeId) {
    if (!this._currentIndex) this._currentIndex = {};
    const idx = this._currentIndex[typeId] || 0;
    const questions = PTE.WritingQuestions[typeId] || [];
    const question = questions[idx % questions.length];
    if (question) PTE.WritingEngine.start(typeId, question, 'writing-question-area');
  },

  nextQuestion(typeId) {
    if (!this._currentIndex) this._currentIndex = {};
    const questions = PTE.WritingQuestions[typeId] || [];
    this._currentIndex[typeId] = ((this._currentIndex[typeId] || 0) + 1) % questions.length;
    PTE.WritingEngine.cleanup();
    PTE.App.renderPage('writing-question', typeId);
  },

  prevQuestion(typeId) {
    if (!this._currentIndex) this._currentIndex = {};
    const questions = PTE.WritingQuestions[typeId] || [];
    const cur = this._currentIndex[typeId] || 0;
    this._currentIndex[typeId] = cur > 0 ? cur - 1 : questions.length - 1;
    PTE.WritingEngine.cleanup();
    PTE.App.renderPage('writing-question', typeId);
  }
};
