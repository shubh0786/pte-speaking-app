/**
 * Crack PTE - Analytics Dashboard
 * SVG charts: score trends, heatmap, type breakdown, weakest areas
 */
window.PTE = window.PTE || {};

PTE.Analytics = {
  renderPage() {
    const sessions = PTE.Store.getAll().sessions || [];
    const stats = PTE.Store.getStats();
    const overall = stats.overall;
    const gp = PTE.Gamify ? PTE.Gamify.getProgress() : null;

    if (!overall || sessions.length === 0) {
      return `${PTE.UI.navbar('progress')}
      <main class="min-h-screen py-10 px-4"><div class="max-w-4xl mx-auto text-center py-20">
        <span class="text-5xl mb-4 block">📊</span>
        <h2 class="text-2xl font-semibold text-zinc-100 mb-2">No Data Yet</h2>
        <p class="text-zinc-500 mb-6">Complete some practice sessions to see your analytics.</p>
        <a href="#/practice" class="inline-flex items-center gap-2 bg-[var(--accent-surface)] text-[var(--accent-light)] font-semibold px-6 py-3 rounded-xl border border-[rgba(109,92,255,0.12)]">Start Practicing</a>
      </div></main>`;
    }

    // ── Score Trend Line Chart ──
    const recent = sessions.slice(0, 30).reverse();
    const trendChart = this._trendChart(recent);

    // ── Practice Heatmap ──
    const heatmap = this._heatmap(sessions);

    // ── Type Pie Chart ──
    const typePie = this._typePie(sessions);

    // ── Weakest Areas ──
    const weakest = this._weakestAreas(stats);

    // ── Badges ──
    const badgeSection = gp ? this._badges(gp) : '';

    return `
    ${PTE.UI.navbar('progress')}
    <main class="min-h-screen py-10 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-3xl font-semibold text-zinc-100">Analytics</h1>
          <button onclick="if(confirm('Clear all data?')){PTE.Store.clearAll();location.reload()}" class="text-xs text-zinc-600 hover:text-rose-400 transition-colors">Clear Data</button>
        </div>

        <!-- Stats Overview -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="card rounded-xl p-5 text-center"><p class="text-3xl font-semibold font-mono text-[var(--accent-light)]">${overall.totalAttempts}</p><p class="text-xs text-zinc-500 mt-1">Total Questions</p></div>
          <div class="card rounded-xl p-5 text-center"><p class="text-3xl font-semibold font-mono text-emerald-400">${overall.averageScore}</p><p class="text-xs text-zinc-500 mt-1">Avg Score</p></div>
          <div class="card rounded-xl p-5 text-center"><p class="text-3xl font-semibold font-mono text-purple-400">${overall.bestScore}</p><p class="text-xs text-zinc-500 mt-1">Best Score</p></div>
          <div class="card rounded-xl p-5 text-center"><p class="text-3xl font-semibold font-mono text-amber-400">${Math.round((overall.totalPracticeTime||0)/60)}m</p><p class="text-xs text-zinc-500 mt-1">Practice Time</p></div>
        </div>

        <!-- Score Trend -->
        <div class="card rounded-xl p-6 mb-6">
          <h3 class="font-semibold text-zinc-100 mb-4">Score Trend (Last 30 Sessions)</h3>
          ${trendChart}
        </div>

        <!-- Heatmap + Pie side by side -->
        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <div class="card rounded-xl p-6">
            <h3 class="font-semibold text-zinc-100 mb-4">Practice Heatmap</h3>
            ${heatmap}
          </div>
          <div class="card rounded-xl p-6">
            <h3 class="font-semibold text-zinc-100 mb-4">Time by Type</h3>
            ${typePie}
          </div>
        </div>

        <!-- Weakest Areas -->
        <div class="card rounded-xl p-6 mb-6">
          <h3 class="font-semibold text-zinc-100 mb-4">Weakest Areas</h3>
          ${weakest}
        </div>

        ${badgeSection}
      </div>
    </main>`;
  },

  _trendChart(sessions) {
    if (sessions.length < 2) return '<p class="text-zinc-600 text-sm">Need at least 2 sessions for a trend chart.</p>';
    const scores = sessions.map(s => s.overallScore);
    const max = Math.max(...scores, 1);
    const min = Math.min(...scores, 0);
    const range = max - min || 1;
    const w = 500, h = 120, pad = 30;

    const points = scores.map((s, i) => {
      const x = pad + (i / (scores.length - 1)) * (w - pad * 2);
      const y = h - pad - ((s - min) / range) * (h - pad * 2);
      return { x, y, s };
    });
    const line = points.map(p => `${p.x},${p.y}`).join(' ');
    const area = `${pad},${h-pad} ${line} ${w-pad},${h-pad}`;
    const dots = points.map(p => `<circle cx="${p.x}" cy="${p.y}" r="3" fill="#6366f1"/>`).join('');

    return `<svg viewBox="0 0 ${w} ${h}" class="w-full">
      <defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#6366f1" stop-opacity="0.3"/><stop offset="100%" stop-color="#6366f1" stop-opacity="0"/></linearGradient></defs>
      <polygon points="${area}" fill="url(#tg)"/>
      <polyline points="${line}" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round"/>
      ${dots}
      <text x="${pad}" y="${h-5}" font-size="10" fill="#6b7394" font-family="system-ui">Oldest</text>
      <text x="${w-pad}" y="${h-5}" font-size="10" fill="#6b7394" text-anchor="end" font-family="system-ui">Latest</text>
      <text x="${pad-5}" y="${pad}" font-size="10" fill="#6b7394" text-anchor="end" font-family="system-ui">${max}</text>
      <text x="${pad-5}" y="${h-pad}" font-size="10" fill="#6b7394" text-anchor="end" font-family="system-ui">${min}</text>
    </svg>`;
  },

  _heatmap(sessions) {
    // GitHub-style heatmap for last 12 weeks
    const weeks = 12;
    const today = new Date(); today.setHours(0,0,0,0);
    const startDate = new Date(today); startDate.setDate(startDate.getDate() - (weeks * 7 - 1));

    // Count sessions per day
    const dayCounts = {};
    sessions.forEach(s => {
      if (!s.timestamp) return;
      const d = new Date(s.timestamp); d.setHours(0,0,0,0);
      const key = d.toISOString().split('T')[0];
      dayCounts[key] = (dayCounts[key] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(dayCounts), 1);
    let cells = '';
    const cellSize = 14, gap = 3;
    for (let w = 0; w < weeks; w++) {
      for (let d = 0; d < 7; d++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + w * 7 + d);
        if (date > today) continue;
        const key = date.toISOString().split('T')[0];
        const count = dayCounts[key] || 0;
        const intensity = count > 0 ? Math.min(1, count / maxCount) : 0;
        const opacity = count === 0 ? 0.1 : 0.2 + intensity * 0.8;
        const x = w * (cellSize + gap);
        const y = d * (cellSize + gap);
        cells += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="3" fill="#6366f1" opacity="${opacity}"><title>${key}: ${count} sessions</title></rect>`;
      }
    }

    return `<svg viewBox="0 0 ${weeks*(cellSize+gap)} ${7*(cellSize+gap)}" class="w-full" style="max-width:300px">${cells}</svg>
    <div class="flex items-center gap-2 mt-2 text-xs text-zinc-600"><span>Less</span>
      ${[0.1,0.3,0.5,0.7,1].map(o => `<span class="w-3 h-3 rounded" style="background:#6366f1;opacity:${o}"></span>`).join('')}
    <span>More</span></div>`;
  },

  _typePie(sessions) {
    const counts = {};
    sessions.forEach(s => { counts[s.type] = (counts[s.type] || 0) + 1; });
    const types = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const total = sessions.length;
    if (types.length === 0) return '<p class="text-zinc-600 text-sm">No data</p>';

    const colors = ['#6366f1','#22d3ee','#10b981','#f59e0b','#ef4444','#a855f7','#ec4899'];
    let legend = '';
    types.forEach(([type, count], i) => {
      const tc = Object.values(PTE.QUESTION_TYPES).find(t => t.id === type);
      const pct = Math.round((count / total) * 100);
      legend += `<div class="flex items-center gap-2"><span class="w-3 h-3 rounded" style="background:${colors[i%colors.length]}"></span><span class="text-xs text-zinc-400">${tc ? tc.shortName : type} ${pct}%</span></div>`;
    });

    // Simple horizontal bar instead of pie for simplicity
    const bars = types.map(([type, count], i) => {
      const pct = (count / total) * 100;
      return `<div class="h-4 rounded-full" style="width:${pct}%;background:${colors[i%colors.length]};min-width:4px" title="${type}: ${count}"></div>`;
    }).join('');

    return `<div class="flex rounded-full overflow-hidden gap-0.5 mb-3">${bars}</div><div class="grid grid-cols-2 gap-1">${legend}</div>`;
  },

  _weakestAreas(stats) {
    const types = Object.values(PTE.QUESTION_TYPES);
    const weak = [];
    types.forEach(t => {
      const s = stats[t.id];
      if (s && s.averageScore < 60) weak.push({ type: t, avg: s.averageScore, attempts: s.totalAttempts });
    });
    weak.sort((a, b) => a.avg - b.avg);

    if (weak.length === 0) return '<p class="text-emerald-400 text-sm">No weak areas detected. Keep up the great work!</p>';

    return weak.map(w => `
      <div class="flex items-center gap-3 py-3 border-b border-[var(--border)]">
        <span class="text-lg">${w.type.icon}</span>
        <div class="flex-1">
          <p class="text-sm font-medium text-zinc-100">${w.type.name}</p>
          <div class="flex items-center gap-2 mt-1">
            <div class="flex-1 h-2 bg-white/[0.02] rounded-full max-w-[200px]"><div class="h-full rounded-full bg-rose-500" style="width:${(w.avg/90)*100}%"></div></div>
            <span class="text-xs text-rose-400 font-semibold font-mono">${w.avg}/90</span>
          </div>
        </div>
        <a href="#/practice/${w.type.id}" class="text-xs font-semibold text-[var(--accent-light)] px-3 py-1.5 rounded-lg bg-[var(--accent-surface)] border border-[rgba(109,92,255,0.12)] hover:bg-[var(--accent-surface)] transition-all">Practice</a>
      </div>
    `).join('');
  },

  _badges(gp) {
    const all = gp.allBadges || [];
    const earned = new Set((gp.badges || []).map(b => b.id));
    const rows = all.map(b => `
      <div class="flex items-center gap-3 p-3 rounded-xl ${earned.has(b.id) ? 'card border border-[rgba(109,92,255,0.12)]' : 'opacity-40'}">
        <span class="text-2xl">${b.icon}</span>
        <div class="flex-1">
          <p class="text-sm font-semibold ${earned.has(b.id) ? 'text-zinc-100' : 'text-zinc-600'}">${b.name}</p>
          <p class="text-xs text-zinc-600">${b.desc}</p>
        </div>
        ${earned.has(b.id) ? '<span class="text-emerald-400 text-sm">✅</span>' : '<span class="text-zinc-700 text-xs">Locked</span>'}
      </div>
    `).join('');

    return `<div class="card rounded-xl p-6 mb-6">
      <h3 class="font-semibold text-zinc-100 mb-4">Badges (${gp.badges.length}/${all.length})</h3>
      <div class="grid sm:grid-cols-2 gap-2">${rows}</div>
    </div>`;
  }
};
