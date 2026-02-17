/**
 * Crack PTE - Target Score & Personalized Recommendations
 * Set target score, get recommendations based on weak areas
 */
window.PTE = window.PTE || {};

PTE.TargetScore = {
  STORAGE_KEY: 'crackpte_target',

  getData() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || { target: null, setAt: null };
    } catch (e) { return { target: null, setAt: null }; }
  },

  save(data) {
    try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
  },

  getTarget() {
    return this.getData().target;
  },

  setTarget(score) {
    const data = this.getData();
    data.target = Math.min(90, Math.max(30, parseInt(score) || 65));
    data.setAt = Date.now();
    this.save(data);
    return data.target;
  },

  /**
   * Get personalized recommendations based on stats and target
   */
  getRecommendations() {
    const target = this.getTarget() || 65;
    const stats = PTE.Store ? PTE.Store.getStats() : {};
    const overall = stats.overall;
    const types = Object.values(PTE.QUESTION_TYPES || {});

    const recs = [];

    if (!overall || overall.totalAttempts < 3) {
      return {
        target,
        gap: target ? target - (overall?.averageScore || 0) : 0,
        message: 'Practice more to get personalized recommendations. Aim for at least 5 attempts across different question types.',
        recommendations: [
          { type: 'general', title: 'Build a baseline', detail: 'Complete 5+ practice questions to establish your current level.', priority: 1 },
          { type: 'general', title: 'Try all question types', detail: 'Each type has different scoring. Discover your strengths.', priority: 2 },
        ],
        weakTypes: [],
        strongTypes: [],
      };
    }

    const gap = target - overall.averageScore;

    // Find weak types (below target or lowest average)
    const typeStats = types
      .filter(t => stats[t.id])
      .map(t => ({ ...t, avg: stats[t.id].averageScore, attempts: stats[t.id].totalAttempts }))
      .sort((a, b) => a.avg - b.avg);

    const weakTypes = typeStats.filter(t => t.avg < target || t.avg < overall.averageScore - 10).slice(0, 3);
    const strongTypes = typeStats.filter(t => t.avg >= target && t.avg >= overall.averageScore).slice(-2);

    // High-impact types (RA, RS) - recommend if weak
    const highImpact = ['read-aloud', 'repeat-sentence'];
    weakTypes.forEach(wt => {
      if (highImpact.includes(wt.id)) {
        recs.push({
          type: wt.id,
          title: `Focus on ${wt.name}`,
          detail: `Your average is ${wt.avg}/90. This type has high exam weight. Practice 10+ questions.`,
          priority: 1,
          action: `#/practice/${wt.id}`,
        });
      }
    });

    // Lowest scoring type
    if (typeStats.length > 0 && typeStats[0].avg < target) {
      const lowest = typeStats[0];
      if (!recs.some(r => r.type === lowest.id)) {
        recs.push({
          type: lowest.id,
          title: `Improve ${lowest.name}`,
          detail: `Your lowest type (${lowest.avg}/90). Each point here helps your total.`,
          priority: 2,
          action: `#/practice/${lowest.id}`,
        });
      }
    }

    // Prediction questions
    if (gap > 5) {
      recs.push({
        type: 'predictions',
        title: 'Practice prediction questions',
        detail: 'High-frequency exam questions. Great for targeted improvement.',
        priority: 3,
        action: '#/predictions',
      });
    }

    // Mock test
    if (overall.totalAttempts >= 10 && gap <= 15) {
      recs.push({
        type: 'mock',
        title: 'Take a mock test',
        detail: 'Simulate exam conditions to see how you perform under pressure.',
        priority: 4,
        action: '#/mock-test',
      });
    }

    // Accent / weak words
    if (PTE.AccentAnalyzer) {
      const profile = PTE.AccentAnalyzer.getProfile();
      if (profile && profile.recentProblemWords && profile.recentProblemWords.length >= 3) {
        recs.push({
          type: 'accent',
          title: 'Drill weak words',
          detail: `${profile.recentProblemWords.length} words often mispronounced. Practice them to boost pronunciation scores.`,
          priority: 2,
          action: '#/weak-words',
        });
      }
    }

    // Sort by priority
    recs.sort((a, b) => a.priority - b.priority);

    let message = '';
    if (gap <= 0) {
      message = `You're meeting your target! Keep practicing to maintain consistency.`;
    } else if (gap <= 10) {
      message = `You're ${gap} points away from your target. Focus on your weak areas.`;
    } else {
      message = `You're ${gap} points away. Consistent practice on recommended types will help.`;
    }

    return {
      target,
      currentAvg: overall.averageScore,
      bestScore: overall.bestScore,
      gap,
      message,
      recommendations: recs.slice(0, 5),
      weakTypes,
      strongTypes,
    };
  },

  renderPage() {
    const data = this.getRecommendations();
    const target = data.target || 65;

    return `
    ${PTE.UI.navbar('target')}
    <main class="min-h-screen py-10 px-4">
      <div class="max-w-3xl mx-auto">

        <!-- Header -->
        <div class="text-center mb-8">
          <span class="text-5xl mb-3 block animate-float">🎯</span>
          <h1 class="text-3xl font-bold text-white mb-2">Target Score</h1>
          <p class="text-gray-500">Set your goal and get personalized practice recommendations.</p>
        </div>

        <!-- Target Score Card -->
        <div class="glass neon-border rounded-2xl p-6 mb-6">
          <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4">Your Target</h3>
          <div class="flex flex-col sm:flex-row items-center gap-6">
            <div class="flex items-center gap-4">
              <input type="number" id="target-input" value="${target}" min="30" max="90" step="5"
                class="w-24 text-center text-3xl font-extrabold bg-white/5 border border-white/10 rounded-xl py-3 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none">
              <span class="text-2xl text-gray-500">/ 90</span>
            </div>
            <button onclick="PTE.TargetScore._saveAndRefresh()" class="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all">
              Save Target
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-3">Common targets: 65 (study), 79 (immigration), 90 (maximum)</p>
        </div>

        <!-- Progress to Target -->
        ${data.currentAvg !== undefined ? `
        <div class="glass rounded-2xl p-6 mb-6">
          <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4">Progress to Target</h3>
          <div class="flex items-center justify-between mb-3">
            <span class="text-gray-400">Current avg</span>
            <span class="text-xl font-bold text-white">${data.currentAvg}/90</span>
          </div>
          <div class="h-3 bg-white/10 rounded-full overflow-hidden mb-2">
            <div class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700" style="width:${Math.min(100, (data.currentAvg / 90) * 100)}%"></div>
          </div>
          <div class="flex justify-between text-xs text-gray-500">
            <span>30</span>
            <span class="text-indigo-400 font-semibold">Target: ${target}</span>
            <span>90</span>
          </div>
          ${data.gap > 0 ? `<p class="mt-3 text-sm text-amber-400 font-medium">${data.message}</p>` : `<p class="mt-3 text-sm text-emerald-400 font-medium">${data.message}</p>`}
        </div>
        ` : ''}

        <!-- Recommendations -->
        <div class="glass rounded-2xl p-6 mb-6">
          <h3 class="text-lg font-bold text-white mb-4">Recommended Actions</h3>
          ${data.recommendations.length > 0 ? `
          <div class="space-y-3">
            ${data.recommendations.map((r, i) => `
            <a href="${r.action || '#'}" class="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/20 transition-all group">
              <span class="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold flex-shrink-0">${i + 1}</span>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-white group-hover:text-indigo-400 transition-colors">${r.title}</p>
                <p class="text-sm text-gray-500 mt-0.5">${r.detail}</p>
              </div>
              <svg class="w-5 h-5 text-gray-500 group-hover:text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </a>
            `).join('')}
          </div>
          ` : `
          <p class="text-gray-500">${data.message}</p>
          <a href="#/practice" class="inline-block mt-4 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all">Start Practicing</a>
          `}
        </div>

        <!-- Weak Types (if any) -->
        ${data.weakTypes && data.weakTypes.length > 0 ? `
        <div class="glass rounded-2xl p-6">
          <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4">Focus Areas</h3>
          <div class="space-y-2">
            ${data.weakTypes.map(wt => `
            <a href="#/practice/${wt.id}" class="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15 transition-all">
              <div class="flex items-center gap-3">
                <span class="text-xl">${wt.icon}</span>
                <span class="font-medium text-white">${wt.name}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-amber-400 font-bold">${wt.avg}/90</span>
                <span class="text-xs text-gray-500">${wt.attempts} attempts</span>
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </div>
            </a>
            `).join('')}
          </div>
        </div>
        ` : ''}

      </div>
    </main>`;
  },

  _saveAndRefresh() {
    const input = document.getElementById('target-input');
    if (input) {
      this.setTarget(input.value);
      if (PTE.App) PTE.App.renderPage('target');
    }
  },

  renderCard() {
    const target = this.getTarget() || 65;
    const recs = this.getRecommendations();
    const gap = recs.gap;
    const gapText = gap !== undefined && gap > 0 ? `${gap} pts to go` : gap === 0 ? 'On target!' : '';

    return `
    <a href="#/target" class="block">
      <div class="glass glass-hover rounded-2xl p-6 card-shine">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style="background:rgba(99,102,241,0.15)">🎯</div>
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-white mb-1">Target Score</h3>
            <p class="text-sm text-gray-500">Target: ${target}/90 ${gapText ? '• ' + gapText : ''}</p>
          </div>
          <svg class="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </div>
      </div>
    </a>`;
  },
};
