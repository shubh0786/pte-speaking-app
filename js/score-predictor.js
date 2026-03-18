/**
 * Crack PTE - Score Predictor
 * Estimates PTE Speaking communicative skill score (10-90)
 * based on practice history, weighted by question type importance
 */
window.PTE = window.PTE || {};

PTE.ScorePredictor = {
  // PTE Speaking contribution weights per question type (approximate %)
  TYPE_WEIGHTS: {
    'read-aloud':                 0.24,
    'repeat-sentence':            0.28,
    'describe-image':             0.14,
    'retell-lecture':             0.12,
    'answer-short-question':      0.05,
    'summarize-group-discussion': 0.10,
    'respond-to-situation':       0.07
  },

  predict() {
    const sessions = PTE.Store.getAll().sessions || [];
    const stats = PTE.Store.getStats();
    const types = Object.values(PTE.QUESTION_TYPES);

    if (sessions.length < 3) {
      return { ready: false, reason: 'Need at least 3 practice sessions for a prediction.' };
    }

    const typeScores = {};
    let totalWeight = 0;
    let coveredWeight = 0;
    let weightedSum = 0;
    const breakdown = [];

    types.forEach(type => {
      const w = this.TYPE_WEIGHTS[type.id] || 0.05;
      totalWeight += w;
      const typeSessions = sessions.filter(s => s.type === type.id);
      if (typeSessions.length === 0) {
        breakdown.push({
          type, weight: w, practiced: false,
          avgScore: 0, weightedScore: 0, sessions: 0, trend: 'none'
        });
        return;
      }

      const weightedAvg = this._weightedAverage(typeSessions.map(s => s.overallScore));
      const trend = this._trend(typeSessions.slice(0, 10).map(s => s.overallScore));
      const contribution = weightedAvg * w;

      coveredWeight += w;
      weightedSum += contribution;

      typeScores[type.id] = weightedAvg;
      breakdown.push({
        type, weight: w, practiced: true,
        avgScore: Math.round(weightedAvg),
        weightedScore: Math.round(contribution * 10) / 10,
        sessions: typeSessions.length,
        trend
      });
    });

    // Normalize to account for unpracticed types
    let predicted = coveredWeight > 0 ? weightedSum / coveredWeight : 0;

    // Apply confidence penalty if less than 4 types practiced
    const practicedCount = breakdown.filter(b => b.practiced).length;
    const confidencePct = Math.min(100, Math.round((practicedCount / types.length) * 80 + Math.min(sessions.length, 20)));
    if (practicedCount < 4) {
      predicted *= 0.9;
    }

    // Clamp to PTE range (10-90)
    predicted = Math.max(10, Math.min(90, Math.round(predicted)));

    // Score band description
    const band = this._getBand(predicted);

    // Improvement velocity (score change per week)
    const velocity = this._velocity(sessions);

    // Days until target (if user has a target)
    const targetData = this._getTargetInfo(predicted, velocity);

    return {
      ready: true,
      predicted,
      band,
      confidencePct,
      practicedCount,
      totalTypes: types.length,
      totalSessions: sessions.length,
      breakdown: breakdown.sort((a, b) => b.weight - a.weight),
      velocity,
      targetData
    };
  },

  _weightedAverage(scores) {
    if (scores.length === 0) return 0;
    // Recent scores weighted more heavily (exponential decay)
    let weightSum = 0;
    let valueSum = 0;
    scores.forEach((score, i) => {
      const weight = Math.pow(0.85, i); // most recent = index 0
      weightSum += weight;
      valueSum += score * weight;
    });
    return weightSum > 0 ? valueSum / weightSum : 0;
  },

  _trend(recentScores) {
    if (recentScores.length < 3) return 'insufficient';
    const reversed = [...recentScores].reverse();
    const firstHalf = reversed.slice(0, Math.floor(reversed.length / 2));
    const secondHalf = reversed.slice(Math.floor(reversed.length / 2));
    const avg1 = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const avg2 = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    const diff = avg2 - avg1;
    if (diff > 5) return 'improving';
    if (diff < -5) return 'declining';
    return 'stable';
  },

  _velocity(sessions) {
    if (sessions.length < 5) return null;
    const now = Date.now();
    const oneWeekAgo = now - 7 * 86400000;
    const twoWeeksAgo = now - 14 * 86400000;
    const thisWeek = sessions.filter(s => s.timestamp >= oneWeekAgo);
    const lastWeek = sessions.filter(s => s.timestamp >= twoWeeksAgo && s.timestamp < oneWeekAgo);
    if (thisWeek.length < 2 || lastWeek.length < 2) return null;
    const avgThis = thisWeek.reduce((a, b) => a + b.overallScore, 0) / thisWeek.length;
    const avgLast = lastWeek.reduce((a, b) => a + b.overallScore, 0) / lastWeek.length;
    return Math.round((avgThis - avgLast) * 10) / 10;
  },

  _getTargetInfo(predicted, velocity) {
    try {
      const planner = JSON.parse(localStorage.getItem('crackpte_planner') || '{}');
      if (!planner.targetScore) return null;
      const gap = planner.targetScore - predicted;
      if (gap <= 0) return { reached: true, target: planner.targetScore };
      const weeksNeeded = velocity && velocity > 0 ? Math.ceil(gap / velocity) : null;
      return {
        reached: false,
        target: planner.targetScore,
        gap,
        weeksNeeded,
        examDate: planner.examDate || null
      };
    } catch (e) { return null; }
  },

  _getBand(score) {
    if (score >= 79) return { label: 'Expert', color: '#10b981', emoji: '🏆', desc: 'You are scoring at an expert level. Keep maintaining this performance.' };
    if (score >= 65) return { label: 'Proficient', color: '#6366f1', emoji: '⭐', desc: 'Strong performance. Focus on weak areas to push into expert range.' };
    if (score >= 50) return { label: 'Competent', color: '#f59e0b', emoji: '📈', desc: 'Good foundation. Consistent practice on RS and RA will boost your score.' };
    if (score >= 36) return { label: 'Developing', color: '#f97316', emoji: '🔧', desc: 'Making progress. Focus on Repeat Sentence and Read Aloud for maximum impact.' };
    return { label: 'Beginner', color: '#ef4444', emoji: '🎯', desc: 'Just getting started. Daily practice will show rapid improvement.' };
  },

  renderPage() {
    const result = this.predict();

    if (!result.ready) {
      return `
      ${PTE.UI.navbar('score-predictor')}
      <main class="min-h-screen py-10 px-4">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-2xl font-semibold text-zinc-100 mb-2">Score Predictor</h1>
          <p class="text-sm text-zinc-500 mb-8">Estimates your PTE Speaking score based on practice data.</p>
          ${PTE.UI.emptyState('🔮', 'Not Enough Data', result.reason, 'Start Practicing', '#/practice')}
        </div>
      </main>`;
    }

    const r = result;
    const trendIcons = { improving: '📈', declining: '📉', stable: '➡️', insufficient: '•', none: '' };
    const trendColors = { improving: 'text-emerald-400', declining: 'text-rose-400', stable: 'text-zinc-400', insufficient: 'text-zinc-600', none: 'text-zinc-600' };

    let targetHtml = '';
    if (r.targetData) {
      if (r.targetData.reached) {
        targetHtml = `
        <div class="card rounded-xl p-5 mb-6 border-emerald-500/15">
          <div class="flex items-center gap-3">
            <span class="text-3xl">🎉</span>
            <div>
              <p class="text-sm font-semibold text-emerald-400">Target Reached!</p>
              <p class="text-xs text-zinc-500">Your predicted score meets your target of ${r.targetData.target}.</p>
            </div>
          </div>
        </div>`;
      } else {
        targetHtml = `
        <div class="card rounded-xl p-5 mb-6">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-semibold text-zinc-200">Target Progress</h3>
            <span class="text-xs font-mono text-amber-400">${r.targetData.gap} points to go</span>
          </div>
          <div class="h-2 bg-white/[0.04] rounded-full overflow-hidden mb-2">
            <div class="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-emerald-400 transition-all" style="width:${Math.min(100, (r.predicted / r.targetData.target) * 100)}%"></div>
          </div>
          <div class="flex justify-between text-[10px] text-zinc-600">
            <span>Current: ${r.predicted}</span>
            <span>Target: ${r.targetData.target}</span>
          </div>
          ${r.targetData.weeksNeeded ? `<p class="text-xs text-zinc-500 mt-2">At current pace, estimated <span class="text-[var(--accent-light)] font-semibold">${r.targetData.weeksNeeded} weeks</span> to reach target.</p>` : ''}
          ${r.targetData.examDate ? `<p class="text-[10px] text-zinc-600 mt-1">Exam date: ${r.targetData.examDate}</p>` : ''}
        </div>`;
      }
    }

    const breakdownRows = r.breakdown.map(b => {
      if (!b.practiced) {
        return `
        <div class="flex items-center gap-3 py-3 border-b border-[var(--border)] opacity-50">
          <span class="text-lg w-8 text-center">${b.type.icon}</span>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-zinc-400">${b.type.name}</p>
            <p class="text-[10px] text-zinc-600">Not practiced yet</p>
          </div>
          <span class="text-xs text-zinc-700 font-mono">${Math.round(b.weight * 100)}% weight</span>
          <a href="#/practice/${b.type.id}" class="text-[10px] font-semibold text-amber-400 px-2 py-1 rounded-md bg-amber-500/8 border border-amber-500/10">Start</a>
        </div>`;
      }
      return `
      <div class="flex items-center gap-3 py-3 border-b border-[var(--border)]">
        <span class="text-lg w-8 text-center">${b.type.icon}</span>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <p class="text-sm font-medium text-zinc-200">${b.type.name}</p>
            <span class="${trendColors[b.trend]} text-xs">${trendIcons[b.trend]}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex-1 h-1.5 bg-white/[0.04] rounded-full max-w-[160px]"><div class="h-full rounded-full" style="width:${(b.avgScore/90)*100}%;background:${b.type.color}"></div></div>
            <span class="text-[10px] text-zinc-500 font-mono">${b.avgScore}/90</span>
          </div>
        </div>
        <div class="text-right flex-shrink-0">
          <p class="text-xs font-semibold font-mono" style="color:${b.type.color}">${Math.round(b.weight * 100)}%</p>
          <p class="text-[10px] text-zinc-600">${b.sessions} tries</p>
        </div>
      </div>`;
    }).join('');

    return `
    ${PTE.UI.navbar('score-predictor')}
    <main class="min-h-screen py-10 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="mb-8">
          <h1 class="text-2xl font-semibold text-zinc-100 mb-1">Score Predictor</h1>
          <p class="text-sm text-zinc-500">Estimated PTE Speaking score based on ${r.totalSessions} practice sessions.</p>
        </div>

        <!-- Predicted Score -->
        <div class="card-elevated rounded-xl overflow-hidden mb-6">
          <div class="bg-gradient-to-r from-[#6d5cff] to-[#a78bfa] p-8 text-center">
            <p class="text-white/60 text-xs font-medium mb-2">Predicted PTE Speaking Score</p>
            <div class="relative inline-flex items-center justify-center mb-3">
              <svg class="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="6"/>
                <circle cx="60" cy="60" r="52" fill="none" stroke="white" stroke-width="6" stroke-linecap="round" stroke-dasharray="326.73" stroke-dashoffset="${326.73 * (1 - r.predicted / 90)}" class="score-circle-animate"/>
              </svg>
              <div class="absolute flex flex-col items-center">
                <span class="text-4xl font-bold text-white font-mono tabular-nums">${r.predicted}</span>
                <span class="text-xs text-white/40 font-mono">/90</span>
              </div>
            </div>
            <div class="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full">
              <span>${r.band.emoji}</span>
              <span class="text-white text-sm font-medium">${r.band.label}</span>
            </div>
            <p class="text-white/50 text-xs mt-3 max-w-sm mx-auto">${r.band.desc}</p>
          </div>
          <div class="p-5">
            <div class="grid grid-cols-3 gap-3 text-center">
              <div class="bg-white/[0.02] rounded-lg p-3">
                <p class="text-xl font-semibold font-mono text-[var(--accent-light)]">${r.confidencePct}%</p>
                <p class="text-[10px] text-zinc-500 mt-0.5">Confidence</p>
              </div>
              <div class="bg-white/[0.02] rounded-lg p-3">
                <p class="text-xl font-semibold font-mono text-emerald-400">${r.practicedCount}/${r.totalTypes}</p>
                <p class="text-[10px] text-zinc-500 mt-0.5">Types Covered</p>
              </div>
              <div class="bg-white/[0.02] rounded-lg p-3">
                <p class="text-xl font-semibold font-mono ${r.velocity !== null ? (r.velocity > 0 ? 'text-emerald-400' : r.velocity < 0 ? 'text-rose-400' : 'text-zinc-400') : 'text-zinc-600'}">${r.velocity !== null ? (r.velocity > 0 ? '+' : '') + r.velocity : '--'}</p>
                <p class="text-[10px] text-zinc-500 mt-0.5">Weekly Change</p>
              </div>
            </div>
            ${r.confidencePct < 60 ? `
            <div class="mt-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
              <p class="text-xs text-amber-400">Low confidence: Practice more question types to improve accuracy. Focus on <span class="font-semibold">${r.breakdown.filter(b => !b.practiced).map(b => b.type.shortName).join(', ')}</span>.</p>
            </div>` : ''}
          </div>
        </div>

        ${targetHtml}

        <!-- Type Breakdown -->
        <div class="card rounded-xl p-5 mb-6">
          <h3 class="text-sm font-semibold text-zinc-200 mb-1">Score Breakdown by Type</h3>
          <p class="text-[10px] text-zinc-600 mb-3">Weighted by each type's contribution to PTE Speaking score</p>
          <div>${breakdownRows}</div>
        </div>

        <!-- Tips -->
        <div class="card rounded-xl p-5">
          <h3 class="text-sm font-semibold text-zinc-200 mb-3">How to Improve</h3>
          <div class="space-y-2">
            ${this._getImprovementTips(r).map(tip => `
            <div class="flex items-start gap-3 p-3 bg-white/[0.02] rounded-lg">
              <span class="text-base flex-shrink-0">${tip.icon}</span>
              <div>
                <p class="text-xs font-medium text-zinc-200">${tip.title}</p>
                <p class="text-[10px] text-zinc-500">${tip.desc}</p>
              </div>
              ${tip.link ? `<a href="${tip.link}" class="text-[10px] font-semibold text-[var(--accent-light)] px-2 py-1 rounded-md bg-[var(--accent-surface)] border border-[rgba(109,92,255,0.12)] flex-shrink-0">Go</a>` : ''}
            </div>`).join('')}
          </div>
        </div>
      </div>
    </main>`;
  },

  _getImprovementTips(r) {
    const tips = [];
    const unpracticed = r.breakdown.filter(b => !b.practiced);
    const weak = r.breakdown.filter(b => b.practiced && b.avgScore < 50).sort((a, b) => a.avgScore - b.avgScore);
    const declining = r.breakdown.filter(b => b.trend === 'declining');

    if (unpracticed.length > 0) {
      tips.push({
        icon: '🎯',
        title: `Practice ${unpracticed.map(b => b.type.shortName).join(', ')}`,
        desc: `You haven't practiced ${unpracticed.length} question type${unpracticed.length > 1 ? 's' : ''}. Each type contributes to your overall score.`,
        link: '#/practice'
      });
    }
    if (weak.length > 0) {
      const top = weak[0];
      tips.push({
        icon: '🔧',
        title: `Improve ${top.type.name} (${top.avgScore}/90)`,
        desc: `This is your weakest area. Even a small improvement here will boost your predicted score significantly.`,
        link: `#/practice/${top.type.id}`
      });
    }
    if (declining.length > 0) {
      tips.push({
        icon: '⚠️',
        title: `${declining.map(b => b.type.shortName).join(', ')} scores declining`,
        desc: 'Review your technique and practice these types more consistently.'
      });
    }

    const rs = r.breakdown.find(b => b.type.id === 'repeat-sentence');
    if (rs && rs.practiced && rs.avgScore < 65) {
      tips.push({
        icon: '🔁',
        title: 'Focus on Repeat Sentence (28% of score)',
        desc: 'RS has the highest weight. Practice daily for the biggest score impact.',
        link: '#/practice/repeat-sentence'
      });
    }

    tips.push({
      icon: '📊',
      title: 'Take a Mock Test',
      desc: 'Mock tests simulate exam conditions and give the most realistic performance data.',
      link: '#/mock-test'
    });

    return tips.slice(0, 5);
  }
};
