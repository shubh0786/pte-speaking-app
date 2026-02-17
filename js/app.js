/**
 * PTE Speaking Module - Main Application Controller
 * Handles practice flow: setup → prep → record → evaluate → review
 * Enhanced with: skip prep, tone analysis, AI feedback, predictions
 */

window.PTE = window.PTE || {};

PTE.App = {
  currentType: null,
  currentTypeConfig: null,
  currentQuestions: null,
  currentQuestionIndex: 0,
  currentQuestion: null,
  phase: 'idle', // idle, listening, prep, recording, evaluating, review
  recordingStartTime: null,
  shadowingMode: false,
  waveformInterval: null,
  _recordResolve: null,
  _prepResolve: null,       // stored resolve for skip prep
  toneResults: null,         // tone analysis results
  micStream: null,           // shared mic stream

  // ── Initialization ───────────────────────────────────────────

  async init() {
    // ── 1. Merge question banks (synchronous, fast) ──
    if (PTE.mergePredictions) PTE.mergePredictions();
    if (PTE.mergeBankSpeaking) PTE.mergeBankSpeaking();
    if (PTE.mergeBankVocab) PTE.mergeBankVocab();

    let total = 0;
    Object.keys(PTE.Questions).forEach(function(k) { total += PTE.Questions[k].length; });
    console.log('[PTE] Total questions loaded: ' + total);

    // ── 2. Auth: Check session and activate per-user storage FIRST ──
    // This runs before anything async so auth always works on refresh
    if (PTE.Auth && PTE.Auth.isLoggedIn()) {
      PTE.Auth.activateUserStorage();
      const user = PTE.Auth.getCurrentUser();
      console.log('[PTE] Session restored for:', user ? user.username : 'unknown');
    } else {
      console.log('[PTE] No active session');
    }

    // ── 3. Setup ALL routes (synchronous) ──
    PTE.Router.on('/login', () => {
      if (PTE.Auth && PTE.Auth.isLoggedIn()) { location.hash = '#/'; return; }
      this.renderPage('login');
    });
    PTE.Router.on('/signup', () => {
      if (PTE.Auth && PTE.Auth.isLoggedIn()) { location.hash = '#/'; return; }
      this.renderPage('signup');
    });

    PTE.Router.on('/', () => this.requireAuth(() => this.renderPage('home')));
    PTE.Router.on('/profile', () => this.requireAuth(() => this.renderPage('profile')));
    PTE.Router.on('/practice', () => this.requireAuth(() => this.renderPage('practice')));
    PTE.Router.on('/progress', () => this.requireAuth(() => this.renderPage('progress')));
    PTE.Router.on('/mock-test', () => this.requireAuth(() => this.renderPage('mock-test')));
    PTE.Router.on('/predictions', () => this.requireAuth(() => this.renderPage('predictions')));
    PTE.Router.on('/daily', () => this.requireAuth(() => this.renderPage('daily')));
    PTE.Router.on('/vocab', () => this.requireAuth(() => this.renderPage('vocab')));
    PTE.Router.on('/templates', () => this.requireAuth(() => this.renderPage('templates')));
    PTE.Router.on('/drills', () => this.requireAuth(() => this.renderPage('drills')));
    PTE.Router.on('/leaderboard', () => this.requireAuth(() => this.renderPage('leaderboard')));
    PTE.Router.on('/review', () => this.requireAuth(() => this.renderPage('review')));
    PTE.Router.on('/planner', () => this.requireAuth(() => this.renderPage('planner')));
    PTE.Router.on('/accent', () => this.requireAuth(() => this.renderPage('accent')));
    PTE.Router.on('/target', () => this.requireAuth(() => this.renderPage('target')));
    PTE.Router.on('/weak-words', () => this.requireAuth(() => this.renderPage('weak-words')));
    PTE.Router.on('/reminders', () => this.requireAuth(() => this.renderPage('reminders')));
    PTE.Router.on('/challenge-create', () => this.requireAuth(() => this.renderPage('challenge-create')));
    PTE.Router.on('/challenge/:code', (code) => this.requireAuth(() => this.renderPage('challenge', code)));
    PTE.Router.on('/predictions/:type', (type) => this.requireAuth(() => this.startPractice(type, true)));
    PTE.Router.on('/practice/:type', (type) => this.requireAuth(() => this.startPractice(type, false)));

    // ── 4. Init keyboard shortcuts ──
    this._initKeyboard();

    // ── 5. Start router IMMEDIATELY (renders the page) ──
    PTE.Router.init();

    // ── 6. Initialize TTS and Speech in background (non-blocking) ──
    // These are only needed for practice, not for auth/navigation
    try {
      await PTE.TTS.init();
    } catch (e) {
      console.warn('[PTE] TTS init failed (will retry when needed):', e);
    }
    try {
      PTE.SpeechRecognizer.init();
    } catch (e) {
      console.warn('[PTE] Speech recognizer init failed:', e);
    }

    // Init study reminders if enabled
    if (PTE.Reminders && PTE.Reminders.init) PTE.Reminders.init();
  },

  // ── Auth Guard ──────────────────────────────────────────────
  requireAuth(callback) {
    if (PTE.Auth && !PTE.Auth.isLoggedIn()) {
      location.hash = '#/login';
      return;
    }
    callback();
  },

  renderPage(page, param) {
    // Full cleanup (kill mic) when navigating away from practice
    const isPracticePage = (page === 'practice' || page === 'predictions');
    if (!isPracticePage && this.micStream) {
      this.fullCleanup();
    } else {
      this.cleanup();
    }
    const root = document.getElementById('app-root');
    switch (page) {
      case 'login': root.innerHTML = PTE.Pages.login(); break;
      case 'signup': root.innerHTML = PTE.Pages.signup(); break;
      case 'profile': root.innerHTML = PTE.Pages.profile(); break;
      case 'home': root.innerHTML = PTE.Pages.home(); break;
      case 'practice': root.innerHTML = PTE.Pages.practice(); break;
      case 'progress': root.innerHTML = PTE.Analytics ? PTE.Analytics.renderPage() : PTE.Pages.progress(); break;
      case 'mock-test': root.innerHTML = PTE.Pages.mockTest(); break;
      case 'predictions': root.innerHTML = PTE.Pages.predictions(); break;
      case 'daily': root.innerHTML = PTE.Daily ? PTE.Daily.renderPage() : PTE.Pages.home(); break;
      case 'vocab': root.innerHTML = PTE.Vocab ? PTE.Vocab.renderPage() : PTE.Pages.home(); break;
      case 'templates': root.innerHTML = PTE.Templates ? PTE.Templates.renderPage() : PTE.Pages.home(); break;
      case 'drills': root.innerHTML = PTE.Drills ? PTE.Drills.renderPage() : PTE.Pages.home(); break;
      case 'leaderboard': root.innerHTML = PTE.Leaderboard ? PTE.Leaderboard.renderPage() : PTE.Pages.home(); break;
      case 'review': root.innerHTML = PTE.Spaced ? PTE.Spaced.renderPage() : PTE.Pages.home(); break;
      case 'planner': root.innerHTML = PTE.Planner ? PTE.Planner.renderPage() : PTE.Pages.home(); break;
      case 'accent': root.innerHTML = PTE.AccentAnalyzer ? PTE.AccentAnalyzer.renderPage() : PTE.Pages.home(); break;
      case 'target': root.innerHTML = PTE.TargetScore ? PTE.TargetScore.renderPage() : PTE.Pages.home(); break;
      case 'weak-words': root.innerHTML = PTE.WeakWords ? PTE.WeakWords.renderPage() : PTE.Pages.home(); break;
      case 'reminders': root.innerHTML = PTE.Reminders ? PTE.Reminders.renderPage() : PTE.Pages.home(); break;
      case 'challenge-create': root.innerHTML = PTE.Challenge ? PTE.Challenge.renderCreatePage() : PTE.Pages.home(); break;
      case 'challenge': root.innerHTML = PTE.Challenge ? PTE.Challenge.renderChallengePage(param) : PTE.Pages.home(); break;
    }
  },

  // ── Keyboard Shortcuts ───────────────────────────────────────

  _initKeyboard() {
    if (this._keyboardInit) return;
    this._keyboardInit = true;
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      if (!this.currentTypeConfig) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (this.phase === 'idle') this.beginPractice();
          else if (this.phase === 'recording') this.stopRecordingEarly();
          else if (this.phase === 'prep') this.skipPrep();
          break;
        case 'ArrowRight':
          if (this.phase === 'idle' || this.phase === 'review') { e.preventDefault(); this.nextQuestion(); }
          break;
        case 'KeyR':
          if (this.phase === 'review') { e.preventDefault(); this.loadQuestion(this.currentQuestionIndex); }
          break;
        case 'Escape':
          if (this.phase === 'recording') this.stopRecordingEarly();
          break;
      }
    });
  },

  // ── Practice Flow Stepper ───────────────────────────────────

  _updateStepper(phase) {
    const el = document.getElementById('stepper-area');
    if (!el || !this.currentTypeConfig) return;
    el.classList.remove('hidden');
    el.innerHTML = PTE.UI.practiceFlowStepper(phase, this.currentTypeConfig.hasAudio);
  },

  // ── Mobile Fullscreen Mode ──────────────────────────────────

  _enterFullscreen() {
    document.body.classList.add('practice-fullscreen');
  },

  _exitFullscreen() {
    document.body.classList.remove('practice-fullscreen');
  },

  // ── Practice Flow ────────────────────────────────────────────

  startPractice(typeId, predictionsOnly) {
    this.cleanup();
    this.currentType = typeId;
    this.currentTypeConfig = Object.values(PTE.QUESTION_TYPES).find(t => t.id === typeId);
    this.isPredictionsMode = !!predictionsOnly;

    // Filter questions: predictions only, or all
    if (predictionsOnly && PTE.Predictions && PTE.Predictions[typeId]) {
      this.currentQuestions = PTE.Predictions[typeId];
    } else {
      this.currentQuestions = PTE.Questions[typeId];
    }

    this.currentQuestionIndex = 0;
    this.phase = 'idle';

    if (!this.currentTypeConfig || !this.currentQuestions || this.currentQuestions.length === 0) {
      this.renderPage(predictionsOnly ? 'predictions' : 'practice');
      return;
    }

    const root = document.getElementById('app-root');
    root.innerHTML = PTE.Pages.practiceQuestion(typeId, predictionsOnly);

    this.loadQuestion(0);
  },

  loadQuestion(index) {
    this.cleanup();
    index = parseInt(index);
    this.currentQuestionIndex = index;
    this.currentQuestion = this.currentQuestions[index];
    this.phase = 'idle';

    const select = document.getElementById('question-select');
    if (select) select.value = index;

    this.showQuestionContent();
  },

  nextQuestion() {
    this.cleanup();
    const nextIdx = (this.currentQuestionIndex + 1) % this.currentQuestions.length;
    this.loadQuestion(nextIdx);
  },

  showQuestionContent() {
    const area = document.getElementById('practice-area');
    const scoreArea = document.getElementById('score-area');
    const btnArea = document.getElementById('action-buttons');
    if (!area) return;

    scoreArea.classList.add('hidden');
    scoreArea.innerHTML = '';

    const type = this.currentTypeConfig;
    const q = this.currentQuestion;

    let content = '<div class="p-5">';

    // Source badge
    if (q.source) {
      const freqColors = { 'very-high': 'bg-red-500/8 text-red-400 border border-red-500/10', 'high': 'bg-amber-500/8 text-amber-400 border border-amber-500/10', 'medium': 'bg-blue-500/8 text-blue-400 border border-blue-500/10' };
      const freqClass = freqColors[q.frequency] || 'bg-white/[0.03] text-zinc-400 border border-[var(--border)]';
      content += `
      <div class="flex items-center gap-1.5 mb-4">
        <span class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--accent-surface)] text-[var(--accent-light)] border border-[rgba(109,92,255,0.12)]">${q.source}</span>
        ${q.frequency ? `<span class="text-[10px] font-medium px-2 py-0.5 rounded-full ${freqClass}">${q.frequency.replace('-', ' ')}</span>` : ''}
      </div>`;
    }

    // Read Aloud text
    if (type.id === 'read-aloud' && q.text) {
      content += `
      <div class="mb-5">
        <label class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-2 block">Read aloud:</label>
        <div class="bg-white/[0.02] rounded-lg p-4 text-zinc-200 leading-relaxed text-base border border-[var(--border)]" id="question-text">${q.text}</div>
      </div>`;
    }

    // Scenario
    if (q.scenario) {
      content += `
      <div class="mb-5">
        <label class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-2 block">Scenario:</label>
        <div class="bg-blue-500/5 border border-blue-500/10 rounded-lg p-4 text-blue-300 leading-relaxed text-sm">${q.scenario}</div>
      </div>`;
    }

    // Chart
    if (type.hasImage && q.chartType) {
      content += `
      <div class="mb-5">
        <label class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-2 block">Describe the image:</label>
        <div class="bg-white rounded-lg p-3 border border-gray-200" id="chart-container">${PTE.Charts.generate(q)}</div>
      </div>`;
    }

    // Audio indicator
    if (type.hasAudio) {
      content += `
      <div id="audio-indicator" class="mb-5 hidden">
        <div class="flex items-center gap-3 bg-[var(--accent-surface)] border border-[rgba(109,92,255,0.12)] rounded-lg p-3">
          <div class="w-8 h-8 bg-[var(--accent-surface)] rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4 text-[var(--accent-light)] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
          </div>
          <div>
            <p class="font-medium text-[var(--accent-light)] text-sm" id="audio-status">Preparing audio...</p>
            <p class="text-xs text-zinc-500" id="audio-sub">Listen carefully</p>
          </div>
        </div>
      </div>`;
    }

    // Group discussion speakers
    if (q.speakers) {
      content += `
      <div id="speakers-area" class="mb-5 hidden">
        <label class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-2 block">Group Discussion:</label>
        <div class="space-y-2 bg-white/[0.02] rounded-lg p-3 border border-[var(--border)]">
          ${q.speakers.map(s => `
            <div class="flex items-start gap-2 opacity-50 transition-opacity duration-300" id="speaker-${s.name.replace(/\s/g,'-')}">
              <span class="w-6 h-6 rounded-full bg-[var(--accent-surface)] flex items-center justify-center text-[10px] font-semibold text-[var(--accent-light)] flex-shrink-0 mt-0.5">${s.name.charAt(s.name.length - 1)}</span>
              <div>
                <p class="text-[10px] font-medium text-zinc-500">${s.name}</p>
                <p class="text-sm text-zinc-300">${s.text}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>`;
    }

    // Shadowing mode toggle (Repeat Sentence only)
    if (type.id === 'repeat-sentence') {
      const shadowChecked = PTE.App.shadowingMode ? 'checked' : '';
      content += `
    <div class="mb-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
      <label class="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" id="shadowing-toggle" ${shadowChecked} onchange="PTE.App.shadowingMode = this.checked" class="rounded border-gray-500 bg-white/5 text-purple-500 focus:ring-purple-500">
        <span class="text-sm font-medium text-purple-300">Shadowing mode</span>
        <span class="text-xs text-gray-500">— Hear audio again while recording (speak along)</span>
      </label>
    </div>`;
    }

    // Timer, waveform, pitch, and controls
    content += `
    <div class="flex flex-col items-center gap-6" id="controls-area">
      <div id="timer-container" class="hidden">
        ${PTE.UI.timer('main-timer')}
      </div>
      <div id="waveform-container" class="hidden w-full flex justify-center">
        ${PTE.UI.waveform('main-waveform')}
      </div>
      <div id="pitch-display" class="hidden w-full max-w-md mx-auto">
        <div class="flex items-center justify-between bg-white/[0.02] rounded-lg p-3 border border-[var(--border)]">
          <div class="text-center flex-1">
            <p class="text-[10px] text-zinc-600">Pitch</p>
            <p id="live-pitch" class="text-base font-semibold font-mono text-[var(--accent-light)] tabular-nums">-- Hz</p>
          </div>
          <div class="w-px h-6 bg-[var(--border)]"></div>
          <div class="text-center flex-1">
            <p class="text-[10px] text-zinc-600">Volume</p>
            <p id="live-volume" class="text-base font-semibold font-mono text-green-400 tabular-nums">-- dB</p>
          </div>
          <div class="w-px h-6 bg-[var(--border)]"></div>
          <div class="text-center flex-1">
            <p class="text-[10px] text-zinc-600">Intonation</p>
            <div id="live-pitch-bars" class="flex items-end justify-center gap-0.5 h-5 mt-1">
              ${Array(12).fill(0).map(() => '<div class="w-1 bg-white/[0.06] rounded-full" style="height:3px"></div>').join('')}
            </div>
          </div>
        </div>
      </div>
      <div id="transcript-container" class="hidden w-full">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">What we heard:</label>
        <div id="transcript-text" class="bg-white/[0.02] rounded-lg p-3 text-zinc-300 text-sm min-h-[50px] border border-[var(--border)]"></div>
      </div>
      <div id="recording-status" class="hidden">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          <span class="text-xs font-medium text-red-400">Recording...</span>
        </div>
      </div>
    </div>`;

    content += '</div>';
    area.innerHTML = content;

    // ── Show Previous Answer if this question was already completed ──
    this._showPreviousAnswer(q, type);

    // Action buttons
    btnArea.innerHTML = `
    <div class="flex flex-col items-center gap-2">
      <button id="btn-start" onclick="PTE.App.beginPractice()" class="btn-primary px-6 py-2.5">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
        ${PTE.Store.getLatestSession(q.id) ? 'Try Again' : 'Begin'}
      </button>
      ${PTE.UI.kbdHint('Space', 'to start')}
    </div>`;
  },

  /**
   * Show previous answer details if the question has been attempted before.
   * Displays: best score, last score, transcript, attempts count, date.
   */
  _showPreviousAnswer(q, type) {
    const container = document.getElementById('previous-answer');
    if (!container) return;

    const sessions = PTE.Store.getSessionsByQuestion(q.id);
    if (sessions.length === 0) {
      container.classList.add('hidden');
      container.innerHTML = '';
      return;
    }

    const latest = sessions[0]; // most recent
    const best = sessions.reduce((a, b) => b.overallScore > a.overallScore ? b : a);
    const band = PTE.Scoring.getBand(best.overallScore);

    // Build score breakdown for best attempt
    let traitHtml = '';
    if (best.scores) {
      const s = best.scores;
      if (s.contentResult) {
        const traitName = s.contentResult.traitName === 'Appropriacy' ? 'Appropriacy' : 'Content';
        traitHtml += `<span class="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400">${traitName}: ${s.contentResult.raw}/${s.contentResult.max}</span>`;
      }
      if (s.pronunciation !== undefined) {
        const pColor = s.pronunciation >= 4 ? 'emerald' : s.pronunciation >= 3 ? 'blue' : 'amber';
        traitHtml += `<span class="text-xs px-2 py-0.5 rounded-full bg-${pColor}-500/15 text-${pColor}-400">Pron: ${s.pronunciation}/5</span>`;
      }
      if (s.fluency !== undefined) {
        const fColor = s.fluency >= 4 ? 'emerald' : s.fluency >= 3 ? 'blue' : 'amber';
        traitHtml += `<span class="text-xs px-2 py-0.5 rounded-full bg-${fColor}-500/15 text-${fColor}-400">Fluency: ${s.fluency}/5</span>`;
      }
      if (s.vocabulary !== undefined) {
        traitHtml += `<span class="text-xs px-2 py-0.5 rounded-full ${s.vocabulary === 1 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}">${s.vocabulary === 1 ? 'Correct' : 'Incorrect'}</span>`;
      }
    }

    // Score history mini chart
    let historyDots = '';
    if (sessions.length > 1) {
      historyDots = sessions.slice(0, 8).map(s => {
        const color = s.overallScore >= 65 ? '#10b981' : s.overallScore >= 45 ? '#f59e0b' : '#ef4444';
        return `<div class="flex flex-col items-center gap-0.5">
          <div class="w-2 h-2 rounded-full" style="background:${color}" title="${s.overallScore}/90"></div>
          <span class="text-[9px] text-gray-600">${s.overallScore}</span>
        </div>`;
      }).join('');
    }

    container.classList.remove('hidden');
    container.innerHTML = `
    <div class="glass rounded-2xl overflow-hidden border border-emerald-500/20 animate-fadeIn">
      <div class="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 px-5 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span class="text-sm font-semibold text-emerald-400">Previously Completed</span>
        </div>
        <span class="text-xs text-gray-500">${sessions.length} attempt${sessions.length > 1 ? 's' : ''} • Last: ${latest.date || 'N/A'}</span>
      </div>
      <div class="px-5 py-4">
        <div class="flex items-center gap-4 mb-3">
          <!-- Best Score Circle -->
          <div class="relative flex-shrink-0">
            <svg class="w-16 h-16 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="6"/>
              <circle cx="60" cy="60" r="52" fill="none" stroke="${band.color}" stroke-width="6" stroke-linecap="round" stroke-dasharray="326.73" stroke-dashoffset="${326.73 * (1 - best.overallScore / 90)}"/>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-lg font-extrabold text-white">${best.overallScore}</span>
              <span class="text-[9px] text-gray-500">/90</span>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-sm font-bold text-white">Best Score</span>
              <span class="text-xs px-2 py-0.5 rounded-full" style="background:${band.color}22;color:${band.color}">${band.label}</span>
            </div>
            <!-- Trait scores -->
            <div class="flex flex-wrap gap-1.5 mb-2">${traitHtml}</div>
            ${sessions.length > 1 ? `
            <div class="flex items-center gap-1.5">
              <span class="text-[10px] text-gray-600 mr-1">History:</span>
              ${historyDots}
            </div>` : ''}
          </div>
        </div>
        ${best.transcript ? `
        <details class="group">
          <summary class="cursor-pointer text-xs font-medium text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            View your previous answer
          </summary>
          <div class="mt-2 p-3 bg-white/5 rounded-xl border border-white/5">
            <p class="text-sm text-gray-400 leading-relaxed">${best.transcript}</p>
            <div class="mt-2 flex items-center gap-3 text-xs text-gray-600">
              <span>Duration: ${Math.round(best.duration || 0)}s</span>
              ${best.scores && best.scores.content !== undefined ? `<span>Content: ${best.scores.content}/90</span>` : ''}
            </div>
          </div>
        </details>` : ''}
      </div>
    </div>`;
  },

  // ── Practice Phases ──────────────────────────────────────────

  async beginPractice() {
    const type = this.currentTypeConfig;
    const q = this.currentQuestion;

    // ── Mobile fix: Unlock TTS inside the user gesture (tap/click) ──
    // Must happen BEFORE any async calls to preserve the gesture context
    if (PTE.TTS) PTE.TTS.unlock();

    // Request mic access (reuse existing stream if still alive)
    if (!PTE.AudioRecorder.isStreamActive()) {
      const micOk = await PTE.AudioRecorder.init();
      if (!micOk) {
        alert('Microphone access is required for speaking practice. Please allow microphone access and try again.');
        return;
      }
    }
    this.micStream = PTE.AudioRecorder.stream;

    // Re-init TTS voices if needed (mobile may have loaded them by now)
    if (PTE.TTS && !PTE.TTS.voice) {
      try { await PTE.TTS.init(); } catch(e) {}
    }

    // Hide start button and skip
    document.getElementById('action-buttons').innerHTML = '';
    const skipBtn = document.getElementById('btn-skip');
    if (skipBtn) skipBtn.style.display = 'none';

    // Enter mobile fullscreen mode
    this._enterFullscreen();

    // Phase 1: Play audio
    if (type.hasAudio) {
      this._updateStepper('listening');
      await this.playAudioPhase(q);
    }

    // Phase 2: Preparation time (with skip option)
    if (type.prepTime > 0) {
      this._updateStepper('prep');
      await this.prepPhase(type.prepTime);
    }

    // Phase 3: Recording (with tone analysis)
    this._updateStepper('recording');
    await this.recordPhase(type.recordTime);

    // Phase 4: Evaluate with AI feedback
    this._exitFullscreen();
    this._updateStepper('review');
    this.evaluatePhase();
  },

  playAudioPhase(q) {
    return new Promise(async (resolve) => {
      this.phase = 'listening';
      const indicator = document.getElementById('audio-indicator');
      const statusEl = document.getElementById('audio-status');
      const subEl = document.getElementById('audio-sub');
      
      if (indicator) indicator.classList.remove('hidden');
      if (statusEl) statusEl.textContent = 'Playing audio...';
      if (subEl) subEl.textContent = 'Listen carefully';

      // Track if TTS actually produced audio
      let ttsWorked = false;

      if (q.speakers) {
        // Group discussion: play each speaker with a natural pause between
        const speakersArea = document.getElementById('speakers-area');
        if (speakersArea) speakersArea.classList.remove('hidden');
        
        for (let i = 0; i < q.speakers.length; i++) {
          const speaker = q.speakers[i];
          const speakerEl = document.getElementById(`speaker-${speaker.name.replace(/\s/g,'-')}`);
          if (speakerEl) speakerEl.style.opacity = '1';
          if (statusEl) statusEl.textContent = `${speaker.name} is speaking...`;
          // Rate 0.92 — natural conversational pace, not rushed
          await PTE.TTS.speak(speaker.text, 0.92);
          ttsWorked = true;
          // Natural pause between speakers (longer than between sentences)
          if (i < q.speakers.length - 1) {
            await this.sleep(700);
          }
        }
      } else {
        const textToSpeak = q.text || q.audioText || '';
        if (textToSpeak) {
          // Use 0.92 rate for natural pace — not too fast, not too slow
          await PTE.TTS.speak(textToSpeak, 0.92);
          ttsWorked = true;
        }
      }

      // ── Mobile fallback: if TTS might not have played, show the text ──
      if (!PTE.TTS.synth || !PTE.TTS.voice) {
        ttsWorked = false;
      }

      if (!ttsWorked || !PTE.TTS._unlocked) {
        // Show a fallback notice with play-again button
        const fallbackText = q.text || q.audioText || (q.speakers ? q.speakers.map(s => s.text).join(' ') : '');
        if (fallbackText && indicator) {
          const audioSub = document.getElementById('audio-sub');
          if (audioSub) {
            audioSub.innerHTML = '<span class="text-amber-500 font-medium">Audio may not have played on your device.</span>';
          }
          // Add a retry button and show text
          const retryHtml = `
          <div class="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <p class="text-xs text-amber-400 font-semibold mb-2">If you didn't hear audio, tap to play again or read the text below:</p>
            <button onclick="PTE.TTS.speak('${fallbackText.replace(/'/g, "\\'")}', 0.9)" class="mb-2 px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 text-sm font-semibold hover:bg-amber-500/30 transition-colors">
              🔊 Tap to Play Audio Again
            </button>
            <details class="mt-1">
              <summary class="text-xs text-gray-500 cursor-pointer hover:text-gray-400">Show text (fallback)</summary>
              <p class="text-sm text-gray-400 mt-2 p-2 bg-white/5 rounded-lg">${fallbackText}</p>
            </details>
          </div>`;
          indicator.insertAdjacentHTML('afterend', retryHtml);
        }
      }

      if (statusEl) statusEl.textContent = 'Audio complete';
      if (subEl && ttsWorked) subEl.textContent = 'Prepare your response';
      await this.sleep(500);
      
      resolve();
    });
  },

  prepPhase(seconds) {
    return new Promise((resolve) => {
      this._prepResolve = resolve;
      this.phase = 'prep';
      const timerContainer = document.getElementById('timer-container');
      if (timerContainer) timerContainer.classList.remove('hidden');

      // Show Skip Prep button — fixed at bottom so it's always visible on mobile
      const btnArea = document.getElementById('action-buttons');
      btnArea.innerHTML = '';
      const prepBar = document.createElement('div');
      prepBar.id = 'prep-fixed-bar';
      prepBar.className = 'fixed bottom-0 left-0 right-0 z-50 p-3 bg-gradient-to-t from-[#09090b] via-[#09090b]/95 to-transparent pointer-events-none';
      prepBar.innerHTML = `
      <div class="max-w-md mx-auto flex justify-center pointer-events-auto">
        <button onclick="PTE.App.skipPrep()" class="btn-primary px-6 py-3 text-sm">
          Skip — Start Recording
        </button>
      </div>`;
      document.body.appendChild(prepBar);

      PTE.Timer.start(seconds,
        (remaining, total) => {
          PTE.UI.updateTimer('main-timer', remaining, total, 'Preparation');
        },
        () => {
          this._prepResolve = null;
          this._removeFixedBar();
          const btnArea = document.getElementById('action-buttons');
          if (btnArea) btnArea.innerHTML = '';
          resolve();
        }
      );
    });
  },

  skipPrep() {
    if (this.phase !== 'prep') return;
    PTE.Timer.stop();
    this._removeFixedBar();
    const btnArea = document.getElementById('action-buttons');
    if (btnArea) btnArea.innerHTML = '';
    if (this._prepResolve) {
      this._prepResolve();
      this._prepResolve = null;
    }
  },

  recordPhase(seconds) {
    return new Promise(async (resolve) => {
      this._recordResolve = resolve;
      this.phase = 'recording';
      this.recordingStartTime = Date.now();

      // Shadowing mode (Repeat Sentence): play audio again while user records (speak along)
      if (this.shadowingMode && this.currentTypeConfig?.id === 'repeat-sentence' && this.currentQuestion) {
        const text = this.currentQuestion.text || this.currentQuestion.audioText || '';
        if (text && PTE.TTS) {
          PTE.TTS.speak(text, 0.92); // Fire and forget — plays while recording
        }
      }

      const timerContainer = document.getElementById('timer-container');
      const waveformContainer = document.getElementById('waveform-container');
      const recordingStatus = document.getElementById('recording-status');
      const transcriptContainer = document.getElementById('transcript-container');
      const pitchDisplay = document.getElementById('pitch-display');

      if (timerContainer) timerContainer.classList.remove('hidden');
      if (waveformContainer) waveformContainer.classList.remove('hidden');
      if (recordingStatus) recordingStatus.classList.remove('hidden');
      if (transcriptContainer) transcriptContainer.classList.remove('hidden');
      if (pitchDisplay) pitchDisplay.classList.remove('hidden');

      // Start recording (re-init stream if it died)
      let recStarted = PTE.AudioRecorder.start();
      if (!recStarted) {
        console.warn('[PTE] Recorder start failed, re-initializing stream...');
        const micOk = await PTE.AudioRecorder.init();
        if (micOk) {
          this.micStream = PTE.AudioRecorder.stream;
          recStarted = PTE.AudioRecorder.start();
        }
        if (!recStarted) console.error('[PTE] Recording could not start');
      }

      // Start tone analyzer (reuses AudioContext)
      if (this.micStream && PTE.ToneAnalyzer) {
        try {
          PTE.ToneAnalyzer.init(this.micStream);
          PTE.ToneAnalyzer.start();
        } catch(e) {
          console.warn('[PTE] ToneAnalyzer start failed:', e);
        }
      }

      // Start speech recognition
      PTE.SpeechRecognizer.onResult = (final, interim) => {
        const el = document.getElementById('transcript-text');
        if (el) {
          el.innerHTML = `<span class="text-zinc-200">${final}</span><span class="text-zinc-500 italic">${interim}</span>`;
        }
      };
      PTE.SpeechRecognizer.start();

      // Start waveform + pitch visualization
      this.startWaveformAnimation();

      // Countdown timer
      PTE.Timer.start(seconds,
        (remaining, total) => {
          PTE.UI.updateTimer('main-timer', remaining, total, 'Recording');
        },
        () => {
          // NOTE: NOT async — must always call resolve() even if something fails
          try { this.stopWaveformAnimation(); } catch(e) { console.warn('[PTE] stopWaveform error:', e); }
          try {
            if (PTE.ToneAnalyzer && PTE.ToneAnalyzer.isAnalyzing) {
              this.toneResults = PTE.ToneAnalyzer.stop();
            }
          } catch(e) { console.warn('[PTE] ToneAnalyzer stop error:', e); }
          try { PTE.SpeechRecognizer.stop(); } catch(e) { console.warn('[PTE] SpeechRecognizer stop error:', e); }
          if (recordingStatus) recordingStatus.classList.add('hidden');
          // Remove fixed bottom bar
          try { PTE.App._removeFixedBar(); } catch(e) {}

          // Stop recorder then resolve (recorder.stop is a promise but we must not block)
          const finishRecording = () => {
            this.phase = 'evaluating';
            resolve();
          };
          try {
            const stopPromise = PTE.AudioRecorder.stop();
            if (stopPromise && stopPromise.then) {
              stopPromise.then(finishRecording).catch(() => finishRecording());
            } else {
              finishRecording();
            }
          } catch(e) {
            console.warn('[PTE] AudioRecorder stop error:', e);
            finishRecording();
          }
        }
      );

      // Stop button — fixed at bottom of screen so user doesn't need to scroll (mobile)
      const btnArea = document.getElementById('action-buttons');
      btnArea.innerHTML = '';
      // Create a fixed bottom bar for the stop button
      const fixedBar = document.createElement('div');
      fixedBar.id = 'recording-fixed-bar';
      fixedBar.className = 'fixed bottom-0 left-0 right-0 z-50 p-3 bg-gradient-to-t from-[#09090b] via-[#09090b]/95 to-transparent pointer-events-none';
      fixedBar.innerHTML = `
      <div class="max-w-md mx-auto flex justify-center pointer-events-auto">
        <button onclick="PTE.App.stopRecordingEarly()" class="btn-danger px-6 py-3 text-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/></svg>
          Stop Recording
        </button>
      </div>`;
      document.body.appendChild(fixedBar);
    });
  },

  async stopRecordingEarly() {
    if (this.phase !== 'recording') return;
    PTE.Timer.stop();
    try { this.stopWaveformAnimation(); } catch(e) {}

    try {
      if (PTE.ToneAnalyzer && PTE.ToneAnalyzer.isAnalyzing) {
        this.toneResults = PTE.ToneAnalyzer.stop();
      }
    } catch(e) {}
    
    const recordingStatus = document.getElementById('recording-status');
    if (recordingStatus) recordingStatus.classList.add('hidden');
    
    // Remove fixed bottom bar
    this._removeFixedBar();
    
    try { await PTE.AudioRecorder.stop(); } catch(e) {}
    try { PTE.SpeechRecognizer.stop(); } catch(e) {}
    
    this.phase = 'evaluating';

    if (this._recordResolve) {
      this._recordResolve();
      this._recordResolve = null;
    }
  },

  /** Remove the fixed recording/prep bar from DOM */
  _removeFixedBar() {
    const bar = document.getElementById('recording-fixed-bar');
    if (bar) bar.remove();
    const prepBar = document.getElementById('prep-fixed-bar');
    if (prepBar) prepBar.remove();
  },

  // ── Enhanced Evaluation Phase ────────────────────────────────

  evaluatePhase() {
    try { this._doEvaluate(); } catch(e) {
      console.error('[PTE] Evaluation error:', e);
      const scoreArea = document.getElementById('score-area');
      if (scoreArea) {
        scoreArea.classList.remove('hidden');
        scoreArea.innerHTML = `
        <div class="glass neon-border rounded-2xl p-6 max-w-lg mx-auto text-center">
          <p class="text-amber-400 font-semibold mb-2">Scoring encountered an issue</p>
          <p class="text-gray-500 text-sm mb-4">Your speech may not have been captured properly. Please try again.</p>
          <p class="text-xs text-gray-600">Error: ${e.message || 'Unknown'}</p>
        </div>`;
      }
      this.phase = 'review';
      const btnArea = document.getElementById('action-buttons');
      if (btnArea) btnArea.innerHTML = `
        <button onclick="PTE.App.loadQuestion(${this.currentQuestionIndex})" class="btn-secondary px-5 py-2.5 text-sm">Try Again</button>
        <button onclick="PTE.App.nextQuestion()" class="btn-primary px-5 py-2.5 text-sm">Next Question</button>`;
    }
  },

  _doEvaluate() {
    this.phase = 'evaluating';
    const type = this.currentTypeConfig;
    const q = this.currentQuestion;
    if (!type || !q) {
      console.error('[PTE] Missing type or question in evaluate');
      return;
    }
    const transcript = (PTE.SpeechRecognizer.transcript || '').trim();
    const confidence = PTE.SpeechRecognizer.getAverageConfidence() || 0;
    const wordTimestamps = PTE.SpeechRecognizer.wordTimestamps || [];
    const recordDuration = this.recordingStartTime ? (Date.now() - this.recordingStartTime) / 1000 : 0;
    const speechAvailable = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

    // Calculate scores using official PTE criteria (0-5/0-6 bands)
    let scores = {};
    const expectedText = q.text || (q.speakers ? q.speakers.map(s => s.text).join(' ') : '') || q.audioText || '';

    if (type.scoring.includes('vocabulary')) {
      scores.vocabulary = PTE.Scoring.vocabularyScore(transcript, q.keywords);
    } else {
      // Content scoring (or Appropriacy for Respond to Situation)
      if (type.scoring.includes('content') || type.scoring.includes('appropriacy')) {
        // Content/Appropriacy scoring is task-specific, returns { raw, max, band, errors, accuracy }
        scores.contentResult = PTE.Scoring.contentScore(transcript, expectedText, q.keywords, type.id, q);
        // Convert to 0-90 display score for backward compat with UI/storage
        scores.content = scores.contentResult.max > 0
          ? PTE.Scoring.bandTo90(scores.contentResult.raw, scores.contentResult.max)
          : 0;
        // For RTS: label it as "appropriacy" in the result
        if (type.scoring.includes('appropriacy')) {
          scores.contentResult.traitName = 'Appropriacy';
        }
      }
      if (type.scoring.includes('pronunciation')) {
        // Returns 0-5 band (official PTE scale)
        scores.pronunciation = PTE.Scoring.pronunciationScore(confidence, transcript, expectedText);
      }
      if (type.scoring.includes('fluency')) {
        // Returns 0-5 band (official PTE scale)
        scores.fluency = PTE.Scoring.fluencyScore(wordTimestamps, recordDuration, transcript, type.recordTime);
      }
    }

    const overallScore = PTE.Scoring.calculateOverall(scores, type.id);

    // Generate AI Feedback
    let aiFeedback = null;
    if (PTE.AIFeedback) {
      aiFeedback = PTE.AIFeedback.generate({
        type: type.id,
        transcript,
        expected: expectedText,
        keywords: q.keywords,
        scores,
        confidence,
        toneResults: this.toneResults,
        duration: recordDuration,
        maxDuration: type.recordTime
      });
    }

    // Build the results UI
    const scoreArea = document.getElementById('score-area');
    if (!scoreArea) return;
    scoreArea.classList.remove('hidden');

    // Mobile notice if speech recognition was unavailable
    let html = '';
    if (!speechAvailable || (!transcript && recordDuration > 3)) {
      html += `
      <div class="glass rounded-2xl p-4 max-w-lg mx-auto mb-4 border border-amber-500/20 animate-fadeIn">
        <div class="flex items-start gap-3">
          <span class="text-amber-400 text-lg flex-shrink-0">&#9888;</span>
          <div>
            <p class="text-amber-400 font-semibold text-sm mb-1">${!speechAvailable ? 'Speech Recognition Not Available' : 'No Speech Detected'}</p>
            <p class="text-gray-500 text-xs leading-relaxed">${!speechAvailable
              ? 'Your browser does not support speech-to-text. Scoring requires Chrome (desktop or Android). Safari and Firefox do not support this feature yet. Your recording was still captured.'
              : 'We could not detect any speech in your recording. Please make sure your microphone is working and speak clearly. You can play back your recording below.'}</p>
          </div>
        </div>
      </div>`;
    }

    // Basic score card
    const basicFeedback = PTE.Scoring.getFeedback(scores, type.id);
    html += PTE.UI.scoreCard(overallScore, scores, type.id, basicFeedback);

    // ── Tone Analysis Section ──
    if (this.toneResults && this.toneResults.hasPitchData) {
      html += this._renderToneAnalysis(this.toneResults);
    }

    // ── AI Feedback Section ──
    if (aiFeedback) {
      html += this._renderAIFeedback(aiFeedback, q, type);
    }

    // ── Pronunciation Highlight (green/red words + click-to-pronounce) ──
    if (expectedText && transcript && !type.scoring.includes('vocabulary')) {
      html += PTE.UI.pronunciationHighlight(expectedText, transcript);
    }

    // ── Accent Analysis ──
    if (PTE.AccentAnalyzer && expectedText && transcript && !type.scoring.includes('vocabulary')) {
      const accentResult = PTE.AccentAnalyzer.analyze(expectedText, transcript);
      if (accentResult && !accentResult.perfect) {
        html += PTE.AccentAnalyzer.renderResultCard(accentResult);
      }
    }

    // ── Model Answer Script ──
    html += PTE.UI.modelAnswerScript(type.id, q);

    // ── Audio Comparison (Side-by-Side) ──
    if (PTE.AudioRecorder.audioUrl && expectedText) {
      html += `
      <div class="mt-4 glass neon-border rounded-2xl overflow-hidden max-w-lg mx-auto animate-fadeIn">
        <div class="bg-gradient-to-r from-teal-600 to-cyan-600 p-3 text-center">
          <h3 class="text-white font-bold text-sm">Audio Comparison</h3>
        </div>
        <div class="p-5">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="text-center">
              <p class="text-xs text-cyan-400 font-semibold uppercase tracking-wide mb-2">Native</p>
              <button onclick="PTE.pronounceText()" class="w-full py-3 rounded-xl bg-cyan-500/15 border border-cyan-500/20 text-cyan-400 font-medium text-sm hover:bg-cyan-500/25 transition-all">🔊 Play Native</button>
            </div>
            <div class="text-center">
              <p class="text-xs text-rose-400 font-semibold uppercase tracking-wide mb-2">Yours</p>
              <button onclick="document.getElementById('user-audio-compare').play()" class="w-full py-3 rounded-xl bg-rose-500/15 border border-rose-500/20 text-rose-400 font-medium text-sm hover:bg-rose-500/25 transition-all">🎙️ Play Yours</button>
            </div>
          </div>
          <audio id="user-audio-compare" src="${PTE.AudioRecorder.audioUrl}" class="hidden"></audio>
          <button onclick="PTE.App._playBothAudio()" class="w-full py-3 rounded-xl bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 font-medium text-sm hover:bg-indigo-500/25 transition-all">
            ▶️ Play Both (Native → Yours)
          </button>
        </div>
      </div>`;
    } else if (PTE.AudioRecorder.audioUrl) {
      html += `
      <div class="mt-4 glass rounded-xl p-4 max-w-lg mx-auto">
        <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Your Recording:</label>
        <audio controls src="${PTE.AudioRecorder.audioUrl}" class="w-full"></audio>
      </div>`;
    }

    // Recognized speech
    if (transcript) {
      html += `
      <div class="mt-4 glass rounded-xl p-4 max-w-lg mx-auto">
        <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Recognized Speech:</label>
        <p class="text-sm text-gray-400">${transcript}</p>
      </div>`;
    }

    // For ASQ, show correct answer
    if (type.scoring.includes('vocabulary')) {
      html += `
      <div class="mt-4 glass rounded-xl p-4 max-w-lg mx-auto" style="border-color:rgba(16,185,129,0.2)">
        <label class="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-1 block">Correct Answer:</label>
        <p class="text-emerald-300 font-semibold">${q.answer}</p>
        <button onclick="PTE.pronounceWord('${(q.answer || '').replace(/'/g, "\\'")}')" class="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
          Hear pronunciation
        </button>
      </div>`;
    }

    // ── Gamification XP Award ──
    if (PTE.Gamify) {
      const xpResult = PTE.Gamify.awardXP(overallScore, type.id, false, this.isPredictionsMode);
      PTE.Gamify.showToast(xpResult);
    }

    // ── Daily Challenge Completion ──
    if (this._dailyMode && PTE.Daily) {
      PTE.Daily.markCompleted(this._dailyIndex, overallScore);
      this._dailyMode = false;
    }

    // ── Spaced Repetition Tracking ──
    if (PTE.Spaced) {
      PTE.Spaced.trackResult(q.id, type.id, overallScore);
    }

    // ── Leaderboard Update ──
    if (PTE.Leaderboard) PTE.Leaderboard.updateScore();

    scoreArea.innerHTML = html;

    // Save session
    PTE.Store.addSession({
      type: type.id,
      questionId: q.id,
      overallScore,
      scores,
      transcript,
      duration: recordDuration
    });

    // Review buttons
    const btnArea = document.getElementById('action-buttons');
    const scoreAdvice = overallScore < 50
      ? `<p class="text-xs text-amber-400 mb-3 text-center">Score below 50 — try again for better practice.</p>`
      : overallScore >= 70
        ? `<p class="text-xs text-green-400 mb-3 text-center">Great score! Move to the next question.</p>`
        : '';

    btnArea.innerHTML = `
    ${scoreAdvice}
    <button onclick="PTE.App.loadQuestion(${this.currentQuestionIndex})" class="btn-secondary px-5 py-2.5 text-sm">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
      Try Again
    </button>
    <button onclick="PTE.App.nextQuestion()" class="btn-primary px-5 py-2.5 text-sm">
      Next Question
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
    </button>`;

    this.phase = 'review';
  },

  // ── Render Tone Analysis ─────────────────────────────────────

  _renderToneAnalysis(tone) {
    const a = tone.analysis;
    const ratingIcons = { good: '&#10003;', ok: '~', 'needs-work': '!', caution: '!', unknown: '?' };
    const ratingColors = { good: 'text-green-400 bg-green-500/5 border-green-500/10', ok: 'text-blue-400 bg-blue-500/5 border-blue-500/10', 'needs-work': 'text-red-400 bg-red-500/5 border-red-500/10', caution: 'text-amber-400 bg-amber-500/5 border-amber-500/10', unknown: 'text-zinc-400 bg-white/[0.02] border-[var(--border)]' };

    // Build pitch history mini-chart
    let pitchChart = '';
    if (tone.pitchHistory.length > 3) {
      const ph = tone.pitchHistory;
      const maxP = Math.max(...ph.map(p => p.pitch));
      const minP = Math.min(...ph.map(p => p.pitch));
      const range = maxP - minP || 1;
      const w = 400, h = 60;
      const points = ph.map((p, i) => {
        const x = (i / (ph.length - 1)) * w;
        const y = h - ((p.pitch - minP) / range) * (h - 8) - 4;
        return `${x},${y}`;
      }).join(' ');

      pitchChart = `
      <div class="mt-4">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">Pitch Over Time</label>
        <div class="bg-white/[0.02] rounded-lg p-3 border border-[var(--border)] overflow-hidden">
          <svg viewBox="0 0 ${w} ${h}" class="w-full" style="max-height:80px">
            <defs>
              <linearGradient id="pitchGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#6366f1" stop-opacity="0.3"/>
                <stop offset="100%" stop-color="#6366f1" stop-opacity="0.02"/>
              </linearGradient>
            </defs>
            <polygon points="0,${h} ${points} ${w},${h}" fill="url(#pitchGrad)"/>
            <polyline points="${points}" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <div class="flex justify-between text-xs text-gray-400 mt-1">
            <span>${Math.round(minP)} Hz</span>
            <span>Avg: ${tone.avgPitch} Hz</span>
            <span>${Math.round(maxP)} Hz</span>
          </div>
        </div>
      </div>`;
    }

    const renderItem = (label, analysis) => {
      const cls = ratingColors[analysis.rating] || ratingColors.unknown;
      return `
      <div class="p-3 rounded-lg border ${cls}">
        <div class="flex items-center gap-2 mb-1">
          <span class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border ${cls}">${ratingIcons[analysis.rating] || '?'}</span>
          <span class="font-semibold text-sm">${label}</span>
        </div>
        <p class="text-xs mt-1">${analysis.detail}</p>
        ${analysis.suggestion ? `<p class="text-xs mt-1 opacity-75">${analysis.suggestion}</p>` : ''}
      </div>`;
    };

    return `
    <div class="mt-5 card-elevated overflow-hidden max-w-md mx-auto animate-fadeIn">
      <div class="bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3 text-center">
        <h3 class="text-white text-xs font-semibold">Voice & Tone Analysis</h3>
      </div>
      <div class="p-4">
        <div class="grid grid-cols-3 gap-2 text-center mb-4">
          <div class="bg-white/[0.02] rounded-lg p-2">
            <p class="text-[10px] text-zinc-600">Avg Pitch</p>
            <p class="text-base font-semibold font-mono text-[var(--accent-light)]">${tone.avgPitch}<span class="text-[10px] text-zinc-600"> Hz</span></p>
          </div>
          <div class="bg-white/[0.02] rounded-lg p-2">
            <p class="text-[10px] text-zinc-600">Range</p>
            <p class="text-base font-semibold font-mono text-[var(--violet)]">${tone.pitchRange}<span class="text-[10px] text-zinc-600"> Hz</span></p>
          </div>
          <div class="bg-white/[0.02] rounded-lg p-2">
            <p class="text-[10px] text-zinc-600">Intonation</p>
            <p class="text-base font-semibold font-mono text-fuchsia-400">${tone.intonationScore}<span class="text-[10px] text-zinc-600">/100</span></p>
          </div>
        </div>
        ${pitchChart}
        <div class="space-y-3 mt-4">
          ${renderItem('Pitch Variation', a.pitch)}
          ${renderItem('Intonation', a.intonation)}
          ${renderItem('Volume', a.volume)}
        </div>
        <div class="mt-3 p-3 bg-white/[0.02] rounded-lg border border-[var(--border)]">
          <p class="text-xs text-zinc-300">${a.overall.summary}</p>
        </div>
      </div>
    </div>`;
  },

  // ── Render AI Feedback ───────────────────────────────────────

  _renderAIFeedback(fb, q, type) {
    let html = `
    <div class="mt-5 card-elevated overflow-hidden max-w-md mx-auto animate-fadeIn">
      <div class="bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-3 text-center">
        <h3 class="text-white text-xs font-semibold">AI Feedback</h3>
      </div>
      <div class="p-4">`;

    // Overall summary
    html += `<p class="text-xs text-zinc-300 mb-4 leading-relaxed">${fb.overallSummary}</p>`;

    // Strengths
    if (fb.strengths.length > 0) {
      html += `
      <div class="mb-4">
        <h4 class="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-2 flex items-center gap-1">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          Strengths
        </h4>
        ${fb.strengths.map(s => `<p class="text-xs text-green-400 bg-green-500/5 rounded-lg px-3 py-2 mb-1">${s}</p>`).join('')}
      </div>`;
    }

    // Areas to improve
    if (fb.improvements.length > 0) {
      html += `
      <div class="mb-4">
        <h4 class="text-xs font-bold text-amber-600 uppercase tracking-wide mb-2 flex items-center gap-1">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
          Areas to Improve
        </h4>
        ${fb.improvements.map(s => `<p class="text-xs text-amber-400 bg-amber-500/5 rounded-lg px-3 py-2 mb-1">${s}</p>`).join('')}
      </div>`;
    }

    // Content analysis (keyword coverage)
    if (fb.contentAnalysis && fb.contentAnalysis.keywordResults.length > 0) {
      html += `
      <div class="mb-4">
        <h4 class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-2">Keywords (${fb.contentAnalysis.coverage}%)</h4>
        <div class="h-1.5 bg-white/[0.04] rounded-full overflow-hidden mb-2">
          <div class="h-full rounded-full bg-indigo-500 transition-all" style="width:${fb.contentAnalysis.coverage}%"></div>
        </div>
        <div class="flex flex-wrap gap-1.5">
          ${fb.contentAnalysis.keywordResults.map(k => `<span class="text-[10px] px-1.5 py-0.5 rounded ${k.found ? 'bg-green-500/8 text-green-400' : 'bg-red-500/5 text-red-400 line-through'}">${k.keyword}</span>`).join('')}
        </div>
      </div>`;
    }

    // Word analysis (missed words)
    if (fb.wordAnalysis && fb.wordAnalysis.missed.length > 0) {
      html += `
      <div class="mb-4">
        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Missed Words (${fb.wordAnalysis.missed.length})</h4>
        <div class="flex flex-wrap gap-1.5">
          ${fb.wordAnalysis.missed.map(w => `<span class="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">${w}</span>`).join('')}
        </div>
        <p class="text-xs text-gray-500 mt-1">Word accuracy: ${fb.wordAnalysis.accuracy}%</p>
      </div>`;
    }

    // Fluency details
    if (fb.fluencyAnalysis) {
      const fl = fb.fluencyAnalysis;
      html += `
      <div class="mb-4">
        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Fluency Details</h4>
        <div class="grid grid-cols-3 gap-2 text-center mb-2">
          <div class="bg-white/5 rounded-lg p-2">
            <p class="text-xs text-gray-500">Words</p>
            <p class="text-sm font-bold text-gray-200">${fl.wordCount}</p>
          </div>
          <div class="bg-white/5 rounded-lg p-2">
            <p class="text-xs text-gray-500">Pace</p>
            <p class="text-sm font-bold ${fl.wpm >= 100 && fl.wpm <= 180 ? 'text-emerald-400' : 'text-amber-400'}">${fl.wpm} WPM</p>
          </div>
          <div class="bg-white/5 rounded-lg p-2">
            <p class="text-xs text-gray-500">Time Used</p>
            <p class="text-sm font-bold text-gray-200">${fl.duration}s / ${fl.maxDuration}s</p>
          </div>
        </div>
        <p class="text-xs text-gray-400">${fl.paceAssessment}</p>
      </div>`;
    }

    // Pronunciation tips
    if (fb.pronunciationAnalysis && fb.pronunciationAnalysis.tips.length > 0) {
      html += `
      <details class="mb-4">
        <summary class="text-xs font-bold text-gray-400 uppercase tracking-wide cursor-pointer hover:text-indigo-400">Pronunciation Tips (${fb.pronunciationAnalysis.level})</summary>
        <ul class="mt-2 space-y-1">
          ${fb.pronunciationAnalysis.tips.map(t => `<li class="text-xs text-gray-400 flex items-start gap-1.5"><span class="text-indigo-400 mt-0.5 flex-shrink-0">&#9654;</span>${t}</li>`).join('')}
        </ul>
      </details>`;
    }

    // PTE Strategies
    if (fb.pteStrategies.length > 0) {
      html += `
      <details class="mb-4">
        <summary class="text-xs font-bold text-indigo-400 uppercase tracking-wide cursor-pointer hover:text-indigo-300">PTE Strategies for ${type.name}</summary>
        <div class="mt-2 space-y-2">
          ${fb.pteStrategies.map(s => `
            <div class="bg-indigo-500/10 rounded-lg p-3 border border-indigo-500/20">
              <p class="text-xs font-semibold text-indigo-300 mb-0.5">${s.title}</p>
              <p class="text-xs text-indigo-400">${s.detail}</p>
            </div>
          `).join('')}
        </div>
      </details>`;
    }

    // Practice exercises
    if (fb.practiceExercises.length > 0) {
      html += `
      <details class="mb-4">
        <summary class="text-xs font-bold text-purple-400 uppercase tracking-wide cursor-pointer hover:text-purple-300">Recommended Exercises</summary>
        <div class="mt-2 space-y-2">
          ${fb.practiceExercises.map(ex => `
            <div class="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
              <p class="text-xs font-semibold text-purple-300 mb-0.5">${ex.title}</p>
              <p class="text-xs text-purple-400">${ex.description}</p>
            </div>
          `).join('')}
        </div>
      </details>`;
    }

    // Model answer
    if (fb.modelAnswer) {
      html += `
      <div class="mb-2">
        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">${fb.modelAnswer.label}</h4>
        <div class="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
          <p class="text-xs text-emerald-300">${fb.modelAnswer.text}</p>
          ${fb.modelAnswer.note ? `<p class="text-xs text-emerald-500 mt-1 italic">${fb.modelAnswer.note}</p>` : ''}
        </div>
      </div>`;
    }

    html += '</div></div>';
    return html;
  },

  // ── Data Export/Import ──────────────────────────────────────

  _exportData() {
    try {
      const data = {
        version: 1,
        exportDate: new Date().toISOString(),
        progress: PTE.Store.getAll(),
        gamify: PTE.Gamify ? PTE.Gamify.getData() : null
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `crackpte-backup-${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      const msg = document.getElementById('data-msg');
      if (msg) { msg.className = 'mb-4 p-3 rounded-xl text-sm font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'; msg.textContent = 'Data exported successfully!'; msg.classList.remove('hidden'); }
    } catch(e) {
      const msg = document.getElementById('data-msg');
      if (msg) { msg.className = 'mb-4 p-3 rounded-xl text-sm font-medium bg-red-500/15 text-red-400 border border-red-500/20'; msg.textContent = 'Export failed: ' + e.message; msg.classList.remove('hidden'); }
    }
  },

  _importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.progress || !data.progress.sessions) throw new Error('Invalid backup file format');
        if (!confirm(`Import ${data.progress.sessions.length} practice sessions? This will replace your current data.`)) return;
        PTE.Store.save(data.progress);
        if (data.gamify && PTE.Gamify) PTE.Gamify.save(data.gamify);
        const msg = document.getElementById('data-msg');
        if (msg) { msg.className = 'mb-4 p-3 rounded-xl text-sm font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'; msg.textContent = `Imported ${data.progress.sessions.length} sessions successfully! Refreshing...`; msg.classList.remove('hidden'); }
        setTimeout(() => PTE.Router.navigate('/profile'), 1500);
      } catch(err) {
        const msg = document.getElementById('data-msg');
        if (msg) { msg.className = 'mb-4 p-3 rounded-xl text-sm font-medium bg-red-500/15 text-red-400 border border-red-500/20'; msg.textContent = 'Import failed: ' + err.message; msg.classList.remove('hidden'); }
      }
    };
    reader.readAsText(file);
  },

  // ── Waveform + Pitch Animation ───────────────────────────────

  startWaveformAnimation() {
    const draw = () => {
      if (!PTE.AudioRecorder.isRecording) return;
      
      // Draw frequency waveform
      const data = PTE.AudioRecorder.getFrequencyData();
      if (data) {
        PTE.UI.drawWaveform('main-waveform', data, '#6366f1');
      }

      // Update live pitch/volume display
      if (PTE.ToneAnalyzer && PTE.ToneAnalyzer.isAnalyzing && PTE.ToneAnalyzer.volumeHistory.length > 0) {
        const latest = PTE.ToneAnalyzer.volumeHistory[PTE.ToneAnalyzer.volumeHistory.length - 1];
        const pitchEl = document.getElementById('live-pitch');
        const volEl = document.getElementById('live-volume');
        
        if (pitchEl) {
          pitchEl.textContent = latest.pitch > 0 ? `${Math.round(latest.pitch)} Hz` : '-- Hz';
        }
        if (volEl) {
          const displayVol = Math.max(0, Math.round(latest.volume + 60));
          volEl.textContent = `${displayVol} dB`;
        }

        // Update mini pitch bars
        const barsEl = document.getElementById('live-pitch-bars');
        if (barsEl) {
          const recent = PTE.ToneAnalyzer.pitchHistory.slice(-12);
          const bars = barsEl.children;
          const maxH = 24;
          for (let i = 0; i < bars.length; i++) {
            if (i < recent.length) {
              const norm = Math.min(1, (recent[i].pitch - 75) / 300);
              bars[i].style.height = Math.max(4, norm * maxH) + 'px';
              bars[i].style.background = '#8b5cf6';
            } else {
              bars[i].style.height = '4px';
              bars[i].style.background = '#e5e7eb';
            }
          }
        }
      }

      this.waveformInterval = requestAnimationFrame(draw);
    };
    draw();
  },

  stopWaveformAnimation() {
    if (this.waveformInterval) {
      cancelAnimationFrame(this.waveformInterval);
      this.waveformInterval = null;
    }
  },

  // ── Utilities ────────────────────────────────────────────────

  async _playBothAudio() {
    await PTE.pronounceText();
    await this.sleep(1000);
    const audio = document.getElementById('user-audio-compare');
    if (audio) audio.play();
  },

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * Soft cleanup: resets state for Try Again / Next Question.
   * Keeps the mic stream alive so recording works immediately.
   */
  cleanup() {
    this._exitFullscreen();
    PTE.Timer.stop();
    PTE.TTS.stop();
    this.stopWaveformAnimation();
    this._removeFixedBar();
    if (PTE.AudioRecorder.isRecording) {
      try { PTE.AudioRecorder.stop(); } catch(e) {}
    }
    if (PTE.SpeechRecognizer.isListening) {
      PTE.SpeechRecognizer.stop();
    }
    if (PTE.ToneAnalyzer) {
      PTE.ToneAnalyzer.cleanup();
    }
    // Soft reset: keep mic stream alive for retry
    PTE.AudioRecorder.reset();
    // Stop any active mock test
    if (PTE.Exam && PTE.Exam.active) {
      PTE.Exam.active = false;
      if (PTE.Exam._elapsedInterval) clearInterval(PTE.Exam._elapsedInterval);
      if (PTE.Exam.micStream) {
        PTE.Exam.micStream.getTracks().forEach(t => t.stop());
        PTE.Exam.micStream = null;
      }
    }
    this.toneResults = null;
    this._prepResolve = null;
    this._recordResolve = null;
    this.phase = 'idle';
  },

  /**
   * Full cleanup: destroys mic stream. Used when navigating away from practice.
   */
  fullCleanup() {
    this.cleanup();
    PTE.AudioRecorder.cleanup();
    if (PTE.ToneAnalyzer) PTE.ToneAnalyzer.destroy();
    this.micStream = null;
  }
};

// ── Boot ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  PTE.App.init();
});
