/**
 * PTE Speaking Module - Mock Exam Controller
 * Simulates a real PTE Academic Speaking test with:
 * - Sequential question flow matching real exam order
 * - Auto-advancing timers (no manual skip)
 * - No feedback during test (exam conditions)
 * - Comprehensive score report at the end
 */

window.PTE = window.PTE || {};

PTE.Exam = {
  // ── Test Configurations ──────────────────────────────────────

  CONFIGS: {
    full: {
      id: 'full',
      name: 'Full Mock Test',
      description: 'Complete PTE Speaking section — all question types in exam order',
      duration: '~25 min',
      icon: '🎯',
      color: '#6366f1',
      sections: [
        { type: 'read-aloud', count: 3, label: 'Read Aloud' },
        { type: 'repeat-sentence', count: 4, label: 'Repeat Sentence' },
        { type: 'describe-image', count: 2, label: 'Describe Image' },
        { type: 'retell-lecture', count: 2, label: 'Re-tell Lecture' },
        { type: 'answer-short-question', count: 4, label: 'Answer Short Question' },
        { type: 'summarize-group-discussion', count: 1, label: 'Summarize Group Discussion' },
        { type: 'respond-to-situation', count: 1, label: 'Respond to a Situation' }
      ]
    },
    quick: {
      id: 'quick',
      name: 'Quick Mock Test',
      description: 'Shorter test covering all question types — great for daily practice',
      duration: '~10 min',
      icon: '⚡',
      color: '#f59e0b',
      sections: [
        { type: 'read-aloud', count: 1, label: 'Read Aloud' },
        { type: 'repeat-sentence', count: 2, label: 'Repeat Sentence' },
        { type: 'describe-image', count: 1, label: 'Describe Image' },
        { type: 'retell-lecture', count: 1, label: 'Re-tell Lecture' },
        { type: 'answer-short-question', count: 2, label: 'Answer Short Question' },
        { type: 'summarize-group-discussion', count: 1, label: 'Summarize Group Discussion' },
        { type: 'respond-to-situation', count: 1, label: 'Respond to a Situation' }
      ]
    },
    focus: {
      id: 'focus',
      name: 'Focus Test',
      description: 'Intensive test on Read Aloud + Repeat Sentence — highest impact tasks',
      duration: '~8 min',
      icon: '🔥',
      color: '#ef4444',
      sections: [
        { type: 'read-aloud', count: 4, label: 'Read Aloud' },
        { type: 'repeat-sentence', count: 6, label: 'Repeat Sentence' }
      ]
    }
  },

  // ── State ────────────────────────────────────────────────────

  active: false,
  config: null,
  questions: [],          // Flat array of {type, typeConfig, question, index}
  currentIndex: 0,
  results: [],            // Array of {type, question, scores, transcript, overallScore, duration}
  testStartTime: 0,
  questionStartTime: 0,
  micStream: null,

  // ── Initialization ───────────────────────────────────────────

  /**
   * Build the question list for a test config
   */
  buildQuestionList(configId) {
    const config = this.CONFIGS[configId];
    if (!config) return [];

    const questions = [];
    const usedIds = new Set();

    for (const section of config.sections) {
      const bank = PTE.Questions[section.type] || [];
      const typeConfig = Object.values(PTE.QUESTION_TYPES).find(t => t.id === section.type);

      // Shuffle and pick
      const shuffled = [...bank].sort(() => Math.random() - 0.5);
      let picked = 0;

      for (const q of shuffled) {
        if (picked >= section.count) break;
        if (usedIds.has(q.id)) continue;
        usedIds.add(q.id);
        questions.push({
          type: section.type,
          typeConfig: typeConfig,
          question: q,
          sectionLabel: section.label,
          index: questions.length
        });
        picked++;
      }
    }

    return questions;
  },

  /**
   * Start the mock test
   */
  async start(configId) {
    this.config = this.CONFIGS[configId];
    if (!this.config) return;

    this.questions = this.buildQuestionList(configId);
    if (this.questions.length === 0) return;

    this.currentIndex = 0;
    this.results = [];
    this.active = true;
    this.testStartTime = Date.now();

    // Get microphone access upfront
    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      alert('Microphone access is required for the mock test. Please allow microphone access and try again.');
      this.active = false;
      return;
    }

    // Render exam interface
    this.renderExamUI();

    // Show instructions briefly, then start
    await this.showCountdown();

    // Begin first question
    await this.runQuestion();
  },

  /**
   * Show 3-2-1 countdown before test starts
   */
  showCountdown() {
    return new Promise(async (resolve) => {
      const overlay = document.getElementById('exam-overlay');
      if (!overlay) { resolve(); return; }

      for (let i = 3; i >= 1; i--) {
        overlay.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full animate-fadeIn">
          <p class="text-zinc-500 text-sm mb-2">Test starting in</p>
          <div class="w-24 h-24 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-xl shadow-black/40">
            <span class="text-5xl font-semibold text-white">${i}</span>
          </div>
          <p class="text-zinc-500 text-xs mt-4">Get ready — exam conditions apply</p>
        </div>`;
        await this._sleep(1000);
      }

      overlay.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full animate-fadeIn">
        <div class="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center shadow-xl shadow-black/40">
          <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
        </div>
        <p class="text-emerald-400 font-semibold mt-3">Begin!</p>
      </div>`;
      await this._sleep(800);

      overlay.classList.add('hidden');
      resolve();
    });
  },

  // ── Render Exam UI ───────────────────────────────────────────

  renderExamUI() {
    const total = this.questions.length;
    const root = document.getElementById('app-root');

    root.innerHTML = `
    <div class="min-h-screen bg-[#09090b] flex flex-col">
      <!-- Exam top bar -->
      <div class="bg-[#09090b] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <span class="text-white font-extrabold text-xs">C</span>
          </div>
          <div>
            <span class="font-semibold text-sm">${this.config.name}</span>
            <span class="text-zinc-500 text-xs ml-2" id="exam-section-label">--</span>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 text-sm">
            <span class="text-zinc-500">Question</span>
            <span class="font-bold" id="exam-q-counter">1 / ${total}</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <svg class="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span class="font-bold tabular-nums" id="exam-elapsed">00:00</span>
          </div>
          <button onclick="PTE.Exam.confirmEnd()" class="text-xs text-red-400 hover:text-red-300 font-medium px-3 py-1 rounded border border-red-400/30 hover:border-red-300/50 transition-colors">
            End Test
          </button>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="h-1.5 bg-[var(--surface-3)]">
        <div id="exam-progress-bar" class="h-full bg-indigo-500 transition-all duration-500" style="width:0%"></div>
      </div>

      <!-- Main exam area -->
      <div class="flex-1 flex flex-col">
        <!-- Question type indicator -->
        <div class="bg-[var(--surface-1)] border-b border-[var(--border)] px-6 py-3" id="exam-type-bar">
          <div class="max-w-3xl mx-auto flex items-center gap-3">
            <span class="text-2xl" id="exam-type-icon">📖</span>
            <div>
              <h2 class="font-semibold text-zinc-100 text-lg" id="exam-type-name">Read Aloud</h2>
              <p class="text-xs text-zinc-500" id="exam-type-desc">Read the text aloud</p>
            </div>
            <div class="ml-auto" id="exam-timer-area">
              ${PTE.UI.timer('exam-timer')}
            </div>
          </div>
        </div>

        <!-- Question content -->
        <div class="flex-1 px-4 py-6">
          <div class="max-w-3xl mx-auto" id="exam-content">
            <!-- Question rendered here -->
          </div>
        </div>

        <!-- Bottom status bar -->
        <div class="bg-[var(--surface-1)] border-t border-[var(--border)] px-6 py-3">
          <div class="max-w-3xl mx-auto flex items-center justify-between">
            <div id="exam-status" class="flex items-center gap-2 text-sm text-zinc-500">
              <span>Waiting to begin...</span>
            </div>
            <div id="exam-waveform-mini" class="hidden">
              <canvas id="exam-waveform" class="h-10 rounded-lg bg-white/[0.02]" style="width:200px"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Overlay for countdown / transitions -->
      <div id="exam-overlay" class="fixed inset-0 bg-[#09090b]/95 backdrop-blur-sm z-40 flex items-center justify-center">
      </div>
    </div>`;

    // Start elapsed timer
    this._startElapsedTimer();
  },

  // ── Run a Single Question ────────────────────────────────────

  async runQuestion() {
    if (this.currentIndex >= this.questions.length) {
      this.finishTest();
      return;
    }

    const item = this.questions[this.currentIndex];
    const { type, typeConfig, question, sectionLabel } = item;
    this.questionStartTime = Date.now();

    // Update header
    this._updateHeader(item);

    // Reset audio
    await this._initRecorder();

    // Build question content
    const content = document.getElementById('exam-content');
    content.innerHTML = this._renderQuestionContent(type, typeConfig, question);

    const status = document.getElementById('exam-status');

    // ── Phase 1: Audio playback (for listen-type questions) ──
    if (typeConfig.hasAudio) {
      status.innerHTML = '<span class="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span><span class="text-[var(--accent-light)] font-medium">Playing audio — listen carefully</span>';
      await this._playAudio(question);
      await this._sleep(300);
    }

    // ── Phase 2: Preparation ──
    if (typeConfig.prepTime > 0) {
      status.innerHTML = '<span class="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span><span class="text-amber-400 font-medium">Preparation time</span>';
      await this._runTimer(typeConfig.prepTime, 'Preparation');
    }

    // ── Phase 3: Recording ──
    status.innerHTML = '<span class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span><span class="text-red-400 font-medium">Recording — speak now</span>';
    document.getElementById('exam-waveform-mini').classList.remove('hidden');

    // Start recording + speech recognition + tone
    PTE.AudioRecorder.start();
    PTE.SpeechRecognizer.onResult = () => {};
    PTE.SpeechRecognizer.start();
    if (this.micStream && PTE.ToneAnalyzer) {
      PTE.ToneAnalyzer.init(this.micStream);
      PTE.ToneAnalyzer.start();
    }

    // Waveform animation
    const drawWave = () => {
      if (!PTE.AudioRecorder.isRecording) return;
      const data = PTE.AudioRecorder.getFrequencyData();
      if (data) PTE.UI.drawWaveform('exam-waveform', data, '#ef4444');
      requestAnimationFrame(drawWave);
    };
    drawWave();

    await this._runTimer(typeConfig.recordTime, 'Recording');

    // Stop everything
    let toneResults = null;
    if (PTE.ToneAnalyzer && PTE.ToneAnalyzer.isAnalyzing) {
      toneResults = PTE.ToneAnalyzer.stop();
    }
    await PTE.AudioRecorder.stop();
    const speechResult = PTE.SpeechRecognizer.stop();
    document.getElementById('exam-waveform-mini').classList.add('hidden');

    // ── Evaluate silently ──
    const recordDuration = (Date.now() - this.questionStartTime) / 1000;
    const transcript = PTE.SpeechRecognizer.transcript.trim();
    const confidence = PTE.SpeechRecognizer.getAverageConfidence();
    const wordTimestamps = PTE.SpeechRecognizer.wordTimestamps;
    const expectedText = question.text || (question.speakers ? question.speakers.map(s => s.text).join(' ') : '') || question.audioText || '';

    let scores = {};
    if (typeConfig.scoring.includes('vocabulary')) {
      scores.vocabulary = PTE.Scoring.vocabularyScore(transcript, question.keywords);
    } else {
      if (typeConfig.scoring.includes('content') || typeConfig.scoring.includes('appropriacy')) {
        scores.contentResult = PTE.Scoring.contentScore(transcript, expectedText, question.keywords, type, question);
        scores.content = scores.contentResult.max > 0
          ? PTE.Scoring.bandTo90(scores.contentResult.raw, scores.contentResult.max)
          : 0;
        if (typeConfig.scoring.includes('appropriacy')) {
          scores.contentResult.traitName = 'Appropriacy';
        }
      }
      if (typeConfig.scoring.includes('pronunciation')) scores.pronunciation = PTE.Scoring.pronunciationScore(confidence, transcript, expectedText);
      if (typeConfig.scoring.includes('fluency')) scores.fluency = PTE.Scoring.fluencyScore(wordTimestamps, recordDuration, transcript, typeConfig.recordTime);
    }

    const overallScore = PTE.Scoring.calculateOverall(scores, type);

    // Store result
    this.results.push({
      type, typeConfig, question, scores, overallScore, transcript, toneResults,
      duration: recordDuration, audioUrl: PTE.AudioRecorder.audioUrl
    });

    // ── Transition to next question ──
    this.currentIndex++;
    status.innerHTML = '<span class="text-zinc-500">Moving to next question...</span>';

    // Brief transition
    await this._showTransition();

    // Cleanup recorder for next question
    PTE.AudioRecorder.cleanup();
    if (PTE.ToneAnalyzer) PTE.ToneAnalyzer.cleanup();

    // Next question
    await this.runQuestion();
  },

  async _showTransition() {
    const overlay = document.getElementById('exam-overlay');
    if (!overlay) return;
    overlay.classList.remove('hidden');

    if (this.currentIndex < this.questions.length) {
      const next = this.questions[this.currentIndex];
      overlay.innerHTML = `
      <div class="text-center animate-fadeIn">
        <p class="text-zinc-500 text-sm mb-1">Next Question</p>
        <div class="flex items-center gap-2 justify-center mb-2">
          <span class="text-3xl">${next.typeConfig.icon}</span>
          <h3 class="text-xl font-semibold text-zinc-200">${next.typeConfig.name}</h3>
        </div>
        <p class="text-xs text-zinc-500">Question ${this.currentIndex + 1} of ${this.questions.length}</p>
      </div>`;
      await this._sleep(1500);
    }

    overlay.classList.add('hidden');
  },

  // ── Timer ────────────────────────────────────────────────────

  _runTimer(seconds, label) {
    return new Promise((resolve) => {
      PTE.Timer.start(seconds,
        (remaining, total) => {
          PTE.UI.updateTimer('exam-timer', remaining, total, label);
        },
        () => resolve()
      );
    });
  },

  _elapsedInterval: null,

  _startElapsedTimer() {
    const el = document.getElementById('exam-elapsed');
    this._elapsedInterval = setInterval(() => {
      if (!el) return;
      const elapsed = Math.floor((Date.now() - this.testStartTime) / 1000);
      const m = Math.floor(elapsed / 60);
      const s = elapsed % 60;
      el.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }, 1000);
  },

  // ── Audio Playback ───────────────────────────────────────────

  async _playAudio(q) {
    if (q.speakers) {
      for (const speaker of q.speakers) {
        await PTE.TTS.speak(speaker.text, 0.9);
        await this._sleep(400);
      }
    } else {
      const text = q.text || q.audioText || '';
      if (text) await PTE.TTS.speak(text, 0.9);
    }
  },

  // ── Recorder Init ────────────────────────────────────────────

  async _initRecorder() {
    PTE.AudioRecorder.cleanup();
    if (this.micStream) {
      PTE.AudioRecorder.stream = this.micStream;
      PTE.AudioRecorder.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = PTE.AudioRecorder.audioContext.createMediaStreamSource(this.micStream);
      PTE.AudioRecorder.analyser = PTE.AudioRecorder.audioContext.createAnalyser();
      PTE.AudioRecorder.analyser.fftSize = 256;
      PTE.AudioRecorder.analyser.smoothingTimeConstant = 0.8;
      source.connect(PTE.AudioRecorder.analyser);
      PTE.AudioRecorder.dataArray = new Uint8Array(PTE.AudioRecorder.analyser.frequencyBinCount);
    }
    // Reset speech recognizer
    PTE.SpeechRecognizer.transcript = '';
    PTE.SpeechRecognizer.interimTranscript = '';
    PTE.SpeechRecognizer.confidenceScores = [];
    PTE.SpeechRecognizer.wordTimestamps = [];
  },

  // ── Render Question Content ──────────────────────────────────

  _renderQuestionContent(type, typeConfig, q) {
    let html = '<div class="bg-[var(--surface-1)] rounded-xl border border-[var(--border)] shadow-sm p-6 md:p-8">';

    // Source badge
    if (q.source) {
      html += `<div class="mb-3"><span class="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--accent-surface)] text-[var(--accent-light)]">Source: ${q.source}</span></div>`;
    }

    // Read Aloud text
    if (type === 'read-aloud' && q.text) {
      html += `
      <label class="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2 block">Read the following text aloud:</label>
      <div class="bg-white/[0.02] rounded-xl p-5 text-zinc-200 leading-relaxed text-lg border border-[var(--border)]">${q.text}</div>`;
    }

    // Scenario
    if (q.scenario) {
      html += `
      <label class="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2 block">Scenario:</label>
      <div class="bg-blue-500/5 border border-blue-500/10 rounded-xl p-5 text-blue-300 leading-relaxed">${q.scenario}</div>`;
    }

    // Chart
    if (typeConfig.hasImage && q.chartType) {
      html += `
      <label class="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3 block">Describe the image below:</label>
      <div class="bg-[var(--surface-2)] rounded-xl p-4 border border-[var(--border)]">${PTE.Charts.generate(q)}</div>`;
    }

    // Speakers (SGD) - shown but not highlighted until audio plays
    if (q.speakers) {
      html += `
      <label class="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2 block">Group Discussion:</label>
      <div class="space-y-2 bg-white/[0.02] rounded-xl p-4 border border-[var(--border)]">
        ${q.speakers.map(s => `
          <div class="flex items-start gap-2">
            <span class="w-7 h-7 rounded-full bg-[var(--accent-surface)] flex items-center justify-center text-xs font-bold text-[var(--accent-light)] flex-shrink-0 mt-0.5">${s.name.charAt(s.name.length - 1)}</span>
            <div>
              <p class="text-xs font-semibold text-zinc-500">${s.name}</p>
              <p class="text-sm text-zinc-400">${s.text}</p>
            </div>
          </div>
        `).join('')}
      </div>`;
    }

    // Audio-based: show listening indicator
    if (typeConfig.hasAudio && !q.speakers && type !== 'read-aloud') {
      html += `
      <div class="flex items-center gap-3 bg-[var(--accent-surface)] border border-[rgba(109,92,255,0.12)] rounded-xl p-4 mt-4">
        <div class="w-10 h-10 bg-[var(--accent-surface)] rounded-full flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-[var(--accent-light)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
        </div>
        <div>
          <p class="font-medium text-[var(--accent)] text-sm">Listen carefully</p>
          <p class="text-xs text-[var(--accent-light)]">Audio will play automatically</p>
        </div>
      </div>`;
    }

    html += '</div>';
    return html;
  },

  // ── Header Update ────────────────────────────────────────────

  _updateHeader(item) {
    const el = (id) => document.getElementById(id);
    const total = this.questions.length;

    if (el('exam-q-counter')) el('exam-q-counter').textContent = `${item.index + 1} / ${total}`;
    if (el('exam-section-label')) el('exam-section-label').textContent = item.sectionLabel;
    if (el('exam-type-icon')) el('exam-type-icon').textContent = item.typeConfig.icon;
    if (el('exam-type-name')) el('exam-type-name').textContent = item.typeConfig.name;
    if (el('exam-type-desc')) el('exam-type-desc').textContent = item.typeConfig.description;
    if (el('exam-progress-bar')) el('exam-progress-bar').style.width = `${((item.index) / total) * 100}%`;
  },

  // ── Finish Test ──────────────────────────────────────────────

  finishTest() {
    this.active = false;
    if (this._elapsedInterval) clearInterval(this._elapsedInterval);
    PTE.Timer.stop();
    PTE.TTS.stop();
    PTE.AudioRecorder.cleanup();
    if (PTE.ToneAnalyzer) PTE.ToneAnalyzer.cleanup();
    if (this.micStream) {
      this.micStream.getTracks().forEach(t => t.stop());
      this.micStream = null;
    }

    const totalTime = Math.round((Date.now() - this.testStartTime) / 1000);
    this._renderResults(totalTime);
  },

  confirmEnd() {
    if (confirm('Are you sure you want to end the test? Your progress will be scored based on completed questions.')) {
      this.finishTest();
    }
  },

  // ── Results Report ───────────────────────────────────────────

  _renderResults(totalTime) {
    const root = document.getElementById('app-root');
    const results = this.results;

    if (results.length === 0) {
      root.innerHTML = PTE.UI.navbar('mock-test');
      root.innerHTML += '<div class="py-20 text-center"><p class="text-zinc-500">No questions were completed.</p><a href="#/mock-test" class="text-[var(--accent-light)] font-medium mt-4 inline-block">Back to Mock Tests</a></div>';
      return;
    }

    // Calculate scores
    const allScores = results.map(r => r.overallScore);
    const overallAvg = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
    const band = PTE.Scoring.getBand(overallAvg);
    const mins = Math.floor(totalTime / 60);
    const secs = totalTime % 60;

    // PTE score mapping (10-90 scale)
    const pteScore = overallAvg;
    let cefr = '';
    if (pteScore >= 76) cefr = 'C2';
    else if (pteScore >= 59) cefr = 'C1';
    else if (pteScore >= 50) cefr = 'B2';
    else if (pteScore >= 36) cefr = 'B1';
    else if (pteScore >= 30) cefr = 'A2';
    else cefr = 'A1';

    // Score by enabling skills
    const contentScores = results.filter(r => r.scores.content !== undefined).map(r => r.scores.content);
    const pronScores = results.filter(r => r.scores.pronunciation !== undefined).map(r => r.scores.pronunciation);
    const fluScores = results.filter(r => r.scores.fluency !== undefined).map(r => r.scores.fluency);
    const vocScores = results.filter(r => r.scores.vocabulary !== undefined).map(r => r.scores.vocabulary);

    const avg = arr => arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : null;

    const avgContent = avg(contentScores);
    const avgPron = avg(pronScores);
    const avgFlu = avg(fluScores);
    const avgVoc = avg(vocScores);

    // By question type
    const byType = {};
    results.forEach(r => {
      if (!byType[r.type]) byType[r.type] = [];
      byType[r.type].push(r.overallScore);
    });

    // Save to progress
    PTE.Store.addSession({
      type: 'mock-test',
      questionId: this.config.id,
      overallScore: pteScore,
      scores: { content: avgContent, pronunciation: avgPron, fluency: avgFlu },
      transcript: `Mock test: ${results.length} questions`,
      duration: totalTime
    });

    // Build result rows
    let resultRows = '';
    results.forEach((r, i) => {
      const b = PTE.Scoring.getBand(r.overallScore);
      resultRows += `
      <div class="flex items-center gap-3 py-3 ${i < results.length - 1 ? 'border-b border-[var(--border)]' : ''}">
        <span class="w-6 h-6 bg-[var(--surface-3)] rounded-full flex items-center justify-center text-xs font-bold text-zinc-500">${i + 1}</span>
        <span class="text-lg">${r.typeConfig.icon}</span>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-zinc-200 truncate">${r.typeConfig.name}</p>
          <p class="text-xs text-zinc-500 truncate">${r.transcript ? r.transcript.slice(0, 60) + (r.transcript.length > 60 ? '...' : '') : 'No speech detected'}</p>
        </div>
        <div class="text-right">
          <span class="text-sm font-bold" style="color:${b.color}">${r.overallScore}/90</span>
        </div>
      </div>`;
    });

    // Type breakdown
    let typeRows = '';
    Object.entries(byType).forEach(([typeId, scores]) => {
      const tc = Object.values(PTE.QUESTION_TYPES).find(t => t.id === typeId);
      if (!tc) return;
      const typeAvg = avg(scores);
      const pct = (typeAvg / 90) * 100;
      typeRows += `
      <div class="flex items-center gap-3">
        <span class="text-lg">${tc.icon}</span>
        <div class="flex-1">
          <div class="flex justify-between mb-1">
            <span class="text-xs font-medium text-zinc-400">${tc.name} (${scores.length})</span>
            <span class="text-xs font-bold" style="color:${tc.color}">${typeAvg}/90</span>
          </div>
          <div class="h-2 bg-[var(--surface-3)] rounded-full overflow-hidden">
            <div class="h-full rounded-full" style="width:${pct}%;background:${tc.color}"></div>
          </div>
        </div>
      </div>`;
    });

    root.innerHTML = `
    ${PTE.UI.navbar('mock-test')}
    <main class="min-h-screen bg-[#09090b] py-8 px-4">
      <div class="max-w-3xl mx-auto">
        <!-- Hero Score Card -->
        <div class="bg-gradient-to-br from-[#6d5cff] via-purple-600 to-[#a78bfa] rounded-xl p-8 text-center text-white shadow-xl shadow-black/40 mb-8 animate-fadeIn">
          <p class="text-white/60 text-sm mb-1">${this.config.name} — Complete</p>
          <div class="relative inline-flex items-center justify-center my-4">
            <svg class="w-40 h-40 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="8"/>
              <circle cx="60" cy="60" r="52" fill="none" stroke="white" stroke-width="8" 
                stroke-linecap="round" stroke-dasharray="326.73" stroke-dashoffset="${326.73 * (1 - pteScore / 90)}"
                class="score-circle-animate"/>
            </svg>
            <div class="absolute flex flex-col items-center">
              <span class="text-5xl font-extrabold">${pteScore}</span>
              <span class="text-white/50 text-xs">/90</span>
            </div>
          </div>
          <div class="flex items-center justify-center gap-3 mb-4">
            <span class="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full font-semibold text-sm">${band.emoji} ${band.label}</span>
            <span class="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full font-semibold text-sm">CEFR: ${cefr}</span>
          </div>
          <div class="grid grid-cols-3 gap-4 max-w-sm mx-auto text-center">
            <div>
              <p class="text-2xl font-bold">${results.length}</p>
              <p class="text-xs text-white/50">Questions</p>
            </div>
            <div>
              <p class="text-2xl font-bold">${mins}:${secs.toString().padStart(2, '0')}</p>
              <p class="text-xs text-white/50">Duration</p>
            </div>
            <div>
              <p class="text-2xl font-bold">${Math.max(...allScores)}</p>
              <p class="text-xs text-white/50">Best Score</p>
            </div>
          </div>
        </div>

        <!-- Enabling Skills -->
        <div class="bg-[var(--surface-1)] rounded-xl border border-[var(--border)] shadow-sm p-6 mb-6">
          <h3 class="font-semibold text-zinc-200 mb-4">Enabling Skills Breakdown</h3>
          <div class="space-y-4">
            ${avgContent !== null ? PTE.UI.scoreBar('Content', avgContent) : ''}
            ${avgPron !== null ? PTE.UI.scoreBar('Pronunciation', avgPron) : ''}
            ${avgFlu !== null ? PTE.UI.scoreBar('Fluency', avgFlu) : ''}
            ${avgVoc !== null ? PTE.UI.scoreBar('Vocabulary', avgVoc) : ''}
          </div>
        </div>

        <!-- By Question Type -->
        <div class="bg-[var(--surface-1)] rounded-xl border border-[var(--border)] shadow-sm p-6 mb-6">
          <h3 class="font-semibold text-zinc-200 mb-4">Score by Question Type</h3>
          <div class="space-y-4">${typeRows}</div>
        </div>

        <!-- Question-by-Question -->
        <div class="bg-[var(--surface-1)] rounded-xl border border-[var(--border)] shadow-sm overflow-hidden mb-6">
          <div class="px-6 py-4 border-b border-[var(--border)]">
            <h3 class="font-semibold text-zinc-200">Question-by-Question Results</h3>
          </div>
          <div class="px-6 py-2">${resultRows}</div>
        </div>

        <!-- Actions -->
        <div class="flex justify-center gap-4 mb-12">
          <a href="#/mock-test" class="inline-flex items-center gap-2 bg-[var(--surface-2)] text-zinc-300 font-semibold px-6 py-3 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-3)] transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Take Another Test
          </a>
          <a href="#/progress" class="inline-flex items-center gap-2 bg-[var(--accent)] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[var(--accent)]/90 transition-all shadow-xl shadow-black/40">
            View All Progress
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </a>
        </div>
      </div>
    </main>`;
  },

  // ── Utility ──────────────────────────────────────────────────

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};
