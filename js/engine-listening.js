/**
 * PTE Academic — Listening Practice Engine
 * Handles TTS audio playback, answer collection, and scoring for all 8 listening types
 */

window.PTE = window.PTE || {};

PTE.ListeningEngine = {
  currentType: null,
  currentQuestion: null,
  audioPlayed: false,
  replayCount: 0,
  examMode: false,
  onExamSubmit: null,

  _examDone(overall, summary) {
    const cb = this.onExamSubmit;
    this.examMode = false;
    this.onExamSubmit = null;
    if (cb) cb({ overall, summary, typeId: this.currentType.id, questionId: this.currentQuestion.id });
  },

  render(typeId, question, containerId) {
    this.currentType = PTE.LISTENING_TYPES[Object.keys(PTE.LISTENING_TYPES).find(k => PTE.LISTENING_TYPES[k].id === typeId)];
    this.currentQuestion = question;
    this.audioPlayed = false;
    this.replayCount = 0;
    if (!this.currentType) return;

    const container = document.getElementById(containerId);
    if (!container) return;

    switch (typeId) {
      case 'sst': this._renderSST(container, question); break;
      case 'l-mcma': this._renderLMCMA(container, question); break;
      case 'l-fib': this._renderLFIB(container, question); break;
      case 'l-hcs': this._renderHCS(container, question); break;
      case 'l-mcsa': this._renderLMCSA(container, question); break;
      case 'l-smw': this._renderSMW(container, question); break;
      case 'l-hiw': this._renderHIW(container, question); break;
      case 'l-wfd': this._renderWFD(container, question); break;
    }
  },

  _audioControls(autoplay = true) {
    return `
    <div class="listening-audio-bar card rounded-xl p-4 mb-5">
      <div class="flex items-center gap-3">
        <button id="listen-play-btn" class="w-10 h-10 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-light)] flex items-center justify-center transition-colors" onclick="PTE.ListeningEngine.playAudio()">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </button>
        <div class="flex-1">
          <div id="listen-progress-bar" class="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div id="listen-progress" class="h-full bg-[var(--accent)] rounded-full transition-all" style="width:0%"></div>
          </div>
        </div>
        <span id="listen-status" class="text-xs text-zinc-500 font-mono">${autoplay ? 'Click play' : 'Ready'}</span>
      </div>
    </div>`;
  },

  playAudio() {
    if (!this.currentQuestion) return;
    const text = this.currentType.id === 'l-smw'
      ? (this.currentQuestion.audioPlayText || this.currentQuestion.audioText)
      : this.currentQuestion.audioText;

    const statusEl = document.getElementById('listen-status');
    const progressEl = document.getElementById('listen-progress');
    const playBtn = document.getElementById('listen-play-btn');

    if (statusEl) statusEl.textContent = 'Playing...';
    if (playBtn) playBtn.disabled = true;

    const words = text.split(/\s+/).length;
    const estimatedDuration = Math.max(3, words / 2.5);
    let elapsed = 0;
    const progressInterval = setInterval(() => {
      elapsed += 0.1;
      const pct = Math.min(100, (elapsed / estimatedDuration) * 100);
      if (progressEl) progressEl.style.width = pct + '%';
    }, 100);

    const onDone = () => {
      clearInterval(progressInterval);
      if (progressEl) progressEl.style.width = '100%';
      if (statusEl) statusEl.textContent = 'Completed';
      if (playBtn) playBtn.disabled = false;
      this.audioPlayed = true;
      this.replayCount++;
    };

    // Prefer a recorded file when available; otherwise synthesize via TTS.
    const playPromise = (this.currentQuestion.audioUrl && PTE.TTS && PTE.TTS.playFile)
      ? PTE.TTS.playFile(this.currentQuestion.audioUrl).catch(() => PTE.TTS ? PTE.TTS.speak(text) : Promise.resolve())
      : (PTE.TTS
        ? PTE.TTS.speak(text)
        : new Promise((resolve) => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.95;
            utterance.onend = resolve;
            utterance.onerror = resolve;
            speechSynthesis.speak(utterance);
          }));

    playPromise.then(onDone).catch(onDone);
  },

  // ── SST: Summarize Spoken Text ──
  _renderSST(container, q) {
    container.innerHTML = `
      ${this._audioControls()}
      <div class="writing-editor-wrap">
        <textarea id="sst-textarea" class="writing-editor" placeholder="Write your summary here (50-70 words)..." style="min-height:120px"></textarea>
        <div class="writing-stats-bar">
          <span id="sst-word-count" class="text-xs font-mono text-zinc-500">0 words</span>
          <span class="text-xs font-mono text-zinc-600">50-70 required</span>
        </div>
      </div>
      <button class="btn-primary mt-4" onclick="PTE.ListeningEngine.submitSST()">Submit</button>
      <div id="listening-score-area" class="mt-5"></div>`;

    const ta = document.getElementById('sst-textarea');
    if (ta) ta.addEventListener('input', () => {
      const count = ta.value.trim().split(/\s+/).filter(w=>w).length;
      const el = document.getElementById('sst-word-count');
      if (el) {
        el.textContent = `${count} words`;
        el.className = count >= 50 && count <= 70 ? 'text-xs font-mono text-green-400' : 'text-xs font-mono text-amber-400';
      }
    });
  },

  submitSST() {
    const ta = document.getElementById('sst-textarea');
    const text = ta ? ta.value.trim() : '';
    if (ta) ta.disabled = true;
    const scores = PTE.WritingEngine.scoreSWT.call(
      { currentQuestion: this.currentQuestion, currentType: { minWords:50, maxWords:70 }, _getWords: t => t.trim().split(/\s+/).filter(w=>w) },
      text
    );
    if (this.examMode) return this._examDone(scores.overall, text.slice(0, 300));
    this._showWritingScore(scores);
    this._saveSession(scores.overall, text.slice(0, 300));
  },

  // ── LMCMA: Multiple Choice Multiple Answer ──
  _renderLMCMA(container, q) {
    const opts = q.options.map((o, i) => `
      <label class="mcq-option" id="lmcma-opt-${i}">
        <input type="checkbox" name="lmcma" value="${i}" class="mcq-checkbox">
        <span class="text-sm text-zinc-300">${o.text}</span>
      </label>`).join('');

    container.innerHTML = `
      ${this._audioControls()}
      <div class="card rounded-xl p-5 mb-5">
        <p class="text-sm font-medium text-zinc-200 mb-3">${q.question}</p>
        <div class="space-y-2">${opts}</div>
      </div>
      <button class="btn-primary" onclick="PTE.ListeningEngine.submitLMCMA()">Check Answer</button>
      <div id="listening-score-area" class="mt-5"></div>`;
  },

  submitLMCMA() {
    const q = this.currentQuestion;
    const cbs = document.querySelectorAll('input[name="lmcma"]');
    let score = 0;
    cbs.forEach((cb, i) => {
      cb.disabled = true;
      const label = document.getElementById(`lmcma-opt-${i}`);
      if (q.options[i].correct) { label.classList.add('mcq-correct'); if (cb.checked) score++; }
      if (cb.checked && !q.options[i].correct) { label.classList.add('mcq-wrong'); score--; }
    });
    score = Math.max(0, score);
    const max = q.options.filter(o => o.correct).length;
    const overall = max > 0 ? Math.round((score / max) * 90) : 0;
    if (this.examMode) return this._examDone(overall, `${score}/${max}`);
    this._showSimpleScore(score, max, overall);
    this._saveSession(overall, `${score}/${max}`);
  },

  // ── LFIB: Fill in the Blanks ──
  _renderLFIB(container, q) {
    let idx = 0;
    const transcriptHTML = q.transcript.replace(/___/g, () => {
      const input = `<input type="text" id="lfib-input-${idx}" class="listening-blank-input" placeholder="..." autocomplete="off">`;
      idx++;
      return input;
    });

    container.innerHTML = `
      ${this._audioControls()}
      <div class="card rounded-xl p-5 mb-5">
        <p class="text-sm text-zinc-300 leading-loose">${transcriptHTML}</p>
      </div>
      <button class="btn-primary" onclick="PTE.ListeningEngine.submitLFIB()">Check Answer</button>
      <div id="listening-score-area" class="mt-5"></div>`;
  },

  submitLFIB() {
    const q = this.currentQuestion;
    let correct = 0;
    q.answers.forEach((ans, i) => {
      const input = document.getElementById(`lfib-input-${i}`);
      if (!input) return;
      input.disabled = true;
      if (input.value.trim().toLowerCase() === ans.toLowerCase()) {
        input.classList.add('listening-blank-correct');
        correct++;
      } else {
        input.classList.add('listening-blank-wrong');
        input.value = `${input.value} → ${ans}`;
      }
    });
    const total = q.answers.length;
    const overall = total > 0 ? Math.round((correct / total) * 90) : 0;
    if (this.examMode) return this._examDone(overall, `${correct}/${total} blanks`);
    this._showSimpleScore(correct, total, overall);
    this._saveSession(overall, `${correct}/${total} blanks`);
  },

  // ── HCS: Highlight Correct Summary ──
  _renderHCS(container, q) {
    const opts = q.summaries.map((s, i) => `
      <label class="mcq-option" id="hcs-opt-${i}">
        <input type="radio" name="hcs" value="${i}" class="mcq-radio">
        <span class="text-sm text-zinc-300">${s.text}</span>
      </label>`).join('');

    container.innerHTML = `
      ${this._audioControls()}
      <div class="card rounded-xl p-5 mb-5">
        <p class="text-sm font-medium text-zinc-200 mb-3">Select the paragraph that best summarizes the recording.</p>
        <div class="space-y-2">${opts}</div>
      </div>
      <button class="btn-primary" onclick="PTE.ListeningEngine.submitHCS()">Check Answer</button>
      <div id="listening-score-area" class="mt-5"></div>`;
  },

  submitHCS() {
    const q = this.currentQuestion;
    const radios = document.querySelectorAll('input[name="hcs"]');
    let selected = -1;
    const correctIdx = q.summaries.findIndex(s => s.correct);
    radios.forEach((r, i) => { r.disabled = true; if (r.checked) selected = i; });

    const correctLabel = document.getElementById(`hcs-opt-${correctIdx}`);
    if (correctLabel) correctLabel.classList.add('mcq-correct');
    if (selected >= 0 && selected !== correctIdx) {
      const wrongLabel = document.getElementById(`hcs-opt-${selected}`);
      if (wrongLabel) wrongLabel.classList.add('mcq-wrong');
    }

    const isCorrect = selected === correctIdx;
    if (this.examMode) return this._examDone(isCorrect ? 90 : 0, isCorrect ? 'Correct' : 'Incorrect');
    this._showSimpleScore(isCorrect ? 1 : 0, 1, isCorrect ? 90 : 0);
    this._saveSession(isCorrect ? 90 : 0, isCorrect ? 'Correct' : 'Incorrect');
  },

  // ── LMCSA: MC Single Answer ──
  _renderLMCSA(container, q) {
    const opts = q.options.map((o, i) => `
      <label class="mcq-option" id="lmcsa-opt-${i}">
        <input type="radio" name="lmcsa" value="${i}" class="mcq-radio">
        <span class="text-sm text-zinc-300">${o}</span>
      </label>`).join('');

    container.innerHTML = `
      ${this._audioControls()}
      <div class="card rounded-xl p-5 mb-5">
        <p class="text-sm font-medium text-zinc-200 mb-3">${q.question}</p>
        <div class="space-y-2">${opts}</div>
      </div>
      <button class="btn-primary" onclick="PTE.ListeningEngine.submitLMCSA()">Check Answer</button>
      <div id="listening-score-area" class="mt-5"></div>`;
  },

  submitLMCSA() {
    const q = this.currentQuestion;
    const radios = document.querySelectorAll('input[name="lmcsa"]');
    let selected = -1;
    radios.forEach((r, i) => { r.disabled = true; if (r.checked) selected = i; });

    const correctLabel = document.getElementById(`lmcsa-opt-${q.correctIndex}`);
    if (correctLabel) correctLabel.classList.add('mcq-correct');
    if (selected >= 0 && selected !== q.correctIndex) {
      document.getElementById(`lmcsa-opt-${selected}`)?.classList.add('mcq-wrong');
    }

    const isCorrect = selected === q.correctIndex;
    if (this.examMode) return this._examDone(isCorrect ? 90 : 0, isCorrect ? 'Correct' : 'Incorrect');
    this._showSimpleScore(isCorrect ? 1 : 0, 1, isCorrect ? 90 : 0);
    this._saveSession(isCorrect ? 90 : 0, isCorrect ? 'Correct' : 'Incorrect');
  },

  // ── SMW: Select Missing Word ──
  _renderSMW(container, q) {
    const opts = q.options.map((o, i) => `
      <label class="mcq-option" id="smw-opt-${i}">
        <input type="radio" name="smw" value="${i}" class="mcq-radio">
        <span class="text-sm text-zinc-300">${o}</span>
      </label>`).join('');

    container.innerHTML = `
      ${this._audioControls()}
      <div class="card rounded-xl p-5 mb-5">
        <p class="text-sm text-zinc-500 mb-3">The recording will stop before the end. Select the missing word or phrase.</p>
        <div class="space-y-2">${opts}</div>
      </div>
      <button class="btn-primary" onclick="PTE.ListeningEngine.submitSMW()">Check Answer</button>
      <div id="listening-score-area" class="mt-5"></div>`;
  },

  submitSMW() {
    const q = this.currentQuestion;
    const radios = document.querySelectorAll('input[name="smw"]');
    let selected = -1;
    radios.forEach((r, i) => { r.disabled = true; if (r.checked) selected = i; });

    document.getElementById(`smw-opt-${q.correctIndex}`)?.classList.add('mcq-correct');
    if (selected >= 0 && selected !== q.correctIndex) {
      document.getElementById(`smw-opt-${selected}`)?.classList.add('mcq-wrong');
    }

    const isCorrect = selected === q.correctIndex;
    if (this.examMode) return this._examDone(isCorrect ? 90 : 0, isCorrect ? 'Correct' : 'Incorrect');
    this._showSimpleScore(isCorrect ? 1 : 0, 1, isCorrect ? 90 : 0);
    this._saveSession(isCorrect ? 90 : 0, isCorrect ? 'Correct' : 'Incorrect');
  },

  // ── HIW: Highlight Incorrect Words ──
  _renderHIW(container, q) {
    const words = q.displayText.split(/\s+/);
    const wordsHTML = words.map((w, i) =>
      `<span class="hiw-word" id="hiw-w-${i}" onclick="this.classList.toggle('hiw-selected')">${w}</span>`
    ).join(' ');

    container.innerHTML = `
      ${this._audioControls()}
      <div class="card rounded-xl p-5 mb-5">
        <p class="text-sm text-zinc-500 mb-3">Click on words that are DIFFERENT from what you hear in the recording.</p>
        <div class="text-sm text-zinc-300 leading-loose hiw-text">${wordsHTML}</div>
      </div>
      <button class="btn-primary" onclick="PTE.ListeningEngine.submitHIW()">Check Answer</button>
      <div id="listening-score-area" class="mt-5"></div>`;
  },

  submitHIW() {
    const q = this.currentQuestion;
    const incorrectSet = new Set(q.incorrectIndices);
    const words = q.displayText.split(/\s+/);
    let score = 0;

    words.forEach((w, i) => {
      const el = document.getElementById(`hiw-w-${i}`);
      if (!el) return;
      const isSelected = el.classList.contains('hiw-selected');
      const isIncorrect = incorrectSet.has(i);

      el.classList.remove('hiw-selected');
      if (isIncorrect) {
        el.classList.add('hiw-incorrect');
        if (isSelected) score++;
      }
      if (isSelected && !isIncorrect) {
        el.classList.add('hiw-wrong-click');
        score--;
      }
    });

    score = Math.max(0, score);
    const total = q.incorrectIndices.length;
    const overall = total > 0 ? Math.round((score / total) * 90) : 0;
    if (this.examMode) return this._examDone(overall, `${score}/${total} incorrect words found`);
    this._showSimpleScore(score, total, overall, 'identified');
    this._saveSession(overall, `${score}/${total} incorrect words found`);
  },

  // ── WFD: Write from Dictation ──
  _renderWFD(container, q) {
    container.innerHTML = `
      ${this._audioControls()}
      <div class="card rounded-xl p-5 mb-5">
        <p class="text-sm text-zinc-500 mb-3">Type the sentence you hear.</p>
        <input type="text" id="wfd-input" class="input-dark text-sm" placeholder="Type the sentence here..." autocomplete="off">
      </div>
      <button class="btn-primary" onclick="PTE.ListeningEngine.submitWFD()">Check Answer</button>
      <div id="listening-score-area" class="mt-5"></div>`;
  },

  submitWFD() {
    const q = this.currentQuestion;
    const input = document.getElementById('wfd-input');
    const typed = input ? input.value.trim() : '';
    if (input) input.disabled = true;

    const expectedWords = q.audioText.toLowerCase().replace(/[^\w\s'-]/g, '').split(/\s+/).filter(w => w);
    const typedWords = typed.toLowerCase().replace(/[^\w\s'-]/g, '').split(/\s+/).filter(w => w);

    let correct = 0;
    if (PTE.Scoring && PTE.Scoring._lcsWords) {
      const lcs = PTE.Scoring._lcsWords(expectedWords, typedWords);
      correct = lcs.length;
    } else {
      const expected = new Set(expectedWords);
      correct = typedWords.filter(w => expected.has(w)).length;
    }

    const total = expectedWords.length;
    const overall = total > 0 ? Math.round((correct / total) * 90) : 0;

    if (this.examMode) return this._examDone(overall, `${correct}/${total} words`);

    const area = document.getElementById('listening-score-area');
    if (area) {
      const band = PTE.Scoring.getBand(overall);
      area.innerHTML = `
      <div class="card-elevated rounded-xl p-5 max-w-md mx-auto text-center animate-fadeIn">
        <div class="text-3xl font-bold font-mono mb-1" style="color:${band.color}">${overall}<span class="text-base text-zinc-600">/90</span></div>
        <p class="text-sm text-zinc-400 mb-2">${correct}/${total} words correct</p>
        <div class="inline-flex items-center gap-1.5 bg-white/[0.04] px-3 py-1 rounded-full mb-3">
          <span class="text-xs">${band.emoji}</span>
          <span class="text-xs font-medium text-zinc-300">${band.label}</span>
        </div>
        <div class="bg-white/[0.02] rounded-lg p-3 mt-3 text-left border border-[var(--border)]">
          <p class="text-[10px] text-zinc-600 uppercase mb-1">Correct sentence</p>
          <p class="text-sm text-zinc-300">${q.audioText}</p>
        </div>
      </div>`;
    }
    this._saveSession(overall, `${correct}/${total} words`);
  },

  // ── Shared helpers ──

  _showSimpleScore(correct, total, overall, unit = 'correct') {
    const area = document.getElementById('listening-score-area');
    if (!area) return;
    const band = PTE.Scoring.getBand(overall);
    area.innerHTML = `
    <div class="card-elevated rounded-xl p-5 max-w-sm mx-auto text-center animate-fadeIn">
      <div class="text-3xl font-bold font-mono mb-1" style="color:${band.color}">${overall}<span class="text-base text-zinc-600">/90</span></div>
      <p class="text-sm text-zinc-400">${correct}/${total} ${unit}</p>
      <div class="inline-flex items-center gap-1.5 mt-2 bg-white/[0.04] px-3 py-1 rounded-full">
        <span class="text-xs">${band.emoji}</span>
        <span class="text-xs font-medium text-zinc-300">${band.label}</span>
      </div>
    </div>`;
  },

  _showWritingScore(scores) {
    const area = document.getElementById('listening-score-area');
    if (!area) return;
    const band = PTE.Scoring.getBand(scores.overall);
    const traits = [['Content',scores.content,2],['Form',scores.form,2],['Grammar',scores.grammar,2],['Vocabulary',scores.vocabulary,2]];
    const bars = traits.map(([l,s,m]) => {
      const p = m>0?(s/m)*100:0; const r=m>0?s/m:0;
      const c = r>=0.8?'var(--success)':r>=0.5?'var(--accent)':r>=0.3?'var(--warning)':'var(--error)';
      return `<div><div class="flex justify-between mb-1"><span class="text-xs text-zinc-400">${l}</span><span class="text-xs font-mono" style="color:${c}">${s}/${m}</span></div><div class="h-1.5 bg-white/[0.04] rounded-full overflow-hidden"><div class="h-full rounded-full score-bar-animate" style="width:${p}%;background:${c}"></div></div></div>`;
    }).join('');
    area.innerHTML = `
    <div class="card-elevated rounded-xl overflow-hidden max-w-sm mx-auto animate-fadeIn">
      <div class="bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] p-4 text-center">
        <div class="text-3xl font-bold text-white font-mono">${scores.overall}<span class="text-base text-white/40">/90</span></div>
        <p class="text-white/50 text-xs mt-1">${scores.wordCount} words</p>
      </div>
      <div class="p-4 space-y-3">${bars}</div>
    </div>`;
  },

  _saveSession(overall, summary) {
    if (!PTE.Store) return;
    PTE.Store.addSession({
      timestamp: Date.now(),
      date: new Date().toLocaleDateString(),
      type: this.currentType.id,
      questionId: this.currentQuestion.id,
      overallScore: overall,
      scores: { overall },
      transcript: summary,
      duration: this.currentType.answerTime || 60
    });
    if (PTE.Gamify) PTE.Gamify.addXP(overall >= 60 ? 20 : 8, this.currentType.id);
    if (PTE.Spaced) PTE.Spaced.trackResult(this.currentQuestion.id, this.currentType.id, overall);
    if (PTE.App && PTE.App._notifyModeCompletion) PTE.App._notifyModeCompletion(this.currentType.id, overall);
  },

  cleanup() {
    if (PTE.TTS && PTE.TTS.stopAll) PTE.TTS.stopAll();
    speechSynthesis.cancel();
  }
};
