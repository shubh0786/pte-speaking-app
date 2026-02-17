/**
 * PTE Speaking Module - UI Components
 * Reusable component rendering functions
 */

window.PTE = window.PTE || {};

PTE.UI = {
  /**
   * Render the navigation bar
   */
  navbar(activePage) {
    const navId = 'mobile-nav-' + Date.now();
    const links = [
      { href:'#/', label:'Home', page:'home' },
      { href:'#/practice', label:'Practice', page:'practice' },
      { href:'#/predictions', label:'Predictions', page:'predictions' },
      { href:'#/mock-test', label:'Mock Test', page:'mock-test' },
      { href:'#/progress', label:'Analytics', page:'progress' },
    ];
    const moreLinks = [
      { href:'#/accent', label:'Accent Coach', page:'accent', icon:'🗣️' },
      { href:'#/daily', label:'Daily Challenge', page:'daily', icon:'⚡' },
      { href:'#/vocab', label:'Vocab Builder', page:'vocab', icon:'🃏' },
      { href:'#/drills', label:'Pronunciation Drills', page:'drills', icon:'🎙️' },
      { href:'#/templates', label:'Templates', page:'templates', icon:'📝' },
      { href:'#/planner', label:'Study Planner', page:'planner', icon:'📋' },
      { href:'#/review', label:'Spaced Review', page:'review', icon:'🧠' },
      { href:'#/leaderboard', label:'Leaderboard', page:'leaderboard', icon:'🏆' },
      { href:'#/challenge-create', label:'Challenge Friend', page:'challenge-create', icon:'⚔️' },
    ];
    const dLink = l => `<a href="${l.href}" class="px-2.5 py-2 rounded-lg text-sm font-medium transition-all ${activePage===l.page?'bg-indigo-500/20 text-indigo-400 neon-border':'text-gray-400 hover:bg-white/5 hover:text-gray-200'}">${l.label}</a>`;
    const mLink = l => `<a href="${l.href}" onclick="document.getElementById('${navId}').classList.add('hidden')" class="block px-4 py-3 rounded-xl text-base font-medium transition-all ${activePage===l.page?'bg-indigo-500/20 text-indigo-400':'text-gray-300 hover:bg-white/5'}">${l.icon?l.icon+' ':''}${l.label}</a>`;
    const moreId = 'more-' + Date.now();
    const userMenuId = 'user-menu-' + Date.now();
    const moreActive = moreLinks.some(l => l.page === activePage);
    const xpBar = PTE.Gamify ? PTE.Gamify.renderXPBar() : '';

    // User info for navbar
    const user = PTE.Auth ? PTE.Auth.getCurrentUser() : null;
    const initials = user ? PTE.Auth.getInitials(user.username) : '';
    const avatarColor = user ? user.avatarColor : '#6366f1';
    const userBtn = user ? `
      <div class="relative">
        <button onclick="document.getElementById('${userMenuId}').classList.toggle('hidden')" class="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/10 transition-colors">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style="background:${avatarColor}">${initials}</div>
          <span class="hidden sm:inline text-sm font-medium text-gray-300 max-w-[100px] truncate">${user.username}</span>
          <svg class="w-4 h-4 text-gray-500 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div id="${userMenuId}" class="hidden absolute right-0 top-full mt-2 w-56 glass rounded-xl border border-[var(--border)] shadow-2xl py-2 z-50">
          <div class="px-4 py-3 border-b border-[var(--border)]">
            <p class="text-sm font-semibold text-white truncate">${user.username}</p>
            <p class="text-xs text-gray-500 truncate">${user.email}</p>
          </div>
          <a href="#/profile" onclick="document.getElementById('${userMenuId}').classList.add('hidden')" class="flex items-center gap-3 px-4 py-2.5 text-sm transition-all ${activePage==='profile'?'text-indigo-400 bg-indigo-500/10':'text-gray-400 hover:bg-white/5 hover:text-white'}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            My Profile
          </a>
          <button onclick="PTE.Auth.logout()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Sign Out
          </button>
        </div>
      </div>` : '';

    return `
    <nav class="glass border-b border-[var(--border)] sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between h-14 sm:h-16">
          <a href="#/" class="flex items-center gap-2 sm:gap-3 group">
            <img src="img/logo.png" alt="Crack PTE" class="h-8 sm:h-9 rounded-lg">
            <div class="flex items-baseline gap-1">
              <span class="font-extrabold text-white text-base sm:text-lg">Crack</span>
              <span class="font-extrabold text-cyan-400 text-base sm:text-lg">PTE</span>
            </div>
          </a>
          <div class="hidden md:flex items-center gap-1">
            ${links.map(dLink).join('')}
            <div class="relative">
              <button onclick="document.getElementById('${moreId}').classList.toggle('hidden')" class="px-2.5 py-2 rounded-lg text-sm font-medium transition-all ${moreActive?'bg-indigo-500/20 text-indigo-400':'text-gray-400 hover:bg-white/5 hover:text-gray-200'}">More ▾</button>
              <div id="${moreId}" class="hidden absolute right-0 top-full mt-2 w-56 glass rounded-xl border border-[var(--border)] shadow-2xl py-2 z-50">
                ${moreLinks.map(l => `<a href="${l.href}" onclick="document.getElementById('${moreId}').classList.add('hidden')" class="flex items-center gap-3 px-4 py-2.5 text-sm transition-all ${activePage===l.page?'text-indigo-400 bg-indigo-500/10':'text-gray-400 hover:bg-white/5 hover:text-white'}"><span>${l.icon}</span>${l.label}</a>`).join('')}
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="hidden sm:block">${xpBar}</div>
            ${userBtn}
            <button onclick="document.getElementById('${navId}').classList.toggle('hidden')" class="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
              <svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
          </div>
        </div>
      </div>
      <div id="${navId}" class="hidden md:hidden bg-[var(--bg-secondary)] border-t border-[var(--border)] px-4 py-3 space-y-1 shadow-2xl max-h-[80vh] overflow-y-auto">
        <div class="sm:hidden mb-3 pb-3 border-b border-[var(--border)]">${xpBar}</div>
        ${user ? `
        <div class="flex items-center gap-3 px-4 py-3 mb-2 glass rounded-xl">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white" style="background:${avatarColor}">${initials}</div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-white truncate">${user.username}</p>
            <p class="text-xs text-gray-500 truncate">${user.email}</p>
          </div>
        </div>
        <a href="#/profile" onclick="document.getElementById('${navId}').classList.add('hidden')" class="block px-4 py-3 rounded-xl text-base font-medium transition-all ${activePage==='profile'?'bg-indigo-500/20 text-indigo-400':'text-gray-300 hover:bg-white/5'}">👤 My Profile</a>
        ` : ''}
        ${links.map(mLink).join('')}
        <div class="border-t border-[var(--border)] mt-2 pt-2">
          <p class="text-xs text-gray-600 px-4 py-1 uppercase tracking-wide">Tools</p>
          ${moreLinks.map(mLink).join('')}
        </div>
        ${user ? `
        <div class="border-t border-[var(--border)] mt-2 pt-2">
          <button onclick="PTE.Auth.logout()" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-400 hover:bg-red-500/10 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Sign Out
          </button>
        </div>` : ''}
      </div>
    </nav>`;
  },

  /**
   * Circular timer component
   */
  timer(id = 'timer') {
    return `
    <div id="${id}" class="relative inline-flex items-center justify-center">
      <svg class="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="8"/>
        <circle id="${id}-circle" cx="60" cy="60" r="52" fill="none" stroke="#6366f1" stroke-width="8" 
          stroke-linecap="round" stroke-dasharray="326.73" stroke-dashoffset="0"
          class="transition-all duration-1000"/>
      </svg>
      <div class="absolute flex flex-col items-center">
        <span id="${id}-time" class="text-2xl font-bold text-white tabular-nums">0:00</span>
        <span id="${id}-label" class="text-xs text-gray-400 font-medium"></span>
      </div>
    </div>`;
  },

  /**
   * Update timer display
   */
  updateTimer(id, remaining, total, label = '') {
    const circle = document.getElementById(`${id}-circle`);
    const timeEl = document.getElementById(`${id}-time`);
    const labelEl = document.getElementById(`${id}-label`);

    if (timeEl) {
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      timeEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    if (circle) {
      const circumference = 326.73;
      const progress = total > 0 ? (1 - remaining / total) : 0;
      circle.style.strokeDashoffset = circumference * progress;

      // Color change based on remaining time
      if (remaining <= 5) {
        circle.style.stroke = '#ef4444';
      } else if (remaining <= 10) {
        circle.style.stroke = '#f59e0b';
      } else {
        circle.style.stroke = '#6366f1';
      }
    }

    if (labelEl) labelEl.textContent = label;
  },

  /**
   * Waveform visualization canvas
   */
  waveform(id = 'waveform') {
    return `<canvas id="${id}" class="w-full h-20 rounded-xl bg-white/5" style="max-width:500px"></canvas>`;
  },

  /**
   * Draw waveform on canvas
   */
  drawWaveform(canvasId, dataArray, color = '#6366f1') {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !dataArray) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth * 2;
    const height = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(1, 1);

    ctx.clearRect(0, 0, width, height);

    const barCount = 64;
    const barWidth = (width / barCount) * 0.7;
    const gap = (width / barCount) * 0.3;

    for (let i = 0; i < barCount; i++) {
      const dataIndex = Math.floor(i * dataArray.length / barCount);
      const value = dataArray[dataIndex] / 255;
      const barHeight = Math.max(4, value * height * 0.85);

      const x = i * (barWidth + gap);
      const y = (height - barHeight) / 2;

      // Gradient effect
      const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
      gradient.addColorStop(0, color + 'dd');
      gradient.addColorStop(0.5, color);
      gradient.addColorStop(1, color + 'dd');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 3);
      ctx.fill();
    }
  },

  /**
   * Score card component — displays official PTE-style scoring
   * Shows overall score (10-90) + individual trait bands (0-5 or 0-6)
   */
  scoreCard(overallScore, scores, type, feedback) {
    const band = PTE.Scoring.getBand(overallScore);
    const typeConfig = Object.values(PTE.QUESTION_TYPES).find(t => t.id === type);

    let scoreBreakdown = '';

    // Content: show task-specific band and details
    if (scores.contentResult) {
      const cr = scores.contentResult;
      if (type === 'read-aloud') {
        // Read Aloud: show word errors
        scoreBreakdown += this.traitBar('Content', cr.raw, cr.max, `${cr.accuracy}% accuracy (${cr.errors} error${cr.errors !== 1 ? 's' : ''})`);
      } else if (type === 'repeat-sentence') {
        // Repeat Sentence: 0-3 scale
        const labels = ['Almost nothing', 'Less than 50%', 'At least 50%', 'All words correct'];
        scoreBreakdown += this.traitBar('Content', cr.band, cr.max, labels[cr.band] || '');
      } else {
        // DI, RL, SGD, RTS: 0-6 scale
        const labels = ['Too limited', 'Disconnected elements', 'Minimal/superficial', 'Superficial descriptions', 'Basic relationships', 'Main features accurate', 'Full & nuanced'];
        // RTS uses "Appropriacy" trait instead of "Content" (August 2025 change)
        const traitName = (cr.traitName === 'Appropriacy') ? 'Appropriacy' : 'Content';
        scoreBreakdown += this.traitBar(traitName, cr.raw, cr.max, labels[cr.raw] || '');
      }
    } else if (scores.content !== undefined) {
      // Fallback for backward compat
      scoreBreakdown += this.scoreBar('Content', scores.content);
    }

    // Pronunciation: 0-5 PTE band
    if (scores.pronunciation !== undefined) {
      const pLabels = ['Non-English', 'Intrusive', 'Intermediate', 'Good', 'Advanced', 'Highly Proficient'];
      scoreBreakdown += this.traitBar('Pronunciation', scores.pronunciation, 5, pLabels[scores.pronunciation] || '');
    }

    // Oral Fluency: 0-5 PTE band
    if (scores.fluency !== undefined) {
      const fLabels = ['Disfluent', 'Limited', 'Intermediate', 'Good', 'Advanced', 'Highly Proficient'];
      scoreBreakdown += this.traitBar('Oral Fluency', scores.fluency, 5, fLabels[scores.fluency] || '');
    }

    // Vocabulary: 0/1 for ASQ
    if (scores.vocabulary !== undefined) {
      scoreBreakdown += this.traitBar('Vocabulary', scores.vocabulary, 1, scores.vocabulary === 1 ? 'Correct' : 'Incorrect');
    }

    let feedbackHtml = '';
    if (feedback && feedback.length > 0) {
      feedbackHtml = `
      <div class="mt-6 space-y-3">
        <h4 class="font-semibold text-gray-200 flex items-center gap-2">
          <svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          PTE Feedback (Official Criteria)
        </h4>
        ${feedback.map(f => `<div class="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/5"><span class="text-cyan-400 mt-0.5 flex-shrink-0">•</span><p class="text-sm text-gray-400">${f}</p></div>`).join('')}
      </div>`;
    }

    return `
    <div class="glass neon-border rounded-2xl overflow-hidden max-w-lg mx-auto animate-fadeIn">
      <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 p-6 text-center relative overflow-hidden">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width%3D%2240%22 height%3D%2240%22 viewBox%3D%220 0 40 40%22 xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath d%3D%22M0 0h40v40H0z%22 fill%3D%22none%22/%3E%3Ccircle cx%3D%2220%22 cy%3D%2220%22 r%3D%221%22 fill%3D%22rgba(255%2C255%2C255%2C0.1)%22/%3E%3C/svg%3E')]"></div>
        <div class="relative">
          <h3 class="text-white/70 text-sm font-medium mb-1">${typeConfig ? typeConfig.name : 'Speaking'} Score</h3>
          <p class="text-white/40 text-xs mb-3">Based on official PTE Academic criteria</p>
          <div class="relative inline-flex items-center justify-center mb-3">
            <svg class="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="8"/>
              <circle cx="60" cy="60" r="52" fill="none" stroke="white" stroke-width="8" stroke-linecap="round" stroke-dasharray="326.73" stroke-dashoffset="${326.73*(1-overallScore/90)}" class="score-circle-animate"/>
            </svg>
            <div class="absolute flex flex-col items-center">
              <span class="text-4xl font-extrabold text-white neon-text">${overallScore}</span>
              <span class="text-xs text-white/50">/90</span>
            </div>
          </div>
          <div class="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full">
            <span>${band.emoji}</span>
            <span class="text-white font-semibold text-sm">${band.label}</span>
          </div>
        </div>
      </div>
      <div class="p-6">
        <h4 class="font-semibold text-gray-200 mb-4 flex items-center gap-2">
          Trait Scores
          <span class="text-xs font-normal text-gray-500">(Official PTE Scale)</span>
        </h4>
        <div class="space-y-4">${scoreBreakdown}</div>
        ${feedbackHtml}
      </div>
    </div>`;
  },

  /**
   * Trait bar: shows PTE band score (e.g. 4/5 Advanced) with a visual bar
   */
  traitBar(label, score, maxScore, descriptor) {
    const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
    let color;
    const ratio = maxScore > 0 ? score / maxScore : 0;
    if (ratio >= 0.8) color = '#10b981';       // green
    else if (ratio >= 0.6) color = '#6366f1';   // indigo
    else if (ratio >= 0.4) color = '#f59e0b';   // amber
    else if (ratio >= 0.2) color = '#f97316';   // orange
    else color = '#ef4444';                      // red

    return `
    <div>
      <div class="flex justify-between items-center mb-1">
        <span class="text-sm font-medium text-gray-400">${label}</span>
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-500">${descriptor}</span>
          <span class="text-sm font-bold tabular-nums" style="color:${color}">${score}/${maxScore}</span>
        </div>
      </div>
      <div class="h-2.5 bg-white/10 rounded-full overflow-hidden">
        <div class="h-full rounded-full transition-all duration-1000 score-bar-animate" style="width:${pct}%;background:${color};box-shadow:0 0 8px ${color}66"></div>
      </div>
    </div>`;
  },

  /**
   * Legacy score bar (0-90 scale) — kept for backward compat
   */
  scoreBar(label, score) {
    const pct = (score / 90) * 100;
    let color;
    if (score >= 70) color = '#10b981';
    else if (score >= 50) color = '#6366f1';
    else if (score >= 30) color = '#f59e0b';
    else color = '#ef4444';

    return `
    <div>
      <div class="flex justify-between items-center mb-1.5">
        <span class="text-sm font-medium text-gray-400">${label}</span>
        <span class="text-sm font-bold" style="color:${color}">${score}/90</span>
      </div>
      <div class="h-2.5 bg-white/10 rounded-full overflow-hidden">
        <div class="h-full rounded-full transition-all duration-1000 score-bar-animate" style="width:${pct}%;background:${color};box-shadow:0 0 8px ${color}66"></div>
      </div>
    </div>`;
  },

  /**
   * Question type card for practice selection
   */
  typeCard(type) {
    const stats = PTE.Store.getStats()[type.id];
    const attemptsText = stats ? `${stats.totalAttempts} attempts • Avg: ${stats.averageScore}/90` : 'No attempts yet';
    const questionCount = PTE.Questions[type.id] ? PTE.Questions[type.id].length : 0;
    const predictionCount = PTE.Predictions && PTE.Predictions[type.id] ? PTE.Predictions[type.id].length : 0;

    return `
    <a href="#/practice/${type.id}" class="block group">
      <div class="glass glass-hover rounded-2xl p-6 transition-all duration-300">
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style="background:${type.color}22">
            ${type.icon}
          </div>
          <div class="flex flex-col items-end gap-1">
            <span class="text-xs font-bold px-2.5 py-1 rounded-full" style="background:${type.color}22;color:${type.color}">${type.shortName}</span>
            <span class="text-xs text-gray-500 font-medium">${questionCount} Qs</span>
          </div>
        </div>
        <h3 class="font-bold text-gray-100 mb-1 group-hover:text-cyan-400 transition-colors">${type.name}</h3>
        <p class="text-sm text-gray-500 mb-3 line-clamp-2">${type.description}</p>
        <div class="flex items-center gap-2 text-xs text-gray-500">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span>Prep: ${type.prepTime}s • Record: ${type.recordTime}s</span>
        </div>
        ${predictionCount > 0 ? `
        <div class="mt-2 flex items-center gap-1.5">
          <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/20">${predictionCount} Predictions</span>
        </div>` : ''}
        <div class="mt-3 pt-3 border-t border-white/5">
          <p class="text-xs text-gray-500">${attemptsText}</p>
        </div>
      </div>
    </a>`;
  },

  /**
   * Tips panel
   */
  tipsPanel(tips) {
    return `
    <div class="glass rounded-xl p-4 mb-6 border border-amber-500/20">
      <h4 class="font-semibold text-amber-400 text-sm mb-2 flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
        Tips for Success
      </h4>
      <ul class="space-y-1.5">
        ${tips.map(t => `<li class="text-xs text-amber-300/80 flex items-start gap-2"><span class="text-amber-500 mt-0.5">▸</span>${t}</li>`).join('')}
      </ul>
    </div>`;
  },

  /**
   * Loading spinner
   */
  spinner(text = 'Loading...') {
    return `
    <div class="flex flex-col items-center justify-center py-20">
      <div class="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
      <p class="text-gray-500 text-sm">${text}</p>
    </div>`;
  },

  /**
   * Empty state
   */
  emptyState(icon, title, description) {
    return `
    <div class="text-center py-16 animate-fadeIn">
      <div class="text-5xl mb-4 animate-float">${icon}</div>
      <h3 class="text-lg font-semibold text-white mb-2">${title}</h3>
      <p class="text-gray-500 text-sm max-w-md mx-auto">${description}</p>
    </div>`;
  },

  /**
   * Pronunciation highlight component
   * Shows the expected text with words colored green (matched) or red (missed)
   * Each word is clickable to hear its pronunciation via TTS
   * @param {string} expectedText - The original expected text
   * @param {string} transcript - What the user actually said (recognized)
   * @returns {string} HTML string
   */
  pronunciationHighlight(expectedText, transcript) {
    if (!expectedText) return '';

    const expWords = expectedText.replace(/[^\w\s'-]/g, ' ').split(/\s+/).filter(w => w);
    const recNorm = (transcript || '').toLowerCase().replace(/[^\w\s'-]/g, ' ');
    const recWords = recNorm.split(/\s+/).filter(w => w);

    // Normalize expected words for comparison
    const expNorm = expWords.map(w => w.toLowerCase().replace(/[^\w'-]/g, ''));

    // Use LCS to find sequence-aware matches (respects word order + duplicates)
    const lcsResult = PTE.Scoring._lcsWords(expNorm, recWords);

    // Also check phonetic closeness for missed words (Levenshtein ≤ 2)
    const closeMatchSet = new Set();
    for (let i = 0; i < expNorm.length; i++) {
      if (lcsResult.expIndices.has(i)) continue;
      for (let j = 0; j < recWords.length; j++) {
        if (lcsResult.recIndices.has(j)) continue;
        const dist = PTE.Scoring.levenshtein(expNorm[i], recWords[j]);
        if (dist <= 2 && dist < Math.max(expNorm[i].length, recWords[j].length) * 0.5) {
          closeMatchSet.add(i);
          break;
        }
      }
    }

    const wordSpans = expWords.map((word, i) => {
      const exactMatch = lcsResult.expIndices.has(i);
      const closeMatch = closeMatchSet.has(i);

      let bgClass;
      if (exactMatch) {
        bgClass = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/25';
      } else if (closeMatch) {
        bgClass = 'bg-amber-500/15 text-amber-400 border-amber-500/25 hover:bg-amber-500/25';
      } else {
        bgClass = 'bg-red-500/15 text-red-400 border-red-500/25 hover:bg-red-500/25';
      }
      const iconSvg = `<svg class="w-3 h-3 inline-block ml-0.5 opacity-40 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>`;

      const safeWord = word.replace(/'/g, "\\'");
      const title = exactMatch ? 'Matched correctly' : closeMatch ? 'Close pronunciation (minor error)' : 'Missed — click to hear correct pronunciation';
      return `<span class="group inline-flex items-center px-1.5 py-0.5 rounded-md border text-sm font-medium cursor-pointer transition-all ${bgClass}" onclick="PTE.pronounceWord('${safeWord}')" title="${title}">${word}${iconSvg}</span>`;
    });

    const matchedCount = lcsResult.expIndices.size;
    const closeCount = closeMatchSet.size;
    const totalWords = expWords.length;
    const pct = totalWords > 0 ? Math.round(((matchedCount + closeCount * 0.5) / totalWords) * 100) : 0;

    return `
    <div class="mt-4 glass neon-border rounded-2xl overflow-hidden max-w-lg mx-auto animate-fadeIn">
      <div class="bg-gradient-to-r from-emerald-600 to-teal-600 p-4">
        <h3 class="text-white font-bold text-sm flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Pronunciation Comparison
        </h3>
        <p class="text-white/70 text-xs text-center mt-1">Click any word to hear its correct pronunciation</p>
      </div>
      <div class="p-5">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <span class="flex items-center gap-1 text-xs text-gray-400"><span class="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/30 inline-block"></span> Correct</span>
            <span class="flex items-center gap-1 text-xs text-gray-400"><span class="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/30 inline-block"></span> Close</span>
            <span class="flex items-center gap-1 text-xs text-gray-400"><span class="w-3 h-3 rounded bg-red-500/20 border border-red-500/30 inline-block"></span> Missed</span>
          </div>
          <span class="text-xs font-bold ${pct >= 70 ? 'text-emerald-400' : pct >= 40 ? 'text-amber-400' : 'text-red-400'}">${pct}% matched</span>
        </div>
        <div class="flex flex-wrap gap-1.5 leading-relaxed">
          ${wordSpans.join('\n          ')}
        </div>
        <div class="mt-4 pt-3 border-t border-white/10">
          <button onclick="PTE.pronounceText()" class="inline-flex items-center gap-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Listen to full text at native speed
          </button>
        </div>
      </div>
    </div>`;
  },

  /**
   * Model Answer Script component
   * Shows a detailed model answer for the question with click-to-play
   */
  modelAnswerScript(type, question) {
    const script = PTE.ModelAnswers ? PTE.ModelAnswers.getScript(type, question) : null;
    if (!script) return '';

    return `
    <div class="mt-4 glass neon-border rounded-2xl overflow-hidden max-w-lg mx-auto animate-fadeIn">
      <div class="bg-gradient-to-r from-amber-600 to-orange-600 p-4">
        <h3 class="text-white font-bold text-sm flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          Model Answer Script
        </h3>
      </div>
      <div class="p-5">
        ${script.intro ? `<p class="text-xs text-gray-500 mb-2 italic">${script.intro}</p>` : ''}
        <div class="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-3">
          <p class="text-sm text-gray-200 leading-relaxed" id="model-answer-text">${script.text}</p>
        </div>
        <div class="flex items-center gap-3">
          <button onclick="PTE.pronounceModelAnswer()" class="inline-flex items-center gap-2 bg-amber-500/15 text-amber-400 font-medium text-xs px-4 py-2 rounded-lg hover:bg-amber-500/25 transition-colors border border-amber-500/20">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
            Listen to Model Answer
          </button>
          <button onclick="PTE.pronounceModelAnswer(0.8)" class="inline-flex items-center gap-2 text-gray-400 font-medium text-xs px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
            Slow Speed
          </button>
        </div>
        ${script.tips ? `
        <div class="mt-3 pt-3 border-t border-white/10">
          <p class="text-xs font-semibold text-gray-400 mb-1">Key points in this answer:</p>
          <ul class="space-y-1">
            ${script.tips.map(t => `<li class="text-xs text-gray-400 flex items-start gap-1.5"><span class="text-amber-400 mt-0.5">&#9654;</span>${t}</li>`).join('')}
          </ul>
        </div>` : ''}
      </div>
    </div>`;
  },

  /**
   * Mini score sparkline for progress page
   */
  sparkline(scores, width = 100, height = 30) {
    if (!scores || scores.length < 2) return '';
    const max = Math.max(...scores, 1);
    const min = Math.min(...scores, 0);
    const range = max - min || 1;
    const points = scores.map((s, i) => {
      const x = (i / (scores.length - 1)) * width;
      const y = height - ((s - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    }).join(' ');

    return `<svg width="${width}" height="${height}" class="inline-block">
      <polyline points="${points}" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  },

  /**
   * Show a real-time fluency warning (e.g. for filler words)
   */
  showFluencyWarning(word) {
    let warningEl = document.getElementById('fluency-warning');
    if (!warningEl) {
      warningEl = document.createElement('div');
      warningEl.id = 'fluency-warning';
      warningEl.className = 'fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 transition-all duration-300 opacity-0 scale-90';
      warningEl.innerHTML = `
        <div class="bg-rose-500/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-2xl border border-rose-400/50 flex items-center gap-3">
          <span class="text-2xl animate-pulse">⚠️</span>
          <div class="flex flex-col">
            <span class="text-xs font-bold uppercase tracking-wider text-rose-100">Fluency Alert</span>
            <span class="font-bold text-lg leading-none">Avoid "${word}"</span>
          </div>
        </div>
      `;
      document.body.appendChild(warningEl);
    }
    
    // Update word if needed
    const textSpan = warningEl.querySelector('.font-bold.text-lg');
    if (textSpan) textSpan.textContent = `Avoid "${word}"`;

    // Show
    requestAnimationFrame(() => {
      warningEl.classList.remove('opacity-0', 'scale-90');
      warningEl.classList.add('opacity-100', 'scale-100', 'animate-pulse');
    });

    // Hide after delay
    clearTimeout(window._fluencyWarningTimeout);
    window._fluencyWarningTimeout = setTimeout(() => {
      warningEl.classList.remove('opacity-100', 'scale-100', 'animate-pulse');
      warningEl.classList.add('opacity-0', 'scale-90');
    }, 1500);
  }
};
