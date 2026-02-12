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
      { href: '#/', label: 'Home', page: 'home', cls: 'bg-indigo-50 text-indigo-700' },
      { href: '#/practice', label: 'Practice', page: 'practice', cls: 'bg-indigo-50 text-indigo-700' },
      { href: '#/predictions', label: 'Predictions', page: 'predictions', cls: 'bg-orange-50 text-orange-700' },
      { href: '#/mock-test', label: 'Mock Test', page: 'mock-test', cls: 'bg-red-50 text-red-700' },
      { href: '#/progress', label: 'Progress', page: 'progress', cls: 'bg-indigo-50 text-indigo-700' },
    ];
    const desktopLinks = links.map(l =>
      `<a href="${l.href}" class="px-2.5 py-2 rounded-lg text-sm font-medium transition-all ${activePage === l.page ? l.cls : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}">${l.label}</a>`
    ).join('');
    const mobileLinks = links.map(l =>
      `<a href="${l.href}" onclick="document.getElementById('${navId}').classList.add('hidden')" class="block px-4 py-3 rounded-xl text-base font-medium transition-all ${activePage === l.page ? l.cls : 'text-gray-700 hover:bg-gray-50'}">${l.label}</a>`
    ).join('');

    return `
    <nav class="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between h-14 sm:h-16">
          <a href="#/" class="flex items-center gap-2 sm:gap-3 group">
            <div class="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:shadow-indigo-300 transition-shadow">
              <span class="text-white font-extrabold text-xs sm:text-sm tracking-tight">C</span>
            </div>
            <div class="flex items-baseline gap-1">
              <span class="font-extrabold text-gray-900 text-base sm:text-lg">Crack</span>
              <span class="font-extrabold text-indigo-600 text-base sm:text-lg">PTE</span>
            </div>
          </a>
          <!-- Desktop nav -->
          <div class="hidden md:flex items-center gap-1">${desktopLinks}</div>
          <!-- Mobile hamburger -->
          <button onclick="document.getElementById('${navId}').classList.toggle('hidden')" class="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
            <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
      </div>
      <!-- Mobile menu -->
      <div id="${navId}" class="hidden md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1 shadow-lg">
        ${mobileLinks}
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
        <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" stroke-width="8"/>
        <circle id="${id}-circle" cx="60" cy="60" r="52" fill="none" stroke="#6366f1" stroke-width="8" 
          stroke-linecap="round" stroke-dasharray="326.73" stroke-dashoffset="0"
          class="transition-all duration-1000"/>
      </svg>
      <div class="absolute flex flex-col items-center">
        <span id="${id}-time" class="text-2xl font-bold text-gray-800 tabular-nums">0:00</span>
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
    return `<canvas id="${id}" class="w-full h-20 rounded-xl bg-gray-50" style="max-width:500px"></canvas>`;
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
   * Score card component
   */
  scoreCard(overallScore, scores, type, feedback) {
    const band = PTE.Scoring.getBand(overallScore);
    const typeConfig = Object.values(PTE.QUESTION_TYPES).find(t => t.id === type);

    let scoreBreakdown = '';
    if (scores.content !== undefined) {
      scoreBreakdown += this.scoreBar('Content', scores.content);
    }
    if (scores.pronunciation !== undefined) {
      scoreBreakdown += this.scoreBar('Pronunciation', scores.pronunciation);
    }
    if (scores.fluency !== undefined) {
      scoreBreakdown += this.scoreBar('Fluency', scores.fluency);
    }
    if (scores.vocabulary !== undefined) {
      scoreBreakdown += this.scoreBar('Vocabulary', scores.vocabulary);
    }

    let feedbackHtml = '';
    if (feedback && feedback.length > 0) {
      feedbackHtml = `
      <div class="mt-6 space-y-3">
        <h4 class="font-semibold text-gray-700 flex items-center gap-2">
          <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          Feedback
        </h4>
        ${feedback.map(f => `
          <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <span class="text-indigo-400 mt-0.5">•</span>
            <p class="text-sm text-gray-600">${f}</p>
          </div>
        `).join('')}
      </div>`;
    }

    return `
    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-w-lg mx-auto animate-fadeIn">
      <div class="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-center">
        <h3 class="text-white/80 text-sm font-medium mb-3">${typeConfig ? typeConfig.name : 'Speaking'} Score</h3>
        <div class="relative inline-flex items-center justify-center mb-3">
          <svg class="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="8"/>
            <circle cx="60" cy="60" r="52" fill="none" stroke="white" stroke-width="8" 
              stroke-linecap="round" stroke-dasharray="326.73" stroke-dashoffset="${326.73 * (1 - overallScore / 90)}"
              class="score-circle-animate"/>
          </svg>
          <div class="absolute flex flex-col items-center">
            <span class="text-4xl font-bold text-white">${overallScore}</span>
            <span class="text-xs text-white/70">/90</span>
          </div>
        </div>
        <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full">
          <span>${band.emoji}</span>
          <span class="text-white font-semibold text-sm">${band.label}</span>
        </div>
      </div>
      <div class="p-6">
        <h4 class="font-semibold text-gray-700 mb-4">Score Breakdown</h4>
        <div class="space-y-4">
          ${scoreBreakdown}
        </div>
        ${feedbackHtml}
      </div>
    </div>`;
  },

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
        <span class="text-sm font-medium text-gray-600">${label}</span>
        <span class="text-sm font-bold" style="color:${color}">${score}/90</span>
      </div>
      <div class="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div class="h-full rounded-full transition-all duration-1000 score-bar-animate" style="width:${pct}%;background:${color}"></div>
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
      <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1">
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style="background:${type.colorLight}">
            ${type.icon}
          </div>
          <div class="flex flex-col items-end gap-1">
            <span class="text-xs font-bold px-2.5 py-1 rounded-full" style="background:${type.colorLight};color:${type.color}">${type.shortName}</span>
            <span class="text-xs text-gray-400 font-medium">${questionCount} Qs</span>
          </div>
        </div>
        <h3 class="font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">${type.name}</h3>
        <p class="text-sm text-gray-500 mb-3 line-clamp-2">${type.description}</p>
        <div class="flex items-center gap-2 text-xs text-gray-400">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span>Prep: ${type.prepTime}s • Record: ${type.recordTime}s</span>
        </div>
        ${predictionCount > 0 ? `
        <div class="mt-2 flex items-center gap-1.5">
          <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">${predictionCount} Predictions</span>
          <span class="text-xs text-gray-400">from APEUni, Gurully+</span>
        </div>` : ''}
        <div class="mt-3 pt-3 border-t border-gray-50">
          <p class="text-xs text-gray-400">${attemptsText}</p>
        </div>
      </div>
    </a>`;
  },

  /**
   * Tips panel
   */
  tipsPanel(tips) {
    return `
    <div class="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
      <h4 class="font-semibold text-amber-800 text-sm mb-2 flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
        Tips for Success
      </h4>
      <ul class="space-y-1.5">
        ${tips.map(t => `<li class="text-xs text-amber-700 flex items-start gap-2"><span class="text-amber-400 mt-0.5">▸</span>${t}</li>`).join('')}
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
    <div class="text-center py-16">
      <div class="text-5xl mb-4">${icon}</div>
      <h3 class="text-lg font-semibold text-gray-700 mb-2">${title}</h3>
      <p class="text-gray-400 text-sm max-w-md mx-auto">${description}</p>
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
    const recWordSet = new Set(recNorm.split(/\s+/).filter(w => w));

    // Build a frequency map for recognized words for better matching
    const recFreq = {};
    recNorm.split(/\s+/).filter(w => w).forEach(w => { recFreq[w] = (recFreq[w] || 0) + 1; });

    const usedFreq = {};
    const wordSpans = expWords.map((word, i) => {
      const wordLower = word.toLowerCase().replace(/[^\w'-]/g, '');
      const isMatch = recWordSet.has(wordLower);
      // Track usage to handle duplicates
      if (isMatch) {
        usedFreq[wordLower] = (usedFreq[wordLower] || 0) + 1;
      }
      const matched = isMatch && (usedFreq[wordLower] || 0) <= (recFreq[wordLower] || 0);

      const bgClass = matched
        ? 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200'
        : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200';
      const iconSvg = `<svg class="w-3 h-3 inline-block ml-0.5 opacity-40 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>`;

      // Escape single quotes for onclick
      const safeWord = word.replace(/'/g, "\\'");
      return `<span class="group inline-flex items-center px-1.5 py-0.5 rounded-md border text-sm font-medium cursor-pointer transition-all ${bgClass}" onclick="PTE.pronounceWord('${safeWord}')" title="Click to hear pronunciation">${word}${iconSvg}</span>`;
    });

    const matchedCount = Object.values(usedFreq).reduce((s, v) => s + v, 0);
    const totalWords = expWords.length;
    const pct = totalWords > 0 ? Math.round((matchedCount / totalWords) * 100) : 0;

    return `
    <div class="mt-4 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden max-w-lg mx-auto animate-fadeIn">
      <div class="bg-gradient-to-r from-emerald-500 to-teal-500 p-4">
        <h3 class="text-white font-bold text-sm flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Pronunciation Comparison
        </h3>
        <p class="text-white/70 text-xs text-center mt-1">Click any word to hear its correct pronunciation</p>
      </div>
      <div class="p-5">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <span class="flex items-center gap-1 text-xs"><span class="w-3 h-3 rounded bg-emerald-100 border border-emerald-200 inline-block"></span> Correct</span>
            <span class="flex items-center gap-1 text-xs"><span class="w-3 h-3 rounded bg-red-100 border border-red-200 inline-block"></span> Missed</span>
          </div>
          <span class="text-xs font-bold ${pct >= 70 ? 'text-emerald-600' : pct >= 40 ? 'text-amber-600' : 'text-red-600'}">${pct}% matched</span>
        </div>
        <div class="flex flex-wrap gap-1.5 leading-relaxed">
          ${wordSpans.join('\n          ')}
        </div>
        <div class="mt-4 pt-3 border-t border-gray-100">
          <button onclick="PTE.pronounceText()" class="inline-flex items-center gap-2 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
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
    <div class="mt-4 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden max-w-lg mx-auto animate-fadeIn">
      <div class="bg-gradient-to-r from-amber-500 to-orange-500 p-4">
        <h3 class="text-white font-bold text-sm flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          Model Answer Script
        </h3>
      </div>
      <div class="p-5">
        ${script.intro ? `<p class="text-xs text-gray-400 mb-2 italic">${script.intro}</p>` : ''}
        <div class="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-3">
          <p class="text-sm text-gray-800 leading-relaxed" id="model-answer-text">${script.text}</p>
        </div>
        <div class="flex items-center gap-3">
          <button onclick="PTE.pronounceModelAnswer()" class="inline-flex items-center gap-2 bg-amber-100 text-amber-800 font-medium text-xs px-4 py-2 rounded-lg hover:bg-amber-200 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
            Listen to Model Answer
          </button>
          <button onclick="PTE.pronounceModelAnswer(0.8)" class="inline-flex items-center gap-2 text-gray-500 font-medium text-xs px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            Slow Speed
          </button>
        </div>
        ${script.tips ? `
        <div class="mt-3 pt-3 border-t border-gray-100">
          <p class="text-xs font-semibold text-gray-500 mb-1">Key points in this answer:</p>
          <ul class="space-y-1">
            ${script.tips.map(t => `<li class="text-xs text-gray-500 flex items-start gap-1.5"><span class="text-amber-400 mt-0.5">&#9654;</span>${t}</li>`).join('')}
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
  }
};
