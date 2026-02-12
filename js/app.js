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
  waveformInterval: null,
  _recordResolve: null,
  _prepResolve: null,       // stored resolve for skip prep
  toneResults: null,         // tone analysis results
  micStream: null,           // shared mic stream

  // ── Initialization ───────────────────────────────────────────

  async init() {
    // Merge ALL question banks into PTE.Questions
    if (PTE.mergePredictions) PTE.mergePredictions();
    if (PTE.mergeBankSpeaking) PTE.mergeBankSpeaking();
    if (PTE.mergeBankVocab) PTE.mergeBankVocab();

    // Log total questions
    let total = 0;
    Object.keys(PTE.Questions).forEach(function(k) { total += PTE.Questions[k].length; });
    console.log('[PTE] Total questions loaded: ' + total);

    // Initialize TTS
    await PTE.TTS.init();

    // Initialize Speech Recognition
    PTE.SpeechRecognizer.init();

    // Setup routes
    PTE.Router.on('/', () => this.renderPage('home'));
    PTE.Router.on('/practice', () => this.renderPage('practice'));
    PTE.Router.on('/progress', () => this.renderPage('progress'));
    PTE.Router.on('/mock-test', () => this.renderPage('mock-test'));
    PTE.Router.on('/predictions', () => this.renderPage('predictions'));
    PTE.Router.on('/predictions/:type', (type) => this.startPractice(type, true));
    PTE.Router.on('/practice/:type', (type) => this.startPractice(type, false));

    // Start router
    PTE.Router.init();
  },

  renderPage(page) {
    this.cleanup();
    const root = document.getElementById('app-root');
    switch (page) {
      case 'home':
        root.innerHTML = PTE.Pages.home();
        break;
      case 'practice':
        root.innerHTML = PTE.Pages.practice();
        break;
      case 'progress':
        root.innerHTML = PTE.Pages.progress();
        break;
      case 'mock-test':
        root.innerHTML = PTE.Pages.mockTest();
        break;
      case 'predictions':
        root.innerHTML = PTE.Pages.predictions();
        break;
    }
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

    let content = '<div class="p-6 md:p-8">';

    // Source badge for prediction questions
    if (q.source) {
      const freqColors = { 'very-high': 'bg-red-100 text-red-700', 'high': 'bg-amber-100 text-amber-700', 'medium': 'bg-blue-100 text-blue-700' };
      const freqClass = freqColors[q.frequency] || 'bg-gray-100 text-gray-600';
      content += `
      <div class="flex items-center gap-2 mb-4">
        <span class="text-xs font-semibold px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">Source: ${q.source}</span>
        ${q.frequency ? `<span class="text-xs font-semibold px-2 py-1 rounded-full ${freqClass}">Frequency: ${q.frequency.replace('-', ' ')}</span>` : ''}
      </div>`;
    }

    // Show text for Read Aloud
    if (type.id === 'read-aloud' && q.text) {
      content += `
      <div class="mb-6">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">Read the following text aloud:</label>
        <div class="bg-gray-50 rounded-xl p-5 text-gray-800 leading-relaxed text-lg border border-gray-100" id="question-text">${q.text}</div>
      </div>`;
    }

    // Scenario for Respond to Situation
    if (q.scenario) {
      content += `
      <div class="mb-6">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">Scenario:</label>
        <div class="bg-blue-50 border border-blue-100 rounded-xl p-5 text-blue-800 leading-relaxed">${q.scenario}</div>
      </div>`;
    }

    // Chart for Describe Image
    if (type.hasImage && q.chartType) {
      content += `
      <div class="mb-6">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 block">Describe the image below:</label>
        <div class="bg-white rounded-xl p-4 border border-gray-200" id="chart-container">${PTE.Charts.generate(q)}</div>
      </div>`;
    }

    // Audio indicator
    if (type.hasAudio) {
      content += `
      <div id="audio-indicator" class="mb-6 hidden">
        <div class="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
          <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-indigo-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
          </div>
          <div>
            <p class="font-medium text-indigo-700 text-sm" id="audio-status">Preparing audio...</p>
            <p class="text-xs text-indigo-400" id="audio-sub">Listen carefully</p>
          </div>
        </div>
      </div>`;
    }

    // Group discussion speakers
    if (q.speakers) {
      content += `
      <div id="speakers-area" class="mb-6 hidden">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">Group Discussion:</label>
        <div class="space-y-2 bg-gray-50 rounded-xl p-4 border border-gray-100">
          ${q.speakers.map(s => `
            <div class="flex items-start gap-2 opacity-50 transition-opacity duration-300" id="speaker-${s.name.replace(/\s/g,'-')}">
              <span class="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 flex-shrink-0 mt-0.5">${s.name.charAt(s.name.length - 1)}</span>
              <div>
                <p class="text-xs font-semibold text-gray-500">${s.name}</p>
                <p class="text-sm text-gray-600">${s.text}</p>
              </div>
            </div>
          `).join('')}
        </div>
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
        <div class="flex items-center justify-between bg-gray-50 rounded-xl p-3 border border-gray-100">
          <div class="text-center flex-1">
            <p class="text-xs text-gray-400">Pitch</p>
            <p id="live-pitch" class="text-lg font-bold text-indigo-600 tabular-nums">-- Hz</p>
          </div>
          <div class="w-px h-8 bg-gray-200"></div>
          <div class="text-center flex-1">
            <p class="text-xs text-gray-400">Volume</p>
            <p id="live-volume" class="text-lg font-bold text-emerald-600 tabular-nums">-- dB</p>
          </div>
          <div class="w-px h-8 bg-gray-200"></div>
          <div class="text-center flex-1">
            <p class="text-xs text-gray-400">Intonation</p>
            <div id="live-pitch-bars" class="flex items-end justify-center gap-0.5 h-6 mt-1">
              ${Array(12).fill(0).map(() => '<div class="w-1.5 bg-gray-200 rounded-full" style="height:4px"></div>').join('')}
            </div>
          </div>
        </div>
      </div>
      <div id="transcript-container" class="hidden w-full">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">What we heard:</label>
        <div id="transcript-text" class="bg-gray-50 rounded-xl p-4 text-gray-600 text-sm min-h-[60px] border border-gray-100"></div>
      </div>
      <div id="recording-status" class="hidden">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          <span class="text-sm font-medium text-red-600">Recording...</span>
        </div>
      </div>
    </div>`;

    content += '</div>';
    area.innerHTML = content;

    // Action buttons
    btnArea.innerHTML = `
    <button id="btn-start" onclick="PTE.App.beginPractice()" 
      class="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
      Begin
    </button>`;
  },

  // ── Practice Phases ──────────────────────────────────────────

  async beginPractice() {
    const type = this.currentTypeConfig;
    const q = this.currentQuestion;

    // Request mic access
    const micOk = await PTE.AudioRecorder.init();
    if (!micOk) {
      alert('Microphone access is required for speaking practice. Please allow microphone access and try again.');
      return;
    }
    this.micStream = PTE.AudioRecorder.stream;

    // Hide start button and skip
    document.getElementById('action-buttons').innerHTML = '';
    const skipBtn = document.getElementById('btn-skip');
    if (skipBtn) skipBtn.style.display = 'none';

    // Phase 1: Play audio
    if (type.hasAudio) {
      await this.playAudioPhase(q);
    }

    // Phase 2: Preparation time (with skip option)
    if (type.prepTime > 0) {
      await this.prepPhase(type.prepTime);
    }

    // Phase 3: Recording (with tone analysis)
    await this.recordPhase(type.recordTime);

    // Phase 4: Evaluate with AI feedback
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

      if (q.speakers) {
        const speakersArea = document.getElementById('speakers-area');
        if (speakersArea) speakersArea.classList.remove('hidden');
        
        for (const speaker of q.speakers) {
          const speakerEl = document.getElementById(`speaker-${speaker.name.replace(/\s/g,'-')}`);
          if (speakerEl) speakerEl.style.opacity = '1';
          if (statusEl) statusEl.textContent = `${speaker.name} is speaking...`;
          await PTE.TTS.speak(speaker.text, 0.9);
          await this.sleep(500);
        }
      } else {
        const textToSpeak = q.text || q.audioText || '';
        if (textToSpeak) {
          await PTE.TTS.speak(textToSpeak, 0.9);
        }
      }

      if (statusEl) statusEl.textContent = 'Audio complete';
      if (subEl) subEl.textContent = 'Prepare your response';
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

      // Show Skip Prep button
      const btnArea = document.getElementById('action-buttons');
      btnArea.innerHTML = `
      <button onclick="PTE.App.skipPrep()" 
        class="inline-flex items-center gap-2 bg-white text-indigo-600 font-semibold px-6 py-3 rounded-xl border-2 border-indigo-200 hover:bg-indigo-50 transition-all">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
        Skip Preparation — Start Recording Now
      </button>`;

      PTE.Timer.start(seconds,
        (remaining, total) => {
          PTE.UI.updateTimer('main-timer', remaining, total, 'Preparation');
        },
        () => {
          this._prepResolve = null;
          // Hide skip button when prep ends naturally
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

      // Start recording
      PTE.AudioRecorder.start();

      // Start tone analyzer (uses a separate AudioContext from same stream)
      if (this.micStream && PTE.ToneAnalyzer) {
        PTE.ToneAnalyzer.init(this.micStream);
        PTE.ToneAnalyzer.start();
      }

      // Start speech recognition
      PTE.SpeechRecognizer.onResult = (final, interim) => {
        const el = document.getElementById('transcript-text');
        if (el) {
          el.innerHTML = `<span class="text-gray-800">${final}</span><span class="text-gray-400 italic">${interim}</span>`;
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
        async () => {
          this.stopWaveformAnimation();
          // Get tone results before stopping
          if (PTE.ToneAnalyzer && PTE.ToneAnalyzer.isAnalyzing) {
            this.toneResults = PTE.ToneAnalyzer.stop();
          }
          await PTE.AudioRecorder.stop();
          PTE.SpeechRecognizer.stop();
          if (recordingStatus) recordingStatus.classList.add('hidden');
          this.phase = 'evaluating';
          resolve();
        }
      );

      // Stop button
      const btnArea = document.getElementById('action-buttons');
      btnArea.innerHTML = `
      <button onclick="PTE.App.stopRecordingEarly()" 
        class="inline-flex items-center gap-2 bg-red-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-200">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/></svg>
        Stop Recording
      </button>`;
    });
  },

  async stopRecordingEarly() {
    if (this.phase !== 'recording') return;
    PTE.Timer.stop();
    this.stopWaveformAnimation();

    if (PTE.ToneAnalyzer && PTE.ToneAnalyzer.isAnalyzing) {
      this.toneResults = PTE.ToneAnalyzer.stop();
    }
    
    const recordingStatus = document.getElementById('recording-status');
    if (recordingStatus) recordingStatus.classList.add('hidden');
    
    await PTE.AudioRecorder.stop();
    PTE.SpeechRecognizer.stop();
    
    this.phase = 'evaluating';

    if (this._recordResolve) {
      this._recordResolve();
      this._recordResolve = null;
    }
  },

  // ── Enhanced Evaluation Phase ────────────────────────────────

  evaluatePhase() {
    this.phase = 'evaluating';
    const type = this.currentTypeConfig;
    const q = this.currentQuestion;
    const transcript = PTE.SpeechRecognizer.transcript.trim();
    const confidence = PTE.SpeechRecognizer.getAverageConfidence();
    const wordTimestamps = PTE.SpeechRecognizer.wordTimestamps;
    const recordDuration = (Date.now() - this.recordingStartTime) / 1000;

    // Calculate scores
    let scores = {};
    const expectedText = q.text || (q.speakers ? q.speakers.map(s => s.text).join(' ') : '') || q.audioText || '';

    if (type.scoring.includes('vocabulary')) {
      scores.vocabulary = PTE.Scoring.vocabularyScore(transcript, q.keywords);
    } else {
      if (type.scoring.includes('content')) {
        scores.content = PTE.Scoring.contentScore(transcript, expectedText, q.keywords);
      }
      if (type.scoring.includes('pronunciation')) {
        scores.pronunciation = PTE.Scoring.pronunciationScore(confidence, transcript);
      }
      if (type.scoring.includes('fluency')) {
        scores.fluency = PTE.Scoring.fluencyScore(wordTimestamps, recordDuration, transcript);
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
    scoreArea.classList.remove('hidden');

    // Basic score card
    const basicFeedback = PTE.Scoring.getFeedback(scores, type.id);
    let html = PTE.UI.scoreCard(overallScore, scores, type.id, basicFeedback);

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

    // ── Model Answer Script ──
    html += PTE.UI.modelAnswerScript(type.id, q);

    // Audio playback
    if (PTE.AudioRecorder.audioUrl) {
      html += `
      <div class="mt-4 bg-white rounded-xl border border-gray-100 p-4 max-w-lg mx-auto">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">Your Recording:</label>
        <audio controls src="${PTE.AudioRecorder.audioUrl}" class="w-full"></audio>
      </div>`;
    }

    // Recognized speech
    if (transcript) {
      html += `
      <div class="mt-4 bg-white rounded-xl border border-gray-100 p-4 max-w-lg mx-auto">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">Recognized Speech:</label>
        <p class="text-sm text-gray-600">${transcript}</p>
      </div>`;
    }

    // For ASQ, show correct answer
    if (type.scoring.includes('vocabulary')) {
      html += `
      <div class="mt-4 bg-emerald-50 rounded-xl border border-emerald-100 p-4 max-w-lg mx-auto">
        <label class="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1 block">Correct Answer:</label>
        <p class="text-emerald-800 font-semibold">${q.answer}</p>
        <button onclick="PTE.pronounceWord('${(q.answer || '').replace(/'/g, "\\'")}')" class="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-800 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
          Hear pronunciation
        </button>
      </div>`;
    }

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
    btnArea.innerHTML = `
    <button onclick="PTE.App.loadQuestion(${this.currentQuestionIndex})" 
      class="inline-flex items-center gap-2 bg-white text-gray-700 font-semibold px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
      Try Again
    </button>
    <button onclick="PTE.App.nextQuestion()" 
      class="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
      Next Question
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
    </button>`;

    this.phase = 'review';
  },

  // ── Render Tone Analysis ─────────────────────────────────────

  _renderToneAnalysis(tone) {
    const a = tone.analysis;
    const ratingIcons = { good: '&#10003;', ok: '~', 'needs-work': '!', caution: '!', unknown: '?' };
    const ratingColors = { good: 'text-emerald-600 bg-emerald-50 border-emerald-200', ok: 'text-blue-600 bg-blue-50 border-blue-200', 'needs-work': 'text-red-600 bg-red-50 border-red-200', caution: 'text-amber-600 bg-amber-50 border-amber-200', unknown: 'text-gray-500 bg-gray-50 border-gray-200' };

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
        <div class="bg-gray-50 rounded-lg p-3 border border-gray-100 overflow-hidden">
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
    <div class="mt-6 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden max-w-lg mx-auto animate-fadeIn">
      <div class="bg-gradient-to-r from-violet-500 to-fuchsia-500 p-4 text-center">
        <h3 class="text-white font-bold text-sm flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>
          Voice & Tone Analysis
        </h3>
      </div>
      <div class="p-5">
        <div class="grid grid-cols-3 gap-3 text-center mb-4">
          <div class="bg-gray-50 rounded-lg p-2">
            <p class="text-xs text-gray-400">Avg Pitch</p>
            <p class="text-lg font-bold text-indigo-600">${tone.avgPitch}<span class="text-xs font-normal text-gray-400"> Hz</span></p>
          </div>
          <div class="bg-gray-50 rounded-lg p-2">
            <p class="text-xs text-gray-400">Pitch Range</p>
            <p class="text-lg font-bold text-purple-600">${tone.pitchRange}<span class="text-xs font-normal text-gray-400"> Hz</span></p>
          </div>
          <div class="bg-gray-50 rounded-lg p-2">
            <p class="text-xs text-gray-400">Intonation</p>
            <p class="text-lg font-bold text-fuchsia-600">${tone.intonationScore}<span class="text-xs font-normal text-gray-400">/100</span></p>
          </div>
        </div>
        ${pitchChart}
        <div class="space-y-3 mt-4">
          ${renderItem('Pitch Variation', a.pitch)}
          ${renderItem('Intonation', a.intonation)}
          ${renderItem('Volume', a.volume)}
        </div>
        <div class="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <p class="text-xs font-semibold text-gray-600">${a.overall.summary}</p>
        </div>
      </div>
    </div>`;
  },

  // ── Render AI Feedback ───────────────────────────────────────

  _renderAIFeedback(fb, q, type) {
    let html = `
    <div class="mt-6 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden max-w-lg mx-auto animate-fadeIn">
      <div class="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 text-center">
        <h3 class="text-white font-bold text-sm flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          AI Detailed Feedback
        </h3>
      </div>
      <div class="p-5">`;

    // Overall summary
    html += `<p class="text-sm text-gray-700 mb-4 leading-relaxed">${fb.overallSummary}</p>`;

    // Strengths
    if (fb.strengths.length > 0) {
      html += `
      <div class="mb-4">
        <h4 class="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-2 flex items-center gap-1">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          Strengths
        </h4>
        ${fb.strengths.map(s => `<p class="text-xs text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2 mb-1.5">${s}</p>`).join('')}
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
        ${fb.improvements.map(s => `<p class="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mb-1.5">${s}</p>`).join('')}
      </div>`;
    }

    // Content analysis (keyword coverage)
    if (fb.contentAnalysis && fb.contentAnalysis.keywordResults.length > 0) {
      html += `
      <div class="mb-4">
        <h4 class="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Keyword Coverage (${fb.contentAnalysis.coverage}%)</h4>
        <div class="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
          <div class="h-full rounded-full bg-indigo-500 transition-all" style="width:${fb.contentAnalysis.coverage}%"></div>
        </div>
        <div class="flex flex-wrap gap-1.5">
          ${fb.contentAnalysis.keywordResults.map(k => `<span class="text-xs px-2 py-0.5 rounded-full ${k.found ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-500 line-through'}">${k.keyword}</span>`).join('')}
        </div>
      </div>`;
    }

    // Word analysis (missed words)
    if (fb.wordAnalysis && fb.wordAnalysis.missed.length > 0) {
      html += `
      <div class="mb-4">
        <h4 class="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Missed Words (${fb.wordAnalysis.missed.length})</h4>
        <div class="flex flex-wrap gap-1.5">
          ${fb.wordAnalysis.missed.map(w => `<span class="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">${w}</span>`).join('')}
        </div>
        <p class="text-xs text-gray-400 mt-1">Word accuracy: ${fb.wordAnalysis.accuracy}%</p>
      </div>`;
    }

    // Fluency details
    if (fb.fluencyAnalysis) {
      const fl = fb.fluencyAnalysis;
      html += `
      <div class="mb-4">
        <h4 class="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Fluency Details</h4>
        <div class="grid grid-cols-3 gap-2 text-center mb-2">
          <div class="bg-gray-50 rounded-lg p-2">
            <p class="text-xs text-gray-400">Words</p>
            <p class="text-sm font-bold text-gray-700">${fl.wordCount}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-2">
            <p class="text-xs text-gray-400">Pace</p>
            <p class="text-sm font-bold ${fl.wpm >= 100 && fl.wpm <= 180 ? 'text-emerald-600' : 'text-amber-600'}">${fl.wpm} WPM</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-2">
            <p class="text-xs text-gray-400">Time Used</p>
            <p class="text-sm font-bold text-gray-700">${fl.duration}s / ${fl.maxDuration}s</p>
          </div>
        </div>
        <p class="text-xs text-gray-600">${fl.paceAssessment}</p>
      </div>`;
    }

    // Pronunciation tips
    if (fb.pronunciationAnalysis && fb.pronunciationAnalysis.tips.length > 0) {
      html += `
      <details class="mb-4">
        <summary class="text-xs font-bold text-gray-600 uppercase tracking-wide cursor-pointer hover:text-indigo-600">Pronunciation Tips (${fb.pronunciationAnalysis.level})</summary>
        <ul class="mt-2 space-y-1">
          ${fb.pronunciationAnalysis.tips.map(t => `<li class="text-xs text-gray-600 flex items-start gap-1.5"><span class="text-indigo-400 mt-0.5 flex-shrink-0">&#9654;</span>${t}</li>`).join('')}
        </ul>
      </details>`;
    }

    // PTE Strategies
    if (fb.pteStrategies.length > 0) {
      html += `
      <details class="mb-4">
        <summary class="text-xs font-bold text-indigo-600 uppercase tracking-wide cursor-pointer hover:text-indigo-700">PTE Strategies for ${type.name}</summary>
        <div class="mt-2 space-y-2">
          ${fb.pteStrategies.map(s => `
            <div class="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
              <p class="text-xs font-semibold text-indigo-800 mb-0.5">${s.title}</p>
              <p class="text-xs text-indigo-600">${s.detail}</p>
            </div>
          `).join('')}
        </div>
      </details>`;
    }

    // Practice exercises
    if (fb.practiceExercises.length > 0) {
      html += `
      <details class="mb-4">
        <summary class="text-xs font-bold text-purple-600 uppercase tracking-wide cursor-pointer hover:text-purple-700">Recommended Exercises</summary>
        <div class="mt-2 space-y-2">
          ${fb.practiceExercises.map(ex => `
            <div class="bg-purple-50 rounded-lg p-3 border border-purple-100">
              <p class="text-xs font-semibold text-purple-800 mb-0.5">${ex.title}</p>
              <p class="text-xs text-purple-600">${ex.description}</p>
            </div>
          `).join('')}
        </div>
      </details>`;
    }

    // Model answer
    if (fb.modelAnswer) {
      html += `
      <div class="mb-2">
        <h4 class="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">${fb.modelAnswer.label}</h4>
        <div class="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
          <p class="text-xs text-emerald-800">${fb.modelAnswer.text}</p>
          ${fb.modelAnswer.note ? `<p class="text-xs text-emerald-500 mt-1 italic">${fb.modelAnswer.note}</p>` : ''}
        </div>
      </div>`;
    }

    html += '</div></div>';
    return html;
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

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  cleanup() {
    PTE.Timer.stop();
    PTE.TTS.stop();
    this.stopWaveformAnimation();
    if (PTE.AudioRecorder.isRecording) {
      PTE.AudioRecorder.stop();
    }
    if (PTE.SpeechRecognizer.isListening) {
      PTE.SpeechRecognizer.stop();
    }
    if (PTE.ToneAnalyzer) {
      PTE.ToneAnalyzer.cleanup();
    }
    PTE.AudioRecorder.cleanup();
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
    this.micStream = null;
    this._prepResolve = null;
    this._recordResolve = null;
    this.phase = 'idle';
  }
};

// ── Boot ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  PTE.App.init();
});
