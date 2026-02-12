/**
 * PTE Speaking Module - Page Renderers
 * Handles rendering for each page/view of the SPA
 */

window.PTE = window.PTE || {};

PTE.Pages = {
  // ── Home Page ────────────────────────────────────────────────
  home() {
    const stats = PTE.Store.getStats();
    const overall = stats.overall || null;
    const gp = PTE.Gamify ? PTE.Gamify.getProgress() : null;

    let statsSection = '';
    if (overall) {
      statsSection = `
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
        <div class="glass rounded-2xl p-5 text-center"><p class="text-3xl font-bold text-indigo-400">${overall.totalAttempts}</p><p class="text-xs text-gray-500 mt-1">Total Attempts</p></div>
        <div class="glass rounded-2xl p-5 text-center"><p class="text-3xl font-bold text-emerald-400">${overall.averageScore}</p><p class="text-xs text-gray-500 mt-1">Average Score</p></div>
        <div class="glass rounded-2xl p-5 text-center"><p class="text-3xl font-bold text-purple-400">${overall.bestScore}</p><p class="text-xs text-gray-500 mt-1">Best Score</p></div>
        <div class="glass rounded-2xl p-5 text-center"><p class="text-3xl font-bold text-amber-400">${overall.streak}</p><p class="text-xs text-gray-500 mt-1">Day Streak</p></div>
      </div>`;
    }

    // Gamification profile card
    let profileCard = '';
    if (gp) {
      const badgeIcons = gp.badges.slice(0,6).map(b => `<span title="${b.name}" class="text-lg cursor-default">${b.icon}</span>`).join('');
      profileCard = `
      <div class="max-w-4xl mx-auto mb-8 glass neon-border rounded-2xl p-6">
        <div class="flex flex-col sm:flex-row items-center gap-6">
          <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg animate-float">${gp.level.icon}</div>
          <div class="flex-1 text-center sm:text-left">
            <div class="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <h3 class="text-xl font-bold text-white">${gp.level.title}</h3>
              <span class="badge badge-level">Level ${gp.level.level}</span>
            </div>
            <div class="flex items-center gap-3 mb-2">
              <div class="xp-bar-bg flex-1 max-w-xs"><div class="xp-bar-fill" style="width:${gp.progress}%"></div></div>
              <span class="text-xs text-indigo-400 font-bold">${gp.xp} / ${gp.nextLevel.xpNeeded} XP</span>
            </div>
            <div class="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              ${gp.streak > 0 ? `<span class="badge badge-streak">🔥 ${gp.streak}-day streak</span>` : ''}
              <span class="badge badge-xp">⚡ ${gp.xp} XP</span>
              ${badgeIcons ? `<div class="flex gap-1 ml-1">${badgeIcons}</div>` : ''}
            </div>
          </div>
        </div>
      </div>`;
    }

    const featureCard = (icon, color, title, desc) => `
      <div class="glass rounded-2xl p-6 text-center hover:border-[${color}]/30 transition-all">
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl" style="background:${color}22">${icon}</div>
        <h3 class="font-bold text-gray-100 mb-2">${title}</h3>
        <p class="text-sm text-gray-500">${desc}</p>
      </div>`;

    return `
    ${PTE.UI.navbar('home')}
    <main class="min-h-screen">
      <!-- Hero -->
      <section class="relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-purple-900/30 to-transparent"></div>
        <div class="absolute inset-0" style="background:radial-gradient(circle at 30% 20%, rgba(99,102,241,0.15) 0%, transparent 50%),radial-gradient(circle at 70% 80%, rgba(168,85,247,0.1) 0%, transparent 50%)"></div>
        <div class="relative max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
          <img src="img/logo.png" alt="Crack PTE" class="h-20 sm:h-24 mx-auto mb-6 animate-float rounded-2xl">
          <div class="inline-flex items-center gap-2 bg-indigo-500/15 border border-indigo-500/20 px-4 py-2 rounded-full text-sm mb-6 text-indigo-300">
            <span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            500+ Prediction Questions • AI Scoring • Gamified
          </div>
          <h1 class="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Crack PTE <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Speaking</span>
          </h1>
          <p class="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Earn XP, level up, unlock badges. Practice with real exam predictions and AI-powered feedback.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#/mock-test" class="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-all shadow-xl shadow-indigo-500/20 hover:-translate-y-0.5 animate-glow">
              ⚡ Take Mock Test
            </a>
            <a href="#/practice" class="inline-flex items-center justify-center gap-2 glass text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-all border border-white/10">
              🎯 Practice by Type
            </a>
            <a href="#/predictions" class="inline-flex items-center justify-center gap-2 bg-amber-500/15 border border-amber-500/20 text-amber-400 font-bold px-8 py-4 rounded-xl hover:bg-amber-500/25 transition-all">
              🔮 Predictions
            </a>
          </div>
        </div>
      </section>

      ${profileCard ? `<section class="px-4 -mt-4">${profileCard}</section>` : ''}
      ${statsSection ? `<section class="py-8 px-4">${statsSection}</section>` : ''}

      <!-- Question Types -->
      <section class="py-12 px-4">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-10">
            <h2 class="text-3xl font-bold text-white mb-3">All Speaking Question Types</h2>
            <p class="text-gray-500 max-w-xl mx-auto">All 7 PTE Academic speaking tasks including 2025 new types.</p>
          </div>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            ${Object.values(PTE.QUESTION_TYPES).map(t => PTE.UI.typeCard(t)).join('')}
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="py-12 px-4">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-10">
            <h2 class="text-3xl font-bold text-white mb-3">Powered By</h2>
          </div>
          <div class="grid md:grid-cols-3 gap-5">
            ${featureCard('🔮','#f59e0b','Prediction Questions','500+ high-frequency questions from APEUni, Gurully, StormEduGo.')}
            ${featureCard('🤖','#6366f1','AI Feedback','Word-by-word analysis, keyword coverage, pronunciation tips.')}
            ${featureCard('🎵','#a855f7','Tone Analysis','Real-time pitch, volume, and intonation tracking.')}
            ${featureCard('🏆','#10b981','Gamification','Earn XP, level up, unlock badges, maintain streaks.')}
            ${featureCard('📝','#ef4444','Mock Tests','Full exam simulation with auto-advancing questions.')}
            ${featureCard('📊','#22d3ee','Progress Tracking','Score trends, type breakdown, session history.')}
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="border-t border-[var(--border)] py-8 px-4 text-center">
        <img src="img/logo.png" alt="Crack PTE" class="h-8 mx-auto mb-3 rounded-lg opacity-60">
        <p class="text-xs text-gray-600">Designed and Developed by <span class="font-semibold text-gray-400">Sanjay Singh And Sons Solutions</span></p>
        <p class="text-xs text-gray-700 mt-1">Built for exam preparation. Not affiliated with Pearson.</p>
      </footer>
    </main>`;
  },

  // ── Practice Selection Page ──────────────────────────────────
  practice() {
    return `
    ${PTE.UI.navbar('practice')}
    <main class="min-h-screen py-10 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="mb-10">
          <h1 class="text-3xl font-bold text-white mb-2">Choose a Question Type</h1>
          <p class="text-gray-500">Select a speaking task to begin practicing. Each type mirrors the real PTE Academic exam.</p>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          ${Object.values(PTE.QUESTION_TYPES).map(t => PTE.UI.typeCard(t)).join('')}
        </div>
      </div>
    </main>`;
  },

  // ── Progress Page ────────────────────────────────────────────
  progress() {
    const stats = PTE.Store.getStats();
    const overall = stats.overall;
    const recentSessions = PTE.Store.getRecentSessions(15);

    if (!overall || overall.totalAttempts === 0) {
      return `
      ${PTE.UI.navbar('progress')}
      <main class="min-h-screen bg-gray-50 py-10 px-4">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-3xl font-bold text-gray-900 mb-8">Your Progress</h1>
          ${PTE.UI.emptyState('📊', 'No Practice Sessions Yet', 'Start practicing to see your progress here. Your scores and statistics will be tracked automatically.')}
          <div class="text-center mt-6">
            <a href="#/practice" class="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors">
              Start Practicing
            </a>
          </div>
        </div>
      </main>`;
    }

    // Type-by-type breakdown
    let typeBreakdown = '';
    Object.values(PTE.QUESTION_TYPES).forEach(type => {
      const typeStat = stats[type.id];
      if (typeStat) {
        typeBreakdown += `
        <div class="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style="background:${type.colorLight}">${type.icon}</div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <h4 class="font-semibold text-gray-800 text-sm truncate">${type.name}</h4>
              <span class="text-sm font-bold text-indigo-600">${typeStat.averageScore}/90</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full rounded-full" style="width:${(typeStat.averageScore/90)*100}%;background:${type.color}"></div>
              </div>
              <span class="text-xs text-gray-400 flex-shrink-0">${typeStat.totalAttempts} tries</span>
            </div>
          </div>
          <div class="flex-shrink-0">${PTE.UI.sparkline(typeStat.recentScores)}</div>
        </div>`;
      }
    });

    // Recent sessions table
    let recentTable = '';
    if (recentSessions.length > 0) {
      recentTable = `
      <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-50">
          <h3 class="font-bold text-gray-800">Recent Sessions</h3>
        </div>
        <div class="divide-y divide-gray-50">
          ${recentSessions.map(s => {
            const typeConfig = Object.values(PTE.QUESTION_TYPES).find(t => t.id === s.type);
            const band = PTE.Scoring.getBand(s.overallScore);
            return `
            <div class="px-6 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style="background:${typeConfig ? typeConfig.colorLight : '#f1f5f9'}">${typeConfig ? typeConfig.icon : '?'}</div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-800 truncate">${typeConfig ? typeConfig.name : s.type}</p>
                <p class="text-xs text-gray-400">${s.date}</p>
              </div>
              <div class="text-right">
                <span class="text-sm font-bold" style="color:${band.color}">${s.overallScore}/90</span>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>`;
    }

    const practiceMinutes = Math.round((overall.totalPracticeTime || 0) / 60);

    return `
    ${PTE.UI.navbar('progress')}
    <main class="min-h-screen bg-gray-50 py-10 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Your Progress</h1>
          <button onclick="if(confirm('Clear all progress data?')){PTE.Store.clearAll();PTE.Router.navigate(location.hash.slice(1));}" 
            class="text-xs text-gray-400 hover:text-red-500 transition-colors">Clear Data</button>
        </div>

        <!-- Overall Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
            <p class="text-3xl font-bold text-indigo-600">${overall.totalAttempts}</p>
            <p class="text-xs text-gray-400 mt-1">Total Attempts</p>
          </div>
          <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
            <p class="text-3xl font-bold text-emerald-600">${overall.averageScore}</p>
            <p class="text-xs text-gray-400 mt-1">Average Score</p>
          </div>
          <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
            <p class="text-3xl font-bold text-purple-600">${overall.bestScore}</p>
            <p class="text-xs text-gray-400 mt-1">Best Score</p>
          </div>
          <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
            <p class="text-3xl font-bold text-amber-600">${practiceMinutes}<span class="text-lg">m</span></p>
            <p class="text-xs text-gray-400 mt-1">Practice Time</p>
          </div>
        </div>

        <!-- Type Breakdown -->
        <div class="mb-8">
          <h3 class="font-bold text-gray-800 mb-4">Score by Question Type</h3>
          <div class="space-y-3">
            ${typeBreakdown || '<p class="text-gray-400 text-sm">No data yet</p>'}
          </div>
        </div>

        <!-- Recent Sessions -->
        ${recentTable}
      </div>
    </main>`;
  },

  // ── Practice Question Page ───────────────────────────────────
  practiceQuestion(typeId, predictionsOnly) {
    const typeConfig = Object.values(PTE.QUESTION_TYPES).find(t => t.id === typeId);
    const isPred = !!predictionsOnly;
    const navPage = isPred ? 'predictions' : 'practice';
    const backUrl = isPred ? '#/predictions' : '#/practice';

    if (!typeConfig) {
      return `
      ${PTE.UI.navbar(navPage)}
      <main class="min-h-screen bg-gray-50 py-10 px-4">
        <div class="max-w-4xl mx-auto">
          ${PTE.UI.emptyState('🔍', 'Question Type Not Found', 'The requested question type does not exist.')}
          <div class="text-center mt-4">
            <a href="${backUrl}" class="text-indigo-600 font-medium hover:text-indigo-700">Back</a>
          </div>
        </div>
      </main>`;
    }

    const questions = isPred ? (PTE.Predictions[typeId] || []) : (PTE.Questions[typeId] || []);
    if (questions.length === 0) {
      return `
      ${PTE.UI.navbar(navPage)}
      <main class="min-h-screen bg-gray-50 py-10 px-4">
        <div class="max-w-4xl mx-auto">
          ${PTE.UI.emptyState('📝', 'No Questions Available', 'Questions for this type are coming soon.')}
        </div>
      </main>`;
    }

    return `
    ${PTE.UI.navbar(navPage)}
    <main class="min-h-screen bg-gray-50 py-8 px-4">
      <div class="max-w-3xl mx-auto">
        ${isPred ? '<div class="mb-4 inline-flex items-center gap-2 bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1.5 rounded-full"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> Prediction Questions Only</div>' : ''}
        <!-- Header -->
        <div class="flex items-center gap-4 mb-6">
          <a href="${backUrl}" class="w-10 h-10 bg-white rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </a>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xl">${typeConfig.icon}</span>
              <h1 class="text-xl font-bold text-gray-900">${typeConfig.name}</h1>
              <span class="text-xs font-bold px-2 py-0.5 rounded-full" style="background:${typeConfig.colorLight};color:${typeConfig.color}">${typeConfig.shortName}</span>
            </div>
            <p class="text-sm text-gray-500">${typeConfig.description}</p>
          </div>
        </div>

        <!-- Tips (collapsible) -->
        <details class="mb-6">
          <summary class="cursor-pointer text-sm font-medium text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5 hover:bg-amber-100 transition-colors">
            Show Tips for ${typeConfig.name}
          </summary>
          <div class="mt-2">
            ${PTE.UI.tipsPanel(typeConfig.tips)}
          </div>
        </details>

        <!-- Question Navigation -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-400">Question</span>
            <select id="question-select" class="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 font-medium text-gray-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none" onchange="PTE.App.loadQuestion(this.value)">
              ${questions.map((q, i) => `<option value="${i}">Q${i + 1} of ${questions.length}</option>`).join('')}
            </select>
          </div>
          <button id="btn-skip" onclick="PTE.App.nextQuestion()" class="text-sm text-gray-400 hover:text-indigo-600 font-medium transition-colors">
            Skip →
          </button>
        </div>

        <!-- Practice Area -->
        <div id="practice-area" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <!-- Content is dynamically rendered by PTE.App -->
        </div>

        <!-- Score Display Area (hidden initially) -->
        <div id="score-area" class="mt-6 hidden">
          <!-- Score card rendered here after evaluation -->
        </div>

        <!-- Action Buttons -->
        <div id="action-buttons" class="mt-6 flex justify-center gap-4">
          <!-- Buttons rendered dynamically -->
        </div>
      </div>
    </main>`;
  },

  // ── Mock Test Selection Page ─────────────────────────────────
  // ── Predictions Page ──────────────────────────────────────────
  predictions() {
    const types = Object.values(PTE.QUESTION_TYPES);
    const predictions = PTE.Predictions || {};

    // Count totals
    let totalPredictions = 0;
    const typeCounts = {};
    types.forEach(t => {
      const count = predictions[t.id] ? predictions[t.id].length : 0;
      typeCounts[t.id] = count;
      totalPredictions += count;
    });

    // Source stats
    const sourceCounts = {};
    Object.values(predictions).forEach(arr => {
      (arr || []).forEach(q => {
        if (q.source) sourceCounts[q.source] = (sourceCounts[q.source] || 0) + 1;
      });
    });

    return `
    ${PTE.UI.navbar('predictions')}
    <main class="min-h-screen bg-gray-50">
      <!-- Hero -->
      <section class="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white px-4 py-12">
        <div class="max-w-4xl mx-auto text-center">
          <div class="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-4">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            Updated for PTE 2025/2026 Exam Cycle
          </div>
          <h1 class="text-3xl md:text-4xl font-extrabold mb-3">Prediction Questions</h1>
          <p class="text-white/80 max-w-xl mx-auto mb-6">High-frequency questions sourced from APEUni, Gurully, StormEduGo, and other top PTE platforms. These questions appear most often in real exams.</p>
          <div class="flex flex-wrap justify-center gap-3">
            ${Object.entries(sourceCounts).map(([src, count]) => `
              <span class="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold">${src}: ${count} Qs</span>
            `).join('')}
          </div>
          <p class="mt-4 text-2xl font-bold">${totalPredictions} Total Prediction Questions</p>
        </div>
      </section>

      <!-- Info banner -->
      <div class="max-w-4xl mx-auto px-4 -mt-6">
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 flex flex-col md:flex-row items-center gap-4">
          <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div class="flex-1 text-center md:text-left">
            <p class="text-sm text-gray-700 font-medium">These are <strong>prediction questions</strong> — high-frequency items recalled from real exams.</p>
            <p class="text-xs text-gray-400 mt-0.5">Each question shows its source platform and frequency rating. Practice these for the best exam preparation.</p>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <span class="text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-700">Very High</span>
            <span class="text-xs font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-700">High</span>
          </div>
        </div>
      </div>

      <!-- Question type cards -->
      <div class="max-w-4xl mx-auto px-4 py-10">
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          ${types.map(t => {
            const count = typeCounts[t.id];
            if (count === 0) return '';

            // Count by frequency
            const preds = predictions[t.id] || [];
            const veryHigh = preds.filter(q => q.frequency === 'very-high').length;
            const high = preds.filter(q => q.frequency === 'high').length;

            return `
            <a href="#/predictions/${t.id}" class="block group">
              <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all duration-300 hover:-translate-y-1">
                <div class="flex items-start justify-between mb-4">
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style="background:${t.colorLight}">
                    ${t.icon}
                  </div>
                  <span class="text-lg font-bold text-orange-600">${count}</span>
                </div>
                <h3 class="font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">${t.name}</h3>
                <p class="text-sm text-gray-500 mb-3">${t.description}</p>
                <div class="flex items-center gap-2 mb-2">
                  ${veryHigh > 0 ? `<span class="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">${veryHigh} Very High</span>` : ''}
                  ${high > 0 ? `<span class="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">${high} High</span>` : ''}
                </div>
                <div class="text-xs text-gray-400">
                  Sources: ${[...new Set(preds.map(q => q.source).filter(Boolean))].join(', ')}
                </div>
              </div>
            </a>`;
          }).join('')}
        </div>
      </div>
    </main>`;
  },

  // ── Mock Test Selection Page ─────────────────────────────────
  mockTest() {
    const configs = PTE.Exam ? PTE.Exam.CONFIGS : {};
    const recentMocks = PTE.Store.getAll().sessions.filter(s => s.type === 'mock-test').slice(0, 5);

    let recentHtml = '';
    if (recentMocks.length > 0) {
      recentHtml = `
      <div class="mt-10">
        <h3 class="font-bold text-gray-800 mb-4">Recent Mock Tests</h3>
        <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div class="divide-y divide-gray-50">
            ${recentMocks.map(s => {
              const band = PTE.Scoring.getBand(s.overallScore);
              return `
              <div class="px-6 py-3 flex items-center gap-4">
                <div class="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-lg">🎯</div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-800">${s.transcript || 'Mock Test'}</p>
                  <p class="text-xs text-gray-400">${s.date}</p>
                </div>
                <span class="text-sm font-bold" style="color:${band.color}">${s.overallScore}/90</span>
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>`;
    }

    return `
    ${PTE.UI.navbar('mock-test')}
    <main class="min-h-screen bg-gray-50 py-10 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Speaking Mock Test</h1>
          <p class="text-gray-500">Simulate the real PTE Academic Speaking test. Questions auto-advance with exam timing — no pausing allowed. Get your score at the end.</p>
        </div>

        <!-- Exam rules -->
        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8">
          <h3 class="font-bold text-amber-800 text-sm mb-2 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
            Exam Conditions
          </h3>
          <ul class="space-y-1.5 text-xs text-amber-700">
            <li class="flex items-start gap-2"><span class="text-amber-400 mt-0.5">&#9632;</span>Questions auto-advance — you cannot pause or go back</li>
            <li class="flex items-start gap-2"><span class="text-amber-400 mt-0.5">&#9632;</span>Each question has fixed preparation and recording time</li>
            <li class="flex items-start gap-2"><span class="text-amber-400 mt-0.5">&#9632;</span>No feedback is shown during the test — scores appear at the end</li>
            <li class="flex items-start gap-2"><span class="text-amber-400 mt-0.5">&#9632;</span>Ensure your microphone is working and you are in a quiet environment</li>
            <li class="flex items-start gap-2"><span class="text-amber-400 mt-0.5">&#9632;</span>Use Chrome browser for best speech recognition support</li>
          </ul>
        </div>

        <!-- Test type cards -->
        <div class="grid md:grid-cols-3 gap-5">
          ${Object.values(configs).map(cfg => {
            const totalQ = cfg.sections.reduce((s, sec) => s + sec.count, 0);
            return `
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300">
              <div class="flex items-start justify-between mb-4">
                <span class="text-4xl">${cfg.icon}</span>
                <span class="text-xs font-bold px-2.5 py-1 rounded-full text-white" style="background:${cfg.color}">${cfg.duration}</span>
              </div>
              <h3 class="font-bold text-gray-900 text-lg mb-1">${cfg.name}</h3>
              <p class="text-sm text-gray-500 mb-4">${cfg.description}</p>
              <div class="space-y-1 mb-5">
                ${cfg.sections.map(sec => `
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-gray-500">${sec.label}</span>
                    <span class="font-medium text-gray-700">${sec.count} Q${sec.count > 1 ? 's' : ''}</span>
                  </div>
                `).join('')}
                <div class="flex items-center justify-between text-xs pt-1 border-t border-gray-100 mt-2">
                  <span class="font-semibold text-gray-700">Total</span>
                  <span class="font-bold text-gray-900">${totalQ} Questions</span>
                </div>
              </div>
              <button onclick="PTE.Exam.start('${cfg.id}')" 
                class="w-full inline-flex items-center justify-center gap-2 font-semibold text-sm px-5 py-3 rounded-xl text-white transition-all hover:opacity-90 shadow-lg" style="background:${cfg.color};box-shadow:0 4px 14px ${cfg.color}33">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Start Test
              </button>
            </div>`;
          }).join('')}
        </div>

        ${recentHtml}
      </div>
    </main>`;
  }
};
