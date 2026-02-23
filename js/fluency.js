/**
 * Crack PTE - Fluency Lab
 * Dedicated fluency training with 6 interactive exercise types
 */
window.PTE = window.PTE || {};

PTE.Fluency = {
  STORAGE_KEY: 'crackpte_fluency',
  activeExercise: null,
  isRecording: false,
  _timers: [],

  // ── Exercise Data ──────────────────────────────────────

  TONGUE_TWISTERS: [
    { text: 'She sells seashells by the seashore.', level: 1 },
    { text: 'Peter Piper picked a peck of pickled peppers.', level: 1 },
    { text: 'How much wood would a woodchuck chuck if a woodchuck could chuck wood?', level: 2 },
    { text: 'The sixth sick sheikh\'s sixth sheep\'s sick.', level: 2 },
    { text: 'Red lorry, yellow lorry, red lorry, yellow lorry.', level: 1 },
    { text: 'Unique New York, unique New York, you know you need unique New York.', level: 2 },
    { text: 'A proper copper coffee pot.', level: 1 },
    { text: 'I saw Susie sitting in a shoeshine shop.', level: 1 },
    { text: 'Fuzzy Wuzzy was a bear. Fuzzy Wuzzy had no hair. Fuzzy Wuzzy wasn\'t very fuzzy, was he?', level: 2 },
    { text: 'Betty Botter bought some butter, but she said the butter\'s bitter.', level: 2 },
    { text: 'How can a clam cram in a clean cream can?', level: 2 },
    { text: 'Six slippery snails slid slowly seaward.', level: 1 },
    { text: 'I wish to wish the wish you wish to wish, but if you wish the wish the witch wishes, I won\'t wish the wish you wish to wish.', level: 3 },
    { text: 'If a dog chews shoes, whose shoes does he choose?', level: 1 },
    { text: 'The thirty-three thieves thought that they thrilled the throne throughout Thursday.', level: 3 },
    { text: 'Can you can a canned can into an un-canned can like a canner can can a canned can into an un-canned can?', level: 3 },
    { text: 'Pad kid poured curd pulled cod.', level: 3 },
    { text: 'Brisk brave brigadiers brandished broad bright blades.', level: 2 },
  ],

  READING_PASSAGES: [
    { text: 'Climate change is one of the most pressing issues facing our planet today. Rising global temperatures have led to more frequent extreme weather events, melting ice caps, and rising sea levels. Scientists agree that human activities, particularly the burning of fossil fuels, are the primary drivers of these changes.', targetWPM: 140, topic: 'Climate Change' },
    { text: 'The development of artificial intelligence has transformed numerous industries in recent years. From healthcare to transportation, AI systems are being deployed to solve complex problems and improve efficiency. However, this rapid advancement also raises important ethical questions about privacy, employment, and the role of technology in society.', targetWPM: 140, topic: 'Artificial Intelligence' },
    { text: 'Education systems around the world are undergoing significant transformation. Traditional classroom-based learning is being supplemented and sometimes replaced by online platforms and digital tools. This shift has been accelerated by recent global events, forcing educators and students alike to adapt to new methods of teaching and learning.', targetWPM: 140, topic: 'Education' },
    { text: 'The global economy has become increasingly interconnected through trade, investment, and technology. Multinational corporations operate across borders, supply chains span continents, and financial markets respond instantly to events occurring thousands of miles away. This interconnectedness brings both opportunities for growth and vulnerabilities to systemic risks.', targetWPM: 130, topic: 'Global Economy' },
    { text: 'Biodiversity loss represents a critical threat to ecosystems worldwide. Deforestation, pollution, and habitat destruction have driven countless species toward extinction. Conservation efforts, including protected areas and sustainable practices, are essential to preserving the delicate balance of natural ecosystems for future generations.', targetWPM: 130, topic: 'Biodiversity' },
    { text: 'Urban planning plays a crucial role in shaping the quality of life for city residents. Well-designed cities incorporate green spaces, efficient public transportation, and mixed-use development to create vibrant, liveable communities. As urbanization continues to accelerate globally, the importance of thoughtful city planning cannot be overstated.', targetWPM: 130, topic: 'Urban Planning' },
  ],

  PHRASE_LINKS: [
    { phrase: 'pick it up', linked: 'pi-ki-tup', focus: 'Consonant-vowel linking' },
    { phrase: 'not at all', linked: 'no-ta-tall', focus: 'T-linking between vowels' },
    { phrase: 'a lot of', linked: 'a-lo-tov', focus: 'Consonant-vowel linking' },
    { phrase: 'turn it off', linked: 'tur-ni-toff', focus: 'N-linking and T-linking' },
    { phrase: 'check it out', linked: 'che-ki-tout', focus: 'K-linking and T-linking' },
    { phrase: 'give up on it', linked: 'gi-vu-po-nit', focus: 'Multiple linking' },
    { phrase: 'look at it', linked: 'loo-ka-tit', focus: 'K-linking and T-linking' },
    { phrase: 'think about it', linked: 'thin-ka-bou-tit', focus: 'K-linking' },
    { phrase: 'come on in', linked: 'cu-mo-nin', focus: 'M-linking and N-linking' },
    { phrase: 'put it away', linked: 'pu-ti-taway', focus: 'T-linking' },
    { phrase: 'an apple a day', linked: 'a-na-pple-a-day', focus: 'N-linking' },
    { phrase: 'hold on a minute', linked: 'hol-do-na-minute', focus: 'D-linking and N-linking' },
    { phrase: 'as a matter of fact', linked: 'a-za-ma-tter-ov-fact', focus: 'Z-linking and V-linking' },
    { phrase: 'sort it out', linked: 'sor-ti-tout', focus: 'T-linking' },
    { phrase: 'run out of time', linked: 'ru-nou-tov-time', focus: 'N-linking and V-linking' },
  ],

  PACE_LEVELS: [
    { label: 'Slow & Clear', wpm: 100, desc: 'Focus on clarity and pronunciation', icon: '🐢' },
    { label: 'Natural Pace', wpm: 130, desc: 'Comfortable conversational speed', icon: '🚶' },
    { label: 'PTE Target', wpm: 150, desc: 'Ideal speed for PTE scoring', icon: '🎯' },
    { label: 'Fast & Fluent', wpm: 170, desc: 'Challenge your speed limits', icon: '⚡' },
  ],

  PACE_SENTENCES: [
    'The university has announced a new scholarship program for international students.',
    'Researchers have discovered a significant correlation between exercise and mental health.',
    'The government plans to invest heavily in renewable energy sources over the next decade.',
    'Modern technology has fundamentally changed the way we communicate with each other.',
    'The conference will address several critical issues related to sustainable development.',
    'Students are encouraged to participate in extracurricular activities throughout the semester.',
    'The museum exhibition features artifacts from ancient civilizations around the world.',
    'Public transportation systems need significant upgrades to meet growing urban demands.',
    'The committee has proposed new regulations to improve workplace safety standards.',
    'Scientific evidence suggests that early childhood education has lasting positive effects.',
  ],

  // ── Persistence ────────────────────────────────────────

  getData() {
    try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || { exercises: {}, streakBest: 0, totalSessions: 0 }; } catch(e) { return { exercises: {}, streakBest: 0, totalSessions: 0 }; }
  },

  save(data) {
    try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data)); } catch(e) {}
  },

  recordSession(type, score) {
    const data = this.getData();
    if (!data.exercises[type]) data.exercises[type] = { attempts: 0, bestScore: 0, totalScore: 0 };
    data.exercises[type].attempts++;
    data.exercises[type].totalScore += score;
    if (score > data.exercises[type].bestScore) data.exercises[type].bestScore = score;
    data.totalSessions++;
    this.save(data);
    if (PTE.Gamify) PTE.Gamify.awardXP(80, 'fluency-lab', false, false);
  },

  // ── Cleanup ────────────────────────────────────────────

  cleanup() {
    this._timers.forEach(t => clearInterval(t));
    this._timers.forEach(t => clearTimeout(t));
    this._timers = [];
    this.isRecording = false;
    this.activeExercise = null;
  },

  // ── Main Page ──────────────────────────────────────────

  renderPage() {
    this.cleanup();
    const data = this.getData();
    const exercises = [
      { id: 'tongue-twisters', icon: '👅', title: 'Tongue Twisters', desc: 'Speed and clarity drills with progressive difficulty', color: 'rose' },
      { id: 'shadowing', icon: '🔊', title: 'Shadowing', desc: 'Listen and repeat simultaneously to build rhythm', color: 'cyan' },
      { id: 'timed-reading', icon: '📖', title: 'Timed Reading', desc: 'Read passages aloud at target WPM speeds', color: 'amber' },
      { id: 'phrase-linking', icon: '🔗', title: 'Phrase Linking', desc: 'Practice connected speech and natural linking', color: 'violet' },
      { id: 'pace-trainer', icon: '🎯', title: 'Pace Trainer', desc: 'Metronome-guided speaking at target speeds', color: 'emerald' },
      { id: 'fluency-streak', icon: '🔥', title: 'Fluency Streak', desc: 'Speak continuously without pausing — beat your record', color: 'orange' },
    ];

    const cards = exercises.map(ex => {
      const stats = data.exercises[ex.id];
      const attempts = stats ? stats.attempts : 0;
      const best = stats ? stats.bestScore : 0;
      return `
      <div class="card card-hover rounded-xl p-5 cursor-pointer transition-all" onclick="PTE.Fluency.startExercise('${ex.id}')">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl bg-${ex.color}-500/15 border border-${ex.color}-500/20 flex items-center justify-center text-2xl shrink-0">${ex.icon}</div>
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-semibold text-zinc-100 mb-0.5">${ex.title}</h3>
            <p class="text-xs text-zinc-500 mb-2">${ex.desc}</p>
            <div class="flex items-center gap-3">
              ${attempts > 0 ? `<span class="text-[10px] text-zinc-600 font-mono">${attempts} sessions</span>` : '<span class="text-[10px] text-zinc-600">Not started</span>'}
              ${best > 0 ? `<span class="text-[10px] text-${ex.color}-400 font-mono">Best: ${best}%</span>` : ''}
            </div>
          </div>
          <svg class="w-4 h-4 text-zinc-700 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </div>
      </div>`;
    }).join('');

    const streakBest = data.streakBest || 0;

    return `
    ${PTE.UI.navbar('fluency')}
    <main class="min-h-screen py-8 px-4">
      <div class="max-w-3xl mx-auto">
        <div class="mb-8">
          <h1 class="text-2xl font-semibold text-zinc-100 mb-2">Fluency Lab</h1>
          <p class="text-sm text-zinc-500">Structured exercises to build speaking speed, rhythm, and flow. Practice daily for best results.</p>
        </div>

        <!-- Stats Bar -->
        <div class="grid grid-cols-3 gap-3 mb-8">
          <div class="card rounded-xl p-4 text-center">
            <p class="text-xl font-semibold font-mono text-[var(--accent-light)]">${data.totalSessions || 0}</p>
            <p class="text-[10px] text-zinc-500 mt-1">Total Sessions</p>
          </div>
          <div class="card rounded-xl p-4 text-center">
            <p class="text-xl font-semibold font-mono text-amber-400">${Object.keys(data.exercises).length}/6</p>
            <p class="text-[10px] text-zinc-500 mt-1">Types Tried</p>
          </div>
          <div class="card rounded-xl p-4 text-center">
            <p class="text-xl font-semibold font-mono text-orange-400">${streakBest}s</p>
            <p class="text-[10px] text-zinc-500 mt-1">Best Streak</p>
          </div>
        </div>

        <!-- Exercise Cards -->
        <div class="space-y-3">
          ${cards}
        </div>

        <div class="mt-8 text-center">
          <a href="#/" class="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">Back to Home</a>
        </div>
      </div>
    </main>`;
  },

  // ── Exercise Router ────────────────────────────────────

  startExercise(type) {
    this.cleanup();
    this.activeExercise = type;
    const root = document.getElementById('app-root');
    switch(type) {
      case 'tongue-twisters': root.innerHTML = this.renderTongueTwisters(); break;
      case 'shadowing': root.innerHTML = this.renderShadowing(); break;
      case 'timed-reading': root.innerHTML = this.renderTimedReading(); break;
      case 'phrase-linking': root.innerHTML = this.renderPhraseLinking(); break;
      case 'pace-trainer': root.innerHTML = this.renderPaceTrainer(); break;
      case 'fluency-streak': root.innerHTML = this.renderFluencyStreak(); break;
      default: PTE.App.renderPage('fluency');
    }
  },

  _backBtn() {
    return `<button onclick="PTE.Fluency.cleanup();PTE.App.renderPage('fluency')" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-6"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>Back to Fluency Lab</button>`;
  },

  // ── 1. Tongue Twisters ─────────────────────────────────

  _twisterIdx: 0,
  _twisterLevel: 1,

  renderTongueTwisters() {
    const filtered = this.TONGUE_TWISTERS.filter(t => t.level <= this._twisterLevel);
    this._twisterIdx = Math.min(this._twisterIdx, filtered.length - 1);
    const tw = filtered[this._twisterIdx];
    if (!tw) return this._emptyState('No twisters found.');

    const wordCount = tw.text.split(/\s+/).length;

    return `
    ${PTE.UI.navbar('fluency')}
    <main class="min-h-screen py-8 px-4">
      <div class="max-w-2xl mx-auto">
        ${this._backBtn()}
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-xl font-semibold text-zinc-100">Tongue Twisters</h1>
            <p class="text-xs text-zinc-500">Say it 3 times fast without stumbling</p>
          </div>
          <div class="flex gap-1">
            ${[1,2,3].map(l => `<button onclick="PTE.Fluency._twisterLevel=${l};PTE.Fluency._twisterIdx=0;PTE.Fluency.startExercise('tongue-twisters')" class="text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${this._twisterLevel===l ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20' : 'text-zinc-500 hover:bg-white/[0.02]'}">Lv ${l}</button>`).join('')}
          </div>
        </div>

        <p class="text-center text-sm text-zinc-500 mb-4 font-mono">${this._twisterIdx + 1} / ${filtered.length}</p>

        <div class="card-elevated rounded-xl p-8 text-center mb-6">
          <span class="inline-block text-3xl mb-4">👅</span>
          <p class="text-xl md:text-2xl font-semibold text-zinc-100 leading-relaxed mb-4">${tw.text}</p>
          <p class="text-xs text-zinc-600 mb-6">${wordCount} words &middot; Level ${tw.level}</p>
          <div class="flex justify-center gap-3 flex-wrap">
            <button onclick="PTE.TTS.speak(\`${tw.text.replace(/`/g,"'")}\`, 0.85)" class="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 bg-cyan-500/10 px-5 py-2.5 rounded-xl border border-cyan-500/20 hover:bg-cyan-500/20 transition-all">
              🔊 Listen
            </button>
            <button onclick="PTE.TTS.speak(\`${tw.text.replace(/`/g,"'")}\`, 0.6)" class="inline-flex items-center gap-2 text-sm font-medium text-violet-400 bg-violet-500/10 px-5 py-2.5 rounded-xl border border-violet-500/20 hover:bg-violet-500/20 transition-all">
              🐢 Slow
            </button>
            <button onclick="PTE.Fluency.recordTwister()" id="fl-record-btn" class="inline-flex items-center gap-2 text-sm font-medium text-rose-400 bg-rose-500/10 px-5 py-2.5 rounded-xl border border-rose-500/20 hover:bg-rose-500/20 transition-all">
              🎙️ Record
            </button>
          </div>
          <div id="fl-result" class="mt-5 hidden"></div>
        </div>

        <div class="flex gap-3 justify-center">
          <button onclick="PTE.Fluency._twisterIdx=Math.max(0,PTE.Fluency._twisterIdx-1);PTE.Fluency.startExercise('tongue-twisters')" class="px-6 py-3 card rounded-xl text-zinc-400 hover:text-zinc-100 transition-colors font-medium text-sm">← Previous</button>
          <button onclick="PTE.Fluency._twisterIdx++;PTE.Fluency.startExercise('tongue-twisters')" class="px-6 py-3 bg-[var(--accent-surface)] border border-[rgba(109,92,255,0.12)] rounded-xl text-[var(--accent-light)] transition-colors font-medium text-sm">Next →</button>
        </div>
      </div>
    </main>`;
  },

  async recordTwister() {
    if (this.isRecording) return;
    const btn = document.getElementById('fl-record-btn');
    const result = document.getElementById('fl-result');
    this.isRecording = true;
    btn.innerHTML = '⏺️ Recording...';
    btn.classList.add('animate-pulse');

    const filtered = this.TONGUE_TWISTERS.filter(t => t.level <= this._twisterLevel);
    const expected = filtered[this._twisterIdx].text.toLowerCase().replace(/[^a-z\s]/g, '');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) { this._noSpeechApi(result, btn, stream); return; }
      const rec = new SpeechRecognition();
      rec.continuous = false; rec.interimResults = false; rec.lang = 'en-US';
      const startTime = Date.now();
      rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript.trim().toLowerCase().replace(/[^a-z\s]/g, '');
        const elapsed = (Date.now() - startTime) / 1000;
        const words = transcript.split(/\s+/).length;
        const wpm = Math.round((words / elapsed) * 60);
        const accuracy = this._wordAccuracy(expected, transcript);
        const score = Math.round((accuracy * 0.6 + Math.min(wpm / 180, 1) * 40));
        this.recordSession('tongue-twisters', score);
        result.innerHTML = this._scoreCard(accuracy, wpm, transcript, score);
        result.classList.remove('hidden');
      };
      rec.onerror = () => { result.innerHTML = '<p class="text-amber-400 text-sm">Could not recognize speech. Try again.</p>'; result.classList.remove('hidden'); };
      rec.onend = () => { this.isRecording = false; btn.innerHTML = '🎙️ Record'; btn.classList.remove('animate-pulse'); stream.getTracks().forEach(t=>t.stop()); };
      rec.start();
      setTimeout(() => { try { rec.stop(); } catch(e){} }, 8000);
    } catch(e) { this.isRecording = false; btn.innerHTML = '🎙️ Record'; btn.classList.remove('animate-pulse'); alert('Microphone access required.'); }
  },

  // ── 2. Shadowing ───────────────────────────────────────

  _shadowIdx: 0,

  renderShadowing() {
    const sentences = this.PACE_SENTENCES;
    this._shadowIdx = Math.min(this._shadowIdx, sentences.length - 1);
    const sentence = sentences[this._shadowIdx];

    return `
    ${PTE.UI.navbar('fluency')}
    <main class="min-h-screen py-8 px-4">
      <div class="max-w-2xl mx-auto">
        ${this._backBtn()}
        <div class="mb-6">
          <h1 class="text-xl font-semibold text-zinc-100">Shadowing</h1>
          <p class="text-xs text-zinc-500">Listen to the audio and speak along simultaneously. Match the rhythm and pace.</p>
        </div>

        <p class="text-center text-sm text-zinc-500 mb-4 font-mono">${this._shadowIdx + 1} / ${sentences.length}</p>

        <div class="card-elevated rounded-xl p-8 text-center mb-6">
          <span class="inline-block text-3xl mb-4">🔊</span>
          <p class="text-lg font-medium text-zinc-100 leading-relaxed mb-6" id="fl-shadow-text">${sentence}</p>

          <div id="fl-shadow-status" class="mb-4 hidden">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span class="text-xs text-cyan-400 font-medium">Shadowing in progress...</span>
            </div>
          </div>

          <div class="flex justify-center gap-3 flex-wrap">
            <button onclick="PTE.TTS.speak(\`${sentence.replace(/`/g,"'")}\`, 0.85)" class="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 bg-cyan-500/10 px-5 py-2.5 rounded-xl border border-cyan-500/20 hover:bg-cyan-500/20 transition-all">
              🔊 Listen First
            </button>
            <button onclick="PTE.Fluency.startShadowing()" id="fl-shadow-btn" class="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 bg-emerald-500/10 px-5 py-2.5 rounded-xl border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
              🎙️ Shadow Along
            </button>
          </div>
          <div id="fl-result" class="mt-5 hidden"></div>
        </div>

        <div class="flex gap-3 justify-center">
          <button onclick="PTE.Fluency._shadowIdx=Math.max(0,PTE.Fluency._shadowIdx-1);PTE.Fluency.startExercise('shadowing')" class="px-6 py-3 card rounded-xl text-zinc-400 hover:text-zinc-100 transition-colors font-medium text-sm">← Previous</button>
          <button onclick="PTE.Fluency._shadowIdx=(PTE.Fluency._shadowIdx+1)%PTE.Fluency.PACE_SENTENCES.length;PTE.Fluency.startExercise('shadowing')" class="px-6 py-3 bg-[var(--accent-surface)] border border-[rgba(109,92,255,0.12)] rounded-xl text-[var(--accent-light)] transition-colors font-medium text-sm">Next →</button>
        </div>
      </div>
    </main>`;
  },

  async startShadowing() {
    if (this.isRecording) return;
    const btn = document.getElementById('fl-shadow-btn');
    const status = document.getElementById('fl-shadow-status');
    const result = document.getElementById('fl-result');
    this.isRecording = true;
    btn.innerHTML = '⏺️ Shadowing...';
    btn.classList.add('animate-pulse');
    status.classList.remove('hidden');

    const sentence = this.PACE_SENTENCES[this._shadowIdx];
    const expected = sentence.toLowerCase().replace(/[^a-z\s]/g, '');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) { this._noSpeechApi(result, btn, stream); status.classList.add('hidden'); return; }

      PTE.TTS.speak(sentence, 0.85);

      const rec = new SpeechRecognition();
      rec.continuous = false; rec.interimResults = false; rec.lang = 'en-US';
      const startTime = Date.now();
      rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript.trim().toLowerCase().replace(/[^a-z\s]/g, '');
        const elapsed = (Date.now() - startTime) / 1000;
        const words = transcript.split(/\s+/).length;
        const wpm = Math.round((words / elapsed) * 60);
        const accuracy = this._wordAccuracy(expected, transcript);
        const score = Math.round((accuracy * 0.5 + Math.min(wpm / 160, 1) * 30 + 20));
        this.recordSession('shadowing', Math.min(score, 100));
        result.innerHTML = this._scoreCard(accuracy, wpm, transcript, Math.min(score, 100));
        result.classList.remove('hidden');
      };
      rec.onerror = () => { result.innerHTML = '<p class="text-amber-400 text-sm">Could not recognize speech. Try again.</p>'; result.classList.remove('hidden'); };
      rec.onend = () => { this.isRecording = false; btn.innerHTML = '🎙️ Shadow Along'; btn.classList.remove('animate-pulse'); status.classList.add('hidden'); stream.getTracks().forEach(t=>t.stop()); };
      rec.start();
      setTimeout(() => { try { rec.stop(); } catch(e){} }, 12000);
    } catch(e) { this.isRecording = false; btn.innerHTML = '🎙️ Shadow Along'; btn.classList.remove('animate-pulse'); status.classList.add('hidden'); alert('Microphone access required.'); }
  },

  // ── 3. Timed Reading ───────────────────────────────────

  _readingIdx: 0,

  renderTimedReading() {
    const passage = this.READING_PASSAGES[this._readingIdx];
    if (!passage) return this._emptyState('No passages found.');
    const wordCount = passage.text.split(/\s+/).length;
    const targetTime = Math.round((wordCount / passage.targetWPM) * 60);

    return `
    ${PTE.UI.navbar('fluency')}
    <main class="min-h-screen py-8 px-4">
      <div class="max-w-2xl mx-auto">
        ${this._backBtn()}
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-xl font-semibold text-zinc-100">Timed Reading</h1>
            <p class="text-xs text-zinc-500">Read aloud at the target pace</p>
          </div>
          <div class="text-right">
            <p class="text-xs text-zinc-500">Target</p>
            <p class="text-sm font-mono text-amber-400">${passage.targetWPM} WPM</p>
          </div>
        </div>

        <p class="text-center text-sm text-zinc-500 mb-4 font-mono">${this._readingIdx + 1} / ${this.READING_PASSAGES.length}</p>

        <div class="card-elevated rounded-xl p-6 mb-6">
          <div class="flex items-center gap-2 mb-4">
            <span class="badge badge-level">${passage.topic}</span>
            <span class="text-[10px] text-zinc-600 font-mono">${wordCount} words &middot; ~${targetTime}s target</span>
          </div>
          <p class="text-base text-zinc-200 leading-relaxed mb-6" id="fl-reading-text">${passage.text}</p>

          <div id="fl-timer" class="text-center mb-4 hidden">
            <p class="text-4xl font-mono font-bold text-zinc-100" id="fl-timer-display">0.0s</p>
            <p class="text-xs text-zinc-500 mt-1">Target: ${targetTime}s</p>
          </div>

          <div class="flex justify-center gap-3">
            <button onclick="PTE.TTS.speak(\`${passage.text.replace(/`/g,"'")}\`, 0.85)" class="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 bg-cyan-500/10 px-5 py-2.5 rounded-xl border border-cyan-500/20 hover:bg-cyan-500/20 transition-all">
              🔊 Listen
            </button>
            <button onclick="PTE.Fluency.startTimedReading()" id="fl-read-btn" class="inline-flex items-center gap-2 text-sm font-medium text-amber-400 bg-amber-500/10 px-5 py-2.5 rounded-xl border border-amber-500/20 hover:bg-amber-500/20 transition-all">
              🎙️ Start Reading
            </button>
          </div>
          <div id="fl-result" class="mt-5 hidden"></div>
        </div>

        <div class="flex gap-3 justify-center">
          <button onclick="PTE.Fluency._readingIdx=Math.max(0,PTE.Fluency._readingIdx-1);PTE.Fluency.startExercise('timed-reading')" class="px-6 py-3 card rounded-xl text-zinc-400 hover:text-zinc-100 transition-colors font-medium text-sm">← Previous</button>
          <button onclick="PTE.Fluency._readingIdx=(PTE.Fluency._readingIdx+1)%PTE.Fluency.READING_PASSAGES.length;PTE.Fluency.startExercise('timed-reading')" class="px-6 py-3 bg-[var(--accent-surface)] border border-[rgba(109,92,255,0.12)] rounded-xl text-[var(--accent-light)] transition-colors font-medium text-sm">Next →</button>
        </div>
      </div>
    </main>`;
  },

  async startTimedReading() {
    if (this.isRecording) return;
    const btn = document.getElementById('fl-read-btn');
    const timer = document.getElementById('fl-timer');
    const timerDisplay = document.getElementById('fl-timer-display');
    const result = document.getElementById('fl-result');
    this.isRecording = true;
    btn.innerHTML = '⏺️ Recording...';
    btn.classList.add('animate-pulse');
    timer.classList.remove('hidden');

    const passage = this.READING_PASSAGES[this._readingIdx];
    const expected = passage.text.toLowerCase().replace(/[^a-z\s]/g, '');
    const wordCount = passage.text.split(/\s+/).length;
    const targetTime = (wordCount / passage.targetWPM) * 60;

    const startTime = Date.now();
    const tick = setInterval(() => {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      if (timerDisplay) timerDisplay.textContent = elapsed + 's';
    }, 100);
    this._timers.push(tick);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) { clearInterval(tick); this._noSpeechApi(result, btn, stream); timer.classList.add('hidden'); return; }
      const rec = new SpeechRecognition();
      rec.continuous = true; rec.interimResults = false; rec.lang = 'en-US';
      let fullTranscript = '';
      rec.onresult = (e) => {
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) fullTranscript += e.results[i][0].transcript + ' ';
        }
      };
      rec.onerror = () => {};
      rec.onend = () => {
        clearInterval(tick);
        const elapsed = (Date.now() - startTime) / 1000;
        const transcript = fullTranscript.trim().toLowerCase().replace(/[^a-z\s]/g, '');
        const spokenWords = transcript.split(/\s+/).filter(w => w).length;
        const wpm = Math.round((spokenWords / elapsed) * 60);
        const accuracy = this._wordAccuracy(expected, transcript);
        const paceScore = Math.max(0, 100 - Math.abs(wpm - passage.targetWPM) * 2);
        const score = Math.round(accuracy * 0.5 + paceScore * 0.5);
        this.recordSession('timed-reading', score);

        const wpmColor = Math.abs(wpm - passage.targetWPM) <= 15 ? 'emerald' : Math.abs(wpm - passage.targetWPM) <= 30 ? 'amber' : 'rose';
        result.innerHTML = `
          <div class="space-y-3">
            ${this._scoreCard(accuracy, wpm, transcript, score)}
            <div class="p-3 rounded-lg bg-${wpmColor}-500/10 border border-${wpmColor}-500/20">
              <p class="text-xs text-${wpmColor}-400 font-medium">Pace: ${wpm} WPM (target: ${passage.targetWPM} WPM) &middot; Time: ${elapsed.toFixed(1)}s</p>
            </div>
          </div>`;
        result.classList.remove('hidden');
        this.isRecording = false;
        btn.innerHTML = '🎙️ Start Reading';
        btn.classList.remove('animate-pulse');
        stream.getTracks().forEach(t=>t.stop());
      };
      rec.start();
      setTimeout(() => { try { rec.stop(); } catch(e){} }, 45000);
    } catch(e) { clearInterval(tick); this.isRecording = false; btn.innerHTML = '🎙️ Start Reading'; btn.classList.remove('animate-pulse'); timer.classList.add('hidden'); alert('Microphone access required.'); }
  },

  // ── 4. Phrase Linking ──────────────────────────────────

  _linkIdx: 0,

  renderPhraseLinking() {
    const link = this.PHRASE_LINKS[this._linkIdx];
    if (!link) return this._emptyState('No phrases found.');

    return `
    ${PTE.UI.navbar('fluency')}
    <main class="min-h-screen py-8 px-4">
      <div class="max-w-2xl mx-auto">
        ${this._backBtn()}
        <div class="mb-6">
          <h1 class="text-xl font-semibold text-zinc-100">Phrase Linking</h1>
          <p class="text-xs text-zinc-500">Practice connected speech — link words together naturally</p>
        </div>

        <p class="text-center text-sm text-zinc-500 mb-4 font-mono">${this._linkIdx + 1} / ${this.PHRASE_LINKS.length}</p>

        <div class="card-elevated rounded-xl p-8 text-center mb-6">
          <span class="inline-block text-3xl mb-4">🔗</span>
          <p class="text-2xl font-semibold text-zinc-100 mb-2">${link.phrase}</p>
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 mb-4">
            <span class="text-sm text-violet-400 font-mono">${link.linked}</span>
          </div>
          <p class="text-xs text-zinc-500 mb-6">${link.focus}</p>

          <div class="flex justify-center gap-3 flex-wrap">
            <button onclick="PTE.TTS.speak('${link.phrase}', 0.8)" class="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 bg-cyan-500/10 px-5 py-2.5 rounded-xl border border-cyan-500/20 hover:bg-cyan-500/20 transition-all">
              🔊 Natural
            </button>
            <button onclick="PTE.TTS.speak('${link.phrase}', 0.5)" class="inline-flex items-center gap-2 text-sm font-medium text-violet-400 bg-violet-500/10 px-5 py-2.5 rounded-xl border border-violet-500/20 hover:bg-violet-500/20 transition-all">
              🐢 Slow
            </button>
            <button onclick="PTE.Fluency.recordPhrase()" id="fl-record-btn" class="inline-flex items-center gap-2 text-sm font-medium text-rose-400 bg-rose-500/10 px-5 py-2.5 rounded-xl border border-rose-500/20 hover:bg-rose-500/20 transition-all">
              🎙️ Record
            </button>
          </div>
          <div id="fl-result" class="mt-5 hidden"></div>
        </div>

        <div class="card rounded-xl p-5 mb-6">
          <h4 class="text-sm font-semibold text-zinc-200 mb-2">How Linking Works</h4>
          <p class="text-xs text-zinc-500 leading-relaxed">In natural English, words flow into each other. When a word ends with a consonant and the next begins with a vowel, they link together. For example, "pick it up" sounds like "pi-ki-tup". This makes speech sound smooth and fluent rather than choppy.</p>
        </div>

        <div class="flex gap-3 justify-center">
          <button onclick="PTE.Fluency._linkIdx=Math.max(0,PTE.Fluency._linkIdx-1);PTE.Fluency.startExercise('phrase-linking')" class="px-6 py-3 card rounded-xl text-zinc-400 hover:text-zinc-100 transition-colors font-medium text-sm">← Previous</button>
          <button onclick="PTE.Fluency._linkIdx=(PTE.Fluency._linkIdx+1)%PTE.Fluency.PHRASE_LINKS.length;PTE.Fluency.startExercise('phrase-linking')" class="px-6 py-3 bg-[var(--accent-surface)] border border-[rgba(109,92,255,0.12)] rounded-xl text-[var(--accent-light)] transition-colors font-medium text-sm">Next →</button>
        </div>
      </div>
    </main>`;
  },

  async recordPhrase() {
    if (this.isRecording) return;
    const btn = document.getElementById('fl-record-btn');
    const result = document.getElementById('fl-result');
    this.isRecording = true;
    btn.innerHTML = '⏺️ Recording...';
    btn.classList.add('animate-pulse');

    const link = this.PHRASE_LINKS[this._linkIdx];
    const expected = link.phrase.toLowerCase().replace(/[^a-z\s]/g, '');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) { this._noSpeechApi(result, btn, stream); return; }
      const rec = new SpeechRecognition();
      rec.continuous = false; rec.interimResults = false; rec.lang = 'en-US';
      rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript.trim().toLowerCase().replace(/[^a-z\s]/g, '');
        const confidence = e.results[0][0].confidence;
        const accuracy = this._wordAccuracy(expected, transcript);
        const score = Math.round(accuracy * 0.6 + confidence * 40);
        this.recordSession('phrase-linking', Math.min(score, 100));
        const match = accuracy >= 80;
        result.innerHTML = `
          <div class="p-3 rounded-lg ${match ? 'bg-emerald-500/15 border border-emerald-500/20' : 'bg-amber-500/15 border border-amber-500/20'}">
            <p class="text-sm font-semibold ${match ? 'text-emerald-400' : 'text-amber-400'}">${match ? '✅ Great linking!' : '🔄 Try to link the words more smoothly'}</p>
            <p class="text-xs text-zinc-500 mt-1">Heard: "${transcript}" &middot; Accuracy: ${Math.round(accuracy)}%</p>
          </div>`;
        result.classList.remove('hidden');
      };
      rec.onerror = () => { result.innerHTML = '<p class="text-amber-400 text-sm">Could not recognize speech. Try again.</p>'; result.classList.remove('hidden'); };
      rec.onend = () => { this.isRecording = false; btn.innerHTML = '🎙️ Record'; btn.classList.remove('animate-pulse'); stream.getTracks().forEach(t=>t.stop()); };
      rec.start();
      setTimeout(() => { try { rec.stop(); } catch(e){} }, 5000);
    } catch(e) { this.isRecording = false; btn.innerHTML = '🎙️ Record'; btn.classList.remove('animate-pulse'); alert('Microphone access required.'); }
  },

  // ── 5. Pace Trainer ────────────────────────────────────

  _paceLevel: 2,

  renderPaceTrainer() {
    const pace = this.PACE_LEVELS[this._paceLevel];
    const sentence = this.PACE_SENTENCES[Math.floor(Math.random() * this.PACE_SENTENCES.length)];

    return `
    ${PTE.UI.navbar('fluency')}
    <main class="min-h-screen py-8 px-4">
      <div class="max-w-2xl mx-auto">
        ${this._backBtn()}
        <div class="mb-6">
          <h1 class="text-xl font-semibold text-zinc-100">Pace Trainer</h1>
          <p class="text-xs text-zinc-500">Match the visual pacer to train your speaking speed</p>
        </div>

        <div class="flex gap-2 mb-6 flex-wrap">
          ${this.PACE_LEVELS.map((p, i) => `
            <button onclick="PTE.Fluency._paceLevel=${i};PTE.Fluency.startExercise('pace-trainer')" class="flex items-center gap-2 text-xs px-3 py-2 rounded-lg font-medium transition-all ${this._paceLevel===i ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'text-zinc-500 hover:bg-white/[0.02] card'}">
              <span>${p.icon}</span> ${p.label}
            </button>`).join('')}
        </div>

        <div class="card-elevated rounded-xl p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs text-zinc-500">${pace.desc}</span>
            <span class="text-sm font-mono text-emerald-400 font-semibold">${pace.wpm} WPM</span>
          </div>

          <div class="relative bg-white/[0.02] rounded-lg p-5 border border-[var(--border)] mb-6 overflow-hidden">
            <p class="text-base text-zinc-200 leading-relaxed" id="fl-pace-text">${sentence}</p>
            <div id="fl-pace-highlight" class="absolute top-0 left-0 w-0 h-full bg-emerald-500/10 rounded-lg transition-none pointer-events-none" style="display:none"></div>
          </div>

          <div class="flex justify-center gap-3 flex-wrap">
            <button onclick="PTE.Fluency.startPacer()" id="fl-pace-btn" class="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 bg-emerald-500/10 px-6 py-2.5 rounded-xl border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
              ▶️ Start Pacer
            </button>
            <button onclick="PTE.Fluency.recordPace()" id="fl-pace-record" class="inline-flex items-center gap-2 text-sm font-medium text-rose-400 bg-rose-500/10 px-5 py-2.5 rounded-xl border border-rose-500/20 hover:bg-rose-500/20 transition-all">
              🎙️ Record & Compare
            </button>
          </div>
          <div id="fl-result" class="mt-5 hidden"></div>
        </div>

        <button onclick="PTE.Fluency.startExercise('pace-trainer')" class="w-full py-3 card rounded-xl text-zinc-400 hover:text-zinc-100 transition-colors font-medium text-sm text-center">🔄 New Sentence</button>
      </div>
    </main>`;
  },

  startPacer() {
    const highlight = document.getElementById('fl-pace-highlight');
    const textEl = document.getElementById('fl-pace-text');
    if (!highlight || !textEl) return;

    const text = textEl.textContent;
    const wordCount = text.split(/\s+/).length;
    const pace = this.PACE_LEVELS[this._paceLevel];
    const totalTime = (wordCount / pace.wpm) * 60 * 1000;

    highlight.style.display = 'block';
    highlight.style.width = '0%';

    PTE.TTS.speak(text, pace.wpm <= 110 ? 0.7 : pace.wpm <= 140 ? 0.85 : pace.wpm <= 160 ? 1.0 : 1.15);

    const start = Date.now();
    const animate = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / totalTime) * 100, 100);
      highlight.style.width = pct + '%';
      if (pct < 100) {
        const id = requestAnimationFrame(animate);
        this._timers.push(id);
      }
    };
    animate();
  },

  async recordPace() {
    if (this.isRecording) return;
    const btn = document.getElementById('fl-pace-record');
    const result = document.getElementById('fl-result');
    const textEl = document.getElementById('fl-pace-text');
    this.isRecording = true;
    btn.innerHTML = '⏺️ Recording...';
    btn.classList.add('animate-pulse');

    const expected = textEl.textContent.toLowerCase().replace(/[^a-z\s]/g, '');
    const pace = this.PACE_LEVELS[this._paceLevel];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) { this._noSpeechApi(result, btn, stream); return; }
      const rec = new SpeechRecognition();
      rec.continuous = false; rec.interimResults = false; rec.lang = 'en-US';
      const startTime = Date.now();
      rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript.trim().toLowerCase().replace(/[^a-z\s]/g, '');
        const elapsed = (Date.now() - startTime) / 1000;
        const words = transcript.split(/\s+/).length;
        const wpm = Math.round((words / elapsed) * 60);
        const accuracy = this._wordAccuracy(expected, transcript);
        const paceDiff = Math.abs(wpm - pace.wpm);
        const paceScore = Math.max(0, 100 - paceDiff * 2);
        const score = Math.round(accuracy * 0.4 + paceScore * 0.6);
        this.recordSession('pace-trainer', score);

        const paceColor = paceDiff <= 15 ? 'emerald' : paceDiff <= 30 ? 'amber' : 'rose';
        const paceLabel = wpm < pace.wpm - 15 ? 'Too slow' : wpm > pace.wpm + 15 ? 'Too fast' : 'On target!';
        result.innerHTML = `
          <div class="space-y-3">
            ${this._scoreCard(accuracy, wpm, transcript, score)}
            <div class="p-3 rounded-lg bg-${paceColor}-500/10 border border-${paceColor}-500/20 text-center">
              <p class="text-sm font-semibold text-${paceColor}-400">${paceLabel}</p>
              <p class="text-xs text-zinc-500 mt-1">Your pace: ${wpm} WPM &middot; Target: ${pace.wpm} WPM</p>
            </div>
          </div>`;
        result.classList.remove('hidden');
      };
      rec.onerror = () => { result.innerHTML = '<p class="text-amber-400 text-sm">Could not recognize speech. Try again.</p>'; result.classList.remove('hidden'); };
      rec.onend = () => { this.isRecording = false; btn.innerHTML = '🎙️ Record & Compare'; btn.classList.remove('animate-pulse'); stream.getTracks().forEach(t=>t.stop()); };
      rec.start();
      setTimeout(() => { try { rec.stop(); } catch(e){} }, 15000);
    } catch(e) { this.isRecording = false; btn.innerHTML = '🎙️ Record & Compare'; btn.classList.remove('animate-pulse'); alert('Microphone access required.'); }
  },

  // ── 6. Fluency Streak ──────────────────────────────────

  renderFluencyStreak() {
    const data = this.getData();
    const best = data.streakBest || 0;

    return `
    ${PTE.UI.navbar('fluency')}
    <main class="min-h-screen py-8 px-4">
      <div class="max-w-2xl mx-auto">
        ${this._backBtn()}
        <div class="mb-6">
          <h1 class="text-xl font-semibold text-zinc-100">Fluency Streak</h1>
          <p class="text-xs text-zinc-500">Speak continuously about any topic. The timer stops when you pause for more than 2 seconds.</p>
        </div>

        <div class="card-elevated rounded-xl p-8 text-center mb-6">
          <div id="fl-streak-display">
            <span class="inline-block text-5xl mb-4">🔥</span>
            <p class="text-6xl font-mono font-bold text-zinc-100 mb-2" id="fl-streak-timer">0.0</p>
            <p class="text-sm text-zinc-500 mb-2">seconds</p>
            ${best > 0 ? `<p class="text-xs text-orange-400 font-mono mb-6">Personal best: ${best.toFixed(1)}s</p>` : '<p class="text-xs text-zinc-600 mb-6">Start speaking to begin</p>'}
          </div>

          <div id="fl-streak-bar" class="mb-6 hidden">
            <div class="h-2 rounded-full bg-white/[0.05] overflow-hidden">
              <div id="fl-streak-fill" class="h-full rounded-full bg-gradient-to-r from-orange-500 to-rose-500 transition-all" style="width:0%"></div>
            </div>
            <p class="text-[10px] text-zinc-600 mt-1">Silence detected — speak to keep going!</p>
          </div>

          <div class="flex justify-center gap-3">
            <button onclick="PTE.Fluency.startStreak()" id="fl-streak-btn" class="inline-flex items-center gap-2 text-sm font-medium text-orange-400 bg-orange-500/10 px-6 py-3 rounded-xl border border-orange-500/20 hover:bg-orange-500/20 transition-all">
              🎙️ Start Speaking
            </button>
          </div>
          <div id="fl-result" class="mt-5 hidden"></div>
        </div>

        <div class="card rounded-xl p-5">
          <h4 class="text-sm font-semibold text-zinc-200 mb-2">Topic Ideas</h4>
          <div class="flex flex-wrap gap-2" id="fl-topics">
            ${['Your daily routine', 'A recent trip', 'Your favorite food', 'A book you read', 'Your hometown', 'Future plans', 'A memorable event', 'Technology trends'].map(t =>
              `<span class="text-xs px-3 py-1.5 rounded-lg bg-white/[0.03] text-zinc-400 border border-[var(--border)] cursor-default">${t}</span>`
            ).join('')}
          </div>
        </div>
      </div>
    </main>`;
  },

  async startStreak() {
    if (this.isRecording) return;
    const btn = document.getElementById('fl-streak-btn');
    const timerEl = document.getElementById('fl-streak-timer');
    const bar = document.getElementById('fl-streak-bar');
    const fill = document.getElementById('fl-streak-fill');
    const result = document.getElementById('fl-result');
    this.isRecording = true;
    btn.innerHTML = '⏹️ Stop';
    btn.onclick = () => this._stopStreak();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let streakTime = 0;
      let lastSoundTime = Date.now();
      const SILENCE_THRESHOLD = 20;
      const MAX_SILENCE_MS = 2000;
      const startTime = Date.now();

      this._streakStream = stream;
      this._streakAudioCtx = audioCtx;

      const tick = setInterval(() => {
        if (!this.isRecording) { clearInterval(tick); return; }

        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

        if (avg > SILENCE_THRESHOLD) {
          lastSoundTime = Date.now();
          bar.classList.add('hidden');
          fill.style.width = '0%';
        }

        const silenceMs = Date.now() - lastSoundTime;
        streakTime = (Date.now() - startTime) / 1000;
        timerEl.textContent = streakTime.toFixed(1);

        if (silenceMs > 500 && silenceMs < MAX_SILENCE_MS) {
          bar.classList.remove('hidden');
          fill.style.width = ((silenceMs / MAX_SILENCE_MS) * 100) + '%';
        }

        if (silenceMs >= MAX_SILENCE_MS) {
          clearInterval(tick);
          this._finishStreak(streakTime, result);
        }
      }, 100);
      this._timers.push(tick);

    } catch(e) { this.isRecording = false; btn.innerHTML = '🎙️ Start Speaking'; btn.onclick = () => PTE.Fluency.startStreak(); alert('Microphone access required.'); }
  },

  _stopStreak() {
    const timerEl = document.getElementById('fl-streak-timer');
    const result = document.getElementById('fl-result');
    const streakTime = parseFloat(timerEl.textContent) || 0;
    this._finishStreak(streakTime, result);
  },

  _finishStreak(streakTime, result) {
    this.isRecording = false;
    this._timers.forEach(t => clearInterval(t));
    this._timers = [];

    if (this._streakStream) { this._streakStream.getTracks().forEach(t => t.stop()); this._streakStream = null; }
    if (this._streakAudioCtx) { this._streakAudioCtx.close().catch(()=>{}); this._streakAudioCtx = null; }

    const btn = document.getElementById('fl-streak-btn');
    if (btn) { btn.innerHTML = '🎙️ Start Speaking'; btn.onclick = () => PTE.Fluency.startStreak(); }

    const bar = document.getElementById('fl-streak-bar');
    if (bar) bar.classList.add('hidden');

    const data = this.getData();
    const isNewBest = streakTime > (data.streakBest || 0);
    if (isNewBest) { data.streakBest = streakTime; this.save(data); }

    const score = Math.min(100, Math.round(streakTime * 2));
    this.recordSession('fluency-streak', score);

    if (result) {
      const rating = streakTime >= 60 ? { label: 'Incredible!', color: 'emerald', icon: '🏆' } :
                     streakTime >= 30 ? { label: 'Great flow!', color: 'cyan', icon: '🌊' } :
                     streakTime >= 15 ? { label: 'Good effort!', color: 'amber', icon: '👍' } :
                     { label: 'Keep practicing!', color: 'zinc', icon: '💪' };

      result.innerHTML = `
        <div class="p-4 rounded-lg bg-${rating.color}-500/10 border border-${rating.color}-500/20 text-center">
          <span class="text-2xl">${rating.icon}</span>
          <p class="text-lg font-semibold text-${rating.color}-400 mt-1">${rating.label}</p>
          <p class="text-sm text-zinc-400 mt-1">${streakTime.toFixed(1)} seconds of continuous speech</p>
          ${isNewBest ? '<p class="text-xs text-orange-400 font-semibold mt-2 animate-pulse">🔥 New Personal Best!</p>' : ''}
        </div>`;
      result.classList.remove('hidden');
    }
  },

  // ── Shared Utilities ───────────────────────────────────

  _wordAccuracy(expected, actual) {
    const expWords = expected.split(/\s+/).filter(w => w);
    const actWords = actual.split(/\s+/).filter(w => w);
    if (expWords.length === 0) return 0;
    let matched = 0;
    const used = new Set();
    expWords.forEach(ew => {
      const idx = actWords.findIndex((aw, i) => !used.has(i) && (aw === ew || this._levenshtein(aw, ew) <= 1));
      if (idx !== -1) { matched++; used.add(idx); }
    });
    return (matched / expWords.length) * 100;
  },

  _levenshtein(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        matrix[i][j] = b[i-1] === a[j-1] ? matrix[i-1][j-1] : Math.min(matrix[i-1][j-1]+1, matrix[i][j-1]+1, matrix[i-1][j]+1);
      }
    }
    return matrix[b.length][a.length];
  },

  _scoreCard(accuracy, wpm, transcript, score) {
    const accColor = accuracy >= 80 ? 'emerald' : accuracy >= 50 ? 'amber' : 'rose';
    const scoreColor = score >= 75 ? 'emerald' : score >= 50 ? 'amber' : 'rose';
    return `
      <div class="p-4 rounded-lg bg-white/[0.02] border border-[var(--border)]">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs text-zinc-500">Score</span>
          <span class="text-lg font-bold font-mono text-${scoreColor}-400">${score}%</span>
        </div>
        <div class="grid grid-cols-2 gap-3 mb-3">
          <div class="text-center">
            <p class="text-sm font-mono font-semibold text-${accColor}-400">${Math.round(accuracy)}%</p>
            <p class="text-[10px] text-zinc-600">Accuracy</p>
          </div>
          <div class="text-center">
            <p class="text-sm font-mono font-semibold text-cyan-400">${wpm}</p>
            <p class="text-[10px] text-zinc-600">WPM</p>
          </div>
        </div>
        <p class="text-xs text-zinc-600">Heard: <span class="text-zinc-400">"${transcript}"</span></p>
      </div>`;
  },

  _noSpeechApi(result, btn, stream) {
    result.innerHTML = '<p class="text-amber-400 text-sm">Speech recognition not supported in this browser. Try Chrome.</p>';
    result.classList.remove('hidden');
    this.isRecording = false;
    btn.innerHTML = '🎙️ Record';
    btn.classList.remove('animate-pulse');
    if (stream) stream.getTracks().forEach(t => t.stop());
  },

  _emptyState(msg) {
    return `${PTE.UI.navbar('fluency')}<main class="min-h-screen py-10 px-4"><div class="max-w-2xl mx-auto text-center py-20">${this._backBtn()}<p class="text-zinc-500">${msg}</p></div></main>`;
  },

  renderCard() {
    const data = this.getData();
    const sessions = data.totalSessions || 0;
    const types = Object.keys(data.exercises).length;

    return `
    <div class="card-elevated rounded-xl p-5">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500/80 to-fuchsia-600/80 flex items-center justify-center text-xl shadow-lg">🗣️</div>
          <div>
            <h3 class="font-semibold text-zinc-100 text-sm">Fluency Lab</h3>
            <p class="text-xs text-zinc-500">${sessions > 0 ? `${sessions} sessions &middot; ${types}/6 types` : 'Build speaking speed & flow'}</p>
          </div>
        </div>
        <a href="#/fluency" class="text-xs font-semibold text-violet-400 hover:text-violet-300 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 transition-all hover:bg-violet-500/20">Train</a>
      </div>
      ${sessions > 0 ? `<div class="xp-bar-bg"><div class="xp-bar-fill" style="width:${Math.min(types/6*100, 100)}%;background:linear-gradient(90deg,#8b5cf6,#d946ef)"></div></div>` : ''}
    </div>`;
  }
};
