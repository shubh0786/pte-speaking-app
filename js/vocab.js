/**
 * Crack PTE - Vocabulary Builder (Flashcard drills for ASQ)
 * No microphone needed - practice anywhere
 */
window.PTE = window.PTE || {};

PTE.Vocab = {
  STORAGE_KEY: 'crackpte_vocab',
  currentIndex: 0,
  flipped: false,
  filter: 'all', // all, unlearned, mastered

  getData() {
    try { const d = localStorage.getItem(this.STORAGE_KEY); return d ? JSON.parse(d) : {}; } catch(e) { return {}; }
  },
  save(data) { try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data)); } catch(e) {} },

  getCards() {
    const asq = PTE.Questions['answer-short-question'] || [];
    const data = this.getData();
    return asq.map(q => ({
      ...q,
      mastered: !!data[q.id],
      attempts: (data[q.id] || {}).attempts || 0,
      correct: (data[q.id] || {}).correct || 0
    }));
  },

  getFiltered() {
    const cards = this.getCards();
    if (this.filter === 'mastered') return cards.filter(c => c.mastered);
    if (this.filter === 'unlearned') return cards.filter(c => !c.mastered);
    return cards;
  },

  markCard(id, knew) {
    const data = this.getData();
    if (!data[id]) data[id] = { attempts: 0, correct: 0 };
    data[id].attempts++;
    if (knew) {
      data[id].correct++;
      if (data[id].correct >= 2) data[id].mastered = true;
    } else {
      data[id].correct = Math.max(0, data[id].correct - 1);
      data[id].mastered = false;
    }
    this.save(data);
    if (PTE.Gamify && knew) {
      const r = PTE.Gamify.awardXP(knew ? 60 : 20, 'answer-short-question', false, false);
      PTE.Gamify.showToast(r);
    }
  },

  renderPage() {
    const allCards = this.getCards();
    const cards = this.getFiltered();
    const mastered = allCards.filter(c => c.mastered).length;
    const total = allCards.length;
    const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;

    if (cards.length === 0) {
      return `${PTE.UI.navbar('vocab')}
      <main class="min-h-screen py-10 px-4">
        <div class="max-w-2xl mx-auto text-center py-20">
          <span class="text-5xl mb-4 block">🎉</span>
          <h2 class="text-2xl font-bold text-white mb-2">${this.filter === 'unlearned' ? 'All Mastered!' : 'No Cards'}</h2>
          <p class="text-gray-500 mb-4">${this.filter === 'unlearned' ? 'You\'ve mastered all vocabulary cards!' : 'Switch filter to see cards.'}</p>
          <button onclick="PTE.Vocab.filter='all';PTE.App.renderPage('vocab')" class="text-indigo-400 font-medium">Show All Cards</button>
        </div>
      </main>`;
    }

    this.currentIndex = Math.min(this.currentIndex, cards.length - 1);
    const card = cards[this.currentIndex];
    const safeAnswer = (card.answer || '').replace(/'/g, "\\'");

    return `
    ${PTE.UI.navbar('vocab')}
    <main class="min-h-screen py-8 px-4">
      <div class="max-w-2xl mx-auto">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-2xl font-bold text-white">Vocabulary Builder</h1>
            <p class="text-sm text-gray-500">${mastered}/${total} mastered (${pct}%)</p>
          </div>
          <div class="flex gap-2">
            ${['all','unlearned','mastered'].map(f => `
              <button onclick="PTE.Vocab.filter='${f}';PTE.Vocab.currentIndex=0;PTE.App.renderPage('vocab')" 
                class="text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${this.filter===f ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-gray-500 hover:bg-white/5'}">${f.charAt(0).toUpperCase()+f.slice(1)}</button>
            `).join('')}
          </div>
        </div>

        <!-- Progress bar -->
        <div class="xp-bar-bg mb-6"><div class="xp-bar-fill" style="width:${pct}%"></div></div>

        <!-- Card counter -->
        <p class="text-center text-sm text-gray-500 mb-4">${this.currentIndex + 1} / ${cards.length}</p>

        <!-- Flashcard -->
        <div id="flashcard" onclick="PTE.Vocab.flip()" class="glass neon-border rounded-2xl p-8 min-h-[250px] flex flex-col items-center justify-center cursor-pointer transition-all hover:border-indigo-500/40 mb-6 select-none">
          <div id="card-front" class="${this.flipped ? 'hidden' : ''}">
            <p class="text-xs text-gray-500 uppercase tracking-wide mb-4">Question</p>
            <p class="text-lg text-white text-center leading-relaxed font-medium">${card.text}</p>
            <p class="text-xs text-gray-600 mt-6">Tap to reveal answer</p>
          </div>
          <div id="card-back" class="${this.flipped ? '' : 'hidden'}">
            <p class="text-xs text-emerald-400 uppercase tracking-wide mb-3">Answer</p>
            <p class="text-3xl font-extrabold text-emerald-400 text-center mb-4">${card.answer}</p>
            <button onclick="event.stopPropagation();PTE.pronounceWord('${safeAnswer}')" class="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-4 py-2 rounded-lg transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
              Pronounce
            </button>
            ${card.mastered ? '<span class="badge badge-xp mt-3">Mastered</span>' : ''}
          </div>
        </div>

        <!-- Action Buttons (visible only when flipped) -->
        <div id="card-actions" class="flex gap-4 justify-center ${this.flipped ? '' : 'invisible'}">
          <button onclick="PTE.Vocab.answer(false)" class="flex-1 max-w-[200px] py-4 rounded-xl font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all text-sm">
            ❌ Didn't Know
          </button>
          <button onclick="PTE.Vocab.answer(true)" class="flex-1 max-w-[200px] py-4 rounded-xl font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all text-sm">
            ✅ Knew It
          </button>
        </div>
      </div>
    </main>`;
  },

  flip() {
    this.flipped = !this.flipped;
    const front = document.getElementById('card-front');
    const back = document.getElementById('card-back');
    const actions = document.getElementById('card-actions');
    if (front) front.classList.toggle('hidden', this.flipped);
    if (back) back.classList.toggle('hidden', !this.flipped);
    if (actions) actions.classList.toggle('invisible', !this.flipped);
  },

  answer(knew) {
    const cards = this.getFiltered();
    const card = cards[this.currentIndex];
    if (card) this.markCard(card.id, knew);
    this.flipped = false;
    this.currentIndex = (this.currentIndex + 1) % Math.max(1, this.getFiltered().length);
    PTE.App.renderPage('vocab');
  }
};
