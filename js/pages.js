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
    const user = PTE.Auth ? PTE.Auth.getCurrentUser() : null;

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
          ${user ? `<p class="text-lg text-indigo-300 font-semibold mb-2">Welcome back, ${user.username}!</p>` : ''}
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

      <!-- Onboarding Checklist (first-time users) -->
      ${(() => {
        if (!overall || overall.totalAttempts < 10) {
          const hasRA = stats['read-aloud'] && stats['read-aloud'].totalAttempts > 0;
          const hasMock = PTE.Store.getAll().sessions.some(s => s.type === 'mock-test');
          const hasMultiType = Object.values(PTE.QUESTION_TYPES).filter(t => stats[t.id] && stats[t.id].totalAttempts > 0).length >= 3;
          const score70 = overall && overall.bestScore >= 70;
          const allDone = hasRA && hasMock && hasMultiType && score70;
          if (allDone) return '';
          
          return `
          <section class="px-4 py-4">
            <div class="max-w-4xl mx-auto onboarding-card">
              <div class="relative">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-bold text-white flex items-center gap-2">
                    <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                    Getting Started
                  </h3>
                  <button onclick="localStorage.setItem('crackpte_onboarding_hidden','1');this.closest('section').remove()" class="text-xs text-gray-500 hover:text-gray-300 transition-colors">Dismiss</button>
                </div>
                <p class="text-sm text-gray-400 mb-4">Complete these steps to get the most out of Crack PTE:</p>
                <div class="space-y-3">
                  <a href="#/practice/read-aloud" class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                    <div class="onboarding-check ${hasRA ? 'done' : ''}">
                      ${hasRA ? '<svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>' : '<span class="text-xs text-gray-500">1</span>'}
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-semibold ${hasRA ? 'text-gray-500 line-through' : 'text-white group-hover:text-indigo-400'} transition-colors">Complete your first Read Aloud</p>
                      <p class="text-xs text-gray-500">The most common PTE Speaking question type</p>
                    </div>
                    ${!hasRA ? '<svg class="w-4 h-4 text-gray-600 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>' : ''}
                  </a>
                  <a href="#/practice" class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                    <div class="onboarding-check ${hasMultiType ? 'done' : ''}">
                      ${hasMultiType ? '<svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>' : '<span class="text-xs text-gray-500">2</span>'}
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-semibold ${hasMultiType ? 'text-gray-500 line-through' : 'text-white group-hover:text-indigo-400'} transition-colors">Try 3 different question types</p>
                      <p class="text-xs text-gray-500">Explore the variety of PTE Speaking tasks</p>
                    </div>
                    ${!hasMultiType ? '<svg class="w-4 h-4 text-gray-600 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>' : ''}
                  </a>
                  <a href="#/mock-test" class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                    <div class="onboarding-check ${hasMock ? 'done' : ''}">
                      ${hasMock ? '<svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>' : '<span class="text-xs text-gray-500">3</span>'}
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-semibold ${hasMock ? 'text-gray-500 line-through' : 'text-white group-hover:text-indigo-400'} transition-colors">Take your first Mock Test</p>
                      <p class="text-xs text-gray-500">Simulate the real exam experience</p>
                    </div>
                    ${!hasMock ? '<svg class="w-4 h-4 text-gray-600 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>' : ''}
                  </a>
                  <div class="flex items-center gap-3 p-3 rounded-xl">
                    <div class="onboarding-check ${score70 ? 'done' : ''}">
                      ${score70 ? '<svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>' : '<span class="text-xs text-gray-500">4</span>'}
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-semibold ${score70 ? 'text-gray-500 line-through' : 'text-white'} transition-colors">Score 70+ on any question</p>
                      <p class="text-xs text-gray-500">Aim for a high score to build confidence</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>`;
        }
        return '';
      })()}

      <!-- Action Cards Row -->
      <section class="px-4 py-6">
        <div class="max-w-4xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${PTE.Daily ? PTE.Daily.renderCard() : ''}
          ${PTE.Planner ? PTE.Planner.renderCard() : ''}
          ${PTE.Spaced ? PTE.Spaced.renderCard() : ''}
        </div>
      </section>

      ${statsSection ? `<section class="py-4 px-4">${statsSection}</section>` : ''}

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
      <main class="min-h-screen py-10 px-4">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-3xl font-bold text-white mb-8">Your Progress</h1>
          ${PTE.UI.emptyState('📊', 'No Practice Sessions Yet', 'Start practicing to see your progress here. Your scores and statistics will be tracked automatically.', 'Start Practicing', '#/practice')}
        </div>
      </main>`;
    }

    // Type-by-type breakdown
    let typeBreakdown = '';
    Object.values(PTE.QUESTION_TYPES).forEach(type => {
      const typeStat = stats[type.id];
      if (typeStat) {
        typeBreakdown += `
        <div class="glass rounded-xl p-4 flex items-center gap-4 card-shine">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style="background:${type.color}22">${type.icon}</div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <h4 class="font-semibold text-gray-200 text-sm truncate">${type.name}</h4>
              <span class="text-sm font-bold text-indigo-400">${typeStat.averageScore}/90</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div class="h-full rounded-full" style="width:${(typeStat.averageScore/90)*100}%;background:${type.color}"></div>
              </div>
              <span class="text-xs text-gray-500 flex-shrink-0">${typeStat.totalAttempts} tries</span>
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
      <div class="glass rounded-2xl overflow-hidden neon-border">
        <div class="px-6 py-4 border-b border-white/5">
          <h3 class="font-bold text-white">Recent Sessions</h3>
        </div>
        <div class="divide-y divide-white/5">
          ${recentSessions.map(s => {
            const typeConfig = Object.values(PTE.QUESTION_TYPES).find(t => t.id === s.type);
            const band = PTE.Scoring.getBand(s.overallScore);
            return `
            <div class="px-6 py-3 flex items-center gap-4 hover:bg-white/5 transition-colors">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style="background:${typeConfig ? typeConfig.color + '22' : 'rgba(255,255,255,0.05)'}">${typeConfig ? typeConfig.icon : '?'}</div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-200 truncate">${typeConfig ? typeConfig.name : s.type}</p>
                <p class="text-xs text-gray-500">${s.date}</p>
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
    <main class="min-h-screen py-10 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-3xl font-bold text-white">Your Progress</h1>
          <button onclick="if(confirm('Clear all progress data?')){PTE.Store.clearAll();PTE.Router.navigate(location.hash.slice(1));}" 
            class="text-xs text-gray-500 hover:text-red-400 transition-colors">Clear Data</button>
        </div>

        <!-- Overall Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 stagger">
          <div class="glass rounded-2xl p-5 text-center card-3d">
            <p class="text-3xl font-bold text-indigo-400">${overall.totalAttempts}</p>
            <p class="text-xs text-gray-500 mt-1">Total Attempts</p>
          </div>
          <div class="glass rounded-2xl p-5 text-center card-3d">
            <p class="text-3xl font-bold text-emerald-400">${overall.averageScore}</p>
            <p class="text-xs text-gray-500 mt-1">Average Score</p>
          </div>
          <div class="glass rounded-2xl p-5 text-center card-3d">
            <p class="text-3xl font-bold text-purple-400">${overall.bestScore}</p>
            <p class="text-xs text-gray-500 mt-1">Best Score</p>
          </div>
          <div class="glass rounded-2xl p-5 text-center card-3d">
            <p class="text-3xl font-bold text-amber-400">${practiceMinutes}<span class="text-lg">m</span></p>
            <p class="text-xs text-gray-500 mt-1">Practice Time</p>
          </div>
        </div>

        <!-- Type Breakdown -->
        <div class="mb-8">
          <h3 class="font-bold text-white mb-4">Score by Question Type</h3>
          <div class="space-y-3">
            ${typeBreakdown || '<p class="text-gray-500 text-sm">No data yet</p>'}
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
      <main class="min-h-screen py-10 px-4">
        <div class="max-w-4xl mx-auto">
          ${PTE.UI.emptyState('🔍', 'Question Type Not Found', 'The requested question type does not exist.', 'Browse Question Types', backUrl)}
          <div class="text-center mt-4">
            <a href="${backUrl}" class="text-indigo-400 font-medium hover:text-indigo-300">Back</a>
          </div>
        </div>
      </main>`;
    }

    const questions = isPred ? (PTE.Predictions[typeId] || []) : (PTE.Questions[typeId] || []);
    if (questions.length === 0) {
      return `
      ${PTE.UI.navbar(navPage)}
      <main class="min-h-screen py-10 px-4">
        <div class="max-w-4xl mx-auto">
          ${PTE.UI.emptyState('📝', 'No Questions Available', 'Questions for this type are coming soon.', 'Back to Practice', backUrl)}
        </div>
      </main>`;
    }

    return `
    ${PTE.UI.navbar(navPage)}
    <main class="min-h-screen py-8 px-4">
      <div class="max-w-3xl mx-auto">
        ${isPred ? '<div class="mb-4 inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> Prediction Questions Only</div>' : ''}
        <!-- Header -->
        <div class="flex items-center gap-4 mb-6">
          <a href="${backUrl}" class="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </a>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xl">${typeConfig.icon}</span>
              <h1 class="text-xl font-bold text-white">${typeConfig.name}</h1>
              <span class="text-xs font-bold px-2 py-0.5 rounded-full" style="background:${typeConfig.color}22;color:${typeConfig.color}">${typeConfig.shortName}</span>
            </div>
            <p class="text-sm text-gray-500">${typeConfig.description}</p>
          </div>
        </div>

        <!-- Tips (collapsible) -->
        <details class="mb-6">
          <summary class="cursor-pointer text-sm font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5 hover:bg-amber-500/15 transition-colors">
            Show Tips for ${typeConfig.name}
          </summary>
          <div class="mt-2">
            ${PTE.UI.tipsPanel(typeConfig.tips)}
          </div>
        </details>

        <!-- Question Navigation with Completion Status -->
        ${(() => {
          const completionMap = PTE.Store.getCompletionMap(typeId);
          const completedCount = questions.filter(q => completionMap[q.id]).length;
          return `
          <div class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-500">Question</span>
                <select id="question-select" class="input-dark text-sm !w-auto !py-1.5 !px-3" onchange="PTE.App.loadQuestion(this.value)">
                  ${questions.map((q, i) => {
                    const done = completionMap[q.id];
                    const badge = done ? `\u2713 ${done.bestScore}/90` : '';
                    return `<option value="${i}">${done ? '\u2713 ' : ''}Q${i + 1}${done ? ' — ' + done.bestScore + '/90' : ''}</option>`;
                  }).join('')}
                </select>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-xs text-gray-600">${completedCount}/${questions.length} done</span>
                <button id="btn-skip" onclick="PTE.App.nextQuestion()" class="text-sm text-gray-500 hover:text-indigo-400 font-medium transition-colors">
                  Skip →
                </button>
              </div>
            </div>
            <!-- Progress dots -->
            <div class="flex gap-1 flex-wrap">
              ${questions.map((q, i) => {
                const done = completionMap[q.id];
                if (done) {
                  const scoreColor = done.bestScore >= 65 ? 'bg-emerald-500' : done.bestScore >= 45 ? 'bg-amber-500' : 'bg-red-500';
                  return `<button onclick="PTE.App.loadQuestion(${i})" class="w-7 h-7 rounded-lg ${scoreColor} text-white text-xs font-bold flex items-center justify-center hover:opacity-80 transition-opacity" title="Q${i+1}: Best ${done.bestScore}/90 (${done.attempts} attempt${done.attempts > 1 ? 's' : ''})">${i+1}</button>`;
                }
                return `<button onclick="PTE.App.loadQuestion(${i})" class="w-7 h-7 rounded-lg bg-white/10 text-gray-500 text-xs font-medium flex items-center justify-center hover:bg-white/20 transition-colors" title="Q${i+1}: Not attempted">${i+1}</button>`;
              }).join('')}
            </div>
          </div>`;
        })()}

        <!-- Previous Answer Section (shown for completed questions) -->
        <div id="previous-answer" class="mb-4 hidden">
          <!-- Dynamically populated by PTE.App.showQuestionContent -->
        </div>

        <!-- Practice Flow Stepper -->
        <div id="stepper-area" class="mb-4 hidden">
          <!-- Dynamically updated by PTE.App -->
        </div>

        <!-- Practice Area -->
        <div id="practice-area" class="glass rounded-2xl overflow-hidden neon-border">
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
    <main class="min-h-screen bg-orbs">
      <div class="bg-orb-extra"></div>
      <!-- Hero -->
      <section class="relative overflow-hidden px-4 py-12 md:py-16">
        <div class="absolute inset-0 bg-gradient-to-b from-amber-900/20 via-transparent to-transparent pointer-events-none"></div>
        <div class="relative max-w-4xl mx-auto text-center">
          <div class="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/20 px-4 py-2 rounded-full text-sm mb-4 text-amber-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            Updated for PTE 2025/2026 Exam Cycle
          </div>
          <h1 class="text-3xl md:text-4xl font-extrabold text-white mb-3">Prediction Questions</h1>
          <p class="text-gray-400 max-w-xl mx-auto mb-6">High-frequency questions sourced from APEUni, Gurully, StormEduGo, and other top PTE platforms.</p>
          <div class="flex flex-wrap justify-center gap-3">
            ${Object.entries(sourceCounts).map(([src, count]) => `
              <span class="bg-white/5 border border-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-gray-300">${src}: ${count} Qs</span>
            `).join('')}
          </div>
          <p class="mt-4 text-2xl font-bold text-amber-400">${totalPredictions} Total Prediction Questions</p>
        </div>
      </section>

      <!-- Info banner -->
      <div class="max-w-4xl mx-auto px-4 -mt-4 relative z-10">
        <div class="glass-premium rounded-2xl p-5 flex flex-col md:flex-row items-center gap-4">
          <div class="w-12 h-12 bg-amber-500/15 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div class="flex-1 text-center md:text-left">
            <p class="text-sm text-gray-200 font-medium">These are <strong class="text-white">prediction questions</strong> — high-frequency items recalled from real exams.</p>
            <p class="text-xs text-gray-500 mt-0.5">Each question shows its source platform and frequency rating.</p>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <span class="text-xs font-semibold px-2 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">Very High</span>
            <span class="text-xs font-semibold px-2 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">High</span>
          </div>
        </div>
      </div>

      <!-- Question type cards -->
      <div class="max-w-4xl mx-auto px-4 py-10 relative z-10">
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
          ${types.map(t => {
            const count = typeCounts[t.id];
            if (count === 0) return '';

            const preds = predictions[t.id] || [];
            const veryHigh = preds.filter(q => q.frequency === 'very-high').length;
            const high = preds.filter(q => q.frequency === 'high').length;

            return `
            <a href="#/predictions/${t.id}" class="block group">
              <div class="glass glass-hover rounded-2xl p-6 card-shine">
                <div class="flex items-start justify-between mb-4">
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style="background:${t.color}22">
                    ${t.icon}
                  </div>
                  <span class="text-lg font-bold text-amber-400">${count}</span>
                </div>
                <h3 class="font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">${t.name}</h3>
                <p class="text-sm text-gray-500 mb-3">${t.description}</p>
                <div class="flex items-center gap-2 mb-2">
                  ${veryHigh > 0 ? `<span class="text-xs font-medium px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">${veryHigh} Very High</span>` : ''}
                  ${high > 0 ? `<span class="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">${high} High</span>` : ''}
                </div>
                <div class="text-xs text-gray-600">
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
        <h3 class="font-bold text-white mb-4">Recent Mock Tests</h3>
        <div class="glass rounded-2xl overflow-hidden neon-border">
          <div class="divide-y divide-white/5">
            ${recentMocks.map(s => {
              const band = PTE.Scoring.getBand(s.overallScore);
              return `
              <div class="px-6 py-3 flex items-center gap-4 hover:bg-white/5 transition-colors">
                <div class="w-10 h-10 rounded-lg bg-indigo-500/15 flex items-center justify-center text-lg">🎯</div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-200">${s.transcript || 'Mock Test'}</p>
                  <p class="text-xs text-gray-500">${s.date}</p>
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
    <main class="min-h-screen py-10 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-white mb-2">Speaking Mock Test</h1>
          <p class="text-gray-400">Simulate the real PTE Academic Speaking test. Questions auto-advance with exam timing — no pausing allowed.</p>
        </div>

        <!-- Exam rules -->
        <div class="glass rounded-2xl p-5 mb-8 border border-amber-500/20">
          <h3 class="font-bold text-amber-400 text-sm mb-2 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
            Exam Conditions
          </h3>
          <ul class="space-y-1.5 text-xs text-amber-300/80">
            <li class="flex items-start gap-2"><span class="text-amber-500 mt-0.5">&#9632;</span>Questions auto-advance — you cannot pause or go back</li>
            <li class="flex items-start gap-2"><span class="text-amber-500 mt-0.5">&#9632;</span>Each question has fixed preparation and recording time</li>
            <li class="flex items-start gap-2"><span class="text-amber-500 mt-0.5">&#9632;</span>No feedback is shown during the test — scores appear at the end</li>
            <li class="flex items-start gap-2"><span class="text-amber-500 mt-0.5">&#9632;</span>Ensure your microphone is working and you are in a quiet environment</li>
            <li class="flex items-start gap-2"><span class="text-amber-500 mt-0.5">&#9632;</span>Use Chrome browser for best speech recognition support</li>
          </ul>
        </div>

        <!-- Test type cards -->
        <div class="grid md:grid-cols-3 gap-5 stagger">
          ${Object.values(configs).map(cfg => {
            const totalQ = cfg.sections.reduce((s, sec) => s + sec.count, 0);
            return `
            <div class="glass glass-hover rounded-2xl p-6 card-shine">
              <div class="flex items-start justify-between mb-4">
                <span class="text-4xl">${cfg.icon}</span>
                <span class="text-xs font-bold px-2.5 py-1 rounded-full text-white" style="background:${cfg.color}">${cfg.duration}</span>
              </div>
              <h3 class="font-bold text-white text-lg mb-1">${cfg.name}</h3>
              <p class="text-sm text-gray-500 mb-4">${cfg.description}</p>
              <div class="space-y-1 mb-5">
                ${cfg.sections.map(sec => `
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-gray-500">${sec.label}</span>
                    <span class="font-medium text-gray-300">${sec.count} Q${sec.count > 1 ? 's' : ''}</span>
                  </div>
                `).join('')}
                <div class="flex items-center justify-between text-xs pt-1 border-t border-white/10 mt-2">
                  <span class="font-semibold text-gray-300">Total</span>
                  <span class="font-bold text-white">${totalQ} Questions</span>
                </div>
              </div>
              <button onclick="PTE.Exam.start('${cfg.id}')" 
                class="w-full inline-flex items-center justify-center gap-2 font-semibold text-sm px-5 py-3 rounded-xl text-white transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-lg" style="background:${cfg.color};box-shadow:0 4px 14px ${cfg.color}33">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Start Test
              </button>
            </div>`;
          }).join('')}
        </div>

        ${recentHtml}
      </div>
    </main>`;
  },

  // ── Login Page ──────────────────────────────────────────────
  login() {
    return `
    <div class="min-h-screen flex flex-col">
      <!-- Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-purple-900/30 to-transparent pointer-events-none"></div>
      <div class="absolute inset-0 pointer-events-none" style="background:radial-gradient(circle at 30% 20%, rgba(99,102,241,0.15) 0%, transparent 50%),radial-gradient(circle at 70% 80%, rgba(168,85,247,0.1) 0%, transparent 50%)"></div>

      <div class="relative flex-1 flex items-center justify-center px-4 py-12">
        <div class="w-full max-w-md">
          <!-- Logo & Header -->
          <div class="text-center mb-8">
            <img src="img/logo.png" alt="Crack PTE" class="h-16 mx-auto mb-4 rounded-2xl animate-float">
            <h1 class="text-3xl font-extrabold text-white mb-2">Welcome Back</h1>
            <p class="text-gray-400">Sign in to continue your PTE journey</p>
          </div>

          <!-- Login Card -->
          <div class="glass neon-border rounded-2xl p-8">
            <div id="login-error" class="hidden mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/20 text-red-400 text-sm font-medium" role="alert" aria-live="polite"></div>

            <form onsubmit="PTE.Auth._handleLogin(event)" class="space-y-5">
              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/></svg>
                  </div>
                  <input type="email" id="login-email" required placeholder="your@email.com"
                    class="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all">
                </div>
              </div>

              <!-- Password -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  </div>
                  <input type="password" id="login-password" required placeholder="Enter your password"
                    class="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all">
                  <button type="button" onclick="PTE.Auth._togglePassword('login-password', this)" class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  </button>
                </div>
              </div>

              <!-- Submit -->
              <button type="submit" id="login-btn"
                class="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-xl shadow-indigo-500/20 hover:-translate-y-0.5">
                Sign In
              </button>
            </form>

            <!-- Divider -->
            <div class="mt-6 pt-6 border-t border-white/10 text-center">
              <p class="text-gray-400 text-sm">
                Don't have an account?
                <a href="#/signup" class="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors ml-1">Create Account</a>
              </p>
            </div>
          </div>

          <!-- Footer -->
          <p class="text-center text-xs text-gray-600 mt-6">Your data is stored locally on this device.</p>
        </div>
      </div>
    </div>`;
  },

  // ── Sign Up Page ────────────────────────────────────────────
  signup() {
    return `
    <div class="min-h-screen flex flex-col">
      <!-- Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-indigo-900/30 to-transparent pointer-events-none"></div>
      <div class="absolute inset-0 pointer-events-none" style="background:radial-gradient(circle at 70% 20%, rgba(168,85,247,0.15) 0%, transparent 50%),radial-gradient(circle at 30% 80%, rgba(99,102,241,0.1) 0%, transparent 50%)"></div>

      <div class="relative flex-1 flex items-center justify-center px-4 py-12">
        <div class="w-full max-w-md">
          <!-- Logo & Header -->
          <div class="text-center mb-8">
            <img src="img/logo.png" alt="Crack PTE" class="h-16 mx-auto mb-4 rounded-2xl animate-float">
            <h1 class="text-3xl font-extrabold text-white mb-2">Create Account</h1>
            <p class="text-gray-400">Start tracking your PTE progress today</p>
          </div>

          <!-- Signup Card -->
          <div class="glass neon-border rounded-2xl p-8">
            <div id="signup-error" class="hidden mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/20 text-red-400 text-sm font-medium" role="alert" aria-live="polite"></div>

            <form onsubmit="PTE.Auth._handleSignup(event)" class="space-y-5">
              <!-- Username -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Username</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  </div>
                  <input type="text" id="signup-username" required placeholder="Choose a username" minlength="2" maxlength="30"
                    class="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all">
                </div>
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/></svg>
                  </div>
                  <input type="email" id="signup-email" required placeholder="your@email.com"
                    class="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all">
                </div>
              </div>

              <!-- Password -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  </div>
                  <input type="password" id="signup-password" required placeholder="Create a password (min 4 chars)" minlength="4"
                    class="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all">
                  <button type="button" onclick="PTE.Auth._togglePassword('signup-password', this)" class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  </button>
                </div>
              </div>

              <!-- Confirm Password -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                  </div>
                  <input type="password" id="signup-confirm" required placeholder="Re-enter your password"
                    class="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all">
                </div>
              </div>

              <!-- Submit -->
              <button type="submit" id="signup-btn"
                class="w-full py-3.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-xl shadow-purple-500/20 hover:-translate-y-0.5">
                Create Account
              </button>
            </form>

            <!-- Divider -->
            <div class="mt-6 pt-6 border-t border-white/10 text-center">
              <p class="text-gray-400 text-sm">
                Already have an account?
                <a href="#/login" class="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors ml-1">Sign In</a>
              </p>
            </div>
          </div>

          <!-- Footer -->
          <p class="text-center text-xs text-gray-600 mt-6">Your data is stored locally on this device.</p>
        </div>
      </div>
    </div>`;
  },

  // ── Profile / Account Page ──────────────────────────────────
  profile() {
    const user = PTE.Auth.getCurrentUser();
    if (!user) {
      location.hash = '#/login';
      return '';
    }

    const initials = PTE.Auth.getInitials(user.username);
    const stats = PTE.Store.getStats();
    const overall = stats.overall || null;
    const gp = PTE.Gamify ? PTE.Gamify.getProgress() : null;

    let statsCards = '';
    if (overall) {
      statsCards = `
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="glass rounded-2xl p-5 text-center"><p class="text-3xl font-bold text-indigo-400">${overall.totalAttempts}</p><p class="text-xs text-gray-500 mt-1">Questions Done</p></div>
        <div class="glass rounded-2xl p-5 text-center"><p class="text-3xl font-bold text-emerald-400">${overall.averageScore}</p><p class="text-xs text-gray-500 mt-1">Avg Score</p></div>
        <div class="glass rounded-2xl p-5 text-center"><p class="text-3xl font-bold text-purple-400">${overall.bestScore}</p><p class="text-xs text-gray-500 mt-1">Best Score</p></div>
        <div class="glass rounded-2xl p-5 text-center"><p class="text-3xl font-bold text-amber-400">${overall.streak || 0}</p><p class="text-xs text-gray-500 mt-1">Day Streak</p></div>
      </div>`;
    }

    let badgesHtml = '';
    if (gp && gp.badges.length > 0) {
      badgesHtml = `
      <div class="mb-8">
        <h3 class="text-lg font-bold text-white mb-4">Badges Earned</h3>
        <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
          ${gp.badges.map(b => `
            <div class="glass rounded-xl p-3 text-center group cursor-default" title="${b.name}: ${b.desc}">
              <span class="text-2xl block mb-1">${b.icon}</span>
              <p class="text-xs text-gray-400 truncate">${b.name}</p>
            </div>
          `).join('')}
        </div>
      </div>`;
    }

    return `
    ${PTE.UI.navbar('profile')}
    <main class="min-h-screen py-10 px-4">
      <div class="max-w-3xl mx-auto">

        <!-- Profile Header -->
        <div class="glass neon-border rounded-2xl p-8 mb-8">
          <div class="flex flex-col sm:flex-row items-center gap-6">
            <div class="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-xl" style="background:${user.avatarColor}">
              ${initials}
            </div>
            <div class="flex-1 text-center sm:text-left">
              <h1 class="text-2xl font-extrabold text-white mb-1">${user.username}</h1>
              <p class="text-gray-400 text-sm mb-2">${user.email}</p>
              <div class="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                <span class="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">Member since ${user.createdDate}</span>
                ${gp ? `<span class="badge badge-level">${gp.level.icon} Level ${gp.level.level} — ${gp.level.title}</span>` : ''}
                ${gp ? `<span class="badge badge-xp">⚡ ${gp.xp} XP</span>` : ''}
              </div>
            </div>
          </div>
        </div>

        <!-- Stats -->
        ${statsCards}

        <!-- Badges -->
        ${badgesHtml}

        <!-- Edit Profile -->
        <div class="glass rounded-2xl p-6 mb-6">
          <h3 class="text-lg font-bold text-white mb-4">Edit Profile</h3>
          <div id="profile-msg" class="hidden mb-4 p-3 rounded-xl text-sm font-medium"></div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <div class="flex gap-3">
                <input type="text" id="profile-username" value="${user.username}" maxlength="30"
                  class="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all">
                <button onclick="PTE.Auth._handleUpdateProfile()" class="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Change Password -->
        <div class="glass rounded-2xl p-6 mb-6">
          <h3 class="text-lg font-bold text-white mb-4">Change Password</h3>
          <div id="password-msg" class="hidden mb-4 p-3 rounded-xl text-sm font-medium"></div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
              <input type="password" id="current-password" placeholder="Enter current password"
                class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">New Password</label>
              <input type="password" id="new-password" placeholder="Enter new password (min 4 chars)"
                class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all">
            </div>
            <button onclick="PTE.Auth._handleChangePassword()" class="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
              Update Password
            </button>
          </div>
        </div>

        <!-- Data Management -->
        <div class="glass rounded-2xl p-6 mb-6">
          <h3 class="text-lg font-bold text-white mb-2">Data & Backup</h3>
          <p class="text-sm text-gray-500 mb-4">Your data is stored locally. Export it to create a backup you can import later.</p>
          <div id="data-msg" class="hidden mb-4 p-3 rounded-xl text-sm font-medium"></div>
          <div class="flex items-center gap-4 mb-3">
            <div class="flex-1 glass rounded-xl p-4 text-center">
              <p class="text-2xl font-bold text-indigo-400">${overall ? overall.totalAttempts : 0}</p>
              <p class="text-xs text-gray-500">Sessions saved</p>
            </div>
            <div class="flex-1 glass rounded-xl p-4 text-center">
              <p class="text-2xl font-bold text-purple-400">${gp ? gp.badges.length : 0}</p>
              <p class="text-xs text-gray-500">Badges earned</p>
            </div>
          </div>
          <div class="flex flex-wrap gap-3">
            <button onclick="PTE.App._exportData()" class="px-5 py-2.5 bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 font-semibold rounded-xl hover:bg-indigo-500/25 transition-colors text-sm flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              Export Data (JSON)
            </button>
            <label class="px-5 py-2.5 bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 font-semibold rounded-xl hover:bg-emerald-500/25 transition-colors text-sm flex items-center gap-2 cursor-pointer">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
              Import Data
              <input type="file" accept=".json" class="hidden" onchange="PTE.App._importData(event)">
            </label>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="glass rounded-2xl p-6 border border-red-500/20">
          <h3 class="text-lg font-bold text-red-400 mb-4">Account Actions</h3>
          <div class="flex flex-wrap gap-3">
            <button onclick="PTE.Auth.logout()" class="px-6 py-3 bg-red-500/15 border border-red-500/20 text-red-400 font-semibold rounded-xl hover:bg-red-500/25 transition-colors">
              Sign Out
            </button>
            <button onclick="if(confirm('Delete your account and ALL data? This cannot be undone.')){PTE.Auth._deleteAccount()}" class="px-6 py-3 bg-red-500/10 border border-red-500/15 text-red-500/70 font-semibold rounded-xl hover:bg-red-500/20 transition-colors text-sm">
              Delete Account
            </button>
          </div>
        </div>

      </div>
    </main>`;
  }
};
