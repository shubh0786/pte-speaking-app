/**
 * Crack PTE - Weak Word Drill
 * Practice words you frequently mispronounce (from accent analysis)
 */
window.PTE = window.PTE || {};

PTE.WeakWords = {
  STORAGE_KEY: 'crackpte_weakwords',

  getData() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || { practiced: {}, mastered: {} };
    } catch (e) { return { practiced: {}, mastered: {} }; }
  },

  save(data) {
    try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
  },

  /**
   * Get words to drill from accent profile + AI feedback missed words
   */
  getWordsToDrill() {
    const words = [];
    const seen = new Set();

    // From accent analyzer
    if (PTE.AccentAnalyzer) {
      const profile = PTE.AccentAnalyzer.getProfile();
      if (profile && profile.recentProblemWords) {
        profile.recentProblemWords.forEach(pw => {
          if (!seen.has(pw.expected.toLowerCase())) {
            seen.add(pw.expected.toLowerCase());
            words.push({
              word: pw.expected,
              source: 'accent',
              sound: pw.sound || 'pronunciation',
              heard: pw.heard,
            });
          }
        });
      }
    }

    // From PROBLEM_WORDS if we have few
    if (words.length < 10 && PTE.AccentAnalyzer) {
      const profile = PTE.AccentAnalyzer.getProfile();
      const topSound = profile && profile.topSounds && profile.topSounds[0];
      if (topSound && PTE.AccentAnalyzer.PROBLEM_WORDS[topSound.sound]) {
        const problemList = PTE.AccentAnalyzer.PROBLEM_WORDS[topSound.sound];
        problemList.slice(0, 15).forEach(w => {
          if (!seen.has(w.toLowerCase())) {
            seen.add(w.toLowerCase());
            words.push({ word: w, source: 'bank', sound: topSound.sound || 'common' });
          }
        });
      }
    }

    // Fallback: common PTE problem words
    if (words.length < 5) {
      const fallback = ['the', 'think', 'three', 'through', 'very', 'right', 'light', 'water', 'with', 'government'];
      fallback.forEach(w => {
        if (!seen.has(w.toLowerCase())) {
          seen.add(w.toLowerCase());
          words.push({ word: w, source: 'fallback', sound: 'common' });
        }
      });
    }

    return words;
  },

  renderPage() {
    const words = this.getWordsToDrill();

    if (words.length === 0) {
      return `
      ${PTE.UI.navbar('weak-words')}
      <main class="min-h-screen py-10 px-4">
        <div class="max-w-3xl mx-auto text-center py-20">
          <span class="text-6xl mb-4 block animate-float">🎙️</span>
          <h2 class="text-2xl font-bold text-white mb-3">Weak Word Drill</h2>
          <p class="text-gray-500 mb-6 max-w-md mx-auto">Practice some speaking questions first. After a few attempts, we'll identify words you often mispronounce and show them here for targeted practice.</p>
          <a href="#/practice" class="btn-primary">Start Practicing</a>
          <p class="text-xs text-gray-600 mt-6">Or try the <a href="#/accent" class="text-indigo-400 hover:text-indigo-300">Accent Coach</a> for more analysis.</p>
        </div>
      </main>`;
    }

    const wordCards = words.map(w => {
      const safeWord = (w.word || '').replace(/'/g, "\\'");
      return `
      <div class="glass rounded-xl p-4 flex items-center justify-between gap-4 hover:border-indigo-500/20 transition-all group">
        <div class="flex items-center gap-3">
          <button onclick="PTE.pronounceWord('${safeWord}')" class="w-12 h-12 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-400 hover:bg-indigo-500/25 transition-colors flex-shrink-0 group-hover:scale-105">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
          </button>
          <div>
            <p class="font-bold text-white text-lg">${w.word}</p>
            ${w.sound ? `<span class="text-xs px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400">${w.sound}</span>` : ''}
            ${w.heard ? `<p class="text-xs text-gray-500 mt-1">Heard as: "${w.heard}"</p>` : ''}
          </div>
        </div>
        <p class="text-xs text-gray-500">Click 🔊 to hear</p>
      </div>`;
    }).join('');

    return `
    ${PTE.UI.navbar('weak-words')}
    <main class="min-h-screen py-10 px-4">
      <div class="max-w-3xl mx-auto">

        <!-- Header -->
        <div class="text-center mb-8">
          <span class="text-5xl mb-3 block animate-float">🎙️</span>
          <h1 class="text-3xl font-bold text-white mb-2">Weak Word Drill</h1>
          <p class="text-gray-500">Practice words you often mispronounce. Click the speaker to hear the correct pronunciation, then say it aloud.</p>
        </div>

        <!-- Instructions -->
        <div class="glass rounded-2xl p-4 mb-6 border border-indigo-500/20">
          <h3 class="text-sm font-bold text-indigo-400 mb-2">How to practice</h3>
          <ol class="text-sm text-gray-400 space-y-1 list-decimal list-inside">
            <li>Click the speaker icon to hear the correct pronunciation</li>
            <li>Repeat the word aloud clearly</li>
            <li>Focus on the sounds highlighted (e.g. "th", "r/l")</li>
          </ol>
        </div>

        <!-- Word Cards -->
        <div class="space-y-3">
          ${wordCards}
        </div>

        <!-- Link to Accent Coach -->
        <div class="mt-8 text-center">
          <a href="#/accent" class="text-indigo-400 hover:text-indigo-300 text-sm font-medium">View full Accent Coach profile →</a>
        </div>

      </div>
    </main>`;
  },
};
