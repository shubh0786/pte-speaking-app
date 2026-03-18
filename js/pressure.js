/**
 * Crack PTE - Timed Pressure Training
 * Progressively reduces preparation and recording time
 * to build speed and confidence under exam pressure
 */
window.PTE = window.PTE || {};

PTE.PressureTraining = {
  STORAGE_KEY: 'crackpte_pressure',

  LEVELS: [
    { id: 'normal',   name: 'Normal',   icon: '🟢', prepMult: 1.0,  recMult: 1.0,  color: '#10b981', desc: 'Standard exam timing' },
    { id: 'moderate', name: 'Moderate', icon: '🟡', prepMult: 0.75, recMult: 0.85, color: '#f59e0b', desc: '25% less prep, 15% less record time' },
    { id: 'hard',     name: 'Hard',     icon: '🟠', prepMult: 0.50, recMult: 0.70, color: '#f97316', desc: 'Half prep time, 30% less record time' },
    { id: 'extreme',  name: 'Extreme',  icon: '🔴', prepMult: 0.25, recMult: 0.55, color: '#ef4444', desc: 'Minimal prep, almost half record time' },
    { id: 'blitz',    name: 'Blitz',    icon: '⚡', prepMult: 0.0,  recMult: 0.40, color: '#dc2626', desc: 'No prep time, 40% record time — pure reflex' }
  ],

  active: false,
  selectedType: null,
  selectedLevel: null,
  questionIndex: 0,
  questions: [],
  results: [],

  getData() {
    try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || { history: [], bestLevels: {} }; } catch(e) { return { history: [], bestLevels: {} }; }
  },
  save(data) {
    try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data)); } catch(e) {}
  },

  renderPage() {
    const data = this.getData();
    const types = Object.values(PTE.QUESTION_TYPES);

    const recentHistory = (data.history || []).slice(0, 10);

    const typeCards = types.map(type => {
      const bestLevel = data.bestLevels[type.id];
      const bestLevelObj = bestLevel ? this.LEVELS.find(l => l.id === bestLevel.level) : null;
      const bestScore = bestLevel ? bestLevel.score : null;

      return `
      <div class="card rounded-xl p-4">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style="background:${type.color}11">${type.icon}</div>
            <div>
              <h3 class="text-sm font-semibold text-zinc-200">${type.name}</h3>
              <p class="text-[10px] text-zinc-500">Prep: ${type.prepTime}s · Record: ${type.recordTime}s</p>
            </div>
          </div>
          ${bestLevelObj ? `<span class="text-[10px] font-medium px-2 py-0.5 rounded-full" style="background:${bestLevelObj.color}15;color:${bestLevelObj.color};border:1px solid ${bestLevelObj.color}20">${bestLevelObj.icon} ${bestScore}/90</span>` : ''}
        </div>
        <div class="grid grid-cols-5 gap-1">
          ${this.LEVELS.map(level => {
            const prepTime = Math.round(type.prepTime * level.prepMult);
            const recTime = Math.round(type.recordTime * level.recMult);
            const isBeaten = bestLevel && this.LEVELS.findIndex(l => l.id === bestLevel.level) >= this.LEVELS.findIndex(l => l.id === level.id) && bestLevel.score >= 50;
            return `
            <button onclick="PTE.PressureTraining.selectConfig('${type.id}', '${level.id}')"
              class="p-2 rounded-lg text-center transition-all hover:bg-white/[0.04] border ${isBeaten ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-[var(--border)] bg-white/[0.01]'}">
              <span class="text-sm block">${level.icon}</span>
              <p class="text-[9px] text-zinc-500 mt-0.5">${prepTime}s/${recTime}s</p>
            </button>`;
          }).join('')}
        </div>
      </div>`;
    }).join('');

    let historyHtml = '';
    if (recentHistory.length > 0) {
      historyHtml = `
      <div class="card rounded-xl p-5 mb-6">
        <h3 class="text-sm font-semibold text-zinc-200 mb-3">Recent Pressure Sessions</h3>
        <div class="space-y-2">
          ${recentHistory.map(h => {
            const typeConfig = types.find(t => t.id === h.type);
            const levelObj = this.LEVELS.find(l => l.id === h.level);
            const band = PTE.Scoring.getBand(h.avgScore);
            return `
            <div class="flex items-center gap-3 py-2 border-b border-[var(--border)]">
              <span class="text-sm">${typeConfig ? typeConfig.icon : '?'}</span>
              <div class="flex-1 min-w-0">
                <p class="text-xs text-zinc-300">${typeConfig ? typeConfig.shortName : h.type} · <span style="color:${levelObj ? levelObj.color : '#888'}">${levelObj ? levelObj.name : h.level}</span></p>
                <p class="text-[10px] text-zinc-600">${h.date} · ${h.questions} questions</p>
              </div>
              <span class="text-xs font-semibold font-mono" style="color:${band.color}">${h.avgScore}/90</span>
            </div>`;
          }).join('')}
        </div>
      </div>`;
    }

    return `
    ${PTE.UI.navbar('pressure')}
    <main class="min-h-screen py-10 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="mb-6">
          <h1 class="text-2xl font-semibold text-zinc-100 mb-1">Pressure Training</h1>
          <p class="text-sm text-zinc-500">Practice with reduced time to build speed and confidence.</p>
        </div>

        <!-- Level Legend -->
        <div class="card rounded-xl p-4 mb-6">
          <h3 class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Difficulty Levels</h3>
          <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
            ${this.LEVELS.map(l => `
            <div class="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]">
              <span class="text-sm">${l.icon}</span>
              <div>
                <p class="text-xs font-medium" style="color:${l.color}">${l.name}</p>
                <p class="text-[9px] text-zinc-600">${l.desc}</p>
              </div>
            </div>`).join('')}
          </div>
        </div>

        <!-- Type Selection -->
        <div class="mb-6">
          <h3 class="text-sm font-semibold text-zinc-200 mb-3">Choose Type & Difficulty</h3>
          <div class="space-y-3">${typeCards}</div>
        </div>

        ${historyHtml}
      </div>
    </main>`;
  },

  selectConfig(typeId, levelId) {
    const type = Object.values(PTE.QUESTION_TYPES).find(t => t.id === typeId);
    const level = this.LEVELS.find(l => l.id === levelId);
    if (!type || !level) return;

    const prepTime = Math.max(0, Math.round(type.prepTime * level.prepMult));
    const recTime = Math.max(5, Math.round(type.recordTime * level.recMult));

    const root = document.getElementById('app-root');
    root.innerHTML = `
    ${PTE.UI.navbar('pressure')}
    <main class="min-h-screen py-10 px-4">
      <div class="max-w-lg mx-auto text-center py-12">
        <div class="text-5xl mb-4">${level.icon}</div>
        <h2 class="text-xl font-semibold text-zinc-100 mb-1">${type.name} — ${level.name}</h2>
        <p class="text-sm text-zinc-500 mb-6">${level.desc}</p>
        <div class="card rounded-xl p-5 mb-6">
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center">
              <p class="text-[10px] text-zinc-500 uppercase tracking-wider">Prep Time</p>
              <p class="text-2xl font-bold font-mono" style="color:${level.color}">${prepTime}s</p>
              <p class="text-[10px] text-zinc-600">Normal: ${type.prepTime}s</p>
            </div>
            <div class="text-center">
              <p class="text-[10px] text-zinc-500 uppercase tracking-wider">Record Time</p>
              <p class="text-2xl font-bold font-mono" style="color:${level.color}">${recTime}s</p>
              <p class="text-[10px] text-zinc-600">Normal: ${type.recordTime}s</p>
            </div>
          </div>
        </div>
        <div class="flex flex-col items-center gap-3">
          <label class="flex items-center gap-2 text-xs text-zinc-400">
            <span>Questions:</span>
            <select id="pressure-count" class="input-dark text-xs !w-auto !py-1 !px-2 !min-h-0">
              <option value="3">3 (Quick)</option>
              <option value="5" selected>5 (Standard)</option>
              <option value="10">10 (Full)</option>
            </select>
          </label>
          <button onclick="PTE.PressureTraining.startSession('${typeId}', '${levelId}')" class="btn-primary px-8 py-3 text-sm">
            Start Pressure Training
          </button>
          <a href="#/pressure" class="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Back</a>
        </div>
      </div>
    </main>`;
  },

  startSession(typeId, levelId) {
    const type = Object.values(PTE.QUESTION_TYPES).find(t => t.id === typeId);
    const level = this.LEVELS.find(l => l.id === levelId);
    if (!type || !level) return;

    const countEl = document.getElementById('pressure-count');
    const count = countEl ? parseInt(countEl.value) : 5;

    // Pick random questions
    const allQuestions = [...(PTE.Questions[typeId] || []), ...(PTE.Predictions && PTE.Predictions[typeId] || [])];
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    this.questions = shuffled.slice(0, Math.min(count, shuffled.length));

    if (this.questions.length === 0) {
      alert('No questions available for this type.');
      return;
    }

    this.selectedType = type;
    this.selectedLevel = level;
    this.questionIndex = 0;
    this.results = [];
    this.active = true;

    // Override type's timing with pressure timing
    this._originalPrepTime = type.prepTime;
    this._originalRecordTime = type.recordTime;
    type.prepTime = Math.max(0, Math.round(this._originalPrepTime * level.prepMult));
    type.recordTime = Math.max(5, Math.round(this._originalRecordTime * level.recMult));

    // Hook into the scoring flow to capture results
    PTE.App._pressureActive = true;
    PTE.App._pressureNext = (score) => {
      this.results.push(score);
      this.questionIndex++;
      if (this.questionIndex < this.questions.length) {
        this._runNext();
      } else {
        this._finishSession();
      }
    };

    this._runNext();
  },

  _runNext() {
    const q = this.questions[this.questionIndex];
    const typeId = this.selectedType.id;

    // Show progress indicator
    const totalQ = this.questions.length;
    const currentQ = this.questionIndex + 1;

    // Start practice with the specific question
    const inRegular = (PTE.Questions[typeId] || []).some(qu => String(qu.id) === String(q.id));
    PTE.App.startPractice(typeId, !inRegular, q.id);

    // Add pressure UI overlay after render
    setTimeout(() => {
      const practiceArea = document.getElementById('practice-area');
      if (practiceArea) {
        const indicator = document.createElement('div');
        indicator.className = 'flex items-center justify-between p-3 rounded-xl mb-3 border';
        indicator.style.cssText = `background:${this.selectedLevel.color}08;border-color:${this.selectedLevel.color}20`;
        indicator.innerHTML = `
          <div class="flex items-center gap-2">
            <span class="text-sm">${this.selectedLevel.icon}</span>
            <span class="text-xs font-semibold" style="color:${this.selectedLevel.color}">${this.selectedLevel.name} Mode</span>
          </div>
          <span class="text-xs font-mono text-zinc-400">Q${currentQ}/${totalQ}</span>
        `;
        practiceArea.parentNode.insertBefore(indicator, practiceArea);
      }
    }, 100);
  },

  _finishSession() {
    // Restore original timing
    if (this.selectedType) {
      this.selectedType.prepTime = this._originalPrepTime;
      this.selectedType.recordTime = this._originalRecordTime;
    }

    PTE.App._pressureActive = false;
    PTE.App._pressureNext = null;
    this.active = false;

    const avgScore = this.results.length > 0
      ? Math.round(this.results.reduce((a, b) => a + b, 0) / this.results.length)
      : 0;

    // Save to history
    const data = this.getData();
    data.history.unshift({
      type: this.selectedType.id,
      level: this.selectedLevel.id,
      avgScore,
      questions: this.results.length,
      scores: [...this.results],
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      timestamp: Date.now()
    });
    if (data.history.length > 50) data.history = data.history.slice(0, 50);

    // Update best level
    const typeId = this.selectedType.id;
    const levelIdx = this.LEVELS.findIndex(l => l.id === this.selectedLevel.id);
    const currentBest = data.bestLevels[typeId];
    const currentBestIdx = currentBest ? this.LEVELS.findIndex(l => l.id === currentBest.level) : -1;
    if (avgScore >= 50 && (levelIdx > currentBestIdx || (levelIdx === currentBestIdx && avgScore > (currentBest ? currentBest.score : 0)))) {
      data.bestLevels[typeId] = { level: this.selectedLevel.id, score: avgScore };
    }
    this.save(data);

    // Show results
    const band = PTE.Scoring.getBand(avgScore);
    const level = this.selectedLevel;
    const type = this.selectedType;

    const root = document.getElementById('app-root');
    root.innerHTML = `
    ${PTE.UI.navbar('pressure')}
    <main class="min-h-screen py-10 px-4">
      <div class="max-w-lg mx-auto text-center py-12">
        <div class="text-5xl mb-4">${avgScore >= 65 ? '🔥' : avgScore >= 45 ? '💪' : '🎯'}</div>
        <h2 class="text-xl font-semibold text-zinc-100 mb-1">Pressure Session Complete!</h2>
        <p class="text-sm text-zinc-500 mb-6">${type.name} · <span style="color:${level.color}">${level.name}</span></p>

        <div class="card-elevated rounded-xl overflow-hidden mb-6">
          <div class="bg-gradient-to-r p-6" style="background:linear-gradient(135deg, ${level.color}40, ${level.color}15)">
            <div class="relative inline-flex items-center justify-center mb-3">
              <svg class="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="5"/>
                <circle cx="60" cy="60" r="52" fill="none" stroke="${band.color}" stroke-width="5" stroke-linecap="round" stroke-dasharray="326.73" stroke-dashoffset="${326.73 * (1 - avgScore / 90)}" class="score-circle-animate"/>
              </svg>
              <div class="absolute flex flex-col items-center">
                <span class="text-3xl font-bold text-white font-mono">${avgScore}</span>
                <span class="text-[10px] text-white/40 font-mono">/90</span>
              </div>
            </div>
            <div class="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
              <span class="text-xs">${band.emoji}</span>
              <span class="text-white text-xs font-medium">${band.label}</span>
            </div>
          </div>
          <div class="p-5">
            <div class="grid grid-cols-${this.results.length} gap-1 mb-3">
              ${this.results.map((s, i) => {
                const c = s >= 65 ? '#10b981' : s >= 45 ? '#f59e0b' : '#ef4444';
                return `<div class="text-center"><div class="h-12 rounded-md flex items-end justify-center" style="background:${c}15"><div class="w-full rounded-md" style="height:${(s/90)*100}%;background:${c}"></div></div><p class="text-[9px] font-mono text-zinc-500 mt-1">${s}</p></div>`;
              }).join('')}
            </div>
            ${avgScore >= 50 ? `<p class="text-xs text-emerald-400">You handled the pressure well at <span class="font-semibold">${level.name}</span> difficulty!</p>` : `<p class="text-xs text-amber-400">Keep practicing — try <span class="font-semibold">${level.name}</span> again or drop one level down.</p>`}
          </div>
        </div>

        <div class="flex justify-center gap-3">
          <button onclick="PTE.PressureTraining.selectConfig('${type.id}', '${level.id}')" class="btn-secondary px-5 py-2.5 text-sm">Try Again</button>
          <a href="#/pressure" class="btn-primary px-5 py-2.5 text-sm">Back to Levels</a>
        </div>
      </div>
    </main>`;
  },

  renderCard() {
    const data = this.getData();
    const completedCount = (data.history || []).length;
    const bestCount = Object.keys(data.bestLevels || {}).length;

    return `
    <a href="#/pressure" class="block group">
      <div class="card card-hover rounded-xl p-4">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center"><span class="text-lg">⏱️</span></div>
          <div>
            <h3 class="text-sm font-semibold text-zinc-200 group-hover:text-orange-400 transition-colors">Pressure Training</h3>
            <p class="text-[10px] text-zinc-500">${completedCount > 0 ? completedCount + ' sessions · ' + bestCount + ' types mastered' : 'Build speed under pressure'}</p>
          </div>
        </div>
      </div>
    </a>`;
  }
};
