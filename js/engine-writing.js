/**
 * PTE Academic — Writing Practice Engine
 * Handles text input, word counting, timer, and heuristic scoring for SWT and WE
 */

window.PTE = window.PTE || {};

PTE.WritingEngine = {
  timer: null,
  currentType: null,
  currentQuestion: null,

  start(typeId, question, containerId) {
    this.currentType = PTE.WRITING_TYPES[Object.keys(PTE.WRITING_TYPES).find(k => PTE.WRITING_TYPES[k].id === typeId)];
    this.currentQuestion = question;
    if (!this.currentType) return;

    const container = document.getElementById(containerId);
    if (!container) return;

    const isSWT = typeId === 'swt';
    const passage = isSWT ? `
      <div class="card rounded-xl p-5 mb-5">
        <h4 class="text-sm font-semibold text-zinc-200 mb-3">${question.title || 'Read the passage below'}</h4>
        <p class="text-sm text-zinc-400 leading-relaxed">${question.passage}</p>
      </div>` : `
      <div class="card rounded-xl p-5 mb-5">
        <p class="text-sm text-zinc-300 leading-relaxed">${question.prompt}</p>
      </div>`;

    container.innerHTML = `
      ${passage}
      <div class="writing-editor-wrap">
        <textarea id="writing-textarea" class="writing-editor" placeholder="${isSWT ? 'Write your one-sentence summary here...' : 'Write your essay here...'}" spellcheck="true"></textarea>
        <div class="writing-stats-bar">
          <div class="flex items-center gap-4">
            <span id="word-count" class="text-xs font-mono text-zinc-500">0 words</span>
            <span id="word-limit" class="text-xs font-mono text-zinc-600">${this.currentType.minWords}-${this.currentType.maxWords} required</span>
          </div>
          <div id="writing-timer" class="text-xs font-mono font-semibold text-[var(--accent-light)]"></div>
        </div>
      </div>
      <div id="writing-actions" class="flex items-center gap-3 mt-4">
        <button id="writing-submit-btn" class="btn-primary" onclick="PTE.WritingEngine.submit()">Submit Answer</button>
        <button class="btn-secondary text-sm" onclick="PTE.WritingEngine.clearText()">Clear</button>
      </div>
      <div id="writing-score-area" class="mt-6"></div>`;

    const textarea = document.getElementById('writing-textarea');
    textarea.addEventListener('input', () => this._updateWordCount());
    textarea.focus();

    this._startTimer();
  },

  _updateWordCount() {
    const textarea = document.getElementById('writing-textarea');
    const countEl = document.getElementById('word-count');
    const limitEl = document.getElementById('word-limit');
    if (!textarea || !countEl) return;
    const words = this._getWords(textarea.value);
    const count = words.length;
    countEl.textContent = `${count} word${count !== 1 ? 's' : ''}`;

    const min = this.currentType.minWords;
    const max = this.currentType.maxWords;
    if (count < min) {
      countEl.className = 'text-xs font-mono text-amber-400';
      if (limitEl) limitEl.textContent = `${min - count} more needed`;
    } else if (count > max) {
      countEl.className = 'text-xs font-mono text-red-400';
      if (limitEl) limitEl.textContent = `${count - max} over limit`;
    } else {
      countEl.className = 'text-xs font-mono text-green-400';
      if (limitEl) limitEl.textContent = `${min}-${max} required`;
    }
  },

  _getWords(text) {
    return text.trim().split(/\s+/).filter(w => w.length > 0);
  },

  _startTimer() {
    let remaining = this.currentType.answerTime;
    const timerEl = document.getElementById('writing-timer');
    const update = () => {
      const m = Math.floor(remaining / 60);
      const s = remaining % 60;
      if (timerEl) {
        timerEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
        if (remaining <= 60) timerEl.className = 'text-xs font-mono font-semibold text-red-400';
        else if (remaining <= 120) timerEl.className = 'text-xs font-mono font-semibold text-amber-400';
      }
    };
    update();
    this.timer = setInterval(() => {
      remaining--;
      update();
      if (remaining <= 0) {
        clearInterval(this.timer);
        this.submit();
      }
    }, 1000);
  },

  clearText() {
    const textarea = document.getElementById('writing-textarea');
    if (textarea) { textarea.value = ''; this._updateWordCount(); textarea.focus(); }
  },

  submit() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    const textarea = document.getElementById('writing-textarea');
    const text = textarea ? textarea.value.trim() : '';
    if (textarea) textarea.disabled = true;

    const submitBtn = document.getElementById('writing-submit-btn');
    if (submitBtn) submitBtn.disabled = true;

    const scores = this.currentType.id === 'swt' ? this.scoreSWT(text) : this.scoreEssay(text);
    this._renderScore(scores);
    this._saveSession(scores, text);
  },

  scoreSWT(text) {
    const words = this._getWords(text);
    const wordCount = words.length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const q = this.currentQuestion;

    let content = 0;
    if (q.keywords && wordCount >= 3) {
      const lower = text.toLowerCase();
      const matched = q.keywords.filter(k => lower.includes(k.toLowerCase())).length;
      const ratio = matched / q.keywords.length;
      if (ratio >= 0.5) content = 2;
      else if (ratio >= 0.25) content = 1;
    }

    let form = 2;
    if (sentences.length !== 1) form = Math.max(0, form - 1);
    if (wordCount < 5 || wordCount > 75) form = 0;
    else if (wordCount < 10 || wordCount > 65) form = Math.max(0, form - 1);

    let grammar = 2;
    if (!/^[A-Z]/.test(text)) grammar--;
    if (!/[.!?]\s*$/.test(text)) grammar--;
    const complexMarkers = ['which','although','while','whereas','because','since','thereby','thus','however','furthermore'];
    if (!complexMarkers.some(m => text.toLowerCase().includes(m))) grammar = Math.max(0, grammar - 1);

    let vocabulary = 2;
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const lexicalDensity = uniqueWords.size / Math.max(wordCount, 1);
    if (lexicalDensity < 0.5) vocabulary = 1;
    if (lexicalDensity < 0.3) vocabulary = 0;

    if (content === 0) return { content, form:0, grammar:0, vocabulary:0, overall:0, wordCount };

    const raw = content + form + grammar + vocabulary;
    const overall = Math.round((raw / 8) * 90);
    return { content, form, grammar, vocabulary, overall, wordCount };
  },

  scoreEssay(text) {
    const words = this._getWords(text);
    const wordCount = words.length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const q = this.currentQuestion;

    let content = 0;
    if (q.keywords && wordCount >= 50) {
      const lower = text.toLowerCase();
      const matched = q.keywords.filter(k => lower.includes(k.toLowerCase())).length;
      const ratio = matched / q.keywords.length;
      if (ratio >= 0.5) content = 3;
      else if (ratio >= 0.35) content = 2;
      else if (ratio >= 0.2) content = 1;
    }

    let form = 2;
    if (wordCount < 200 || wordCount > 300) form = 0;
    else if (wordCount < 220 || wordCount > 280) form = 1;

    let development = 0;
    if (paragraphs.length >= 3) development = 2;
    else if (paragraphs.length >= 2) development = 1;
    const linkingWords = ['however','furthermore','moreover','additionally','consequently','therefore','nevertheless','in conclusion','on the other hand','for example','for instance','in contrast'];
    const linkCount = linkingWords.filter(lw => text.toLowerCase().includes(lw)).length;
    if (linkCount < 2) development = Math.max(0, development - 1);

    let grammar = 2;
    if (!/^[A-Z]/.test(text)) grammar--;
    const avgSentLen = wordCount / Math.max(sentences.length, 1);
    if (avgSentLen > 35 || avgSentLen < 8) grammar = Math.max(0, grammar - 1);

    let generalLinguistic = 2;
    if (sentences.length < 5) generalLinguistic--;
    if (paragraphs.length < 2) generalLinguistic--;

    let vocabulary = 2;
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const lexicalDensity = uniqueWords.size / Math.max(wordCount, 1);
    if (lexicalDensity < 0.45) vocabulary = 1;
    if (lexicalDensity < 0.3) vocabulary = 0;

    let spelling = 2;

    if (content === 0) return { content, form:0, development:0, grammar:0, generalLinguistic:0, vocabulary:0, spelling:0, overall:0, wordCount };

    const raw = content + form + development + grammar + generalLinguistic + vocabulary + spelling;
    const overall = Math.round((raw / 15) * 90);
    return { content, form, development, grammar, generalLinguistic, vocabulary, spelling, overall, wordCount };
  },

  _renderScore(scores) {
    const area = document.getElementById('writing-score-area');
    if (!area) return;
    const band = PTE.Scoring.getBand(scores.overall);
    const isSWT = this.currentType.id === 'swt';

    const traits = isSWT
      ? [['Content',scores.content,2],['Form',scores.form,2],['Grammar',scores.grammar,2],['Vocabulary',scores.vocabulary,2]]
      : [['Content',scores.content,3],['Form',scores.form,2],['Development',scores.development,2],['Grammar',scores.grammar,2],['General Linguistic',scores.generalLinguistic,2],['Vocabulary',scores.vocabulary,2],['Spelling',scores.spelling,2]];

    const bars = traits.map(([label, score, max]) => {
      const pct = max > 0 ? (score / max) * 100 : 0;
      const ratio = max > 0 ? score / max : 0;
      const color = ratio >= 0.8 ? 'var(--success)' : ratio >= 0.5 ? 'var(--accent)' : ratio >= 0.3 ? 'var(--warning)' : 'var(--error)';
      return `<div><div class="flex justify-between items-center mb-1"><span class="text-xs font-medium text-zinc-400">${label}</span><span class="text-xs font-semibold font-mono" style="color:${color}">${score}/${max}</span></div><div class="h-1.5 bg-white/[0.04] rounded-full overflow-hidden"><div class="h-full rounded-full score-bar-animate" style="width:${pct}%;background:${color}"></div></div></div>`;
    }).join('');

    area.innerHTML = `
    <div class="card-elevated overflow-hidden max-w-md mx-auto animate-fadeIn">
      <div class="bg-gradient-to-r from-[#6d5cff] to-[#a78bfa] p-5 text-center">
        <p class="text-white/60 text-xs font-medium mb-1">${this.currentType.name} Score</p>
        <div class="relative inline-flex items-center justify-center my-2">
          <svg class="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="5"/>
            <circle cx="60" cy="60" r="52" fill="none" stroke="white" stroke-width="5" stroke-linecap="round" stroke-dasharray="326.73" stroke-dashoffset="${326.73*(1-scores.overall/90)}" class="score-circle-animate"/>
          </svg>
          <div class="absolute flex flex-col items-center">
            <span class="text-3xl font-bold text-white font-mono tabular-nums">${scores.overall}</span>
            <span class="text-[10px] text-white/40 font-mono">/90</span>
          </div>
        </div>
        <div class="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
          <span class="text-xs">${band.emoji}</span>
          <span class="text-white text-xs font-medium">${band.label}</span>
        </div>
        <p class="text-white/50 text-[10px] mt-2">${scores.wordCount} words written</p>
      </div>
      <div class="p-5">
        <h4 class="text-sm font-medium text-zinc-300 mb-3">Trait Scores</h4>
        <div class="space-y-3">${bars}</div>
      </div>
    </div>`;
  },

  _saveSession(scores, text) {
    if (!PTE.Store) return;
    PTE.Store.addSession({
      timestamp: Date.now(),
      date: new Date().toLocaleDateString(),
      type: this.currentType.id,
      questionId: this.currentQuestion.id,
      overallScore: scores.overall,
      scores,
      transcript: text.slice(0, 500),
      duration: this.currentType.answerTime
    });
    if (PTE.Gamify) PTE.Gamify.addXP(scores.overall >= 60 ? 25 : 10, this.currentType.id);
  },

  cleanup() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  }
};
