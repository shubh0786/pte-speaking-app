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

    let statsSection = '';
    if (overall) {
      statsSection = `
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
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
          <p class="text-3xl font-bold text-amber-600">${overall.streak}</p>
          <p class="text-xs text-gray-400 mt-1">Day Streak</p>
        </div>
      </div>`;
    }

    return `
    ${PTE.UI.navbar('home')}
    <main class="min-h-screen">
      <!-- Hero Section -->
      <section class="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.07%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>
        <div class="relative max-w-4xl mx-auto px-4 py-20 md:py-28 text-center">
          <div class="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
            <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            2025/2026 Predictions from APEUni, Gurully, StormEduGo + AI Feedback
          </div>
          <h1 class="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Crack PTE <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">Speaking</span>
          </h1>
          <p class="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Practice all 7 speaking question types with prediction questions, AI scoring, tone/pitch analysis, and detailed improvement strategies.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#/mock-test" class="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 font-bold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-900/20 hover:shadow-2xl hover:-translate-y-0.5">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Take Mock Test
            </a>
            <a href="#/practice" class="inline-flex items-center justify-center gap-2 bg-white/15 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-xl hover:bg-white/25 transition-all border border-white/20">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Practice by Type
            </a>
          </div>
        </div>
      </section>

      ${statsSection ? `<section class="py-12 px-4 bg-gray-50">${statsSection}</section>` : ''}

      <!-- Question Types Preview -->
      <section class="py-16 px-4">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-3">All Speaking Question Types</h2>
            <p class="text-gray-500 max-w-xl mx-auto">Practice every PTE Academic speaking task, including the new 2025 question types: Summarize Group Discussion and Respond to a Situation.</p>
          </div>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            ${Object.values(PTE.QUESTION_TYPES).map(t => PTE.UI.typeCard(t)).join('')}
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-16 px-4 bg-gray-50">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-3">Why Practice Here?</h2>
          </div>
          <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="text-center">
              <div class="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <h3 class="font-bold text-gray-900 mb-2">Prediction Questions</h3>
              <p class="text-sm text-gray-500">High-frequency questions sourced from APEUni, Gurully, StormEduGo, and PTE Hub. Updated for the 2025/2026 exam cycle.</p>
            </div>
            <div class="text-center">
              <div class="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
              </div>
              <h3 class="font-bold text-gray-900 mb-2">AI-Powered Feedback</h3>
              <p class="text-sm text-gray-500">Get detailed feedback with word-by-word analysis, keyword coverage, specific improvement strategies, and personalized practice exercises.</p>
            </div>
            <div class="text-center">
              <div class="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>
              </div>
              <h3 class="font-bold text-gray-900 mb-2">Tone & Pitch Analysis</h3>
              <p class="text-sm text-gray-500">Real-time voice analysis tracks your pitch, volume, and intonation patterns. See exactly how to make your speech more natural and engaging.</p>
            </div>
          </div>
          <div class="grid md:grid-cols-3 gap-8">
            <div class="text-center">
              <div class="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
              </div>
              <h3 class="font-bold text-gray-900 mb-2">Progress Tracking</h3>
              <p class="text-sm text-gray-500">Track scores over time, see trends by question type, identify weak areas, and watch your improvement.</p>
            </div>
            <div class="text-center">
              <div class="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h3 class="font-bold text-gray-900 mb-2">Skip Prep & Flexible Timing</h3>
              <p class="text-sm text-gray-500">Skip preparation time when you're ready, or use the full exam-realistic timing. Practice at your own pace.</p>
            </div>
            <div class="text-center">
              <div class="w-14 h-14 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-7 h-7 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
              </div>
              <h3 class="font-bold text-gray-900 mb-2">PTE-Specific Strategies</h3>
              <p class="text-sm text-gray-500">Get proven exam strategies for each question type: APEUni Method 258 for Repeat Sentence, templates for Describe Image, and more.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-white border-t border-gray-100 py-8 px-4 text-center">
        <div class="space-y-2">
          <p class="text-sm font-semibold text-gray-600">Crack PTE</p>
          <p class="text-xs text-gray-400">Designed and Developed by <span class="font-semibold text-gray-600">Sanjay Singh And Sons Solutions</span></p>
          <p class="text-xs text-gray-300">Built for exam preparation. Not affiliated with Pearson.</p>
        </div>
      </footer>
    </main>`;
  },

  // ── Practice Selection Page ──────────────────────────────────
  practice() {
    return `
    ${PTE.UI.navbar('practice')}
    <main class="min-h-screen bg-gray-50 py-10 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="mb-10">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Choose a Question Type</h1>
          <p class="text-gray-500">Select a speaking task to begin practicing. Each type mirrors the real PTE Academic exam format.</p>
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
